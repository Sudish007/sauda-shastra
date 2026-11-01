"""WCAG 2.x contrast for every token pair the design relies on (design §3.2), light and dark themes.
Reads the two token blocks from site/styles.css (`:root` and `html[data-theme="dark"]`) so the table can never drift from the
CSS, prints the table and exits 1 when any pair is below its threshold. AA thresholds: 4.5 for text pairs, 3.0 for the non-text
(control border) pair. Output goes to stdout only (no files). A new colour pair added to the CSS must be added to PAIRS.
Usage: python scripts/contrast.py"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
with open(os.path.join(ROOT, "site", "styles.css"), encoding="utf-8") as f:
    CSS = f.read()

def block(selector):
    m = re.search(r"(?:^|\n)" + re.escape(selector) + r"\s*\{(.*?)\}", CSS, re.S)
    if not m:
        sys.exit(f"token block {selector!r} not found in site/styles.css")
    return dict(re.findall(r"--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;", m.group(1)))

TOKENS = {"light": block(":root"), "dark": block('html[data-theme="dark"]')}

PAIRS = [  # (fg, bg, threshold, use) — the 21 pairs of design §3.2
    ("ink", "bg", 4.5, "body text"), ("ink", "surface", 4.5, "text on cards"),
    ("ink-2", "bg", 4.5, "secondary text"), ("muted", "bg", 4.5, "meta on page"),
    ("muted", "surface", 4.5, "meta on cards"), ("muted", "surface-2", 4.5, "meta on table heads"),
    ("accent", "bg", 4.5, "links"), ("accent", "surface", 4.5, "links on cards"),
    ("accent", "surface-2", 4.5, "links on surface-2"), ("accent-ink", "bg", 4.5, "link hover"),
    ("on-accent", "accent", 4.5, "primary button text"), ("accent-soft-ink", "accent-soft", 4.5, "pressed chips, current nav"),
    ("up", "bg", 4.5, "▲ values"), ("up", "up-soft", 4.5, "▲ delta pill"),
    ("down", "bg", 4.5, "▼ values"), ("down", "down-soft", 4.5, "▼ delta pill"),
    ("warn", "bg", 4.5, "warnings"), ("warn", "warn-soft", 4.5, "Advanced tag"),
    ("note", "bg", 4.5, "notes"), ("note", "note-soft", 4.5, "Intermediate tag"),
    ("line-strong", "bg", 3.0, "control borders (non-text)"),
]

def lum(hex6):
    r, g, b = (int(hex6[i:i + 2], 16) / 255 for i in (1, 3, 5))
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)

def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
checks, fails = 0, []
print(f"{'pair (fg / bg)':<30}{'light':>8}{'dark':>8}   threshold  use")
for fg, bg, need, use in PAIRS:
    row = []
    for theme in ("light", "dark"):
        tok = TOKENS[theme]
        missing = [t for t in (fg, bg) if t not in tok]
        if missing:
            fails.append(f"{theme} {fg}/{bg}: token(s) {missing} not a 6-digit hex in the {theme} block")
            row.append(float("nan"))
            continue
        r = round(ratio(tok[fg], tok[bg]), 2)
        checks += 1
        row.append(r)
        if r < need:
            fails.append(f"{theme} {fg}/{bg} = {r} < {need}")
    print(f"{fg + ' / ' + bg:<30}" + "".join(f"{v:>8.2f}" for v in row) + f"   (≥ {need})     {use}")
print(f"\n{checks} pair-theme checks, {len(fails)} below threshold" + (": " + "; ".join(fails) if fails else ""))
sys.exit(1 if fails else 0)
