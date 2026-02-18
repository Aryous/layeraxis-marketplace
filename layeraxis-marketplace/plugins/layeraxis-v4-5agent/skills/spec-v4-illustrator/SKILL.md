---
name: spec-v4-illustrator
description: >
  SPEC V4 Subagent 编排技能。统一调度 lock-agent、outline-agent、scene-agent、prompt-agent、render-agent 五个 subagent，按 Gate 顺序推进文章配图全流程。用于用户要求“为文章配图”“一键跑完整流程”“/配图”“/spec-v4-illustrator”等场景。
---

## 角色定位

本技能是 Orchestrator，只做调度与门控，不做具体内容生产。

- 负责：选择起始阶段、调用 subagent、阶段验收、失败回退、断点续跑。
- 不负责：拆图细节、场景创作、提示词翻译、脚本底层实现。

## Subagent 清单

1. `lock-agent`：只生成 `imgs-spec/plan.lock.yaml`（绑定 `spec-v4-lock`）
2. `outline-agent`：只生成 `imgs-spec/outline.md`（绑定 `spec-v4-outline`）
3. `scene-agent`：只生成/更新 `imgs-spec/NN-*.md` 的中文设计部分
4. `prompt-agent`：只填写 `imgs-spec/NN-*.md` 的 `## English Prompt`
5. `render-agent`：执行出图、生成 summary、回写文章

Subagent 定义路径：`agents/*.md`

## 默认执行顺序

默认完整链路：

1. Lock Phase → `lock-agent`
2. Outline Phase → `outline-agent`
3. Scene Phase → `scene-agent`
4. Prompt Phase → `prompt-agent`
5. Render Phase → `render-agent`

## Gate 规则（阶段进入条件）

### Gate A（进入 Outline 前）

必须满足：

- 文章源文件存在
- `imgs-spec/plan.lock.yaml` 不存在或需要重建时，先调用 `lock-agent`

### Gate B（进入 Scene 前）

必须满足：

- `imgs-spec/plan.lock.yaml` 存在
- `imgs-spec/outline.md` 存在

缺失时：调用 `outline-agent` 修复。

### Gate C（进入 Prompt 前）

必须满足：

- 至少一个 `imgs-spec/NN-*.md`
- 每个文件都包含：`## 原文`、`## 场景设计`、`## 上色`、`## 概念卡`

缺失时：调用 `scene-agent` 修复。

### Gate D（进入 Render 前）

必须满足：

- `imgs-spec/plan.lock.yaml` 存在
- 所有 `imgs-spec/NN-*.md` 的 `## English Prompt` 非空

缺失时：调用 `prompt-agent` 修复。

## 调度策略

### 完整模式（默认）

按 1→5 顺序执行，阶段完成即做一次 Gate 校验，再进入下一阶段。

### 续跑模式

若已有工件，按 Gate 自动定位起点：

- 只有 lock 缺失：从 `lock-agent` 开始
- lock 有、outline 缺：从 `outline-agent` 开始
- NN 文件缺或中文段缺：从 `scene-agent` 开始
- English Prompt 缺：从 `prompt-agent` 开始
- 前置齐全：直接 `render-agent`

### 单阶段模式

当用户明确说“只做某阶段”（如“只改 prompt”“只出图”），仅调用对应 subagent，并先校验该阶段前置 Gate。

## 失败回退

- lock 参数问题：回退 `lock-agent`
- 拆图/评分问题：回退 `outline-agent`
- 场景/上色问题：回退 `scene-agent`
- 英文提示词问题：回退 `prompt-agent`
- 出图/API/脚本问题：留在 `render-agent`

连续两次视觉不满意时，提示加载：

- `skills/spec-v4-render-and-integrate/references/EXAMPLES.md`

## 协作约定

- 每完成一阶段，向用户汇报：阶段名、关键产物路径、是否通过 Gate。
- 未通过 Gate 时，不允许跨阶段硬推进。
- 优先复用已有文件，不覆盖用户手工修改内容（除非用户明确要求重跑）。

## 完成定义

完整流程完成需同时满足：

1. `imgs-spec/plan.lock.yaml` 存在且可读。
2. `imgs-spec/outline.md` 存在且含拆图+评分依据。
3. 所有目标 `imgs-spec/NN-*.md` 含完整中文设计与非空 `## English Prompt`。
4. `imgs-spec/*.png` 已生成。
5. `imgs-spec/generation-summary.json` 已生成。
6. 文章已插入对应图片引用。
