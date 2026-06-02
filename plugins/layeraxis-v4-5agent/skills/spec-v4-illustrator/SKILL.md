---
name: spec-v4-illustrator
description: >
  SPEC V4 多 Agent 编排技能。Claude Code 下调度 lock/outline/scene/prompt/render subagent；Codex 下按同一 Gate 顺序 spawn 对应阶段 subagents。用于用户要求“为文章配图”“一键跑完整流程”“/配图”“/spec-v4-illustrator”等场景。
---

## 角色定位

本技能是 Orchestrator，只做调度与门控。各阶段必须由独立 agent 执行，以保持上下文干净和注意力集中。

- 负责：选择起始阶段、调度阶段 agent、阶段验收、失败回退、断点续跑。
- 不负责：拆图细节、场景创作、提示词翻译、脚本底层实现。

## 阶段清单

1. Lock：只生成 `imgs-spec/plan.lock.yaml`（对应 `spec-v4-lock`）
2. Outline：只生成 `imgs-spec/outline.md`（对应 `spec-v4-outline`）
3. Scene：只生成/更新 `imgs-spec/NN-*.md` 的中文设计部分
4. Prompt：只填写 `imgs-spec/NN-*.md` 的 `## English Prompt`
5. Render：执行出图、生成 summary、回写文章

Claude Code subagent 定义路径：`agents/*.md`。

Codex custom agent 定义路径：
- `.codex/agents/layeraxis-lock.toml`
- `.codex/agents/layeraxis-outline.toml`
- `.codex/agents/layeraxis-scene.toml`
- `.codex/agents/layeraxis-prompt.toml`
- `.codex/agents/layeraxis-spec-render.toml`

Codex 中如果 custom agents 不可见，也必须 spawn 独立 worker subagents 并注入对应阶段指令。不要静默降级为当前 agent 执行阶段；不可 spawn 时停止并报告。

## 默认执行顺序

默认完整链路：

1. Lock Phase
2. Outline Phase
3. Scene Phase
4. Prompt Phase
5. Render Phase

## Gate 规则（阶段进入条件）

### Gate A（进入 Outline 前）

必须满足：

- 文章源文件存在
- `imgs-spec/plan.lock.yaml` 不存在或需要重建时，先执行 Lock 阶段

### Gate B（进入 Scene 前）

必须满足：

- `imgs-spec/plan.lock.yaml` 存在
- `imgs-spec/outline.md` 存在

缺失时：执行 Outline 阶段修复。

### Gate C（进入 Prompt 前）

必须满足：

- 至少一个 `imgs-spec/NN-*.md`
- 每个文件都包含：`## 原文`、`## 场景设计`、`## 上色`、`## 概念卡`

缺失时：执行 Scene 阶段修复。

### Gate D（进入 Render 前）

必须满足：

- `imgs-spec/plan.lock.yaml` 存在
- 所有 `imgs-spec/NN-*.md` 的 `## English Prompt` 非空

缺失时：执行 Prompt 阶段修复。

## 调度策略

### 完整模式（默认）

按 1→5 顺序执行，阶段完成即做一次 Gate 校验，再进入下一阶段。

### 续跑模式

若已有工件，按 Gate 自动定位起点：

- 只有 lock 缺失：从 Lock 阶段开始
- lock 有、outline 缺：从 Outline 阶段开始
- NN 文件缺或中文段缺：从 Scene 阶段开始
- English Prompt 缺：从 Prompt 阶段开始
- 前置齐全：直接 Render 阶段

### 单阶段模式

当用户明确说“只做某阶段”（如“只改 prompt”“只出图”），仅 spawn 对应阶段 subagent，并先校验该阶段前置 Gate。

## 失败回退

- lock 参数问题：回退 Lock 阶段
- 拆图/评分问题：回退 Outline 阶段
- 场景/上色问题：回退 Scene 阶段
- 英文提示词问题：回退 Prompt 阶段
- 出图/API/脚本问题：留在 Render 阶段

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
