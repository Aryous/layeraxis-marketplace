---
name: layeraxis-render-and-integrate
description: >
  LayerAxis V4 出图与回写技能。负责 Step 5-6：读取 plan.lock.yaml 与 NN-*.md 批量生成 PNG，输出 generation-summary.json，并将图片回写到文章中；用于用户要求“批量出图”“执行生成脚本”“把配图插回文章”等场景。
---

## 目标

把已完成的提示词文件转成图片资产，并完成文章插图与迭代修正闭环。

## 输入与前置条件

- `imgs-spec/plan.lock.yaml`
- `imgs-spec/NN-*.md`（含 `## English Prompt`）
- 出图引擎前置（由 `plan.lock.yaml` 的 `generation.model` 决定，二选一）：
  - **gemini** / `gemini-*`（默认）：需 `GOOGLE_API_KEY`（环境变量，或项目/父目录 `.env` 含 `GOOGLE_API_KEY=...`）
  - **codex** / `gpt-image-*`：需本机已安装 `codex` CLI 并登录（**不需要** `GOOGLE_API_KEY`）

缺对应引擎的前置项时先报缺失项，不直接执行生成。

## 执行流程（Step 5-6）

### Step 5：批量生成

先做引擎预检（先读 `plan.lock.yaml` 的 `generation.model` 判断引擎）：

- **gemini 引擎**：检查 `process.env.GOOGLE_API_KEY` → 当前/父目录 `.env` → 仍缺则提醒补充并停止执行。
- **codex 引擎**：确认 `codex` 命令可用（已安装并登录）；脚本会在调用失败时返回 `error_kind: codex_not_installed` 等明确错误。

> `extract-and-generate.js` 已内置同样的引擎感知预检：codex 引擎不会要求 `GOOGLE_API_KEY`。

在文章目录运行：

```bash
node ${SKILL_DIR}/scripts/extract-and-generate.js \
  --input imgs-spec/ \
  --output imgs-spec/
```

脚本行为：

1. 读取 `plan.lock.yaml` 的全局参数（含 `generation.model`，据此路由引擎）。
2. 扫描并排序 `NN-*.md`。
3. 从每个文件提取 `## English Prompt`。
4. 按引擎调用 `gemini-image-api.js` 或 `codex-image-api.js` 生成同名 `.png`。
5. 写出 `imgs-spec/generation-summary.json`。

### Step 6：回写文章 + 迭代

1. 将生成图片按语义位置插入文章：
   - `![描述](imgs-spec/NN-xxx.png)`
2. 用户不满意时按顺序修正：
   - 先定位问题属于场景/上色/翻译哪个环节
   - 回到对应技能修改源文件后再生成
3. 连续两轮不满意时加载参考案例对照：`references/EXAMPLES.md`

## Script Directory

**Important**: All scripts are located in the `scripts/` subdirectory of this skill.

**Agent Execution Instructions**:
1. Determine this SKILL.md file's directory path as `SKILL_DIR`
2. Script path = `${SKILL_DIR}/scripts/<script-name>.js`
3. Replace all `${SKILL_DIR}` in this document with the actual path

**Script Reference**:
| Script | Purpose |
|--------|---------|
| `scripts/extract-and-generate.js` | 批量提取 Prompt 并按引擎生成图片 |
| `scripts/gemini-image-api.js` | 调用 Gemini API 生成单图（gemini 引擎） |
| `scripts/codex-image-api.js` | 通过 `codex exec` 内置 image_gen 生成单图（codex 引擎） |

## 硬规则

- 不修改 `NN-*.md` 的上游设计内容，除非用户明确要求。
- 单图失败先自动重试，再记录到 summary。
- 优先根据 `generation-summary.json` 回报结果，不口头猜测。

## 参考文件（按需加载）

- 脚本说明：`references/scripts.md`
- 校准案例：`references/EXAMPLES.md`

## 完成定义

以下三项都成立即完成：

1. 目标图片已生成到 `imgs-spec/`。
2. `generation-summary.json` 已生成且状态可读。
3. 文章已插入图片引用并可继续迭代。
