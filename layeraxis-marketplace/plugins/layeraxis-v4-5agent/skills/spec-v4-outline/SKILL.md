---
name: spec-v4-outline
description: >
  SPEC V4 拆图评分技能。只负责 Step 1：基于文章与已锁定参数执行拆图、功能层定位、三维评分，并输出 imgs-spec/outline.md。用于用户要求“只做拆图”“只做评分”“先出 outline”等场景。
---

## 目标

只产出 `imgs-spec/outline.md`，不改 `plan.lock.yaml`，不做场景设计与出图。

## 输入与前置条件

- 输入：文章正文（Markdown 或纯文本）
- 必需文件：`imgs-spec/plan.lock.yaml`

如果缺少 `plan.lock.yaml`，应先返回锁参阶段处理。

## 输出

- `imgs-spec/outline.md`

## 执行流程（Step 1）

1. 读取 `plan.lock.yaml`，使用锁定的 `density` 作为拆图规模约束。
2. 按文章自然结构拆图，每图只聚焦一个核心概念。
3. 为每张图定位功能层：
   - `节奏层`
   - `情绪层`
   - `锚定层`
   - `结构层`
4. 为每张图输出三维评分（0-100）与一句依据：
   - `结构骨架`
   - `隐喻包装`
   - `情绪修辞`
5. 将结果写入 `imgs-spec/outline.md`（格式遵循参考规范）。

## 评分驱动规则

- `>= 70`：后续阶段完整展开
- `30-69`：后续阶段简要融入
- `< 30`：后续阶段跳过

## 硬规则

- 不修改 `imgs-spec/plan.lock.yaml`。
- 不创建或修改 `imgs-spec/NN-*.md`。
- 不生成图片。

## 参考文件（按需加载）

- 评分细则：`references/scoring-rubric.md`
- 文件规范：`references/file-conventions.md`

## 完成定义

当 `imgs-spec/outline.md` 存在，且每张图均包含功能层 + 三维评分 + 评分依据时，本阶段完成。
