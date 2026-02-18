# 文件约定与目录结构

## 目录

- [输出目录](#输出目录) — 目录树概览
- [文件命名](#文件命名) — NN-{标签}-{描述}.md 命名规则
- [单图文件结构](#单图文件结构nn-md) — 场景设计 → 上色 → 概念卡 → English Prompt
- [outline.md 格式](#outlinemd-格式) — 一行一图的索引
- [plan.lock.yaml](#planlockyaml) — 全局生成参数
- [场景组装骨架](#场景组装骨架) — 分层结构模板
- [失效规则](#失效规则) — 参数变更时的重建策略

---

## 输出目录

```
article-folder/
├── article.md
└── imgs-spec/
    ├── plan.lock.yaml          # 全局参数（脚本读取）
    ├── outline.md              # 拆图索引（轻量）
    ├── 01-metaphor-xxx.md      # 单图文件（概念卡+场景+prompt 三合一）
    ├── 02-structure-xxx.md
    ├── 01-metaphor-xxx.png     # 生成的图片
    ├── 02-structure-xxx.png
    └── ...
```

## 文件命名

格式：`{两位数编号}-{图式标签}-{简短描述}.md`

- 编号带前导零：01, 02, ..., 10, 11
- 图式标签为开放词汇（metaphor, structure, comparison, flow, emotion, rhythm 等），不是固定枚举
- 示例：`01-metaphor-translation-gap.md`、`03-structure-four-layers.md`

## 单图文件结构（NN-*.md）

每张图一个文件，结构即思考链路：

```markdown
## 原文
（从文章中摘录该图对应的段落原文，保持原样，不缩写不改写）

## 场景设计
（隐喻 brainstorm，仅当隐喻≥70时）
- 候选1：xxx — 语义✓ 可渲染✓ 风格✓ → 选中
- 候选2：xxx — 语义✓ 可渲染△ 风格✓
- 候选3：xxx — 语义△ 可渲染✓ 风格✓
选择理由：...

全局：构图方向、比例、整体布局
容器：（多面板时）卡片规格定义
逐面板/主体：每个物件的形态规格 + 标注文字（标题+副标题）+ 语义标记（✓/✗/?） + 空间关系
连接元素：虚线、箭头、底部标注文字（点明整体论点）
情绪基调：（情绪 ≥70 时）整体情绪色彩

## 上色
（Step 3 加载风格指南后，为每个物件标注颜色）
背景：#hex
物件A：#hex
物件B：#hex
强调元素：#hex
...

## 概念卡
概念焦点：[一句话说明这张图要表达什么]
功能层：[节奏层/情绪层/锚定层/结构层]
结构 XX / 隐喻 XX / 情绪 XX
视觉核心：[一句话描述画面的核心创意]

## English Prompt
[纯英文提示词，脚本从此 section 提取]

Wide horizontal composition (16:9), cool white background (#f8fafc)...
...
All visible text in Chinese. No English text.
```

**关键规则**：
- 无 YAML frontmatter
- 文件结构即思考链路：**原文锚定 → 发散 → 组装 → 上色 → 回望确认 → 翻译**
- `## 原文` 是场景设计的输入锚点——设计时反复回看原文具体措辞，避免凭印象设计
- 场景设计阶段只管形状和空间，**不标注颜色**；隐喻 brainstorm 是场景设计的子流程，不独立成 section
- 上色在 Step 3 完成后回写到 `## 上色` section，颜色 inline 跟物件走
- 概念卡在场景和上色之后、英文提示词之前——是创作完成后的**回望总结**，不是预设
- `## English Prompt` 下方的内容是脚本读取的提示词，上方所有 section 是思考过程

## outline.md 格式

```markdown
拆图方案：共 N 张

图 1：[概念焦点]
  功能层：锚定层
  结构骨架: 20 / 隐喻包装: 85 / 情绪修辞: 55
  依据：原文有明确隐喻素材「融化的时钟」，概念抽象度高需要锚定...

图 2：...
...
```

评分依据、隐喻推敲等深度思考跟着每张图的独立文件走，不在 outline 中展开。

## plan.lock.yaml

全局生成参数，模板见 @assets/plan-lock-template.yaml。

必锁字段：`density` / `style_guide` / `generation.model` / `generation.aspect_ratio` / `generation.image_size`

可选字段：`negative_prompt`（从风格指南提取，缺失时为空）

## 场景组装骨架

设计场景时按分层结构组织：

```
全局：构图方向、比例、整体布局
容器：多面板时的卡片物理规格（尺寸、描边、圆角、阴影）
逐面板：每个物件的形态规格 + 标注文字（标题+副标题）+ 语义标记（✓/✗/?） + 空间关系（前后/上下/内外）
连接元素：面板间的虚线、箭头、底部标注文字（点明整体论点）
情绪基调：整体的情绪色彩（如有）
```

> 多面板图的详细规范见 @references/multi-panel-spec.md

## 失效规则

- `density` 变更 → 重新拆图（outline.md + 所有 NN-*.md 作废）
- `style_guide` 变更 → 重新上色和翻译（NN-*.md 的场景设计和 prompt 需更新）
- 单张图的概念卡/场景调整 → 只需更新该图文件，不影响其他图
