# Sauda Shastra — Indian markets, explained for traders and investors

**Sauda Shastra** (सौदा शास्त्र, “the science of the trade”) is a free, static, source-verified knowledge site: how Indian markets work for intraday and options traders, the technical analysis traders actually use, playbooks written to one fixed template, macro and events in IST, algo and systematic trading in India, risk, psychology and tax, long-term investing in India and the USA, and a ranked library of courses and books. Sources, not tips.

Live: https://sudish007.github.io/sauda-shastra/

## Stack

Node ≥ 24, plain ESM, one dependency (`marked`), `node:test`. No framework, bundler, server or database. Output is a static `dist/` deployed to GitHub Pages under `/sauda-shastra/` by `.github/workflows/pages.yml` (Pages source = GitHub Actions); every URL is relative and the 404 page pins `<base href>`.

```
npm install
npm run build     # content/ → dist/
npm run serve     # http://127.0.0.1:8790/sauda-shastra/
npm test          # content validation, markdown, built HTML, links, SEO, identity
```

## Verification

`npm test` covers the content validators, the renderers and the built HTML. The real-browser audits run on a Python venv with Playwright (the scripts launch Edge, `channel="msedge"`) against a served build (`npm run build`, then `npm run serve` or `PORT=8791 node scripts/serve.mjs`):

```
python scripts/shots.py [base_url] [out_dir] [--pages a/,b/] [--all-articles]   # screenshots + the numeric UI audit matrix, audit.json, exit 1 on any finding
python scripts/contrast.py                                                      # WCAG AA for the 21 token pairs × 2 themes, read from site/styles.css
python scripts/e2e.py [base_url]                                                # functional smoke test; prints "skipped (no data yet)" for data later steps add
```

`shots.py` audits the page list of the design (home, guides index, first guide, playbooks index, first playbook, tools index, first tool, learn, glossary, calendar, changelog, resources, facts, about, sources, 404 via an unknown nested path; articles that do not exist yet are skipped) at 320 (audit only), 390, 820, 1024 (audit only), 1440, 1920 and 2560 (device scale factor 0.75, so the shot is 1920 × 1080) in both themes; screenshots are viewport-only, named `<page>-<width>-<theme>.png`. `--pages guides/x/,tools/y/` adds pages to the audited and shot set (named by their path); `--all-articles` audits every guide, playbook and tool from `data/search.json` at 320 and 390 without screenshots.

| Audit | Pass criterion |
|---|---|
| Horizontal overflow | `scrollWidth ≤ clientWidth`; at 320 also `scrollWidth ≤ 320` |
| Minimum type | every visible HTML text node ≥ 12 px; every `svg text` ≥ 12 px after scaling by rendered width / viewBox width |
| Line measure | widest line box of every visible `p, li, dd, dt, figcaption, blockquote, td, th` leaf ≤ 80.5 × its own `ch` |
| Controls | `button, .btn, .chip, input, select, .site-nav a, .mobile-nav a` ≥ 40 px tall (radio/checkbox inputs excluded: their label is the control) |
| Content box | (container width − padding) / clientWidth ≥ 0.88 at ≥ 1920 |
| No intersecting boxes | no two children of `.card, .month, .result, .rates, .toolbar, .sebi-box, .glance, .upnext > *, .changelog > li` overlap |
| No empty grid cells | every row of every grid/flex container (`.grid*`, `.glance`, `.options`, `.counts`, `.footer-grid`, `.rail`, `.article-layout`, `.month-grid`, `.hero-grid`, `.learn-hero`, `.tool-layout`, `.kpis`, `.upnext`, …) is filled to within one gap |
| Stateful controls | `[aria-pressed]`, `[aria-expanded]`, `[data-mode]` carry text or an aria-label naming the state; the theme label equals the forced theme |
| Vocabulary | body text never names the project's internals |
| Contrast | `scripts/contrast.py`: 4.5:1 for text pairs, 3:1 for the control border, both themes |
| Behaviour | `scripts/e2e.py`: light first paint under an OS dark preference, theme cycle and persistence, search, mobile menu, 404 base, one `aria-current` per page with a nav entry, Learn pill states, facts box → `facts/` rows, register chips, named-resource rows all linked, hero figures = register, home counts = `data/counts.json` |

## Where things live

- **Identity** — `src/build/config.js` is the one constant for the site name, slug, base path, localStorage prefix, owner, repo and live URL. Renaming the site is a change there plus `name` in `package.json` (a test keeps them equal).
- **UI strings** — `src/build/strings.js`; the client receives its strings through `<template id="ui-strings">`, so `site/app.js` has no literal UI text. No string may hold a fact value (figures reach strings through placeholders filled at build) and none names the project's internals; `tests/design.test.js` checks both.
- **Build** — `src/build/{content,markdown,templates,pages,site,dates,tools}.js`; `scripts/build.mjs` writes `dist/`. `tools.js` is the calculator registry (`{ id, title, summary, factIds, fields, examples, formula }`); `tools/` renders from it and `tools:` front matter is validated against its ids.
- **Client** — `site/app.js` (three-state theme Light → Dark → System, search dialog, mobile menu, TOC scrollspy, reading progress, facts-register filter), `site/styles.css` (the design system: tokens, fill grids, article layout), self-hosted fonts in `site/fonts/`. The current nav item is marked at build time from each page's `layout({ current })`; the client never infers it.

## Content model

