---
title: Results season: reading a results filing fast
section: Fundamentals & news
summary: The season clock set by the listing rules — quarterly results within {{fact:sebi-results-deadline-quarterly}} of quarter end, audited annual results within {{fact:sebi-results-deadline-annual}} of year end — how to find a board-meeting date, the thirty-minute disclosure rule that lets results land mid-session, and a line-by-line route through the Ind AS statement to EBITDA, margin, other income and EPS.
updated: 2026-11-02
level: intermediate
order: 1
topics: [results season, lodr, regulation 33, board meeting intimation, ind as, schedule iii, ebitda margin, other income, exceptional items, eps, guidance, trading window]
related: [commentary-ratings-block-deals, governance-red-flags, scanners-and-where-data-lives, event-day-iv-crush-hedged, iv-expected-move-and-crush, opening-range-and-gaps]
tools: [expected-move]
sources:
  - SEBI (LODR) Regulations 2015, amended up to 14 Jul 2026 — Reg 29(1), 30(6), 33(3); Schedule III Part A para A(16) and cl. 15 | https://www.sebi.gov.in/sebi_data/attachdocs/jul-2026/1784630770711.pdf | accessed 2026-11-02
  - SEBI master circular for compliance with the LODR Regulations (Nov 2024), Section III-A para 3 and footnote 8 — results formats follow Schedule III to the Companies Act 2013 | https://www.sebi.gov.in/sebi_data/attachdocs/nov-2024/1731408456573.pdf | accessed 2026-11-02
  - SEBI circular CIR/CFD/FAC/62/2016 — Revised formats for financial results and implementation of Ind AS (copy hosted by the Association of Merchant Bankers of India; SEBI's own listing page for this circular could not be located) | http://www.ambi.org.in/Circulars/Revised%20Formats%20for%20Financial%20Results%20and%20Implementation%20of%20Ind-AS%20by%20Listed%20Entities%20-%20July%2005,%202016.pdf | accessed 2026-11-02
  - ICAI — Guidance Note on Division II, Ind AS Schedule III to the Companies Act 2013 (Statement of Profit and Loss format) | https://live.icai.org/bos/vcc-2nd-batch-recorded-lectures/pdf/6.%20ICAI%20Guidance%20Note%20on%20Division%20II-%20Ind%20AS%20Schedule%20III_Revised.pdf | accessed 2026-11-02
  - SEBI circular CIR/CFD/CMD/15/2015 — formats for financial results under Reg 33 (superseded for periods from March 2017) | https://www.sebi.gov.in/sebi_data/attachdocs/1448885855487.pdf | accessed 2026-11-01
  - SEBI (Prohibition of Insider Trading) Regulations 2015, consolidated text — Schedule B cl. 4 (trading-window closure) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1786963663321.pdf | accessed 2026-11-01
  - NSE — Corporate filings: announcements | https://www.nseindia.com/companies-listing/corporate-filings-announcements | accessed 2026-11-01
  - BSE — Corporate announcements | https://www.bseindia.com/corporates/ann.html | accessed 2026-11-01
---
## The season clock

Results arrive on a schedule the listing regulations fix, not one companies choose. {{label:EVIDENCE}} Regulation 33(3) of SEBI's [LODR Regulations](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2026/1784630770711.pdf) requires quarterly and year-to-date results within {{fact:sebi-results-deadline-quarterly}} of the end of every quarter except the last, and audited annual results, with the audit report, within {{fact:sebi-results-deadline-annual}} of the end of the financial year. For the March year end that almost every Indian company uses, the four windows for the current financial year close on the dates below.

| Quarter | Period | Last filing date |
|---|---|---|
| Q1 FY27 | April–June 2026 | {{date:2026-08-14}} |
| Q2 FY27 | July–September 2026 | {{date:2026-11-14}} |
| Q3 FY27 | October–December 2026 | {{date:2027-02-14}} |
| Q4 FY27 and the full year | January–March 2027 | {{date:2027-05-30}} |

Large banks and IT companies tend to report in the first fortnight of a window; the crowd arrives in the final ten days, when fifty or more companies can report on one evening. The site's [calendar](../../calendar/) carries the four windows as "Results windows", switched off by default because they are seasons, not dates.

### Finding the date for one company

A company must tell the exchanges before its board meets to approve results. {{label:EVIDENCE}} Regulation 29(1) sets the notice at a minimum of two working days, excluding the day of the intimation and the day of the meeting; before the amendment of {{date:2024-05-17}} it was five days. The intimation appears on the exchanges' announcement pages ([NSE](https://www.nseindia.com/companies-listing/corporate-filings-announcements), [BSE](https://www.bseindia.com/corporates/ann.html)) under the company's name, usually as "Board meeting intimation", and on the company's own investor page. Two working days is short: a trader who holds a stock through a results window checks the announcement page every evening, because the first warning may arrive only forty-eight hours before the number.

## When the number lands

{{label:EVIDENCE}} Schedule III Part A of the LODR Regulations requires the outcome of a board meeting that considers financial results to be disclosed within thirty minutes of the meeting's close; Regulation 30(6) carries the same half-hour rule for decisions taken at board meetings generally, and Schedule III adds that when a meeting runs over more than one day the results are disclosed within thirty minutes of the end of the day on which they were considered. Boards meet during the trading day as often as after it, so a results PDF can hit the exchange in the late morning or the middle of the afternoon with the stock trading. Nothing in the rules requires a company to wait for the close.

What a trader does with that:

- **Know the meeting, not just the day.** The intimation names the date, rarely the hour. A company whose last four results all arrived early in the afternoon will probably repeat the pattern; a company that reports after the close pushes the whole reaction into the next day's pre-open order-entry window, {{fact:mkt-preopen-window}}, which closes at a random moment in its last two minutes and matches at one equilibrium price before continuous trading begins.
- **Size for the gap, not the drift.** An after-close result means the first print of the next session is the reaction, with no chance to act in between. [Opening ranges and gaps](../opening-range-and-gaps/) covers how such opens behave; the position-sizing rule is the one in [Position sizing and loss limits](../position-sizing-and-loss-limits/): the overnight risk is the whole gap, not the stop.
- **Options price the move before you do.** The straddle on a stock with liquid options tells you the move the market has already priced; the [expected-move calculator](../../tools/expected-move/) converts the straddle into points. [IV, expected move and IV crush](../iv-expected-move-and-crush/) explains why implied volatility collapses once the number is known, and the [event-day IV-crush playbook](../../playbooks/event-day-iv-crush-hedged/) shows a hedged structure built on that.

## The statement, line by line

{{label:EVIDENCE}} The results PDF follows a prescribed order. SEBI's circular of July 2016 ([CIR/CFD/FAC/62/2016](http://www.ambi.org.in/Circulars/Revised%20Formats%20for%20Financial%20Results%20and%20Implementation%20of%20Ind-AS%20by%20Listed%20Entities%20-%20July%2005,%202016.pdf)) retired the format of November 2015 and, for every period from the quarter ended March 2017, tied quarterly results to the Statement of Profit and Loss format in Schedule III to the Companies Act 2013; SEBI's [LODR master circular](https://www.sebi.gov.in/sebi_data/attachdocs/nov-2024/1731408456573.pdf) of November 2024 restates the rule. For a company that reports under Ind AS the format is Division II of Schedule III, whose line items run in this order (the ICAI's [guidance note](https://live.icai.org/bos/vcc-2nd-batch-recorded-lectures/pdf/6.%20ICAI%20Guidance%20Note%20on%20Division%20II-%20Ind%20AS%20Schedule%20III_Revised.pdf) reproduces the schedule):

1. Revenue from operations
2. Other income
3. Total income
4. Expenses: cost of materials consumed; purchases of stock-in-trade; changes in inventories; employee benefits expense; finance costs; depreciation and amortisation expense; other expenses; total expenses
5. Profit or loss before exceptional items and tax
6. Exceptional items
7. Profit or loss before tax
8. Tax expense (current and deferred)
9. Profit or loss for the period from continuing operations, then discontinued operations and their tax
10. Profit or loss for the period
11. Other comprehensive income
12. Total comprehensive income
13. Earnings per equity share, basic and diluted, for continuing and for discontinued operations

Banks and insurers follow their own regulators' formats instead, so a bank's results read differently (net interest income, provisions, gross and net non-performing assets) and this route does not apply to them.

### What the format does not give you

{{label:MECHANISM}} Two things a trader wants are not line items. There is no EBITDA line, and there is no "operating profit" line: finance costs and depreciation sit inside expenses, and other income sits above expenses inside total income. The first profit line you meet, profit before exceptional items and tax, therefore already includes interest income on the company's cash and already has interest expense taken out. To see the business on its own, rebuild it:

EBITDA = profit before exceptional items and tax + finance costs + depreciation and amortisation − other income.

Margin is EBITDA divided by revenue from operations, never by total income. Companies publish their own "EBITDA" in the press release that accompanies the filing, and many of them leave other income in; the definition is in a footnote, and the footnote is where to look first.

### The reading order

1. **Revenue from operations**, against the same quarter a year earlier and against the previous quarter. Year on year removes seasonality; quarter on quarter shows the turn.
2. **Rebuild EBITDA** from the three lines above and compute the margin. Compare margin in basis points, not in rupees, so a growing company and a shrinking one are read the same way.
3. **Other income**: how much of profit before tax does it supply? Treasury income is real money, but it is not the business, and it disappears when the cash is spent.
4. **Exceptional items**: a sale of land, an impairment, a settlement. Read the note; decide whether the quarter's profit is the business or the exception.
5. **Tax, profit for the period, EPS.** Diluted EPS for continuing operations is the figure analysts' estimates are usually written against.
6. **Segment information.** SEBI's 2016 circular sets the minimum: segment revenue, segment results, segment assets and liabilities. A one-segment headline can hide a loss-making second segment.

:::example Worked example (an illustrative company, not a listed one)
Revenue from operations ₹1,200 crore against ₹1,000 crore a year earlier, a fifth higher. Profit before exceptional items and tax ₹180 crore; finance costs ₹27 crore; depreciation and amortisation ₹55 crore; other income ₹22 crore.

EBITDA = 180 + 27 + 55 − 22 = ₹240 crore, a margin of 20.0% on revenue from operations. Last year's EBITDA was ₹180 crore on ₹1,000 crore, 18.0%: the margin widened by 200 basis points, which is the sentence the market trades on. Exceptional items nil. Tax ₹45 crore leaves profit for the period of ₹135 crore; on ten crore shares, EPS is ₹13.50.

Two traps are visible in the same numbers. Other income of ₹22 crore is 12.2% of profit before tax, so an analyst who projects the quarter's earnings forward is partly projecting interest on a cash pile. And a reader who divides EBITDA by total income (₹1,222 crore) gets 19.6%, a different margin from a different denominator; margins must be compared on revenue from operations, quarter after quarter.
:::

### Quarter on quarter has its own seasons

{{label:MECHANISM}} The fourth quarter carries year-end write-offs and bonus provisions; the first quarter of many consumer businesses is the weakest; IT services companies report wage hikes in a known quarter. A margin "collapse" that repeats every year in the same quarter is a calendar, not a signal. Keep the prior year's four quarters on the same sheet before deciding that anything has changed.

## Guidance, and who may trade on it

{{label:EVIDENCE}} "Guidance" is not a mandated item anywhere in the results format or in Schedule III. It lives in the investor presentation and the earnings call, both of which have their own rules: the schedule of analyst and investor meets is disclosed at least two working days ahead and the presentation is posted before the meeting begins, while call audio must be on the company's website before the next trading day or within twenty-four hours, whichever is earlier, with transcripts within five working days. [Management commentary, analyst ratings and block deals](../commentary-ratings-block-deals/) takes the call apart. Because guidance is voluntary, a change to earlier guidance is a material event only where the company's own materiality policy says so, which is why a withdrawn outlook sometimes appears in the call and nowhere else.

{{label:EVIDENCE}} Insiders cannot trade into the number. Schedule B of SEBI's [insider-trading regulations](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1786963663321.pdf) closes the trading window for designated persons from the end of every quarter until forty-eight hours after the results are public. Promoter or director purchases disclosed in results week were therefore made after the fact, which is worth knowing before reading them as a vote of confidence that preceded the number.

{{label:LORE}} Practitioners say the first move after a result is often reversed by the close, and that "sell the news" follows a quarter that was pre-announced in the press. No Indian study of post-results drift that this site could find on {{date:2026-11-02}} supports or refutes either claim, so both stay lore here. What the rules give a trader is narrower and more useful: when the number can arrive, in what order to read it, and who was barred from trading ahead of it.

:::evidence What the evidence says
- {{label:EVIDENCE}} Filing deadlines (Reg 33), the two-working-day board-meeting notice (Reg 29), the thirty-minute disclosure rule (Reg 30 and Schedule III) and the trading-window closure (PIT Schedule B) are primary text, linked above.
- {{label:EVIDENCE}} The results format is Schedule III of the Companies Act 2013 by SEBI's circular of July 2016, restated in the LODR master circular of November 2024.
- {{label:MECHANISM}} EBITDA is a derivation from the Ind AS lines, not a line item; margin is defined on revenue from operations.
- {{label:LORE}} Post-results reversal and "sell the news": practitioner claims without an Indian study.
:::
