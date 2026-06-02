# CLAUDE.md

Claude Code guidance for LayerAxis Marketplace. This repository is now dual-compatible with **Codex** and **Claude Code**.

Marketplace version: **0.4.0**.

## Distribution Layout

| Runtime | Marketplace file | Plugin manifest | Components |
| --- | --- | --- | --- |
| **Claude Code** | `.claude-plugin/marketplace.json` | `plugins/<plugin>/.claude-plugin/plugin.json` | `agents/` + `skills/` |
| **Codex** | `.agents/plugins/marketplace.json` | `plugins/<plugin>/.codex-plugin/plugin.json` | `skills/` + `.codex/agents/` |

When editing a plugin, keep the Claude and Codex manifests in sync. Claude Code can use the `agents/` folder; Codex ignores Claude agents and instead uses `.codex/agents/*.toml` plus explicit subagent spawning from the orchestrator skill.

## Plugin Priority

| Plugin | Version | Role |
| --- | --- | --- |
| **layeraxis-v4-2agent** | 0.4.0 | Canonical, actively maintained. Creative -> render pipeline. |
| layeraxis-v4-5agent | 0.2.0 | Legacy gated workflow. Scripts lag behind 2agent. |
| article-illustration-prompt | 0.2.0 | Standalone prompt generator. |

Default to `layeraxis-v4-2agent` for new work. New render engines and script behavior land there first.

## 2agent Pipeline

```text
orchestrator -> creative-agent-layeraxis -> render-agent-layeraxis
                         |                         |
                    outline.md                   *.png
                    NN-*.md             generation-summary.json
```

- `imgs-spec/plan.lock.yaml` is the single source of truth for `density`, `style_guide`, `negative_prompt`, and `generation.*`.
- Orchestrator writes `plan.lock.yaml`; creative/render read it only.
- Creative owns the full creative arc: read -> decompose -> score -> design -> color -> English prompt.
- Render is mechanical: generate PNGs, summarize results, and insert image references.

Claude Code trigger: `/layeraxis-v4-2agent:layeraxis-orchestrator` plus `/配图-layeraxis` and `/illustration-layeraxis`.

## Render Engines

| `generation.model` | Engine | Script | Requirement |
| --- | --- | --- | --- |
| `gemini` / `gemini-*` / `imagen-*` | Gemini image API | `gemini-image-api.js` | `GOOGLE_API_KEY` |
| `codex` / `gpt-image-*` | Codex CLI `image_gen` | `codex-image-api.js` | `codex` CLI installed and logged in |

The Codex engine uses `codex exec --json --sandbox danger-full-access --skip-git-repo-check`; it uses the user's Codex subscription, not `OPENAI_API_KEY`. The wrapper copies images from `$CODEX_HOME/generated_images/<thread_id>/` to `--output`.

## Running Render

```bash
node plugins/layeraxis-v4-2agent/skills/layeraxis-render-and-integrate/scripts/extract-and-generate.js \
  --input imgs-spec/ --output imgs-spec/
```

Use `--skip-existing` or `--only "04"` for retry/fix work. Never re-run the full batch blindly because it regenerates succeeded images and burns quota.

## Style

Use the duplicated `digital-rationalism` style guide inside each skill. Preserve:

1. Physical degradation for abstract verbs.
2. CSS-level coordinate layout.
3. Inline hex coloring next to component nouns.

## Versioning

- For changed plugins, bump both `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`.
- If the Claude marketplace catalog changes, bump `.claude-plugin/marketplace.json` `metadata.version`.
- Codex marketplace `.agents/plugins/marketplace.json` has no version field.
- Keep `README.md` and `README.zh-CN.md` in sync for user-facing behavior.
- Commit only after the user approves and tests pass.

## Repo Layout

```text
.agents/plugins/marketplace.json
.codex/agents/*.toml
.claude-plugin/marketplace.json
plugins/<plugin>/.codex-plugin/plugin.json
plugins/<plugin>/.claude-plugin/plugin.json
plugins/<plugin>/agents/
plugins/<plugin>/skills/<skill>/
```
