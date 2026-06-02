[English](README.md) | [中文](README.zh-CN.md)

# LayerAxis Marketplace

面向 **Codex 与 Claude Code 双兼容**的文章自动配图插件市场：粘贴一篇文章，生成可发布的配图提示词与图片。

Marketplace 版本：**0.4.0**。

提供三个插件，自动化程度各不相同：

| 插件 | 功能 | 最适合的运行时 |
|------|------|----------------|
| **layeraxis-v4-2agent** | 推荐流水线。读取文章，完成全篇配图设计，并通过 Gemini 或 Codex 批量出图。 | Codex 或 Claude Code |
| **article-illustration-prompt** | 输出单张配图提示词，可粘贴到任意图像生成器使用。 | Codex 或 Claude Code |
| **layeraxis-v4-5agent** | 旧版门控流水线，包含 lock、outline、scene、prompt、render 阶段。检查点更多，交接也更多。 | Claude Code 优先 |

## 兼容方式

LayerAxis 在同一个仓库里保留两套插件格式：

| 运行时 | Marketplace 文件 | Plugin manifest | 工作流组件 |
|--------|------------------|-----------------|------------|
| **Codex** | `.agents/plugins/marketplace.json` | `plugins/<plugin>/.codex-plugin/plugin.json` | `skills/` + `.codex/agents/` |
| **Claude Code** | `.claude-plugin/marketplace.json` | `plugins/<plugin>/.claude-plugin/plugin.json` | `agents/` + `skills/` |

Codex plugin 不加载 Claude Code 的 `agents/` 定义。在 Codex 中，LayerAxis 通过 spawn Codex subagents 保持同样的多 Agent 架构：主线程只做 orchestrator，负责创建 lock、检查 gate、协调交接；creative 与 render 都在独立 subagent 上下文中执行。

## 工作原理

1. 你提供 Markdown、URL 或直接粘贴的文章。
2. Creative 阶段通读全文，判断哪些位置需要配图，并写出 `imgs-spec/outline.md` 与 `imgs-spec/NN-*.md`。
3. Render 阶段运行出图脚本，写入 PNG，并记录 `imgs-spec/generation-summary.json`。

视觉风格遵循「数字理性主义 x 以人为本的极简主义」：低饱和配色、CSS 级精确排版、用具体材质隐喻替代抽象剪贴画。

### 出图引擎

`layeraxis-v4-2agent` 的出图阶段由 `imgs-spec/plan.lock.yaml` 中的 `generation.model` 选择引擎：

| `model` 取值 | 引擎 | 前提 |
|-------------|------|------|
| `gemini` / `gemini-*` / `imagen-*` | Gemini 图像 API | `GOOGLE_API_KEY` |
| `codex` / `gpt-image-*` | Codex CLI 内置 `image_gen` | 本机已安装 `codex` 并登录 |

Codex 引擎通过 `codex exec` 调用 Codex 内置的 `image_gen` 工具，然后由 wrapper 从 `$CODEX_HOME/generated_images/<thread_id>/` 拷贝 PNG 到目标路径。

## 前置条件

- 使用 Codex plugin：已安装并登录 Codex CLI。
- 使用 Claude Code plugin：已安装 Claude Code CLI。
- 出图阶段需要二选一：
  - Gemini：环境变量或附近 `.env` 文件中存在 `GOOGLE_API_KEY`。
  - Codex image engine：Codex CLI 已登录，并在 `generation.model` 中设置 `codex`。

## 快速开始

### Codex

```bash
# 1. 注册本仓库为本地 Codex marketplace
codex plugin marketplace add /path/to/layeraxis-marketplace

# 2. 安装推荐插件
codex plugin add layeraxis-v4-2agent@layeraxis-marketplace

# 3. 开启新的 Codex 线程，然后提出任务
Use layeraxis-orchestrator to illustrate this article.
```

也可以在 Codex 的 plugin / skill 选择器里显式选择插件或技能。

### Claude Code

```bash
# 1. 注册 Claude Code marketplace
claude plugin marketplace add /path/to/layeraxis-marketplace

# 2. 安装推荐插件
claude plugin install layeraxis-v4-2agent@layeraxis-marketplace --scope project

# 3. 在 Claude Code 会话中运行
/layeraxis-v4-2agent:layeraxis-orchestrator
```

## 插件选择

### layeraxis-v4-2agent（推荐）

双阶段自动化流水线，适合一篇文章一次性完成全部配图。

- Codex 路径：`layeraxis-orchestrator -> layeraxis-creative subagent -> layeraxis-render subagent`。
- Claude Code 路径：`creative-agent-layeraxis -> render-agent-layeraxis`。
- 产出：`imgs-spec/` 下的设计提示词、生成 PNG 与 generation summary。

### article-illustration-prompt（轻量）

无批量流水线。按 LayerAxis 风格指南输出单张结构化提示词。

- 适合单张配图、提示词迭代、快速验证创意。

### layeraxis-v4-5agent（进阶 / 旧版）

五阶段门控流水线：`lock -> outline -> scene -> prompt -> render`。每个阶段写入磁盘，可独立检查或重放。

- 适合排查提示词质量问题、精细控制设计过程。
- 脚本落后于 `layeraxis-v4-2agent`；新引擎能力应先落到 2agent。

## 目录结构

```text
layeraxis-marketplace/
  .agents/plugins/marketplace.json       # Codex marketplace 清单
  .codex/agents/                         # Codex custom agent 角色
  .claude-plugin/marketplace.json        # Claude Code marketplace 清单
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

## 更新与移除

本地 Codex 迭代时，先 bump 变更插件的 manifest 版本，然后重新安装并开启新线程：

```bash
codex plugin add layeraxis-v4-2agent@layeraxis-marketplace
codex plugin remove layeraxis-v4-2agent@layeraxis-marketplace
codex plugin marketplace remove layeraxis-marketplace
```

Claude Code：

```bash
claude plugin update layeraxis-v4-2agent
claude plugin uninstall layeraxis-v4-2agent
claude plugin marketplace remove layeraxis-marketplace
```

## 许可证

[MIT](LICENSE)
