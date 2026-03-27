[English](README.md) | [中文](README.zh-CN.md)

# LayerAxis Marketplace

基于 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) 插件体系的**文章自动配图**工具 —— 粘贴一篇文章，获得可直接发布的配图。

提供三个插件，自动化程度各不相同：

| 插件 | 功能 | 自动化程度 |
|------|------|-----------|
| **layeraxis-v4-3agent** | 双 Agent 流水线（creative → render），读取文章后自动完成全部配图设计与生成 | 全自动 |
| **article-illustration-prompt** | 输出单张配图提示词，可粘贴到任意图像生成器使用 | 交互式 |
| **layeraxis-v4-5agent** | 五 Agent 门控流水线，每个阶段可独立检查和重放 | 全自动 |

## 工作原理

1. 你给 Claude 一篇文章（Markdown / URL / 直接粘贴）
2. **Creative Agent**（Opus）通读全文，判断哪些位置需要配图，为每张图设计构图、隐喻、配色和英文提示词
3. **Render Agent**（Haiku）调用 Gemini 图像 API 批量生成图片，并将结果插回文章

视觉风格遵循「数字理性主义 × 以人为本的极简主义」设计指南 —— 低饱和配色、CSS 级精确排版、用物理材质隐喻替代抽象剪贴画。

## 前置条件

- 已安装 [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code)（`claude` 命令可用）
- 出图阶段需要 `GOOGLE_API_KEY`（Gemini 图像生成权限）
  - 放在项目根目录 `.env` 文件中，或通过环境变量导出：`export GOOGLE_API_KEY=...`

## 快速开始

```bash
# 1. 注册 marketplace
claude plugin marketplace add /path/to/layeraxis-marketplace

# 2. 安装插件（选一个）
claude plugin install layeraxis-v4-3agent@layeraxis-marketplace --scope project

# 3. 在 Claude Code 会话中输入触发词
/layeraxis-v4-3agent:layeraxis-orchestrator
```

## 插件选择指南

### layeraxis-v4-3agent（推荐）

双 Agent 自动化流水线，适合一篇文章一次性完成全部配图。

- 流水线：`creative-agent (Opus) → render-agent (Haiku)`
- 触发词：`/layeraxis-v4-3agent:layeraxis-orchestrator`
- 产出：`imgs-spec/` 目录下的设计稿 + 生成的 PNG 图片

### article-illustration-prompt（轻量）

无流水线。Claude 按照风格指南输出单张提示词，你手动粘贴到 Nano Banana Pro 或其他图像生成器。

- 触发词：`/article-illustration-prompt:article-illustration-prompt`
- 适合：单张配图、反复调整某一张图、快速验证创意

### layeraxis-v4-5agent（进阶）

五阶段门控流水线：`lock → outline → scene → prompt → render`。每个阶段写入磁盘，可独立检查和重放。

- 触发词：`/layeraxis-v4-5agent:spec-v4-illustrator`
- 适合：排查提示词质量问题、对设计流程做精细控制

## 目录结构

```
layeraxis-marketplace/
  .claude-plugin/
    marketplace.json              # Marketplace 清单
  plugins/
    layeraxis-v4-3agent/
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

## 更新与卸载

```bash
# 更新
claude plugin update layeraxis-v4-3agent

# 卸载
claude plugin uninstall layeraxis-v4-3agent

# 移除整个 marketplace
claude plugin marketplace remove layeraxis-marketplace
```

## 许可证

[MIT](LICENSE)
