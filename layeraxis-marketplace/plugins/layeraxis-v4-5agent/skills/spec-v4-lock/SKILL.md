---
name: spec-v4-lock
description: >
  SPEC V4 锁参技能。只负责 Step 0 的全局参数锁定：根据文章与风格指南生成 imgs-spec/plan.lock.yaml（density/style_guide/negative_prompt/generation 参数）。用于用户要求“先锁参数”“先定 density 和风格”“只生成 plan.lock.yaml”等场景。
---

## 目标

只产出全局锁文件 `imgs-spec/plan.lock.yaml`，不拆图、不评分、不做场景设计。

## 输入与前置条件

- 输入：文章正文（Markdown 或纯文本）
- 工作目录：文章所在目录
- 输出目录：`imgs-spec/`

如果 `imgs-spec/` 不存在，先创建。

## 输出

- `imgs-spec/plan.lock.yaml`

## 执行流程（Step 0）

1. 通读文章，判断信息密度与叙事体量。
2. 确定：
   - `density`：`minimal` / `standard` / `full`
   - `style_guide`：从 `references/style-guides/` 可用文件中选择
3. 加载选中风格指南，提取 `negative_prompt`。
4. 用 `assets/plan-lock-template.yaml` 作为模板写入：
   - `density`
   - `style_guide`
   - `negative_prompt`
   - `generation.model`
   - `generation.aspect_ratio`
   - `generation.image_size`

## 硬规则

- 不创建或修改 `imgs-spec/outline.md`。
- 不创建或修改 `imgs-spec/NN-*.md`。
- 不生成图片。

## 参考文件（按需加载）

- 模板：`assets/plan-lock-template.yaml`
- 风格指南：`references/style-guides/digital-rationalism.md`

## 完成定义

当 `imgs-spec/plan.lock.yaml` 存在且关键字段完整时，本阶段完成。
