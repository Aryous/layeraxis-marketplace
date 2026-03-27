[English](README.md) | [中文](README.zh-CN.md)

# LayerAxis Marketplace

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) plugin marketplace for **automated article illustration** — paste an article, get publication-ready images.

It ships three plugins with different levels of automation:

| Plugin | What it does | Automation |
|--------|-------------|------------|
| **layeraxis-v4-2agent** | Two-agent pipeline (creative → render). Reads an article, designs all illustrations, and batch-generates images via Gemini. | Full auto |
| **article-illustration-prompt** | Outputs a single image prompt you can paste into any image generator. | Interactive |
| **layeraxis-v4-5agent** | Five-agent gated pipeline with per-stage checkpoints. More control, more knobs. | Full auto |

## How it works

1. You give Claude an article (Markdown / URL / pasted text)
2. The **creative agent** (Opus) reads the full article, identifies where illustrations add value, and designs each image — composition, metaphor, color palette, English prompt
3. The **render agent** (Haiku) runs a generation script against Gemini's image API and inserts the results back into the article

The visual style follows a "Digital Rationalism × Human-Centered Minimalism" guide — muted palettes, CSS-level layout precision, physical-material metaphors instead of abstract clip art.

## Design philosophy

This system evolved through five architecture iterations. The lessons behind the current design:

**Why not one agent?** A single agent doing analysis, brainstorming, scene design, style application, translation, and image generation in one context leads to cognitive overload. It consistently drops spatial precision (absolute coordinates) and color placement (inline hex values) — the two things that separate a good illustration from a generic one.

**Why not five agents?** The opposite extreme — splitting the creative process into lock → outline → scene → prompt → render — kills visual imagination at every handoff. The prompt-translation agent never experienced the creative process; it just maps symbols. The result looks mechanically correct but emotionally flat.

**Why two?** The sweet spot: one agent (Opus) holds the entire creative arc — reading, decomposing, scoring, designing, coloring, and writing the English prompt in a single sustained context. A second agent (Haiku) handles the purely mechanical render step. Creative coherence stays intact; execution stays cheap.

**The compiler lesson.** An earlier 3-agent version inserted a "compiler" between creative and render to structure free-form drafts. In practice it was an information loss point — it normalized away the creative agent's intentional choices. Removing it improved output quality immediately.

**Style as constraint, not decoration.** The style guide isn't aesthetic preference — it encodes three production techniques discovered from manual Notion AI illustration work:
1. **Physical degradation compensation** — abstract verbs become concrete material states (cracked, dissolved, faded)
2. **CSS-level coordinate layout** — `Left Zone / Upper area` positional words lock composition
3. **Inline coloring** — hex values sit next to the component noun, never collected at the end

These three rules are the difference between "AI clip art" and illustrations that hold up in a published article.

## Prerequisites

- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed (`claude` command available)
- A `GOOGLE_API_KEY` with Gemini image generation access (for the render step)
  - Put it in a `.env` file at your project root, or `export GOOGLE_API_KEY=...`

## Quick start

```bash
# 1. Register the marketplace
claude plugin marketplace add /path/to/layeraxis-marketplace

# 2. Install a plugin (pick one)
claude plugin install layeraxis-v4-2agent@layeraxis-marketplace --scope project

# 3. Run it — type the trigger in a Claude Code session
/layeraxis-v4-2agent:layeraxis-orchestrator
```

## Choosing a plugin

### layeraxis-v4-2agent (recommended)

Two-agent automated pipeline. Best for full-article illustration in one shot.

- Pipeline: `creative-agent (Opus) → render-agent (Haiku)`
- Trigger: `/layeraxis-v4-2agent:layeraxis-orchestrator`
- Outputs: `imgs-spec/` directory with designed prompts + generated PNGs

### article-illustration-prompt (lightweight)

No pipeline. Claude outputs a single prompt following the style guide — you paste it into Nano Banana Pro or any image generator.

- Trigger: `/article-illustration-prompt:article-illustration-prompt`
- Good for: one-off images, iterating on a single illustration, quick experiments

### layeraxis-v4-5agent (advanced)

Five-stage gated pipeline: `lock → outline → scene → prompt → render`. Each stage writes to disk and can be inspected / replayed independently.

- Trigger: `/layeraxis-v4-5agent:spec-v4-illustrator`
- Good for: debugging prompt quality, fine-grained control over each design phase

## Directory structure

```
layeraxis-marketplace/
  .claude-plugin/
    marketplace.json              # Marketplace manifest
  plugins/
    layeraxis-v4-2agent/
      .claude-plugin/plugin.json
      agents/                     # creative-agent, render-agent
      skills/                     # orchestrator, creative, render-and-integrate
    layeraxis-v4-5agent/
      .claude-plugin/plugin.json
      agents/                     # lock, outline, scene, prompt, render
      skills/
    article-illustration-prompt/
      .claude-plugin/plugin.json
      skills/article-illustration-prompt/
```

## Update & uninstall

```bash
# Update
claude plugin update layeraxis-v4-2agent

# Uninstall
claude plugin uninstall layeraxis-v4-2agent

# Remove the marketplace entirely
claude plugin marketplace remove layeraxis-marketplace
```

## License

[MIT](LICENSE)
