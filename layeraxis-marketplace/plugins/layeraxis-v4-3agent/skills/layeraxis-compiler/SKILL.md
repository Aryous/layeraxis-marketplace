---
name: layeraxis-compiler
description: >
  LayerAxis V4 编译技能。仅用于 /配图-layeraxis 或 /illustration-layeraxis 的结构化阶段。将 imgs-spec/creative-draft.md 编译为可执行的 plan.lock.yaml、outline.md 与 NN-*.md，不改变创作意图。
---

## 目标

把创作草稿稳定编译成脚本可消费文件，保证结构一致性与可回放性。

## 必读参考

1. `references/compiler-contract.md`
2. `references/file-conventions.md`
3. `references/scoring-rubric.md`
4. `assets/plan-lock-template.yaml`

## 输入

- `imgs-spec/creative-draft.md`

## 输出

- `imgs-spec/plan.lock.yaml`
- `imgs-spec/outline.md`
- `imgs-spec/NN-*.md`

## 编译规则

1. 只结构化，不重写创作方向。
2. 缺失字段允许最小补全，但必须显式标注为 `TODO` 或 `assumed`。
3. `NN-*.md` 必须包含：
   - `## 原文`
   - `## 场景设计`
   - `## 上色`
   - `## 概念卡`
   - `## English Prompt`
4. 文件名按 `NN-{label}-{slug}.md`。

## 回退条件

出现以下情况必须回退 creative 阶段：

- 无法识别图号或图数量
- 缺失 English Prompt
- 场景语义与概念焦点冲突

## 硬边界

- 不调用图片生成脚本。
- 不引入新的核心视觉隐喻。
- 不覆盖用户在草稿中的明确创意决策。
