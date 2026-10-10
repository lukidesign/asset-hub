import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
  ArrowCounterClockwise, ArrowLeft, ArrowsClockwise, ArrowsOutSimple, Bell,
  BoundingBox, CaretDown, CaretRight, ChatCircleDots, CheckCircle, CloudArrowUp,
  Copy, Crosshair, Cube, CubeFocus, Database, DotsThree, DownloadSimple, Eye,
  EyeSlash, FileArrowUp, FileText, FlowArrow, FolderOpen, Funnel, Gear, GridFour,
  Hand, Info, LinkSimple,
  ListBullets, LockSimple, MagnifyingGlass, Minus, PaperPlaneTilt, Pause, Play,
  Plug, PlugsConnected, Plus, Power, Pulse, Robot, Selection, ShieldCheck,
  SidebarSimple, Sparkle, SquaresFour, Tag, TerminalWindow, Trash, TreeStructure,
  UserPlus, WarningCircle, Wrench, X, Ruler,
} from "@phosphor-icons/react";

const publicAsset = (fileName) => `${import.meta.env.BASE_URL}assets/${fileName}`;

const ASSETS = [
  { id: "VGR-PRD-001248", name: "工业离心泵 · 装配模型（高精度）", shortName: "工业离心泵", type: "3D 模型", source: "百度网盘", fileType: "GLB / GLTF", tags: ["工业设备", "高精度"], version: "v2.3.0", owner: "王凯", role: "机械设计", updated: "2026-10-08 14:20", maturity: "已发布", size: "286.4 MB", image: publicAsset("industrial-pump.png"), accent: "blue" },
  { id: "VGR-UI-000731", name: "新能源汽车 HMI 交互规范", shortName: "新能源 HMI 规范", type: "UI 规范", source: "Figma", fileType: "FIG", tags: ["UI / HMI", "交互规范"], version: "v1.5.2", owner: "李娜", role: "体验设计", updated: "2026-10-07 16:43", maturity: "已发布", size: "42.1 MB", image: publicAsset("automotive-hmi.png"), accent: "violet" },
  { id: "VGR-SKILL-000112", name: "AI 3D 生成 · 工业零件", shortName: "AI 3D 生成 Skill", type: "Skill 卡", source: "本地上传", fileType: "ZIP / 素材包", tags: ["AI 生成", "工业设备"], version: "v0.9.1", owner: "陈默", role: "算法工程", updated: "2026-10-06 19:28", maturity: "候选", size: "12.3 MB", visual: "skill", accent: "purple" },
  { id: "VGR-RPT-000089", name: "2026 工业设备趋势报告", shortName: "工业设备趋势报告", type: "研究报告", source: "阿里云盘", fileType: "PDF", tags: ["研究报告", "工业设备"], version: "v1.0.0", owner: "何宇", role: "市场研究", updated: "2026-10-06 10:11", maturity: "已验证", size: "8.4 MB", image: publicAsset("smart-factory.png"), accent: "green" },
  { id: "VGR-PRD-001244", name: "园区资产包 CAMPUS ASSETS", shortName: "园区资产包", type: "3D 模型", source: "本地上传", fileType: "资产包展示图", tags: ["园区资产", "数字孪生", "资产包"], version: "v0.1.0", owner: "林思远", role: "资产运营", updated: "2026-10-10 15:20", maturity: "候选", size: "展示图", image: publicAsset("imported/campus-assets/preview.png"), accent: "blue", project: "智能制造设备系列", sourceFile: "reference/source-materials/img/EasyAsset - 数字孪生资产平台.png" },
  { id: "VGR-PRD-001257", name: "Low Industrial Workshop Q", shortName: "工业低矮厂房 Q", type: "3D 模型", source: "外部公开链接", fileType: "GLB", tags: ["工业建筑", "厂房", "用户提供"], version: "v0.1.0", owner: "林思远", role: "资产提供人", updated: "2026-10-10 10:00", maturity: "候选", size: "177 KB + 共享贴图", visual: "workshop", accent: "blue", project: "智能制造设备系列", externalUrl: "https://rj-assets-2-hunter5.vercel.app/", modelUrl: "https://rj-assets-2-hunter5.vercel.app/models/buildings/kenney-industrial/building-q.glb", sourceName: "Runjian 3D Model Review · Kenney City Kit Industrial" },
  { id: "VGR-PRD-001258", name: "Dashboard 中央主楼", shortName: "Dashboard 中央主楼", type: "3D 模型", source: "本地上传", fileType: "GLB / GLTF", tags: ["园区建筑", "程序化场景", "本地导入"], version: "v0.1.0", owner: "林思远", role: "资产运营", updated: "2026-10-10 11:30", maturity: "候选", size: "21.6 MB", image: publicAsset("imported/dashboard-main-building/preview2.png"), accent: "blue", project: "智能制造设备系列", modelUrl: publicAsset("imported/dashboard-main-building/dashboard-main-building.glb"), packageUrl: publicAsset("imported/dashboard-main-building-asset-package.zip"), manifestUrl: publicAsset("imported/dashboard-main-building/manifest.json"), packageNote: "GLB 贴图内嵌；含运行时生成的屋顶文字贴图", sourceFile: "reference/source-materials/Dashboard.html" },
  { id: "VGR-PRD-001259", name: "inverter 逆变器", shortName: "inverter 逆变器", type: "3D 模型", source: "本地上传", fileType: "GLB", tags: ["能源设备", "逆变器", "本地导入"], version: "v0.1.0", owner: "林思远", role: "资产运营", updated: "2026-10-10 15:00", maturity: "候选", size: "1.5 MB", image: publicAsset("imported/inverter/preview.png"), accent: "blue", project: "智能制造设备系列", modelUrl: publicAsset("imported/inverter/inverter_web.glb"), sourceFile: "reference/source-materials/glbcx/inverter_web.glb" },
  { id: "VGR-UI-000698", name: "Vigour 管理后台组件规范", shortName: "后台组件规范", type: "UI 规范", source: "Figma", fileType: "FIG", tags: ["设计系统", "交互规范"], version: "v3.2.0", owner: "林思远", role: "产品设计", updated: "2026-10-03 14:18", maturity: "已验证", size: "35.7 MB", visual: "ui", accent: "violet" },
  { id: "VGR-UI-000699", name: "ECC AI 设计工程化规范", shortName: "ECC AI 设计工程化", type: "UI 规范", source: "Figma", fileType: "FIG", tags: ["ECC AI", "设计工程化", "设计规范"], version: "v0.1.0", owner: "林思远", role: "产品设计", updated: "2026-10-10 12:00", maturity: "候选", size: "Figma 链接", image: publicAsset("imported/ecc-ai-design-engineering/cover.png"), accent: "violet", project: "企业设计系统 v3", externalUrl: "https://www.figma.com/design/EyQA98e4ZC3lbSFkiYe28l/ECC-AI-%E8%AE%BE%E8%AE%A1%E5%B7%A5%E7%A8%8B%E5%8C%96?node-id=0-1&t=iHj8jDJL2DQ04H4t-1", sourceName: "ECC AI 设计工程化 · Figma 文件" },
  { id: "VGR-WF-000301", name: "设计来源接入与脱敏流程", shortName: "来源接入与脱敏", type: "工作流", source: "钉钉链接", fileType: "链接", tags: ["工作流", "治理"], version: "v1.1.0", owner: "王雨桐", role: "资产运营", updated: "2026-10-02 09:45", maturity: "试点", size: "6.9 MB", visual: "workflow", accent: "orange" },
  { id: "VGR-SKILL-000113", name: "Vigour ECC UI（能碳设计规范Skill）", shortName: "Vigour ECC UI", type: "Skill 卡", source: "外部公开链接", fileType: "GitHub 仓库", tags: ["能碳设计", "ECC", "UI 规范"], version: "v0.1.0", owner: "林思远", role: "产品设计", updated: "2026-10-10 14:30", maturity: "候选", size: "GitHub 链接", visual: "skill", accent: "purple", project: "企业设计系统 v3", externalUrl: "https://github.com/kun-nuk/energy-carbon-design-system", sourceName: "Vigour ECC UI · GitHub 仓库" },
  { id: "VGR-WF-000321", name: "AI 3D 场景设计与业务平台协作 SOP", shortName: "AI 3D 场景协作 SOP", type: "工作流", source: "钉钉链接", fileType: "钉钉文档", tags: ["AI 3D", "场景设计", "协作 SOP"], version: "v0.1.0", owner: "林思远", role: "资产运营", updated: "2026-10-10 14:30", maturity: "候选", size: "钉钉链接", visual: "workflow", accent: "orange", project: "智能制造设备系列", externalUrl: "https://alidocs.dingtalk.com/i/nodes/Obva6QBXJwmBGAj9ILozvn39Wn4qY5Pr?utm_scene=team_space", sourceName: "AI 3D 场景设计与业务平台协作 SOP · 钉钉文档" },
];

const SOURCE_OPTIONS = [
  { name: "本地上传", count: 16, kind: "文件导入", detail: "拖拽或批量导入", status: "可用", tone: "green", icon: FileArrowUp },
  { name: "百度网盘", count: 10, kind: "云盘链接", detail: "分享链接与提取码", status: "已连接", tone: "green", icon: CloudArrowUp },
  { name: "阿里云盘", count: 8, kind: "云盘链接", detail: "分享链接导入", status: "已连接", tone: "green", icon: CloudArrowUp },
  { name: "钉钉链接", count: 9, kind: "协作链接", detail: "文档、知识库、AI 表格", status: "2 条需复核", tone: "orange", icon: LinkSimple },
  { name: "外部公开链接", count: 1, kind: "公开网页", detail: "用户提供的可追溯模型参考", status: "已登记", tone: "green", icon: LinkSimple },
  { name: "企业文件库", count: 0, kind: "NAS / SMB", detail: "团队共享盘与历史归档", status: "待接入", tone: "gray", icon: FolderOpen },
  { name: "对象存储", count: 0, kind: "S3 / OSS / COS", detail: "大体积模型与交付包", status: "待接入", tone: "gray", icon: Database },
  { name: "Figma", count: 8, kind: "设计链接", detail: "文件与页面链接", status: "已连接", tone: "green", icon: Selection },
];

const SUGGESTED_SOURCE_OPTIONS = [
  { name: "研发资料库", kind: "PLM / PDM", detail: "实际系统确定后再纳入接入范围", icon: Database },
  { name: "外部公开链接", kind: "网页链接", detail: "适合公开资料与可追溯参考", icon: LinkSimple },
];

const PROJECTS = [
  { name: "智能制造设备系列", category: "产品研发", participating: true, pending: false, assets: 15, members: 8, status: "进行中", updated: "今天 14:20", cover: publicAsset("industrial-pump.png") },
  { name: "新能源座舱 HMI", category: "体验 / HMI", participating: true, pending: true, assets: 18, members: 11, status: "评审中", updated: "昨天 16:43", cover: publicAsset("automotive-hmi.png") },
  { name: "企业设计系统 v3", category: "设计系统", participating: false, pending: false, assets: 16, members: 14, status: "规划中", updated: "10 月 6 日", cover: publicAsset("smart-factory.png") },
];

const MEMBERS = [
  { name: "王凯", role: "项目管理员", team: "机械设计", last: "刚刚", avatar: "WK" },
  { name: "李娜", role: "编辑者", team: "体验设计", last: "12 分钟前", avatar: "LN" },
  { name: "张强", role: "评审者", team: "项目管理", last: "今天 11:02", avatar: "ZQ" },
  { name: "陈默", role: "查看者", team: "算法工程", last: "昨天 19:28", avatar: "CM" },
];

const MCP_CLIENTS = [
  { id: "chatgpt", name: "ChatGPT", description: "对话式资产检索与预览", icon: ChatCircleDots, color: "emerald", status: "已连接", tools: 6, calls: 1248, latency: "418 ms" },
  { id: "codex", name: "Codex", description: "开发工作流与资产引用", icon: TerminalWindow, color: "blue", status: "已连接", tools: 8, calls: 936, latency: "286 ms" },
  { id: "feishu", name: "飞书", description: "知识库与协作内容同步", icon: PaperPlaneTilt, color: "cyan", status: "需复核", tools: 5, calls: 406, latency: "672 ms" },
  { id: "workbuddy", name: "WorkBuddy", description: "项目执行与团队智能体", icon: Robot, color: "violet", status: "未连接", tools: 0, calls: 0, latency: "—" },
];

const TOOL_PERMISSIONS = ["搜索资产", "读取元数据", "生成预览", "请求下载", "写入标签", "创建项目引用"];

const MODEL_PARTS = [
  { id: "assembly", name: "离心泵总成", meta: "装配体 · 128 个节点", depth: 0 },
  { id: "pump", name: "泵体组件", meta: "42 个节点", depth: 1 },
  { id: "impeller", name: "叶轮与转轴", meta: "18 个节点", depth: 2 },
  { id: "seal", name: "机械密封", meta: "12 个节点", depth: 2 },
  { id: "motor", name: "驱动电机", meta: "36 个节点", depth: 1 },
  { id: "base", name: "安装底座", meta: "20 个节点", depth: 1 },
];

const DASHBOARD_BUILDING_PARTS = [
  { id: "building", name: "中央主楼（main）", meta: "根节点 · 46 个网格", depth: 0 },
  { id: "tower", name: "主楼塔体", meta: "外立面、窗格与楼层", depth: 1 },
  { id: "podium", name: "裙楼与入口", meta: "入口平台与弧形立面", depth: 1 },
  { id: "roof", name: "屋顶设备", meta: "屋顶构件与设备基础", depth: 1 },
  { id: "signage", name: "屋顶文字贴图", meta: "运行时生成 · 已内嵌", depth: 1 },
];

const INVERTER_PARTS = [
  { id: "inverter-root", name: "INVERTER_WEB_ROOT", meta: "根节点 · 3 个节点", depth: 0 },
  { id: "inverter-body", name: "INVERTER_WEB_MESH", meta: "逆变器本体 · 2 个网格", depth: 1 },
  { id: "inverter-screen", name: "INVERTER_DISPLAY_SCREEN", meta: "显示屏组件", depth: 1 },
];

function getModelDetailData(asset) {
  const isDashboardExport = asset.id === "VGR-PRD-001258";
  const isInverter = asset.id === "VGR-PRD-001259";
  if (isDashboardExport) return {
    isDashboardExport,
    isLocalGlb: true,
    parts: DASHBOARD_BUILDING_PARTS,
    rootPart: "building",
    textureFiles: [["building_basecolor", "基础色", "内嵌于 GLB · 运行时材质"], ["roof_signage", "文字贴图", "内嵌于 GLB · Canvas 生成"]],
    tabs: ["GLB", "资产包"],
    viewerMeta: "21.6 MB · 本地资产包",
    checks: "GLB 结构与内嵌贴图完整",
    properties: [["格式", "GLB"], ["版本", asset.version], ["大小", asset.size], ["包内容", "GLB + PNG + 清单"], ["网格节点", "46"], ["内嵌贴图", "2 张"]],
    description: "从 Dashboard 的 Three.js 运行时场景导出的中央主楼。资产包保留主楼几何体、材质与屋顶文字贴图；仪表盘界面、实时数据、动画和周边场景不属于该模型。",
    sourceName: "本地上传 / Dashboard 场景导出",
    sourceMeta: "来源文件：reference/source-materials/Dashboard.html",
    hotspots: [
      { id: "tower", label: "主楼塔体", note: "程序化楼层与外立面", left: "52%", top: "49%" },
      { id: "podium", label: "裙楼入口", note: "弧形入口与平台", left: "46%", top: "64%" },
      { id: "roof", label: "屋顶设备", note: "设备基础与屋顶构件", left: "58%", top: "31%" },
    ],
    versions: [[asset.version, "当前版本", "从 Dashboard 中央主楼导出并登记本地资产包", "2026-10-10"]],
    primaryDownload: "资产包",
  };
  if (isInverter) return {
    isDashboardExport: false,
    isLocalGlb: true,
    parts: INVERTER_PARTS,
    rootPart: "inverter-root",
    textureFiles: [["embedded_image_01", "内嵌图像", "GLB 内嵌 · 3 项"], ["embedded_image_02", "内嵌图像", "GLB 内嵌"], ["embedded_image_03", "内嵌图像", "GLB 内嵌"]],
    tabs: ["GLB"],
    viewerMeta: "1.5 MB · 本地 GLB",
    checks: "GLB 结构、材质与内嵌图像已识别",
    properties: [["格式", "GLB"], ["版本", asset.version], ["大小", asset.size], ["场景", "1"], ["网格 / 节点", "2 / 3"], ["材质 / 图像", "2 / 3"]],
    description: "用户提供的 inverter 逆变器本地三维模型，包含逆变器本体、显示屏组件与内嵌图像。当前资产库保留原始 GLB 和展示图，并提供可交互的 WebGL 预览。",
    sourceName: "本地上传 / inverter_web.glb",
    sourceMeta: "来源文件：reference/source-materials/glbcx/inverter_web.glb",
    hotspots: [],
    versions: [[asset.version, "当前版本", "从用户提供的 inverter_web.glb 登记为本地资产", "2026-10-10"]],
    primaryDownload: "GLB",
  };
  return {
    isDashboardExport: false,
    isLocalGlb: false,
    parts: MODEL_PARTS,
    rootPart: "assembly",
    textureFiles: [["pump_basecolor.jpg", "基础色", "4096 × 4096 · 18.6 MB"], ["pump_normal.png", "法线", "4096 × 4096 · 32.4 MB"], ["motor_roughness.jpg", "粗糙度", "2048 × 2048 · 8.1 MB"], ["metallic_mask.png", "金属度", "2048 × 2048 · 6.8 MB"]],
    tabs: ["GLB", "GLTF"],
    viewerMeta: "12.4 MB · Web 优化版",
    checks: "结构、贴图与 Web 预览文件完整",
    properties: [["格式", "GLB / GLTF"], ["版本", asset.version], ["大小", asset.size], ["包围盒", "1840 × 620 × 820 mm"], ["面数", "284,620"], ["节点 / 材质", "128 / 12"]],
    description: "标准化高精度离心泵装配模型，包含完整结构、密封、轴承与接口。适用于设备方案演示、数字孪生与培训场景。",
    sourceName: "百度网盘 / 团队归档",
    sourceMeta: "链接校验于 2026-10-08 12:01",
    hotspots: [
      { id: "inlet", label: "入口法兰", note: "DN200 · PN16", left: "34%", top: "49%" },
      { id: "seal", label: "机械密封", note: "双端面密封组件", left: "51%", top: "58%" },
      { id: "motor", label: "驱动电机", note: "45 kW · IE4", left: "69%", top: "43%" },
    ],
    versions: [["v2.3.0", "当前版本", "完成 Web 轻量化与贴图校验", "2026-10-08"], ["v2.2.1", "已发布", "密封结构优化", "2026-09-26"], ["v2.1.0", "已归档", "材质与命名修订", "2026-09-11"], ["v1.8.0", "已归档", "首次评审版本", "2026-08-22"]],
    primaryDownload: "GLB",
  };
}

