# AGENTS.md

Codex + Claude Code plugin marketplace for **automated article illustration**: read an article, design illustrations, batch-generate publication-ready images. Marketplace version: **0.4.0**.

## Architecture

This repository is intentionally dual-compatible:

| Runtime | Marketplace file | Plugin manifest | Workflow components |
| --- | --- | --- | --- |
| **Codex** | `.agents/plugins/marketplace.json` | `plugins/<plugin>/.codex-plugin/plugin.json` | `skills/` + `.codex/agents/` |
| **Claude Code** | `.claude-plugin/marketplace.json` | `plugins/<plugin>/.claude-plugin/plugin.json` | `agents/` + `skills/` |

It ships three plugins under `plugins/`:

| Plugin | Version | Role |
| --- | --- | --- |
| **layeraxis-v4-2agent** | 0.4.0 | Canonical, actively maintained. Two-stage creative -> render pipeline. |
| layeraxis-v4-5agent | 0.2.0 | Legacy five-stage gated pipeline. Scripts lag behind 2agent. |
| article-illustration-prompt | 0.2.0 | Standalone single-prompt generator, no batch pipeline. |

**Default to `layeraxis-v4-2agent` for any change.** New engine/script work lands there first; only port to 5agent after it is validated in 2agent.

## Runtime Semantics

Codex plugins do **not** load Claude Code `agents/` definitions. Codex multi-agent compatibility is provided through Codex subagent workflows:

- In Claude Code, `layeraxis-v4-2agent` may use `agents/creative-agent-layeraxis.md` and `agents/render-agent-layeraxis.md`.
- In Codex, `layeraxis-orchestrator` must spawn independent creative/render subagents. The orchestrator should keep only state routing, parameter locking, and Gate checks in the main thread.
- Project-scoped Codex custom agents live in `.codex/agents/*.toml`; if those custom agents are not visible, spawn independent worker subagents with equivalent role instructions.
- Do not silently degrade to current-agent creative/render execution. If subagents are unavailable, stop and tell the user.
- Do not document Claude slash commands as Codex triggers. Codex users install the plugin, start a new thread, and explicitly choose the plugin/skill or ask for the workflow.

## 2agent Pipeline

```text
orchestrator -> creative phase -> render phase
                    |                |
               outline.md          *.png
               NN-*.md     generation-summary.json
```

- `imgs-spec/plan.lock.yaml` is the single source of truth for global params: `density`, `style_guide`, `negative_prompt`, and `generation.*`.
- The orchestrator writes the lock file; creative and render read it only.
- Creative owns the full design arc: read -> decompose -> score -> design -> color -> write English prompt.
- Render is mechanical: generate images and write image references/summary.

Claude Code trigger: `/layeraxis-v4-2agent:layeraxis-orchestrator` plus aliases `/配图-layeraxis`, `/illustration-layeraxis`.

Codex trigger: install `layeraxis-v4-2agent`, then choose `layeraxis-orchestrator` or ask Codex to use LayerAxis for article illustration. That request authorizes the LayerAxis orchestrator to spawn its creative/render subagents.

## Conventions

- **Zero-dependency Node.** Scripts use only built-in modules (`fs`, `path`, `https`, `child_process`, `os`). Node >=18, no `package.json`, no build step, no TypeScript, no third-party deps.
- **Engine scripts are isomorphic.** `gemini-image-api.js` and `codex-image-api.js` share one CLI shape (`--prompt --aspect --output ...`) and emit the same single-line JSON contract: `{success, image_path, image_paths, generation_params, timestamp}` or `{success:false, error, error_kind}`.
- **Skills are self-contained.** Each skill's `references/`, `scripts/`, and `assets/` live inside its own directory. Shared assets such as `style-guides/digital-rationalism.md` are intentionally duplicated across skills/plugins; do not DRY them into a shared path.
- **Manifests stay paired.** When changing a plugin, keep `.codex-plugin/plugin.json` and `.claude-plugin/plugin.json` metadata in sync.

