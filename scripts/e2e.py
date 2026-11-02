"""Functional smoke test of the client behaviour (Playwright, workspace .venv). Exits non-zero on failure.
Usage: python scripts/e2e.py [base_url]   (default http://127.0.0.1:8790/<slug>/ with the slug from src/build/config.js)
Covers the shell: light first paint, three-state theme cycle + persistence (+ theme-color meta, JSON storage, head-script-only first paint), search dialog, mobile menu, 404 base href,
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
    _cfg = f.read()
    SLUG = re.search(r"slug:\s*'([^']+)'", _cfg).group(1)
    STORE = re.search(r"storagePrefix:\s*'([^']+)'", _cfg).group(1)
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
    THEME_COLOR_JS = "document.querySelector('meta[name=\"theme-color\"]').content"
    ICON_JS = "document.querySelector('[data-action=\"theme\"] .theme-icon').innerHTML"
    page.goto(BASE, wait_until="networkidle")
    check("light is first paint", page.evaluate("document.documentElement.getAttribute('data-theme')") is None)
    check("theme control shows its state (Light)", page.inner_text(".theme-label") == "Light")
    check("theme-color meta is light (#f5f6f8)", page.evaluate(THEME_COLOR_JS) == "#f5f6f8")
    icon_light = page.evaluate(ICON_JS)
    page.click('[data-action="theme"]')
    check("1st click → dark + label", page.evaluate("document.documentElement.getAttribute('data-theme')") == "dark" and page.inner_text(".theme-label") == "Dark")
    check("1st click → theme-color meta flips to #121418", page.evaluate(THEME_COLOR_JS) == "#121418")
    check("1st click → data-mode=dark and icon changes", page.get_attribute('[data-action="theme"]', "data-mode") == "dark" and page.evaluate(ICON_JS) != icon_light)
    check("theme stored as JSON under <prefix>:theme", page.evaluate(f"localStorage.getItem('{STORE}:theme')") == '"dark"')
    page.reload(wait_until="networkidle")
    check("dark persists after reload", page.evaluate("document.documentElement.getAttribute('data-theme')") == "dark")
    check("theme-color meta is dark after reload", page.evaluate(THEME_COLOR_JS) == "#121418")
    page.click('[data-action="theme"]')
    check("2nd click → system (OS dark) + label", page.evaluate("document.documentElement.getAttribute('data-theme')") == "dark" and page.inner_text(".theme-label") == "System")
    check("2nd click → data-mode=system and monitor icon", page.get_attribute('[data-action="theme"]', "data-mode") == "system" and "<rect" in page.evaluate(ICON_JS))
    page.reload(wait_until="networkidle")
    check("system persists and follows OS (dark)", page.evaluate("document.documentElement.getAttribute('data-theme')") == "dark" and page.inner_text(".theme-label") == "System")
    check("System aria-label names the state", "System" in (page.get_attribute('[data-action="theme"]', "aria-label") or ""))
    page.click('[data-action="theme"]')
    check("3rd click → light + label", page.evaluate("document.documentElement.getAttribute('data-theme')") is None and page.inner_text(".theme-label") == "Light")
    check("3rd click → theme-color meta flips back to #f5f6f8", page.evaluate(THEME_COLOR_JS) == "#f5f6f8")
    check("theme button aria-label names the state", "Light" in (page.get_attribute('[data-action="theme"]', "aria-label") or ""))

    # First paint = the inline head script alone (app.js blocked): stored "system" + OS dark → dark; nothing stored → light
    fp = b.new_context(viewport={"width": 1440, "height": 900}, color_scheme="dark")
    fp.route("**/app.js", lambda route: route.abort())
    fp.add_init_script(f"try{{localStorage.setItem('{STORE}:theme', JSON.stringify('system'));}}catch(e){{}}")
    fpp = fp.new_page()
    fpp.goto(BASE, wait_until="domcontentloaded")
    check("first paint: stored system + OS dark → dark (head script, no app.js)", fpp.evaluate("document.documentElement.getAttribute('data-theme')") == "dark")
    fpp.close(); fp.close()
    fp = b.new_context(viewport={"width": 1440, "height": 900}, color_scheme="dark")
    fp.route("**/app.js", lambda route: route.abort())
    fp.add_init_script("try{localStorage.clear();}catch(e){}")
    fpp = fp.new_page()
    fpp.goto(BASE, wait_until="domcontentloaded")
    check("first paint: storage cleared + OS dark → light (head script, no app.js)", fpp.evaluate("document.documentElement.getAttribute('data-theme')") is None)
    fpp.close(); fp.close()

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
    check("results are grouped under a kind heading first", page.evaluate("document.querySelector('#search-results > li')?.className") == "search-group")
    # Facts are indexed as facts/#fact-<id> (design §6.3); the href is root-relative so strip the ./ or ../ prefix before comparing
    page.fill("#search-input", "STT")
    page.wait_for_timeout(200)
    hrefs = [re.sub(r"^(\.\.?/)+", "", h or "") for h in page.locator("#search-results a").evaluate_all("els => els.map(a => a.getAttribute('href'))")]
    fact_hrefs = [h for h in hrefs if h.startswith("facts/#fact-")]
    if page.evaluate("document.querySelectorAll('#search-results a').length") == 0 and not page.request.get(BASE + "data/facts.json").json():
        skip("search lists a Fact result for STT")
    else:
        check("search lists a Fact result for STT (href facts/#fact-…)", bool(fact_hrefs), hrefs[:3])
    # "/" while typing in the search field is not the shortcut: the dialog stays open and the character is not inserted
    page.focus("#search-input")
    page.keyboard.press("/")
    page.wait_for_timeout(100)
    check("/ inside the search input neither re-opens nor inserts", page.evaluate("document.getElementById('search-dialog').open") and page.input_value("#search-input") == "STT")
    page.keyboard.press("Escape")
    check("search closes on the first Escape", not page.evaluate("document.getElementById('search-dialog').open"))

    # Footer disclaimer on every page type reachable from nav
    for path in ("", "guides/", "playbooks/", "learn/", "glossary/", "calendar/", "changelog/", "about/"):
        page.goto(BASE + path, wait_until="networkidle")
        check(f"footer disclaimer on /{path or ''}", "not investment advice" in page.inner_text(".footer-disclaimer"))

    # Library CSV downloads (served as text/csv)
    resp = page.request.get(BASE + "data/library.csv")
    check("library CSV served", resp.ok and resp.headers.get("content-type", "").startswith("text/csv") and resp.text().startswith("id,kind,title"))

    # Trade-journal template (site/downloads, FEAT-012): text/csv, the exact header, two schematic rows, linked for download
    JOURNAL_HEADER = ("date,entry_time_ist,exit_time_ist,market,instrument,expiry,strike,option_type,product,playbook,direction,qty_lots,"
                      "entry_price,stop_price,target_price,exit_price,risk_rupees_1r,pnl_gross,charges,pnl_net,r_multiple,planned_trade,"
                      "followed_plan,mistake_tags,emotion_before,emotion_after,setup_grade,screenshot_link,notes")
    resp = page.request.get(BASE + "downloads/trade-journal-template.csv")
    body = resp.text() if resp.ok else ""
    check("journal CSV served as text/csv", resp.ok and resp.headers.get("content-type", "").startswith("text/csv"), resp.headers.get("content-type", ""))
    check("journal CSV has the exact header", body.split("\n")[0] == JOURNAL_HEADER, body.split("\n")[0][:120])
    check("journal CSV has two schematic rows marked as not real data", body.count("\n") == 3 and body.count("not real data") == 2, f"{body.count(chr(10))} newlines")
    page.goto(BASE + "guides/psychology-journaling-prop-firms/", wait_until="networkidle")
    link = page.locator('main a[download][href$="downloads/trade-journal-template.csv"]')
    check("journaling guide links the CSV with a download attribute", link.count() == 1, f"{link.count()} links")

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

    # Playbooks (design §6.8, N2): exactly one evidence chip outside the evidence callout on every playbook page
    # (the meta chip); the rail's "Why this is labelled" card carries no chip and {{label:}} chips live only inside
    # the :::evidence callout. Also the wordless schematic: an <svg> inside .schematic with no <text>, and a legend.
    playbook_urls = [d["url"] for d in search_idx if re.match(r"^playbooks/[^/#]+/$", d.get("url", ""))]
    if playbook_urls:
        bad_chips, bad_svg = [], []
        for url in playbook_urls:
            page.goto(BASE + url, wait_until="networkidle")
            outside = page.evaluate("[...document.querySelectorAll('.tag-evidence')].filter(el => !el.closest('.callout-evidence')).length")
            inside = page.evaluate("document.querySelectorAll('.callout-evidence .tag-evidence').length")
            if outside != 1 or inside < 1:
                bad_chips.append(f"{url} outside={outside} inside={inside}")
            svg_ok = page.evaluate("(() => { const f = document.querySelector('.schematic'); if (!f) return false; const s = f.querySelector('svg'); const l = f.querySelector('figcaption.legend'); return !!s && !s.querySelector('text') && !!l && /Schematic, not real data\\./.test(l.textContent); })()")
            if not svg_ok:
                bad_svg.append(url)
        check(f"{len(playbook_urls)} playbook pages show exactly one evidence chip outside the evidence callout", not bad_chips, "; ".join(bad_chips)[:300])
        check("every playbook schematic is a wordless <svg> with a legend ending in the fixed sentence", not bad_svg, ", ".join(bad_svg)[:300])
    else:
        skip("playbook evidence chip and schematic (needs a playbook)")

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

    # Tools (design §6.9, §12; pack L worked examples): Example 1 on open, Example 2 on click, edit releases the chips and
    # changes the result within 300 ms, Reset restores, invalid input shows a message and never NaN, segment flips the step,
    # the IV solver example, no submit button, Tools nav item current. Expected figures come from the page's own template.
    tool_urls = [d["url"] for d in search_idx if re.match(r"^tools/[^/#]+/$", d.get("url", ""))]
    RESULTS_JS = "Object.fromEntries([...document.querySelectorAll('[data-result]')].map(el => [el.dataset.result, el.innerText.trim()]))"
    def results_match(expect, where):
        got = page.evaluate(RESULTS_JS)
        wrong = [f"{k}: got {got.get(k)!r}, want {v!r}" for k, v in expect.items() if got.get(k) != v]
        extra = [k for k in got if k not in expect]
        check(f"{where}: every data-result equals the worked example ({len(expect)} figures)", not wrong and not extra, "; ".join(wrong + [f"unexpected key {k}" for k in extra])[:400])
    if tool_urls:
        check("eight tool pages are indexed", len(tool_urls) == 8, f"{len(tool_urls)}")
    else:
        skip("tool pages (needs the registry)")
    for url in tool_urls:
        tool = url.split("/")[1]
        page.goto(BASE + url, wait_until="networkidle")
        page.wait_for_timeout(150)
        examples = page.evaluate("JSON.parse(document.getElementById('tool-examples').content.textContent)")
        strings = page.evaluate("JSON.parse(document.getElementById('tool-strings').content.textContent)")
        ex1, ex2 = examples[0], examples[1]
        check(f"{tool}: no submit button", page.locator('main button[type="submit"], main input[type="submit"]').count() == 0)
        check(f"{tool}: Tools nav item is current", (page.get_attribute('.site-nav a[aria-current="page"]', "href") or "").endswith("tools/"))
        check(f"{tool}: Example 1 loaded on open (chip pressed, form data-example=1)", page.get_attribute('.chip[data-example="1"]', "aria-pressed") == "true" and page.get_attribute('.chip[data-example="2"]', "aria-pressed") == "false" and page.get_attribute("form.tool-form", "data-example") == "1")
        results_match(ex1["expect"], f"{tool} example 1")
        page.wait_for_timeout(500)
        big = page.inner_text(".result-big").strip()
        check(f"{tool}: status line announces the headline figure after the debounce", big.split()[0] in page.inner_text("#tool-announce"), page.inner_text("#tool-announce"))
        page.click('.chip[data-example="2"]')
        page.wait_for_timeout(150)
        check(f"{tool}: Example 2 chip pressed, 1 released", page.get_attribute('.chip[data-example="2"]', "aria-pressed") == "true" and page.get_attribute('.chip[data-example="1"]', "aria-pressed") == "false" and page.get_attribute("form.tool-form", "data-example") == "2")
        results_match(ex2["expect"], f"{tool} example 2")
        check(f"{tool}: reset button names example 2", "2" in page.inner_text('[data-action="reset-example"]'))
        if tool == "black-scholes-greeks":
            iv = page.inner_text('.result-big [data-result="iv"]').strip()
            check("black-scholes: IV mode example 2 shows 15.17%", iv.startswith("15.17") and "%" in iv, iv)
        # Edit the first visible numeric field by one step-compatible unit: chips release, the result changes within 300 ms
        before = page.evaluate(RESULTS_JS)
        sel = page.evaluate("() => { const i = [...document.querySelectorAll('form.tool-form [data-field]:not([hidden]) input[type=number]')].find(x => x.offsetParent !== null); return i ? '#' + i.id : null; }")
        check(f"{tool}: a visible numeric field exists to edit", bool(sel), str(sel))
        if sel:
            new_value = str(float(page.input_value(sel) or "0") + 1).rstrip("0").rstrip(".")
            page.fill(sel, new_value)
            try:
                page.wait_for_function("prev => { const now = " + RESULTS_JS + "; return Object.keys(now).length !== Object.keys(prev).length || Object.keys(now).some(k => now[k] !== prev[k]); }", arg=before, timeout=300)
                changed = True
            except Exception:  # noqa: BLE001
                changed = False
            check(f"{tool}: editing {sel} changes the result within 300 ms", changed)
            check(f"{tool}: editing releases both example chips", page.get_attribute('.chip[data-example="1"]', "aria-pressed") == "false" and page.get_attribute('.chip[data-example="2"]', "aria-pressed") == "false" and page.get_attribute("form.tool-form", "data-example") == "")
            check(f"{tool}: status says edited", "Reset" in page.inner_text("#form-status") or "edited" in page.inner_text("#form-status").lower(), page.inner_text("#form-status"))
            page.click('[data-action="reset-example"]')
            page.wait_for_timeout(150)
            results_match(ex2["expect"], f"{tool} reset to example 2")
            check(f"{tool}: reset re-presses example 2", page.get_attribute('.chip[data-example="2"]', "aria-pressed") == "true")
            # Invalid input: the field is marked with a message, the result shows a dash, nothing renders NaN
            page.fill(sel, "-5")
            page.wait_for_timeout(500)
            check(f"{tool}: invalid input marks the field (aria-invalid + .hint.error with a message)", page.get_attribute(sel, "aria-invalid") == "true" and page.locator('[data-field]:not([hidden]) .hint.error').count() >= 1 and len(page.inner_text('[data-field]:not([hidden]) .hint.error').strip()) > 3, page.inner_text('[data-field]:not([hidden]) .hint.error') if page.locator('[data-field]:not([hidden]) .hint.error').count() else "no error hint")
            check(f"{tool}: invalid input shows a dash, never NaN or Infinity", page.inner_text(".result-big").strip() == "—" and not re.search(r"NaN|Infinity", page.inner_text("main")))
            check(f"{tool}: status line asks to fix the fields", page.inner_text("#tool-announce").strip() == strings["C"]["fixFields"], page.inner_text("#tool-announce"))
            page.click('[data-action="reset-example"]')
            page.wait_for_timeout(150)
            check(f"{tool}: reset clears the error", page.locator('[aria-invalid="true"]').count() == 0 and page.locator('.hint.error').count() == 0)
        if tool == "charges":
            page.click('.chip[data-example="1"]'); page.wait_for_timeout(100)
            check("charges: equity segment → price step 0.01", page.get_attribute("#buy", "step") == "0.01")
            page.check('input[name="segment"][value="futures"]'); page.wait_for_timeout(150)
            check("charges: futures segment → price step flips to the F&O tick", page.get_attribute("#buy", "step") == "0.05", page.get_attribute("#buy", "step"))
            check("charges: futures segment shows lots and lot size, hides quantity", not page.evaluate("document.querySelector('[data-field=\"lots\"]').hidden") and not page.evaluate("document.querySelector('[data-field=\"lotSize\"]').hidden") and page.evaluate("document.querySelector('[data-field=\"qty\"]').hidden"))
            check("charges: segment switch released the example chips", page.get_attribute("form.tool-form", "data-example") == "")
            page.check('input[name="segment"][value="equity-intraday"]'); page.wait_for_timeout(150)
            check("charges: back to equity → step 0.01", page.get_attribute("#buy", "step") == "0.01")
            check("charges: brokerage model option texts ≤ 44 chars and the select does not overflow", page.evaluate("[...document.querySelectorAll('select#model option')].every(o => o.textContent.length <= 44) && document.querySelector('select#model').scrollWidth <= document.querySelector('select#model').clientWidth + 1"))
    check("no console/page errors on the tool pages", not errors, "; ".join(errors)[:300])
    errors.clear()

    # Calendar (design §6.11, §12): chips default all on except Results windows and US holidays, toggling a kind hides its rows,
    # the past switch reveals earlier dates, the current month (visitor clock in IST) says "this month", one row per kind renders,
    # times carry IST, up next holds the next four dated events, every row links its source.
    page.goto(BASE + "calendar/", wait_until="networkidle")
    page.wait_for_timeout(150)
    if page.locator("[data-cal-filters] .chip").count():
        cal = page.evaluate("JSON.parse(document.getElementById('calendar-data').content.textContent)")
        today = page.evaluate("tz => new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())", cal["tz"])
        kinds = [f["id"] for f in cal["filters"]]
        pressed = page.evaluate("Object.fromEntries([...document.querySelectorAll('[data-cal-filters] .chip')].map(c => [c.dataset.value, c.getAttribute('aria-pressed') === 'true']))")
        check("calendar: ten kind chips, all pressed except Results windows and US holidays", len(pressed) == 10 and all(pressed[k] == (k not in ("results", "us-holiday")) for k in kinds), str(pressed))
        check("calendar: every chip carries a count ≥ its dated events of that kind", page.evaluate("data => [...document.querySelectorAll('[data-cal-filters] .chip')].every(c => { const n = +c.querySelector('.count').textContent; return Number.isInteger(n) && n >= 1 && n >= data.filter(e => e.kind === c.dataset.value).length; })", cal["events"]))
        VIS = "[...document.querySelectorAll('.month li[data-kind]')].filter(li => !li.hidden && !li.closest('.month').hidden)"
        visible = page.evaluate(VIS + ".map(li => ({ k: li.dataset.kind, d: li.dataset.date }))")
        check("calendar: visible rows on load are today or later and never of a released kind", bool(visible) and all(r["d"] >= today and r["k"] not in ("results", "us-holiday") for r in visible), f"{len(visible)} visible")
        check("calendar: the past switch starts off and names its state", page.get_attribute("[data-cal-past]", "aria-pressed") == "false" and "past" in page.inner_text("[data-cal-past]").lower())
        for k in kinds:
            check(f"calendar: at least one row of kind {k} renders", page.locator(f".month li[data-kind='{k}']").count() >= 1)
        # Toggle Rule changes off → its rows hide; on again → they return
        before = page.evaluate(VIS + ".filter(li => li.dataset.kind === 'rule-change').length")
        page.click("[data-cal-filters] .chip[data-value='rule-change']"); page.wait_for_timeout(100)
        check("calendar: releasing 'Rule changes' hides every rule-change row", before > 0 and page.evaluate(VIS + ".filter(li => li.dataset.kind === 'rule-change').length") == 0 and page.get_attribute("[data-cal-filters] .chip[data-value='rule-change']", "aria-pressed") == "false", f"{before} before")
        page.click("[data-cal-filters] .chip[data-value='rule-change']"); page.wait_for_timeout(100)
        check("calendar: pressing it again restores them", page.evaluate(VIS + ".filter(li => li.dataset.kind === 'rule-change').length") == before)
        # Past switch reveals earlier dates (and the months that hold only past events)
        HIDDEN_MONTHS = "[...document.querySelectorAll('.month[data-month]')].filter(m => m.hidden).length"
        PAST_VISIBLE = VIS + f".filter(li => li.dataset.date < '{today}').length"
        hidden_months = page.evaluate(HIDDEN_MONTHS)
        page.click("[data-cal-past]"); page.wait_for_timeout(100)
        past_visible = page.evaluate(PAST_VISIBLE)
        check("calendar: 'Show past events' reveals earlier dates (and their months) and names its state", past_visible > 0 and page.get_attribute("[data-cal-past]", "aria-pressed") == "true" and page.evaluate(HIDDEN_MONTHS) < hidden_months, f"{past_visible} past rows visible; {hidden_months} months were hidden before")
        page.click("[data-cal-past]"); page.wait_for_timeout(100)
        check("calendar: switching past off hides them again", page.evaluate(PAST_VISIBLE) == 0 and page.evaluate(HIDDEN_MONTHS) == hidden_months)
        # Current month marker: exactly one, equals the visitor's month in IST, header says "this month"
        current = page.evaluate("[...document.querySelectorAll('.month.is-current')].map(m => ({ ym: m.dataset.month, text: m.querySelector('h2').innerText }))")
        check("calendar: exactly one current month, the visitor's month in IST, header contains 'this month'", len(current) == 1 and current[0]["ym"] == today[:7] and "this month" in current[0]["text"], str(current))
        # Times carry IST; every row links its source; up next = the first four dated events from today
        times = page.evaluate("[...document.querySelectorAll('.month li .time, .rules-list .time')].map(t => t.textContent.trim())")
        check("calendar: every clock time is labelled IST", bool(times) and all("IST" in t for t in times if re.search(r"\d\d:\d\d", t)), f"{len(times)} times")
        check("calendar: every event row and rule row links its source", page.evaluate("[...document.querySelectorAll('.month li, .rules-list li')].every(li => li.querySelector('a[href^=\"https://\"]'))"))
        up = page.evaluate("[...document.querySelectorAll('[data-cal-upnext] .card')].map(c => c.querySelector('.when').textContent)")
        want_up = [e for e in sorted(cal["events"], key=lambda e: e["date"]) if e["date"] >= today][:4]
        check("calendar: up next shows the next four dated events with their IST times", len(up) == len(want_up) and all((e["time"] in w) if e["time"] else True for e, w in zip(want_up, up)), str(up))
        check("calendar: rules box and 'Rules in force, verified' facts box with a register link", page.locator(".rules-box .rules-list li").count() >= 5 and page.locator(".rules-box .facts-box li[id^='fact-']").count() >= 4 and page.locator(".rules-box .facts-box .all a").count() == 1)
        check("calendar: lede renders the register tokens and the dated note", page.locator(".section-head .lede .fact").count() >= 3 and page.locator(".section-head .lede time").count() >= 1)
    else:
        skip("calendar filters (needs calendar data)")
    check("no console/page errors on the calendar page", not errors, "; ".join(errors)[:300])
    errors.clear()

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
