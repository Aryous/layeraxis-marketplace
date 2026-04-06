# 最佳实践参考

> 按需加载的参考资料。正常流程中不需要查看。当 Step 6 迭代修正连续两次不满意时，加载此页对照校准。
> 每个示例展示完整链路：原文 → 分析 → 场景设计 → 最终提示词 → 效果点评。

---

## 示例 1：结构层 - 多面板信息图

**原文片段：**

> **问题一：图式不够用。** 有些图的需求不属于上面任何一种。比如「用一个隐喻来锚定全文的核心概念」——这不是对比，不是流程，不是纯氛围，也不完全是「概念可视化」。

> **问题二：风格和结构耦合。** 模板里把「画什么结构」和「用什么风格画」混在一起了。

> **问题三：隐喻类图没有位置放。** 我想画「用融化的时钟来暗示时间的失控感」，但模板里的「概念可视化」想的是信息图，不是隐喻画。

### Step 1 分析

```
功能层：结构层（三个并列问题，需要展示信息关系）
结构骨架: 85 / 隐喻包装: 60 / 情绪修辞: 15
依据：三个并列问题是天然的结构（三联画），每个问题自带具象意象（标签、板子、盒子），
不需要额外创造隐喻但需要将原文意象展开为场景
```

### Step 2 场景设计（中文）

**结构骨架（85，完整设计）**：
- 三张编号卡片并排，每张聚焦一个问题
- 统一容器：白色卡片、圆角 12、灰色细描边、双层阴影
- 底部水平蓝色虚线连接，下方总结文字

**隐喻包装（60，简要融入 — 原文自带意象，直接采纳）**：
- 卡片 1「图式不够用」：底部四个倾斜文件标签（对比/流程/概念/氛围），上方一张标着「隐喻锚定」的琥珀色描边卡片悬浮，下方问号，表示找不到匹配的标签
- 卡片 2「风格与结构耦合」：两块板重叠被一只手握住——一块是线框布局图，一块是色彩样本条，无法分开
- 卡片 3「无处安放的隐喻图」：一个标着「概念可视化」的打开盒子（内有柱状图饼图），盒子外地面上一只达利风格融化时钟，放不进去

**情绪修辞（15，跳过）**

**关键决策**：原文已经有完整的具象素材（「塞在……里」「绑在一起」「放不进去」），不需要 brainstorm，直接把原文视觉化表达转化为具体物件场景。

### 最终提示词

```
Three numbered rectangular cards side by side on a light grid background (#f8fafc), isometric 2.5D vector illustration, each card with white fill, rounded corners (radius 12), thin gray border (#e2e8f0), soft dual-layer shadow.

Card 1, large bold number "1" at top left, Chinese title "图式不够用" below:
Four tilted file tab dividers in a row at the bottom, labeled in Chinese: "对比", "流程", "概念", "氛围". Above them, one amber-outlined (#f59e0b) card labeled "隐喻锚定" floating with a large question mark "?" beneath it, showing it has no matching tab to slot into.

Card 2, large bold number "2" at top left, Chinese title "风格与结构耦合" below:
Two overlapping flat boards held together — one is a wireframe layout sketch with grid lines and boxes, the other is a color palette strip with swatches and texture samples. A simplified hand gripping both boards together, showing they cannot be separated.

Card 3, large bold number "3" at top left, Chinese title "无处安放的隐喻图" below:
An open box labeled "概念可视化" in Chinese, containing bar charts and pie charts inside. Outside the box on the ground, a melting soft clock (Salvador Dali style, simplified) sits alone, unable to fit into the box.

Below all three cards, a horizontal blue dashed line (#3b82f6) spanning the full width, with centered Chinese annotation text beneath: "当分类失效时，维度本身就是错误的"

Low-saturation blue-gray palette, electric blue (#3b82f6) for accents and line icons, amber (#f59e0b) only for the misfit elements in card 1. Razor-clean edges, grid-based layout, lots of whitespace, minimal SaaS product diagram style. Simple line-art illustrations, no complex rendering.

All visible text in Chinese. No English text.
```

### 效果点评

好。每个抽象概念都被完整展开为可画的具象名词场景，颜色 inline 跟物件走，视觉域统一（办公/文件管理类），达利时钟作为唯一「出格」元素恰好呼应了「放不进去」的主题。

### 可复用的模式

- 原文自带具象意象时，直接用，不需要 brainstorm
- 每个概念独立做一次「动词→名词」转化（「不够用」→ 悬浮卡片找不到标签）
- 统一视觉容器（编号卡片）建立并列结构
- 强调色（琥珀）仅用于「不匹配」的异常元素，其余全是低饱和蓝灰
- 底部标注文字点明整体论点

---

## 示例 2：锚定层 - 物理隐喻（动词转名词的完美示范）

### 原始需求背景
系统设定中有一个核心哲学：「AI 擅长渲染具象物件，无法直接描绘抽象过程（画名词，不画动词）」。需要一张图向用户解释这个概念。左边代表成功的「名词」，右边代表失败的「动词」，随后动词被翻译成名词。

### Step 1 分析

