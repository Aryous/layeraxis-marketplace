---
name: layeraxis-orchestrator
description: LayerAxis V4 配图编排技能。调度 creative-agent-layeraxis → compiler-agent-layeraxis → render-agent-layeraxis 三级流水线。
---
## 概览
orchestrator 是一条三级 agent 流水线的编排层，自身不生成内容，只负责初始化、参数确认、调度和失败回退。
```
orchestrator──▶ creative ──▶ compiler ──▶ render
                    │              │            │
               creative-draft  outline.md    *.png
                   .md         NN-*.md    summary.json
```
**两种模式**：
- **`auto`**：全流程连续运行，不暂停。
- **`review`**：creative 产出后暂停，等待人工反馈再继续。
---

## 输入与输出

### 输入

| 文件 | 用途 |
| --- | --- |
| 文章源文件 | 用户指定的待配图文章 |
| `@assets/plan-lock-template.yaml` | plan.lock 初始化模板 |
| `@references/pipeline-gates.md` | Gate 校验标准（单一来源） |
| `@assets/review-feedback-template.yaml` | review 反馈格式模板 |
| `imgs-spec/review-feedback.yaml` | 仅 review 模式：用户按 `@assets/review-feedback-template.yaml` 手动创建，放入 `imgs-spec/` 后恢复流程。文件不存在则跳过反馈直接进入 compiler。 |

### 输出

| 文件 | 产出者 | 说明 |
| --- | --- | --- |
| `imgs-spec/plan.lock.yaml` | orchestrator → compiler | 全局参数契约 |
| `imgs-spec/creative-draft.md` | creative | 创意设计草稿 |
| `imgs-spec/outline.md` | compiler | 配图大纲 |
| `imgs-spec/NN-*.md` | compiler | 逐张配图的结构化描述（含英文提示词） |
| `imgs-spec/*.png` | render | 生成的图片 |
| `imgs-spec/generation-summary.json` | render | 生成摘要（模型、耗时、参数、状态） |

---

## 执行流程（严格执行）

### Step 1 · orchestrator · 初始化启动锁

建立 `imgs-spec/plan.lock.yaml` 作为全局参数契约。

- 文件不存在 → 按 `@assets/plan-lock-template.yaml` 创建。
- 文件已存在 → 校验白名单字段，移除未知字段，缺失字段按模板补齐。

### Step 2 · orchestrator · AUQ 全局参数确认

用最小交互锁定本次出图的全局参数，写回 `plan.lock.yaml`。

**交互规则**：优先使用模板默认值。只有当用户主动要求修改时，才进入自定义流程，1-2 轮对话一次性收集。

<aside>
使用 AskUserQuestion 对用户进行确认
**第 1 轮**（二选一）

- **默认（推荐）**：使用模板默认值，跳过第 2 轮。
- **自定义**：进入第 2 轮。

**第 2 轮**（仅自定义时触发）

| 参数 | 可选值 | 默认值 |
| --- | --- | --- |
| `density` | `minimal` / `standard` / `full` | 模板默认 |
| `generation.model` | `gemini-3-pro-image-preview` / `gemini-2.0-flash-preview-image-generation` / `imagen-4-ultra-generate-001` / `imagen-4-generate-001` | `gemini-3-pro-image-preview` |
| `generation.aspect_ratio` | `1:1` / `3:4` / `4:3` / `9:16` / `16:9` | 模板默认 |
| `generation.image_size` | `1K` / `2K` / `4K` | 模板默认 |
| `style_guide` | 当前仅 `digital-rationalism` | `digital-rationalism` |

**第 3 轮**（不写回 plan.lock.yaml）
- **`auto`**：全流程连续运行，不暂停。
- **`review`**：creative 产出后暂停，等待人工反馈再继续。
</aside>

**写回规则**：

- 仅写入白名单字段，键顺序与模板一致，保证稳定 diff。
- 用户给出的值不在合法范围内 → 停止并要求重新选择，不猜测。

---

### Gate 0 · 参数合法性校验

校验 Step 2 写入后的完整 `plan.lock.yaml`，确认所有参数在合法范围内。

- ✅ 通过 → 进入 Step 3。
- ❌ 失败 → 回退 Step 1，重建 lock 文件后重新执行 Step 2。

校验标准：`@references/pipeline-gates.md`

---

### Step 3 · 调用 creative-agent-layeraxis · 创意设计

阅读原文，根据给定的配图参数（density, style-guide, 图片比例），完成配图的创意设计：图片拆分、功能层定位、动态评分、隐喻选择、中文场景构思、英文 Prompt 输出。

|  |  |
| --- | --- |
| **读取** | 文章源文件、`plan.lock.yaml`（只读） |
| **硬约束** | orchestrator 传入 `density`、`style_guide`、`generation.aspect_ratio` |
| **产出** | `imgs-spec/creative-draft.md` |

---

### Gate A · creative 产出校验

校验标准：`@references/pipeline-gates.md`

