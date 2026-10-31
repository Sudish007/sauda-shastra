"""Viewport screenshots + numeric UI audits (Playwright, workspace .venv).
Usage: python scripts/shots.py [base_url] [out_dir]
  base_url defaults to http://127.0.0.1:8790/<slug>/ (slug read from src/build/config.js)
  out_dir  defaults to .agents/tasks/v1/shots/ (git-ignored)
Writes <page>-<width>-<theme>.png (viewport only, never taller than 1440 px; 2560 shot at DSF 0.75 so no side
exceeds 1920 px) and audit.json. Exit code 1 when any audit has findings.
Audits per page/width/theme: horizontal overflow (scrollWidth <= innerWidth), computed font-size >= 12 px, controls
>= 40 px tall, content-box ratio, overlapping boxes inside cards, stateful controls show their state, and the 320 px
sweep (scrollWidth <= 320). Contrast is checked by the reviewer step's own script."""
import json, os, re, sys, urllib.request
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
with open(os.path.join(ROOT, "src", "build", "config.js"), encoding="utf-8") as f:
    SLUG = re.search(r"slug:\s*'([^']+)'", f.read()).group(1)
BASE = sys.argv[1] if len(sys.argv) > 1 else f"http://127.0.0.1:8790/{SLUG}/"
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, ".agents", "tasks", "v1", "shots")
os.makedirs(OUT, exist_ok=True)

PAGES = {"home": "", "guides-index": "guides/", "playbooks-index": "playbooks/", "learn": "learn/", "glossary": "glossary/", "calendar": "calendar/", "changelog": "changelog/", "about": "about/"}
try:
    with urllib.request.urlopen(BASE + "data/search.json", timeout=15) as r:
        idx = json.load(r)
    first = {}
    for d in idx:
        if d["kind"] in ("Guide", "Playbook") and d["kind"] not in first and "#" not in d["url"]:
            first[d["kind"]] = d["url"]
    if "Guide" in first: PAGES["guide"] = first["Guide"]
    if "Playbook" in first: PAGES["playbook"] = first["Playbook"]
    if any(d["url"].startswith("tools/") for d in idx): PAGES["tools"] = "tools/"
except Exception as e:  # noqa: BLE001
    print("search.json not readable, auditing index pages only:", e)

# (width, height, device_scale_factor, screenshot?)
WIDTHS = [(320, 700, 1, False), (390, 844, 1, True), (820, 1180, 1, True), (1440, 900, 1, True), (1920, 1080, 1, True), (2560, 1440, 0.75, True)]

