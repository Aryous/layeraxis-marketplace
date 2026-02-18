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

## 示例 2-5：待补充

> 随着更多配图实践积累，逐步补充以下类型的示例：
> - 锚定层 - 隐喻驱动（原文纯抽象，需要 brainstorm 创造隐喻）
> - 情绪层 - 情绪驱动（以感受为核心的配图）
> - 混合型 - 结构+隐喻高分（两个维度同时深度展开）
> - 失败案例 - 复盘（提示词写得不好的例子，分析原因）

每次迭代修正中发现的好案例或典型失败，都可以沉淀到这里。
