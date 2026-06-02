#!/usr/bin/env node

/**
 * extract-and-generate.js
 * 批量读取纯提示词 Markdown，并按 plan.lock.yaml 全局参数生成图片
 *
 * 用法:
 *   node extract-and-generate.js \
 *     --input "imgs-spec/" \
 *     --output "imgs-spec/" \
 *     --lock "imgs-spec/plan.lock.yaml"
 *
 * 功能:
 *   - 扫描目录下所有 NN-*.md 文件（outline.md 除外）
 *   - 将 Markdown 正文作为英文提示词（如存在 frontmatter，会自动剥离）
 *   - 从 plan.lock.yaml 读取全局生成参数（model/aspect_ratio/image_size）
 *   - 调用 gemini-image-api.js 生成图片
 *   - 失败时重试一次
 *   - 生成摘要报告 generation-summary.json
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    switch (argv[i]) {
      case "--input":
        args.input = argv[++i];
        break;
      case "--output":
        args.output = argv[++i];
        break;
      case "--lock":
        args.lock = argv[++i];
        break;
    }
  }
  return args;
}

function parseValue(value) {
  const trimmed = String(value).trim();
  if (!trimmed) return "";
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+$/.test(trimmed)) return Number.parseInt(trimmed, 10);
  if (/^-?\d+\.\d+$/.test(trimmed)) return Number.parseFloat(trimmed);
  return trimmed;
}

function parseSimpleYaml(yamlText) {
  const root = {};
  const stack = [{ indent: -1, obj: root }];

  for (const line of yamlText.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;

    const indent = line.match(/^\s*/)[0].length;
    const kv = line.trim().match(/^([^:]+):\s*(.*)$/);
    if (!kv) continue;

    const key = kv[1].trim();
    const rawValue = kv[2];

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const current = stack[stack.length - 1].obj;
    if (rawValue === "") {
      current[key] = {};
      stack.push({ indent, obj: current[key] });
    } else {
      current[key] = parseValue(rawValue);
    }
  }

  return root;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: null, body: content };
  return { frontmatter: parseSimpleYaml(match[1]), body: match[2] };
}

function findEnvFilesUpward(startDir) {
  const files = [];
  let current = path.resolve(startDir);
  let prev = "";
  while (current !== prev) {
    files.push(path.join(current, ".env"));
    prev = current;
    current = path.dirname(current);
  }
  return files;
}