AUDIT_JS = """
() => {
  const vw = document.documentElement.clientWidth;
  const sw = document.documentElement.scrollWidth;
  const skip = (el) => { for (let n = el; n; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.position === 'fixed') return true; if (n !== el && /(hidden|clip|auto|scroll)/.test(cs.overflowX)) return true; } return false; };
  const over = [...document.querySelectorAll('body *')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > vw + 1 || r.left < -1) && !skip(el); }).slice(0, 5).map(el => el.tagName + '.' + (el.className || '').toString().split(' ')[0]);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const small = []; let n;
  while ((n = walker.nextNode())) { if (!n.textContent.trim()) continue; const el = n.parentElement; if (!el || el.closest('[aria-hidden="true"], .visually-hidden, script, style, template, dialog')) continue; const fs = parseFloat(getComputedStyle(el).fontSize); if (fs < 12 && el.getBoundingClientRect().width > 0) small.push(el.tagName + ':' + fs.toFixed(1) + ':' + n.textContent.trim().slice(0, 20)); }
  const body = parseFloat(getComputedStyle(document.body).fontSize);
  const container = document.querySelector('main .container');
  const box = container ? container.getBoundingClientRect() : null;
  const ratio = box ? ((box.width - parseFloat(getComputedStyle(container).paddingLeft) - parseFloat(getComputedStyle(container).paddingRight)) / vw) : null;
  const controls = [...document.querySelectorAll('button, .btn, .chip, input:not([type=checkbox]):not([type=radio]), select')].filter(el => el.getBoundingClientRect().width > 0 && !el.closest('dialog')).map(el => el.getBoundingClientRect().height).filter(h => h < 40);
  let overlaps = 0;
  for (const card of document.querySelectorAll('.card, .month, li.step, .changelog > li')) {
    const kids = [...card.children].filter(k => k.getBoundingClientRect().width > 0 && getComputedStyle(k).position !== 'absolute');
    for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) { const a = kids[i].getBoundingClientRect(), b = kids[j].getBoundingClientRect(); if (a.left < b.right - 2 && b.left < a.right - 2 && a.top < b.bottom - 2 && b.top < a.bottom - 2) overlaps++; }
  }
  // Every stateful control (aria-pressed / aria-expanded / data-mode) must show its state: visible text that changes, or an aria-label naming the state.
  const stateless = [...document.querySelectorAll('[aria-pressed], [aria-expanded], [data-mode]')].filter(el => el.getBoundingClientRect().width > 0 && !el.closest('dialog')).filter(el => {
    const txt = (el.textContent || '').trim(); const label = el.getAttribute('aria-label') || '';
    if (el.hasAttribute('data-mode')) return !(txt.toLowerCase().includes(el.dataset.mode) || label.toLowerCase().includes(el.dataset.mode));
    if (el.hasAttribute('aria-expanded')) return !label && !txt;
    return !txt && !label;
  }).length;
  const h1 = document.querySelector('h1'); const h1fs = h1 ? parseFloat(getComputedStyle(h1).fontSize) : 0;
  return { vw, sw, over, smallCount: small.length, small: small.slice(0, 5), body, ratio: ratio ? +ratio.toFixed(3) : null, shortControls: controls.length, overlaps, stateless, h1fs, theme: document.documentElement.getAttribute('data-theme') || 'light' };
}
"""

def findings(r):
    f = []
    if r["sw"] > r["vw"]: f.append(f"overflow {r['sw'] - r['vw']}")
    if r["smallCount"]: f.append(f"small-text {r['smallCount']}")
    if r["shortControls"]: f.append(f"short-controls {r['shortControls']}")
    if r["overlaps"]: f.append(f"overlaps {r['overlaps']}")
    if r["stateless"]: f.append(f"stateless-controls {r['stateless']}")
    if r["width"] >= 1920 and r["ratio"] is not None and r["ratio"] < 0.88: f.append(f"content-box {r['ratio']}")
    if r["theme"] != r["wantTheme"]: f.append(f"theme {r['theme']}!={r['wantTheme']}")
    return f

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True, args=["--disable-lcd-text"])
    report = []
    for theme in ("light", "dark"):
        for (w, h, dsf, shoot) in WIDTHS:
            ctx = browser.new_context(viewport={"width": w, "height": h}, device_scale_factor=dsf, reduced_motion="reduce")
            page = ctx.new_page()
            page.goto(BASE, wait_until="networkidle")
            page.evaluate("t => localStorage.setItem(document.body.dataset.store + ':theme', JSON.stringify(t))", theme)
            for name, path in PAGES.items():
                page.goto(BASE + path, wait_until="networkidle")
                page.wait_for_timeout(500)
                audit = page.evaluate(AUDIT_JS)
                audit.update({"page": name, "width": w, "theme": theme, "wantTheme": theme})
                audit["findings"] = findings(audit)
                report.append(audit)
                if shoot:
                    page.screenshot(path=os.path.join(OUT, f"{name}-{w}-{theme}.png"), full_page=False)
            ctx.close()
    browser.close()

bad = [r for r in report if r["findings"]]
for r in report:
    flag = "FAIL" if r["findings"] else "ok  "
    print(f"{flag} {r['page']:<15} {r['width']:>4} {r['theme']:<5} body={r['body']:.1f} h1={r['h1fs']:.0f} ratio={r['ratio']} {' '.join(r['findings'])} {r['over'] if r['over'] else ''}")
print(f"\n{len(report)} audits, {len(bad)} with findings → {OUT}")
with open(os.path.join(OUT, "audit.json"), "w", encoding="utf-8") as f:
    json.dump(report, f, indent=1)
sys.exit(1 if bad else 0)
