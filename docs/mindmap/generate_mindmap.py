#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate Vigour Asset Hub mindmap in three formats: .xmind / .md / .html"""
import json, zipfile, uuid, html, os

ROOT = os.path.dirname(os.path.abspath(__file__))

# node: {"t": title, "n": note(optional), "c": [children]}
TREE = {
 "t": "Vigour Asset Hub\n设计资产中枢（原型 v0.2.0）",
 "c": [
  {"t": "🏠 首页", "n": "品牌着陆页", "c": [
    {"t": "品牌入口与快速导航", "n": "展示旗舰 3D 资产，引导进入工作台 / 资产库"},
  ]},
  {"t": "📊 工作台", "c": [
    {"t": "精选资产", "c": [
      {"t": "团队推荐卡片", "n": "精选 3 项资产，点击直达资产详情"},
    ]},
    {"t": "项目入口", "c": [
      {"t": "按参与范围 / 项目类型筛选", "n": "范围×类型双维过滤，空态提供清除筛选"},
      {"t": "点击项目 → 定位进入「项目与权限」", "n": "以选中项目重挂载，标题与资产清单同步"},
    ]},
  ]},
  {"t": "📚 资产库", "c": [
    {"t": "左侧筛选栏", "c": [
      {"t": "资产分类", "n": "全部资产 / 3D 模型 / UI 规范 / 工作流 / Skill 卡 / 研究报告（带计数）"},
      {"t": "资产来源", "c": [
        {"t": "多选筛选（含计数）", "n": "全部来源 + 百度网盘 / 阿里云盘 / 钉钉链接 / Figma 等"},
        {"t": "来源管理弹窗", "n": "查看来源健康状态、按来源筛选；添加云盘 / 协作链接只登记元数据，不移动原文件"},
      ]},
    ]},
    {"t": "工具栏", "c": [
      {"t": "快捷范围", "n": "全部 / 我创建的 / 已收藏 / 待我评审（带计数）"},
      {"t": "筛选下拉（14px·自适应）", "c": [
        {"t": "成熟度（单选，可取消回全部）", "n": "已发布 / 已验证 / 试点 / 待评审 / 候选"},
        {"t": "文件类型（多选 + 清除）"},
        {"t": "标签（多选 + 清除，按热度取前 8）"},
      ]},
      {"t": "排序", "n": "最近更新 / 名称 A–Z / 文件从大到小"},
      {"t": "视图切换", "n": "宫格（默认）/ 列表"},
    ]},
    {"t": "资产卡片操作", "c": [
      {"t": "收藏 / 批量选择与批量操作"},
      {"t": "保存筛选 / 新建集合", "n": "保存当前筛选快照，可恢复"},
    ]},
  ]},
  {"t": "📦 资产详情", "c": [
    {"t": "3D 模型资产（真实 GLB）", "c": [
      {"t": "本地 GLB 实时渲染", "n": "Three.js：旋转 / 缩放 / 平移 / 网格地面"},
      {"t": "结构树双向联动", "n": "显隐真实控制 mesh.visible；选中聚焦高亮；点击网格反向定位；节点搜索无匹配显空"},
      {"t": "贴图 / 版本 / 模型信息页"},
    ]},
    {"t": "通用资产详情", "c": [
      {"t": "来源追溯", "n": "外链直达来源页面；本地文件保留 sourceFile；展示图可回看"},
      {"t": "复制来源链接 / 模型地址 / 资产 ID"},
      {"t": "预览类型诚实标注", "n": "图片预览标「模拟」，与真实三维区分，不谎称可交互"},
    ]},
  ]},
  {"t": "📤 上传与导入", "c": [
    {"t": "导入来源", "n": "本地文件 / 云盘链接 / 钉钉链接"},
    {"t": "导入任务队列", "c": [
      {"t": "进度与状态", "n": "排队中 / 已暂停 / 已入库"},
      {"t": "单任务操作：补图 / 编辑 / 移除", "n": "缺展示图任务禁用「完成并登记」，可补图后入库或单独移除"},
      {"t": "登记入库", "n": "保留 externalUrl / sourceFile / 展示图；可提交评审"},
    ]},
    {"t": "格式与分类", "n": "导入时选择归属项目、成熟度；分类可确认"},
  ]},
  {"t": "🗂 项目与权限", "c": [
    {"t": "项目列表", "n": "搜索 / 分类筛选 / 新建项目（新项目即时进入列表）"},
    {"t": "项目资产", "n": "资产表格：勾选 / 排序 / 预览；「打开详情」真实跳转详情页"},
    {"t": "成员", "n": "邀请成员弹窗；角色按「项目 × 成员」隔离保存"},
    {"t": "角色与访问控制", "c": [
      {"t": "角色模板", "n": "项目管理员 / 编辑者 / 评审者 / 查看者"},
      {"t": "项目设置", "n": "名称 / 状态 / 默认访问范围，保存后可读回"},
    ]},
  ]},
  {"t": "🤖 AI / MCP 接入中心", "c": [
    {"t": "客户端", "c": [
      {"t": "Claude / Codex / 飞书 / WorkBuddy", "n": "连接状态：已连接 / 需复核 / 未连接"},
      {"t": "操作", "n": "配置连接（本地模拟）/ 断开 / 客户端设置（名称、传输、授权范围）"},
    ]},
    {"t": "工具授权", "n": "搜索资产 / 读取元数据 / 生成预览 / 请求下载 / 写入标签 / 创建项目引用"},
    {"t": "调用记录", "n": "按关键词与状态筛选（演示数据）"},
  ]},
  {"t": "📄 文档", "n": "设计规范说明（目录级，含色彩 / 排版 / 组件）"},
  {"t": "⚙️ 全局能力", "c": [
    {"t": "顶部搜索（⌘K 提示）"},
    {"t": "通知 / 个人中心 / 团队标识"},
    {"t": "Toast 反馈"},
    {"t": "边界说明", "n": "仅本地原型：不连真实外部服务、不修改真实权限、不上传真实文件"},
  ]},
 ]
}