function extractEnglishPrompt(body) {
  // Extract content after "## English Prompt" heading (new format)
  const sectionMatch = body.match(/^## English Prompt\s*\n([\s\S]*)$/m);
  if (sectionMatch) {
    // Take everything after the heading, stop at next ## heading if any
    const afterHeading = sectionMatch[1];
    const nextSection = afterHeading.match(/\n## /);
    const promptText = nextSection
      ? afterHeading.slice(0, nextSection.index)
      : afterHeading;
    return promptText.trim();
  }
  // Fallback: no section heading found, use entire body (legacy format)
  return body.trim();
}

function loadEnvFile() {
  if (process.env.GOOGLE_API_KEY) return;

  const skillDir = path.resolve(path.dirname(__filename_resolved), "..");
  const envPathSet = new Set([
    path.join(skillDir, ".env"),
    ...findEnvFilesUpward(process.cwd()),
    ...findEnvFilesUpward(skillDir),
  ]);
  const envPaths = Array.from(envPathSet);

  for (const envPath of envPaths) {
    if (!fs.existsSync(envPath)) continue;

    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;

      const key = trimmed.slice(0, eqIndex).trim().replace(/^export\s+/, "");
      let value = trimmed.slice(eqIndex + 1).trim();
      const quoted = (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"));
      if (quoted) {
        value = value.slice(1, -1);
      } else {
        value = value.split(/\s+#/)[0].trim();
      }
      if (!process.env[key]) process.env[key] = value;
    }
    if (process.env.GOOGLE_API_KEY) break;
  }
}

// Gemini 引擎才需要 GOOGLE_API_KEY；codex 引擎依赖本机 codex CLI 登录态。
function requireGeminiKey() {
  if (process.env.GOOGLE_API_KEY) return;
  console.error("Error: Missing GOOGLE_API_KEY for the gemini engine.");
  console.error("Checked .env in current/parent directories and skill directory.");
  console.error("Set it via environment variable or create a .env file with:");
  console.error("  GOOGLE_API_KEY=your_key");
  console.error("(Or set plan.lock.yaml generation.model to codex to use the codex engine.)");
  process.exit(1);
}

function resolveLockPath(inputDir, lockArg) {
  if (lockArg) return path.resolve(lockArg);
  return path.join(path.resolve(inputDir), "plan.lock.yaml");
}

function loadPlanLock(inputDir, lockArg) {
  const lockPath = resolveLockPath(inputDir, lockArg);
  if (!fs.existsSync(lockPath)) {
    console.error(`Error: plan lock not found: ${lockPath}`);
    console.error("Create plan.lock.yaml with generation.model/aspect_ratio/image_size first.");
    process.exit(1);
  }

  const lockText = fs.readFileSync(lockPath, "utf-8");
  const lock = parseSimpleYaml(lockText);
  const generation = lock.generation || {};

  const model = generation.model || lock.model || "gemini";
  const aspect = generation.aspect_ratio || generation.aspectRatio || lock.aspect_ratio || "16:9";
  const quality =
    generation.image_size ||
    generation.imageSize ||
    generation.quality ||
    lock.image_size ||
    lock.quality ||
    "2K";
  const negative = lock.negative_prompt || lock.negativePrompt || "";

  return {
    lockPath,
    lock,
    generation: {
      model,
      aspect,
      quality,
      negative,
    },
  };
}

function loadPromptFiles(inputDir) {
  const absDir = path.resolve(inputDir);
  if (!fs.existsSync(absDir)) {
    console.error(`Error: Input directory not found: ${absDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(absDir)
    .filter((filename) => /^\d{2}-.*\.md$/.test(filename) && filename !== "outline.md")
    .sort();

  return files.map((filename) => {
    const filepath = path.join(absDir, filename);
    const raw = fs.readFileSync(filepath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(raw);
    const prompt = extractEnglishPrompt(body);
    const slug = filename.replace(/\.md$/i, "");

    return {
      id: (frontmatter && frontmatter.illustration_id) || slug.match(/^\d{2}/)?.[0] || "00",
      filename,
      filepath,
      slug,
      prompt,
      negativePrompt: (frontmatter && frontmatter.negative_prompt) || "",
      hasFrontmatter: Boolean(frontmatter),
    };
  });
}

const GEMINI_TIMEOUT_MS = 180000;
const CODEX_TIMEOUT_MS = 300000;

// 引擎路由：按 plan.lock.yaml 的 generation.model 决定走哪个原子脚本。
// model = codex / codex-* / gpt-image-*  → codex exec 引擎
// 其余（gemini / gemini-* / 默认）        → Gemini API 引擎
function resolveEngine(model) {
  const m = String(model || "").trim().toLowerCase();
  if (m === "codex" || m.startsWith("codex") || m.startsWith("gpt-image")) {
    return { engine: "codex", script: "codex-image-api.js", timeoutMs: CODEX_TIMEOUT_MS };
  }
  return { engine: "gemini", script: "gemini-image-api.js", timeoutMs: GEMINI_TIMEOUT_MS };
}

function buildGenerateCommand(apiScript, promptFile, outputPath, generation, engine) {
  const negative = promptFile.negativePrompt || generation.negative;
  const parts = [
    "node",
    JSON.stringify(apiScript),
    "--prompt",
    JSON.stringify(promptFile.prompt),
    negative ? `--negative ${JSON.stringify(negative)}` : "",
    "--aspect",
    JSON.stringify(generation.aspect),
    "--model",
    JSON.stringify(generation.model),
    "--output",
    JSON.stringify(outputPath),
  ];
  // Gemini 有 image-size/quality 旋钮；codex 由 aspect 决定尺寸，无对应参数。
  if (engine.engine === "gemini") {
    parts.push("--quality", JSON.stringify(generation.quality));
  }
  // codex 单张耗时长，把内部超时传给原子脚本（execSync 再留缓冲）。
  if (engine.engine === "codex") {
    parts.push("--timeout", String(engine.timeoutMs));
  }
  return parts.filter(Boolean).join(" ");
}

function generateSingleImage(promptFile, outputDir, generation) {
  const scriptDir = path.dirname(__filename || __dirname);
  const engine = resolveEngine(generation.model);
  const apiScript = path.join(scriptDir, engine.script);
  const outputPath = path.join(path.resolve(outputDir), `${promptFile.slug}.png`);

  if (!promptFile.prompt) {
    return { success: false, error: "Empty prompt body in markdown" };
  }

  const cmd = buildGenerateCommand(apiScript, promptFile, outputPath, generation, engine);

  try {
    const result = execSync(cmd, {
      // 给原子脚本的内部超时留 30s 缓冲，让内部超时先以干净错误退出。
      timeout: engine.timeoutMs + 30000,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    const parsed = JSON.parse(result.trim());
    return { success: true, image_path: outputPath, ...parsed };
  } catch (error) {
    const stderr = error.stderr || error.message;
    return { success: false, error: stderr };
  }
}

function main() {
  loadEnvFile();

  const args = parseArgs(process.argv);
  if (!args.input) {
    console.error("Error: Missing --input parameter");
    process.exit(1);
  }
  if (!args.output) {
    console.error("Error: Missing --output parameter");
    process.exit(1);
  }

  const outputDir = path.resolve(args.output);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const lockInfo = loadPlanLock(args.input, args.lock);
  const promptFiles = loadPromptFiles(args.input);
  if (promptFiles.length === 0) {
    console.error("No markdown prompt files found in input directory");
    process.exit(1);
  }

  const engineInfo = resolveEngine(lockInfo.generation.model);
  if (engineInfo.engine === "gemini") {
    requireGeminiKey();
  }
  console.log(`Using plan lock: ${lockInfo.lockPath}`);
  console.log(
    `Generation config: engine=${engineInfo.engine}, model=${lockInfo.generation.model}, aspect=${lockInfo.generation.aspect}, size=${lockInfo.generation.quality}`
  );
  console.log(`Processing ${promptFiles.length} illustrations...`);
  console.log("");

  let succeeded = 0;
  let failed = 0;
  const results = [];

  for (let index = 0; index < promptFiles.length; index++) {
    const promptFile = promptFiles[index];
    process.stdout.write(`[${index + 1}/${promptFiles.length}] ${promptFile.filename} → `);

    if (promptFile.hasFrontmatter) {
      process.stdout.write("legacy-frontmatter-detected → ");
    }

    let result = generateSingleImage(promptFile, outputDir, lockInfo.generation);
    if (!result.success) {
      process.stdout.write("retry → ");
      result = generateSingleImage(promptFile, outputDir, lockInfo.generation);
    }

    if (result.success) {
      console.log("✓ generated");
      succeeded++;
    } else {
      console.log(`✗ failed: ${result.error}`);
      failed++;
    }

    results.push({
      id: promptFile.id,
      filename: promptFile.filename,
      prompt_file: promptFile.filepath,
      success: result.success,
      image_path: result.image_path || null,
      error: result.error || null,
    });
  }

  console.log("");
  console.log(`Summary: ${succeeded} succeeded, ${failed} failed`);

  const summary = {
    plan_lock: lockInfo.lockPath,
    generation: lockInfo.generation,
    total: promptFiles.length,
    succeeded,
    failed,
    results,
  };

  const summaryPath = path.join(outputDir, "generation-summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), "utf-8");

  if (failed > 0) {
    console.log("");
    console.log("Failed items:");
    for (const result of results.filter((item) => !item.success)) {
      console.log(`  - ${result.filename}: ${result.error}`);
    }
  }

  process.exit(failed > 0 ? 1 : 0);
}

const __filename_resolved = typeof __filename !== "undefined" ? __filename : process.argv[1];
main();
