# Changelog

本项目遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [0.2.0] - 2026-10-10

发布记录：[GitHub Release v0.2.0](https://github.com/lukidesign/asset-hub/releases/tag/v0.2.0)。

### Fixed

- 修复项目入口无法保持所选项目、资产详情入口仅显示提示，以及成员角色跨项目串联的问题。
- 导入队列补齐展示图、编辑和移除操作；缺少展示图的任务不会再被错误登记。
- 修复 3D 结构树与真实 GLB 查看器的联动，以及项目成员配置导致的白屏问题。

### Changed

- 资产库默认切换为宫格视图；将成熟度、文件类型和标签筛选集中至工具栏。
- 将 AI / MCP 中的 ChatGPT 客户端更名为 Claude，并补充客户端、授权与调用状态展示。
- 统一版本号为 `0.2.0`，补充设计资产中枢思维导图及其可导入源文件。

## [0.1.0] - 2026-10-10

发布记录：[GitHub Release v0.1.0](https://github.com/lukidesign/asset-hub/releases/tag/v0.1.0)。

### Added

- 首个可评审的 Vigour Asset Hub 原型版本。
- 本地资产库、项目与权限、导入队列、设计规范和 AI / MCP 管理模块。
- 可运行的 GLB 预览，以及 Dashboard 主楼和 inverter 资产包。
- GitHub Pages 构建工作流、构建产物检查和集中化文档目录。

### Changed

- 将产品与测试文档统一迁移至 `docs/`。
- 将本地原始输入收纳至 `reference/source-materials/`，不再推送重复的源素材。

### Known limitations

- 导入、权限和 MCP 交互均为本地原型状态；详情见 [功能与交互审查](docs/audits/2026-10-10-interaction-audit/report.md)。
