[English](README.md) | [中文](README.zh-CN.md)

# LayerAxis Marketplace

基于 [Claude Code](https://docs.anthropic.com/en/docs/claude-code) 插件体系的**文章自动配图**工具 —— 粘贴一篇文章，获得可直接发布的配图。

提供三个插件，自动化程度各不相同：

| 插件 | 功能 | 自动化程度 |
|------|------|-----------|
| **layeraxis-v4-2agent** | 双 Agent 流水线（creative → render），读取文章后自动完成全部配图设计与生成 | 全自动 |
| **article-illustration-prompt** | 输出单张配图提示词，可粘贴到任意图像生成器使用 | 交互式 |
| **layeraxis-v4-5agent** | 五 Agent 门控流水线，每个阶段可独立检查和重放 | 全自动 |

## 工作原理

1. 你给 Claude 一篇文章（Markdown / URL / 直接粘贴）
2. **Creative Agent**（Opus）通读全文，判断哪些位置需要配图，为每张图设计构图、隐喻、配色和英文提示词
3. **Render Agent**（Haiku）调用 Gemini 图像 API 批量生成图片，并将结果插回文章

视觉风格遵循「数字理性主义 × 以人为本的极简主义」设计指南 —— 低饱和配色、CSS 级精确排版、用物理材质隐喻替代抽象剪贴画。

## 设计思路

这套系统经历了五次架构迭代，当前设计背后的核心教训：

**为什么不用一个 Agent？** 让单个 Agent 在同一个上下文里完成分析、发散、场景设计、风格上色、翻译、出图，会导致认知过载。它会稳定地丢失空间精度（绝对坐标）和色彩放置（内联十六进制色值）—— 而这两项恰恰是好配图和泛泛之图的分水岭。

**为什么不用五个 Agent？** 另一个极端 —— 把创作过程切成 lock → outline → scene → prompt → render 五段 —— 会在每次交接时杀死视觉想象力。负责翻译的 Agent 从未经历创作过程，它只是在映射符号。结果看起来机械正确，但情感上苍白。

**为什么是两个？** 甜蜜点：一个 Agent（Opus）持有完整的创作弧线 —— 阅读、拆图、评分、场景设计、上色、撰写英文提示词，全部在一个持续的上下文中完成。第二个 Agent（Haiku）只负责纯机械的出图步骤。创意连贯性得以保持，执行成本保持低廉。

**Compiler 的教训。** 早期的 3-Agent 版本在 creative 和 render 之间插入了一个「编译器」，负责将自由格式草稿结构化。实践中它成了信息折损点 —— 它把 creative agent 有意为之的选择「规范化」掉了。移除它之后，输出质量立刻提升。

**风格是约束，不是装饰。** 风格指南不是审美偏好 —— 它编码了三项从 Notion AI 手工配图实践中提炼的生产技法：
1. **物理退化代偿法** —— 抽象动词转化为具象的物理材质状态（碎裂、溶解、褪色）
2. **CSS 级坐标排版** —— 用 `Left Zone / Upper area` 等方位词锁定构图
3. **就地着色** —— 十六进制色值紧跟组件名词，不在末尾统一声明

这三条规则是「AI 剪贴画」和「在正式文章中立得住的配图」之间的区别。

## 前置条件

- 已安装 [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code)（`claude` 命令可用）
- 出图阶段需要 `GOOGLE_API_KEY`（Gemini 图像生成权限）
  - 放在项目根目录 `.env` 文件中，或通过环境变量导出：`export GOOGLE_API_KEY=...`

## 快速开始

```bash
# 1. 注册 marketplace
claude plugin marketplace add /path/to/layeraxis-marketplace

# 2. 安装插件（选一个）
claude plugin install layeraxis-v4-2agent@layeraxis-marketplace --scope project

# 3. 在 Claude Code 会话中输入触发词
/layeraxis-v4-2agent:layeraxis-orchestrator
```

## 插件选择指南

### layeraxis-v4-2agent（推荐）

双 Agent 自动化流水线，适合一篇文章一次性完成全部配图。

- 流水线：`creative-agent (Opus) → render-agent (Haiku)`
- 触发词：`/layeraxis-v4-2agent:layeraxis-orchestrator`
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

## 更新与卸载

```bash
# 更新
claude plugin update layeraxis-v4-2agent

# 卸载
claude plugin uninstall layeraxis-v4-2agent

# 移除整个 marketplace
claude plugin marketplace remove layeraxis-marketplace
```

## 许可证

[MIT](LICENSE)
