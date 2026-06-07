"""
merchant_service/daily_report.py
运营日报服务 — 读取 dashboard_data.json，调 GLM-4-Plus 生成日报，支持推送飞书

启动：cd nail-tryon && python -m merchant_service.daily_report
端口：4174   CORS 允许 http://127.0.0.1:4173
"""

from __future__ import annotations

import json
import os
import sys
import time
import datetime
import urllib.request
import urllib.error
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

# ------------------------------------------------------------------ paths --
HERE = Path(__file__).parent
ROOT = HERE.parent                         # nail-tryon/
PROJECT_ROOT = ROOT.parent                 # 电商爆砍/美甲/
DATA_FILE = PROJECT_ROOT / "data" / "dashboard_data.json"

# ------------------------------------------------------------------ env ----
def _load_env():
    env_path = Path(r"E:\hermes\.env")
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())

_load_env()

GLM_API_KEY  = os.getenv("GLM_API_KEY", "")
GLM_API_BASE = os.getenv("GLM_API_BASE", "https://open.bigmodel.cn/api/paas/v4")
FEISHU_APP_ID     = os.getenv("FEISHU_APP_ID", "")
FEISHU_APP_SECRET = os.getenv("FEISHU_APP_SECRET", "")

# ---------------------------------------------------------------- helpers --
def _glm_chat(messages: list[dict], max_tokens: int = 800) -> str:
    if not GLM_API_KEY:
        return "（GLM_API_KEY 未配置，无法生成 AI 摘要）"
    payload = json.dumps({
        "model": "glm-4-plus",
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": 0.3,
    }).encode()
    req = urllib.request.Request(
        f"{GLM_API_BASE}/chat/completions",
        data=payload,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {GLM_API_KEY}"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        return f"（AI 摘要生成失败: {e}）"


def _feishu_token() -> str:
    payload = json.dumps({"app_id": FEISHU_APP_ID, "app_secret": FEISHU_APP_SECRET}).encode()
    req = urllib.request.Request(
        "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
        data=payload, headers={"Content-Type": "application/json"}, method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())["tenant_access_token"]


def _feishu_send(chat_id: str, text: str) -> dict:
    token = _feishu_token()
    payload = json.dumps({
        "receive_id": chat_id,
        "msg_type": "text",
        "content": json.dumps({"text": text}),
    }).encode()
    req = urllib.request.Request(
        "https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id",
        data=payload,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read())


# ---------------------------------------------------------- report builder --
def build_report() -> dict:
    """读 dashboard_data.json，调 GLM 生成日报结构"""
    if not DATA_FILE.exists():
        return {"error": f"数据文件不存在: {DATA_FILE}"}

    data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    kpi     = data.get("kpi", {})
    rising  = data.get("rising", [])
    catalog = data.get("catalog", {})
    demand  = data.get("demand", {})
    gen_at  = data.get("generated_at", "未知")

    # ---- 拼 prompt ----
    prompt = f"""你是美甲电商运营助手。根据以下数据生成今日运营日报，用中文，200字以内，格式紧凑。

数据日期：{gen_at}
KPI：笔记{kpi.get('total_notes',0)}篇，评论{kpi.get('total_comments',0)}条，平均热度{kpi.get('avg_hotness',0)}，上升趋势{kpi.get('rising_count',0)}项，需求信号{kpi.get('demand_signals',0)}条

飙升TOP5：{json.dumps([r.get('name') or r.get('名称','—') for r in rising[:5]], ensure_ascii=False)}

主推建议：{json.dumps([r.get('name') or r.get('名称','—') for r in catalog.get('recommend',[])[:3]], ensure_ascii=False)}
选品缺口：{json.dumps([r.get('name') or r.get('名称','—') for r in catalog.get('gaps',[])[:3]], ensure_ascii=False)}
滞销预警：{json.dumps([r.get('name') or r.get('名称','—') for r in catalog.get('slow_movers',[])[:2]], ensure_ascii=False)}

需求信号TOP3：{json.dumps(list(demand.get('signals',{}).items())[:3], ensure_ascii=False)}

要求：输出"今日概览/热门趋势/主推款/运营建议"4段，每段1-2句话。"""

    summary = _glm_chat([{"role": "user", "content": prompt}])

    # ---- 冷门预警（热度连续低于均值）----
    avg_h = kpi.get("avg_hotness", 0)
    cold_warning = [
        {"name": r.get("name") or r.get("名称", "—"), "curr_hotness": r.get("curr_hotness"), "growth_pct": r.get("growth_pct")}
        for r in rising
        if r.get("status") == "下降" and r.get("curr_hotness", 9999) < avg_h * 0.5
    ]

    return {
        "date": gen_at,
        "generated_at": datetime.datetime.now().isoformat(timespec="seconds"),
        "kpi": kpi,
        "top_rising": rising[:8],
        "recommend": catalog.get("recommend", [])[:4],
        "gaps": catalog.get("gaps", []),
        "slow_movers": catalog.get("slow_movers", []),
        "cold_warning": cold_warning,
        "demand_signals": demand.get("signals", {}),
        "ai_summary": summary,
    }


# --------------------------------------------------------------- HTTP API --
class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args): pass

    def _json(self, code: int, body: dict):
        data = json.dumps(body, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/daily-report":
            try:
                report = build_report()
                self._json(200, report)
            except Exception as e:
                self._json(500, {"error": str(e)})

        elif self.path == "/api/health":
            self._json(200, {"ok": True, "data_file": str(DATA_FILE), "exists": DATA_FILE.exists()})

        else:
            self._json(404, {"error": "not found"})

    def do_POST(self):
        if self.path == "/api/feishu-send":
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length) or b"{}")
            chat_id = body.get("chat_id", "")
            text = body.get("text", "")
            if not chat_id or not text:
                self._json(400, {"error": "需要 chat_id 和 text"})
                return
            if not FEISHU_APP_ID:
                self._json(503, {"error": "飞书未配置（FEISHU_APP_ID 为空）"})
                return
            try:
                result = _feishu_send(chat_id, text)
                self._json(200, result)
            except Exception as e:
                self._json(500, {"error": str(e)})
        else:
            self._json(404, {"error": "not found"})


if __name__ == "__main__":
    PORT = 4174
    server = HTTPServer(("127.0.0.1", PORT), Handler)
    print(f"✅  运营日报服务  http://127.0.0.1:{PORT}/api/daily-report")
    print(f"   健康检查      http://127.0.0.1:{PORT}/api/health")
    print("Ctrl+C 停止")
    server.serve_forever()
