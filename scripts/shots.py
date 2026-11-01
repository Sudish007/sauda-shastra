"""Viewport screenshots + the numeric UI audit matrix (Playwright, workspace .venv) — brief §4 made mechanical (design §12).
Usage: python scripts/shots.py [base_url] [out_dir] [--pages a/,b/] [--all-articles]
  base_url        defaults to http://127.0.0.1:8790/<slug>/ (slug read from src/build/config.js)
  out_dir         defaults to .agents/tasks/v1/shots/ (git-ignored)
  --pages a/,b/   adds pages (named by their path, e.g. guides/x/ → guides-x) to the audited and shot set
  --all-articles  adds every guide, playbook and tool URL from data/search.json at 320 and 390 only (audit, no screenshot)
Pages (design §7): home, guides index, first guide, playbooks index, first playbook, tools index, first tool, learn, glossary,
calendar, changelog, resources, facts, about, sources and the 404 page via an unknown nested path; articles and tools that do
not exist yet are skipped. Widths: 320 (audit only), 390, 820, 1024 (audit only), 1440, 1920, 2560 (DSF 0.75 → 1920×1080);
light and dark. Writes <page>-<width>-<theme>.png (viewport only, never more than 1920 px per side) and audit.json; prints one
line per audit; exit code 1 when any audit has findings.
Audits per page/width/theme: horizontal overflow (scrollWidth <= innerWidth; at 320 also <= 320), 12 px floor for HTML text
nodes and for `svg text` scaled by the rendered width / viewBox width, line measure (widest line box of every visible text leaf
<= 80.5 × its own probed `ch`), controls >= 40 px tall (incl. nav links; radio/checkbox inputs excluded — their label is the
control), content-box ratio >= 0.88 at >= 1920, overlapping boxes inside cards, empty grid cells (every row of every grid/flex
container filled to within one gap), stateful controls name their state and the theme label equals the forced theme, and no
internal vocabulary in body text. Contrast is checked by scripts/contrast.py."""
import argparse, json, os, re, sys, urllib.request
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
with open(os.path.join(ROOT, "src", "build", "config.js"), encoding="utf-8") as f:
    SLUG = re.search(r"slug:\s*'([^']+)'", f.read()).group(1)

ap = argparse.ArgumentParser(description="Viewport screenshots + numeric UI audits.")
ap.add_argument("base_url", nargs="?", default=f"http://127.0.0.1:8790/{SLUG}/")
ap.add_argument("out_dir", nargs="?", default=os.path.join(ROOT, ".agents", "tasks", "v1", "shots"))
ap.add_argument("--pages", default="", help="comma-separated paths (relative to base_url) to add to the audited and shot set")
ap.add_argument("--all-articles", action="store_true", help="audit every guide, playbook and tool from data/search.json at 320 and 390 (no screenshot)")
args = ap.parse_args()
BASE = args.base_url.rstrip("/") + "/"
OUT = args.out_dir
os.makedirs(OUT, exist_ok=True)

def page_name(path):
    return re.sub(r"[^a-z0-9]+", "-", path.strip("/").lower()).strip("-") or "home"

# Page list in design §7 order. Articles come from data/search.json (first guide / playbook / tool by URL shape).
PAGES = {"home": ""}
articles = {"guide": None, "playbook": None, "tool": None}
all_articles = {}
try:
    with urllib.request.urlopen(BASE + "data/search.json", timeout=15) as r:
        idx = json.load(r)
    shapes = {"guide": re.compile(r"^guides/[^/#]+/$"), "playbook": re.compile(r"^playbooks/[^/#]+/$"), "tool": re.compile(r"^tools/[^/#]+/$")}
    for d in idx:
        url = d.get("url", "")
        for kind, rx in shapes.items():
            if rx.match(url):
                articles[kind] = articles[kind] or url
                all_articles.setdefault(page_name(url), url)
    has_tools = any(d.get("url", "").startswith("tools/") for d in idx)
except Exception as e:  # noqa: BLE001
    print("search.json not readable, auditing the utility pages only:", e)
    has_tools = False
PAGES["guides-index"] = "guides/"
if articles["guide"]: PAGES["guide"] = articles["guide"]
PAGES["playbooks-index"] = "playbooks/"
if articles["playbook"]: PAGES["playbook"] = articles["playbook"]
if has_tools: PAGES["tools-index"] = "tools/"
if articles["tool"]: PAGES["tool"] = articles["tool"]
for name, path in (("learn", "learn/"), ("glossary", "glossary/"), ("calendar", "calendar/"), ("changelog", "changelog/"), ("resources", "resources/"), ("facts", "facts/"), ("about", "about/"), ("sources", "sources/"), ("404", "no/such/page/")):
    PAGES[name] = path
