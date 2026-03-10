# LayerAxis Marketplace

LayerAxis 的 Claude Code 本地插件市场，提供两套配图流水线和一个独立提示词生成器：

- `layeraxis-v4-3agent`：LayerAxis V4（两阶段，creative → render）
- `layeraxis-v4-5agent`：SPEC V4（五阶段，结构化更强）
- `article-illustration-prompt`：单 Skill，直接输出 Nano Banana Pro 提示词

## 目录结构

```text
layeraxis-marketplace/
  .claude-plugin/
    marketplace.json
  plugins/
    layeraxis-v4-3agent/
      .claude-plugin/plugin.json
      agents/                        # creative-agent, render-agent
      skills/                        # layeraxis-orchestrator, layeraxis-creative, layeraxis-render-and-integrate
    layeraxis-v4-5agent/
      .claude-plugin/plugin.json
      agents/                        # lock, outline, scene, prompt, render
      skills/
    article-illustration-prompt/
      .claude-plugin/plugin.json
      skills/article-illustration-prompt/
```

## 前置条件

- 已安装 Claude Code CLI（`claude` 命令可用）
- 出图阶段需要可用的 `GOOGLE_API_KEY`
  - 推荐放在项目根目录 `.env`
  - 或通过环境变量导出：`export GOOGLE_API_KEY=...`

## 快速开始

1. 添加 marketplace

```bash
claude plugin marketplace add /path/to/layeraxis-marketplace
```

2. 安装插件

```bash
# 自动化流水线（按需选一）
claude plugin install layeraxis-v4-3agent@layeraxis-marketplace --scope project
claude plugin install layeraxis-v4-5agent@layeraxis-marketplace --scope project

# 单 Skill 提示词生成器
claude plugin install article-illustration-prompt@layeraxis-marketplace --scope project
```

3. 查看已安装插件

```bash
claude plugin list
```

## 三个插件如何选择

### layeraxis-v4-3agent（自动化流水线，推荐）

- 编排链路：`creative-agent → render-agent`
- 适合：一篇文章全量配图，自动批量出图并回写文章
- 触发词：`/layeraxis-v4-3agent:layeraxis-orchestrator`

### article-illustration-prompt（单张交互式，轻量）

- 无流水线，Claude 直接输出提示词，用户手动粘贴到 Nano Banana Pro
- 适合：单张配图设计、交互式调整、快速验证创意
- 触发词：`/article-illustration-prompt:article-illustration-prompt`

### layeraxis-v4-5agent（强门控，精细调试）

- 编排链路：`lock → outline → scene → prompt → render`
- 适合：需要阶段可回放、精细故障定位
- 触发词：`/layeraxis-v4-5agent:spec-v4-illustrator`

## 更新与卸载

```bash
# 更新
claude plugin update layeraxis-v4-3agent
claude plugin update article-illustration-prompt

# 卸载
claude plugin uninstall layeraxis-v4-3agent
claude plugin uninstall article-illustration-prompt

# 移除 marketplace
claude plugin marketplace remove layeraxis-marketplace
```