function IconButton({ label, children, className = "", onClick, active = false }) {
  return <button className={`icon-button ${active ? "is-active" : ""} ${className}`} aria-label={label} title={label} onClick={onClick}>{children}</button>;
}

function StatusDot({ tone = "green" }) { return <span className={`status-dot status-dot--${tone}`} aria-hidden="true" />; }

function Maturity({ value }) {
  const tone = value === "已发布" ? "green" : value === "已验证" ? "blue" : value === "待评审" || value === "候选" ? "orange" : "gray";
  return <span className={`maturity maturity--${tone}`}><StatusDot tone={tone} />{value}</span>;
}

function SourceIcon({ name, size = 18 }) {
  const source = SOURCE_OPTIONS.find((item) => item.name === name);
  const Icon = source?.icon || Database;
  return <Icon size={size} weight="duotone" aria-hidden="true" />;
}

function AssetVisual({ asset, large = false }) {
  if (asset.image) return <img className={`asset-visual ${large ? "asset-visual--large" : ""}`} src={asset.image} alt="" />;
  const Icon = asset.visual === "workflow" ? FlowArrow : asset.visual === "skill" ? Sparkle : asset.visual === "workshop" ? Cube : SquaresFour;
  return <div className={`asset-visual asset-visual--icon asset-visual--${asset.accent} ${large ? "asset-visual--large" : ""}`}><Icon size={large ? 48 : 28} weight="duotone" /></div>;
}

function GenericAssetDetail({ asset, setView, notify }) {
  const hasExternalLink = Boolean(asset.externalUrl);
  const isExternalModel = hasExternalLink && asset.type === "3D 模型";
  const isPackagedModel = Boolean(asset.modelUrl) && !isExternalModel;
  const externalAction = asset.source === "Figma" ? "打开 Figma 文件" : asset.type === "Skill 卡" ? "打开 GitHub 仓库" : asset.type === "工作流" ? "打开钉钉文档" : "查看来源模型";
  return <main className="generic-detail-view">
    <div className="detail-topbar generic-detail-topbar"><button className="back-button" onClick={() => setView("library")}><ArrowLeft size={18} />返回资产库</button><div className="detail-path">资产资源库 <CaretRight size={13} /> {asset.type} <CaretRight size={13} /> {asset.shortName}</div><div className="toolbar-actions"><button className="button button--secondary" onClick={() => { navigator.clipboard?.writeText(hasExternalLink ? asset.externalUrl : isPackagedModel ? asset.modelUrl : asset.id); notify(hasExternalLink ? "来源链接已复制（原型）" : isPackagedModel ? "模型地址已复制（原型）" : "资产 ID 已复制到剪贴板（原型）"); }}><Copy size={17} />{hasExternalLink ? "复制来源链接" : isPackagedModel ? "复制模型地址" : "复制 ID"}</button>{hasExternalLink ? <a className="button button--primary" href={asset.externalUrl} target="_blank" rel="noreferrer"><LinkSimple size={18} />{externalAction}</a> : isPackagedModel ? <a className="button button--primary" href={asset.packageUrl} download><DownloadSimple size={18} />下载资产包</a> : <button className="button button--primary" onClick={() => notify("下载任务已创建（原型）")}><DownloadSimple size={18} />创建下载任务</button>}</div></div>
    <section className="generic-detail-card"><div className="generic-detail-visual"><AssetVisual asset={asset} large /></div><div className="generic-detail-copy"><span className="soft-badge">{asset.type}</span><h1>{asset.name}</h1><p>{asset.id}</p><Maturity value={asset.maturity} /><p className="generic-detail-description">{isExternalModel ? "这是由用户提供的公开 GLB 参考资产。原始模型与共享贴图保留在来源页面；当前原型只登记元数据与可追溯链接，不会下载、托管或渲染该外部文件。" : hasExternalLink && asset.source === "Figma" ? "这是由用户提供的 Figma 设计规范。原始设计文件保留在 Figma；当前资产库登记来源链接、版本、标签与本地展示图，便于检索和项目引用。" : hasExternalLink && asset.type === "Skill 卡" ? "这是由用户提供的能碳设计规范 Skill。原始内容保留在 GitHub；当前资产库登记来源链接、版本、标签与项目归属，便于发现和复用。" : hasExternalLink && asset.type === "工作流" ? "这是由用户提供的 AI 3D 场景设计与业务平台协作 SOP。原始文档保留在钉钉；当前资产库只登记可追溯链接与治理元数据。" : isPackagedModel ? "这是从 Dashboard 运行时 Three.js 场景导出的本地 GLB 资产包。展示图、模型、来源文件和导出清单均已登记；贴图内嵌在 GLB 中，实时数据、界面控件和动态灯光不属于模型包。" : "这是该资产的本地模拟详情。当前类型不提供 3D 工作台，但会保留正确的资产身份、来源、版本和后续操作入口。"}</p><div className="generic-detail-actions">{hasExternalLink ? <a className="button button--primary" href={asset.externalUrl} target="_blank" rel="noreferrer"><LinkSimple size={18} />{externalAction}</a> : isPackagedModel ? <><a className="button button--primary" href={asset.packageUrl} download><DownloadSimple size={18} />下载本地资产包</a><a className="button button--secondary" href={asset.modelUrl} download><Cube size={18} />单独下载 GLB</a><a className="button button--secondary" href={asset.manifestUrl} target="_blank" rel="noreferrer"><Info size={18} />查看导出清单</a></> : <><button className="button button--primary" onClick={() => notify(`已打开“${asset.shortName}”预览（原型）`)}><Eye size={18} />查看预览</button><button className="button button--secondary" onClick={() => notify("已加入“智能制造设备系列”项目（原型）")}><FolderOpen size={18} />加入项目</button></>}</div></div></section>
    <section className="generic-metadata"><div><small>资产来源</small><strong>{asset.source}</strong></div><div><small>文件类型</small><strong>{asset.fileType}</strong></div><div><small>版本</small><strong>{asset.version}</strong></div><div><small>负责人</small><strong>{asset.owner} · {asset.role}</strong></div><div><small>最近更新</small><strong>{asset.updated}</strong></div><div><small>标签</small><strong>{asset.tags.join(" · ")}</strong></div>{hasExternalLink && <div><small>来源页面</small><a href={asset.externalUrl} target="_blank" rel="noreferrer">{asset.sourceName || asset.externalUrl}</a></div>}{isPackagedModel && <><div><small>来源文件</small><strong>{asset.sourceFile}</strong></div><div><small>资产包说明</small><strong>{asset.packageNote}</strong></div></>}</section>
  </main>;
}

function AppHeader({ view, setView, query, setQuery, notify, team, recentAssets, onOpen }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const nav = [["home", "首页"], ["dashboard", "工作台"], ["library", "资产库"], ["docs", "文档"]];
  const alerts = [["链接健康", "2 条钉钉链接等待复核", "刚刚"], ["评审队列", "3 项资产将在今天到期", "12 分钟前"], ["导入完成", "新能源汽车 HMI 规范已完成登记", "1 小时前"]];
  const activeNav = (id) => view === id || (view === "detail" && id === "library");
  return <header className="app-header"><div className="topbar">
    <button className="brand" onClick={() => setView("home")} aria-label="返回首页"><img className="brand-logo" src={publicAsset("vigour-logo01.png")} alt="" /><strong>Vigour</strong><span className="brand-divider-mark">/</span><span className="brand-product">Asset Hub</span></button>
    <nav className="section-nav" aria-label="主导航">{nav.map(([id, label]) => <button key={id} className={activeNav(id) ? "is-active" : ""} onClick={() => setView(id)}>{label}</button>)}</nav>
    <div className="topbar-actions">
      <label className="global-search"><MagnifyingGlass size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索资产" /><kbd>⌘ K</kbd></label>
      <IconButton label="上传与导入" className="topbar-shortcut" active={view === "upload"} onClick={() => { setView("upload"); setNotificationsOpen(false); setProfileOpen(false); }}><CloudArrowUp size={20} weight="bold" /></IconButton>
      <div className="header-menu"><IconButton label="通知" active={notificationsOpen} onClick={() => { setNotificationsOpen((open) => !open); setProfileOpen(false); }}><Bell size={20} />{unread && <span className="notification-dot" />}</IconButton>{notificationsOpen && <div className="header-popover notification-popover"><div className="popover-head"><strong>通知</strong><button onClick={() => { setUnread(false); notify("已标记全部通知为已读"); }}>全部已读</button></div>{alerts.map(([title, copy, time]) => <button className="notification-item" key={title} onClick={() => { setNotificationsOpen(false); setView(title === "链接健康" || title === "评审队列" ? "library" : "upload"); notify(`已打开“${title}”相关内容`); }}><span className="notification-symbol"><Bell size={16} /></span><span><strong>{title}</strong><small>{copy}</small></span><em>{time}</em></button>)}<button className="popover-footer" onClick={() => { setNotificationsOpen(false); setView("library"); }}>查看全部动态 <CaretRight size={14} /></button></div>}</div>
      <IconButton label="MCP 接入中心" className="topbar-shortcut" active={view === "mcp"} onClick={() => { setView("mcp"); setNotificationsOpen(false); setProfileOpen(false); }}><PlugsConnected size={20} weight="bold" /></IconButton>
      <span className="topbar-divider" />
      <div className="header-menu"><button className="avatar" aria-label="打开个人菜单" onClick={() => { setProfileOpen((open) => !open); setNotificationsOpen(false); }}>L</button>{profileOpen && <div className="header-popover profile-popover"><div className="profile-summary"><span className="avatar">L</span><span><strong>林思远</strong><small>产品设计 · {team}</small></span></div><div className="recent-popover"><div><strong>最近访问</strong><button onClick={() => { setProfileOpen(false); setView("library"); }}>查看全部</button></div>{recentAssets.map((asset) => <button key={asset.id} onClick={() => { setProfileOpen(false); onOpen(asset); }}><AssetVisual asset={asset} /><span><strong>{asset.shortName}</strong><small>{asset.type} · {asset.updated.slice(5, 10)}</small></span><CaretRight size={14} /></button>)}</div><button className="profile-navigation" onClick={() => { setProfileOpen(false); setView("projects"); }}><ShieldCheck size={16} />项目与权限</button><button onClick={() => notify("个人资料页为下一阶段功能（原型）")}>个人资料</button><button onClick={() => notify("偏好设置已打开（原型）")}>偏好设置</button><button className="danger" onClick={() => notify("原型模式：未执行退出登录")}>退出登录</button></div>}</div>
    </div>
  </div></header>;
}

function Home({ setView }) {
  return <main className="home-view"><section className="home-hero"><div className="home-hero__copy"><span className="home-eyebrow">VIGOUR ASSET HUB</span><h1>让每一份设计资产<br />成为可复用的数字底座</h1><p>集中管理模型、规范与协作内容，让团队从发现、预览到项目复用始终保持同一份可信资产上下文。</p><div className="home-actions"><button className="button button--primary" onClick={() => setView("dashboard")}><Cube size={18} />进入工作台</button><button className="button button--secondary" onClick={() => setView("library")}>浏览资产库 <CaretRight size={16} /></button></div><div className="home-trust"><span><strong>3D</strong><small>模型与资产包</small></span><span><strong>UI</strong><small>规范与设计链接</small></span><span><strong>AI</strong><small>工作流协作</small></span></div></div><div className="home-hero__visual"><div className="home-orbit home-orbit--one" /><div className="home-orbit home-orbit--two" /><div className="home-visual-card"><span>ASSET SPACE</span><strong>统一设计资产<br />数字底座</strong><small>发现 · 治理 · 复用</small></div><img src={publicAsset("imported/campus-assets/preview.png")} alt="园区数字资产预览" /></div></section><section className="home-capabilities"><div><span className="home-eyebrow">WORKFLOW</span><h2>从资产沉淀到项目协作</h2></div><div className="home-capability-list"><article><Cube size={22} weight="duotone" /><strong>统一资产入口</strong><p>接入本地文件、云盘和设计链接，保留来源与版本。</p></article><article><Eye size={22} weight="duotone" /><strong>轻量三维预览</strong><p>在需要时进入沉浸式查看器，检查模型和交付信息。</p></article><article><FlowArrow size={22} weight="duotone" /><strong>项目化复用</strong><p>将可用资产带入项目空间，保障团队协作边界。</p></article></div></section></main>;
}

function Documentation() {
  const groups = [
    { id: "foundation", title: "基础", description: "统一视觉语言与页面节奏。", items: [["色彩", "品牌蓝、语义色与中性色层级", SquaresFour], ["排版", "中文界面的字号、字重与行高", FileText], ["间距与布局", "4 px 基线、内容宽度与响应式栅格", GridFour], ["图标", "Phosphor 线性图标及语义约定", Sparkle]] },
    { id: "general", title: "通用组件", description: "页面中反复出现的基础交互单元。", items: [["Button 按钮", "主次操作、危险操作与加载状态", Selection], ["Input 输入框", "搜索、文本录入与校验反馈", MagnifyingGlass], ["Select 选择器", "单选筛选和表单选项", CaretDown], ["Tabs 标签页", "同层内容切换与数量徽标", ListBullets], ["Modal 对话框", "确认、配置与补充信息", SquaresFour], ["Badge 状态", "成熟度、连接状态与风险提示", CheckCircle], ["Table 表格", "高密度资产和成员数据", GridFour], ["Tooltip 提示", "仅用于图标操作的文字说明", Info]] },
    { id: "business", title: "资产业务组件", description: "围绕资产接入、治理与项目复用建立的领域组件。", items: [["Asset Card", "缩略图、类型、成熟度与来源", Cube], ["Filter Rail", "分类、来源和多选条件", Funnel], ["Import Queue", "导入进度、状态与补充登记", CloudArrowUp], ["Project Panel", "项目范围、资产与成员协作", FolderOpen], ["Permission Matrix", "项目角色与最小权限配置", ShieldCheck], ["MCP Client Card", "客户端状态、工具授权与调用统计", PlugsConnected]] },
    { id: "viewer", title: "3D 体验组件", description: "从轻量预览逐步进入沉浸式检查。", items: [["Model Viewer", "真实本地 GLB 旋转、平移与缩放", CubeFocus], ["Structure Tree", "模型节点层级与选中状态", TreeStructure], ["Texture Panel", "贴图清单、分辨率与通道信息", BoundingBox], ["Version List", "版本记录、当前版本与比较入口", ArrowsClockwise], ["Download Dialog", "按格式选择模型或完整资产包", DownloadSimple], ["Inspection Tools", "测量、剖切和热点按能力渐进开放", Ruler]] },
  ];
  return <main className="docs-view">
    <div className="docs-shell">
      <aside className="docs-rail" aria-label="文档目录"><div className="docs-rail__title"><span className="docs-mark"><FileText size={18} /></span><span><strong>设计规范</strong><small>Vigour Asset Hub</small></span></div><nav><a href="#overview">总览</a><a href="#principles">设计原则</a>{groups.map((group) => <a href={`#${group.id}`} key={group.id}>{group.title}</a>)}<a href="#delivery">开发与交付</a></nav><a className="docs-reference" href="https://ant.design/components/overview-cn" target="_blank" rel="noreferrer"><LinkSimple size={15} />信息架构参考</a></aside>
      <article className="docs-content">
        <header className="docs-hero" id="overview"><span className="docs-kicker">VIGOUR DESIGN LANGUAGE</span><h1>Asset Hub 设计与组件规范</h1><p>面向设计资产发现、预览、治理和项目复用的产品规范。组件目录按类别组织，帮助设计与开发在同一套语言下持续演进。</p><div className="docs-meta"><span><strong>Prototype Spec</strong><small>规范状态</small></span><span><strong>2026.10</strong><small>当前版本</small></span><span><strong>React + CSS</strong><small>实现方式</small></span></div></header>
        <section className="docs-principles" id="principles"><div><span className="docs-section-index">01</span><h2>设计原则</h2><p>先建立清晰的资产语义，再提供与任务匹配的操作深度。</p></div><div className="docs-principle-grid"><article><strong>清晰</strong><p>让来源、版本、成熟度和权限在需要时可见。</p></article><article><strong>渐进</strong><p>先轻量预览，再进入结构、贴图和版本检查。</p></article><article><strong>可信</strong><p>保留原始来源，区分本地模拟与真实外部能力。</p></article><article><strong>高效</strong><p>用紧凑导航、筛选和反馈缩短关键任务路径。</p></article></div></section>
        {groups.map((group, groupIndex) => <section className="docs-group" id={group.id} key={group.id}><div className="docs-section-heading"><span className="docs-section-index">{String(groupIndex + 2).padStart(2, "0")}</span><div><h2>{group.title}</h2><p>{group.description}</p></div><em>{group.items.length} 个条目</em></div><div className="docs-component-grid">{group.items.map(([name, description, Icon]) => <article className="docs-component-card" key={name}><span><Icon size={21} weight="duotone" /></span><div><strong>{name}</strong><p>{description}</p></div><CaretRight size={15} /></article>)}</div></section>)}
        <section className="docs-delivery" id="delivery"><div className="docs-section-heading"><span className="docs-section-index">06</span><div><h2>开发与交付</h2><p>当前原型的真实技术边界与使用约定。</p></div></div><div className="docs-stack"><span><strong>React</strong><small>界面与本地状态</small></span><span><strong>Three.js</strong><small>本地 GLB 实时预览</small></span><span><strong>Phosphor Icons</strong><small>统一图标语言</small></span><span><strong>Vite</strong><small>构建与本地预览</small></span></div><div className="docs-note"><Info size={18} /><p>本页面参考 Ant Design 组件总览的分类浏览方式，但当前原型未直接引入 Ant Design 组件库；界面组件由本项目使用 React 与 CSS 自定义实现。所有连接、权限和导入流程均为本地模拟，除非另行批准生产接入。</p></div></section>
      </article>
    </div>
  </main>;
}

