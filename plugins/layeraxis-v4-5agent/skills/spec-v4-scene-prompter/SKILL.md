---
name: spec-v4-scene-prompter
description: >
  SPEC V4 场景与提示词技能。负责 Step 2-4：基于 outline 逐图完成中文场景设计、风格上色、概念卡与英文提示词，输出 imgs-spec/NN-*.md。用于用户要求“设计场景”“生成配图提示词”“把拆图转成可生成prompt”等场景。
---

## 目标

把规划结果转成可执行的单图规格文件 `NN-*.md`，每张图都包含：原文锚点、场景设计、上色、概念卡、English Prompt。

## 输入与前置条件

- 必需输入：
  - `imgs-spec/plan.lock.yaml`
  - `imgs-spec/outline.md`
  - 原文文章
- 本技能不负责拆图和评分；若缺少 `outline.md`，应先回到规划技能。

## 输出

- `imgs-spec/NN-{label}-{slug}.md`（每张图一个文件）

命名和结构必须遵循 `references/file-conventions.md`。

## 执行流程（Step 2-4）

对每张图按顺序执行，单图闭环完成后再做下一张。

### Step 2：场景设计（中文）

1. 先写 `## 原文`：粘贴该图对应原文段落，保持原样。
2. 读取该图三维评分，按阈值分配设计精力：
   - `>= 70`：完整展开
   - `30-69`：简要融入
   - `< 30`：跳过
3. 结构高分时，明确信息关系与空间排布。
4. 隐喻高分时：
   - 原文有具象意象：直接采用并校验可渲染性
   - 原文无具象意象：做 3 个候选 brainstorm 后择优
5. 情绪高分时，定义目标情绪与视觉手法（光影/密度/材质/空间）。
6. 用分层骨架写完整场景：`全局 → 容器 → 逐面板/主体 → 连接元素 → 情绪基调`。

### Step 3：加载风格并上色

1. 从 `plan.lock.yaml` 读取 `style_guide`。
2. 完整加载对应风格指南（默认 `digital-rationalism`）。
3. 在 `## 上色` 中为关键物件分配颜色。
4. 在后续英文提示词中，颜色必须 inline 到物件首次出现处。

### Step 4：概念卡 + 英文提示词

1. 写 `## 概念卡`（4 行）：
   - 概念焦点
   - 功能层
   - 三维评分
   - 视觉核心
2. 写 `## English Prompt`：只做翻译，不新增设计决策。
3. 结构顺序固定：
   - 全局声明
   - 容器规格（多面板必填）
   - 分面板描述
   - 连接元素
   - 风格基底 + 语言声明
4. 结尾固定加：`All visible text in Chinese. No English text.`

## 硬规则

- 禁止 emoji。
- 每图可辨识视觉单元 `<= 7`。
- 每面板核心物件 `<= 3`，动作暗示 `<= 1`。
- 多面板必须同一视觉域，禁止混搭。
- Step 4 只能翻译，不能改 Step 2-3 的设计结论。

## 参考文件（按需加载）

- 文件规范：`references/file-conventions.md`
- 隐喻流程：`references/metaphor-brainstorming.md`
- 多面板规范：`references/multi-panel-spec.md`
- 维度词典：`references/dimension-catalog.md`
- 风格指南：`references/style-guides/digital-rationalism.md`

## 完成定义

当每张图都产出一个结构完整的 `NN-*.md`，且 `## English Prompt` 已可被批量脚本直接提取时，本阶段完成。
