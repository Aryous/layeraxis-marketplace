# 脚本调用指南

## 目录

- [脚本位置](#脚本位置) — 文件清单
- [extract-and-generate.js](#extract-and-generatejs) — 批量生成（主入口）
- [gemini-image-api.js](#gemini-image-apijs) — 单图生成（底层调用）

---

## 脚本位置

Skill 内置脚本位于 `scripts/` 目录：
- `extract-and-generate.js` - 批量生成图片
- `gemini-image-api.js` - Gemini API 单图生成（被 extract-and-generate.js 调用）

## extract-and-generate.js

### 功能

批量读取 Markdown prompt 文件 + plan.lock.yaml，调用 Gemini API 生成图片。

### 调用方式

```bash
node ${SKILL_DIR}/scripts/extract-and-generate.js \
  --input imgs-spec/ \
  --output imgs-spec/
```

### 执行流程

1. **环境检查**
   - 加载 `.env` 文件（项目根目录）
   - 检查 `GOOGLE_API_KEY`（env 变量 → .env 文件 → 报错提示）

2. **读取全局参数**
   - 从 `imgs-spec/plan.lock.yaml` 提取生成参数：
     - `generation.model`（当前仅支持 gemini）
     - `generation.aspect_ratio`（如 16:9）
     - `generation.image_size`（如 2K）
     - `negative_prompt`（可选，缺失时为空）

3. **读取 Prompt 文件**
   - 扫描 `imgs-spec/` 目录下所有 `NN-*.md` 文件
   - 按文件名排序（确保 01, 02, 03... 顺序）
   - 对每个文件：
     - 提取 `## English Prompt` section 下方的内容作为英文提示词
     - 若无 `## English Prompt` 标题，fallback 到整个 body（兼容旧格式）
     - 若检测到 legacy frontmatter，自动剥离

4. **调用 Gemini API**
   - 对每个 prompt 调用 `gemini-image-api.js`
   - 失败时重试一次
   - 生成的图片保存为同名 `.png` 文件（如 `01-metaphor-xxx.md` → `01-metaphor-xxx.png`）

5. **写入摘要**
   - 生成 `generation-summary.json`，包含：
     - 成功/失败计数
     - 每张图的生成状态、耗时、错误信息（如有）
   - **不回写 prompt 文件**（保持 Markdown 文件只读）

### 错误处理

- API key 缺失 → 中断并提示配置方法
- Prompt 文件缺失 → 跳过并记录警告
- 单张生成失败 → 重试一次，仍失败则记录到 summary

### 输出示例

```
✓ 01-metaphor-translation-gap.png (2.3s)
✓ 02-structure-three-layer.png (1.8s)
✗ 03-comparison-before-after.png (API error: quota exceeded)
  → Retry...
✓ 03-comparison-before-after.png (2.1s)

Summary: 3/3 succeeded
```

## gemini-image-api.js

### 功能

调用 Google Gemini API 生成单张图片。

### 调用方式（直接使用）

```bash
node ${SKILL_DIR}/scripts/gemini-image-api.js \
  --prompt "Wide horizontal composition..." \
  --output output.png
```

### 参数

| 参数 | 必需 | 说明 |
| --- | --- | --- |
| `--prompt` | ✅ | 英文提示词 |
| `--output` | ✅ | 输出文件路径 |
| `--aspect-ratio` | ❌ | 画面比例（默认 16:9） |
| `--image-size` | ❌ | 尺寸档位（默认 2K） |
| `--negative-prompt` | ❌ | 负面提示词 |

### 环境变量

需要 `GOOGLE_API_KEY`，从以下位置读取（优先级）：
1. 环境变量 `process.env.GOOGLE_API_KEY`
2. 项目根目录 `.env` 文件

### 使用场景

通常不直接调用此脚本，而是通过 `extract-and-generate.js` 批量生成。

仅在以下场景单独使用：
- 调试单张图片生成
- 手动重新生成某张失败的图片
- 测试新的 prompt 模板
