---
name: article-illustration-prompt
description: >
  Generate Nano Banana Pro image prompts for article illustrations following a unified
  "Digital Rationalism × Human-Centered Minimalism" visual style. Use this skill whenever
  the user wants to create illustration prompts for blog posts, technical articles, product
  documentation, social media cards, or any written content that needs visual accompaniment.
  Also trigger when the user mentions "配图", "生成配图", "文章插图", "illustration prompt",
  "NBP prompt", "Nano Banana Pro", or asks to visualize a concept from their writing.
  Supports both automatic mode (paste article → get prompts) and interactive mode
  (guided questions → tailored prompt).
---

# Article Illustration Prompt Generator

将文字内容转化为符合视觉设计系统的 Nano Banana Pro 绘图提示词。

Before generating, read two reference files:
- `references/style-guide.md` — Visual design specification (colors, components, layout rules)
- `references/examples.md` — Curated high-quality prompt examples by scene type

When stuck on metaphor or structure ideas, consult `references/dimension-handbook.md`.

---

## 配图哲学

Internalize these five principles — they govern every decision:

**先看内容，再想画面。** The article's natural structure is the best composition clue.
Three parallel problems → three cards. A causal chain → two stacked layers. Don't impose
structure; reveal it.

**原文意象优先。** If the text contains concrete imagery, use it directly. Don't skip
past the author's own metaphors to invent new ones.

**AI 画名词，不画动词。** "Time passing" can't be drawn. "A melting hourglass with warped
glass walls and flowing sand" can. Every element in the prompt must be a concrete,
drawable noun with a physical state.

**设计和翻译分离。** Think through the scene in Chinese first. The English prompt is
pure translation — zero creative decisions happen at translation time.

**评分驱动深度。** Not every illustration needs deep work on all dimensions. A structure
diagram needs strong structural scaffolding but minimal metaphor. An emotional scene
needs mood but barely any structure. Invest cognitive resources where they matter.

---

## Workflow Overview

```
Read article → Split into illustrations → For each illustration:
  Assess function layer + dimension weights →
  Design scene (Chinese thinking) →
  Select scene type → Load prompt skeleton →
  Fill skeleton with scene content →
  Apply style + colors → Translate to English prompt
```

Present the split plan (拆图方案) to the user for confirmation before generating prompts.

---

## Design Engine (认知工具)

These tools guide the design thinking that happens BEFORE writing any prompt text.
Use them internally — the user sees the final prompt and composition guide, not these
intermediate steps.

### Function Layer Assessment

Each illustration serves one primary function:

| Layer | Purpose | Signal |
|---|---|---|
| **节奏层** | Visual breathing room between paragraphs | No specific info to convey |
| **情绪层** | Set emotional tone for upcoming text | Text builds feeling, impact, empathy |
| **锚定层** | Anchor an abstract concept with a concrete image | Abstract idea needs "get it at a glance" carrier |
| **结构层** | Show logical relationships between information | Text describes process, comparison, hierarchy |

### Three-Dimension Weighting

Three orthogonal dimensions determine design depth. The function layer sets the starting
weights; adjust based on actual content.

|  | 结构骨架 | 隐喻包装 | 情绪修辞 |
|---|---|---|---|
| **节奏层** | 0 | 0 | 20 |
| **情绪层** | 20 | 50 | 80 |
| **锚定层** | 20 | 80 | 50 |
| **结构层** | 80 | 20 | 20 |

- **≥ 70**: Deep design work — fully expand this dimension
- **30–69**: Light touch — weave in if content hints at it
- **< 30**: Skip — zero cognitive investment

### Metaphor Brainstorm (when 隐喻包装 ≥ 70)

If original text has concrete imagery → adopt directly, verify it's drawable.
If not → brainstorm 3 candidates across different metaphor types (容器/路径/工具/生态/空间),
select by: AI renderability > semantic fit > artistic expression.

Every metaphor must pass the noun check: is it a concrete object in a specific physical
state that NBP can render cleanly?

### Emotion Design (when 情绪修辞 ≥ 70)

Decide: what feeling? What intensity (轻触/中等/浓烈)?
Visual tools: color temperature shift, light/shadow contrast, texture, spatial
compression/expansion. Emotion is a color overlay — it tints the scene without
replacing the content.

---

## Scene Type System (结构骨架实施手册)

After determining the structural relationship in your content, select the matching
scene type. Each type provides a **tested prompt skeleton** — the spatial layout
that NBP reliably renders well for this structure.

### FLOW — 流程/管线/因果链

Use when: sequential steps, pipeline, agent logic, cause-effect chain.

**Prompt skeleton:**
```
Wide horizontal composition (16:9), horizontal left-to-right workflow pipeline...

[N] step cards arranged in a single row / S-shaped two rows,
connected by [thick/thin] [curved/dotted] arrows in electric blue (#3b82f6)
between each adjacent pair. Cards evenly spaced.

--- Step N: [name] ---
Card: [fill color], [border], rounded corners (radius 12).
Top-left: bold Chinese number "N" in dark navy (#1a2332).
Center icon: [specific icon description]. Bold Chinese label "[名称]".
```