- ✅ 通过 → 进入 Step 4（auto 模式）或 review 暂停点（review 模式）。
- ❌ 失败 → 回退 Step 3，补齐草稿后重新过 Gate A。

---

### review 暂停点（仅 review 模式）

Gate A 通过后暂停，等待人工反馈。

- **有反馈**（`imgs-spec/review-feedback.yaml` 存在且未消费）：
    1. 将反馈注入 creative，重新处理。
    2. creative 覆盖 `creative-draft.md`。
    3. 标记反馈文件为已消费（`consumed: true`）。
    4. 重新通过 Gate A 后继续。
- **无反馈**：直接进入 Step 4。

反馈格式：`@assets/review-feedback-template.yaml`

---

### Step 4 · compiler-agent-layeraxis · 结构化编译

将 creative 草稿编译为结构化工件：拆分逐张配图、生成大纲、规范化 lock 文件。

|  |  |
| --- | --- |
| **读取** | `creative-draft.md`、`plan.lock.yaml`（权威输入） |
| **产出** | `outline.md`、`NN-*.md`（含英文提示词）、规范化后的 `plan.lock.yaml` |

**约束**：

- 对 `plan.lock.yaml` 只做格式规范化（排序、补默认值、结构对齐），**不改 AUQ 确认的参数值**。
- 翻译严格执行"设计与翻译分离"：不增删物件、不改布局、不改颜色，只做语言转换。
- 每张英文提示词须包含：负向提示词、语言声明、inline 颜色标注。

---

### Gate B · compiler 产出校验

校验标准：`@references/pipeline-gates.md`

- ✅ 通过 → 进入 Step 5。
- ❌ 失败 → 回退 Step 4，补齐后重新过 Gate B。

---

### Step 5 · render-agent-layeraxis · 出图与回写

按结构化工件逐张调用图像生成 API，执行出图并回写摘要。

|  |  |
| --- | --- |
| **读取** | `NN-*.md`（提示词）、`plan.lock.yaml`（只读，读取 `generation.*` 参数） |
| **产出** | `*.png`、`generation-summary.json` |

**约束**：

- 不写 `plan.lock.yaml`。
- 严格按 lock 文件中的 `generation.model`、`generation.aspect_ratio`、`generation.image_size` 执行，不自行调整。
- 单张生成失败时记录到 summary，不中断整体流程。

---

## Subagent 交互矩阵

|  | plan.lock | [creative-draft.md](http://creative-draft.md) | [outline.md](http://outline.md) | NN-*.md | *.png | summary.json |
| --- | --- | --- | --- | --- | --- | --- |
| **orchestrator** | 写（启动锁） | — | — | — | — | — |
| **creative** | 读 | 写 | — | — | — | — |
| **compiler** | 规范化写 | 读 | 写 | 写 | — | — |
| **render** | 读 | — | — | 读 | 写 | 写 |
- 表示该 agent 不接触此文件。

---

## plan.lock 契约

`plan.lock.yaml` 是全流程的参数单一来源。

### 白名单字段

仅允许以下键存在，未知字段必须移除：

| 字段 | 说明 |
| --- | --- |
| `density` | 出图密度 |
| `style_guide` | 视觉风格 |
| `negative_prompt` | 负向提示词 |
| `generation.model` | 生成模型 |
| `generation.aspect_ratio` | 画幅比例 |
| `generation.image_size` | 图片尺寸 |
| `created_at` | 创建时间 |
| `spec_version` | 规范版本 |

### 写入权限

| 角色 | 权限 | 说明 |
| --- | --- | --- |
| orchestrator | 启动写入 | Step 1 创建初始锁 |
| creative | 只读 | 读取参数，不写锁文件 |
| compiler | 规范化写入 | 最终格式规范化（不改 AUQ 值） |
| render | 只读 | 读取参数执行，不改锁文件 |

### 冲突规则

- 格式层面的冲突（排序、缺失默认值）→ 以 compiler 最终输出为准。
- AUQ 确认的参数值 → 任何阶段不得覆盖。

---

## 失败处理

| 失败点 | 回退目标 | 处理方式 |
| --- | --- | --- |
| Gate 0 | Step 1 | 重建或清洗 lock 文件，重新执行 Step 2 |
| Gate A | Step 3 | creative 补齐草稿后重新过 Gate A |
| Gate B | Step 4 | compiler 补齐结构化文件后重新过 Gate B |

---

## 必读参考

1. `@references/pipeline-gates.md` — Gate 校验标准（单一来源）
2. `@assets/plan-lock-template.yaml` — plan.lock 模板与默认值
3. `@assets/review-feedback-template.yaml` — review 反馈格式模板

---

## 兼容声明

- 本技能为**并行实验流**，与现有 `spec-v4-illustrator` 主流程独立运行，互不影响。
- 两者的 `imgs-spec/` 目录结构一致，下游消费方无需区分来源。
- 触发词严格限定：`/配图-layeraxis`、`/illustration-layeraxis`。