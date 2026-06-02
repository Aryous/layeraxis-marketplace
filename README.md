[English](README.md) | [中文](README.zh-CN.md)

# LayerAxis Marketplace

A Codex and Claude Code plugin marketplace for **automated article illustration**: paste an article, get publication-ready illustration prompts and generated images.

Marketplace version: **0.4.0**.

It ships three plugins with different levels of automation:

| Plugin | What it does | Best runtime |
|--------|-------------|--------------|
| **layeraxis-v4-2agent** | Recommended pipeline. Reads an article, designs all illustrations, and batch-generates images through Gemini or Codex. | Codex or Claude Code |
| **article-illustration-prompt** | Outputs a single image prompt you can paste into any image generator. | Codex or Claude Code |
| **layeraxis-v4-5agent** | Legacy gated pipeline with lock, outline, scene, prompt, and render stages. More checkpoints, more handoffs. | Claude Code first |

## Compatibility

LayerAxis keeps both plugin formats in the same repository:

| Runtime | Marketplace file | Plugin manifest | Workflow components |
|---------|------------------|-----------------|---------------------|
| **Codex** | `.agents/plugins/marketplace.json` | `plugins/<plugin>/.codex-plugin/plugin.json` | `skills/` + `.codex/agents/` |
| **Claude Code** | `.claude-plugin/marketplace.json` | `plugins/<plugin>/.claude-plugin/plugin.json` | `agents/` + `skills/` |

Codex plugins do not load Claude Code `agents/` definitions. In Codex, LayerAxis keeps the same multi-agent architecture by spawning Codex subagents for creative and render phases. The main Codex thread stays as the orchestrator: it creates the lock file, checks gates, and coordinates handoff.

## How It Works

1. You provide an article as Markdown, a URL, or pasted text.
2. The creative phase reads the full article, decides where illustrations add value, and writes `imgs-spec/outline.md` plus `imgs-spec/NN-*.md` prompt specs.
3. The render phase runs the generation script, writes PNGs, and records `imgs-spec/generation-summary.json`.

The visual style follows a "Digital Rationalism x Human-Centered Minimalism" guide: muted palettes, CSS-level layout precision, and concrete material metaphors instead of abstract clip art.

### Render Engines

The render step in `layeraxis-v4-2agent` selects an engine from `generation.model` in `imgs-spec/plan.lock.yaml`:

| `model` value | Engine | Requirement |
|---------------|--------|-------------|
| `gemini` / `gemini-*` / `imagen-*` | Gemini image API | `GOOGLE_API_KEY` |
| `codex` / `gpt-image-*` | Codex CLI `image_gen` | `codex` CLI installed and logged in |

The Codex engine drives `codex exec` to call Codex's built-in `image_gen` tool, then copies the generated PNG from `$CODEX_HOME/generated_images/<thread_id>/` to the requested output path.

## Prerequisites

- For Codex plugin use: Codex CLI installed and logged in.
- For Claude Code plugin use: Claude Code CLI installed.
- For rendering, one of:
  - Gemini: `GOOGLE_API_KEY` in the environment or a nearby `.env` file.
  - Codex image engine: Codex CLI installed and logged in, with `generation.model: codex`.

## Quick Start

### Codex

```bash
# 1. Register this repo as a local Codex marketplace
codex plugin marketplace add /path/to/layeraxis-marketplace

# 2. Install the recommended plugin
codex plugin add layeraxis-v4-2agent@layeraxis-marketplace

# 3. Start a new Codex thread, then ask for the workflow
Use layeraxis-orchestrator to illustrate this article.
```

You can also explicitly choose the plugin or bundled skill from the Codex plugin/skill picker.

### Claude Code

```bash
# 1. Register the Claude Code marketplace
claude plugin marketplace add /path/to/layeraxis-marketplace

# 2. Install the recommended plugin
claude plugin install layeraxis-v4-2agent@layeraxis-marketplace --scope project

# 3. Run it in a Claude Code session
/layeraxis-v4-2agent:layeraxis-orchestrator
```

## Choosing A Plugin

### layeraxis-v4-2agent (recommended)

Two-stage automated pipeline. Best for full-article illustration in one shot.

- Codex path: `layeraxis-orchestrator -> layeraxis-creative subagent -> layeraxis-render subagent`.
- Claude Code path: `creative-agent-layeraxis -> render-agent-layeraxis`.
- Outputs: `imgs-spec/` directory with designed prompts, generated PNGs, and a generation summary.

### article-illustration-prompt (lightweight)

No batch pipeline. Produces a single structured prompt following the LayerAxis style guide.

- Good for one-off images, prompt iteration, and quick experiments.

### layeraxis-v4-5agent (advanced / legacy)

Five-stage gated pipeline: `lock -> outline -> scene -> prompt -> render`. Each stage writes to disk and can be inspected or replayed independently.

- Good for debugging prompt quality and fine-grained design control.
- Scripts lag behind `layeraxis-v4-2agent`; new engine work should land in 2agent first.

## Directory Structure

```text
layeraxis-marketplace/
  .agents/plugins/marketplace.json       # Codex marketplace catalog
  .codex/agents/                         # Codex custom agent roles
  .claude-plugin/marketplace.json        # Claude Code marketplace catalog
  plugins/
    layeraxis-v4-2agent/
      .codex-plugin/plugin.json
      .claude-plugin/plugin.json
      agents/                            # Claude Code subagents
      skills/                            # Codex/Claude skills
    layeraxis-v4-5agent/
      .codex-plugin/plugin.json
      .claude-plugin/plugin.json
      agents/
      skills/
    article-illustration-prompt/
      .codex-plugin/plugin.json
      .claude-plugin/plugin.json
      skills/article-illustration-prompt/
```

## Update And Remove

For local Codex iteration, bump the changed plugin manifest version, reinstall, and start a new thread:

```bash
codex plugin add layeraxis-v4-2agent@layeraxis-marketplace
codex plugin remove layeraxis-v4-2agent@layeraxis-marketplace
codex plugin marketplace remove layeraxis-marketplace
```

For Claude Code:

```bash
claude plugin update layeraxis-v4-2agent
claude plugin uninstall layeraxis-v4-2agent
claude plugin marketplace remove layeraxis-marketplace
```

## License

[MIT](LICENSE)
