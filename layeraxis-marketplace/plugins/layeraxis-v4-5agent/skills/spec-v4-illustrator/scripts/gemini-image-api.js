#!/usr/bin/env node

/**
 * gemini-image-api.js
 * 单张图片生成的原子操作脚本
 * 调用 Google Gemini Imagen API 生成图片
 *
 * 用法:
 *   node gemini-image-api.js \
 *     --prompt "英文提示词" \
 *     --negative "负面提示词" \
 *     --aspect "16:9" \
 *     --size "2K" \
 *     --quality "2k" \
 *     --model "gemini-3-pro-image-preview" \
 *     --output "path/to/output.png"
 *
 * 环境变量:
 *   GOOGLE_API_KEY - Google API key
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const SUPPORTED_ASPECT_RATIOS = new Set(["1:1", "3:4", "4:3", "9:16", "16:9"]);
const SUPPORTED_IMAGE_SIZES = new Set(["1K", "2K", "4K"]);

function normalizeImageSize(value) {
  if (!value) return "2K";
  const normalized = String(value).trim().toUpperCase();
  if (SUPPORTED_IMAGE_SIZES.has(normalized)) return normalized;
  throw new Error(`Invalid image size: ${value}. Supported: 1K, 2K, 4K`);
}

function normalizeAspectRatio(value) {
  if (!value) return "16:9";
  const normalized = String(value).trim();
  if (SUPPORTED_ASPECT_RATIOS.has(normalized)) return normalized;
  throw new Error(`Invalid aspect ratio: ${value}. Supported: 1:1, 3:4, 4:3, 9:16, 16:9`);
}

function normalizeModel(value) {
  if (!value || value === "gemini") return "gemini-3-pro-image-preview";
  return String(value).trim();
}

function parseDimensions(value) {
  if (!value) return {};
  const matched = String(value).trim().match(/^(\d+)\s*[xX]\s*(\d+)$/);
  if (!matched) {
    throw new Error(`Invalid dimensions: ${value}. Use WIDTHxHEIGHT, e.g. 2048x1152`);
  }

  const width = Number(matched[1]);
  const height = Number(matched[2]);
  if (!width || !height) {
    throw new Error(`Invalid dimensions: ${value}. WIDTH and HEIGHT must be > 0`);
  }

  const ratio = width / height;
  const candidates = [
    { aspect: "1:1", ratio: 1, width: 4096, height: 4096 },
    { aspect: "3:4", ratio: 3 / 4, width: 3072, height: 4096 },
    { aspect: "4:3", ratio: 4 / 3, width: 4096, height: 3072 },
    { aspect: "9:16", ratio: 9 / 16, width: 2304, height: 4096 },
    { aspect: "16:9", ratio: 16 / 9, width: 4096, height: 2304 },
  ];

  let best = candidates[0];
  let bestDiff = Math.abs(ratio - best.ratio);
  for (const candidate of candidates) {
    const diff = Math.abs(ratio - candidate.ratio);
    if (diff < bestDiff) {
      best = candidate;
      bestDiff = diff;
    }
  }

  const longerSide = Math.max(width, height);
  let imageSize = "1K";
  if (longerSide > 1200 && longerSide <= 2500) imageSize = "2K";
  if (longerSide > 2500) imageSize = "4K";

  return { aspectRatio: best.aspect, imageSize };
}

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
      case "--size":
      case "--image-size":
        args.size = argv[++i];
        break;
      case "--quality":
        args.quality = argv[++i];
        break;
      case "--dimensions":
        args.dimensions = argv[++i];
        break;
      case "--model":
      case "-m":
        args.model = argv[++i];
        break;
      case "--output":
      case "-o":
        args.output = argv[++i];
        break;
    }
  }
  return args;
}

function resolveGenerationParams(args) {
  const parsedFromDimensions = parseDimensions(args.dimensions);
  return {
    model: normalizeModel(args.model),
    aspectRatio: normalizeAspectRatio(parsedFromDimensions.aspectRatio || args.aspect),
    imageSize: normalizeImageSize(args.size || args.quality || parsedFromDimensions.imageSize),
  };
}

// --- API 调用 ---
async function generateImage(prompt, negativePrompt, options, apiKey) {
  const imageConfig = {
    aspectRatio: options.aspectRatio,
    imageSize: options.imageSize,
  };

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: prompt + (negativePrompt ? `\n\nNegative: ${negativePrompt}` : ""),
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig,
    },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${options.model}:generateContent?key=${apiKey}`;

  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 120000,
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const response = JSON.parse(data);

          if (response.error) {
            reject(new Error(`API error: ${response.error.message}`));
            return;
          }

          const candidates = response.candidates;
          if (!candidates || candidates.length === 0) {
            reject(new Error("No candidates in response"));
            return;
          }

          const parts = candidates[0].content?.parts;
          if (!parts) {
            reject(new Error("No parts in response"));
            return;
          }

          const images = [];
          for (const part of parts) {
            if (part.inlineData && part.inlineData.mimeType?.startsWith("image/")) {
              images.push(Buffer.from(part.inlineData.data, "base64"));
            }
          }

          if (images.length === 0) {
            reject(new Error("No image data in response"));
            return;
          }

          resolve(images);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout (120s)"));
    });

    req.write(JSON.stringify(requestBody));
    req.end();
  });
}

// --- 主流程 ---
async function main() {
  let args;
  let generationOptions;
  try {
    args = parseArgs(process.argv);
    generationOptions = resolveGenerationParams(args);
  } catch (error) {
    console.error(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    );
    process.exit(1);
  }

  // 参数检查
  if (!args.prompt) {
    console.error(JSON.stringify({ success: false, error: "Missing --prompt" }));
    process.exit(1);
  }
  if (!args.output) {
    console.error(JSON.stringify({ success: false, error: "Missing --output" }));
    process.exit(1);
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error(
      JSON.stringify({
        success: false,
        error: "Missing GOOGLE_API_KEY environment variable",
      })
    );
    process.exit(1);
  }

  const outputPath = path.resolve(args.output);

  // 确保输出目录存在
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    const imageBuffers = await generateImage(
      args.prompt,
      args.negative,
      generationOptions,
      apiKey
    );
    const outputPaths = [];
    if (imageBuffers.length === 1) {
      fs.writeFileSync(outputPath, imageBuffers[0]);
      outputPaths.push(outputPath);
    } else {
      const ext = path.extname(outputPath);
      const base = ext ? outputPath.slice(0, -ext.length) : outputPath;
      const outputExt = ext || ".png";
      for (let i = 0; i < imageBuffers.length; i++) {
        const indexedPath = `${base}-${String(i + 1).padStart(2, "0")}${outputExt}`;
        fs.writeFileSync(indexedPath, imageBuffers[i]);
        outputPaths.push(indexedPath);
      }
    }

    const result = {
      success: true,
      image_path: outputPaths[0],
      image_paths: outputPaths,
      generation_params: {
        model: generationOptions.model,
        aspect_ratio: generationOptions.aspectRatio,
        image_size: generationOptions.imageSize,
      },
      timestamp: new Date().toISOString(),
    };
    console.log(JSON.stringify(result));
    process.exit(0);
  } catch (error) {
    const result = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
    console.error(JSON.stringify(result));
    process.exit(1);
  }
}

main();
