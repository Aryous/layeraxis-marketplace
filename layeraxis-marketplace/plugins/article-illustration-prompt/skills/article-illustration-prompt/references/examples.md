# Prompt Examples by Scene Type

High-quality reference prompts demonstrating each scene type. Study these before
generating — they show what good output looks like for this visual system.

---

## COMP — 对比/并置

### Example: 名词可画 vs 动词不可画

**Context**: AI draws nouns well but can't draw verbs. The work of illustration is translating verbs into nouns.

**Concept card**:
```
概念焦点：AI 画名词不画动词——抽象配图的核心是把动词翻译成名词性意象
功能层：锚定层
维度评分：结构 55 / 隐喻 80 / 情绪 30
视觉核心：左侧清晰的花（名词=可画）vs 右侧模糊文字经翻译变成三个清晰物件
```

**Prompt**:
```
Wide horizontal composition (16:9), split into left and right zones
by a vertical dashed line in light gray (#e2e8f0) at the center,
on a cool white background (#f8fafc) with a faint dot grid.

--- Left Zone ---
Bold label Chinese text "名词" at top in dark navy (#1a2332).
Center: a single wilting flower in isometric 2.5D vector style,
petals drooping and curling downward, stem slightly bent,
drawn with crisp steel gray (#4a5568) outlines,
petals filled with pale ice blue (#e0f2fe),
stem and leaves in light gray (#f1f5f9).
Lines are razor-sharp and perfectly rendered.
A small electric blue (#3b82f6) checkmark icon near the top-right.
Below the flower, small annotation in steel gray (#4a5568):
Chinese text "枯萎的花".

--- Right Zone ---
Bold label Chinese text "动词" at top in dark navy (#1a2332).
Upper area: four Chinese characters "时间流逝" rendered as broken,
faded, semi-transparent outlines in very light gray (#e2e8f0),
with dashed fragmented strokes, as if dissolving. A small amber
(#f59e0b) X mark beside the fading text.
Middle: a gentle downward curved arrow in electric blue (#3b82f6),
with annotation Chinese text "翻译为名词" in electric blue.
Lower area: three small crisp objects in a row, evenly spaced:
  Object 1: a melting hourglass, glass walls warped,
  sand grains flowing, electric blue (#3b82f6) sand particles.
  Object 2: calendar pages scattering and floating off an open
  calendar, page corners in electric blue (#3b82f6).
  Object 3: a window frame, left half warm sunrise in pale amber
  (#f59e0b), right half deep navy night sky (#1a2332).

Below both zones, a horizontal dashed line in electric blue (#3b82f6).
Centered Chinese annotation: "配图的核心工作：把动词翻译成名词"
in electric blue (#3b82f6).

Isometric 2.5D vector illustration, cool white gradient background,
low-saturation blue-gray palette, razor-clean edges,
soft ambient and contact shadows, grid-based layout,
minimal SaaS product diagram style, lots of whitespace.

All visible text in Chinese. No English text.
```

**Why this works**:
- Left zone: single crisp object with full physical detail (petal curl, stem bend)
- Right zone: progression from blurred/broken → arrow → crisp objects
- Three translation targets show richness of noun possibilities
- Each object has material state (warped glass, flowing sand, scattering pages)
- Rendering quality difference between zones carries the meaning

---

## ARCH — 多卡片并排

### Example: 三个问题（三联画）

**Context**: Three problems that broke a classification system. Each independent but parallel.