- `content/guides/<slug>.md` — front matter: `title`, `section` (one of the ten sections in `content.js`), `summary`, `updated` (YYYY-MM-DD), `level` (beginner | intermediate | advanced), `reading_time` (minutes; computed if absent), `topics`, `related` (guide or playbook slugs that exist), `tools` (optional; calculator ids from `src/build/tools.js`, rendered as the rail's Tools card), `sources` as `Title | URL | accessed YYYY-MM-DD`. Body in Markdown with `:::note|tip|warning|rule|example|evidence` callouts. The `summary` may use `{{fact:id}}` tokens (rendered plain on cards and in the lede; reduced to the value for meta and search).
- `content/playbooks/<slug>.md` — same fields plus `instruments`, `window` (IST), `glance_stop`, `glance_target`, `glance_size` (≤ 90 characters each; they fill the at-a-glance grid with Instruments and Window) and `evidence` (EVIDENCE | MECHANISM | LORE). The body must contain these h2 headings in this order: Context & instruments → Time window (IST) → Pre-conditions → Entry → Stop → Target / exit → Position-size rule → When NOT to trade → Known failure modes → Evidence label → Schematic. The schematic is `<figure class="schematic">` holding an inline `<svg>` with **no `<text>`** (every word lives in the `<figcaption class="legend">`, which ends with “Schematic, not real data.”). Sources render from front matter after the body. The build fails on a wrong order, a missing glance field, words inside the SVG or a missing legend. Start from `content/_templates/playbook.md`; the loader reads `content/guides`, `content/playbooks` and `content/pages` only.
- `content/pages/<slug>.md` — stand-alone pages (today `about.md`): front matter `title`, `summary`, `updated`, optional `sources`; body Markdown. Exposed to the renderers as `c.pages.<slug>`.
- Inline tokens in any Markdown body: `{{fact:id}}` renders a register value — the first use on a page shows `✓ <verified date>` linking to the rail entry (its title is `source · since|from <date> · verified <date>`), every later use renders the value plain, and a value whose `since` is still in the future carries “(from <date>)”. `{{label:EVIDENCE|MECHANISM|LORE}}` renders the evidence chip (● Evidence · ◐ Mechanism · ○ Lore) so labels are consistent and countable.
- `content/data/facts.json` — the verified facts register (rendered at `facts/`): every rate, lot size, expiry day, threshold and statistic that changes. Array of `{ "id", "label", "value", "since", "source", "verified" }`: `id` lowercase-kebab with one of the nine group prefixes `mkt`/`fo` (sessions & derivatives), `chg`, `opt`, `sebi`, `tax`, `mac`, `algo`, `inv`, `glb`; `value` the bare figure with its unit (`"0.1%"`, `"₹307 per crore"`, `"65"`, `"15:40 IST"`) — ≤ 60 characters when any page tokens the id (fatal; a warning above 40), ≤ 120 for register-only rows — with qualifiers in the `label`; `since` the date the value took effect; `source` as `Title | URL`, where the title names the enacted instrument or circular (“Finance Act 2026, s. 159”, “NSE circular FA/73061”) — a Finance Bill clause or a Budget memorandum fails the build; `verified` the date it was last checked. Prose never types these numbers: `tests/design.test.js` scans every built page for a register value typed within six words of its label words, and `src/build/strings.js` for any fact value at all. The five home-hero facts (`sebi-loss-2026-share`, `-amount`, `-avg`, `sebi-costs-share`, `sebi-loss-2026-five-year-consistent`) must exist with one shared `verified` date whenever the register is non-empty.
- `content/data/glossary.json` — `[{ "term", "def", "see": [] }]`; `def` may use `{{fact:id}}`.
- `content/data/calendar.json` — `{ "note", "filters": [{ "id", "label" }], "events": [{ "date": "YYYY-MM-DD" | "rule", "what", "kind", "time_ist", "source" }] }`; every event's `kind` must be a filter id.
- `content/data/changelog.json` — `[{ "date", "what", "detail", "source", "affects": [slugs] }]` for the “What changed” page.
- `content/data/resources.json` — `[{ "category", "name", "url", "what" }]`; every named item is a link.
- `content/data/library/courses.json`, `books.json` — `[{ "id", "title", "by", "type" (course | book | paper | video series | newsletter), "cost" (free | paid), "price": { "amount", "currency", "seen" }, "links": [{ "label", "url" }], "year", "level", "fits": [...], "hours" | "pages", "why", "caveats" }]` (`why` and `caveats` are both required); `fits` ⊂ intraday | options | algo | India investing | US/global investing | risk & psychology | tax & rules. `library/path.json` — `{ "intro", "stages": [{ "title", "hoursPerWeek", "steps": [{ "entry": id, "note" }] }] }`. The build emits `data/library.csv`.

Routes: `/`, `guides/`, `guides/<slug>/`, `playbooks/`, `playbooks/<slug>/`, `tools/` (index of the registry), `learn/`, `glossary/`, `calendar/`, `changelog/`, `resources/`, `facts/` (the register: nine group chips, a text filter, “Download JSON” → `data/facts.json`, and a table of value · source · since/from · verified · used on), `about/`, `sources/`, `404.html`. Home-page counts (guides, playbooks, calculators, glossary terms, sources) are computed at build and also written to `dist/data/counts.json`; `data/search.json` indexes guides, sections, playbooks, tools, terms, courses and books (`learn/#<id>`), facts (`facts/#fact-<id>`) and pages.

## Honesty

Educational content, not investment advice. The author is not a SEBI-registered research analyst or investment adviser. Derivatives trading carries risk of loss. Every statistic on the site carries a linked primary source and the date it was accessed.

Text: CC BY 4.0 (`content/LICENSE-CONTENT`). Code: MIT (`LICENSE`).
