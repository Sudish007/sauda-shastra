---
title: Index derivatives contract specs
section: Foundations
summary: Lot sizes (Nifty 50 is {{fact:fo-nifty-lot}} units a lot), the {{fact:fo-min-contract-value}} sizing rule, which index expires on which weekday, freeze quantities, the FutEq position limits that are now checked intraday, expiry-day margins and what changes for expiring contracts from {{date:2026-12-07}}.
updated: 2026-11-01
level: intermediate
order: 5
topics: [lot size, contract value, weekly expiry, monthly expiry, freeze quantity, position limits, futeq, expiry day, physical settlement, nifty, sensex]
related: [trading-day-ist, order-types-and-products, intraday-leverage-today, what-a-trade-costs, expiry-day-dynamics, liquidity-slippage-and-sebi-measures, expiry-day-straddle-scalp, market-data-for-backtesting-india, execution-realities-and-architecture]
tools: [position-size]
sources:
  - NSE circular FAOP/70616 (Oct 2025) — Revision in market lot of derivative contracts on indices | https://nsearchives.nseindia.com/content/circulars/FAOP70616.pdf | accessed 2026-11-01
  - SEBI circular May 2025 (2025/76) — Final settlement day (expiry day) for equity derivatives | https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748266377271.pdf | accessed 2026-11-01
  - NSE circular FAOP/68747 (Jun 2025) — Revision in expiry day to Tuesday | https://nsearchives.nseindia.com/content/circulars/FAOP68747.pdf | accessed 2026-11-01
  - BSE — Contract specifications, SENSEX derivatives | https://www.bseindia.com/static/markets/Derivatives/DeriReports/contractindex | accessed 2026-11-01
  - SEBI circular Oct 2024 (2024/132) — Measures to strengthen the equity index derivatives framework | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf | accessed 2026-11-01
  - NSE circular FAOP/64506 (Oct 2024) — Discontinuation of weekly contracts on Bank Nifty, Midcap Select and FinNifty | https://nsearchives.nseindia.com/content/circulars/FAOP64506.pdf | accessed 2026-11-01
  - NSE circular FAOP/77189 (Oct 2026) — Quantity freeze limits for index derivatives | https://nsearchives.nseindia.com/content/circulars/FAOP77189.pdf | accessed 2026-11-01
  - SEBI circular May 2025 (2025/79) — Enhancing trading convenience and strengthening risk monitoring in equity derivatives | https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748521484014.pdf | accessed 2026-11-01
  - SEBI circular Sep 2025 (2025/122) — Framework for intraday position-limit monitoring for equity index derivatives | https://www.sebi.gov.in/sebi_data/attachdocs/sep-2025/1756745625835.pdf | accessed 2026-11-01
  - NSE circular SURV/75524 (Jul 2026) — Changes in FutEq intraday monitoring on account of the CAS | https://nsearchives.nseindia.com/content/circulars/SURV75524.pdf | accessed 2026-11-01
  - SEBI circular Oct 2026 — Review of the CAS, market timings and settlement methodology for derivatives | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf | accessed 2026-11-01
  - SEBI circular Dec 2018 (2018/161) — Physical settlement of stock derivatives | https://www.sebi.gov.in/sebi_data/attachdocs/dec-2018/1546255335099.pdf | accessed 2026-11-01
  - BSE notice 20260930-58 — Revision in market lot of derivative contracts (one index revised for January-2027 expiries) | https://www.bseindia.com/downloads/UploadDocs/Notices/20260930-58/20260930-58.pdf | accessed 2026-11-01
---
## Lot sizes and the contract-value rule