def uid():
    return uuid.uuid4().hex

def xmind_topic(node):
    t = {"id": uid(), "class": "topic", "title": node["t"]}
    if node.get("n"):
        t["notes"] = {"plain": {"content": node["n"]}}
    kids = [xmind_topic(c) for c in node.get("c", [])]
    if kids:
        t["children"] = {"attached": kids}
    return t

def write_xmind(tree, path):
    sheet = {"id": uid(), "class": "sheet", "title": "Vigour Asset Hub", "rootTopic": xmind_topic(tree)}
    content = json.dumps([sheet], ensure_ascii=False, indent=1)
    manifest = {"file-entries": {"content.json": {}, "metadata.json": {}}}
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("content.json", content)
        z.writestr("metadata.json", "{}")
        z.writestr("manifest.json", json.dumps(manifest))

def write_md(tree, path):
    lines = ["# Vigour Asset Hub · 设计资产中枢思维导图（原型 v0.2.0）", ""]
    def walk(node, depth):
        indent = "  " * depth
        bullet = "-" if depth > 0 else "#"
        title = node["t"].replace("\n", " ")
        line = f"{indent}- {title}" if depth > 0 else f"# {title}"
        if node.get("n"):
            line += f"　<!-- {node['n']} -->"
        lines.append(line)
        for c in node.get("c", []):
            walk(c, depth + 1)
    # simpler: plain markdown list
    lines = ["# Vigour Asset Hub · 设计资产中枢思维导图（原型 v0.2.0）", "", "> 根据本地原型（v0.2.0）实际功能结构整理；可导入 XMind / 幕布 / Markmap。", ""]
    def walk2(node, depth):
        title = node["t"].replace("\n", "·")
        pad = "  " * depth
        if depth == 0:
            lines.append(f"# {title}")
        else:
            lines.append(f"{pad}- {title}" + (f"　—— {node['n']}" if node.get("n") else ""))
        for c in node.get("c", []):
            walk2(c, depth + 1)
    walk2(tree, 0)
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

def esc(s):
    return html.escape(s).replace("\n", "<br>")

def write_html(tree, path):
    def node_html(node, depth):
        kids = node.get("c", [])
        h = ['<div class="tnode">']
        h.append('<div class="label">')
        h.append('<div class="t">' + esc(node["t"]) + "</div>")
        if node.get("n"):
            h.append('<div class="note">' + esc(node["n"]) + "</div>")
        h.append("</div>")
        if kids:
            h.append('<div class="kids">')
            for k in kids:
                h.append(node_html(k, depth + 1))
            h.append("</div>")
        h.append("</div>")
        return "".join(h)

    doc = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vigour Asset Hub · 设计资产中枢思维导图</title>
