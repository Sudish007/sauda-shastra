---
title: Governance red flags: pledge, related parties and sudden exits
section: Fundamentals & news
summary: The filings that warn before the price does — promoter pledges disclosed under the takeover code, related-party deals above the turnover-scaled Schedule XII thresholds ({{fact:sebi-rpt-materiality-low}} for the smallest listed companies), auditor and independent-director resignations with reasons, fraud and default disclosures — and what a trader does with each.
updated: 2026-11-02
level: intermediate
order: 3
topics: [promoter pledge, encumbrance, sast regulation 31, shareholding pattern, related-party transactions, schedule xii, audit committee, auditor resignation, independent director, fraud disclosure, trading window, insider trading]
related: [results-season-playbook, commentary-ratings-block-deals, scanners-and-where-data-lives, settlement-circuits-asm-ban, position-sizing-and-loss-limits, what-sebi-loss-studies-say]
sources:
  - SEBI (Substantial Acquisition of Shares and Takeovers) Regulations 2011, text as amended to 5 Dec 2025 — Reg 31 (disclosure of encumbered shares) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1785911192198.pdf | accessed 2026-11-01
  - SEBI (LODR) Regulations 2015, amended up to 14 Jul 2026 — Reg 23 and Schedule XII (related-party transactions), Reg 31(1)(b) (shareholding pattern), Schedule III Part A cl. 6, 7A, 7B | https://www.sebi.gov.in/sebi_data/attachdocs/jul-2026/1784630770711.pdf | accessed 2026-11-02
  - SEBI (LODR) (Fifth Amendment) Regulations 2025 — gazette notification SEBI/LAD-NRO/GN/2025/273 of 18 Nov 2025 inserting Schedule XII, in force on the thirtieth day | https://www.sebi.gov.in/sebi_data/attachdocs/nov-2025/1763638434029.pdf | accessed 2026-11-02
  - SEBI (Prohibition of Insider Trading) Regulations 2015, consolidated text — Schedule B cl. 4 (trading-window closure) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1786963663321.pdf | accessed 2026-11-01
  - NSE — Corporate filings: pledged data | https://www.nseindia.com/companies-listing/corporate-filings-pledged-data | accessed 2026-11-01
  - NSE — Corporate filings: announcements | https://www.nseindia.com/companies-listing/corporate-filings-announcements | accessed 2026-11-01
---
## Promoter pledge: what is disclosed and where

A promoter who borrows against shares has given a lender the right to sell them. That is the whole risk in one sentence, and the regulations make it visible. {{label:EVIDENCE}} Regulation 31 of SEBI's [takeover regulations](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1785911192198.pdf) requires a promoter to disclose shares encumbered by the promoter or persons acting in concert, and every invocation or release of that encumbrance, within seven working days to every exchange where the shares are listed and to the company; encumbrances created inside the depository system are exempt from the promoter's own filing because the depositories report them. Regulation 31(4) adds a yearly declaration that no encumbrance exists beyond those already disclosed.

Where to read it: NSE's [pledged data](https://www.nseindia.com/companies-listing/corporate-filings-pledged-data) page lists the disclosures by company, and the quarterly shareholding pattern — which {{label:EVIDENCE}} Regulation 31(1)(b) of the [LODR Regulations](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2026/1784630770711.pdf) requires within twenty-one days of each quarter end — carries a column for shares pledged or otherwise encumbered against each promoter's holding.

:::example Worked example
A promoter group holds 55% of a company and has pledged forty per cent of that holding. The shares a lender could sell are forty per cent of 55%, which is 22% of the company. The disclosure of each new pledge, invocation or release is due within seven working days, so the quarterly pattern can lag the filings by weeks; read the filings, then the pattern.
:::

### Why rising pledge plus a falling price is a loop

{{label:MECHANISM}} A pledge is collateral valued at the market price. When the price falls, the collateral is worth less, the lender asks for more shares or cash, and the promoter either pledges more (the pledged share of the holding rises) or fails to, in which case the lender invokes the pledge and sells in the market, pushing the price lower and the remaining collateral further under water. The loop runs on arithmetic, not on sentiment, which is why a high pledge in a falling stock is a different thing from the same pledge in a rising one.

{{label:LORE}} Practitioners quote danger lines — a fifth to a third of the promoter holding pledged — and some data sites colour the column at those levels. SEBI sets disclosure rules, not a danger threshold, and no Indian study published the level at which pledged stocks start to underperform; the lines are conventions. What is not lore is the direction: more pledge, more forced-selling risk, and the invocation filing is the moment the risk becomes a seller.

## Related-party transactions and the Schedule XII slabs

A related-party transaction (RPT) is business between the company and its promoters, group companies, directors or their relatives: rent paid to a promoter's firm, goods bought from a subsidiary, loans to an associate. Most are ordinary. The governance question is whether the terms are those an outsider would get, and the regulations answer it with approvals and thresholds.

{{label:EVIDENCE}} Regulation 23 of the LODR Regulations requires audit-committee approval for RPTs and shareholder approval, with related parties not voting, for material ones. Materiality used to be a flat test — ₹1,000 crore or ten per cent of consolidated turnover, whichever was lower. SEBI's [Fifth Amendment of 2025](https://www.sebi.gov.in/sebi_data/attachdocs/nov-2025/1763638434029.pdf), notified in the gazette on {{date:2025-11-18}}, replaced it with a new Schedule XII that scales with the company and came into force on {{date:2025-12-19}}, the thirtieth day after publication. A transaction, alone or together with earlier ones in the same financial year, is material above:

