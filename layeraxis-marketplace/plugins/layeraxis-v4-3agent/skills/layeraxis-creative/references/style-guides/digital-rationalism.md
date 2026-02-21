# 视觉设计风格指南-数字理性主义&人本清晰主义
> 适用范围：AI Agent / SaaS 产品架构图 / 流程图 / 技术说明插画 / 产品宣传视觉系统
> 风格定位：冷静理性 × 克制科技感 × 轻人文温度

## 目录

- [一、核心设计哲学（Core Philosophy）](#一核心设计哲学core-philosophy)
- [二、风格系统（Style System）](#二风格系统style-system)
- [三、色彩系统（Color System）](#三色彩系统color-system)
- [四、版式与栅格（Layout & Grid）](#四版式与栅格layout--grid)
- [五、字体与排版（Typography）](#五字体与排版typography)
- [六、图形语言（Graphic Language）](#六图形语言graphic-language)
- [七、插画系统（Illustration System）](#七插画系统illustration-system)
- [八、流程与连接规范（Flow & Connection）](#八流程与连接规范flow--connection)
- [九、组件规范（Component System）](#九组件规范component-system)
- [十、规范约束（Do / Don’t）](#十规范约束do--dont)
- [十一、生成提示词模板（Prompt Preset）](#十一生成提示词模板prompt-preset)
- [十二、深色模式扩展建议（Dark Mode）](#十二深色模式扩展建议dark-mode)
- [十三、标题与标注规范（Title & Annotation）](#十三标题与标注规范title--annotation)
- [十四、视觉重点强化技巧](#十四视觉重点强化技巧)
- [十五、参考范例 (The Benchmark)](#十五参考范例-the-benchmark)

---

## 一、核心设计哲学（Core Philosophy）

本视觉系统旨在平衡两种看似冲突的目标：

- **冷静精确（Precision）**
    - 强调系统性、结构性、可靠性、可复现性
    - 体现工程思维与理性秩序
- **克制温度（Controlled Warmth）**
    - 保留适度的人文感与亲和力
    - 避免卡通化、娱乐化、情绪化设计

总体风格融合：

- 瑞士网格设计体系
- SaaS 等距插画语言
- 轻拟物化（Soft Skeuomorphism）

---

## 二、风格系统（Style System）

### 1. 主风格（80%）：数字理性主义（Digital Rationalism）

适用场景：

- 系统架构图
- Agent 流程图
- 功能拆解
- 产品机制说明
- 技术文档配图

特征：

- 高秩序感
- 低情绪干扰
- 明确层级结构
- 精确表达关系

关键词：

`理性 / 网格 / 克制 / 现代科技 / 清晰边缘`

---

### 2. 副风格（20%）：人本清晰主义（Human-Centered Minimalism）

适用场景：

- 愿景展示
- 结果交付
- 用户价值表达
- 协作关系图

特征：

- 保留主风格框架
- 通过人物与留白引入温度
- 不破坏整体冷色体系

---

## 三、色彩系统（Color System）

### 1. 核心配色

| 用途 | 颜色 | Hex |
| --- | --- | --- |
| 主深色 | 深海军蓝 | #1a2332 |
| 正文灰 | 钢灰 | #4a5568 |
| 浅强调底 | 冰蓝 | #e0f2fe |
| 强调色 | 电光蓝 | #3b82f6 |
| 深强调 | 深蓝 | #2563eb |

### 2. 背景与辅助色

| 用途 | 颜色 | Hex |
| --- | --- | --- |
| 冷白背景 | 冷白 | #f8fafc |
| 描边线 | 冷灰 | #e2e8f0 |
| 模块底色 | 浅灰 | #f1f5f9 |

### 3. 暖色点缀（仅副风格）

限制 ≤ 2% 画面面积：

- 琥珀：#f59e0b
- 柔粉：#fb7185

### 4. 用色比例建议

- 背景色：70–85%
- 灰阶文字/线条：10–20%
- 蓝色强调：3–10%
- 暖色：0–2%

---

## 四、版式与栅格（Layout & Grid）

### 1. 栅格系统

- 使用 8pt Grid System
- 间距必须为 8 的倍数
- 模块严格对齐

### 2. 常见结构

- 左右分栏 + 中轴线
- 模块化卡片排列
- 中心处理节点结构
- 对比结构（左右对照展示）

### 3. 留白原则

- 优先留白而非堆叠
- 信息密度中低水平
- 使用空白代替装饰线

---

## 五、字体与排版（Typography）

### 1. 字体推荐

中文：

- 思源黑体
- 苹方
- HarmonyOS Sans

英文：

- Inter
- SF Pro

### 2. 字号体系

| 层级 | 大小 | 字重 |
| --- | --- | --- |
| H1 | 40–56 | Bold |
| H2 | 24–32 | Semibold |
| 正文 | 14–16 | Regular |
| 注释 | 12–13 | Regular |

### 3. 行高

- 标题：1.1–1.25
- 正文：1.5–1.7

---

## 六、图形语言（Graphic Language）

### 1. 线条

- 标准线宽：2px
- 小图：1.5px
- 端点：Round Cap

### 2. 圆角

| 元素 | 半径 |
| --- | --- |
| 卡片 | 12–16 |
| 标签 | 8 |
| 细节 | 4–6 |

### 3. 边缘规范

- 必须干净锐利
- 禁止毛边
- 禁止复杂描边

---

## 七、插画系统（Illustration System）

### 0. 卡片层级的两种展示方式

#### 倾斜叠加型

- **适用场景**：渐进披露、层级结构、文档堆叠
- **视觉特征**：卡片向后倾斜 15-20°，前后层次分明
- **典型应用**：Claude Skills 的 Layer 1/2/3 结构

#### 垂直独立型

- **适用场景**：并列要素、独立模块、配置项
- **视觉特征**：卡片垂直排列，互不遮挡
- **典型应用**：Notion Agent 的场景路由、执行配置

### 1. 透视结构

- 等距 2.5D 视角
- 统一体块厚度
- 无混合透视

### 2. 光影系统

双层阴影：

1. 环境阴影（大、淡）
2. 接触阴影（小、近）

主光方向：左上

### 3. 背景风格

- 冷白渐变
- 轻雾化
- 极细颗粒

### 4. 人物设计

- 简化线稿
- 冷色系着装
- 动作明确
- 表情克制

---

## 八、流程与连接规范（Flow & Connection）

### 1. 路径

- 贝塞尔曲线优先
- 禁止直角折线

### 2. 虚线

- 点状或短划线
- 间距统一

### 3. 箭头

#### 箭头分级

- **粗箭头（主流程）**：宽度 6-8px，贯穿画面，表达核心逻辑
- **细箭头（次要连接）**：宽度 2px，局部连接
- **虚线箭头**：表达弱关联或可选路径

#### 颜色规则

- 关键路径使用 #3b82f6
- 次要路径使用 #94a3b8

#### 标注位置

- 箭头上方：流程名称或动作
- 箭头下方：补充说明

---

## 九、组件规范（Component System）

### 标准组件

### 卡片（Card）

- 背景：#f8fafc
- 描边：#e2e8f0
- 阴影：soft

### 模块盒（Block）

- 等距体块
- 顶面高光
- 侧面压暗

### 标签（Badge）

- 背景：#e0f2fe
- 字色：#1a2332

### 强调模块

- 蓝色边/底
- 高留白

---

## 十、规范约束（Do / Don’t）

### Do

- 大留白
- 强对齐
- 统一圆角与线宽
- 蓝色表达关键逻辑

### Don’t

- 霓虹色
- 重投影
- 高饱和渐变
- 多透视混用
- 材质纹理

---

## 十一、生成提示词模板（Prompt Preset）

### 1. 主风格通用

**中文**

冷白渐变背景，低饱和蓝灰配色，等距2.5D矢量插画，
干净锐利边缘，柔和双层阴影，网格化布局，
曲线虚线流程箭头，SaaS产品架构图风格，
现代科技感但克制，留白充足

**英文**

```markdown
isometric 2.5D vector illustration,
cool white gradient background,
low-saturation blue-gray palette,
razor-clean edges,
soft ambient and contact shadows,
grid-based layout,
curved dotted arrows,
minimal SaaS product diagram,
lots of whitespace
```

---

### 2. 对比结构图（增强版）

```markdown
side-by-side comparison layout,
isometric 2.5D illustration,
title at top center explaining the shared principle,
left section labeled with system name,
staggered document layers tilted backward,
right section labeled with system name,
vertical standalone cards,
prominent electric blue highlight card on far right,
dotted lines connecting corresponding elements,
large bold blue arrow spanning bottom with annotations,
cool white gradient background,
clean edges, soft shadows
```

---

### 3. Agent 工作流

```markdown
workflow diagram,
modular cards,
central processing unit,
dotted connections,
output report card,
technical infographic
```

---

### 4. 人物协作场景

```markdown
minimal line characters,
passing document,
calm expression,
corporate tech illustration,
cool palette
```

---

### 5. 负面提示词

```markdown
no neon,
no cyberpunk,
no heavy texture,
no harsh shadow,
no glossy reflection,
no clutter,
no photorealism,
no high saturation
```

---

## 十二、深色模式扩展建议（Dark Mode）

背景区间：

- #0b1220 ~ #1a2332

原则：

- 冰蓝作为高光
- 电光蓝仅用于关键节点
- 禁止霓虹化

---

## 十三、标题与标注规范（Title & Annotation）

### 1. 图表标题

- **位置**：顶部居中
- **字号**：24-32px（H2 级别）
- **作用**：快速建立上下文，解释核心原则
- **示例**：「相同原则：分层加载，避免 Token 浪费」

### 2. 区域标签

- **位置**：各区域顶部或左上角
- **字号**：16-18px
- **字重**：Semibold
- **示例**：「Claude Skills」「Notion Agent」

### 3. 细节标注

#### 何时需要详细标注

- 对比图：显示具体实现差异
- 技术文档：说明文件名、参数、规模
- 教学场景：帮助理解抽象概念

#### 标注规范

- **字号**：12-13px
- **颜色**：#4a5568（钢灰）
- **位置**：
    - 卡片内标注：居中或左对齐
    - 卡片外标注：靠近连接线端点
- **格式**：
    - 文件名用等宽字体
    - 规模数据用括号补充（如 "~100 tokens"）
    - Element 编号用 "Element 1/2/3" 格式

### 4. 信息密度控制

- **高密度场景**（技术文档、对比图）：每个模块都有标注
- **中密度场景**（流程图）：关键节点标注
- **低密度场景**（愿景图）：仅核心概念标注

---

## 十四、视觉重点强化技巧

### 1. 终点强调

- **满色块卡片**：使用 #3b82f6 电光蓝背景
- **图标加持**：清单、勾选、输出等终点性图标
- **位置**：流程最右侧或底部
- **尺寸**：略大于其他卡片（1.2x）

### 2. 对比区分

- **左侧（问题/旧方案）**：较复杂的视觉语言
- **右侧（解决方案/新方案）**：更清晰的视觉语言
- **中轴线**：虚线或细线分隔，可选

### 3. 流程贯穿

- **粗箭头**跨越整个画面底部
- 箭头上下标注关键概念
- 起点和终点用图标强化

---

## 十五、参考范例 (The Benchmark)

> 以下范例展示了在「数字理性主义」风格下，如何处理最困难的配图场景——用具象图形表达抽象动词。
> 设计前自检时，请回看这些范例，从中提取排版策略和隐喻手法。

### 范例 1：无界分区 + 物理退化（排版策略 B）

**原文概念**：AI 擅长画名词，不擅长画动词。需要把“时间流逝”翻译成可画的名词。

**排版策略**：无界分区坐标（Borderless Zoning）。画布用中间虚线分为 Left Zone 和 Right Zone，不使用卡片。

**隐喻手法**：
- 左侧（成功的名词）：一朵边缘锐利、细节完整的枯萎花朵，展示 AI 的具象刻画能力。
- 右侧（失败的动词 → 翻译为名词）：
  - Upper area：四个中文字符以`破碎、褰色、半透明`的浅灰轮廓渲染，带虚线碎裂笔划，仿佛正在溶解——这就是“物理退化代偿法”，用材质破损代替抽象概念。
  - Middle：一条向下弯曲的箭头，旁边标注“翻译为名词”。
  - Lower area：三个极清晰的具象物件（融化沙漏、飘散日历页、晨昏窗户），等距排列。

**色彩用法**：
- 结构和背景：冷白 (#f8fafc) + 钢灰 (#4a5568) 占据 90% 画面。
- 动作强调：电光蓝 (#3b82f6) 仅用于箭头、勾选标记、沙漏中流动的沙粒。
- 异常警示：琥珀 (#f59e0b) 仅用于标记“失败”的 X 号和窗户中的晨光。

**可复用的写法模式**：
- 物理退化：`rendered as broken, faded, semi-transparent outlines, with dashed fragmented strokes, as if dissolving`
- 绝对定位：`Upper area: ... / Middle: ... / Lower area: three small crisp objects in a row, evenly spaced`
- 颜色就地绑定：`electric blue (#3b82f6) sand particles`、`pale amber (#f59e0b) sunrise light`

### 范例 2：卡片画廊 + 原文意象直接采纳（排版策略 A）

**原文概念**：v1 分类体系的三个问题——图式不够用、风格和结构耦合、隐喻类图没有位置放。

**排版策略**：卡片画廊（Card Gallery）。三张编号白色卡片并排。

**隐喻手法**：
- 原文自带具象意象时直接采纳，不额外造隐喻。
- 卡片 1：四个倾斜的文件标签 + 一张找不到匹配位置的悬浮卡片。
- 卡片 2：两块板被一只手握住无法分开（一块是线框，一块是色板）。
- 卡片 3：一个打开的盒子（内含柱状图），盒子外一只融化的达利时钟放不进去。

**色彩用法**：
- 琥珀 (#f59e0b) 仅用于“不匹配/异常”的元素（卡片 1 的悬浮卡片边框）。
- 其余全部使用低饱和蓝灰。