# Vigour Asset Hub

Vigour 的本地设计资产库原型。它演示资产发现、导入、项目协作、3D 模型查看和本地模拟的 AI / MCP 管理界面。

> 这是前端原型：资产、权限、导入队列及 MCP 连接均为本地状态，不连接生产存储、账号或外部权限。

## 快速开始

```bash
npm ci
npm run dev
```

打开终端提供的本地地址。生产构建与交付检查：

```bash
npm run build
npm run test:sites
```

需要 Node.js 20 或更高版本。

## 目录

```text
src/                         React 界面与交互状态
public/assets/               随应用发布的图片、GLB 与资产包
docs/                        产品、设计与测试文档
  audits/                    已完成的原型审查记录与截图
reference/                   设计参考素材
  source-materials/          本地原始输入，仅本机保留，不提交 Git
scripts/                     资产导出与构建辅助脚本
tests/                       静态站点交付测试
worker/                      Sites 运行时入口
.github/workflows/           GitHub Pages 自动构建与发布
```

`public/assets` 是页面运行依赖，提交到 Git。`reference/source-materials` 保留用户提供的原始文件与可再导出的输入，已被 Git 忽略，避免将重复的本地交付素材推到远端。

## 发布

推送到 `main` 会由 GitHub Actions 构建并发布 GitHub Pages。Vite 在 GitHub Actions 环境自动使用 `/asset-hub/` 作为资源前缀。

## 文档

- [设计 QA](docs/design-qa.md)
- [2026-10-10 功能与交互审查](docs/audits/2026-10-10-interaction-audit/report.md)
- [历史原型审查](docs/audits/2026-10-08-prototype-audit.md)
- [原型复查](docs/audits/2026-10-09-prototype-reassessment.md)

## 版本

当前版本为 [`v0.1.0`](CHANGELOG.md)：首个可评审的 Asset Hub 原型发布基线。
