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

Screenshots and the numeric UI audit (overflow, 12 px floor, 40 px controls, overlaps, stateful controls, 320 px sweep) come from `scripts/shots.py`; the functional smoke test is `scripts/e2e.py`. Both run on the workspace Python venv with Playwright: `python scripts/shots.py [base_url] [out_dir]`, `python scripts/e2e.py [base_url]`.

## Where things live

- **Identity** — `src/build/config.js` is the one constant for the site name, slug, base path, localStorage prefix, owner, repo and live URL. Renaming the site is a change there plus `name` in `package.json` (a test keeps them equal).
- **UI strings** — `src/build/strings.js`; the client receives its strings through `<template id="ui-strings">`, so `site/app.js` has no literal UI text.
- **Build** — `src/build/{content,markdown,templates,pages,site}.js`; `scripts/build.mjs` writes `dist/`.
- **Client** — `site/app.js` (three-state theme Light → Dark → System, search dialog, mobile menu, TOC scrollspy, reading progress), `site/styles.css`, self-hosted fonts in `site/fonts/`.

## Content model

- `content/guides/<slug>.md` — front matter: `title`, `section` (one of the ten sections in `content.js`), `summary`, `updated` (YYYY-MM-DD), `level` (beginner | intermediate | advanced), `reading_time` (minutes; computed if absent), `topics`, `related` (guide or playbook slugs), `sources` as `Title | URL | accessed YYYY-MM-DD`. Body in Markdown with `:::note|tip|warning|rule|example|evidence` callouts.
- `content/playbooks/<slug>.md` — same fields plus `instruments`, `window` (IST) and `evidence` (EVIDENCE | MECHANISM | LORE). The body must contain these h2 headings in this order: Context & instruments → Time window (IST) → Pre-conditions → Entry → Stop → Target / exit → Position-size rule → When NOT to trade → Known failure modes → Evidence label → Schematic (an inline `<svg>` captioned “schematic, not real data”). Sources render from front matter after the body. The build fails on a wrong order.
- `content/data/facts.json` — facts that change (rates, lot sizes, expiry days, thresholds, API prices). Array of `{ "id", "label", "value", "since", "source", "verified" }`: `id` lowercase-kebab; `value` the figure as shown (e.g. `"0.1%"`); `since` the date the value took effect; `source` as `Title | URL` (or a bare URL); `verified` the date it was last checked against the source. Prose never hard-codes a fact: write `{{fact:id}}` and the build renders the value with its verified date and lists the page's facts in the rail. Unknown ids fail the build.
- `content/data/glossary.json` — `[{ "term", "def", "see": [] }]`.
- `content/data/calendar.json` — `{ "note", "filters": [{ "id", "label" }], "events": [{ "date": "YYYY-MM-DD" | "rule", "what", "kind", "time_ist", "source" }] }`.
- `content/data/changelog.json` — `[{ "date", "what", "detail", "source", "affects": [slugs] }]` for the “What changed” page.
- `content/data/resources.json` — `[{ "category", "name", "url", "what" }]`; every named item is a link.
- `content/data/library/courses.json`, `books.json` — `[{ "id", "title", "by", "type" (course | book | paper | video series | newsletter), "cost" (free | paid), "price": { "amount", "currency", "seen" }, "links": [{ "label", "url" }], "year", "level", "fits": [...], "hours" | "pages", "why", "caveats" }]`; `fits` ⊂ intraday | options | algo | India investing | US/global investing | risk & psychology | tax & rules. `library/path.json` — `{ "intro", "stages": [{ "title", "hoursPerWeek", "steps": [{ "entry": id, "note" }] }] }`. The build emits `data/library.csv`.

Home-page counts (guides, playbooks, tools, glossary terms, sources) are computed at build and also written to `dist/data/counts.json`.

## Honesty

Educational content, not investment advice. The author is not a SEBI-registered research analyst or investment adviser. Derivatives trading carries risk of loss. Every statistic on the site carries a linked primary source and the date it was accessed.

Text: CC BY 4.0 (`content/LICENSE-CONTENT`). Code: MIT (`LICENSE`).
