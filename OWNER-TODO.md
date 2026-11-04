# Owner to-do

Things only the repository owner can decide or do. **None of them is required for the site to work.** The site is live at <https://sudish007.github.io/sauda-shastra/> and rebuilds itself from `main` through `.github/workflows/pages.yml`.

## Decisions already fixed (change only if you want to)

### Site name: the rename point has passed
- **Why:** `gh repo create Sudish007/sauda-shastra` fixed the repository name and the URL path `/sauda-shastra/`. Links shared from now on point there.
- **How to rename anyway:** rename the repository on GitHub (Settings → General), change `SITE` in `src/build/config.js` (name, base path, URL), change `name` in `package.json`, push, and let the Pages run redeploy. GitHub redirects the old repository URL but not the old Pages URL.

### Licence
- **Why:** text is CC BY 4.0 (`content/LICENSE-CONTENT`, with per-page source attributions) and code is MIT (`LICENSE`). Both were chosen so readers can quote and reuse with credit.
- **How to change:** replace the two licence files, update the footer line in `src/build/templates.js` and the "Licence" section of `README.md`, push.

## Watches: facts that will change on a known or unknown date

### BSE transaction charges, Bankex lot size, Sensex freeze quantity (R-08)
- **Why:** the BSE notices (incl. 20260930-58, annexure 404) are unreachable to the link checker, so the charges tool ships NSE-only and `fo-freeze-qty-sensex` is a gap in the register.
- **How:** open the BSE notice in a browser, add the verified rows to `content/data/facts.json` (`chg-bse-*`, `fo-bankex-lot`, `fo-freeze-qty-sensex` with `source` and `verified`), then add the BSE toggle to the charges tool (`src/tools/rates.js` reads the register, `src/tools/calc.js` computes, `src/build/strings.js` → `exchangeHint` carries the NSE-only note), run `npm test`, push.

### NSE 2027 trading-holiday list
- **Why:** NSE publishes the next year's list around mid-December; `calendar/` currently ends with the 2026 list.
- **How:** add each 2027 holiday to `content/data/calendar.json` (same shape as the 2026 rows, source = the NSE circular URL), update `mkt-holidays-current-year-count` in `facts.json` for 2027, run `npm test`, push.

### Income-tax Rules 2026 ITR forms for tax year 2026-27 (R-13)
- **Why:** the forms were not notified when the tax guide was written; `tax-itr-form-trader` = ITR-3 is correct for the return due in 2026 only.
- **How:** when CBDT notifies the forms, re-verify the register row (value, `since`, `source`, `verified`) and the paragraph in `guides/tax-for-traders-it-act-2025/`, add a changelog entry, push.

### "From 7 Dec 2026" session facts
- **Why:** four register rows (`mkt-fo-session-from-2026-12-07`, `opt-cas-window-from-2026-12-07`, `opt-expiring-index-close-time-from-2026-12-07`, `opt-expiry-settlement-from-2026-12-07`) describe the derivatives-close change before it takes effect; after that date the "from" prefix is stale.
- **How:** on or after 7 Dec 2026, make them the current rows (drop the `-from-2026-12-07` suffix and the old `mkt-closing-session` / `opt-expiry-settlement-current` values), run `npm test` and push; the build re-renders every token.

### Blocked-host links
- **Why:** `content/data/library/health.json` lists 46 URLs as of the 5 Nov 2026 link-health refresh whose sites returned anti-bot pages to automation but rendered as available in the browser re-check. Most are retailer searches; the report keeps the complete list. They are blocked, not dead.
- **How:** open a sample every few months; if one has moved, change the URL in `content/data/library/courses.json`, `books.json` or `content/data/resources.json`, re-run `python scripts/linkcheck.py --resources`, commit `health.json`, push.

## Optional additions

### Stats page navigation
- **Why:** the computed `stats/` page now ships with ten years of Nifty gap, daily-range and India VIX data. It is reachable from search, the sitemap and the guides that interpret its tables, but the fixed main navigation does not include it.
- **How:** no action is needed. To make it a main-nav item, add its label and route in `src/build/strings.js`, then run `npm test` and the browser audits before pushing.

### BSE toggle in the charges tool
- **Why:** hidden until BSE rates are verified (see the R-08 watch above).
- **How:** as above.

### Hindi / Bhojpuri strings
- **Why:** every UI string lives in `src/build/strings.js` as one object; a second language is a second object plus a language switch.
- **How:** copy the object, translate the values, add a `lang` toggle in `templates.js`; the content pages themselves are English Markdown and would need separate files.

### Custom domain
- **Why:** optional; the GitHub Pages URL works as is.
- **How:** buy the domain, add a CNAME record pointing to `sudish007.github.io`, set the custom domain in Settings → Pages, set `SITE.base` to `/` in `src/build/config.js`, push.
