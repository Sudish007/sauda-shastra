"""Functional smoke test of the client behaviour (Playwright, workspace .venv). Exits non-zero on failure.
Usage: python scripts/e2e.py [base_url]   (default http://127.0.0.1:8790/<slug>/ with the slug from src/build/config.js)
Covers the shell: light first paint, three-state theme cycle + persistence, search dialog, mobile menu, 404 base href,
no console errors. Feature steps (tools, calendar filters, library filters) append their own checks below."""
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
