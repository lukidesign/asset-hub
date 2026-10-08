# Design Asset Hub Prototype Test Report

## Test environment

- Date: 2026-10-08
- Runtime: Vite 6.4.2, React 19.2.0, macOS
- Primary test surface: Codex in-app browser at 1440 × 1024
- Secondary viewport: 1280 × 800
- Local URL: `http://127.0.0.1:4173/`
- Browser Use status: blocked because Chrome/Edge was not running with a remote-debugging endpoint and Browser Use cloud authentication was unavailable. The in-app browser was used as the documented fallback.

## Coverage

| Area | Result | Evidence |
|---|---|---|
| UI and visual fidelity | Pass | `test-artifacts/dashboard-comparison-final.png`, `test-artifacts/dashboard-hero-comparison.png` |
| Product navigation | Pass | All five top-level destinations and the 3D detail state opened successfully |
| Asset library | Pass | Grid/list switch, selection, batch-action bar, and detail opening verified |
| 3D detail | Pass | GLB/GLTF state, render-mode change, texture panel, zoom/rotate controls visible and interactive |
| Upload/import | Pass with boundary | Drag/drop surface, file input, rules, queue, progress, and pause/resume UI present; no real file transmission performed |
| Projects and permissions | Pass | Project switching, member view, roles, permission controls, and invite modal verified |
| AI/MCP center | Pass with boundary | Four clients, connection state, tool authorization, and call log are local simulations only |
| Frontend build | Pass | `npm run build` completed; 4570 modules transformed |
| Sites packaging | Pass | `npm run test:sites`: 4 passed, 0 failed |
| Console/runtime | Pass | No browser console warnings or errors after the end-to-end run |
| Backend/API | Not applicable | The confirmed scope excludes backend persistence, server purchase, deployment, and real MCP development |
| Network requests | Limited | Local images and app resources rendered in-browser; CLI HTTP checks were isolated from the escalated preview process by the sandbox |
| Performance metrics | Blocked | The available in-app browser evaluation surface did not expose Navigation/Resource Timing; no exact load-time claim is made |

## Summary

- Passed: 12 primary interaction checks, frontend build, 4 Sites worker tests, 1440px visual QA, 1280px layout resilience.
- Failed: 0 open functional checks.
- Fixed during verification: 2 P2 issues (asset-card accessible names; oversized hero model overlap).
- Blocked/limited: Browser Use CDP connection, exact Navigation/Resource Timing, real backend/API/MCP/network behavior.

## Issue list

### Resolved — [P2] Asset preview controls lacked accessible names

- Page: 资产资源库 / 网格视图
- Reproduction: open 资产库, switch to grid view, inspect the asset preview control in the accessibility tree.
- Expected: each preview button identifies the asset it opens.
- Actual before fix: preview buttons and view toggles had no accessible name.
- Resolution: added explicit names for asset preview and view-mode buttons; retest passed.
- Evidence: final browser accessibility state and `src/App.jsx`.

### Resolved — [P2] Hero model overlapped the descriptive copy

- Page: 工作台 / 资产总览
- Reproduction: compare the 1440px implementation hero to the selected third visual concept.
- Expected: product copy remains isolated on the left and the complete pump remains readable on the right.
- Actual before fix: the pump flange entered the copy region and the assembly was cropped.
- Resolution: constrained the model image to the right 60% with contained sizing.
- Evidence: `test-artifacts/dashboard-comparison-final.png` and `test-artifacts/dashboard-hero-comparison.png`.

### Blocked — Browser Use CDP validation

- Expected: Browser Use connects to Chrome/Edge for the mandated remote-debugging test surface.
- Actual: no running Chrome/Edge debug endpoint; Browser Use daemon and cloud auth unavailable.
- Evidence: `browser-use --doctor` reported 0 active browser connections.
- Risk: Browser-specific differences in the user's external Chrome profile were not validated.
- Recommendation: when Chrome remote debugging is available, rerun the same smoke suite in Browser Use without changing product data.

### Blocked — Exact performance timings

- Expected: collect Navigation Timing and Resource Timing metrics for the 1440px dashboard.
- Actual: the in-app browser's read-only page evaluator did not expose the Performance API.
- Risk: image payloads are visually verified but load-time budgets are not measured.
- Recommendation: profile LCP, image transfer size, and main-thread work in Browser Use/Chrome before network deployment; current project images total roughly 9.8 MB uncompressed.

## Risks and recommendations

- Keep the current local/mock boundaries explicit. Connection status, permissions, uploads, downloads, and MCP calls are not production integrations.
- Before deployment, optimize the four PNG assets into responsive WebP/AVIF derivatives and establish an image budget.
- Before backend work, define the asset schema, versioning policy, authorization model, upload scanning, signed-download behavior, audit events, and MCP tool confirmation rules.
- Validate external Chrome behavior, exact performance metrics, and keyboard-only traversal when Browser Use becomes available.
