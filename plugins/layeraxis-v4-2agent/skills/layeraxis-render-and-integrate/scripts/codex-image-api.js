#!/usr/bin/env node

/**
 * codex-image-api.js
 * 单张图片生成的原子操作脚本（codex 引擎）
 * 通过 `codex exec` 驱动 Codex CLI 内置的 image_gen 工具（gpt-image 系）生成图片
 *
 * 与 gemini-image-api.js 同构：相同 CLI 接口、相同单行 JSON 输出契约，
 * 因此对 extract-and-generate.js 而言两个引擎脚本可互换。
 *
 * 用法:
 *   node codex-image-api.js \
 *     --prompt "英文提示词" \
 *     --negative "负面提示词" \
 *     --aspect "16:9" \
 *     --model "codex" \
 *     --timeout 300000 \
 *     --output "path/to/output.png"
 *
 * 前提:
 *   - 本机已安装 codex CLI 且已登录（ChatGPT 或 API 鉴权）
 *
 * 设计取舍见 docs/superpowers/specs/2026-06-02-codex-image-engine-design.md
 */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

const SUPPORTED_ASPECT_RATIOS = new Set(["1:1", "3:4", "4:3", "9:16", "16:9", "2.35:1", "2:3", "3:2"]);
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
// 路径会被原样插入发给 `codex exec` 的指令文本中，含 shell 元字符的路径
// 可能被 agent 的 shell 误读。提前拒绝，而非寄望 agent 正确转义。
const SHELL_METACHAR = /[;|&`$<>\n\r()'"]/;

// --- 参数解析 ---
function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    switch (argv[i]) {
      case "--prompt":
      case "-p":
        args.prompt = argv[++i];
        break;
      case "--negative":
        args.negative = argv[++i];
        break;
      case "--aspect":
      case "--aspect-ratio":
        args.aspect = argv[++i];
        break;
      // --size / --quality 在 codex 引擎下无对应原生参数，接受但忽略，
      // 仅为与 gemini-image-api.js 命令行兼容（aspect 已决定构图）。
      case "--size":
      case "--image-size":
      case "--quality":
        args.size = argv[++i];
        break;
      case "--model":
      case "-m":
        args.model = argv[++i];
        break;
      case "--timeout":
        args.timeout = argv[++i];
        break;
      case "--output":
      case "-o":
        args.output = argv[++i];
        break;
    }
  }
  return args;
}

function normalizeAspectRatio(value) {
  if (!value) return "16:9";
  const normalized = String(value).trim();
  if (SUPPORTED_ASPECT_RATIOS.has(normalized)) return normalized;
  throw new Error(
    `Invalid aspect ratio: ${value}. Supported: ${Array.from(SUPPORTED_ASPECT_RATIOS).join(", ")}`
  );
}

function normalizeTimeout(value) {
  if (value === undefined) return 300000;
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error(`Invalid timeout: ${value}. Must be a positive number of milliseconds`);
  }
  return n;
}

function assertSafePath(label, value) {
  if (SHELL_METACHAR.test(value)) {
    throw new Error(
      `${label} contains shell metacharacters and is unsafe to interpolate into the codex instruction: ${value}`
    );
  }
}

function codexHome() {
  return process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
}

// --- 指令构造 ---
function buildInstruction(prompt, negative, aspect, outputPath) {
  const negativeHint = negative ? `\n\nAVOID (do not depict): ${negative}` : "";
  return `You have an internal tool called image_gen for image generation. Use it.

TASK: Generate an image with the spec below, then save it to disk.

PROMPT:
${prompt}${negativeHint}

ASPECT RATIO: ${aspect}
OUTPUT PATH: ${outputPath}

STEPS:
1. Call image_gen with the prompt and aspect ratio above. Let image_gen pick a size that is compliant with the aspect ratio — do NOT force exact pixel dimensions.
2. Move or copy the resulting image from Codex default location ($CODEX_HOME/generated_images/...) to: ${outputPath}
3. Verify with: ls -la ${outputPath}
4. Reply with ONLY this JSON line (no markdown fences, no other text):
   {"status":"ok","path":"${outputPath}","bytes":<file_size_in_bytes>}

HARD CONSTRAINTS:
- Use ONLY the image_gen internal tool to produce pixels.
- Do NOT use curl, wget, Python, or any external API.
- Do NOT use bash to fabricate an image.
- Do NOT post-process the image: no sips, no resize, no crop, no format conversion. Save the raw image_gen output as-is.`;
}

// --- codex exec 事件流解析 ---
function parseEventStream(raw) {
  const lines = raw.split("\n").filter((l) => l.trim().length > 0);
  let threadId = null;
  let usage = null;
  const toolCalls = [];

  for (const line of lines) {
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      continue;
    }
    const type = event && event.type;
    if (type === "thread.started") {
      threadId = event.thread_id || null;
    } else if (type === "item.started" || type === "item.completed") {
      const item = event.item;
      if (!item || !item.id) continue;
      toolCalls.push({
        tool: deriveToolName(item),
        status: item.status || (type === "item.completed" ? "completed" : "in_progress"),
        command: item.command,
      });
    } else if (type === "turn.completed") {
      const u = event.usage;
      if (u) {
        usage = {
          input: u.input_tokens || 0,
          cached_input: u.cached_input_tokens || 0,
          output: u.output_tokens || 0,
          reasoning: u.reasoning_output_tokens || 0,
        };
      }
    }
  }

  return { threadId, usage, toolCalls };
}

function deriveToolName(item) {
  if (item.type === "command_execution") return "shell";
  if (item.type === "agent_message") return "agent_message";
  if (item.type === "image_gen" || item.type === "image_generation") return "image_gen";
  if (typeof item.tool === "string") return item.tool;
  return item.type || "unknown";
}

// --- 校验 ---
// 找出本次 thread 在 codex 默认产出区生成的 PNG（多张时取最新）。
// 这是 wrapper 自己接管「交接」的依据：不依赖 codex agent 去 cp。
function findGeneratedPng(threadId) {
  if (!threadId) return null;
  const dir = path.join(codexHome(), "generated_images", threadId);
  try {
    const pngs = fs
      .readdirSync(dir)
      .filter((e) => e.toLowerCase().endsWith(".png"))
      .map((e) => path.join(dir, e));
    if (pngs.length === 0) return null;
    pngs.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
    return pngs[0];
  } catch {
    return null;
  }
}

function findCpToTarget(toolCalls, target) {
  const base = path.basename(target);
  return toolCalls.some(
    (tc) =>
      tc.tool === "shell" &&
      typeof tc.command === "string" &&
      (tc.command.includes(target) || tc.command.includes(base)) &&
      /\b(cp|mv|cat)\b/.test(tc.command) &&
      tc.command.includes("generated_images")
  );
}

function verifyOutput(outputPath) {
  let stat;
  try {
    stat = fs.statSync(outputPath);
  } catch {
    const err = new Error(`Output file not created: ${outputPath}`);
    err.kind = "output_missing";
    throw err;
  }
  if (stat.size < 1000) {
    const err = new Error(`Output file too small (${stat.size} bytes)`);
    err.kind = "invalid_png";
    throw err;
  }
  const fd = fs.openSync(outputPath, "r");
  try {
    const head = Buffer.alloc(8);
    fs.readSync(fd, head, 0, 8, 0);
    if (!head.equals(PNG_MAGIC)) {
      const err = new Error("Output is not a valid PNG (magic mismatch)");
      err.kind = "invalid_png";
      throw err;
    }
  } finally {
    fs.closeSync(fd);
  }
  return { bytes: stat.size };
}

// --- codex exec 调用 ---
function runCodexExec(instruction, timeoutMs) {
  return new Promise((resolve, reject) => {
    // --skip-git-repo-check: 允许从非 git 目录运行（如 ~/.claude/plugins/... 下的 skill）。
    const cliArgs = [
      "exec",
      "--json",
      "--sandbox",
      "danger-full-access",
      "--skip-git-repo-check",
      "-",
    ];

    let child;
    try {
      child = spawn("codex", cliArgs, { stdio: ["pipe", "pipe", "pipe"] });
    } catch (e) {
      const err = new Error(`Failed to spawn codex: ${e.message}`);
      err.kind = "spawn_failed";
      reject(err);
      return;
    }

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    child.stdout.on("data", (chunk) => (stdout += chunk.toString()));
    child.stderr.on("data", (chunk) => (stderr += chunk.toString()));

    child.on("error", (e) => {
      if (e.code === "ENOENT") {
        const err = new Error("codex CLI not installed (command not found)");
        err.kind = "codex_not_installed";
        reject(err);
        return;
      }
      const err = new Error(`codex spawn error: ${e.message}`);
      err.kind = "spawn_failed";
      reject(err);
    });

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
      setTimeout(() => child.kill("SIGKILL"), 2000);
    }, timeoutMs);

    child.on("close", (code, signal) => {
      clearTimeout(timer);
      if (timedOut) {
        const err = new Error(`codex exec exceeded ${timeoutMs}ms`);
        err.kind = "timeout";
        reject(err);
        return;
      }
      if (code !== 0) {
        if (stderr.includes("command not found") || stderr.includes("not found: codex")) {
          const err = new Error("codex CLI not installed");
          err.kind = "codex_not_installed";
          reject(err);
          return;
        }
        const err = new Error(
          `codex exec exited ${code} signal=${signal}: ${stderr.trim().slice(0, 500)}`
        );
        err.kind = "spawn_failed";
        reject(err);
        return;
      }
      resolve(parseEventStream(stdout));
    });

    // 指令走 stdin 后立即 end()，避免 codex 在非交互场景等待 TTY 输入而 hang。
    child.stdin.write(instruction);
    child.stdin.end();
  });
}

// --- 主流程 ---
async function main() {
  const startEpoch = Date.now();
  let args;
  let aspect;
  let timeoutMs;
  try {
    args = parseArgs(process.argv);
    aspect = normalizeAspectRatio(args.aspect);
    timeoutMs = normalizeTimeout(args.timeout);
  } catch (error) {
    fail(error.message, "invalid_args");
    return;
  }

  if (!args.prompt) return fail("Missing --prompt", "invalid_args");
  if (!args.output) return fail("Missing --output", "invalid_args");

  const outputPath = path.resolve(args.output);
  try {
    assertSafePath("--output path", outputPath);
  } catch (error) {
    return fail(error.message, "invalid_args");
  }

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const instruction = buildInstruction(args.prompt, args.negative, aspect, outputPath);

  try {
    const run = await runCodexExec(instruction, timeoutMs);

    if (!run.threadId) {
      const err = new Error("No thread id in codex event stream");
      err.kind = "agent_refused";
      throw err;
    }

    // 交接由 wrapper 接管（确定性），不依赖 codex agent 自己 cp：
    // 若 thread 在 generated_images 留下了 PNG，就由我们把它拷到 --output。
    // agent 的 cp 仅作兜底（generated_images 找不到、但 agent 已自行落到目标）。
    const genPng = findGeneratedPng(run.threadId);
    let handoff;
    if (genPng) {
      fs.copyFileSync(genPng, outputPath);
      handoff = "wrapper";
    } else if (fs.existsSync(outputPath) || findCpToTarget(run.toolCalls, outputPath)) {
      handoff = "agent";
    } else {
      const err = new Error(
        `image_gen produced no PNG in generated_images/${run.threadId} and agent did not cp to target`
      );
      err.kind = "no_image_gen_tool_use";
      throw err;
    }

    const { bytes } = verifyOutput(outputPath);

    const result = {
      success: true,
      image_path: outputPath,
      image_paths: [outputPath],
      generation_params: {
        model: args.model || "codex",
        engine: "codex",
        aspect_ratio: aspect,
        thread_id: run.threadId,
        handoff,
        bytes,
        elapsed_seconds: Math.round((Date.now() - startEpoch) / 1000),
        usage: run.usage || null,
      },
      timestamp: new Date().toISOString(),
    };
    console.log(JSON.stringify(result));
    process.exit(0);
  } catch (error) {
    fail(error.message, error.kind || "spawn_failed");
  }
}

function fail(message, kind) {
  console.error(
    JSON.stringify({
      success: false,
      error: message,
      error_kind: kind || "spawn_failed",
      timestamp: new Date().toISOString(),
    })
  );
  process.exit(1);
}

main();
