# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

The 3D experience should stay progressive rather than CAD-dense: keep the workbench preview lightweight, then expose model structure, rotation/pan/zoom, view presets, measurements, section inspection, hotspots, textures, versions, and format-specific downloads inside the immersive detail viewer. These behaviors are local prototype interactions unless the user explicitly requests a real 3D engine or backend.

## Confirmed prototype direction (2026-10-08)

- Dashboard confirmation: remove the overview sorting/view toggles and the governance panel heading; show KPI values as non-interactive statistics. Add enterprise file library, object storage, and supplier delivery as ingress categories, initially with zero assets and pending connection status. Project entry uses scope (all, participating, pending my action, archived) plus type (product R&D, experience/HMI, design system, research, supplier collaboration). Project cards must carry the selected project into the project page. Additional audit findings require a separate implementation request.

- Use the third generated concept as the visual source of truth: a light SaaS asset workspace with compact top navigation, a left taxonomy/filter rail, a dense central asset stream, and a right governance panel.
- Use a dark, immersive viewer surface for 3D model inspection while keeping the surrounding application shell light.
- Phase 1 covers six local prototype modules: asset overview, asset library, 3D model detail, asset upload/import, projects and permissions, and an AI/MCP integration center.
- Show ChatGPT, Codex, Feishu, and WorkBuddy as backend administration integrations with simulated connection status, tool authorization, and call history only.
- Keep all prototype data and interactions local and mocked. Do not purchase servers, deploy to a network, connect real MCP clients, or implement production persistence unless the user explicitly expands scope.
- Treat “asset source” as the ingress location, not the authoring software. The confirmed prototype taxonomy is local upload, Baidu Netdisk, Aliyun Drive, DingTalk links, and Figma; do not show Creo, SolidWorks, or Notion as source filters. Authoring tools belong in asset metadata when needed.
- Keep the dashboard title area lean: do not repeat the navigation breadcrumb or registry count when the global navigation and KPI strip already provide that context. File type and tag rails must be expandable, multi-select filters with a visible clear action; source management should also show future source candidates (enterprise NAS/SMB, object storage, supplier delivery, and external links) as local prototype recommendations.
- In the library prototype, expose filter provenance: maturity comes from import checks plus human review/project workflow; file type comes from extension/content or link-type parsing; tags combine upload extraction, AI suggestions, and human maintenance. Treat all three as mocked local metadata until a real ingestion workflow is approved.
- The upload prototype must offer separate local-file, cloud-link, and DingTalk-link entry points. Links are individually validated before queueing, and externally linked assets require a display image for cards, list thumbnails, and detail cover; show this requirement and an image-specification surface. Keep these flows local and simulated.
- Keep top-level headings lean on Upload, Projects/Permissions, and AI/MCP: show the page title and actionable control only; hide duplicated eyebrow and explanatory subtitle copy.
- The Projects/Permissions prototype must support project search and local project creation, project switching, editable project settings, counted tabs for assets/members/roles, project-scoped asset search and filters, visible asset-ID copy feedback, and complete row action menus. Member roles and role permissions are interactive local states; no production invitation or access change is implied.
- The AI/MCP prototype should present clients, tool authorization, and call history inside one spaced workspace with counted tabs. Connection state changes need a local confirmation/configuration flow with visible outcome feedback; client settings only change the in-session mock state and must never claim to establish a real MCP connection, store credentials, or alter external permissions.

## Confirmed interaction closure (2026-10-09)

- Every asset must open its own detail identity. Non-3D assets use a type-appropriate metadata/preview detail surface rather than being substituted with the 3D pump.
- Saved filters restore their full local condition snapshot, and local session interactions survive top-level module navigation. No browser-persistent storage is implied.
- Import records keep local file/link metadata, display-image selection, applied import rules, and a simulated completion step that registers the asset to both the library and its selected project. This remains an in-memory prototype workflow.
- Role permissions are isolated by project and role, with least-privilege defaults for viewers. MCP tool authorizations are isolated by client. Neither behavior represents a real external permission change.
- Show the scope of demo metrics explicitly; log search/result filtering and keyboard-accessible switches/modal dismissal are required interaction basics.
- User-provided public 3D assets may be registered as `外部公开链接`, retaining both source-page and model-file URLs. They are reference-only in this local prototype: do not download, host, or claim to render the remote source unless separately approved.
- Dashboard confirmation: remove the taxonomy/filter rail and asset-source status panel from the workbench. Move recent-asset access into the top-bar personal menu, and use the recovered space for directly openable curated assets. Keep filtering and governance surfaces in the library and other dedicated modules.
- The user-approved `Dashboard.html` central-building scene is a local-source exception: preserve its original source reference, export the `main` Three.js group as a GLB with embedded textures, package it with a rendered display image plus manifest/README, and register it in the prototype as a `本地上传` 3D asset under “智能制造设备系列”. Do not represent dashboard controls, telemetry, animations, or the surrounding scene UI as part of the model asset.
- Local 3D assets with packaged model files, including the Dashboard central building, use the same immersive 3D detail anatomy as the primary model: dark viewer workspace plus model information, structure, textures, versions, and download affordances. Detail values must reflect the actual exported package rather than inherited pump metadata.
- For the Dashboard central-building local GLB detail, render the exported GLB through a real local WebGL viewer with direct orbit, pan, and zoom; do not show decorative hotspots, fake view presets, axes, or unsupported render-mode controls.
- Keep Upload, Projects, AI/MCP, and Library module headings at 24px; omit the redundant “资产总览” heading from the dashboard.
- Keep library category, source, maturity, file-type, and tag counts derived from the active in-memory asset records. Do not show “供应商交付” as an available prototype source until it is explicitly restored.
- Use the supplied `preview2.png` as the Dashboard central-building card image and use the concise asset name “Dashboard 中央主楼”.
- User-provided local GLB assets, including `inverter 逆变器`, must retain the supplied GLB and preview image and open in the real local WebGL viewer; do not substitute a static cover image for the interactive model view.
- Dashboard KPI statistics now live in “项目与权限”; the dashboard keeps the focused workbench and does not expose decorative floating preview controls.
- The obsolete “产品设计评审工作流” record is removed. `VGR-PRD-001244` is the user-provided “园区资产包 CAMPUS ASSETS” preview-only local asset package, not an asserted interactive model until a model file is supplied.
- App navigation is a single compact top bar: “首页” appears before “工作台”, global search sits immediately left of notifications at a reduced width, and team switching is intentionally omitted.
- Keep only “首页 / 工作台 / 资产库 / 文档” in the primary text navigation. Upload and MCP are blue icon shortcuts placed immediately left and right of notifications; “项目与权限” lives in the avatar menu. The in-app documentation uses a categorized component overview inspired by Ant Design, while accurately identifying the prototype as custom React/CSS with Phosphor Icons and Three.js rather than an Ant Design implementation.