| Annual consolidated turnover | Threshold |
|---|---|
| Up to ₹20,000 crore | {{fact:sebi-rpt-materiality-low}} |
| Above ₹20,000 crore, up to ₹40,000 crore | {{fact:sebi-rpt-materiality-mid}} |
| Above ₹40,000 crore | {{fact:sebi-rpt-materiality-high}}, or {{fact:sebi-rpt-materiality-cap}}, whichever is lower |

Turnover is taken from the last audited accounts. For a subsidiary's RPTs the same amendment uses the lower of ten per cent of the subsidiary's own standalone turnover and the listed company's Schedule XII threshold.

:::example Worked examples
A company with ₹30,000 crore of consolidated turnover falls in the middle row, where the threshold is {{fact:sebi-rpt-materiality-mid}}: for that turnover the figure is ₹2,500 crore. A company with ₹60,000 crore of turnover falls in the top row, {{fact:sebi-rpt-materiality-high}}, which gives ₹3,500 crore — below the {{fact:sebi-rpt-materiality-cap}} ceiling, so the formula applies. Under the old flat test both companies would have needed shareholder approval at ₹1,000 crore.
:::

{{label:MECHANISM}} For a trader the threshold matters less than the pattern. What to read in the annual report's RPT disclosures and the half-yearly RPT filing: how many transactions, with whom, at what pricing basis, and whether the counterparties are unlisted promoter companies. Frequent loans and guarantees to promoter entities, purchases from a promoter firm at prices the audit committee had to justify, and royalty or brand-fee payments that grow faster than sales are the recurring shapes. None of them is proof of anything; each is a reason to read the next filing more closely and to carry less overnight.

## Auditor and director exits

{{label:EVIDENCE}} Schedule III Part A of the LODR Regulations makes two kinds of departure disclosable with reasons. Clause 7A: when the statutory auditor resigns, the detailed reasons the auditor gives must be disclosed to the exchanges within twenty-four hours of the company receiving them. Clause 7B: the resignation of an independent director is disclosed within seven days together with the director's reasons. Clause 6 covers fraud or default by the company, its promoters, directors, key managerial personnel or senior management.

The reasons are the filing. "Pre-occupation with other assignments" from an auditor who resigned mid-year, days before results, reads differently from a resignation at the end of a term; a director's stated reasons that mention disagreements over related-party transactions or information not provided to the board is the clearest warning a company ever files about itself. Both appear on the exchange [announcement pages](https://www.nseindia.com/companies-listing/corporate-filings-announcements) under the company's name, usually in the evening.

## Insiders and the trading window

{{label:EVIDENCE}} Schedule B of SEBI's [insider-trading regulations](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1786963663321.pdf) closes the trading window for designated persons from the end of each quarter until forty-eight hours after the financial results are public, so promoters, directors and senior staff cannot deal in the weeks when they know the quarter and the market does not. Insider trades that do happen are disclosed under the same regulations and appear on the exchange pages. Two readings follow: a promoter purchase in results week was made after the number, not before it; and a promoter sale disclosed alongside a rising pledge is two filings telling one story.

## What a trader does with each flag

{{label:MECHANISM}} A red flag is information about the distribution of outcomes, not a prediction. It widens the left tail — the chance of a gap down on a filing that arrives after the close — and the trading response is about exposure, not direction.

| Flag | Where it appears | Usual response |
|---|---|---|
| Pledge rising quarter after quarter | Shareholding pattern; pledged-data page | Intraday only; no overnight holding in the name |
| Pledge invoked by a lender | Takeover-code disclosure within seven working days | Expect a seller in the market; wider stop or no trade |
| Material RPT sent to shareholders | Notice of meeting; audit-committee disclosure | Read the terms; nothing more unless the pattern repeats |
| Auditor resigns mid-term with reasons | Schedule III cl. 7A filing | Stop trading the name until the next audited numbers |
| Independent director resigns citing disagreements | Schedule III cl. 7B filing | Reduce size; treat the next results as an event |
| Fraud or default disclosure | Schedule III cl. 6 filing | Exit the position; stocks under investigation are often moved to surveillance lists |

The last row connects to the exchanges' own machinery: a stock that files badly often lands on the ASM or GSM lists, with higher margins and trade-for-trade settlement, which [Settlement, circuits, ASM/GSM and the F&O ban](../settlement-circuits-asm-ban/) describes and [Stock scanners and where the data lives](../scanners-and-where-data-lives/) treats as an exclusion. The position-size rule does not change for a flagged stock; the decision to hold it overnight does, and [Position sizing and loss limits](../position-sizing-and-loss-limits/) is where that rule lives. No stock is named in this guide for the reason given on the [About page](../../about/): the filings are public, and the reading is yours to do.

:::evidence What the evidence says
- {{label:EVIDENCE}} Pledge disclosure within seven working days (SAST Reg 31), the shareholding pattern within twenty-one days of quarter end (LODR Reg 31), the Schedule XII thresholds in force from {{date:2025-12-19}} (LODR Fifth Amendment 2025), the auditor and director resignation clauses (Schedule III cl. 7A, 7B) and the trading-window closure (PIT Schedule B) are primary text, linked above.
- {{label:MECHANISM}} The pledge–price loop and the reading of RPT patterns are mechanisms, explained without a study.
- {{label:LORE}} Pledge "danger lines" at a fifth or a third of the holding: practitioner conventions with no published Indian evidence.
:::