for p in [x.strip() for x in args.pages.split(",") if x.strip()]:
    if p not in PAGES.values(): PAGES[page_name(p)] = p
# --all-articles: every article not already in the main set, audited at the two narrow widths only.
ARTICLES = {n: p for n, p in all_articles.items() if p not in PAGES.values()} if args.all_articles else {}

# (width, height, device_scale_factor, screenshot?) — 320 and 1024 are audited (320 sweep; 1024 two-column breakpoints) but not shot.
WIDTHS = [(320, 700, 1, False), (390, 844, 1, True), (820, 1180, 1, True), (1024, 768, 1, False), (1440, 900, 1, True), (1920, 1080, 1, True), (2560, 1440, 0.75, True)]

AUDIT_JS = r"""
() => {
  const vw = document.documentElement.clientWidth;
  const sw = document.documentElement.scrollWidth;
  const skip = (el) => { for (let n = el; n; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.position === 'fixed') return true; if (n !== el && /(hidden|clip|auto|scroll)/.test(cs.overflowX)) return true; } return false; };
  const over = [...document.querySelectorAll('body *')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > vw + 1 || r.left < -1) && !skip(el); }).slice(0, 5).map(el => el.tagName + '.' + (el.className || '').toString().split(' ')[0]);
  // 12 px floor for every visible HTML text node (SVG text is measured separately below).
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const small = []; let n;
  while ((n = walker.nextNode())) { if (!n.textContent.trim()) continue; const el = n.parentElement; if (!el || el.closest('[aria-hidden="true"], .visually-hidden, script, style, template, dialog, svg')) continue; const fs = parseFloat(getComputedStyle(el).fontSize); if (fs < 12 && el.getBoundingClientRect().width > 0) small.push(el.tagName + ':' + fs.toFixed(1) + ':' + n.textContent.trim().slice(0, 20)); }
  const body = parseFloat(getComputedStyle(document.body).fontSize);
  const container = document.querySelector('main .container');
  const box = container ? container.getBoundingClientRect() : null;
  const ratio = box ? ((box.width - parseFloat(getComputedStyle(container).paddingLeft) - parseFloat(getComputedStyle(container).paddingRight)) / vw) : null;
  // Controls >= 40 px tall; radio/checkbox inputs are excluded because their 44 px .option label is the control.
  const controls = [...document.querySelectorAll('button, .btn, .chip, input:not([type=checkbox]):not([type=radio]), select, .site-nav a, .mobile-nav a')].filter(el => el.getBoundingClientRect().width > 0 && !el.closest('dialog')).map(el => el.getBoundingClientRect().height).filter(h => h < 40);
  // No two element boxes inside a card-like container intersect.
  let overlaps = 0; const overlapWhere = [];
  for (const card of document.querySelectorAll('.card, .month, .result, .rates, .toolbar, .sebi-box, .glance, .upnext > *, .changelog > li')) {
    const kids = [...card.children].filter(k => k.getBoundingClientRect().width > 0 && getComputedStyle(k).position !== 'absolute');
    for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) { const a = kids[i].getBoundingClientRect(), b = kids[j].getBoundingClientRect(); if (a.left < b.right - 2 && b.left < a.right - 2 && a.top < b.bottom - 2 && b.top < a.bottom - 2) { overlaps++; if (overlapWhere.length < 3) overlapWhere.push(card.className.split(' ')[0] + '>' + kids[i].tagName + '/' + kids[j].tagName); } }
  }
  // M2: no grid row with an empty cell. For every grid/flex container, group children by row (vertical overlap) and compare
  // the row's filled width with the container's content width; a shortfall above one gap width is an empty cell.
  let emptyCells = 0; const emptyWhere = [];
  for (const g of document.querySelectorAll('.grid, .grid-4, .grid-fill-3, .grid-fill-4, .grid-fill-5, .glance, .options, .counts, .sebi-box dl, .lib-summary dl, .form-grid, .path-grid, .upnext, .rules-box, .tool-layout, .hero-grid, .learn-hero, .kpis, .footer-grid, .rail, .article-layout, .month-grid')) {
    const cs = getComputedStyle(g); if (cs.display !== 'grid' && cs.display !== 'flex') continue;
    const kids = [...g.children].filter(k => k.getBoundingClientRect().width > 0);
    if (kids.length < 2) continue;
    const gap = parseFloat(cs.columnGap) || 0;
    const inner = g.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const rects = kids.map(k => k.getBoundingClientRect()).sort((a, b) => a.top - b.top);
    const rowList = [];
    for (const r of rects) { const row = rowList.find(x => r.top < x.bottom - 1 && r.bottom > x.top + 1); if (row) { row.items.push(r); row.top = Math.min(row.top, r.top); row.bottom = Math.max(row.bottom, r.bottom); } else rowList.push({ top: r.top, bottom: r.bottom, items: [r] }); }
    for (const { items: rs } of rowList) { const filled = rs.reduce((a, r) => a + r.width, 0) + gap * (rs.length - 1); if (inner - filled > gap + 2) { emptyCells++; if (emptyWhere.length < 3) emptyWhere.push((g.className || g.tagName).toString().split(' ').slice(0, 2).join('.') + ':' + rs.length + '/' + Math.round(inner - filled)); } }
  }
  // Every stateful control (aria-pressed / aria-expanded / data-mode) names its state: visible text or an aria-label.
  const stateless = [...document.querySelectorAll('[aria-pressed], [aria-expanded], [data-mode]')].filter(el => el.getBoundingClientRect().width > 0 && !el.closest('dialog')).filter(el => {
    const txt = (el.textContent || '').trim(); const label = el.getAttribute('aria-label') || '';
    if (el.hasAttribute('data-mode')) return !(txt.toLowerCase().includes(el.dataset.mode) || label.toLowerCase().includes(el.dataset.mode));
    if (el.hasAttribute('aria-expanded')) return !label && !txt;
    return !txt && !label;
  }).length;
  // SVG <text> is sized in user units: rendered size = font-size × (rendered width / viewBox width).
  const svgSmall = [];
  for (const t of document.querySelectorAll('svg text')) {
    const svg = t.ownerSVGElement; if (!svg || t.closest('[aria-hidden="true"]')) continue;
    const r = svg.getBoundingClientRect(); if (r.width === 0) continue;
    const vb = svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width ? svg.viewBox.baseVal.width : r.width;
    const px = parseFloat(getComputedStyle(t).fontSize) * (r.width / vb);
    if (px < 12) svgSmall.push((t.textContent || '').trim().slice(0, 16) + ':' + px.toFixed(1));
  }
  // No line of long-form text wider than 80ch, ch measured in the element's own font (a probe of 100 zeros).
  const chCache = new Map();
  const chOf = (el) => { const cs = getComputedStyle(el); const key = cs.fontFamily + '|' + cs.fontSize + '|' + cs.fontWeight; if (chCache.has(key)) return chCache.get(key); const probe = document.createElement('span'); probe.textContent = '0'.repeat(100); probe.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font-family:${cs.fontFamily};font-size:${cs.fontSize};font-weight:${cs.fontWeight};font-variant-numeric:tabular-nums`; document.body.appendChild(probe); const w = probe.getBoundingClientRect().width / 100; probe.remove(); chCache.set(key, w); return w; };
  let wideLines = 0; const wideWhere = []; let maxCh = 0;
  for (const el of document.querySelectorAll('p, li, dd, dt, figcaption, blockquote, td, th')) {
    if (!(el.textContent || '').trim() || el.closest('nav, .toc, pre, code, svg, dialog, template, script, style, [aria-hidden="true"]')) continue;
    if (el.getBoundingClientRect().width === 0 || el.querySelector('p, li, ul, ol, table')) continue; // leaf text blocks only
    const range = document.createRange(); range.selectNodeContents(el);
    let widest = 0; for (const rc of range.getClientRects()) widest = Math.max(widest, rc.width);
    const ch = widest / chOf(el); maxCh = Math.max(maxCh, ch);
    if (ch > 80.5) { wideLines++; if (wideWhere.length < 3) wideWhere.push(el.tagName + '.' + (el.className || '').toString().split(' ')[0] + ':' + ch.toFixed(0) + 'ch'); }
  }
  const bodyCh = chOf(document.body) / parseFloat(getComputedStyle(document.body).fontSize);
  const h1 = document.querySelector('h1'); const h1fs = h1 ? parseFloat(getComputedStyle(h1).fontSize) : 0;
  const themeLabel = (document.querySelector('.theme-label') || {}).textContent || '';
  // M4: visitor-facing text never names the project's internals.
  const vocab = (document.body.innerText.match(/\bagents'?\b|facts\.json|\brun dir\b|\bFEAT-?\d*\b/g) || []).length;
  return { vw, iw: window.innerWidth, sw, over, smallCount: small.length, small: small.slice(0, 5), svgSmall, body: +body.toFixed(2), ratio: ratio ? +ratio.toFixed(3) : null, shortControls: controls.length, overlaps, overlapWhere, emptyCells, emptyWhere, stateless, vocab, wideLines, wideWhere, maxCh: +maxCh.toFixed(1), bodyCh: +bodyCh.toFixed(3), h1fs: +h1fs.toFixed(1), theme: document.documentElement.getAttribute('data-theme') || 'light', themeLabel: themeLabel.trim() };
}
"""

