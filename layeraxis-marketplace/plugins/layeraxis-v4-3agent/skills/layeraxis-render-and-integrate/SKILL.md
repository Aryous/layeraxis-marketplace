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
- API key 来源（任一满足）：
  - 环境变量：`GOOGLE_API_KEY`
  - 项目目录或父目录中的 `.env`（包含 `GOOGLE_API_KEY=...`）

缺任一前置项时先报缺失项，不直接执行生成。

## 执行流程（Step 5-6）

### Step 5：批量生成

先做 API key 预检：

1. 先检查 `process.env.GOOGLE_API_KEY`。
2. 若未设置，检查当前目录及父目录链上的 `.env` 是否包含 `GOOGLE_API_KEY`。
3. 若仍缺失，再提醒用户补充 `.env` 或环境变量，然后停止执行。

在文章目录运行：

```bash
node ${SKILL_DIR}/scripts/extract-and-generate.js \
  --input imgs-spec/ \
  --output imgs-spec/
```

脚本行为：

1. 读取 `plan.lock.yaml` 的全局参数。
2. 扫描并排序 `NN-*.md`。
3. 从每个文件提取 `## English Prompt`。
4. 调用 `gemini-image-api.js` 生成同名 `.png`。
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
| `scripts/extract-and-generate.js` | 批量提取 Prompt 并生成图片 |
| `scripts/gemini-image-api.js` | 调用 Gemini API 生成单图 |

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
