import { createServer } from "node:http";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceFile = join(rootDir, "reference", "source-materials", "Dashboard.html");
const outputDir = join(rootDir, "public", "assets", "imported", "dashboard-main-building");
const packageFile = join(outputDir, "dashboard-main-building.glb");
const previewFile = join(outputDir, "preview.png");
const manifestFile = join(outputDir, "manifest.json");
const readmeFile = join(outputDir, "README.md");
const port = Number(process.env.ASSET_EXPORT_PORT || 4178);

const clientModule = `
import { GLTFExporter } from "/three/GLTFExporter.js";

const status = document.createElement("pre");
status.id = "asset-export-status";
status.style.cssText = "position:fixed;z-index:2147483647;right:16px;bottom:16px;margin:0;padding:10px 12px;border-radius:8px;background:#06111e;color:#c9f3df;font:12px/1.4 system-ui;box-shadow:0 8px 24px #0008";
status.textContent = "正在准备导出主楼模型…";
document.body.append(status);

const waitFor = async (check, timeout = 30000) => {
  const started = Date.now();
  while (!check()) {
    if (Date.now() - started > timeout) throw new Error("等待三维场景初始化超时");
    await new Promise((resolve) => setTimeout(resolve, 160));
  }
  return check();
};

const postBinary = async (url, body, contentType) => {
  const response = await window.__assetHubNativeFetch(url, { method: "POST", headers: { "content-type": contentType }, body });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

try {
  const context = await waitFor(() => window.__assetHubExportContext);
  const building = context.buildings.get("main")?.group;
  if (!building) throw new Error("未找到主楼场景对象");
  building.updateMatrixWorld(true);
  const exporter = new GLTFExporter();
  const binary = await new Promise((resolve, reject) => exporter.parse(building, resolve, reject, {
    binary: true,
    onlyVisible: true,
    maxTextureSize: 4096,
  }));
  if (!(binary instanceof ArrayBuffer)) throw new Error("导出器未返回 GLB 二进制数据");
  const packageInfo = await postBinary("/asset-package", binary, "model/gltf-binary");

  const canvas = [...document.querySelectorAll("canvas")].find((item) => item.width > 320 && item.height > 180);
  if (canvas) {
    const preview = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (preview) await postBinary("/asset-preview", preview, "image/png");
  }
  status.textContent = "已导出：" + packageInfo.sizeLabel + "，贴图已内嵌 GLB";
} catch (error) {
  status.style.color = "#ffb4b4";
  status.textContent = "导出失败：" + error.message;
  console.error(error);
}
`;

const diagnosticsScript = `
window.__assetHubNativeFetch = window.fetch.bind(window);
const report = (kind, value) => fetch('/export-diagnostic', {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ kind, value: String(value?.stack || value?.message || value) }),
}).catch(() => {});
window.addEventListener('error', (event) => report('error', event.error || event.message));
window.addEventListener('unhandledrejection', (event) => report('rejection', event.reason));
`;

const sizeLabel = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

const writeManifest = async () => {
  const packageStats = await stat(packageFile).catch(() => null);
  const previewStats = await stat(previewFile).catch(() => null);
  if (!packageStats) return;
  await writeFile(manifestFile, `${JSON.stringify({
    id: "VGR-PRD-001258",
    name: "Dashboard 中央主楼 · 程序化场景导出",
    source: "本地上传",
    sourceFile: "reference/source-materials/Dashboard.html",
    sourceType: "Three.js 程序化场景",
    model: "dashboard-main-building.glb",
    modelFormat: "GLB",
    textureHandling: "贴图已内嵌在 GLB；包含运行时生成的屋顶文字贴图。",
    preview: previewStats ? "preview.png" : null,
    generatedAt: new Date().toISOString(),
    sizeBytes: packageStats.size,
  }, null, 2)}\n`);
  await writeFile(readmeFile, `# Dashboard 中央主楼 · 本地资产包\n\n- 来源：\`reference/source-materials/Dashboard.html\`\n- 模型：\`dashboard-main-building.glb\`\n- 贴图：已内嵌在 GLB（二进制包），包括程序化生成的屋顶文字贴图。\n- 说明：这是从运行时 Three.js 场景导出的静态主楼模型；实时数据、交互控件、动态灯光和动画不在模型包内。\n`);
};