Variations:
- **Single row**: ≤ 4 steps, simplest, most reliable
- **S-shaped two rows**: 5–6 steps, upper row left→right, arc connector, lower row left→right
- **Return loop**: add dashed arc from last step back to an earlier step for iteration

Key principle: One highlighted step (electric blue fill, 1.1–1.2× scale) as the
visual focal point. Usually the convergence or output step.

### COMP — 对比/并置/before-after

Use when: two things contrasted, old vs new, problem vs solution, A vs B.

**Prompt skeleton:**
```
Wide horizontal composition (16:9), split into left and right zones
by a vertical dashed line in light gray (#e2e8f0) at the center,
on a cool white background (#f8fafc) with a faint dot grid.

--- Left Zone ---
Bold label Chinese text "[左标签]" at top in dark navy (#1a2332).
[Left zone content: typically the "before" / problem / abstract state]

--- Right Zone ---
Bold label Chinese text "[右标签]" at top in dark navy (#1a2332).
[Right zone content: typically the "after" / solution / concrete state]

Below both zones, a horizontal dashed line in electric blue (#3b82f6)
spanning the full width. Centered Chinese annotation text beneath:
"[总结性文字]" in electric blue (#3b82f6).
```

Key principle: Left = problem/old/abstract (muted, blurred, constrained).
Right = solution/new/concrete (crisp, highlighted, open). The contrast in
rendering quality itself carries meaning.

### ARCH — 架构图/多卡片并排/信息面板

Use when: system components, parallel concepts, multi-faceted breakdown.

**Prompt skeleton:**
```
Wide horizontal composition (16:9), isometric 2.5D vector illustration.
[N] equal-width cards arranged side by side with consistent spacing,
each card: white background (#f8fafc), thin border (#e2e8f0),
rounded corners (12px), soft contact shadow.

--- Card N (position): subtitle "[副标题]" ---
Top-left: bold Chinese number "N" in dark navy (#1a2332),
short Chinese subtitle below.
[Card content: ≤ 3 core objects + ≤ 1 action hint]

Below all cards, a horizontal dashed line connecting them,
leading to centered Chinese annotation: "[总结]" in electric blue (#3b82f6).
```

Key principle: All cards share the same visual domain. Progressive tone shift
(gray→blue left to right) creates narrative arc without explicit labeling.

### CONC — 概念锚定/单场景

Use when: single abstract idea needs a concrete visual anchor. No complex structure.

**Prompt skeleton:**
```
Wide horizontal composition (16:9), isometric 2.5D vector illustration,
single central scene, [mood description]

Main subject ([position]): [detailed metaphor object description with
physical state, material properties, specific colors]

[Supporting elements if any: annotations, small badges, secondary objects]

Background: cool white gradient (#f8fafc), [mood-appropriate variation],
lots of whitespace
```

Key principle: The metaphor object IS the illustration. Spend token budget on
physical detail — material texture, deformation state, particle effects, light
interaction. This is where "物质感描写" matters most.

### ROUTE — 路由/映射/上下层关系

Use when: elements from one set connect to elements in another set, routing logic,
mapping between categories.

**Prompt skeleton:**
```
Wide horizontal composition (16:9), isometric 2.5D vector illustration,
two-zone stacked layout, clean information diagram

Upper zone — [source elements] arranged horizontally near top...
Middle zone — routing arrows: thick blue for primary, thin gray dashed for secondary
Lower zone — [target elements] arranged horizontally at center-bottom...

Below: dashed connector line + centered Chinese annotation
```

Key principle: Use arrow weight (thick blue vs thin gray dashed) to encode
primary vs secondary relationships. The visual hierarchy of connections IS the
information.

### EMOTION — 情绪场景/氛围图

Use when: establishing mood, no structural information to convey.

**Prompt skeleton:**
```
Wide horizontal composition (16:9), isometric 2.5D vector illustration,
single central scene, [specific mood: cool calm / tense / open expansive]

[Central scene: one main object/composition that embodies the mood]

Background: cool white gradient (#f8fafc), [mood variation:
  - anxiety: slightly darker toward edges
  - calm: even, minimal fog
  - tension: compressed space, elements closer together
  - openness: extra whitespace, floating elements]
```

Key principle: Mood is carried by spatial relationships, opacity, and subtle
color temperature — not by adding decorative elements. Less is more.

---

## Prompt Writing Craft (输出骨架)

Once the scene is designed in Chinese and a scene type skeleton is selected,
translate into the final English prompt following these rigid rules.

### Prompt Structure

Every prompt follows this four-part structure:

**Part 1 — Composition Declaration** (1–2 lines)
Overall shape, perspective, spatial division. Pulled from scene type skeleton.