<style>
  :root { --line:#9cc3e5; --border:#d0d7de; --brand:#1668dc; --muted:#8a94a6; --bg:#f7fafc; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif; background: var(--bg); color: #1f2733; padding: 28px; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  .sub { color: var(--muted); font-size: 13px; margin-bottom: 18px; }
  .canvas { background: #fff; border: 1px solid var(--border); border-radius: 10px; padding: 34px 40px; overflow: auto; }
  .tnode { display: flex; align-items: flex-start; }
  .label { border: 1px solid var(--border); background: #fff; border-radius: 6px; padding: 7px 12px; white-space: nowrap; cursor: default; box-shadow: 0 1px 2px rgba(23,34,51,.04); position: relative; }
  .t { font-size: 13px; line-height: 1.45; }
  .note { font-size: 11px; color: var(--muted); line-height: 1.5; margin-top: 3px; max-width: 340px; white-space: normal; }
  .kids { display: flex; flex-direction: column; justify-content: center; margin-left: 34px; }
  .kids > .tnode { position: relative; padding: 5px 0 5px 30px; }
  .kids > .tnode::before { content: ""; position: absolute; left: 0; top: 50%; width: 22px; border-top: 1.4px solid var(--line); }
  .kids > .tnode::after { content: ""; position: absolute; left: 0; top: 0; height: 100%; border-left: 1.4px solid var(--line); }
  .kids > .tnode:first-child::after { top: 50%; bottom: 0; height: auto; }
  .kids > .tnode:last-child::after { top: 0; bottom: 50%; height: auto; }
  .kids > .tnode:only-child::after { display: none; }
  /* depth styling */
  .tnode.depth0 > .label { background: #1668dc; border-color: #1668dc; }
  .tnode.depth0 > .label .t { color: #fff; font-weight: 600; font-size: 15px; }
  .tnode.depth1 > .label { background: #eef5ff; border-color: #bcd7f5; font-weight: 600; }
  .kids > .tnode > .label:hover { border-color: var(--brand); }
  /* collapse */
  .tnode.collapsed > .kids { display: none; }
  .tnode.has-kids > .label { cursor: pointer; }
  .tnode.has-kids > .label::after { content: "–"; position: absolute; top: -7px; right: -7px; width: 15px; height: 15px; border-radius: 50%; background: #fff; border: 1px solid var(--border); color: var(--muted); font-size: 11px; line-height: 13px; text-align: center; }
  .tnode.collapsed.has-kids > .label::after { content: "+"; background: var(--brand); border-color: var(--brand); color: #fff; }
  .legend { margin-top: 14px; color: var(--muted); font-size: 12px; }
</style>
</head>
<body>
<h1>Vigour Asset Hub · 设计资产中枢思维导图</h1>
<div class="sub">根据本地原型（v0.2.0）实际功能结构整理 · 点击节点可折叠 / 展开</div>
<div class="canvas">__TREE__</div>
<div class="legend">连线为逻辑归属；灰色小字为行为备注（对应原型中的交互与边界说明）。</div>
<script>
document.querySelectorAll(".tnode.has-kids > .label").forEach(function (el) {
  el.addEventListener("click", function () { el.parentElement.classList.toggle("collapsed"); });
});
</script>
</body>
</html>"""

    def wrap(node, depth):
        kids = node.get("c", [])
        cls = "tnode" + (f" depth{min(depth,2)}" if depth <= 2 else "") + (" has-kids" if kids and depth > 0 else "")
        h = [f'<div class="{cls}">']
        h.append('<div class="label"><div class="t">' + esc(node["t"]) + "</div>")
        if node.get("n"):
            h.append('<div class="note">' + esc(node["n"]) + "</div>")
        h.append("</div>")
        if kids:
            h.append('<div class="kids">' + "".join(wrap(k, depth + 1) for k in kids) + "</div>")
        h.append("</div>")
        return "".join(h)

    doc = doc.replace("__TREE__", wrap(tree, 0))
    with open(path, "w", encoding="utf-8") as f:
        f.write(doc)

if __name__ == "__main__":
    write_xmind(TREE, os.path.join(ROOT, "asset-hub-mindmap.xmind"))
    write_md(TREE, os.path.join(ROOT, "asset-hub-mindmap.md"))
    write_html(TREE, os.path.join(ROOT, "asset-hub-mindmap.html"))
    print("OK: xmind / md / html generated")