def findings(r):
    f = []
    if r["sw"] > r["vw"]: f.append(f"overflow {r['sw'] - r['vw']}")
    if r["width"] == 320 and r["sw"] > 320: f.append(f"overflow-320 {r['sw']}")
    if r["smallCount"]: f.append(f"small-text {r['smallCount']} {r['small']}")
    if r["svgSmall"]: f.append(f"svg-text-small {r['svgSmall']}")
    if r["wideLines"]: f.append(f"wide-lines {r['wideLines']} {r['wideWhere']}")
    if r["shortControls"]: f.append(f"short-controls {r['shortControls']}")
    if r["overlaps"]: f.append(f"overlaps {r['overlaps']} {r['overlapWhere']}")
    if r["stateless"]: f.append(f"stateless-controls {r['stateless']}")
    if r["emptyCells"]: f.append(f"empty-cells {r['emptyCells']} {r['emptyWhere']}")
    if r["vocab"]: f.append(f"internal-vocab {r['vocab']}")
    if r["width"] >= 1920 and r["ratio"] is not None and r["ratio"] < 0.88: f.append(f"content-box {r['ratio']}")
    if r["theme"] != r["wantTheme"]: f.append(f"theme {r['theme']}!={r['wantTheme']}")
    if r["themeLabel"].lower() != r["wantTheme"]: f.append(f"theme-label '{r['themeLabel']}'")
    return f