An index derivative is never traded one unit at a time; it comes in lots, and the lot is what makes a 40-point move worth a specific number of rupees. The current NSE lots date from the January-2026 expiries (weekly contracts from {{date:2026-01-06}}, monthly from {{date:2026-01-27}}) and come from NSE's [circular FAOP/70616](https://nsearchives.nseindia.com/content/circulars/FAOP70616.pdf); BSE's Sensex lot is on its [contract specifications page](https://www.bseindia.com/static/markets/Derivatives/DeriReports/contractindex).

| Index | Exchange | Lot size | Weekly expiry |
|---|---|---|---|
| Nifty 50 | NSE | {{fact:fo-nifty-lot}} | {{fact:fo-nifty-weekly-expiry-day}} |
| Bank Nifty | NSE | {{fact:fo-banknifty-lot}} | {{fact:fo-banknifty-weekly-status}} |
| FinNifty | NSE | {{fact:fo-finnifty-lot}} | None (monthly only since Nov 2024) |
| Nifty Midcap Select | NSE | {{fact:fo-midcpnifty-lot}} | None (monthly only since Nov 2024) |
| Nifty Next 50 | NSE | {{fact:fo-niftynxt50-lot}} | None (monthly only) |
| Sensex | BSE | {{fact:fo-sensex-lot}} | {{fact:fo-sensex-weekly-expiry-day}} |

Why these numbers? SEBI's [circular of {{date:2024-10-01}}](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf) requires an index derivative to be worth at least {{fact:fo-min-contract-value}} when it is introduced, and the exchanges set lots so that the contract value sits in a ₹15–20 lakh band on each review date. Reviews are half-yearly: NSE revised stock lots on {{date:2026-03-30}} and {{date:2026-09-30}} and left the index lots alone both times. When an index rises enough, its lot is cut; when it falls, the lot is raised.

:::example
With Nifty 50 at 23,000, one lot is 23,000 × {{fact:fo-nifty-lot}} = ₹14,95,000 of notional — a shade below {{fact:fo-min-contract-value}}, which is why a sustained fall from here would make Nifty a candidate for a larger lot at the next review. Sensex at 74,459 × {{fact:fo-sensex-lot}} = ₹14,89,180 sits in the same place. A 40-point Nifty move is 40 × {{fact:fo-nifty-lot}} = ₹2,600 per lot, and a 100-point move is ₹6,500.
:::

:::warning
BSE's [notice of {{date:2026-09-30}}](https://www.bseindia.com/downloads/UploadDocs/Notices/20260930-58/20260930-58.pdf) keeps three of its indices unchanged and raises the lot of one index for January-2027 and later expiries; the annexure naming the index could not be fetched when this register was built, so the Sensex lot above is confirmed for current expiries only. The Bankex lot and the Sensex freeze quantity are likewise not in the register — take them from BSE's contract page, and take BSE charges from your broker's contract note.
:::

### Nifty 50 options at a glance

Nifty 50 options are European and cash-settled, with strikes every {{fact:opt-strike-interval-nifty}} apart at every index level and a price step of {{fact:opt-tick-size-options}}. Weekly and monthly contracts share the same lot and strike grid; the difference is time to expiry and liquidity, which concentrates in the nearest weekly.

## Which index expires on which day

Two SEBI rules fix the expiry calendar. The [circular of {{date:2024-10-01}}](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf) allows each exchange weekly expiries on {{fact:opt-weekly-expiries-per-exchange}} benchmark index only, which is why NSE's Bank Nifty, FinNifty and Midcap Select weeklies ended in November 2024 ([circular FAOP/64506](https://nsearchives.nseindia.com/content/circulars/FAOP64506.pdf) gives the last dates). The [circular of {{date:2025-05-26}}](https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748266377271.pdf) then restricted every equity-derivative expiry to a Tuesday or a Thursday: one weekly benchmark-index option per exchange on its chosen day, and everything else — benchmark index futures, other index contracts, stock F&O — with a minimum one-month tenor expiring in the last week of the month on that same day. An exchange needs SEBI's approval to change its day.

NSE chose Tuesday for contracts expiring on or after {{date:2025-09-01}} ([circular FAOP/68747](https://nsearchives.nseindia.com/content/circulars/FAOP68747.pdf)); BSE kept Thursday. So today:

- Nifty 50 weekly options expire on {{fact:fo-nifty-weekly-expiry-day}}; every NSE monthly contract expires on the {{fact:fo-monthly-expiry-day-nse}}.
- Sensex weekly options expire on {{fact:fo-sensex-weekly-expiry-day}}; BSE monthly contracts expire on the {{fact:fo-monthly-expiry-day-bse}}.
- A holiday on the expiry weekday moves that expiry to the previous trading day; the [calendar](../../calendar/) lists the 2026 shifts.

For an options trader this means an index expiry somewhere in the market on two days of every week — the pattern [Expiry-day dynamics](../expiry-day-dynamics/) in the Options section builds on.

## Freeze quantity: the largest order you can send

Every index contract has a quantity-freeze limit set from the index's level band, revised when the index moves to a new band. Current values from NSE's [circular FAOP/77189](https://nsearchives.nseindia.com/content/circulars/FAOP77189.pdf): Nifty 50 {{fact:fo-freeze-qty-nifty}} units, Bank Nifty {{fact:fo-freeze-qty-banknifty}}, FinNifty {{fact:fo-freeze-qty-finnifty}}, Nifty Midcap Select {{fact:fo-freeze-qty-midcpnifty}}, Nifty Next 50 {{fact:fo-freeze-qty-niftynxt50}}. An order larger than the freeze is rejected whole, not trimmed. For Nifty that is {{fact:fo-freeze-qty-nifty}} ÷ {{fact:fo-nifty-lot}} = 27 lots per order; a larger position is several orders, each queued behind the last. [Order types and products](../order-types-and-products/) has the split example.

## Position limits, now checked during the day

Since the glide path that ended on {{date:2025-12-06}}, index options carry two end-of-day limits per PAN under SEBI's [circular of {{date:2025-05-29}}](https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748521484014.pdf), both measured in **FutEq** — delta-adjusted, futures-equivalent exposure rather than contract counts:

| Limit | Net FutEq | Gross FutEq (long and short separately) |
|---|---|---|
| End of day, per PAN | {{fact:opt-position-limit-index-eod-net}} | {{fact:opt-position-limit-index-eod-gross}} |
| Intraday, per entity | {{fact:opt-position-limit-index-intraday-net}} | {{fact:opt-position-limit-index-intraday-gross}} |

The intraday row comes from SEBI's [circular of {{date:2025-09-01}}](https://www.sebi.gov.in/sebi_data/attachdocs/sep-2025/1756745625835.pdf), effective {{date:2025-10-01}}: exchanges take at least {{fact:opt-intraday-monitoring-snapshots}} random snapshots a day, one of them in the final stretch after 14:45, and from {{date:2025-12-06}} an expiry-day breach draws a penalty or a surveillance deposit. Because the closing auction now interrupts price discovery, NSE's [circular SURV/75524](https://nsearchives.nseindia.com/content/circulars/SURV75524.pdf) takes no snapshot between the start of the auction and the index equilibrium price and adds a further snapshot window after it; the fifteen-minute grace period to cure a breach does not apply after 14:45. Index futures have separate limits that NSE publishes daily ([circular SURV/76750](https://nsearchives.nseindia.com/content/circulars/SURV76750.pdf)).

A retail account is nowhere near these figures. They matter because the market's largest participants now manage their expiry-day books around snapshots — a detail the Options guides return to when discussing late-afternoon flows.

## Expiry day: margins, close and settlement

Three rules make the last day of a contract different from every other day.

### The extra margin on short options

Every short option contract that expires today carries an additional {{fact:fo-expiry-day-elm-addon}} extreme-loss margin, and the calendar-spread benefit is {{fact:opt-calendar-spread-expiry-rule}} (index derivatives since February 2025; single-stock derivatives since {{date:2026-05-05}}). [Intraday leverage today](../intraday-leverage-today/) covers the mechanics.

:::example
A trader sells one lot each of the at-the-money Nifty 23,000 call and put on expiry morning. Each short leg carries extra margin of {{fact:fo-expiry-day-elm-addon}} × 23,000 × {{fact:fo-nifty-lot}} = ₹29,900, so the straddle needs ₹59,800 more than the same position needed yesterday, over and above SPAN + ELM. Size the trade by this figure, not by the premium collected — the [position-size calculator](../../tools/position-size/) sizes from the loss limit and reports the margin alongside.
:::

### When the expiring contract stops trading

Today an expiring index contract trades to the end of the normal derivatives session, {{fact:mkt-fo-session}}, and settles at the closing index value built from its constituents' closing-auction prices. From {{date:2026-12-07}} SEBI's [circular of {{date:2026-10-15}}](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf) changes both halves:

:::note From 7 Dec 2026
- Index and stock derivatives trade {{fact:mkt-fo-session-from-2026-12-07}}, but an **expiring** index contract stops at {{fact:opt-expiring-index-close-time-from-2026-12-07}} on its expiry day.
- The settlement price of an expiring index contract becomes the index value computed from each constituent's volume-weighted average price over the last thirty minutes of continuous trading, and the exchanges broadcast an indicative value live during that half-hour.
- Stock derivatives settle at the stock's volume-weighted price over the same thirty minutes, across exchanges.
:::

The intent is to replace a settlement that depended on one auction print per stock with one that averages half an hour of trading, which is harder to move. [Expiry-day dynamics](../expiry-day-dynamics/) discusses what that does to the last-hour strategies.

### Stock F&O is delivered, not cashed

Every stock future and option open at expiry results in {{fact:fo-stock-fo-settlement}} under SEBI's [circular of {{date:2018-12-31}}](https://www.sebi.gov.in/sebi_data/attachdocs/dec-2018/1546255335099.pdf): a long call in the money becomes a purchase of the shares, a short put becomes a purchase, a long future becomes a purchase, and so on, each for the full lot. Brokers raise margins sharply in expiry week on in-the-money stock options for this reason. Index contracts remain cash-settled.

## The one-screen summary

- Lot sizes come from the ₹15–20 lakh rule and move at half-yearly reviews — read them from the register, not from memory.
- Weekly expiries exist on {{fact:opt-weekly-expiries-per-exchange}} index per exchange: Nifty 50 on {{fact:fo-nifty-weekly-expiry-day}}, Sensex on {{fact:fo-sensex-weekly-expiry-day}}.
- An order above the freeze quantity is rejected whole; a position above the FutEq limits is an intraday breach from {{date:2025-10-01}}.
- Expiry day adds ELM to short options, removes the spread benefit and, from {{date:2026-12-07}}, ends the expiring contract's trading at {{fact:opt-expiring-index-close-time-from-2026-12-07}} with a thirty-minute average settlement.
- Stock F&O delivers shares. Index F&O does not.