const dashboardScripts = async () => {
  const source = await readFile(sourceFile, "utf8");
  const marker = "return{root:e,buildings:i,occluders:a,roadSamples:et,plantPositions:ft,materials:o,frontage:";
  if (!source.includes(marker)) throw new Error("未找到 Dashboard 场景导出锚点");
  const scripts = [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
  if (scripts.length < 2) throw new Error("未找到 Dashboard 的初始化脚本");
  return {
    source,
    assetRegistry: scripts[0][1],
    application: scripts[1][1]
      .replace(marker, "window.__assetHubExportContext={root:e,buildings:i,materials:o};" + marker)
      .replace("new jO({antialias:!0,alpha:!1})", "new jO({antialias:!0,alpha:!1,preserveDrawingBuffer:!0})"),
    first: scripts[0],
    second: scripts[1],
  };
};

const htmlForExport = async () => {
  const { source, first, second } = await dashboardScripts();
  const externalized = `${source.slice(0, first.index)}<script src="/export-diagnostics.js"></script><script src="/dashboard-assets.js"></script>${source.slice(first.index + first[0].length, second.index)}<script src="/dashboard-app.js"></script>${source.slice(second.index + second[0].length)}`;
  const bodyClose = externalized.lastIndexOf("</body>");
  if (bodyClose < 0) throw new Error("未找到 Dashboard 页面尾部");
  return `${externalized.slice(0, bodyClose)}<script type="module" src="/exporter-client.mjs"></script>${externalized.slice(bodyClose)}`;
};

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    console.log(`${request.method} ${url.pathname}`);
    if (request.method === "GET" && url.pathname === "/dashboard-export.html") {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      response.end(await htmlForExport());
      return;
    }
    if (request.method === "GET" && url.pathname === "/dashboard-assets.js") {
      response.writeHead(200, { "content-type": "text/javascript; charset=utf-8" });
      response.end((await dashboardScripts()).assetRegistry);
      return;
    }
    if (request.method === "GET" && url.pathname === "/export-diagnostics.js") {
      response.writeHead(200, { "content-type": "text/javascript; charset=utf-8" });
      response.end(diagnosticsScript);
      return;
    }
    if (request.method === "GET" && url.pathname === "/dashboard-app.js") {
      response.writeHead(200, { "content-type": "text/javascript; charset=utf-8" });
      response.end((await dashboardScripts()).application);
      return;
    }
    if (request.method === "GET" && url.pathname === "/exporter-client.mjs") {
      response.writeHead(200, { "content-type": "text/javascript; charset=utf-8" });
      response.end(clientModule);
      return;
    }
    if (request.method === "GET" && url.pathname === "/three/GLTFExporter.js") {
      const source = await readFile(join(rootDir, "node_modules", "three", "examples", "jsm", "exporters", "GLTFExporter.js"), "utf8");
      response.writeHead(200, { "content-type": "text/javascript; charset=utf-8" });
      response.end(source.replace('from \'three\';', "from '/three/three.module.js';"));
      return;
    }
    if (request.method === "POST" && url.pathname === "/export-diagnostic") {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      console.error("Browser export diagnostic:", Buffer.concat(chunks).toString("utf8"));
      response.writeHead(204).end();
      return;
    }
    if (request.method === "GET" && url.pathname === "/three/three.module.js") {
      response.writeHead(200, { "content-type": "text/javascript; charset=utf-8" });
      response.end(await readFile(join(rootDir, "node_modules", "three", "build", "three.module.js")));
      return;
    }
    if (request.method === "GET" && url.pathname === "/utils/TextureUtils.js") {
      const source = await readFile(join(rootDir, "node_modules", "three", "examples", "jsm", "utils", "TextureUtils.js"), "utf8");
      response.writeHead(200, { "content-type": "text/javascript; charset=utf-8" });
      response.end(source.replace('from \'three\';', "from '/three/three.module.js';"));
      return;
    }
    if (request.method === "POST" && (url.pathname === "/asset-package" || url.pathname === "/asset-preview")) {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      const body = Buffer.concat(chunks);
      if (url.pathname === "/asset-package") {
        if (body.subarray(0, 4).toString("utf8") !== "glTF") throw new Error("接收到的文件不是有效 GLB");
        await writeFile(packageFile, body);
        await writeManifest();
        response.writeHead(200, { "content-type": "application/json" });
        response.end(JSON.stringify({ ok: true, size: body.length, sizeLabel: sizeLabel(body.length) }));
        return;
      }
      const pngSignature = "89504e470d0a1a0a";
      if (body.subarray(0, 8).toString("hex") !== pngSignature) throw new Error("展示图不是 PNG 格式");
      await writeFile(previewFile, body);
      await writeManifest();
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ ok: true }));
      return;
    }
    response.writeHead(404).end("Not found");
  } catch (error) {
    response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    response.end(error instanceof Error ? error.message : String(error));
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Dashboard exporter ready: http://127.0.0.1:${port}/dashboard-export.html`);
});