function FilterRail({ assets, typeFilter, setTypeFilter, sourceFilters, setSourceFilters, maturityFilter, setMaturityFilter, fileFilters, setFileFilters, tagFilters, setTagFilters, notify }) {
  const [sourcePanelOpen, setSourcePanelOpen] = useState(false);
  const [sourcePanelStep, setSourcePanelStep] = useState("overview");
  const [draftSource, setDraftSource] = useState("百度网盘");
  const [openGroups, setOpenGroups] = useState({ fileTypes: false, tags: false });
  const countAssets = (predicate) => assets.filter(predicate).length;
  const sourceOptions = SOURCE_OPTIONS.map((source) => ({ ...source, count: countAssets((asset) => asset.source === source.name) }));
  const assetTypes = [["全部资产", assets.length, SquaresFour], ["3D 模型", countAssets((asset) => asset.type === "3D 模型"), Cube], ["UI 规范", countAssets((asset) => asset.type === "UI 规范"), Selection], ["工作流", countAssets((asset) => asset.type === "工作流"), FlowArrow], ["Skill 卡", countAssets((asset) => asset.type === "Skill 卡"), Sparkle], ["研究报告", countAssets((asset) => asset.type === "研究报告"), FileText]];
  const maturities = [["已发布", countAssets((asset) => asset.maturity === "已发布"), "green"], ["已验证", countAssets((asset) => asset.maturity === "已验证"), "blue"], ["试点", countAssets((asset) => asset.maturity === "试点"), "gray"], ["待评审", countAssets((asset) => asset.maturity === "待评审"), "orange"], ["候选", countAssets((asset) => asset.maturity === "候选"), "orange"]];
  const fileTypes = [...new Set(assets.map((asset) => asset.fileType))].map((name) => [name, countAssets((asset) => asset.fileType === name)]);
  const tags = [...new Set(assets.flatMap((asset) => asset.tags))].map((name) => [name, countAssets((asset) => asset.tags.includes(name))]).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN")).slice(0, 8);
  const toggleSource = (name) => setSourceFilters((current) => current.includes(name) ? current.filter((source) => source !== name) : [...current, name]);
  const toggleMulti = (setter, name) => setter((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);
  const importableSources = [...SOURCE_OPTIONS.filter((source) => source.name !== "本地上传"), ...SUGGESTED_SOURCE_OPTIONS.filter((suggestion) => !SOURCE_OPTIONS.some((source) => source.name === suggestion.name))];

  return <aside className="filter-rail">
    <section className="filter-group"><div className="filter-title"><span>资产分类</span><CaretDown size={14} /></div>{assetTypes.map(([name, count, Icon]) => <button key={name} className={`filter-row ${typeFilter === name ? "is-active" : ""}`} onClick={() => setTypeFilter(name)}><Icon size={18} /><span>{name}</span><b>{count}</b></button>)}</section>
    <section className="filter-group source-filter-group">
      <div className="filter-title"><span>资产来源</span><button className="filter-title-action" onClick={() => { setSourcePanelStep("overview"); setSourcePanelOpen(true); }}>管理</button></div>
      <p className="source-definition">记录资产进入平台的位置</p>
      <label className={`check-row ${sourceFilters.length === 0 ? "is-active" : ""}`}><input type="checkbox" checked={sourceFilters.length === 0} onChange={() => setSourceFilters([])} /><span>全部来源</span><b>{assets.length}</b></label>
      {sourceOptions.map((source) => <label className={`check-row ${sourceFilters.includes(source.name) ? "is-active" : ""}`} key={source.name}><input type="checkbox" checked={sourceFilters.includes(source.name)} onChange={() => toggleSource(source.name)} /><span>{source.name}</span><b>{source.count}</b></label>)}
    </section>
    <section className="filter-group"><div className="filter-title"><span>成熟度</span><CaretDown size={14} /></div><p className="filter-origin-note">由入库检查、人工审核与项目评审状态汇总</p>{maturities.map(([name, count, tone]) => <button key={name} className={`maturity-filter ${maturityFilter === name ? "is-active" : ""}`} onClick={() => setMaturityFilter(maturityFilter === name ? "全部" : name)}><StatusDot tone={tone} /><span>{name}</span><b>{count}</b></button>)}</section>
    <section className={`filter-group filter-group--expandable ${openGroups.fileTypes ? "is-open" : "filter-group--collapsed"}`}><button className="filter-expand-trigger" onClick={() => setOpenGroups((current) => ({ ...current, fileTypes: !current.fileTypes }))}><span>文件类型</span>{openGroups.fileTypes ? <CaretDown size={14} /> : <CaretRight size={14} />}</button>{openGroups.fileTypes && <div className="filter-checks"><p className="filter-origin-note">由文件扩展名、内容解析或链接类型自动识别</p>{fileTypes.map(([name, count]) => <label className={`check-row ${fileFilters.includes(name) ? "is-active" : ""}`} key={name}><input type="checkbox" checked={fileFilters.includes(name)} onChange={() => toggleMulti(setFileFilters, name)} /><span>{name}</span><b>{count}</b></label>)}<button className="filter-clear" disabled={!fileFilters.length} onClick={() => setFileFilters([])}>清除文件类型</button></div>}</section>
    <section className={`filter-group filter-group--expandable ${openGroups.tags ? "is-open" : "filter-group--collapsed"}`}><button className="filter-expand-trigger" onClick={() => setOpenGroups((current) => ({ ...current, tags: !current.tags }))}><span>标签</span>{openGroups.tags ? <CaretDown size={14} /> : <CaretRight size={14} />}</button>{openGroups.tags && <div className="filter-checks"><p className="filter-origin-note">由上传提取、AI 建议与人工维护共同生成</p>{tags.map(([name, count]) => <label className={`check-row ${tagFilters.includes(name) ? "is-active" : ""}`} key={name}><input type="checkbox" checked={tagFilters.includes(name)} onChange={() => toggleMulti(setTagFilters, name)} /><span>{name}</span><b>{count}</b></label>)}<button className="filter-clear" disabled={!tagFilters.length} onClick={() => setTagFilters([])}>清除标签</button></div>}</section>
    {sourcePanelOpen && <div className="modal-backdrop source-backdrop" onMouseDown={() => setSourcePanelOpen(false)}><div className="modal source-modal" onMouseDown={(event) => event.stopPropagation()}>
      <div className="modal-head"><div><h2>{sourcePanelStep === "overview" ? "资产来源管理" : "添加资产来源"}</h2><p>{sourcePanelStep === "overview" ? "来源表示资产进入平台的位置，不等同于制作软件。" : "添加云盘、协作或设计文件链接，本次仅作原型演示。"}</p></div><IconButton label="关闭来源管理" onClick={() => setSourcePanelOpen(false)}><X size={19} /></IconButton></div>
      {sourcePanelStep === "overview" ? <>
        <div className="source-summary-strip"><span><strong>{sourceOptions.length}</strong><small>来源类型</small></span><span><strong>{assets.length}</strong><small>登记资产</small></span><span><strong>2</strong><small>链接需复核</small></span></div>
        <div className="source-manage-list">{sourceOptions.map((source) => { const Icon = source.icon; return <button key={source.name} onClick={() => { setSourceFilters([source.name]); setSourcePanelOpen(false); notify?.(`已按“${source.name}”筛选资产`); }}><span className="source-manage-icon"><Icon size={21} weight="duotone" /></span><span><strong>{source.name}</strong><small>{source.kind} · {source.detail}</small></span><em><StatusDot tone={source.tone} />{source.status}</em><b>{source.count}</b><CaretRight size={16} /></button>; })}</div>
        <div className="source-note"><Info size={17} /><span><strong>制作工具放在哪里？</strong><small>Photoshop、Blender 或其他制作软件可记录在资产元数据中，不作为平台来源筛选项。</small></span></div>
        <div className="source-suggestions"><div><strong>建议接入</strong><small>以下是扩展资料治理时常见的来源类型。</small></div><div>{SUGGESTED_SOURCE_OPTIONS.map((source) => { const Icon = source.icon; return <button key={source.name} onClick={() => { setDraftSource(source.name); setSourcePanelStep("add"); }}><Icon size={16} /><span>{source.name}</span><Plus size={14} /></button>; })}</div></div>
        <div className="modal-actions"><button className="button button--secondary" onClick={() => setSourcePanelOpen(false)}>完成</button><button className="button button--primary" onClick={() => setSourcePanelStep("add")}><Plus size={17} />添加来源</button></div>
      </> : <>
        <div className="source-add-form">
          <label>来源类型<select value={draftSource} onChange={(event) => setDraftSource(event.target.value)}>{importableSources.map((source) => <option key={source.name}>{source.name}</option>)}</select></label>
          <label>分享链接或节点链接<input placeholder={draftSource === "钉钉链接" ? "粘贴钉钉文档、知识库或 AI 表格链接" : "粘贴分享链接"} /></label>
          {draftSource === "百度网盘" && <label>提取码（可选）<input placeholder="4 位提取码" maxLength={4} /></label>}
          <div className="source-import-preview"><LinkSimple size={19} /><span><strong>导入后保留原始链接</strong><small>平台只登记元数据、预览和健康状态，不移动原文件。</small></span></div>
        </div>
        <div className="modal-actions"><button className="button button--secondary" onClick={() => setSourcePanelStep("overview")}><ArrowLeft size={17} />返回</button><button className="button button--primary" onClick={() => { setSourcePanelOpen(false); notify?.(`${draftSource}已加入待校验队列（原型）`); }}><LinkSimple size={17} />校验并添加</button></div>
      </>}
    </div></div>}
  </aside>;
}
function GovernancePanel({ setView, setters, notify }) {
  const [modal, setModal] = useState("");
  const resetDetailFilters = () => { setters.setTypeFilter("全部资产"); setters.setFileFilters([]); setters.setTagFilters([]); };
  const openSource = (source) => { resetDetailFilters(); setters.setMaturityFilter("全部"); setters.setSourceFilters(source ? [source] : []); setView("library"); notify(source ? `已打开“${source}”来源资产` : "已打开全部资产来源"); };
  const openReview = () => { resetDetailFilters(); setters.setSourceFilters([]); setters.setMaturityFilter("待评审"); setView("library"); notify("已打开待评审资产"); };
  return <><aside className="governance-panel" aria-label="资产治理"><section><div className="panel-title"><h3>资产来源状态</h3><button onClick={() => openSource()}>查看全部</button></div><div className="source-list">{[['本地上传', '可用 · 15 项', 'green'], ['百度网盘', '已连接 · 10 项', 'green'], ['阿里云盘', '已连接 · 8 项', 'green'], ['钉钉链接', '2 条需复核 · 9 项', 'orange'], ['Figma', '已连接 · 8 项', 'green']].map(([name, meta, tone]) => <button className="source-health" key={name} onClick={() => openSource(name)}><StatusDot tone={tone} /><span><strong>{name}</strong><small>{meta}</small></span><CaretRight size={14} /></button>)}</div></section><section><div className="panel-title"><h3>评审队列</h3><button onClick={openReview}>进入评审</button></div><button className="summary-link" onClick={openReview}><span className="count-bubble count-bubble--orange">9</span><span>待评审资产</span><CaretRight size={16} /></button><button className="summary-link" onClick={() => { setModal("review"); }}><span className="count-bubble">3</span><span>逾期未处理</span><CaretRight size={16} /></button></section><section><div className="panel-title"><h3>链接与文件健康</h3><button onClick={() => setModal("health")}>查看详情</button></div><button className="health-row health-row--warn" onClick={() => openSource("钉钉链接")}><WarningCircle size={19} weight="fill" /><span>2 条钉钉链接需复核</span><CaretRight size={14} /></button><div className="health-row"><CheckCircle size={19} weight="fill" /><span>云盘分享链接可访问</span></div><div className="health-row"><ShieldCheck size={19} weight="fill" /><span>本地文件检查正常</span></div></section><section><div className="panel-title"><h3>存储使用</h3><button onClick={() => setModal("storage")}>管理详情</button></div><div className="storage-copy"><strong>已使用 428 GB / 1 TB</strong><span>42%</span></div><div className="progress"><span style={{ width: "42%" }} /></div></section></aside>{modal && <div className="modal-backdrop" onMouseDown={() => setModal("")}><div className="modal governance-modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><h2>{modal === "health" ? "链接与文件健康" : modal === "storage" ? "存储管理" : "逾期评审"}</h2><p>{modal === "health" ? "检查外部链接、文件结构与安全状态。" : modal === "storage" ? "查看空间分布，并决定下一步清理或扩容策略。" : "这些资产已超过约定的评审处理时间。"}</p></div><IconButton label="关闭" onClick={() => setModal("")}><X size={19} /></IconButton></div>{modal === "health" && <div className="governance-detail-list"><button onClick={() => { setModal(""); openSource("钉钉链接"); }}><WarningCircle size={19} weight="fill" /><span><strong>钉钉链接复核</strong><small>2 条链接需要确认访问范围与有效期</small></span><CaretRight size={16} /></button><div><CheckCircle size={19} weight="fill" /><span><strong>云盘分享链接</strong><small>18 条链接当前可访问</small></span></div><div><ShieldCheck size={19} weight="fill" /><span><strong>本地文件安全检查</strong><small>最近一次检查未发现风险</small></span></div></div>}{modal === "storage" && <div className="storage-breakdown"><span><small>3D 模型</small><strong>286 GB</strong><i style={{ width: "67%" }} /></span><span><small>设计规范</small><strong>82 GB</strong><i style={{ width: "31%" }} /></span><span><small>报告与工作流</small><strong>60 GB</strong><i style={{ width: "18%" }} /></span></div>}{modal === "review" && <div className="governance-detail-list">{[["产品设计评审工作流", "今天 17:00 到期"], ["智能制造设备系列 · 贴图包", "已逾期 1 天"], ["座舱 HMI 组件规范", "已逾期 2 天"]].map(([name, meta]) => <button key={name} onClick={() => { setModal(""); openReview(); }}><WarningCircle size={18} weight="fill" /><span><strong>{name}</strong><small>{meta}</small></span><CaretRight size={16} /></button>)}</div>}<div className="modal-actions"><button className="button button--secondary" onClick={() => setModal("")}>关闭</button>{modal === "storage" && <button className="button button--primary" onClick={() => { setModal(""); setView("upload"); }}>前往上传与导入</button>}{modal === "health" && <button className="button button--primary" onClick={() => notify("健康检查已刷新（原型）")}>重新检查</button>}</div></div></div>}</>;
}

function AssetActions({ asset, onOpen, notify, favorite, onToggleFavorite }) {
  const [open, setOpen] = useState(false);
  const run = (action) => { action(); setOpen(false); };
  return <div className="row-actions"><IconButton label={`更多操作：${asset.shortName}`} active={open} onClick={() => setOpen((current) => !current)}><DotsThree size={20} /></IconButton>{open && <div className="asset-action-menu" role="menu"><button onClick={() => run(() => onOpen(asset))}><Eye size={16} />查看详情</button><button onClick={() => run(() => { onToggleFavorite?.(asset.id); notify(favorite ? `已取消收藏“${asset.shortName}”` : `已收藏“${asset.shortName}”`); })}><Tag size={16} />{favorite ? "取消收藏" : "收藏资产"}</button><button onClick={() => run(() => { navigator.clipboard?.writeText(`asset-hub://${asset.id}`); notify("资产链接已复制到剪贴板"); })}><Copy size={16} />复制资产链接</button><button onClick={() => run(() => notify("下载任务已加入队列（原型）"))}><DownloadSimple size={16} />创建下载任务</button></div>}</div>;
}

function AssetTable({ assets, selected, setSelected, onOpen, notify = () => {}, favorites = [], onToggleFavorite }) {
  const toggle = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  return <div className="asset-table"><div className="asset-table__head"><label><input type="checkbox" checked={assets.length > 0 && assets.every((asset) => selected.includes(asset.id))} onChange={() => setSelected(assets.every((asset) => selected.includes(asset.id)) ? [] : assets.map((asset) => asset.id))} /></label><span>资产信息</span><span>资产来源</span><span>资产 ID</span><span>版本</span><span>负责人</span><span>更新时间</span><span>成熟度</span><span /></div>{assets.map((asset) => <div className={`asset-table__row ${selected.includes(asset.id) ? "is-selected" : ""}`} key={asset.id} onDoubleClick={() => onOpen(asset)}><label><input type="checkbox" checked={selected.includes(asset.id)} onChange={() => toggle(asset.id)} /></label><button className="asset-name" onClick={() => onOpen(asset)}><AssetVisual asset={asset} /><span><strong>{asset.name}</strong><small>{asset.type} · {asset.size}</small></span></button><span className="source-cell"><SourceIcon name={asset.source} />{asset.source}</span><button className="asset-id" onClick={() => navigator.clipboard?.writeText(asset.id)}>{asset.id}<Copy size={14} /></button><span className="mono">{asset.version}</span><span className="owner-cell"><span className="mini-avatar">{asset.owner.slice(-1)}</span><span><strong>{asset.owner}</strong><small>{asset.role}</small></span></span><span className="date-cell">{asset.updated.split(" ")[0]}<small>{asset.updated.split(" ")[1]}</small></span><Maturity value={asset.maturity} /><AssetActions asset={asset} onOpen={onOpen} notify={notify} favorite={favorites.includes(asset.id)} onToggleFavorite={onToggleFavorite} /></div>)}</div>;
}

function StatStrip() {
  const stats = [["已登记资产", "52", "+9 本月", SquaresFour, "blue"], ["活跃项目", "7", "3 个评审中", FolderOpen, "violet"], ["待处理评审", "9", "2 个即将逾期", CheckCircle, "orange"], ["可用存储", "572 GB", "总容量 1 TB", Database, "green"]];
  return <div className="stat-strip">{stats.map(([label, value, delta, Icon, tone]) => <div className="stat-item" key={label}><span className={`stat-icon stat-icon--${tone}`}><Icon size={20} weight="duotone" /></span><span><small>{label}</small><strong>{value}</strong><em>{delta}</em></span></div>)}</div>;
}

function FeaturedAsset({ onOpen }) {
  const asset = ASSETS[0];
  return <div className="featured-asset">
    <img src={asset.image} alt="工业离心泵 3D 模型预览" />
    <div className="featured-overlay"><div className="featured-meta"><span>3D 模型</span><Maturity value="已发布" /></div><h2>{asset.id}</h2><h3>{asset.name}</h3><p>标准化高精度离心泵装配模型，包含完整结构、密封、轴承与接口，支持多种工况配置。</p><div className="featured-actions"><button className="button button--primary" onClick={() => onOpen(asset)}><Cube size={18} />在 3D 查看器中打开</button><button className="button button--ghost-dark" onClick={() => onOpen(asset)}><ShieldCheck size={18} />查看详情</button></div><div className="featured-specs"><span>{asset.version}</span><i /><span>GLB, STEP</span><i /><span>{asset.size}</span></div></div>
  </div>;
}

const PROJECT_TYPES = ["产品研发", "体验 / HMI", "设计系统", "研究专项", "供应商协同"];

function matchesProject(project, scope, category) {
  const matchesScope = scope === "全部项目" || (scope === "我参与的" && project.participating) || (scope === "待我处理" && project.pending) || (scope === "已归档" && project.status === "已归档");
  return matchesScope && (category === "全部类型" || project.category === category);
}

function ProjectCategories({ scope, setScope, category, setCategory, compact = false }) {
  return <div className={`project-categories ${compact ? "project-categories--compact" : ""}`}>
    <div className="project-scope-tabs" role="group" aria-label="项目范围">{["全部项目", "我参与的", "待我处理", "已归档"].map((value) => <button key={value} aria-pressed={scope === value} className={scope === value ? "is-active" : ""} onClick={() => setScope(value)}>{value}</button>)}</div>
    <label><span className="sr-only">项目类型筛选</span><select aria-label="项目类型筛选" value={category} onChange={(event) => setCategory(event.target.value)}><option>全部类型</option>{PROJECT_TYPES.map((value) => <option key={value}>{value}</option>)}</select></label>
  </div>;
}

function ProjectEntry({ onProject, setView }) {
  const [scope, setScope] = useState("全部项目");
  const [category, setCategory] = useState("全部类型");
  const projects = PROJECTS.map((project, index) => ({ ...project, index })).filter((project) => matchesProject(project, scope, category));
  return <section className="section-block project-entry"><div className="section-heading"><div><h2>项目入口</h2><p>按参与范围与项目类型查找项目。</p></div><button onClick={() => setView("projects")}>全部项目 <CaretRight size={15} /></button></div>
    <ProjectCategories scope={scope} setScope={setScope} category={category} setCategory={setCategory} />
    {projects.length ? <div className="project-strip">{projects.map((project) => <button key={project.name} onClick={() => onProject(project.index)}><img src={project.cover} alt="" /><span><strong>{project.name}</strong><small>{project.category} · {project.assets} 项资产</small></span><em>{project.status}</em><CaretRight size={18} /></button>)}</div> : <div className="project-category-empty"><FolderOpen size={24} /><span>此分类下暂无项目</span><button onClick={() => { setScope("全部项目"); setCategory("全部类型"); }}>查看全部项目</button></div>}
  </section>;
}

function Dashboard({ assets, setView, onOpen, onProject }) {
  const curatedAssets = ["VGR-PRD-001257", "VGR-UI-000731", "VGR-RPT-000089"].map((id) => assets.find((asset) => asset.id === id)).filter(Boolean);
  return <main className="workspace dashboard-view"><FeaturedAsset onOpen={onOpen} /><section className="section-block curated-assets"><div className="section-heading"><div><h2>精选资产</h2><p>由团队推荐，适合当前项目快速复用。</p></div><button onClick={() => setView("library")}>浏览资产库 <CaretRight size={15} /></button></div><div className="curated-grid">{curatedAssets.map((asset) => <button className="curated-card" key={asset.id} onClick={() => onOpen(asset)}><AssetVisual asset={asset} /><span><span className="curated-card__meta"><span>{asset.type}</span><Maturity value={asset.maturity} /></span><strong>{asset.name}</strong><small>{asset.source} · {asset.size}</small></span><CaretRight size={17} /></button>)}</div></section><ProjectEntry onProject={onProject} setView={setView} /></main>;
}

function Library({ assets, query, setQuery, filters, setters, onOpen, notify }) {
  const [mode, setMode] = useState("list");
  const [selected, setSelected] = useState([]);
  const [scope, setScope] = useState("all");
  const [sort, setSort] = useState("最近更新");
  const [sortOpen, setSortOpen] = useState(false);
  const [favorites, setFavorites] = useState(["VGR-PRD-001248", "VGR-UI-000698"]);
  const [savedOpen, setSavedOpen] = useState(false);
  const [savedName, setSavedName] = useState("当前筛选");
  const [savedFilters, setSavedFilters] = useState([]);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const baseFiltered = useMemo(() => assets.filter((asset) => (!query || `${asset.name} ${asset.id} ${asset.type}`.toLowerCase().includes(query.toLowerCase())) && (filters.typeFilter === "全部资产" || asset.type === filters.typeFilter) && (filters.sourceFilters.length === 0 || filters.sourceFilters.includes(asset.source)) && (filters.maturityFilter === "全部" || asset.maturity === filters.maturityFilter) && (filters.fileFilters.length === 0 || filters.fileFilters.includes(asset.fileType)) && (filters.tagFilters.length === 0 || filters.tagFilters.some((tag) => asset.tags.includes(tag)))), [assets, query, filters]);
  const scoped = useMemo(() => baseFiltered.filter((asset) => {
    if (scope === "created") return asset.owner === "林思远";
    if (scope === "favorites") return favorites.includes(asset.id);
    if (scope === "review") return asset.maturity === "待评审";
    return true;
  }), [baseFiltered, favorites, scope]);
  const filtered = useMemo(() => [...scoped].sort((a, b) => sort === "名称 A–Z" ? a.shortName.localeCompare(b.shortName, "zh-CN") : sort === "文件从大到小" ? parseFloat(b.size) - parseFloat(a.size) : 0), [scoped, sort]);
  const activeFilterCount = filters.sourceFilters.length + filters.fileFilters.length + filters.tagFilters.length + (filters.maturityFilter === "全部" ? 0 : 1) + (filters.typeFilter === "全部资产" ? 0 : 1) + (query.trim() ? 1 : 0);
  const toggleFavorite = (id) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const clearAllFilters = () => { setQuery(""); setters.setSourceFilters([]); setters.setFileFilters([]); setters.setTagFilters([]); setters.setMaturityFilter("全部"); setters.setTypeFilter("全部资产"); };
  const filterLabel = activeFilterCount ? `${activeFilterCount} 个筛选条件` : "全部资产";
  const currentFilterSnapshot = () => ({ query, typeFilter: filters.typeFilter, sourceFilters: [...filters.sourceFilters], fileFilters: [...filters.fileFilters], tagFilters: [...filters.tagFilters], maturityFilter: filters.maturityFilter, scope, sort });
  const applySavedFilter = (saved) => { setQuery(saved.snapshot.query); setters.setTypeFilter(saved.snapshot.typeFilter); setters.setSourceFilters(saved.snapshot.sourceFilters); setters.setFileFilters(saved.snapshot.fileFilters); setters.setTagFilters(saved.snapshot.tagFilters); setters.setMaturityFilter(saved.snapshot.maturityFilter); setScope(saved.snapshot.scope); setSort(saved.snapshot.sort); notify(`已恢复筛选“${saved.name}”（本地原型）`); };
  const scopes = [["all", "全部", baseFiltered.length], ["created", "我创建的", baseFiltered.filter((asset) => asset.owner === "林思远").length], ["favorites", "已收藏", baseFiltered.filter((asset) => favorites.includes(asset.id)).length], ["review", "待我评审", baseFiltered.filter((asset) => asset.maturity === "待评审").length]];
  return <div className="library-shell"><FilterRail assets={assets} {...filters} {...setters} notify={notify} /><main className="workspace library-view"><div className="page-toolbar"><div><h1>资产资源库</h1><p>集中检索、筛选和复用经过治理的设计资产。</p></div><div className="toolbar-actions"><button className="button button--secondary" onClick={() => setSavedOpen(true)}><Funnel size={17} />保存筛选</button><button className="button button--primary" onClick={() => setCollectionOpen(true)}><Plus size={17} />新建集合</button></div></div><div className="library-controls"><div className="quick-filters">{scopes.map(([id, label, count]) => <button key={id} className={scope === id ? "is-active" : ""} onClick={() => setScope(id)}>{label} <b>{count}</b></button>)}</div><div className="toolbar-actions"><div className="library-sort"><button className="select-button" aria-expanded={sortOpen} onClick={() => setSortOpen((current) => !current)}>{sort}<CaretDown size={14} /></button>{sortOpen && <div className="sort-options">{["最近更新", "名称 A–Z", "文件从大到小"].map((item) => <button key={item} className={sort === item ? "is-active" : ""} onClick={() => { setSort(item); setSortOpen(false); }}>{item}{sort === item && <CheckCircle size={15} weight="fill" />}</button>)}</div>}</div><span className="view-switch"><button aria-label="列表视图" className={mode === "list" ? "is-active" : ""} onClick={() => setMode("list")}><ListBullets size={18} /></button><button aria-label="网格视图" className={mode === "grid" ? "is-active" : ""} onClick={() => setMode("grid")}><GridFour size={18} /></button></span></div></div>{activeFilterCount > 0 && <div className="active-filter-row"><span>已应用：{filterLabel}</span>{query && <button onClick={() => setQuery("")}>关键词：{query}<X size={12} /></button>}{filters.sourceFilters.map((source) => <button key={source} onClick={() => setters.setSourceFilters((current) => current.filter((item) => item !== source))}>{source}<X size={12} /></button>)}{filters.fileFilters.map((fileType) => <button key={fileType} onClick={() => setters.setFileFilters((current) => current.filter((item) => item !== fileType))}>{fileType}<X size={12} /></button>)}{filters.tagFilters.map((tag) => <button key={tag} onClick={() => setters.setTagFilters((current) => current.filter((item) => item !== tag))}>{tag}<X size={12} /></button>)}{filters.maturityFilter !== "全部" && <button onClick={() => setters.setMaturityFilter("全部")}>{filters.maturityFilter}<X size={12} /></button>}{filters.typeFilter !== "全部资产" && <button onClick={() => setters.setTypeFilter("全部资产")}>{filters.typeFilter}<X size={12} /></button>}<button className="clear-filter" onClick={clearAllFilters}>清除全部</button></div>}{savedFilters.length > 0 && <div className="saved-filter-row"><span>已保存</span>{savedFilters.map((saved) => <button key={saved.name} onClick={() => applySavedFilter(saved)}>{saved.name}</button>)}</div>}{selected.length > 0 && <div className="batch-bar"><strong>已选择 {selected.length} 项</strong><button onClick={() => notify("已将所选资产加入项目")}><FolderOpen size={17} />加入项目</button><button onClick={() => notify("已添加标签")}><Tag size={17} />添加标签</button><button onClick={() => notify("原型模式：未触发真实下载")}><DownloadSimple size={17} />批量下载</button><button className="danger" onClick={() => notify("原型模式：未执行删除")}><Trash size={17} />移除</button><IconButton label="清除选择" onClick={() => setSelected([])}><X size={18} /></IconButton></div>}{filtered.length === 0 ? <div className="empty-state"><MagnifyingGlass size={34} /><h2>没有匹配的资产</h2><p>尝试清除筛选条件或使用其他关键词。</p></div> : mode === "list" ? <AssetTable assets={filtered} selected={selected} setSelected={setSelected} onOpen={onOpen} notify={notify} favorites={favorites} onToggleFavorite={toggleFavorite} /> : <div className="asset-grid">{filtered.map((asset) => <article className={`asset-card ${selected.includes(asset.id) ? "is-selected" : ""}`} key={asset.id}><label className="card-select"><input type="checkbox" checked={selected.includes(asset.id)} onChange={() => setSelected((current) => current.includes(asset.id) ? current.filter((id) => id !== asset.id) : [...current, asset.id])} /></label><button className="card-preview" aria-label={`打开 ${asset.name}`} onClick={() => onOpen(asset)}><AssetVisual asset={asset} large /></button><div className="asset-card__body"><div className="asset-card__title"><span><small>{asset.type}</small><strong>{asset.shortName}</strong></span><AssetActions asset={asset} onOpen={onOpen} notify={notify} favorite={favorites.includes(asset.id)} onToggleFavorite={toggleFavorite} /></div><p>{asset.id} · {asset.version}</p><div className="asset-card__footer"><Maturity value={asset.maturity} /><span>{asset.owner} · {asset.updated.split(" ")[0]}</span></div></div></article>)}</div>}{savedOpen && <div className="modal-backdrop" onMouseDown={() => setSavedOpen(false)}><div className="modal library-modal" role="dialog" aria-modal="true" aria-labelledby="save-filter-title" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><h2 id="save-filter-title">保存筛选</h2><p>将当前条件存为个人快捷筛选，仅保存在本地原型中。</p></div><IconButton label="关闭保存筛选" onClick={() => setSavedOpen(false)}><X size={19} /></IconButton></div><label>筛选名称<input value={savedName} onChange={(event) => setSavedName(event.target.value)} autoFocus /></label><div className="saved-filter-preview"><span><small>当前范围</small><strong>{filterLabel}</strong></span><span><small>可见资产</small><strong>{filtered.length} 项</strong></span></div><div className="modal-actions"><button className="button button--secondary" onClick={() => setSavedOpen(false)}>取消</button><button className="button button--primary" disabled={!savedName.trim()} onClick={() => { const name = savedName.trim(); const saved = { name, snapshot: currentFilterSnapshot() }; setSavedFilters((current) => [...current.filter((item) => item.name !== name), saved]); setSavedOpen(false); notify(`筛选“${name}”已保存（本地原型）`); }}>保存筛选</button></div></div></div>}{collectionOpen && <div className="modal-backdrop" onMouseDown={() => setCollectionOpen(false)}><div className="modal library-modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><h2>新建集合</h2><p>为项目、交付或复用场景创建一个资产集合。</p></div><IconButton label="关闭新建集合" onClick={() => setCollectionOpen(false)}><X size={19} /></IconButton></div><label>集合名称<input value={collectionName} onChange={(event) => setCollectionName(event.target.value)} placeholder="例如：离心泵交付包" autoFocus /></label><div className="modal-actions"><button className="button button--secondary" onClick={() => setCollectionOpen(false)}>取消</button><button className="button button--primary" disabled={!collectionName.trim()} onClick={() => { setCollectionOpen(false); notify(`集合“${collectionName.trim()}”已创建（原型）`); }}>创建集合</button></div></div></div>}</main></div>;
}

function DetailPanelTab({ activeTab, asset, detail, selectedPart, setSelectedPart, partVisibility, togglePart, selectedTexture, setSelectedTexture, notify }) {
  const { parts, textureFiles, properties, description, sourceName, sourceMeta, versions, isDashboardExport, isLocalGlb = false } = detail;
  if (activeTab === "structure") return <div className="detail-panel-body">
    <div className="panel-inline-heading"><div><h3>模型结构</h3><p>选择节点可在查看器中定位零件。</p></div><span className="soft-badge">{isLocalGlb ? `${parts.length} 个节点` : "128 节点"}</span></div>
    <label className="structure-search"><MagnifyingGlass size={16} /><input placeholder="搜索零件或节点" /></label>
    <div className="structure-list">{parts.map((part) => <div className={`structure-row ${selectedPart === part.id ? "is-selected" : ""}`} key={part.id} style={{ paddingLeft: `${10 + part.depth * 16}px` }}><button className="part-main" onClick={() => setSelectedPart(part.id)}>{part.depth === 0 ? <TreeStructure size={17} /> : <Cube size={16} />}<span><strong>{part.name}</strong><small>{part.meta}</small></span></button><IconButton label={`${partVisibility[part.id] ? "隐藏" : "显示"}${part.name}`} onClick={() => togglePart(part.id)}>{partVisibility[part.id] ? <Eye size={17} /> : <EyeSlash size={17} />}</IconButton></div>)}</div>
    <section className="detail-section selection-summary"><h3>当前选择</h3><div><span className="selection-cube"><CubeFocus size={20} /></span><span><strong>{parts.find((part) => part.id === selectedPart)?.name || "未选择节点"}</strong><small>单击查看器空白处取消选择</small></span></div></section>
  </div>;
  if (activeTab === "textures") return <div className="detail-panel-body">{isLocalGlb ? <img className="material-board" src={asset.image} alt={`${asset.name}展示图`} /> : <img className="material-board" src={publicAsset("materials-board.png")} alt="工业泵关联材质预览" />}<div className="panel-inline-heading"><div><h3>关联贴图</h3><p>{isLocalGlb ? `${textureFiles.length} 项图像 · 已内嵌在 GLB` : "共 4 张贴图 · PBR 工作流"}</p></div><span className="soft-badge">已关联</span></div>{textureFiles.map(([name, type, meta]) => <button className={`file-row ${selectedTexture === name ? "is-selected" : ""}`} key={name} onClick={() => setSelectedTexture(name)}><span className={`file-thumb file-thumb--${type}`} /><span><strong>{name}</strong><small>{type} · {meta}</small></span><DownloadSimple size={17} onClick={(event) => { event.stopPropagation(); notify(isLocalGlb ? "贴图已随 GLB 内嵌，无需单独下载" : `${name} 下载已加入队列（原型）`); }} /></button>)}<div className="texture-detail"><span><small>当前贴图</small><strong>{selectedTexture}</strong></span><span><small>色彩空间</small><strong>{selectedTexture.includes("basecolor") ? "sRGB" : "Linear"}</strong></span></div></div>;
  if (activeTab === "versions") return <div className="detail-panel-body"><div className="panel-inline-heading"><div><h3>版本记录</h3><p>{isLocalGlb ? "导入、检查与来源信息均可追溯。" : "对比、预览或恢复历史版本。"}</p></div>{versions.length > 1 && <button className="text-button" onClick={() => notify("版本对比模式已开启（原型）")}>选择对比</button>}</div>{versions.map(([version, state, note, date], index) => <button className={`timeline-row ${index === 0 ? "is-current" : ""}`} key={version} onClick={() => notify(index === 0 ? "当前已是最新版本" : `已切换到 ${version} 只读预览`)}><span className={index === 0 ? "is-current" : ""} /><div><strong>{version}</strong><em>{state}</em><p>{note}</p><small>{date}</small></div></button>)}</div>;
  return <div className="detail-panel-body"><div className="detail-title"><div><span>3D 模型</span><Maturity value={asset.maturity} /></div><h2>{asset.name}</h2><p>{asset.id}</p></div><div className="model-health"><CheckCircle size={19} weight="fill" /><span><strong>模型检查通过</strong><small>{detail.checks}</small></span><button onClick={() => notify("模型检查报告已打开（原型）")}>查看报告</button></div><div className="property-grid">{properties.map(([label, value]) => <span key={label}><small>{label}</small><strong>{value}</strong></span>)}</div><section className="detail-section"><h3>描述</h3><p>{description}</p></section><section className="detail-section"><h3>来源与所有者</h3><div className="source-owner"><Database size={20} /><span><strong>{sourceName}</strong><small>{sourceMeta}</small></span></div><div className="source-owner"><span className="mini-avatar">{asset.owner.slice(0, 1)}</span><span><strong>{asset.owner}</strong><small>{asset.role} · 资产负责人</small></span></div></section><section className="detail-section"><h3>标签</h3><div className="tag-list">{asset.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></section></div>;
}

function LocalGlbViewer({ asset }) {
  const hostRef = useRef(null);
  const [status, setStatus] = useState("正在加载三维模型…");

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !asset.modelUrl) return undefined;
    let disposed = false;
    let frameId = 0;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#09131c");
    const camera = new THREE.PerspectiveCamera(38, 1, .01, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    host.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = .07;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    scene.add(new THREE.HemisphereLight("#b8d3ff", "#071018", 2.2));
    const keyLight = new THREE.DirectionalLight("#d9ecff", 3.5);
    keyLight.position.set(8, 12, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight("#3a9fff", 1.4);
    fillLight.position.set(-10, 5, -8);
    scene.add(fillLight);
    const grid = new THREE.GridHelper(40, 40, "#1d5f86", "#102536");
    scene.add(grid);

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    new GLTFLoader().load(asset.modelUrl, (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      const radius = Math.max(size.x, size.y, size.z, 1) * .72;
      camera.near = Math.max(radius / 1000, .01);
      camera.far = radius * 100;
      camera.position.set(radius * 1.35, radius * .85, radius * 1.35);
      grid.position.y = -size.y / 2;
      controls.target.set(0, 0, 0);
      controls.update();
      scene.add(model);
      setStatus("");
    }, undefined, () => {
      if (!disposed) setStatus("模型加载失败，请下载 GLB 在本地查看。");
    });

    const render = () => {
      frameId = window.requestAnimationFrame(render);
      controls.update();
      renderer.render(scene, camera);
    };
    render();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [asset.modelUrl]);

  return <div className="local-glb-viewer" aria-label={`${asset.name} 三维模型预览`}>
    <div ref={hostRef} className="local-glb-viewer__canvas" />
    {status && <div className="local-glb-status">{status}</div>}
  </div>;
}

function ModelDetail3d({ asset = ASSETS[0], setView, notify }) {
  const detail = getModelDetailData(asset);
  const { parts, tabs: fileTabs, hotspots, isDashboardExport, isLocalGlb } = detail;
  const [activeTab, setActiveTab] = useState("info");
  const [renderMode, setRenderMode] = useState("渲染");
  const [tool, setTool] = useState("rotate");
  const [zoom, setZoom] = useState(1);
  const [angle, setAngle] = useState(-4);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [file, setFile] = useState(fileTabs[0]);
  const [autoRotate, setAutoRotate] = useState(false);
  const [treeOpen, setTreeOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(detail.rootPart);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [selectedTexture, setSelectedTexture] = useState(detail.textureFiles[0][0]);
  const [partVisibility, setPartVisibility] = useState(Object.fromEntries(parts.map((part) => [part.id, true])));
  const [fullscreen, setFullscreen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("GLB");
  const [includeTextures, setIncludeTextures] = useState(true);
  const drag = useRef(null);

  useEffect(() => {
    if (!autoRotate) return undefined;
    const timer = window.setInterval(() => setAngle((value) => value + .6), 40);
    return () => window.clearInterval(timer);
  }, [autoRotate]);

  useEffect(() => {
    const closeFullscreen = (event) => { if (event.key === "Escape") setFullscreen(false); };
    window.addEventListener("keydown", closeFullscreen);
    return () => window.removeEventListener("keydown", closeFullscreen);
  }, []);

  const resetView = () => { setAngle(-4); setZoom(1); setPan({ x: 0, y: 0 }); setSelectedHotspot(null); };
  const onMove = (event) => {
    if (!drag.current) return;
    if (tool === "pan") setPan({ x: drag.current.pan.x + event.clientX - drag.current.x, y: drag.current.pan.y + event.clientY - drag.current.y });
    else if (tool === "rotate") setAngle(drag.current.angle + (event.clientX - drag.current.x) * .35);
  };
  const chooseTool = (nextTool) => {
    setTool(nextTool);
    if (nextTool === "measure") notify(isDashboardExport ? "测量模式：可标记中央主楼的局部距离（原型）" : "测量模式：已显示泵体长度标注");
    if (nextTool === "section") notify(isDashboardExport ? "剖切模式：可查看主楼内部层级（原型）" : "剖切模式：拖动查看内部结构（原型）");
  };
  const setPreset = (preset) => {
    const presets = { 前视图: 0, 右视图: 90, 后视图: 180, 等轴测: -24 };
    setAngle(presets[preset]); setPan({ x: 0, y: 0 }); setZoom(1);
  };
  const togglePart = (id) => setPartVisibility((current) => ({ ...current, [id]: !current[id] }));
  const hiddenPartCount = Object.values(partVisibility).filter((visible) => !visible).length;
  const stageTransform = `translate(${pan.x}px, ${pan.y}px) perspective(1100px) rotateY(${angle}deg) scale(${zoom})`;
  const downloadOptions = isDashboardExport
    ? [["资产包", "完整本地资产包", "约 3.8 MB", "GLB、展示图、清单与说明"], ["GLB", "原始三维模型", asset.size, "贴图已内嵌，可用于本地查看"], ["导出清单", "资产导出清单", "约 1 KB", "来源、格式与贴图处理说明"]]
    : isLocalGlb
      ? [["GLB", "原始三维模型", asset.size, "贴图已内嵌，可用于本地查看"], ["展示图", "PNG 展示图", "592 KB", "资产库与详情页封面"]]
    : [["GLB", "Web 优化版", "12.4 MB", "网页预览与数字孪生"], ["GLTF", "可编辑包", "68.2 MB", "包含独立贴图与材质"], ["STEP", "工程源文件", "286.4 MB", "机械设计与制造协作"]];
  const startDownload = () => {
    if (isLocalGlb) {
      const href = isDashboardExport ? downloadFormat === "资产包" ? asset.packageUrl : downloadFormat === "导出清单" ? asset.manifestUrl : asset.modelUrl : downloadFormat === "展示图" ? asset.image : asset.modelUrl;
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.download = "";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setDownloadOpen(false);
      notify(`已开始下载${downloadFormat}`);
      return;
    }
    setDownloadOpen(false);
    notify(`${downloadFormat} 下载任务已创建${includeTextures ? "，已包含贴图" : ""}（原型）`);
  };

  return <main className={`detail-view ${fullscreen ? "is-immersive" : ""}`}>
    <div className="detail-topbar"><button className="back-button" onClick={() => fullscreen ? setFullscreen(false) : setView("library")}><ArrowLeft size={18} />{fullscreen ? "退出沉浸模式" : "返回资产库"}</button><div className="detail-path">资产资源库 <CaretRight size={13} /> 3D 模型 <CaretRight size={13} /> {asset.shortName}</div><div className="toolbar-actions"><button className="button button--secondary" onClick={() => { navigator.clipboard?.writeText(`${asset.id}-${asset.version}`); notify("分享链接已复制到剪贴板（原型）"); }}><LinkSimple size={17} />分享</button><button className="button button--primary" onClick={() => { setDownloadFormat(file); setDownloadOpen(true); }}><DownloadSimple size={18} />下载资产</button></div></div>
    <div className="model-layout"><section className={`model-viewer ${isLocalGlb ? "model-viewer--local-export" : ""} model-viewer--${renderMode} model-tool--${tool} ${hiddenPartCount ? "has-hidden-parts" : ""}`} onPointerMove={isLocalGlb ? undefined : onMove} onPointerUp={isLocalGlb ? undefined : () => { drag.current = null; }} onPointerLeave={isLocalGlb ? undefined : () => { drag.current = null; }}>
      <div className="viewer-head"><div><span className="live-dot" />3D 实时预览 <small>{isLocalGlb ? "· GLB 可交互" : autoRotate ? "· 自动旋转中" : "· 可交互"}</small></div>{isLocalGlb ? <span className="viewer-file-label">GLB</span> : <div className="file-tabs">{fileTabs.map((tab) => <button key={tab} className={file === tab ? "is-active" : ""} onClick={() => setFile(tab)}>{tab}</button>)}</div>}<span>{detail.viewerMeta}</span></div>
      {isLocalGlb ? <div className="model-stage model-stage--glb"><LocalGlbViewer asset={asset} /></div> : <><div className="model-stage" onWheel={(event) => setZoom((value) => Math.max(.7, Math.min(1.55, value - event.deltaY * .0008)))} onPointerDown={(event) => { if (tool === "measure" || tool === "section") return; drag.current = { x: event.clientX, y: event.clientY, angle, pan }; event.currentTarget.setPointerCapture?.(event.pointerId); }} onDoubleClick={resetView}>
        <img src={asset.image} alt={`${asset.name}预览`} draggable="false" style={{ transform: stageTransform }} />
        <div className="view-presets">{["前视图", "右视图", "后视图", "等轴测"].map((preset) => <button key={preset} onClick={() => setPreset(preset)}>{preset}</button>)}</div>
        {hotspots.map((hotspot, index) => <button key={hotspot.id} className={`model-hotspot ${selectedHotspot === hotspot.id ? "is-active" : ""}`} style={{ left: hotspot.left, top: hotspot.top }} aria-label={`查看${hotspot.label}`} onClick={() => { setSelectedHotspot(selectedHotspot === hotspot.id ? null : hotspot.id); setSelectedPart(hotspot.id === "motor" ? "motor" : hotspot.id === "seal" ? "seal" : "pump"); }}>{index + 1}</button>)}
        {selectedHotspot && (() => { const hotspot = hotspots.find((item) => item.id === selectedHotspot); return <div className="hotspot-card"><span>零件标注</span><strong>{hotspot.label}</strong><small>{hotspot.note}</small><button onClick={() => { setActiveTab("structure"); setTreeOpen(true); }}>在结构中定位 <CaretRight size={13} /></button></div>; })()}
        {tool === "measure" && <div className="measurement-overlay"><span className="measure-end" /><i /><b>1840 mm</b><span className="measure-end" /></div>}
        {tool === "section" && <div className="section-overlay"><Crosshair size={18} /><span><strong>剖切平面 X</strong><small>偏移 42%</small></span><input type="range" min="10" max="90" defaultValue="42" aria-label="剖切平面偏移" /></div>}
        {hiddenPartCount > 0 && <div className="hidden-parts-note"><EyeSlash size={15} />已隐藏 {hiddenPartCount} 个节点</div>}
        <div className="stage-hint"><Hand size={16} />{tool === "pan" ? "拖拽平移" : tool === "measure" ? "单击两点测量距离" : tool === "section" ? "拖动滑块调整剖切面" : "拖拽旋转 · 滚轮缩放 · 双击复位"}</div>
        <div className="stage-axis"><button onClick={() => setPreset("右视图")}>X</button><button onClick={() => setPreset("前视图")}>Y</button><button onClick={() => setPreset("等轴测")}>Z</button></div>
      </div><div className="viewer-tools viewer-tools--left"><IconButton label="显示模型结构" active={treeOpen} onClick={() => setTreeOpen((value) => !value)}><SidebarSimple size={19} /></IconButton><span className="tool-divider" /><IconButton label="重置视角" onClick={resetView}><ArrowCounterClockwise size={19} /></IconButton><IconButton label="旋转" active={tool === "rotate"} onClick={() => chooseTool("rotate")}><ArrowsClockwise size={19} /></IconButton><IconButton label="平移" active={tool === "pan"} onClick={() => chooseTool("pan")}><Hand size={19} /></IconButton><IconButton label="测量" active={tool === "measure"} onClick={() => chooseTool("measure")}><Ruler size={19} /></IconButton><IconButton label="剖切" active={tool === "section"} onClick={() => chooseTool("section")}><Crosshair size={19} /></IconButton></div>
      {treeOpen && <aside className="viewer-tree"><div className="viewer-tree__head"><span><TreeStructure size={17} />模型结构</span><IconButton label="关闭模型结构" onClick={() => setTreeOpen(false)}><X size={16} /></IconButton></div><label><MagnifyingGlass size={15} /><input placeholder="搜索节点" /></label><div>{parts.map((part) => <div className={`viewer-tree__row ${selectedPart === part.id ? "is-selected" : ""}`} style={{ paddingLeft: `${10 + part.depth * 14}px` }} key={part.id}><button onClick={() => setSelectedPart(part.id)}>{part.depth === 0 ? <TreeStructure size={15} /> : <Cube size={14} />}<span>{part.name}</span></button><IconButton label={`${partVisibility[part.id] ? "隐藏" : "显示"}${part.name}`} onClick={() => togglePart(part.id)}>{partVisibility[part.id] ? <Eye size={15} /> : <EyeSlash size={15} />}</IconButton></div>)}</div></aside>}
      <div className="viewer-tools viewer-tools--right"><IconButton label="放大" onClick={() => setZoom((value) => Math.min(1.55, value + .1))}><Plus size={19} /></IconButton><span>{Math.round(zoom * 100)}%</span><IconButton label="缩小" onClick={() => setZoom((value) => Math.max(.7, value - .1))}><Minus size={19} /></IconButton><span className="tool-divider" /><IconButton label={autoRotate ? "停止自动旋转" : "开启自动旋转"} active={autoRotate} onClick={() => setAutoRotate((value) => !value)}>{autoRotate ? <Pause size={18} /> : <Play size={18} />}</IconButton><IconButton label={fullscreen ? "退出沉浸模式" : "进入沉浸模式"} active={fullscreen} onClick={() => setFullscreen((value) => !value)}>{fullscreen ? <X size={19} /> : <ArrowsOutSimple size={19} />}</IconButton></div>
      </>}
    </section><aside className="model-detail-panel"><nav>{[["info", "模型信息"], ["structure", "结构"], ["textures", "贴图"], ["versions", "版本"]].map(([id, label]) => <button key={id} className={activeTab === id ? "is-active" : ""} onClick={() => setActiveTab(id)}>{label}</button>)}</nav><DetailPanelTab activeTab={activeTab} asset={asset} detail={detail} selectedPart={selectedPart} setSelectedPart={setSelectedPart} partVisibility={partVisibility} togglePart={togglePart} selectedTexture={selectedTexture} setSelectedTexture={setSelectedTexture} notify={notify} /><div className="detail-panel-footer"><button className="button button--primary" onClick={() => { setDownloadFormat(detail.primaryDownload); setDownloadOpen(true); }}><DownloadSimple size={18} />下载 {detail.primaryDownload}</button><button className="button button--secondary" onClick={() => notify("已加入“智能制造设备系列”项目")}><FolderOpen size={18} />加入项目</button></div></aside></div>
    {downloadOpen && <div className="modal-backdrop" onMouseDown={() => setDownloadOpen(false)}><div className="modal download-modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><h2>下载 3D 资产</h2><p>{isLocalGlb ? "选择要下载的本地资产文件。" : "选择适合当前使用场景的交付文件。"}</p></div><IconButton label="关闭下载窗口" onClick={() => setDownloadOpen(false)}><X size={19} /></IconButton></div><div className="download-options">{downloadOptions.map(([format, name, size, desc]) => <button key={format} className={downloadFormat === format ? "is-selected" : ""} onClick={() => setDownloadFormat(format)}><span className="format-icon">{format}</span><span><strong>{name}</strong><small>{desc}</small></span><em>{size}</em><span className="radio-dot" /></button>)}</div><label className="download-check"><input type="checkbox" checked={includeTextures} disabled={isLocalGlb} onChange={() => setIncludeTextures((value) => !value)} /><span><strong>{isLocalGlb ? "贴图已内嵌在 GLB" : "包含关联贴图"}</strong><small>{isLocalGlb ? "内嵌图像随 GLB 一并下载。" : "同时打包 4 张 PBR 贴图与材质说明"}</small></span></label><div className="modal-actions"><button className="button button--secondary" onClick={() => setDownloadOpen(false)}>取消</button><button className="button button--primary" onClick={startDownload}><DownloadSimple size={18} />{isLocalGlb ? "下载所选文件" : "创建下载任务"}</button></div></div></div>}
  </main>;
}

function ModelDetail({ asset, setView, notify }) {
  if (asset.type === "3D 模型" && !asset.externalUrl && (asset.id === "VGR-PRD-001248" || asset.modelUrl)) return <ModelDetail3d asset={asset} setView={setView} notify={notify} />;
  return <GenericAssetDetail asset={asset} setView={setView} notify={notify} />;
}

function UploadImport({ notify, onImport }) {
  const [dragging, setDragging] = useState(false); const [method, setMethod] = useState("local"); const [formatOpen, setFormatOpen] = useState(false); const [linkSource, setLinkSource] = useState("百度网盘"); const [shareLink, setShareLink] = useState(""); const [assetTitle, setAssetTitle] = useState(""); const [previewImage, setPreviewImage] = useState(""); const [linkVerified, setLinkVerified] = useState(false); const [project, setProject] = useState("智能制造设备系列"); const [maturity, setMaturity] = useState("候选"); const [conflict, setConflict] = useState("创建新版本"); const [submitReview, setSubmitReview] = useState(false); const [appliedRules, setAppliedRules] = useState({ project: "智能制造设备系列", maturity: "候选", conflict: "创建新版本", submitReview: false }); const [localPreviewName, setLocalPreviewName] = useState(""); const [tasks, setTasks] = useState([{ name: "pump_assembly_v2.3.glb", size: "286.4 MB", progress: 84, state: "处理中", type: "GLB", project: "智能制造设备系列", maturity: "候选", source: "本地上传", preview: "从文件提取" }, { name: "vigour_ui_components.fig", size: "42.1 MB", progress: 100, state: "已完成", type: "FIG", project: "智能制造设备系列", maturity: "候选", source: "本地上传", preview: "从文件提取" }, { name: "material_pack.zip", size: "118.6 MB", progress: 36, state: "已暂停", type: "ZIP", project: "智能制造设备系列", maturity: "候选", source: "本地上传", preview: "待补展示图" }]);
  const addFiles = (files) => { const next = Array.from(files).map((file) => ({ name: file.name, size: `${Math.max(.1, file.size / 1024 / 1024).toFixed(1)} MB`, progress: 6, state: "排队中", type: file.name.split(".").pop()?.toUpperCase() || "FILE", project: appliedRules.project, maturity: appliedRules.maturity, source: "本地上传", preview: localPreviewName || "待补展示图", submitReview: appliedRules.submitReview })); if (next.length) { setTasks((current) => [...next, ...current]); notify(`已添加 ${next.length} 个本地文件到导入队列`); } };
  const toggleTask = (index) => setTasks((current) => current.map((task, taskIndex) => taskIndex === index ? { ...task, state: task.state === "已暂停" ? "处理中" : "已暂停", progress: task.state === "已暂停" ? Math.min(100, task.progress + 18) : task.progress } : task));
  const validateLink = () => { if (!shareLink.trim() || !/^https?:\/\//.test(shareLink.trim())) { notify("请先填写有效的分享链接"); return; } setLinkVerified(true); notify(`${linkSource}链接已校验（本地原型）`); };
  const addLinkTask = () => { if (!linkVerified) { notify("请先校验分享链接"); return; } if (!previewImage.trim()) { notify("外链资产需提供展示图后才能加入导入队列"); return; } const name = assetTitle.trim() || `${linkSource}导入资产`; setTasks((current) => [{ name, size: "等待读取", progress: 12, state: "等待导入", type: linkSource === "钉钉链接" ? "LINK" : "CLOUD", project: appliedRules.project, maturity: appliedRules.maturity, source: linkSource, preview: previewImage, link: shareLink, submitReview: appliedRules.submitReview }, ...current]); notify(`“${name}”已加入导入队列（原型）`); setAssetTitle(""); setShareLink(""); setPreviewImage(""); setLinkVerified(false); };
  const completeTask = (index) => { const task = tasks[index]; if (task.registered) return; if (task.preview === "待补展示图") { notify("请先为该资产补充展示图后再登记"); return; } const type = task.type === "FIG" ? "UI 规范" : task.type === "PDF" ? "研究报告" : task.type === "LINK" ? "工作流" : task.type === "ZIP" ? "Skill 卡" : "3D 模型"; const id = `VGR-IMP-${String(Date.now()).slice(-6)}`; const imported = { id, name: task.name.replace(/\.[^.]+$/, ""), shortName: task.name.replace(/\.[^.]+$/, ""), type, source: task.source, fileType: task.type, tags: ["新导入"], version: "v0.1.0", owner: "林思远", role: "资产运营", updated: "2026-10-09 12:00", maturity: task.submitReview ? "待评审" : task.maturity, size: task.size, image: task.preview.startsWith("本地") || task.preview === "从文件提取" ? publicAsset("smart-factory.png") : undefined, visual: task.type === "LINK" ? "workflow" : task.type === "ZIP" ? "skill" : "ui", accent: "blue", project: task.project }; onImport(imported); setTasks((current) => current.map((item, taskIndex) => taskIndex === index ? { ...item, progress: 100, state: "已入库", registered: true } : item)); notify(`“${imported.shortName}”已登记到${task.project}（本地原型）`); };
  const sourceHint = linkSource === "钉钉链接" ? "粘贴钉钉文档、知识库、云盘或群文件分享链接" : linkSource === "Figma" ? "粘贴 Figma 文件或页面链接" : `粘贴${linkSource}分享链接${linkSource === "百度网盘" ? "，可包含提取码" : ""}`;
  return <main className="page-container upload-view"><div className="page-heading"><h1>上传与批量导入</h1><button className="button button--secondary" onClick={() => setFormatOpen(true)}><Info size={17} />查看支持格式</button></div><div className="upload-grid"><section className="upload-main"><section className="upload-method-card"><nav className="upload-method-tabs" aria-label="导入方式">{[["local", "本地文件"], ["cloud", "云盘链接"], ["dingtalk", "钉钉链接"]].map(([id, label]) => <button key={id} className={method === id ? "is-active" : ""} onClick={() => { setMethod(id); setLinkSource(id === "dingtalk" ? "钉钉链接" : id === "cloud" ? "百度网盘" : linkSource); setLinkVerified(false); }}>{label}</button>)}</nav>{method === "local" ? <section className={`drop-zone ${dragging ? "is-dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files); }}><label className="drop-zone-main"><input type="file" multiple onChange={(event) => addFiles(event.target.files)} /><span className="drop-icon"><CloudArrowUp size={32} weight="duotone" /></span><h2>拖拽本地文件到这里</h2><p>支持 GLB、GLTF、STEP、FIG、ZIP、PNG、PDF</p><span className="button button--primary"><FileArrowUp size={18} />选择文件</span></label><div className="local-preview-field"><span><strong>本地展示图</strong><small>{localPreviewName || "可为本批次选择 JPG、PNG 或 WebP；未提供时任务会标记待补展示图。"}</small></span><label className="button button--secondary"><Eye size={16} />选择展示图<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setLocalPreviewName(event.target.files?.[0]?.name || "")} /></label></div></section> : <section className="link-import-panel"><span className="drop-icon"><LinkSimple size={30} weight="duotone" /></span><div><h2>{method === "dingtalk" ? "从钉钉链接导入" : "从云盘链接导入"}</h2><p>{sourceHint}。不同资产可分别使用不同分享链接。</p></div><div className="link-form"><label>来源<select value={linkSource} onChange={(event) => { setLinkSource(event.target.value); setLinkVerified(false); }}>{method === "cloud" ? <><option>百度网盘</option><option>阿里云盘</option><option>Figma</option></> : <option>钉钉链接</option>}</select></label><label className="link-field">分享链接<input value={shareLink} onChange={(event) => { setShareLink(event.target.value); setLinkVerified(false); }} placeholder="https://…" /></label><button className="button button--secondary" onClick={validateLink}>{linkVerified ? <CheckCircle size={17} weight="fill" /> : <ShieldCheck size={17} />}{linkVerified ? "链接已校验" : "校验链接"}</button><label>资产名称（可选）<input value={assetTitle} onChange={(event) => setAssetTitle(event.target.value)} placeholder="自动读取或手动命名" /></label><label className="preview-field">展示图（必填）<span><input value={previewImage} onChange={(event) => setPreviewImage(event.target.value)} placeholder="粘贴图片地址或选择本地展示图" /><button type="button" onClick={() => setPreviewImage("示例展示图 · 1600 × 900")}>使用示例图</button></span><span className="preview-upload"><input aria-label="选择本地展示图" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPreviewImage(event.target.files?.[0]?.name ? `本地展示图：${event.target.files[0].name}` : "")} /><small>支持 JPG、PNG、WebP；用于资产库卡片、列表缩略图与详情页封面。</small></span></label></div><div className="link-requirement"><Eye size={17} /><span><strong>展示图为入库必填项</strong><small>源文件无法稳定生成缩略图时，请上传 JPG、PNG 或 WebP 展示图。</small></span><button className="button button--primary" onClick={addLinkTask}><Plus size={17} />加入导入队列</button></div></section>}</section><section className="import-options"><div className="section-heading"><div><h2>导入规则</h2><p>设置此次导入的项目归属、成熟度和冲突处理。</p></div><span className="soft-badge">本地模拟</span></div><div className="form-grid"><label>目标项目<select value={project} onChange={(event) => setProject(event.target.value)}><option>智能制造设备系列</option><option>新能源座舱 HMI</option><option>企业设计系统 v3</option></select></label><label>默认成熟度<select value={maturity} onChange={(event) => setMaturity(event.target.value)}><option>候选</option><option>试点</option><option>已验证</option></select></label><label>冲突处理<select value={conflict} onChange={(event) => setConflict(event.target.value)}><option>创建新版本</option><option>跳过重复资产</option><option>保留两个副本</option></select></label><label>资产来源<select value={method === "local" ? "本地上传" : linkSource} disabled><option>{method === "local" ? "本地上传" : linkSource}</option></select></label></div><div className="option-toggles"><label><input type="checkbox" defaultChecked />自动提取元数据</label><label><input type="checkbox" defaultChecked />导入前执行文件安全检查</label><label><input type="checkbox" checked={submitReview} onChange={() => setSubmitReview((value) => !value)} />完成后提交评审</label></div><div className="import-rule-footer"><span>当前生效：{appliedRules.project} · {appliedRules.maturity} · {appliedRules.conflict}</span><button className="button button--secondary" onClick={() => { setAppliedRules({ project, maturity, conflict, submitReview }); notify(`已应用规则：${project} · ${maturity}${submitReview ? " · 导入后提交评审" : ""}`); }}>应用规则</button></div></section></section><aside className="upload-queue"><div className="section-heading"><div><h2>导入任务</h2><p>{tasks.filter((task) => !task.registered).length} 个任务待处理</p></div><button onClick={() => setTasks([])}>清空</button></div>{tasks.length === 0 ? <div className="empty-mini"><FileArrowUp size={28} /><p>暂无导入任务</p></div> : tasks.map((task, index) => <div className="upload-task" key={`${task.name}-${index}`}><span className="file-type">{task.type}</span><div className="task-copy"><strong>{task.name}</strong><span>{task.size} · {task.state}</span><small>{task.project} · {task.maturity} · {task.preview}</small><div className="progress"><span style={{ width: `${task.progress}%` }} /></div></div><div className="task-actions">{!task.registered && <button className="text-button" onClick={() => completeTask(index)}>完成并登记</button>}{task.registered ? <CheckCircle size={22} weight="fill" className="success-icon" /> : <IconButton label={task.state === "已暂停" ? "继续" : "暂停"} onClick={() => toggleTask(index)}>{task.state === "已暂停" ? <Play size={18} /> : <Pause size={18} />}</IconButton>}</div></div>)}</aside></div>{formatOpen && <div className="modal-backdrop" onMouseDown={() => setFormatOpen(false)}><div className="modal format-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><h2>支持格式与展示图</h2><p>文件与外链资产会先进入导入队列，再按导入规则登记。</p></div><IconButton label="关闭支持格式" onClick={() => setFormatOpen(false)}><X size={19} /></IconButton></div><div className="format-list">{[["3D 模型", "GLB、GLTF、STEP", "需要展示图"], ["设计文件", "FIG、ZIP、PNG", "可提取或补充展示图"], ["文档与链接", "PDF、钉钉链接、云盘链接", "需要展示图"]].map(([type, formats, preview]) => <div key={type}><span><strong>{type}</strong><small>{formats}</small></span><em>{preview}</em></div>)}</div><div className="source-note"><Eye size={17} /><span><strong>展示图规范</strong><small>建议 16:9、至少 1600 × 900；图片仅用于资产展示，不替代原始文件或外链权限。</small></span></div><div className="modal-actions"><button className="button button--primary" onClick={() => setFormatOpen(false)}>知道了</button></div></div></div>}</main>;
}

function ProjectsPermissionsLegacy({ notify }) {
  const [activeProject, setActiveProject] = useState(0); const [tab, setTab] = useState("assets"); const [inviteOpen, setInviteOpen] = useState(false); const [access, setAccess] = useState({ upload: true, download: true, invite: false, manage: false }); const project = PROJECTS[activeProject];
  return <main className="page-container projects-view"><div className="page-heading"><div><span className="eyebrow">项目上下文与最小权限</span><h1>项目与权限</h1><p>按项目组织资产、成员和角色访问范围。</p></div><button className="button button--primary" onClick={() => setInviteOpen(true)}><UserPlus size={18} />邀请成员</button></div><div className="projects-layout"><aside className="project-list"><div className="project-list-title"><strong>全部项目</strong><button><Plus size={17} /></button></div>{PROJECTS.map((item, index) => <button key={item.name} className={activeProject === index ? "is-active" : ""} onClick={() => setActiveProject(index)}><img src={item.cover} alt="" /><span><strong>{item.name}</strong><small>{item.assets} 项资产 · {item.members} 位成员</small></span><CaretRight size={17} /></button>)}</aside><section className="project-detail"><div className="project-hero"><img src={project.cover} alt="" /><div><span className="soft-badge">{project.status}</span><h2>{project.name}</h2><p>统一管理项目中的设计资料、3D 模型、交付规范和评审记录。</p><div><span>{project.assets} 项资产</span><i /><span>{project.members} 位成员</span><i /><span>更新于 {project.updated}</span></div></div><IconButton label="项目设置"><Gear size={20} /></IconButton></div><nav className="content-tabs">{[["assets", "项目资产"], ["members", "成员"], ["roles", "角色与访问控制"]].map(([id, label]) => <button key={id} className={tab === id ? "is-active" : ""} onClick={() => setTab(id)}>{label}</button>)}</nav>{tab === "assets" && <div className="project-assets"><div className="project-kpis"><span><small>全部资产</small><strong>{project.assets}</strong></span><span><small>待评审</small><strong>3</strong></span><span><small>本周更新</small><strong>6</strong></span><span><small>项目存储</small><strong>82.4 GB</strong></span></div><AssetTable assets={ASSETS.slice(0, 4)} selected={[]} setSelected={() => {}} onOpen={() => notify("请从资产库打开模型详情")} /></div>}{tab === "members" && <div className="member-table"><div className="member-head"><span>成员</span><span>项目角色</span><span>所属团队</span><span>最近活动</span><span /></div>{MEMBERS.map((member) => <div className="member-row" key={member.name}><span className="member-person"><b>{member.avatar}</b><span><strong>{member.name}</strong><small>{member.name.toLowerCase()}@vigour.design</small></span></span><span className="role-select">{member.role}<CaretDown size={13} /></span><span>{member.team}</span><span>{member.last}</span><IconButton label="更多"><DotsThree size={19} /></IconButton></div>)}</div>}{tab === "roles" && <div className="roles-grid"><section><div className="section-heading"><div><h2>角色模板</h2><p>不同角色的默认访问边界。</p></div><button className="button button--secondary"><Plus size={16} />新建角色</button></div>{[["项目管理员", "完整项目权限", "2 人"], ["编辑者", "上传、编辑与版本管理", "5 人"], ["评审者", "查看、评论与批准", "3 人"], ["查看者", "只读与受控下载", "4 人"]].map(([name, desc, count], index) => <button className={`role-card ${index === 0 ? "is-active" : ""}`} key={name}><span className="role-icon"><ShieldCheck size={20} /></span><span><strong>{name}</strong><small>{desc}</small></span><em>{count}</em><CaretRight size={16} /></button>)}</section><section className="permission-panel"><div><LockSimple size={20} /><span><strong>项目管理员权限</strong><small>作用于“{project.name}”</small></span></div>{[["upload", "上传与编辑资产", "允许创建版本、替换文件与维护元数据"], ["download", "下载原始文件", "允许下载 GLB、源文件和关联贴图"], ["invite", "邀请项目成员", "允许添加成员并分配已有角色"], ["manage", "管理角色与权限", "允许创建角色并修改访问范围"]].map(([id, name, desc]) => <label className="permission-row" key={id}><span><strong>{name}</strong><small>{desc}</small></span><input type="checkbox" checked={access[id]} onChange={() => setAccess((current) => ({ ...current, [id]: !current[id] }))} /></label>)}</section></div>}</section></div>{inviteOpen && <div className="modal-backdrop" onMouseDown={() => setInviteOpen(false)}><div className="modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><h2>邀请项目成员</h2><p>邀请成员加入“{project.name}”。</p></div><IconButton label="关闭" onClick={() => setInviteOpen(false)}><X size={19} /></IconButton></div><label>成员邮箱<input placeholder="name@vigour.design" autoFocus /></label><label>项目角色<select defaultValue="编辑者"><option>编辑者</option><option>评审者</option><option>查看者</option></select></label><div className="modal-actions"><button className="button button--secondary" onClick={() => setInviteOpen(false)}>取消</button><button className="button button--primary" onClick={() => { setInviteOpen(false); notify("邀请已加入待发送列表（原型）"); }}>添加到邀请列表</button></div></div></div>}</main>;
}

function ProjectAssetPanel({ assets, projectIndex, project, notify, onPreview }) {
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("全部来源");
  const [maturity, setMaturity] = useState("全部成熟度");
  const [sort, setSort] = useState("最近更新");
  const [favorites, setFavorites] = useState([]);
  const defaultProjectAssets = [
    ASSETS.slice(0, 4),
    [ASSETS[1], ASSETS[2], ASSETS[4], ASSETS[6], ASSETS[7]],
    [ASSETS[0], ASSETS[3], ASSETS[5], ASSETS[6]],
  ][projectIndex] || ASSETS.slice(0, 4);
  const importedProjectAssets = assets.filter((asset) => asset.project === project.name);
  const projectAssets = [...defaultProjectAssets, ...importedProjectAssets.filter((asset) => !defaultProjectAssets.some((item) => item.id === asset.id))];
  const sources = ["全部来源", ...new Set(projectAssets.map((asset) => asset.source))];
  const maturities = ["全部成熟度", ...new Set(projectAssets.map((asset) => asset.maturity))];
  const filteredAssets = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = projectAssets.filter((asset) => {
      const matchesQuery = !normalized || `${asset.name} ${asset.id} ${asset.owner}`.toLowerCase().includes(normalized);
      return matchesQuery && (source === "全部来源" || asset.source === source) && (maturity === "全部成熟度" || asset.maturity === maturity);
    });
    return [...result].sort((a, b) => sort === "名称 A–Z" ? a.name.localeCompare(b.name, "zh-CN") : b.updated.localeCompare(a.updated));
  }, [projectAssets, query, source, maturity, sort]);
  const allSelected = filteredAssets.length > 0 && filteredAssets.every((asset) => selected.includes(asset.id));
  const toggleSelected = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const clearFilters = () => { setQuery(""); setSource("全部来源"); setMaturity("全部成熟度"); setSort("最近更新"); };

  return <div className="project-assets">
    <div className="project-kpis"><span><small>登记资产（全量）</small><strong>{project.assets}</strong></span><span><small>当前可操作清单</small><strong>{projectAssets.length}</strong></span><span><small>待评审（全量）</small><strong>3</strong></span><span><small>项目存储（全量）</small><strong>82.4 GB</strong></span></div>
    <div className="project-asset-toolbar">
      <label className="project-asset-search"><MagnifyingGlass size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索名称、资产 ID 或负责人" /></label>
      <select aria-label="筛选资产来源" value={source} onChange={(event) => setSource(event.target.value)}>{sources.map((item) => <option key={item}>{item}</option>)}</select>
      <select aria-label="筛选成熟度" value={maturity} onChange={(event) => setMaturity(event.target.value)}>{maturities.map((item) => <option key={item}>{item}</option>)}</select>
      <select aria-label="资产排序" value={sort} onChange={(event) => setSort(event.target.value)}><option>最近更新</option><option>名称 A–Z</option></select>
      <button className="button button--secondary project-filter-reset" disabled={!query && source === "全部来源" && maturity === "全部成熟度" && sort === "最近更新"} onClick={clearFilters}><X size={15} />重置</button>
    </div>
    <div className="project-filter-status"><span><Funnel size={14} />当前显示 {filteredAssets.length} 项</span>{source !== "全部来源" && <button onClick={() => setSource("全部来源")}>{source}<X size={12} /></button>}{maturity !== "全部成熟度" && <button onClick={() => setMaturity("全部成熟度")}>{maturity}<X size={12} /></button>}{query && <button onClick={() => setQuery("")}>“{query}”<X size={12} /></button>}</div>
    {selected.length > 0 && <div className="project-batch-bar"><strong>已选择 {selected.length} 项</strong><button onClick={() => notify(`已将 ${selected.length} 项资产加入评审（原型）`)}>加入评审</button><button onClick={() => notify(`已为 ${selected.length} 项资产创建下载任务（原型）`)}>批量下载</button><button onClick={() => setSelected([])}>取消选择</button></div>}
    <div className="asset-table project-asset-table">
      <div className="asset-table__head"><label><input type="checkbox" checked={allSelected} onChange={() => setSelected(allSelected ? [] : filteredAssets.map((asset) => asset.id))} /></label><span>资产信息</span><span>资产来源</span><span>资产 ID</span><span>版本</span><span>负责人</span><button onClick={() => setSort("最近更新")}>更新时间<ArrowsClockwise size={12} /></button><span>成熟度</span><span /></div>
      {filteredAssets.map((asset) => <div className={`asset-table__row ${selected.includes(asset.id) ? "is-selected" : ""}`} key={asset.id} onDoubleClick={() => onPreview(asset)}><label><input type="checkbox" checked={selected.includes(asset.id)} onChange={() => toggleSelected(asset.id)} /></label><button className="asset-name" onClick={() => onPreview(asset)}><AssetVisual asset={asset} /><span><strong>{asset.name}</strong><small>{asset.type} · {asset.size}</small></span></button><span className="source-cell"><SourceIcon name={asset.source} />{asset.source}</span><button className="asset-id" title="复制资产 ID" onClick={() => { navigator.clipboard?.writeText(asset.id); notify(`资产 ID ${asset.id} 已复制`); }}>{asset.id}<Copy size={14} /></button><span className="mono">{asset.version}</span><span className="owner-cell"><span className="mini-avatar">{asset.owner.slice(-1)}</span><span><strong>{asset.owner}</strong><small>{asset.role}</small></span></span><span className="date-cell">{asset.updated.split(" ")[0]}<small>{asset.updated.split(" ")[1]}</small></span><Maturity value={asset.maturity} /><AssetActions asset={asset} onOpen={onPreview} notify={notify} favorite={favorites.includes(asset.id)} onToggleFavorite={(id) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])} /></div>)}
      {filteredAssets.length === 0 && <div className="project-empty"><MagnifyingGlass size={28} /><strong>没有匹配的项目资产</strong><span>调整筛选条件或搜索关键词后重试。</span><button onClick={clearFilters}>清除筛选</button></div>}
    </div>
  </div>;
}

function ProjectMembersPanel({ notify, onInvite }) {
  const [query, setQuery] = useState("");
  const [roles, setRoles] = useState(Object.fromEntries(MEMBERS.map((member) => [member.name, member.role])));
  const [openMember, setOpenMember] = useState("");
  const visibleMembers = MEMBERS.filter((member) => `${member.name} ${member.team} ${member.role}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="member-table">
    <div className="member-toolbar"><label><MagnifyingGlass size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索成员或团队" /></label><span>{visibleMembers.length} 位成员</span><button className="button button--primary" onClick={onInvite}><UserPlus size={16} />邀请成员</button></div>
    <div className="member-head"><span>成员</span><span>项目角色</span><span>所属团队</span><span>最近活动</span><span /></div>
    {visibleMembers.map((member) => <div className="member-row" key={member.name}><span className="member-person"><b>{member.avatar}</b><span><strong>{member.name}</strong><small>{member.name.toLowerCase()}@vigour.design</small></span></span><select aria-label={`${member.name}的项目角色`} value={roles[member.name]} onChange={(event) => { setRoles((current) => ({ ...current, [member.name]: event.target.value })); notify(`已将${member.name}设为${event.target.value}（原型）`); }}><option>项目管理员</option><option>编辑者</option><option>评审者</option><option>查看者</option></select><span>{member.team}</span><span>{member.last}</span><div className="member-actions"><IconButton label={`更多操作：${member.name}`} active={openMember === member.name} onClick={() => setOpenMember((current) => current === member.name ? "" : member.name)}><DotsThree size={19} /></IconButton>{openMember === member.name && <div className="asset-action-menu"><button onClick={() => { setOpenMember(""); notify(`已打开${member.name}的权限摘要（原型）`); }}><ShieldCheck size={16} />查看权限</button><button onClick={() => { navigator.clipboard?.writeText(`${member.name.toLowerCase()}@vigour.design`); setOpenMember(""); notify("成员邮箱已复制"); }}><Copy size={16} />复制邮箱</button><button onClick={() => { setRoles((current) => ({ ...current, [member.name]: "评审者" })); setOpenMember(""); notify(`已将${member.name}设为评审者（原型）`); }}><CheckCircle size={16} />设为评审者</button></div>}</div></div>)}
  </div>;
}

function ProjectRolesPanel({ project, notify }) {
  const baseRoles = [
    { name: "项目管理员", desc: "完整项目权限", count: "2 人" },
    { name: "编辑者", desc: "上传、编辑与版本管理", count: "5 人" },
    { name: "评审者", desc: "查看、评论与批准", count: "3 人" },
    { name: "查看者", desc: "只读与受控下载", count: "4 人" },
  ];
  const defaultAccess = {
    "项目管理员": { upload: true, download: true, invite: true, manage: true },
    "编辑者": { upload: true, download: true, invite: false, manage: false },
    "评审者": { upload: false, download: true, invite: false, manage: false },
    "查看者": { upload: false, download: true, invite: false, manage: false },
  };
  const [rolesByProject, setRolesByProject] = useState({});
  const [accessByProject, setAccessByProject] = useState({});
  const [activeRole, setActiveRole] = useState("项目管理员");
  const [newRoleOpen, setNewRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const roles = rolesByProject[project.name] || baseRoles;
  const projectAccess = accessByProject[project.name] || defaultAccess;
  const access = projectAccess[activeRole] || defaultAccess[activeRole] || defaultAccess["查看者"];
  const updateAccess = (id) => setAccessByProject((current) => ({ ...current, [project.name]: { ...projectAccess, [activeRole]: { ...access, [id]: !access[id] } } }));
  const createRole = () => { const name = newRoleName.trim(); if (!name) return; setRolesByProject((current) => ({ ...current, [project.name]: [...roles, { name, desc: "自定义项目权限", count: "0 人" }] })); setAccessByProject((current) => ({ ...current, [project.name]: { ...projectAccess, [name]: { ...defaultAccess["查看者"] } } })); setActiveRole(name); setNewRoleName(""); setNewRoleOpen(false); notify(`角色“${name}”已创建（原型）`); };
  return <><div className="roles-grid"><section><div className="section-heading"><div><h2>角色模板</h2><p>选择角色后调整该项目内的默认权限。</p></div><button className="button button--secondary" onClick={() => setNewRoleOpen(true)}><Plus size={16} />新建角色</button></div>{roles.map((role) => <button className={`role-card ${activeRole === role.name ? "is-active" : ""}`} key={role.name} onClick={() => setActiveRole(role.name)}><span className="role-icon"><ShieldCheck size={20} /></span><span><strong>{role.name}</strong><small>{role.desc}</small></span><em>{role.count}</em><CaretRight size={16} /></button>)}</section><section className="permission-panel"><div><LockSimple size={20} /><span><strong>{activeRole}权限</strong><small>作用于“{project.name}”</small></span><button className="text-button permission-save" onClick={() => notify(`${activeRole}权限已保存（原型）`)}>保存更改</button></div>{[["upload", "上传与编辑资产", "允许创建版本、替换文件与维护元数据"], ["download", "下载原始文件", "允许下载 GLB、源文件和关联贴图"], ["invite", "邀请项目成员", "允许添加成员并分配已有角色"], ["manage", "管理角色与权限", "允许创建角色并修改访问范围"]].map(([id, name, desc]) => <label className="permission-row" key={id}><span><strong>{name}</strong><small>{desc}</small></span><span className="switch"><input aria-label={`${activeRole}：${name}`} type="checkbox" checked={access[id]} onChange={() => updateAccess(id)} /><span aria-hidden="true" /></span></label>)}</section></div>{newRoleOpen && <div className="modal-backdrop" onMouseDown={() => setNewRoleOpen(false)}><div className="modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><h2>新建项目角色</h2><p>新角色将复制“查看者”的基础权限。</p></div><IconButton label="关闭" onClick={() => setNewRoleOpen(false)}><X size={19} /></IconButton></div><label>角色名称<input autoFocus value={newRoleName} onChange={(event) => setNewRoleName(event.target.value)} placeholder="例如：外部协作方" /></label><div className="modal-actions"><button className="button button--secondary" onClick={() => setNewRoleOpen(false)}>取消</button><button className="button button--primary" disabled={!newRoleName.trim()} onClick={createRole}>创建角色</button></div></div></div>}</>;
}

function ProjectsPermissions({ assets, notify, initialProject = 0 }) {
  const [projects, setProjects] = useState(PROJECTS);
  const [activeProject, setActiveProject] = useState(initialProject);
  const [projectQuery, setProjectQuery] = useState("");
  const [projectScope, setProjectScope] = useState("全部项目");
  const [projectCategory, setProjectCategory] = useState("全部类型");
  const [newProjectCategory, setNewProjectCategory] = useState("产品研发");
  const [tab, setTab] = useState("assets");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [assetPreview, setAssetPreview] = useState(null);
  const [settingsDraft, setSettingsDraft] = useState({ name: "", status: "进行中", access: "仅项目成员" });
  const [newProjectName, setNewProjectName] = useState("");
  const project = projects[activeProject] || projects[0];
  const visibleProjects = projects.map((item, index) => ({ ...item, index })).filter((item) => item.name.toLowerCase().includes(projectQuery.toLowerCase()) && matchesProject(item, projectScope, projectCategory));
  const openSettings = () => { setSettingsDraft({ name: project.name, status: project.status, access: "仅项目成员" }); setSettingsOpen(true); };
  const saveSettings = () => { setProjects((current) => current.map((item, index) => index === activeProject ? { ...item, name: settingsDraft.name.trim() || item.name, status: settingsDraft.status } : item)); setSettingsOpen(false); notify("项目设置已保存（原型）"); };
  const createProject = () => { const name = newProjectName.trim(); if (!name) return; setProjects((current) => [...current, { name, category: newProjectCategory, participating: true, pending: false, assets: 0, members: 1, status: "规划中", updated: "刚刚", cover: publicAsset("smart-factory.png") }]); setActiveProject(projects.length); setTab("assets"); setNewProjectName(""); setNewProjectOpen(false); notify(`项目“${name}”已创建（原型）`); };

  return <main className="page-container projects-view"><div className="page-heading"><div><h1>项目与权限</h1></div><button className="button button--primary" onClick={() => setInviteOpen(true)}><UserPlus size={18} />邀请成员</button></div><StatStrip /><div className="projects-layout"><aside className="project-list"><div className="project-list-title"><strong>全部项目</strong><button aria-label="新建项目" title="新建项目" onClick={() => setNewProjectOpen(true)}><Plus size={17} /></button></div><label className="project-list-search"><MagnifyingGlass size={15} /><input value={projectQuery} onChange={(event) => setProjectQuery(event.target.value)} placeholder="搜索项目" /></label><ProjectCategories compact scope={projectScope} setScope={setProjectScope} category={projectCategory} setCategory={setProjectCategory} /><div className="project-list-items">{visibleProjects.map((item) => <button key={`${item.name}-${item.index}`} className={activeProject === item.index ? "is-active" : ""} onClick={() => { setActiveProject(item.index); setTab("assets"); }}><img src={item.cover} alt="" /><span><strong>{item.name}</strong><small>{item.assets} 项资产 · {item.members} 位成员</small></span><CaretRight size={17} /></button>)}{visibleProjects.length === 0 && <div className="project-list-empty">没有匹配项目<button onClick={() => { setProjectQuery(""); setProjectScope("全部项目"); setProjectCategory("全部类型"); }}>清除筛选</button></div>}</div></aside><section className="project-detail"><div className="project-hero"><img src={project.cover} alt="" /><div><span className="soft-badge">{project.status}</span><h2>{project.name}</h2><p>统一管理项目中的设计资料、3D 模型、交付规范和评审记录。</p><div><span>{project.assets} 项资产</span><i /><span>{project.members} 位成员</span><i /><span>更新于 {project.updated}</span></div></div><IconButton label="项目设置" onClick={openSettings}><Gear size={20} /></IconButton></div><nav className="content-tabs project-tabs">{[["assets", "项目资产", project.assets], ["members", "成员", project.members], ["roles", "角色与访问控制", 4]].map(([id, label, count]) => <button key={id} className={tab === id ? "is-active" : ""} onClick={() => setTab(id)}>{label}<span>{count}</span></button>)}</nav><div hidden={tab !== "assets"}><ProjectAssetPanel assets={assets} projectIndex={activeProject} project={project} notify={notify} onPreview={setAssetPreview} /></div><div hidden={tab !== "members"}><ProjectMembersPanel notify={notify} onInvite={() => setInviteOpen(true)} /></div><div hidden={tab !== "roles"}><ProjectRolesPanel project={project} notify={notify} /></div></section></div>
    {inviteOpen && <div className="modal-backdrop" onMouseDown={() => setInviteOpen(false)}><div className="modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><h2>邀请项目成员</h2><p>邀请成员加入“{project.name}”。</p></div><IconButton label="关闭" onClick={() => setInviteOpen(false)}><X size={19} /></IconButton></div><label>成员邮箱<input placeholder="name@vigour.design" autoFocus /></label><label>项目角色<select defaultValue="编辑者"><option>编辑者</option><option>评审者</option><option>查看者</option></select></label><div className="modal-actions"><button className="button button--secondary" onClick={() => setInviteOpen(false)}>取消</button><button className="button button--primary" onClick={() => { setInviteOpen(false); notify("邀请已加入待发送列表（原型）"); }}>添加到邀请列表</button></div></div></div>}
    {settingsOpen && <div className="modal-backdrop" onMouseDown={() => setSettingsOpen(false)}><div className="modal project-settings-modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><h2>项目设置</h2><p>调整项目名称、状态与默认访问边界。</p></div><IconButton label="关闭" onClick={() => setSettingsOpen(false)}><X size={19} /></IconButton></div><label>项目名称<input value={settingsDraft.name} onChange={(event) => setSettingsDraft((current) => ({ ...current, name: event.target.value }))} /></label><label>项目状态<select value={settingsDraft.status} onChange={(event) => setSettingsDraft((current) => ({ ...current, status: event.target.value }))}><option>进行中</option><option>评审中</option><option>规划中</option><option>已归档</option></select></label><label>默认访问范围<select value={settingsDraft.access} onChange={(event) => setSettingsDraft((current) => ({ ...current, access: event.target.value }))}><option>仅项目成员</option><option>团队可查看</option><option>受控外部访问</option></select></label><div className="project-settings-note"><ShieldCheck size={18} /><span><strong>最小权限原则</strong><small>更改默认范围不会覆盖已单独配置的角色权限。</small></span></div><div className="modal-actions"><button className="button button--secondary" onClick={() => setSettingsOpen(false)}>取消</button><button className="button button--primary" onClick={saveSettings}>保存设置</button></div></div></div>}
    {newProjectOpen && <div className="modal-backdrop" onMouseDown={() => setNewProjectOpen(false)}><div className="modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><h2>新建项目</h2><p>创建后可继续邀请成员并添加资产。</p></div><IconButton label="关闭" onClick={() => setNewProjectOpen(false)}><X size={19} /></IconButton></div><label>项目名称<input autoFocus value={newProjectName} onChange={(event) => setNewProjectName(event.target.value)} placeholder="例如：机器人末端执行器" /></label><label>项目类型<select value={newProjectCategory} onChange={(event) => setNewProjectCategory(event.target.value)}>{PROJECT_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label><div className="modal-actions"><button className="button button--secondary" onClick={() => setNewProjectOpen(false)}>取消</button><button className="button button--primary" disabled={!newProjectName.trim()} onClick={createProject}>创建项目</button></div></div></div>}
    {assetPreview && <div className="modal-backdrop" onMouseDown={() => setAssetPreview(null)}><div className="modal project-asset-preview" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><h2>资产详情</h2><p>{assetPreview.id}</p></div><IconButton label="关闭" onClick={() => setAssetPreview(null)}><X size={19} /></IconButton></div><div className="project-preview-main"><AssetVisual asset={assetPreview} large /><span><strong>{assetPreview.name}</strong><small>{assetPreview.type} · {assetPreview.fileType} · {assetPreview.size}</small><Maturity value={assetPreview.maturity} /></span></div><div className="project-preview-grid"><span><small>资产来源</small><strong>{assetPreview.source}</strong></span><span><small>负责人</small><strong>{assetPreview.owner}</strong></span><span><small>版本</small><strong>{assetPreview.version}</strong></span><span><small>更新时间</small><strong>{assetPreview.updated}</strong></span></div><div className="modal-actions"><button className="button button--secondary" onClick={() => { navigator.clipboard?.writeText(assetPreview.id); notify(`资产 ID ${assetPreview.id} 已复制`); }}><Copy size={16} />复制 ID</button><button className="button button--primary" onClick={() => { setAssetPreview(null); notify(`已打开“${assetPreview.shortName}”详情（原型）`); }}><Eye size={16} />打开详情</button></div></div></div>}
  </main>;
}

function McpCenter({ notify }) {
  const [clients, setClients] = useState(MCP_CLIENTS);
  const [active, setActive] = useState("chatgpt");
  const [tab, setTab] = useState("clients");
  const [permissionsByClient, setPermissionsByClient] = useState(() => Object.fromEntries(MCP_CLIENTS.map((client) => [client.id, Object.fromEntries(TOOL_PERMISSIONS.map((tool, index) => [tool, client.id === "workbuddy" ? false : index < (client.id === "codex" ? 5 : 4)]))])));
  const [disconnecting, setDisconnecting] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [settingsClient, setSettingsClient] = useState(null);
  const [settingsDraft, setSettingsDraft] = useState({ name: "", transport: "Streamable HTTP", scope: "当前团队", confirmation: true });
  const [logQuery, setLogQuery] = useState("");
  const [logStatus, setLogStatus] = useState("全部状态");
  const activeClient = clients.find((client) => client.id === active) || clients[0];
  const connectedCount = clients.filter((client) => client.status === "已连接").length;
  const activePermissions = Object.values(permissionsByClient[active] || {}).filter(Boolean).length;
  const clientPermissionCount = (id) => Object.values(permissionsByClient[id] || {}).filter(Boolean).length;
  const logs = [["14:26:18", "ChatGPT", "搜索资产", "VGR-PRD-001248", "412 ms", "成功"], ["14:21:09", "Codex", "读取元数据", "智能制造设备系列", "238 ms", "成功"], ["14:12:44", "飞书", "生成预览", "VGR-UI-000731", "1.2 s", "需复核"], ["13:58:31", "ChatGPT", "请求下载", "VGR-RPT-000089", "506 ms", "已确认"], ["13:42:06", "Codex", "创建项目引用", "VGR-WF-000321", "344 ms", "成功"]];
  const visibleLogs = logs.filter((row) => `${row[1]} ${row[2]} ${row[3]}`.toLowerCase().includes(logQuery.toLowerCase()) && (logStatus === "全部状态" || row[5] === logStatus));
  const updateClient = (id, updates) => setClients((current) => current.map((client) => client.id === id ? { ...client, ...updates } : client));
  const togglePermission = (tool) => setPermissionsByClient((current) => ({ ...current, [active]: { ...current[active], [tool]: !current[active][tool] } }));
  const openSettings = (client) => { setSettingsDraft({ name: client.name, transport: client.transport || "Streamable HTTP", scope: client.scope || "当前团队", confirmation: client.confirmation ?? true }); setSettingsClient(client); };
  const confirmDisconnect = () => { if (!disconnecting) return; updateClient(disconnecting.id, { status: "未连接", tools: 0, latency: "—" }); setDisconnecting(null); notify(`已断开“${disconnecting.name}”连接（本地原型）`); };
  const confirmConnect = () => { if (!connecting) return; updateClient(connecting.id, { status: "已连接", tools: connecting.tools || 6, latency: connecting.latency === "—" ? "326 ms" : connecting.latency }); setActive(connecting.id); setConnecting(null); notify(`“${connecting.name}”已连接（本地原型）`); };
  const saveSettings = () => { if (!settingsClient) return; updateClient(settingsClient.id, { name: settingsDraft.name.trim() || settingsClient.name, transport: settingsDraft.transport, scope: settingsDraft.scope, confirmation: settingsDraft.confirmation }); setSettingsClient(null); notify("客户端设置已保存到当前会话（原型）"); };
  const clientStatusTone = (status) => status === "已连接" ? "connected" : status === "需复核" ? "review" : "offline";
  const clientStatusDot = (status) => status === "已连接" ? "green" : status === "需复核" ? "orange" : "gray";

  return <main className="page-container mcp-view"><div className="page-heading"><div><h1>AI / MCP 接入中心</h1></div><button className="button button--secondary" onClick={() => notify("连接健康状态已刷新（本地原型）")}><ArrowsClockwise size={17} />刷新状态</button></div><div className="mcp-summary"><span><i className="summary-icon summary-icon--green"><PlugsConnected size={22} /></i><span><small>已连接客户端</small><strong>{connectedCount} / {clients.length}</strong></span></span><span><i className="summary-icon summary-icon--blue"><Wrench size={22} /></i><span><small>当前客户端已授权工具</small><strong>{activePermissions}</strong></span></span><span><i className="summary-icon summary-icon--violet"><Pulse size={22} /></i><span><small>近 24 小时调用（演示汇总）</small><strong>2,590</strong></span></span><span><i className="summary-icon summary-icon--orange"><WarningCircle size={22} /></i><span><small>需复核事件</small><strong>3</strong></span></span></div><section className="mcp-workspace"><nav className="content-tabs mcp-tabs">{[["clients", "客户端", clients.length], ["permissions", "工具授权", TOOL_PERMISSIONS.length], ["logs", "调用记录", logs.length]].map(([id, label, count]) => <button key={id} className={tab === id ? "is-active" : ""} onClick={() => setTab(id)}>{label}<span>{count}</span></button>)}</nav>{tab === "clients" && <div className="mcp-layout"><section className="client-grid">{clients.map((client) => { const Icon = client.icon; const isConnected = client.status === "已连接"; return <article className={`client-card ${active === client.id ? "is-selected" : ""}`} key={client.id} onClick={() => setActive(client.id)}><div className="client-head"><span className={`client-icon client-icon--${client.color}`}><Icon size={26} weight="duotone" /></span><span className={`connection-state connection-state--${clientStatusTone(client.status)}`}><StatusDot tone={clientStatusDot(client.status)} />{client.status}</span></div><h2>{client.name}</h2><p>{client.description}</p><div className="client-stats"><span><small>已授权工具</small><strong>{clientPermissionCount(client.id)}</strong></span><span><small>调用</small><strong>{client.calls.toLocaleString()}</strong></span><span><small>延迟</small><strong>{client.latency}</strong></span></div><button className={`button ${isConnected ? "button--secondary" : "button--primary"}`} onClick={(event) => { event.stopPropagation(); isConnected ? setDisconnecting(client) : setConnecting(client); }}>{isConnected ? <><Power size={17} />断开连接</> : <><Plug size={17} />配置连接</>}</button></article>; })}</section><aside className="client-config"><div className="section-heading"><div><span className={`client-icon client-icon--${activeClient.color}`}>{(() => { const Icon = activeClient.icon; return <Icon size={23} weight="duotone" />; })()}</span><span><h2>{activeClient.name} 配置</h2><small>{activeClient.status === "已连接" ? "当前会话可调用" : "尚未建立可调用连接"}</small></span></div><IconButton label="设置" onClick={() => openSettings(activeClient)}><Gear size={19} /></IconButton></div><div className="config-status"><span><small>传输模式</small><strong>{activeClient.transport || "Streamable HTTP"}</strong></span><span><small>最近握手</small><strong>{activeClient.status === "已连接" ? "2026-10-08 14:26" : "尚未连接"}</strong></span><span><small>默认授权范围</small><strong>{activeClient.scope || "当前团队"}</strong></span></div><div className="config-tools-heading"><h3>已授权工具</h3><span>{activePermissions} / {TOOL_PERMISSIONS.length}</span></div><div className="permission-mini-list">{TOOL_PERMISSIONS.slice(0, 5).map((tool, index) => <div key={tool}><span className="tool-icon"><Wrench size={16} /></span><span><strong>{tool}</strong><small>{permissionsByClient[active]?.[tool] ? index < 3 ? "只读授权" : "需用户确认" : "未授权"}</small></span>{permissionsByClient[active]?.[tool] ? <CheckCircle size={18} weight="fill" /> : <Minus size={18} />}</div>)}</div><button className="text-button" onClick={() => setTab("permissions")}>管理全部工具授权 <CaretRight size={15} /></button></aside></div>}{tab === "permissions" && <div className="permission-matrix"><section className="permission-intro"><ShieldCheck size={28} weight="duotone" /><h2>工具权限矩阵</h2><p>按客户端控制工具可见性与调用范围。所有变更仅保存在当前浏览器会话。</p><div className="client-selector">{clients.map((client) => <button key={client.id} className={active === client.id ? "is-active" : ""} onClick={() => setActive(client.id)}>{client.name}<span>{client.status}</span></button>)}</div></section><section className="permission-table"><div className="permission-table-head"><span>工具能力</span><span>授权范围</span><span>风险级别</span><span>状态</span></div>{TOOL_PERMISSIONS.map((tool, index) => <div className="permission-table-row" key={tool}><span><i><Wrench size={17} /></i><span><strong>{tool}</strong><small>asset.{index + 1}</small></span></span><span>{index < 3 ? "当前项目" : "用户确认后"}</span><span className={`risk risk--${index < 2 ? "low" : index < 4 ? "medium" : "high"}`}>{index < 2 ? "低" : index < 4 ? "中" : "高"}</span><label className="switch"><input aria-label={`${activeClient.name}：${tool}`} type="checkbox" checked={permissionsByClient[active]?.[tool] || false} onChange={() => togglePermission(tool)} /><span aria-hidden="true" /></label></div>)}</section></div>}{tab === "logs" && <div className="logs-panel"><div className="logs-toolbar"><label><MagnifyingGlass size={17} /><input value={logQuery} onChange={(event) => setLogQuery(event.target.value)} placeholder="搜索调用 ID、客户端或工具" /></label><label className="select-button log-select"><Funnel size={16} /><span className="sr-only">调用结果</span><select aria-label="调用结果" value={logStatus} onChange={(event) => setLogStatus(event.target.value)}><option>全部状态</option><option>成功</option><option>需复核</option><option>已确认</option></select></label><span className="select-button">最近 24 小时（演示）</span><button className="button button--secondary" onClick={() => notify("调用日志导出已模拟完成")}><DownloadSimple size={17} />导出</button></div><div className="log-table"><div className="log-head"><span>调用时间</span><span>客户端</span><span>工具</span><span>资产 / 项目</span><span>耗时</span><span>结果</span></div>{visibleLogs.map((row) => <div className="log-row" key={row.join("-")}>{row.map((cell, index) => <span key={index} className={index === 5 ? `log-result log-result--${cell === "成功" ? "success" : "review"}` : ""}>{cell}</span>)}</div>)}{visibleLogs.length === 0 && <div className="log-empty">没有匹配的调用记录</div>}</div></div>}</section>
    {disconnecting && <div className="modal-backdrop" onMouseDown={() => setDisconnecting(null)}><div className="modal mcp-modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><h2>断开 {disconnecting.name} 连接？</h2><p>本次操作仅更新当前原型会话，不会请求或修改真实客户端。</p></div><IconButton label="关闭" onClick={() => setDisconnecting(null)}><X size={19} /></IconButton></div><div className="mcp-modal-note"><WarningCircle size={19} /><span><strong>断开后的影响</strong><small>该客户端将不能调用已授权工具；调用记录和权限配置会保留。</small></span></div><div className="modal-actions"><button className="button button--secondary" onClick={() => setDisconnecting(null)}>取消</button><button className="button button--danger" onClick={confirmDisconnect}><Power size={16} />确认断开</button></div></div></div>}
    {connecting && <div className="modal-backdrop" onMouseDown={() => setConnecting(null)}><div className="modal mcp-modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><h2>配置 {connecting.name} 连接</h2><p>填写原型连接信息后，模拟保存并建立当前会话连接。</p></div><IconButton label="关闭" onClick={() => setConnecting(null)}><X size={19} /></IconButton></div><label>连接名称<input defaultValue={connecting.name} /></label><label>传输模式<select defaultValue="Streamable HTTP"><option>Streamable HTTP</option><option>Stdio（本地）</option></select></label><label>模拟端点<input defaultValue="mcp://local-sandbox" /></label><div className="mcp-modal-note"><Info size={19} /><span><strong>本地模拟</strong><small>不会访问端点、保存凭据或建立真实外部连接。</small></span></div><div className="modal-actions"><button className="button button--secondary" onClick={() => notify("本地连接检查通过（原型）")}>测试连接</button><button className="button button--primary" onClick={confirmConnect}><Plug size={16} />保存并连接</button></div></div></div>}
    {settingsClient && <div className="modal-backdrop" onMouseDown={() => setSettingsClient(null)}><div className="modal mcp-modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><h2>{settingsClient.name} 设置</h2><p>管理当前原型会话中的显示与默认调用策略。</p></div><IconButton label="关闭" onClick={() => setSettingsClient(null)}><X size={19} /></IconButton></div><label>客户端名称<input value={settingsDraft.name} onChange={(event) => setSettingsDraft((current) => ({ ...current, name: event.target.value }))} /></label><label>传输模式<select value={settingsDraft.transport} onChange={(event) => setSettingsDraft((current) => ({ ...current, transport: event.target.value }))}><option>Streamable HTTP</option><option>Stdio（本地）</option></select></label><label>默认授权范围<select value={settingsDraft.scope} onChange={(event) => setSettingsDraft((current) => ({ ...current, scope: event.target.value }))}><option>当前团队</option><option>当前项目</option><option>每次请求确认</option></select></label><label className="mcp-confirmation"><input type="checkbox" checked={settingsDraft.confirmation} onChange={() => setSettingsDraft((current) => ({ ...current, confirmation: !current.confirmation }))} /><span><strong>敏感操作前要求确认</strong><small>适用于下载、写入等非只读工具。</small></span></label><div className="modal-actions"><button className="button button--secondary" onClick={() => setSettingsClient(null)}>取消</button><button className="button button--primary" onClick={saveSettings}>保存设置</button></div></div></div>}
  </main>;
}

function McpCenterLegacy({ notify }) {
  const [clients, setClients] = useState(MCP_CLIENTS); const [active, setActive] = useState("chatgpt"); const [tab, setTab] = useState("clients"); const [permissions, setPermissions] = useState(Object.fromEntries(TOOL_PERMISSIONS.map((tool, index) => [tool, index < 4]))); const activeClient = clients.find((client) => client.id === active);
  const toggleConnection = (id) => setClients((current) => current.map((client) => client.id === id ? { ...client, status: client.status === "已连接" ? "未连接" : "已连接", tools: client.status === "已连接" ? 0 : 6 } : client));
  return <main className="page-container mcp-view"><div className="page-heading"><div><span className="eyebrow">后台管理模块 · 本地模拟</span><h1>AI / MCP 接入中心</h1><p>统一查看客户端连接、工具授权和调用记录，不连接真实外部服务。</p></div><button className="button button--secondary" onClick={() => notify("连接健康状态已刷新")}><ArrowsClockwise size={17} />刷新状态</button></div><div className="mcp-summary"><span><i className="summary-icon summary-icon--green"><PlugsConnected size={22} /></i><span><small>已连接客户端</small><strong>{clients.filter((client) => client.status === "已连接").length} / 4</strong></span></span><span><i className="summary-icon summary-icon--blue"><Wrench size={22} /></i><span><small>已授权工具</small><strong>19</strong></span></span><span><i className="summary-icon summary-icon--violet"><Pulse size={22} /></i><span><small>近 24 小时调用</small><strong>2,590</strong></span></span><span><i className="summary-icon summary-icon--orange"><WarningCircle size={22} /></i><span><small>需复核事件</small><strong>3</strong></span></span></div><nav className="content-tabs mcp-tabs">{[["clients", "客户端"], ["permissions", "工具授权"], ["logs", "调用记录"]].map(([id, label]) => <button key={id} className={tab === id ? "is-active" : ""} onClick={() => setTab(id)}>{label}</button>)}</nav>{tab === "clients" && <div className="mcp-layout"><section className="client-grid">{clients.map((client) => { const Icon = client.icon; return <article className={`client-card ${active === client.id ? "is-selected" : ""}`} key={client.id} onClick={() => setActive(client.id)}><div className="client-head"><span className={`client-icon client-icon--${client.color}`}><Icon size={26} weight="duotone" /></span><span className={`connection-state connection-state--${client.status === "已连接" ? "connected" : client.status === "需复核" ? "review" : "offline"}`}><StatusDot tone={client.status === "已连接" ? "green" : client.status === "需复核" ? "orange" : "gray"} />{client.status}</span></div><h2>{client.name}</h2><p>{client.description}</p><div className="client-stats"><span><small>工具</small><strong>{client.tools}</strong></span><span><small>调用</small><strong>{client.calls.toLocaleString()}</strong></span><span><small>延迟</small><strong>{client.latency}</strong></span></div><button className={`button ${client.status === "已连接" ? "button--secondary" : "button--primary"}`} onClick={(event) => { event.stopPropagation(); toggleConnection(client.id); }}>{client.status === "已连接" ? <><Power size={17} />断开连接</> : <><Plug size={17} />配置连接</>}</button></article>; })}</section><aside className="client-config"><div className="section-heading"><div><span className={`client-icon client-icon--${activeClient.color}`}>{(() => { const Icon = activeClient.icon; return <Icon size={23} weight="duotone" />; })()}</span><h2>{activeClient.name} 配置</h2></div><IconButton label="设置"><Gear size={19} /></IconButton></div><div className="config-status"><span><small>传输模式</small><strong>Streamable HTTP</strong></span><span><small>最近握手</small><strong>2026-10-08 14:26</strong></span><span><small>运行环境</small><strong>原型沙箱</strong></span></div><h3>已授权工具</h3><div className="permission-mini-list">{TOOL_PERMISSIONS.slice(0, 5).map((tool, index) => <div key={tool}><span className="tool-icon"><Wrench size={16} /></span><span><strong>{tool}</strong><small>{index < 3 ? "只读授权" : "需用户确认"}</small></span><CheckCircle size={18} weight="fill" /></div>)}</div><button className="text-button" onClick={() => setTab("permissions")}>管理全部工具授权 <CaretRight size={15} /></button></aside></div>}{tab === "permissions" && <div className="permission-matrix"><section className="permission-intro"><ShieldCheck size={28} weight="duotone" /><h2>工具权限矩阵</h2><p>按客户端控制工具可见性与调用范围。所有变更仅保存在当前浏览器会话。</p><div className="client-selector">{clients.map((client) => <button key={client.id} className={active === client.id ? "is-active" : ""} onClick={() => setActive(client.id)}>{client.name}</button>)}</div></section><section className="permission-table"><div className="permission-table-head"><span>工具能力</span><span>授权范围</span><span>风险级别</span><span>状态</span></div>{TOOL_PERMISSIONS.map((tool, index) => <div className="permission-table-row" key={tool}><span><i><Wrench size={17} /></i><span><strong>{tool}</strong><small>asset.{index + 1}</small></span></span><span>{index < 3 ? "当前项目" : "用户确认后"}</span><span className={`risk risk--${index < 2 ? "low" : index < 4 ? "medium" : "high"}`}>{index < 2 ? "低" : index < 4 ? "中" : "高"}</span><label className="switch"><input type="checkbox" checked={permissions[tool]} onChange={() => setPermissions((current) => ({ ...current, [tool]: !current[tool] }))} /><span /></label></div>)}</section></div>}{tab === "logs" && <div className="logs-panel"><div className="logs-toolbar"><label><MagnifyingGlass size={17} /><input placeholder="搜索调用 ID、客户端或工具" /></label><button className="select-button"><Funnel size={16} />全部状态<CaretDown size={13} /></button><button className="select-button">最近 24 小时<CaretDown size={13} /></button><button className="button button--secondary" onClick={() => notify("调用日志导出已模拟完成")}><DownloadSimple size={17} />导出</button></div><div className="log-table"><div className="log-head"><span>调用时间</span><span>客户端</span><span>工具</span><span>资产 / 项目</span><span>耗时</span><span>结果</span></div>{[["14:26:18", "ChatGPT", "搜索资产", "VGR-PRD-001248", "412 ms", "成功"], ["14:21:09", "Codex", "读取元数据", "智能制造设备系列", "238 ms", "成功"], ["14:12:44", "飞书", "生成预览", "VGR-UI-000731", "1.2 s", "需复核"], ["13:58:31", "ChatGPT", "请求下载", "VGR-RPT-000089", "506 ms", "已确认"], ["13:42:06", "Codex", "创建项目引用", "VGR-WF-000320", "344 ms", "成功"]].map((row) => <div className="log-row" key={row.join("-")}>{row.map((cell, index) => <span key={index} className={index === 5 ? `log-result log-result--${cell === "成功" ? "success" : "review"}` : ""}>{cell}</span>)}</div>)}</div></div>}</main>;
}

export function App() {
  const [projectEntryIndex, setProjectEntryIndex] = useState(0);
  const onProject = (index) => { setProjectEntryIndex(index); setView("projects"); };
  const [view, setView] = useState("dashboard"); const [assets, setAssets] = useState(ASSETS); const [query, setQuery] = useState(""); const [activeAsset, setActiveAsset] = useState(ASSETS[0]); const [recentAssetIds, setRecentAssetIds] = useState(ASSETS.slice(0, 4).map((asset) => asset.id)); const team = "工业设计团队"; const [typeFilter, setTypeFilter] = useState("全部资产"); const [sourceFilters, setSourceFilters] = useState([]); const [fileFilters, setFileFilters] = useState([]); const [tagFilters, setTagFilters] = useState([]); const [maturityFilter, setMaturityFilter] = useState("全部"); const [toast, setToast] = useState(""); const toastTimer = useRef(null);
  const notify = (message) => { setToast(message); window.clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToast(""), 2600); };
  const onOpen = (asset) => { setActiveAsset(asset); setRecentAssetIds((current) => [asset.id, ...current.filter((id) => id !== asset.id)].slice(0, 4)); setView("detail"); };
  const onImport = (asset) => setAssets((current) => current.some((item) => item.id === asset.id) ? current : [asset, ...current]);
  useEffect(() => { const closeTopModal = (event) => { if (event.key !== "Escape") return; const closers = [...document.querySelectorAll(".modal-backdrop .icon-button")]; closers.at(-1)?.click(); }; window.addEventListener("keydown", closeTopModal); return () => window.removeEventListener("keydown", closeTopModal); }, []);
  const filters = { typeFilter, sourceFilters, fileFilters, tagFilters, maturityFilter }; const setters = { setTypeFilter, setSourceFilters, setFileFilters, setTagFilters, setMaturityFilter };
  const recentAssets = recentAssetIds.map((id) => assets.find((asset) => asset.id === id)).filter(Boolean);
  return <div className="app-shell"><AppHeader view={view} setView={setView} query={query} setQuery={setQuery} notify={notify} team={team} recentAssets={recentAssets} onOpen={onOpen} /><div hidden={view !== "home"}><Home setView={setView} /></div><div hidden={view !== "dashboard"}><Dashboard assets={assets} setView={setView} onOpen={onOpen} onProject={onProject} /></div><div hidden={view !== "library"}><Library assets={assets} query={query} setQuery={setQuery} filters={filters} setters={setters} onOpen={onOpen} notify={notify} /></div><div hidden={view !== "docs"}><Documentation /></div><div hidden={view !== "detail"}><ModelDetail asset={activeAsset} setView={setView} notify={notify} /></div><div hidden={view !== "upload"}><UploadImport notify={notify} onImport={onImport} /></div><div hidden={view !== "projects"}><ProjectsPermissions assets={assets} notify={notify} initialProject={projectEntryIndex} /></div><div hidden={view !== "mcp"}><McpCenter notify={notify} /></div><div className={`toast ${toast ? "is-visible" : ""}`}><CheckCircle size={20} weight="fill" />{toast}</div></div>;
}
