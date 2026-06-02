# 脚本调用指南

## 目录

- [脚本位置](#脚本位置) — 文件清单
- [引擎路由](#引擎路由) — gemini / codex 如何选择
- [extract-and-generate.js](#extract-and-generatejs) — 批量生成（主入口）
- [gemini-image-api.js](#gemini-image-apijs) — 单图生成（gemini 引擎）
- [codex-image-api.js](#codex-image-apijs) — 单图生成（codex 引擎）

---

## 脚本位置

Skill 内置脚本位于 `scripts/` 目录：
- `extract-and-generate.js` - 批量生成图片（按引擎分发）
- `gemini-image-api.js` - Gemini API 单图生成（gemini 引擎，被 extract-and-generate.js 调用）
- `codex-image-api.js` - codex exec 单图生成（codex 引擎，被 extract-and-generate.js 调用）

## 引擎路由

`extract-and-generate.js` 按 `plan.lock.yaml` 的 `generation.model` 选择底层脚本：

| `model` 取值 | 引擎 | 底层脚本 | 前置 |
| --- | --- | --- | --- |
| `gemini` / `gemini-*`（默认） | Gemini API | `gemini-image-api.js` | `GOOGLE_API_KEY` |
| `codex` / `gpt-image-*` | codex exec image_gen | `codex-image-api.js` | 本机 `codex` CLI 已登录 |

两个底层脚本输出**相同的单行 JSON 契约**（`success` / `image_path` / `generation_params` / `timestamp`），故可互换。

## extract-and-generate.js

### 功能

批量读取 Markdown prompt 文件 + plan.lock.yaml，按 `generation.model` 路由到 gemini 或 codex 引擎生成图片。

### 调用方式

```bash
node ${SKILL_DIR}/scripts/extract-and-generate.js \
  --input imgs-spec/ \
  --output imgs-spec/
```

### 参数

| 参数 | 必需 | 说明 |
| --- | --- | --- |
| `--input` | ✅ | 含 `NN-*.md` + `plan.lock.yaml` 的目录 |
| `--output` | ✅ | 图片输出目录 |
| `--lock` | ❌ | plan.lock 路径（默认 `<input>/plan.lock.yaml`） |
| `--only` | ❌ | 只生成指定图，逗号分隔 id/slug，例：`--only "04"` 或 `--only "01,03"`。**定点补图用** |
| `--skip-existing` | ❌ | 跳过已存在同名 PNG（幂等续跑）。**重跑只补缺失、不重烧已成功的** |

> **重要（避免烧配额）**：默认会重生成目录内全部图。**重跑或失败补图时务必加 `--skip-existing`**（只补缺失），或用 `--only` 定点指定，否则会把已成功的图全部重生成一遍——codex 引擎下这会成倍消耗配额。

### 执行流程

1. **环境检查（引擎感知）**
   - 加载 `.env` 文件（项目/父目录）
   - 仅当引擎为 gemini 时检查 `GOOGLE_API_KEY`（env 变量 → .env 文件 → 报错提示）
   - codex 引擎不要求 `GOOGLE_API_KEY`，改由 `codex-image-api.js` 在 codex 缺失/未登录时返回明确错误

2. **读取全局参数**
   - 从 `imgs-spec/plan.lock.yaml` 提取生成参数：
     - `generation.model`（路由引擎：gemini / codex，见上文「引擎路由」）
     - `generation.aspect_ratio`（如 16:9）
     - `generation.image_size`（如 2K；codex 引擎忽略，尺寸由 aspect 推导）
     - `negative_prompt`（可选，缺失时为空）

3. **读取 Prompt 文件**
   - 扫描 `imgs-spec/` 目录下所有 `NN-*.md` 文件
   - 按文件名排序（确保 01, 02, 03... 顺序）
   - 对每个文件：
     - 提取 `## English Prompt` section 下方的内容作为英文提示词
     - 若无 `## English Prompt` 标题，fallback 到整个 body（兼容旧格式）
     - 若检测到 legacy frontmatter，自动剥离

4. **调用引擎脚本**
   - 对每个 prompt 调用 `gemini-image-api.js` 或 `codex-image-api.js`（按引擎）
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

## codex-image-api.js

### 功能

通过 `codex exec --json --sandbox danger-full-access` 驱动 Codex CLI 内置的 `image_gen` 工具（gpt-image 系）生成单张图片。与 `gemini-image-api.js` 同构：相同 CLI 接口、相同单行 JSON 输出契约。

### 调用方式（直接使用）

```bash
node ${SKILL_DIR}/scripts/codex-image-api.js \
  --prompt "Wide horizontal composition..." \
  --aspect "16:9" \
  --model codex \
  --output output.png
```

### 参数

| 参数 | 必需 | 说明 |
| --- | --- | --- |
| `--prompt` | ✅ | 英文提示词 |
| `--output` | ✅ | 输出文件路径（含 shell 元字符会被拒绝） |
| `--aspect` | ❌ | 画面比例（默认 16:9）；codex 据此推导合规尺寸 |
| `--negative` | ❌ | 负面提示词（拼入指令文本，codex 无原生 negative 参数） |
| `--model` | ❌ | 透传记录（默认 codex） |
| `--timeout` | ❌ | codex exec 超时（毫秒，默认 300000） |
| `--size` / `--quality` | ❌ | 接受但忽略（仅为与 gemini 脚本命令行兼容） |

### 前置

本机已安装 `codex` CLI 并登录。未安装/未登录时返回 `error_kind: codex_not_installed`。

### 行为要点

- 指令硬约束 agent：只用内置 `image_gen`，禁外部 API、禁伪造、**禁 sips 等后处理**（保留原始尺寸）。
- **交接由 wrapper 接管（确定性）**：codex exec 返回后，脚本自己从 `$CODEX_HOME/generated_images/<thread_id>/` 取最新 PNG 拷到 `--output`，**不依赖 codex agent 自己 cp**（agent 自觉 cp 时灵时不灵，曾导致末尾图反复失败）。agent 的 cp 仅作兜底。输出 JSON 的 `generation_params.handoff` 标记 `wrapper`（脚本拷）或 `agent`（兜底）。
- 校验：确认 generated_images 有 PNG 或目标已落地；再做 `stat` + PNG magic 头校验。
- 失败按 `error_kind` 分类：`codex_not_installed` / `timeout` / `no_image_gen_tool_use` / `output_missing` / `invalid_png` / `agent_refused` 等。

### 使用场景

同 `gemini-image-api.js`：通常经 `extract-and-generate.js` 批量调用，单独使用仅为调试/重生成。
