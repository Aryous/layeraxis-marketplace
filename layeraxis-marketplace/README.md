# LayerAxis Marketplace

LayerAxis 的 Claude Code 本地插件市场，提供两套可并行维护的配图架构：

- `layeraxis-v4-3agent`：LayerAxis V4（三阶段，创意优先）
- `layeraxis-v4-5agent`：SPEC V4（五阶段，结构化更强）

## 目录结构

```text
layeraxis-marketplace/
  .claude-plugin/
    marketplace.json
  plugins/
    layeraxis-v4-3agent/
      .claude-plugin/plugin.json
      agents/
      skills/
    layeraxis-v4-5agent/
      .claude-plugin/plugin.json
      agents/
      skills/
```

## 前置条件

- 已安装 Claude Code CLI（`claude` 命令可用）
- 出图阶段需要可用的 `GOOGLE_API_KEY`
  - 推荐放在项目根目录 `.env`
  - 或通过环境变量导出：`export GOOGLE_API_KEY=...`

## 快速开始

1. 添加 marketplace

```bash
claude plugin marketplace add /Users/aryous/Documents/Code/配图技能重构/layeraxis-marketplace
```

2. 查看 marketplace 列表

```bash
claude plugin marketplace list
```

3. 安装插件（建议 `project` 作用域）

```bash
claude plugin install layeraxis-v4-3agent@layeraxis-marketplace --scope project
claude plugin install layeraxis-v4-5agent@layeraxis-marketplace --scope project
```

4. 查看已安装插件

```bash
claude plugin list
```

## 两套流程如何选择

### layeraxis-v4-3agent（创意集中）

- 编排链路：`creative-agent-layeraxis -> compiler-agent-layeraxis -> render-agent-layeraxis`
- 适合：希望把算力集中在创作阶段，减少上下文切换
- 典型触发词：`/配图-layeraxis`、`/illustration-layeraxis`

### layeraxis-v4-5agent（结构化分工）

- 编排链路：`lock-agent -> outline-agent -> scene-agent -> prompt-agent -> render-agent`
- 适合：需要强门控、阶段可回放、精细故障定位
- 典型触发词：`/配图`、`/spec-v4-illustrator`

## 更新与卸载

更新 marketplace 与插件：

```bash
claude plugin marketplace update layeraxis-marketplace
claude plugin update layeraxis-v4-3agent
claude plugin update layeraxis-v4-5agent
```

卸载插件：

```bash
claude plugin uninstall layeraxis-v4-3agent
claude plugin uninstall layeraxis-v4-5agent
```

移除 marketplace：

```bash
claude plugin marketplace remove layeraxis-marketplace
```
