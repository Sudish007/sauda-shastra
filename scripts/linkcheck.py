"""Link health for the learning library (brief §2-N; design §6.10, §11). Exits 1 when any link is dead.
Usage: python scripts/linkcheck.py [--resources] [--out <file>] [--no-browser]
  --resources   also check every URL in content/data/resources.json
  --out         report path (default content/data/library/health.json, read by the Learn page at build)
  --no-browser  skip the headless-Edge re-check (every failed fetch then counts as dead)
Reads content/data/library/courses.json and books.json, collects every unique URL and fetches each with a browser
User-Agent: HEAD first, GET when HEAD is not 2xx; redirects followed (at most 10); 30 s timeout. Requests to one host are
spaced: >= 15 s for zerodha.com (429 under load), >= 13 s for wiley.com (429 above one request per ~12 s), >= 6 s for
amazon.in (503 wall under bursts), >= 2 s elsewhere.
A URL that is still not 2xx (or failed to connect) is re-checked in headless Edge via Playwright (channel="msedge"):
a 2xx render, or a non-2xx page that is an anti-bot interstitial (BOT_WALL below: Amazon's "automated access" 503,
Cloudflare's "Just a moment", Akamai's "Access Denied … Reference #"), means the host blocks scripts but opens for
visitors -> class "blocked" (kept, listed); anything else -> "dead".
Writes { "checked": "YYYY-MM-DD", "urls": n, "ok": n, "blocked": [url, ...], "dead": [url, ...] } and prints a table.
The GitHub Pages build has no network step, so the report is committed with the data it describes."""
import argparse, json, os, re, ssl, sys, time, urllib.error, urllib.request
from datetime import datetime
from urllib.parse import urlsplit

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "content", "data")
with open(os.path.join(ROOT, "src", "build", "config.js"), encoding="utf-8") as f:
    TZ = re.search(r"timeZone:\s*'([^']+)'", f.read()).group(1)


def today_in_site_zone():
    """YYYY-MM-DD in the site's time zone; Windows Pythons without the tzdata package fall back to the machine clock."""
    try:
        from zoneinfo import ZoneInfo
        return datetime.now(ZoneInfo(TZ)).strftime("%Y-%m-%d")
    except Exception:  # noqa: BLE001 — ZoneInfoNotFoundError when tzdata is absent
        return datetime.now().strftime("%Y-%m-%d")


# A page served by an anti-bot layer instead of the resource: the host refuses automated clients but opens for visitors.
# These are matched against the rendered text of a non-2xx re-check so a bot wall is reported as "blocked", not "dead".
BOT_WALL = re.compile(r"automated access|api-services-support@amazon|Just a moment|Pardon Our Interruption|verify you are (?:a )?human|"
                      r"unusual traffic|Request unsuccessful\. Incapsula|Access Denied.{0,400}Reference #", re.I | re.S)

ap = argparse.ArgumentParser(description="Library link health: HEAD/GET sweep, headless-Edge re-check, health.json.")
ap.add_argument("--resources", action="store_true", help="also check content/data/resources.json")
ap.add_argument("--out", default=os.path.join(DATA, "library", "health.json"))
ap.add_argument("--no-browser", action="store_true", help="skip the Playwright re-check (failures count as dead)")
args = ap.parse_args()

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0"
HEADERS = {"User-Agent": UA, "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf;q=0.9,*/*;q=0.8",
           "Accept-Language": "en-IN,en;q=0.9", "Cache-Control": "no-cache"}
TIMEOUT = 30
MAX_REDIRECTS = 10
# Seconds between two requests to the same host (suffix match); every other host gets the default.
# amazon.in answers bursts of automated requests with its "rush hour" 503 (an IP-level wall that lifts after a while).
HOST_SPACING = {"zerodha.com": 15.0, "wiley.com": 13.0, "amazon.in": 6.0}
DEFAULT_SPACING = 2.0


def load(rel):
    with open(os.path.join(DATA, rel), encoding="utf-8") as fh:
        return json.load(fh)


def collect():
    """Unique URLs in file order, with the entry ids that use each (for the table)."""
    urls, used = [], {}
    for rel in ("library/courses.json", "library/books.json"):
        for e in load(rel):
            for l in e.get("links", []):
                u = l["url"]
                if u not in used: urls.append(u)
                used.setdefault(u, []).append(e["id"])
    if args.resources:
        for r in load("resources.json"):
            u = r["url"]
            if u not in used: urls.append(u)
            used.setdefault(u, []).append(r.get("name", "resource"))
    return urls, used


def host_of(url):
    h = (urlsplit(url).hostname or "").lower()
    return h[4:] if h.startswith("www.") else h


def spacing(host):
    for suffix, secs in HOST_SPACING.items():
        if host == suffix or host.endswith("." + suffix): return secs
    return DEFAULT_SPACING


class Redirects(urllib.request.HTTPRedirectHandler):
    max_redirections = MAX_REDIRECTS


OPENER = urllib.request.build_opener(Redirects(), urllib.request.HTTPSHandler(context=ssl.create_default_context()))


