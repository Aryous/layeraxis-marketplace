---
name: layeraxis-creative
description: >
  LayerAxis V4 创作技能。仅用于 /配图-layeraxis 或 /illustration-layeraxis 的创作阶段。基于 references 中的核心规范与风格指南进行集中创作，输出 imgs-spec/creative-draft.md，不直接执行渲染脚本。
---

## 目标

让单个创作 Agent 集中算力完成“拆图 + 场景 + 上色 + 英文提示词”，并保持高创作自由度。

## 必读参考（按顺序）

1. `references/layeraxis-core.md`
2. `references/style-hard-constraints.md`
3. `references/style-guides/digital-rationalism.md`

## 输入

- 文章正文
- 用户附加偏好（可选）

## 输出

- `imgs-spec/creative-draft.md`

## 工作流

1. 按核心规范完成 Step 1-4（拆图、评分、中文场景、风格上色、英文提示词）。
2. 必须执行风格硬约束，再做创作细化。
3. 输出为“弱结构草稿”，不强制严格模板，但必须满足最小契约。

## creative-draft 最小契约

每张图至少包含：

- 图号（NN）
- 概念焦点
- 功能层 + 三维评分
- 中文场景设计
- English Prompt

## 语言硬约束

- `English Prompt` 标题与该 section 内容使用英文。
- 除 `English Prompt` 外，`creative-draft.md` 其余内容必须使用中文。
- 禁止用英文撰写“概念焦点 / 评分依据 / 场景设计 / 上色说明 / 复盘说明”。
- 若出现中英混写，优先保留语义并统一回中文（仅保留 `English Prompt` 为英文）。

## 硬边界

- 不生成图片。
- 不调用渲染脚本。
- 不写标准化产物（`plan.lock.yaml`、`outline.md`、`NN-*.md`）。

## 质量自检

- 情绪层是否避免退化成纯结构图。
- 是否明确满足 isometric 2.5D 与同一视觉域。
- 每张图的 English Prompt 是否可独立执行。
- 是否满足语言约束（除 `English Prompt` 外全部中文）。