**Part 2 — Zone/Card Descriptions** (bulk of the prompt)
Each zone or card gets a `--- Zone Name ---` separator. Within each zone:
- Describe objects top-to-bottom or left-to-right
- Every object gets its hex color at first mention (inline, not collected at end)
- Specify physical properties: shape, fill, border, corner radius, shadow
- Describe physical states: "petals drooping and curling downward, stem slightly bent"
- State spatial relationships: "above", "floating in mid-air", "leaning against"
- Chinese text content written verbatim: `Bold Chinese text "结构层" in white`

**Part 3 — Style Signature** (3–4 lines, identical across all illustrations)
```
Isometric 2.5D vector illustration, cool white gradient background,
low-saturation blue-gray palette, razor-clean edges,
soft ambient and contact shadows, grid-based layout,
minimal SaaS product diagram style, lots of whitespace.
All visible text in Chinese. No English text.
```

**Part 4 — Negative Prompt** (separate block)
```
no neon, no cyberpunk, no heavy texture, no harsh shadow,
no glossy reflection, no clutter, no photorealism,
no high saturation, no English text on the image
```

### Writing Quality Standards

**物质感 over UI 规格**: When describing metaphor objects (not UI cards), prioritize
physical/material properties over design specs. "Glass walls slightly warped, sand
grains flowing, amber sand particles scattered at the base" > "hourglass with
rounded corners and border". Cards get UI specs. Metaphor objects get physics.

**Dynamic states, not labels**: Objects should look like they're doing something or
in a state. "Faded, semi-transparent outlines with dashed fragmented strokes, as if
dissolving" > "blurred text". "Pages scattering and floating off an open calendar,
page corners highlighted" > "calendar showing date change".

**Progressive visual weight**: When multiple elements are stacked or sequenced,
explicitly state progression: "progressively taller and visually heavier from top
to bottom", "nearly transparent fill → light gray → ice blue → solid electric blue".

**Prompt length**: 200–400 words for standard scenes. Complex multi-panel up to 500.
Don't truncate for brevity — spatial description richness directly improves NBP output.

---

## 硬规则

Non-negotiable constraints:

- **元素上限**：可辨识视觉单元 ≤ 7 per illustration, prioritize whitespace
- **面板物件预算**：each card/panel: core objects ≤ 3, action hints ≤ 1
- **标注数量**：≤ 2 annotation points per illustration
- **标注逐字嵌入**：Chinese annotations written verbatim in prompt, format: `Chinese text "具体文字" at [position]`. Never use vague instructions like `Chinese title label`
- **语言声明**：every prompt ends with `All visible text in Chinese. No English text.`
- **禁止 emoji**
- **视觉域一致性**：all panels in a multi-panel illustration use objects from the same visual domain
- **颜色 inline**：colors declared with each object at first mention, never in a summary block
- **Only output prompts** — never generate images directly or produce UI mockups

---

## Multi-Panel Specification

When an illustration contains multiple side-by-side panels:

**Canvas**: default 16:9 horizontal. Declare in prompt Part 1.

**Containers**: each panel is a physical card (white #f8fafc background, border #e2e8f0,
12px rounded corners, soft shadow). Card specs stated before any scene content.
Never use "panel" or "area" — always "card".

**Navigation**: each card gets a bold number top-left ("1"/"2"/"3") in dark navy #1a2332,
with a Chinese subtitle below.

**Connections**: horizontal dashed line at bottom connecting all cards, summary text
in accent color below. Avoid thick arrows spanning the bottom.

---

## Output Format

For each illustration, output:

### 1. Image Concept Card (概念卡)
```
概念焦点：[one sentence]
功能层：[layer]
维度评分：结构 XX / 隐喻 XX / 情绪 XX
视觉核心：[one sentence describing the core visual idea]
```

### 2. English Prompt
In a code block. Four-part structure per §Prompt Writing Craft.

### 3. Negative Prompt
In a separate code block.

### 4. Composition Guide (构图说明, ≤ 150 words)
- 场景类型 + 功能层
- 隐喻设计 (what concept → what visual metaphor, and why)
- 视觉结构 (spatial arrangement sketch)
- 重点强化 (what stands out, how)
- 文章位置建议

---

## NBP Calibration Notes

- "Isometric 2.5D" is the strongest style anchor — always place first or near first
- Hex colors inline improve accuracy significantly over color names
- Zone separators (--- Zone Name ---) help NBP parse spatial divisions
- Chinese text: 2–6 characters rendered reliably; longer may degrade
- Physical depth cues: tilt angles ("tilted backward 15°"), z-offset ("floating above"),
  overlap ("partially covering"), opacity ("80% opacity, cards below show through faintly")
- Aspect ratio: always specify. 16:9 default.
- Too flat → add tilt, float, overlap descriptions
- Too busy → reduce to 3 elements per zone, strengthen "lots of whitespace"
- Single-row FLOW is more reliable than S-shaped for NBP
- Cards with progressive fill (transparent → gray → ice blue → solid blue) render well
