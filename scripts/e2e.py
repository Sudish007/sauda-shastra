"""Functional smoke test of the client behaviour (Playwright, workspace .venv). Exits non-zero on failure.
Usage: python scripts/e2e.py [base_url]   (default http://127.0.0.1:8790/<slug>/ with the slug from src/build/config.js)
Covers the shell: light first paint, three-state theme cycle + persistence, search dialog, mobile menu, 404 base href,
no console errors; then (design §12) nav state (one aria-current per page with a nav entry, none on home or facts/), the Learn
pill's two states, the facts box → facts/ links, the facts-register chips, the named-resource link audit on learn/, resources/,
sources/ and facts/, the home hero figures against data/facts.json and the home counts against data/counts.json. Checks whose
data lands in later steps print "skipped (no data yet)" instead of failing. Feature steps (tools, calendar filters, library
filters) append their own checks below."""
import os, re, sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
with open(os.path.join(ROOT, "src", "build", "config.js"), encoding="utf-8") as f:
    SLUG = re.search(r"slug:\s*'([^']+)'", f.read()).group(1)
BASE = sys.argv[1] if len(sys.argv) > 1 else f"http://127.0.0.1:8790/{SLUG}/"
fails = []
def check(name, cond, extra=""):
    print(("ok   " if cond else "FAIL ") + name + (f"  {extra}" if extra else ""))
    if not cond: fails.append(name)
def skip(name):
    print("skip " + name + "  skipped (no data yet)")

# Computed styles of the Learn pill plus the current theme's --accent resolved to the same rgb() form.
LEARN_PILL_JS = """() => { const a = document.querySelector('.site-nav .nav-learn'); if (!a) return null; const cs = getComputedStyle(a);
  const probe = document.createElement('span'); probe.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  document.body.appendChild(probe); const accent = getComputedStyle(probe).color; probe.remove();
  return { shadow: cs.boxShadow, bg: cs.backgroundColor, accent, current: a.getAttribute('aria-current') }; }"""