## Render Engines

The render step (`layeraxis-v4-2agent`) selects an image engine by `generation.model` in `imgs-spec/plan.lock.yaml`:

| `model` value | Engine | Script | Requirement |
| --- | --- | --- | --- |
| `gemini` / `gemini-*` / `imagen-*` | Gemini image API | `gemini-image-api.js` | `GOOGLE_API_KEY` |
| `codex` / `gpt-image-*` | Codex CLI `image_gen` | `codex-image-api.js` | `codex` CLI installed and logged in |

- The Codex engine drives `codex exec --json --sandbox danger-full-access --skip-git-repo-check` and delegates to Codex's built-in `image_gen` tool. It uses the user's Codex subscription, not `OPENAI_API_KEY`.
- The wrapper owns the handoff. After `codex exec` returns, `codex-image-api.js` copies the PNG from `$CODEX_HOME/generated_images/<thread_id>/` to `--output`; do not rely on the agent to `cp`.
- Codex aspect is passed as words such as `16:9`; never force pixel dimensions. `image_size` is Gemini-only.

## Running The Render Script

```bash
node plugins/layeraxis-v4-2agent/skills/layeraxis-render-and-integrate/scripts/extract-and-generate.js \
  --input imgs-spec/ --output imgs-spec/
```

| Flag | Purpose |
| --- | --- |
| `--only "04"` / `--only "01,03"` | Generate only named images by id or slug. |
| `--skip-existing` | Skip images whose PNG already exists. |

Never re-run the whole batch to fix a few images. Use `--skip-existing` or `--only`; blind reruns regenerate succeeded images and can double Codex quota usage.

## Style

Single style guide: **digital-rationalism** (`skills/*/references/style-guides/digital-rationalism.md`). It encodes three production techniques:

1. Physical degradation: abstract verbs become concrete material states.
2. CSS-level coordinate layout: positional words lock composition.
3. Inline coloring: hex values sit next to component nouns.

Preserve these rules in prompt-design changes.

## Versioning And Release

- Codex plugin manifests live at `plugins/<name>/.codex-plugin/plugin.json`.
- Claude Code plugin manifests live at `plugins/<name>/.claude-plugin/plugin.json`.
- When user-facing behavior changes, bump both manifests for the changed plugin.
- When the Claude marketplace catalog changes, also bump `.claude-plugin/marketplace.json` `metadata.version`.
- Codex repo marketplace `.agents/plugins/marketplace.json` has no version field.
- New engine/feature -> minor; bugfix -> patch.
- Commit only after the user approves and tests pass. Keep `README.md` and `README.zh-CN.md` in sync.

After a Codex plugin change, reinstall the plugin with `codex plugin add <plugin>@layeraxis-marketplace` and start a new thread. After a Claude Code plugin change, use `claude plugin update <plugin>` and reload plugins as needed.

## Testing

- Engine scripts: verify missing args, unsafe path, bad aspect, and engine-not-installed branches without API quota.
- Codex integration without quota: stub `codex` on `PATH` to emit a fake `--json` event stream and write a PNG into `$CODEX_HOME/generated_images/<thread>/`.
- Real Codex image run: use `--only` to validate a single image.
- Manifest validation: run `python3 /Users/lucas/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py plugins/<plugin>`.

## Repo Layout

```text
.agents/plugins/marketplace.json
.claude-plugin/marketplace.json
plugins/<plugin>/.codex-plugin/plugin.json
plugins/<plugin>/.claude-plugin/plugin.json
.codex/agents/*.toml
plugins/<plugin>/agents/
plugins/<plugin>/skills/<skill>/
README.md / README.zh-CN.md
```

`docs/`, `test-articles/`, `test-outputs/`, `archive/`, `.env`, `.claude/`, and local `.codex/` state outside `.codex/agents/` are author-side only and not shipped.
