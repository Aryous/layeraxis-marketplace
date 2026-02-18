---
name: layeraxis-orchestrator
description: >
  LayerAxis V4 配图编排技能。调度 creative-agent-layeraxis -> compiler-agent-layeraxis -> render-agent-layeraxis。仅用于 /配图-layeraxis 或 /illustration-layeraxis，不替代现有 spec-v4-illustrator 主流程。
---

## 角色

本技能仅做编排、Gate 校验和模式控制，不做内容生成。

## 调度链路

1. `creative-agent-layeraxis`：输出 `imgs-spec/creative-draft.md`
2. `compiler-agent-layeraxis`：编译结构化工件
3. `render-agent-layeraxis`：复用现有脚本生成图片并回写文章

## 模式

- `auto`：连续执行三阶段
- `review`：creative 完成后暂停，等待 `review-feedback.yaml`

## Gate

- Gate A（进入 compiler 前）：`imgs-spec/creative-draft.md` 存在
- Gate B（进入 render 前）：
  - `imgs-spec/plan.lock.yaml`
  - `imgs-spec/outline.md`
  - 至少一个 `imgs-spec/NN-*.md` 且 `## English Prompt` 非空

## 必读参考

1. `references/pipeline-gates.md`
2. `assets/review-feedback-template.yaml`

## 兼容声明

- 本技能为并行实验流，不修改现有主流程。
- 触发词限定：`/配图-layeraxis`、`/illustration-layeraxis`。