**Prompt**:
```
Isometric 2.5D vector illustration, wide horizontal composition (16:9).

Three equal-width cards arranged side by side with consistent spacing,
each card has white background (#f8fafc), subtle border (#e2e8f0),
rounded corners (12px), soft contact shadow.
Each card has a bold Chinese number at the top left corner ("1" / "2" / "3")
in dark navy (#1a2332), and a short Chinese subtitle below the number.

--- Card 1 (left): subtitle "schemas are not enough" ---
Inside the card, four upright tab-style file folders stand in a row
at the bottom, each with a Chinese label on the tab
("compare" / "process" / "concept" / "atmosphere"),
all in light gray (#f1f5f9) with thin border (#e2e8f0).
Above the folders, one single card floats in mid-air,
this card has a thin amber border (#f59e0b),
with Chinese label "metaphor anchoring" on it.
Between the floating card and the folders,
a small question mark symbol in steel gray (#4a5568).

--- Card 2 (center): subtitle "style and structure are coupled" ---
Two overlapping cards stuck together in the center of the card.
The left stuck-card shows thin grid lines and wireframe patterns.
The right stuck-card shows color swatches and gradient strips.
The two cards are visibly glued together at their touching edges,
with small adhesive marks where they meet.
A simplified line-drawn hand pulling from the right side,
but the cards won't separate.

--- Card 3 (right): subtitle "no place for metaphor images" ---
An open filing drawer on the left side of the card,
with a Chinese label "concept visualization" on the drawer front.
Inside the drawer, three small neat rectangular cards
showing simplified bar chart, pie chart, and table icons.
Leaning against the outside of the drawer on the right,
a simplified melting clock (minimal line art, Dali-inspired,
with soft drooping edges), clearly organic and fluid in shape,
contrasting with the rigid rectangular cards inside the drawer.

Below all three cards, a horizontal dotted line connects them,
leading to a centered Chinese text line at the bottom:
"when classification breaks down, the dimension itself is wrong",
rendered in semibold weight, electric blue (#3b82f6).

Cool white gradient background (#f8fafc),
low-saturation blue-gray palette, razor-clean edges,
soft ambient and contact shadows, grid-based layout,
lots of whitespace, minimal SaaS product diagram style.

All visible text in Chinese. No English text.
```

**Why this works**:
- Each card: ≤ 3 objects + 1 action hint (strict budget)
- Objects have distinct physical states (floating, glued, leaning)
- All cards share one visual domain (office/filing: folders, drawers, cards)
- Card 3's melting clock = organic vs rigid, shape carries meaning
- Bottom annotation ties three stories together

---

## FLOW — 流程/管线

### Example: Prompt 生成工作流

**Context**: Left-to-right pipeline showing raw text → selection → template → output.

**Prompt**:
```
A horizontal left-to-right workflow pipeline,
isometric 2.5D vector illustration.

Far left: a document card with a few lines of Chinese text,
representing "raw text input".
A curved dotted arrow leads right to a central selector hub:
four neatly arranged compartment boxes in a 2x2 grid,
each with a concise Chinese label on the lid
("对比" / "流程" / "概念" / "氛围"),
all boxes identical in size and shape, uniform spacing.

One compartment glows with a subtle ice-blue highlight (#e0f2fe),
indicating it is selected.
A dotted arrow from the selected compartment leads to
a template card with visible blank slots (placeholder lines).

A final curved arrow leads to an output card on the far right,
highlighted with electric blue (#3b82f6) background,
slightly larger than other cards (1.2x), with a small checkmark line icon.

Cool white gradient background (#f8fafc),
low-saturation blue-gray palette (#1a2332, #4a5568, #e0f2fe),
razor-clean edges, soft ambient and contact shadows,
grid-based layout, curved dotted arrows with round caps,
minimal SaaS product diagram style, lots of whitespace.

All visible text in Chinese. No English text.
```

**Why this works**:
- Simple left-to-right flow, no complex branching
- Each stage is a distinct physical object (document, compartment grid, template, output)
- Selection shown by glow, not text label
- Output card: color fill + size increase (standard emphasis pattern)
- Short prompt — FLOW needs less per-element detail than CONC or COMP

---

## CONC — 概念锚定

### Example: 情绪修辞作为叠加层

**Context**: "Emotion rhetoric" is an independent overlay layer, detachable from structure and metaphor layers.