with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge", headless=True)
    ctx = b.new_context(viewport={"width": 1440, "height": 900}, color_scheme="dark")  # OS prefers dark: first paint must still be light
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)

    # Theme: light first paint even when the OS prefers dark; cycle Light → Dark → System → Light; persists
    page.goto(BASE, wait_until="networkidle")
    check("light is first paint", page.evaluate("document.documentElement.getAttribute('data-theme')") is None)
    check("theme control shows its state (Light)", page.inner_text(".theme-label") == "Light")
    page.click('[data-action="theme"]')
    check("1st click → dark + label", page.evaluate("document.documentElement.getAttribute('data-theme')") == "dark" and page.inner_text(".theme-label") == "Dark")
    page.reload(wait_until="networkidle")
    check("dark persists after reload", page.evaluate("document.documentElement.getAttribute('data-theme')") == "dark")
    page.click('[data-action="theme"]')
    check("2nd click → system (OS dark) + label", page.evaluate("document.documentElement.getAttribute('data-theme')") == "dark" and page.inner_text(".theme-label") == "System")
    page.reload(wait_until="networkidle")
    check("system persists and follows OS (dark)", page.evaluate("document.documentElement.getAttribute('data-theme')") == "dark" and page.inner_text(".theme-label") == "System")
    page.click('[data-action="theme"]')
    check("3rd click → light + label", page.evaluate("document.documentElement.getAttribute('data-theme')") is None and page.inner_text(".theme-label") == "Light")
    check("theme button aria-label names the state", "Light" in (page.get_attribute('[data-action="theme"]', "aria-label") or ""))

    # Home counts are present and numeric
    check("home shows computed counts", page.locator("[data-count]").count() == 5 and page.inner_text('[data-count="guides"]').strip().isdigit())

    # Search
    page.keyboard.press("/")
    page.wait_for_timeout(300)
    check("search dialog opens on /", page.evaluate("document.getElementById('search-dialog').open"))
    page.fill("#search-input", "calendar")
    page.wait_for_timeout(200)
    first = page.locator("#search-results a").first
    check("search finds the calendar page", (first.get_attribute("href") or "").endswith("calendar/"), first.get_attribute("href") or "")
    page.keyboard.press("Escape")
    check("search closes on Escape", not page.evaluate("document.getElementById('search-dialog').open"))

    # Footer disclaimer on every page type reachable from nav
    for path in ("", "guides/", "playbooks/", "learn/", "glossary/", "calendar/", "changelog/", "about/"):
        page.goto(BASE + path, wait_until="networkidle")
        check(f"footer disclaimer on /{path or ''}", "not investment advice" in page.inner_text(".footer-disclaimer"))

    # Library CSV downloads (served as text/csv)
    resp = page.request.get(BASE + "data/library.csv")
    check("library CSV served", resp.ok and resp.headers.get("content-type", "").startswith("text/csv") and resp.text().startswith("id,kind,title"))

    # Nav state: exactly one aria-current in .site-nav on every page with a nav entry; none on home (no nav entry) or facts/
    for path, want in (("", 0), ("guides/", 1), ("learn/", 1), ("facts/", 0)):
        page.goto(BASE + path, wait_until="networkidle")
        n = page.locator('.site-nav [aria-current="page"]').count()
        check(f"nav aria-current count on /{path} is {want}", n == want, f"found {n}")

    # Learn pill (N1): inset outline when not current, filled with the accent when current
    page.goto(BASE, wait_until="networkidle")
    pill = page.evaluate(LEARN_PILL_JS)
    check("Learn pill is outlined (inset box-shadow) when not current", pill and pill["current"] is None and "inset" in pill["shadow"] and pill["bg"] != pill["accent"], str(pill))
    page.goto(BASE + "learn/", wait_until="networkidle")
    pill = page.evaluate(LEARN_PILL_JS)
    check("Learn pill is filled with the accent when current", pill and pill["current"] == "page" and pill["bg"] == pill["accent"] and pill["shadow"] == "none", str(pill))

    # Data the later checks compare against
    search_idx = page.request.get(BASE + "data/search.json").json()
    facts = {f["id"]: f for f in page.request.get(BASE + "data/facts.json").json()}
    counts = page.request.get(BASE + "data/counts.json").json()

    # Facts box on the first guide → facts/ resolves and every fact row exists there
    guide_urls = [d["url"] for d in search_idx if re.match(r"^guides/[^/#]+/$", d.get("url", ""))]
    if guide_urls:
        page.goto(BASE + guide_urls[0], wait_until="networkidle")
        ids = page.evaluate("[...document.querySelectorAll('.facts-box li[id^=\"fact-\"]')].map(li => li.id)")
        link = page.get_attribute(".facts-box .all a", "href") if page.locator(".facts-box .all a").count() else None
        check(f"guide {guide_urls[0]} has a facts box with a register link", bool(ids) and bool(link), f"{len(ids)} facts, link={link}")
        if link:
            page.click(".facts-box .all a")
            page.wait_for_load_state("networkidle")
            check("facts box link resolves to facts/", page.url.rstrip("/").endswith("/facts"), page.url)
            missing = [i for i in ids if not page.locator(f"table.facts-table tbody tr#{i}").count()]
            check("every fact of the guide has a row on facts/", not missing, ", ".join(missing)[:200])
    else:
        skip("facts box → facts/ rows (needs a guide)")

    # Facts register chips: one group at a time, rows filtered, count updated
    page.goto(BASE + "facts/", wait_until="networkidle")
    if page.locator("[data-facts-filter]").count():
        total = page.locator("table.facts-table tbody tr").count()
        chip = page.locator('[data-facts-filter] .chip[data-group]:not([data-group="all"])').first
        group = chip.get_attribute("data-group")
        want = int(chip.locator(".count").inner_text().strip())
        chip.click(); page.wait_for_timeout(150)
        visible = page.evaluate("[...document.querySelectorAll('table.facts-table tbody tr')].filter(tr => !tr.hidden).map(tr => tr.dataset.group)")
        check(f"facts chip '{group}' shows only its rows", visible and all(g == group for g in visible) and len(visible) == want and 0 < want < total, f"{len(visible)} shown, chip count {want}, total {total}")
        check("pressed chip is the only aria-pressed=true", page.evaluate("[...document.querySelectorAll('[data-facts-filter] .chip[aria-pressed=\"true\"]')].map(c => c.dataset.group)") == [group])
        check("facts count line reflects the filter", str(want) in page.inner_text("[data-facts-count]"), page.inner_text("[data-facts-count]"))
        page.click('[data-facts-filter] .chip[data-group="all"]'); page.wait_for_timeout(150)
        check("All chip restores every row", page.evaluate("[...document.querySelectorAll('table.facts-table tbody tr')].filter(tr => !tr.hidden).length") == total)
    else:
        skip("facts register chips (needs facts)")

    # Named-resource audit (brief §3): no resource row without a link
    for path, sel in (("learn/", ".lib-table tbody tr, .library-table tbody tr"), ("resources/", ".directory .card"), ("sources/", ".sources-list li"), ("facts/", ".facts-table tbody tr")):
        page.goto(BASE + path, wait_until="networkidle")
        rows = page.evaluate("sel => [...document.querySelectorAll(sel)].map(r => r.querySelectorAll('a').length)", sel)
        if rows:
            check(f"{path} {len(rows)} resource rows, none without a link", all(n > 0 for n in rows), f"{sum(1 for n in rows if n == 0)} without")
        else:
            skip(f"{path} named-resource rows")

    # Home hero figures equal the register; home counts equal data/counts.json
    page.goto(BASE, wait_until="networkidle")
    hero = page.evaluate("Object.fromEntries([...document.querySelectorAll('.sebi-box .fact[data-fact]')].map(s => [s.dataset.fact, (s.querySelector('.fact-value') || s).innerText.trim()]))")
    if hero:
        wrong = [f"{k}: {v} ≠ {facts.get(k, {}).get('value')}" for k, v in hero.items() if facts.get(k, {}).get("value") != v]
        check(f"home hero shows {len(hero)} register values verbatim", len(hero) == 5 and not wrong, "; ".join(wrong)[:300])
    else:
        skip("home hero figures (needs the register)")
    shown = {k: int(page.inner_text(f'[data-count="{k}"]').strip().replace(",", "")) for k in ("guides", "playbooks", "tools", "terms", "sources")}
    check("home counts equal data/counts.json", all(shown[k] == counts.get(k) for k in shown), f"home {shown} vs {dict((k, counts.get(k)) for k in shown)}")

    # Mobile menu
    m = b.new_context(viewport={"width": 390, "height": 844})
    mp = m.new_page(); mp.goto(BASE, wait_until="networkidle")
    check("no horizontal overflow at 390", mp.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth"))
    mp.click('[data-action="menu"]')
    check("mobile menu opens and shows state", mp.evaluate("document.getElementById('mobile-nav').dataset.open") == "true" and mp.get_attribute('[data-action="menu"]', "aria-expanded") == "true")
    m.close()

    check("no console/page errors so far", not errors, "; ".join(errors)[:300])
    errors.clear()

    # 404 page under the sub-path keeps working links (the 404 itself logs a resource error — ignored)
    page.goto(BASE + "no/such/page/", wait_until="networkidle")
    check("404 served", "not here" in page.inner_text("h1"))
    check("404 links resolve via base", page.evaluate("document.querySelector('a.btn.btn-secondary').href").endswith(f"/{SLUG}/guides/"))
    check("no page errors on the 404 page", not [e for e in errors if "404" not in e], "; ".join(errors)[:300])
    b.close()

print(f"\n{len(fails)} failures" if fails else "\nall checks passed")
sys.exit(1 if fails else 0)