```
功能层：锚定层（用一个画面把抽象洞察钉住）
结构骨架: 55 / 隐喻包装: 80 / 情绪修辞: 30
依据：
- 结构 55：天然的左右对比结构，不需要复杂编排。
- 隐喻包装 80：核心难题是如何画「画不出的动词」。必须用高度具体的物理细节来隐喻「渲染失败 / 概念抽象」。
- 情绪修辞 30：客观陈述规律，不需要浓烈情绪。
```

### Step 2 场景设计（中文）

**隐喻包装（80，深度设计 - 将抽象「画不出」转换为物理「破损/消散」）：**
- 绝对不要让 AI 画「模糊的云团」或「抽象的齿轮」来代表动词。
- **神来之笔：** 将中文字符本身视为物理物件，给它施加「渲染失败」的物理状态——断裂的笔画、褪色的边框、半透明的质感。这本身就是一个可画的名词状态。
- 左侧「名词」：一朵极其具象、边缘锐利的枯萎蓝花，展现 AI 强大的具象刻画能力。
- 右侧「动词翻译」：消散的文字顺着箭头，转化为三个极度清晰的实体隐喻（沙粒流动的沙漏、散落的日历、晨昏交替的窗户）。

**结构骨架（55，标准规范接入）：**
- 左右两张标准的带边框、带阴影的白色卡片，左上角标数字 1 和 2。
- 严格的网格化编排：上部标签、中部核心物/过程、下部结果，等距对齐。

### 最终提示词

```
Wide horizontal composition (16:9), split into two rectangular white cards side by side on a cool white background (#f8fafc) with a faint dot grid. Each card has a white fill, rounded corners (radius 12), thin gray border (#e2e8f0), and a soft dual-layer shadow.

--- Card 1 (Left) ---
Large bold number "1" at top left, Chinese title "名词" below in dark navy (#1a2332).
Center: a single wilting flower in isometric 2.5D vector style, petals drooping and curling downward, stem slightly bent, drawn with crisp steel gray (#4a5568) outlines, petals filled with pale ice blue (#e0f2fe), stem and leaves in light gray (#f1f5f9). Lines are razor-sharp and perfectly rendered.
A small electric blue (#3b82f6) checkmark icon near the top-right of the flower.

--- Card 2 (Right) ---
Large bold number "2" at top left, Chinese title "动词" below in dark navy (#1a2332).
Upper area: four Chinese characters "时间流逝" rendered as broken, faded, semi-transparent outlines in very light gray (#e2e8f0), with dashed fragmented strokes, as if the text is dissolving and cannot be fully rendered. A small amber (#f59e0b) X mark beside the fading text.
Middle: a gentle downward curved arrow in electric blue (#3b82f6), with a small annotation beside it: Chinese text "翻译为名词" in electric blue (#3b82f6).
Lower area: three small crisp objects in a row, evenly spaced, each drawn in sharp steel gray (#4a5568) outlines with electric blue (#3b82f6) detail accents, each with a small blue checkmark above:
  Object 1: a melting hourglass, glass walls slightly warped, sand grains flowing, electric blue (#3b82f6) sand particles.
  Object 2: a few calendar pages scattering and floating off an open calendar, page corners highlighted in electric blue (#3b82f6).
  Object 3: a window frame, left half showing warm sunrise light in pale amber (#f59e0b), right half showing deep navy night sky (#1a2332), with a subtle gradient transition.

Below both cards, a horizontal dashed line in electric blue (#3b82f6) spanning the full width. Centered Chinese annotation text beneath: "配图的核心工作：把动词翻译成名词" in electric blue (#3b82f6).

Isometric 2.5D vector illustration, low-saturation blue-gray palette, razor-clean edges, minimal SaaS product diagram style, lots of whitespace. All visible text in Chinese.
```

### 效果点评

极佳。这是一次对「AI 画名词不画动词」哲学最彻底的贯彻。在表达「不可画」的概念时，没有使用模糊抽象词，而是创造性地将其转化为「正在碎裂、消散的物理碎片（ broken, faded, semi-transparent outlines）」。结合严格的卡片容器和空间方位锚定，成品既有思想深度，又完美符合 Digital Rationalism 的精确控制感。

### 可复用的模式（High-Value Asset）

*   **物理退化代偿法：** 当需要表达「抽象、失败、不可见、不确定」时，**禁止使用 `blurry` / `abstract` / `chaos`**。改为给一个具体物件附加**物理退化状态**：如 `broken` (破碎)、`dashed fragmented strokes` (虚线碎裂的笔划)、`dissolving` (溶解)、`semi-transparent` (半透明)。
*   **极致的方位约束：** 在复杂的图示中，像写 HTML/CSS 一样写提示词。使用明确的方位前缀（如 `Upper area:`, `Middle:`, `Lower area: three small crisp objects in a row, evenly spaced`），将 AI 的构图自由度降到最低。
*   **Inline Color（就地着色）：** 在描述所有关键物件时，将颜色 HEX 代码紧跟在名词后方（例：`electric blue (#3b82f6) sand particles`），确保复杂画面下的色彩不串位。

---

## 示例 3-5：待补充

> 随着更多配图实践积累，逐步补充以下类型的示例：
> - 情绪层 - 情绪驱动（以感受为核心的配图）
> - 失败案例 - 复盘（提示词写得不好的例子，分析原因）

每次迭代修正中发现的好案例或典型失败，都可以沉淀到这里。