report = []
with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True, args=["--disable-lcd-text"])
    for theme in ("light", "dark"):
        for (w, h, dsf, shoot) in WIDTHS:
            ctx = browser.new_context(viewport={"width": w, "height": h}, device_scale_factor=dsf, reduced_motion="reduce")
            page = ctx.new_page()
            page.goto(BASE, wait_until="networkidle")
            # The storage key prefix comes from the page itself (one config constant), so the script never hard-codes it.
            page.evaluate("t => localStorage.setItem(document.body.dataset.store + ':theme', JSON.stringify(t))", theme)
            targets = [(name, path, shoot) for name, path in PAGES.items()]
            if w in (320, 390): targets += [(name, path, False) for name, path in ARTICLES.items()]
            for name, path, shoot_this in targets:
                page.goto(BASE + path, wait_until="networkidle")
                page.evaluate("document.fonts.ready.then(() => null)")
                page.wait_for_timeout(300)
                audit = page.evaluate(AUDIT_JS)
                audit.update({"page": name, "path": path, "width": w, "theme": theme, "wantTheme": theme})
                audit["findings"] = findings(audit)
                report.append(audit)
                if shoot_this:
                    page.screenshot(path=os.path.join(OUT, f"{name}-{w}-{theme}.png"), full_page=False)
            ctx.close()
    browser.close()

bad = [r for r in report if r["findings"]]
for r in report:
    flag = "FAIL" if r["findings"] else "ok  "
    print(f"{flag} {r['page']:<16} {r['width']:>4} {r['theme']:<5} body={r['body']:.1f} h1={r['h1fs']:.0f} ratio={r['ratio']} maxCh={r['maxCh']} {' '.join(map(str, r['findings']))} {r['over'] if r['over'] else ''}")
extra = f" + {len(ARTICLES)} articles × 2 widths × 2 themes" if ARTICLES else ""
print(f"\n{len(report)} audits ({len(PAGES)} pages × {len(WIDTHS)} widths × 2 themes{extra}), {len(bad)} with findings → {OUT}")
with open(os.path.join(OUT, "audit.json"), "w", encoding="utf-8") as f:
    json.dump(report, f, indent=1)
sys.exit(1 if bad else 0)