**Prompt**:
```
Wide horizontal composition (16:9), cool white background (#f8fafc)
with faint dot grid. Main focus left-of-center.
Secondary sub-composition far right.

--- Main Composition: 三层叠加结构 ---
Three isometric 2.5D rectangular banner-format cards (3:1 ratio each)
stacked tilted backward 15°, front-to-back depth visible.
Each card has a 6px 3D side edge.

Bottom card (deepest, largest): "结构骨架"
Solid ice blue fill (#e0f2fe), thin electric blue border (#3b82f6),
side edge in dark navy (#1a2332). Left icon: isometric 2×2 cube cluster.
Bold Chinese title "结构骨架" in dark navy.
Smaller Chinese text "对比 / 流程 / 分层" in steel gray (#4a5568).

Middle card (elevated 16px above bottom, slightly narrower): "隐喻包装"
Light gray fill (#f1f5f9), thin dashed border in steel gray (#4a5568),
side edge in steel gray. Left icon: small hourglass silhouette.
Bold Chinese title "隐喻包装" in dark navy.
Smaller Chinese text "容器 / 路径 / 自然" in steel gray.

Top card (elevated 40px above middle — NOTICEABLY WIDER GAP): "情绪修辞"
Warm pale amber fill (#fef3c7), thin dashed border in amber (#f59e0b),
side edge in amber. 80% opacity so cards below show through faintly.
Left icon: abstract color-wash block with warm amber fade.
Bold Chinese title "情绪修辞" in amber (#f59e0b).
Smaller Chinese text "色温 / 光影 / 质感" in steel gray.
Top-right: small rounded badge, amber fill, white text "可选".

Thin curved dashed arrow in amber (#f59e0b), from bottom-right of amber card,
arcing outward to left edge of two-card stack below.
Label: Chinese text "可叠加到任意组合".

--- Secondary Sub-Composition (far right, smaller scale) ---
Two cards stacked (same tilted style, smaller): only ice-blue card and gray card.
No amber top card. Space above visibly empty.
Small Chinese label below: "不叠加也成立" in steel gray (#4a5568).
Slightly desaturated compared to main.

Below main composition, horizontal dashed line in electric blue (#3b82f6).
Centered Chinese annotation:
"情绪修辞不是功能层的属性——三个维度正交，互不绑定" in dark navy (#1a2332).

Isometric 2.5D vector illustration, cool white gradient background,
low-saturation blue-gray palette, razor-clean edges,
soft ambient and contact shadows, grid-based layout,
minimal SaaS product diagram style, lots of whitespace.

All visible text in Chinese. No English text.
```

**Why this works**:
- Physical gap (16px vs 40px) encodes "detachability" — spacing IS the meaning
- Secondary composition provides "without" contrast at smaller scale
- Amber = only warm color, marks the optional layer
- 80% opacity = visual proof of "overlay" behavior
- Arrow arcing back = "can be applied to any combination" as physical action

---

## EMOTION — 情绪场景

### Example: 翻译困境的"卡"感

**Context**: Being stuck — you have words but can't translate into visual description.

**Prompt**:
```
Wide horizontal composition (16:9), isometric 2.5D vector illustration,
single central scene, cool calm mood

Main card (left-center): an isometric 2.5D text input card,
white background #f8fafc, thin cold gray border #e2e8f0,
12px rounded corners, soft ambient shadow;
inside: large bold Chinese characters "职业倦怠" in dark navy #1a2332;
after the last character, a thin vertical cursor line in electric blue #3b82f6,
slightly taller than the text;
top edge: small Chinese label "提示词输入" in steel gray #4a5568

Floating zone (right half): three semi-transparent ghost silhouette shapes
at staggered heights, each ~35% opacity, steel gray #4a5568, no sharp edges:
Ghost 1 (upper): outline of a drooping wilted flower, petals curling
Ghost 2 (middle): outline of a hunched humanoid figure, arms resting
Ghost 3 (lower): a soft blurred horizontal wave line, featureless
Each ghost surrounded by dotted-line rectangular border in steel gray;
above each: a small question mark "?" in steel gray #4a5568

Background: cool white gradient #f8fafc, slightly darker toward right edge
fading to light cool gray #e2e8f0, minimal fog texture, lots of whitespace

Isometric 2.5D vector illustration, cool white gradient background,
low-saturation blue-gray palette, razor-clean edges,
soft ambient and contact shadows, lots of whitespace.
All visible text in Chinese. No English text.
```

**Why this works**:
- Left: solid, crisp (what you HAVE — the words)
- Right: ghostly, transparent (what you CAN'T FIND — the visual)
- Background darkening toward right = uncertainty growing
- Question marks = multiple failed attempts
- Cursor blinking after text = "waiting, stuck, no next step"