def fetch(url, method):
    """-> (status or None, note). Reads at most 64 KB of a GET body."""
    req = urllib.request.Request(url, headers=HEADERS, method=method)
    try:
        with OPENER.open(req, timeout=TIMEOUT) as resp:
            if method == "GET": resp.read(65536)
            return resp.status, resp.geturl()
    except urllib.error.HTTPError as e:
        return e.code, e.reason
    except Exception as e:  # noqa: BLE001 — URLError, timeout, ssl, connection reset
        return None, type(e).__name__ + ": " + str(e)[:80]


def sweep(urls):
    """HEAD then GET per URL, honouring per-host spacing; -> {url: {"status", "method", "note", "ok"}}."""
    pending = [(u, "HEAD") for u in urls]
    next_ok = {}
    results = {}
    done = 0
    total = len(urls)
    while pending:
        now = time.monotonic()
        i = min(range(len(pending)), key=lambda k: (next_ok.get(host_of(pending[k][0]), 0.0), k))
        url, method = pending.pop(i)
        host = host_of(url)
        wait = next_ok.get(host, 0.0) - now
        if wait > 0: time.sleep(wait)
        status, note = fetch(url, method)
        next_ok[host] = time.monotonic() + spacing(host)
        ok = status is not None and 200 <= status < 300
        if ok or method == "GET":
            done += 1
            results[url] = {"status": status, "method": method, "note": note, "ok": ok}
            print(f"[{done:>3}/{total}] {method:<4} {status if status is not None else 'ERR':<4} {'ok ' if ok else 'FAIL'} {url[:100]}{'' if ok else '  ' + str(note)[:60]}", flush=True)
        else:
            pending.append((url, "GET"))  # HEAD refused or failed: try GET after the host's spacing
    return results


def browser_recheck(urls):
    """Render each URL in headless Edge (normal desktop UA: the default one says "Headless" and hosts refuse it);
    -> {url: (status or None, "wall" | "")}. A download that starts counts as a 200 (the file exists); a non-2xx page whose
    text is an anti-bot interstitial is flagged "wall"."""
    out = {}
    if not urls: return out
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        ctx = browser.new_context(accept_downloads=True, locale="en-IN", user_agent=UA)
        for url in urls:
            page = ctx.new_page()
            got = {"download": False}
            page.on("download", lambda d: got.__setitem__("download", True))
            status, wall = None, ""
            try:
                resp = page.goto(url, wait_until="domcontentloaded", timeout=45000)
                page.wait_for_timeout(1500)
                status = resp.status if resp else None
                if status is not None and not 200 <= status < 300:
                    try:  # the markup, comments included: Amazon states "automated access" only inside an HTML comment
                        html = page.evaluate("document.documentElement.outerHTML.slice(0, 300000)")
                        if BOT_WALL.search(html or ""): wall = "wall"
                    except Exception:  # noqa: BLE001 — no document (PDF viewer, aborted navigation)
                        pass
            except Exception as e:  # noqa: BLE001
                page.wait_for_timeout(1500)
                if got["download"] or "Download is starting" in str(e): status = 200
            if got["download"]: status = 200
            out[url] = (status, wall)
            print(f"  edge {status if status is not None else 'ERR':<4} {wall:<4} {url[:106]}", flush=True)
            page.close()
        browser.close()
    return out


def main():
    urls, used = collect()
    print(f"{len(urls)} unique URLs from courses.json + books.json{' + resources.json' if args.resources else ''}; "
          f"spacing >= {DEFAULT_SPACING:g} s per host ({', '.join(f'{h} {s:g} s' for h, s in HOST_SPACING.items())})\n", flush=True)
    results = sweep(urls)
    failed = [u for u in urls if not results[u]["ok"]]
    rendered = {} if (args.no_browser or not failed) else browser_recheck(failed)
    if failed and not args.no_browser: print()
    is_blocked = lambda u: u in rendered and ((rendered[u][0] is not None and 200 <= rendered[u][0] < 300) or rendered[u][1] == "wall")  # noqa: E731
    blocked = [u for u in failed if is_blocked(u)]
    dead = [u for u in failed if u not in blocked]
    checked = today_in_site_zone()
    report = {"checked": checked, "urls": len(urls), "ok": len(urls) - len(failed), "blocked": blocked, "dead": dead}
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(report, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    print(f"{'class':<8} {'fetch':<9} {'edge':<9} url  [entries]")
    for u in urls:
        r = results[u]
        cls = "dead" if u in dead else "blocked" if u in blocked else "ok"
        edge = rendered.get(u)
        edge_s = "-" if edge is None else f"{edge[0] if edge[0] is not None else 'ERR'} {edge[1]}".strip()
        print(f"{cls:<8} {(r['method'] + ' ' + str(r['status'] if r['status'] is not None else 'ERR')):<9} {edge_s:<9} {u}  [{', '.join(used[u][:3])}]")
    print(f"\n{report['urls']} checked on {checked}: {report['ok']} ok, {len(blocked)} blocked (bot walls that open in a browser, kept), {len(dead)} dead -> {os.path.relpath(args.out, ROOT)}")
    sys.exit(1 if dead else 0)


if __name__ == "__main__":
    main()
