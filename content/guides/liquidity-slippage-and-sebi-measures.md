---
title: Liquidity, slippage and SEBI's measures
section: Options
summary: Where index-option liquidity actually sits, what a {{fact:opt-tick-size-options}} tick does to a cheap premium, a scalping round trip costed line by line from the register's rates, the freeze quantity that caps a Nifty order at {{fact:fo-freeze-qty-nifty}} units, order throttling, and a dated table of every SEBI measure since 2024 with the regulator's own before-and-after numbers.
updated: 2026-11-01
level: intermediate
order: 7
topics: [liquidity, bid-ask spread, tick size, slippage, scalping, transaction costs, freeze quantity, order throttling, sebi measures, weekly expiry, lot size, upfront premium, position limits, mwpl]
related: [index-derivatives-specs, what-a-trade-costs, expiry-day-dynamics, order-types-and-products, settlement-circuits-asm-ban, buying-vs-selling-options, what-sebi-loss-studies-say]
tools: [charges]
sources:
  - SEBI circular Oct 2024 (2024/132) — Measures to strengthen the equity index derivatives framework | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf | accessed 2026-11-01
  - SEBI circular May 2025 (2025/79) — Enhancing trading convenience and strengthening risk monitoring in equity derivatives | https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748521484014.pdf | accessed 2026-11-01
  - SEBI circular May 2025 (2025/76) — Final settlement day (expiry day) for equity derivatives | https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748266377271.pdf | accessed 2026-11-01
  - SEBI circular Mar 2025 (2025/41) — Intraday monitoring of position limits for index derivatives | https://www.sebi.gov.in/sebi_data/attachdocs/mar-2025/1743161645941.pdf | accessed 2026-11-01
  - SEBI circular Sep 2025 (2025/122) — Framework for intraday position-limit monitoring for equity index derivatives | https://www.sebi.gov.in/sebi_data/attachdocs/sep-2025/1756745625835.pdf | accessed 2026-11-01
  - SEBI consultation paper May 2026 — Framework for strike prices of options contracts | https://www.sebi.gov.in/sebi_data/attachdocs/may-2026/1779704800543.pdf | accessed 2026-11-01
  - SEBI consultation paper Jul 2024 — Measures to strengthen the index derivatives framework (strike coverage, expiry-day tables) | https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1722407296072.pdf | accessed 2026-11-01
  - SEBI study Jul 2025 — Growth in equity derivatives vis-à-vis the cash market after recent measures | https://www.sebi.gov.in/sebi_data/attachdocs/jul-2025/1751900271726.pdf | accessed 2026-11-01
  - SEBI press release 50/2026 (Aug 2026) — Trends in retail participation, trading behaviour and profitability in equity derivatives | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf | accessed 2026-11-01
  - SEBI — Profitability of individual traders in the equity derivatives segment, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
  - SEBI circular Feb 2025 — Safer participation of retail investors in algorithmic trading | https://www.sebi.gov.in/sebi_data/attachdocs/feb-2025/1738665456458.pdf | accessed 2026-11-01
  - NSE — Nifty 50 derivatives contract specifications | https://www.nseindia.com/products-services/equity-derivatives-nifty50 | accessed 2026-11-01
  - NSE circular FAOP/70616 (Oct 2025) — Revision in market lot of derivative contracts on indices | https://nsearchives.nseindia.com/content/circulars/FAOP70616.pdf | accessed 2026-11-01
  - NSE circular FAOP/77189 (Oct 2026) — Quantity freeze limits for indices | https://nsearchives.nseindia.com/content/circulars/FAOP77189.pdf | accessed 2026-11-01
  - NSE circular FAOP/76693 (Oct 2026) — Quantity freeze limits for indices (superseded) | https://nsearchives.nseindia.com/content/circulars/FAOP76693.pdf | accessed 2026-11-01
  - NSE circular FAOP/76068 (Aug 2026) — Quantity freeze limits for indices (superseded) | https://nsearchives.nseindia.com/content/circulars/FAOP76068.pdf | accessed 2026-11-01
  - NSE circular FAOP/71582 (Dec 2025) — Pre-open session in the equity derivatives segment, update | https://nsearchives.nseindia.com/content/circulars/FAOP71582.pdf | accessed 2026-11-01
  - Market Insiders (Aug 2026) — SEBI may end weekly options expiry to curb risk (press report; watch item only) | https://marketinsiders.in/2026/08/31/sebi-may-end-weekly-options-expiry-to-curb-risk/ | accessed 2026-11-01
---
## Where the liquidity is

Index-option liquidity is narrow in two dimensions: it sits in the nearest expiry, and within that expiry in the strikes nearest the index. SEBI's [August 2026 press release](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf) puts {{fact:opt-zero-dte-share-fy26}} of FY26 index-option turnover in contracts expiring the same day; the underlying [profitability study](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf) adds that weekly contracts' share of index-option turnover fell from about 98 per cent before the one-weekly-per-exchange rule to about 82 per cent in December 2024 and then recovered to about ninety-seven per cent. Everything else — the monthly, the far strikes, the second-nearest weekly — trades on wider spreads and thinner books.

Across strikes, Nifty 50 lists {{fact:opt-strike-count-nifty}} strikes at introduction, {{fact:opt-strike-interval-nifty}} apart, which SEBI's [consultation paper of July 2024](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1722407296072.pdf) notes covers roughly 7–8 per cent of index movement either way, with reserve strikes added intraday as the index moves ([NSE contract specifications](https://www.nseindia.com/products-services/equity-derivatives-nifty50)). The same paper observed that far out-of-the-money strikes on expiry day see sudden price moves at very low premium — a thin book moving on a few lots. A [consultation paper of May 2026](https://www.sebi.gov.in/sebi_data/attachdocs/may-2026/1779704800543.pdf) proposes a formal strike framework — a minimum number of in- and out-of-the-money strikes, daily review, intraday additions in the direction of the move and purging of far strikes; no final circular had been issued by {{date:2026-11-01}}.

## Tick size and the cost of a cheap option

Nifty option prices step in units of {{fact:opt-tick-size-options}}. On a ₹179 premium that is a rounding error; on a ₹3 premium quoted 2.95 bid and 3.05 ask the spread is ₹0.10, more than three per cent of the price, before any order has moved the book. Cheap far-out-of-the-money options look free to trade and are the most expensive instruments on the chain in spread terms — and because they move in jumps of a tick on a tiny base, a "doubling" from {{fact:opt-tick-size-options}} to ₹0.10 is one tick, not a trend. {{label:MECHANISM}}

Slippage is the difference between the price you saw and the price you got. For market orders it is the spread plus whatever the book lacked at the top; for stop-loss market orders on expiry afternoon it can be several ticks, because the book behind the best quote is thin exactly when everyone's stop is in the same place. [Candles, order flow and depth](../candles-order-flow-depth/) explains what the five-level depth shows and does not.

## A scalp, costed line by line

Scalping — buying and selling within minutes for a few rupees of premium — multiplies the cost line by the number of round trips. Here is one, priced from the [verified facts register](../../facts/).

:::example
Buy one lot of a Nifty option at ₹100 and sell it at ₹102. Gross gain: two points × {{fact:fo-nifty-lot}} units = ₹130. Buy turnover is ₹6,500 and sell turnover ₹6,630.

- Brokerage at {{fact:chg-brokerage-example-options}} on two orders: ₹40.
- Securities transaction tax at {{fact:chg-stt-options-sell}} of the sell-side premium: ₹9.95.
- NSE transaction charge at {{fact:chg-nse-txn-options}} of premium turnover on both legs: ₹4.67.
- SEBI turnover fee at {{fact:chg-sebi-fee}}: a paisa.
- Stamp duty at {{fact:chg-stamp-options}} of the buy-side premium: ₹0.20.
- GST at {{fact:chg-gst-rate}} on brokerage, exchange and SEBI charges: ₹8.04.

Total ₹62.87, so the net gain is ₹67.13 — almost half the gross went in costs, and a two-point loser costs ₹192.87. The [charges calculator](../../tools/charges/) reproduces each line and lets you change the brokerage plan.
:::

Because so many of the lines are per order or per rupee of premium rather than per rupee of profit, the cost line does not shrink when the market gets quieter. SEBI's FY26 studies make exactly this observation at the aggregate level: individuals' premium turnover fell, their total transaction costs were broadly unchanged because the transaction tax had risen from {{date:2024-10-01}}, and cumulative costs for FY22–FY26 were about one lakh crore rupees. {{label:EVIDENCE}} [What a trade costs](../what-a-trade-costs/) covers the same lines for equity and futures.

## Freeze quantity: the largest order you can send

A quantity freeze is an order-entry cap, not a position limit: an order above it is held for exchange confirmation rather than matched, and in practice is rejected whole. NSE sets the limits per index from the index level and publishes them through the contract file; the current values come from [circular FAOP/77189](https://nsearchives.nseindia.com/content/circulars/FAOP77189.pdf), effective {{date:2026-11-02}}: Nifty 50 {{fact:fo-freeze-qty-nifty}} units, Bank Nifty {{fact:fo-freeze-qty-banknifty}}, FinNifty {{fact:fo-freeze-qty-finnifty}}, Nifty Midcap Select {{fact:fo-freeze-qty-midcpnifty}} and Nifty Next 50 {{fact:fo-freeze-qty-niftynxt50}}.

:::example
For Nifty that is {{fact:fo-freeze-qty-nifty}} ÷ {{fact:fo-nifty-lot}} = 27 full lots, or 1,755 units, per ticket. A forty-lot order (2,600 units) must go as two orders, say 27 lots and 13 lots, the second queued behind the first and filled at whatever the book then offers — which is slippage by construction on a fast expiry afternoon.
:::

Two cautions. The figures changed twice in a month — a [circular effective {{date:2026-10-05}}](https://nsearchives.nseindia.com/content/circulars/FAOP76693.pdf) had roughly doubled them before the [current circular](https://nsearchives.nseindia.com/content/circulars/FAOP77189.pdf) brought them back to the [earlier levels](https://nsearchives.nseindia.com/content/circulars/FAOP76068.pdf) — so read the exchange's contract file, not a blog, before sizing a large order. And BSE's Sensex freeze quantity is not in this site's register: the BSE notice could not be fetched when the register was built, so take it from BSE's contract file.

## Order throttling

Three layers can slow or stop an order before the exchange sees it. The broker's own risk system rejects orders that breach its per-second or per-client limits. SEBI's [retail algorithmic-trading framework](https://www.sebi.gov.in/sebi_data/attachdocs/feb-2025/1738665456458.pdf) treats orders above an orders-per-second threshold, set by the brokers' industry forum, as algorithmic and requires them to be registered with the exchange, with API access through a client-specific key and a broker-whitelisted static IP; the Algo section of this site covers the threshold and the dates. And the exchange's freeze quantity above caps each order's size. A scalper sending many small orders is closer to the first two layers than it feels.

## What changed since 2024, and how strategies adapted

SEBI's measures arrived in a sequence, each with its own date. The regulator later grouped them: four aimed at expiry-day activity (the calendar-spread rule, intraday monitoring, weekly rationalisation and the ELM add-on), one at suitability (contract size) and one at basic risk hygiene (upfront premium). Every row below renders from the register, with its circular linked in the sources; the two rows marked *history* describe rules that have since been superseded and are kept so that older commentary can be read correctly.

| Effective | Measure |
|---|---|
| {{date:2024-11-20}} | Weekly expiries limited to {{fact:opt-weekly-expiries-per-exchange}} benchmark index per exchange; new index contracts must be worth at least {{fact:fo-min-contract-value}} at introduction; additional {{fact:fo-expiry-day-elm-addon}} ELM on short index options on their expiry day ([Oct 2024 circular](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf)). |
| {{fact:opt-upfront-premium-since}} | Option premium collected upfront from buyers (SEBI's own date was {{date:2025-02-01}}); calendar-spread margin benefit withdrawn on expiry day for index contracts. |
| {{date:2025-04-01}} | Intraday monitoring of index-derivative position limits: at least {{fact:opt-intraday-monitoring-snapshots}} random snapshots a day. *History:* SEBI's [circular of {{date:2025-03-28}}](https://www.sebi.gov.in/sebi_data/attachdocs/mar-2025/1743161645941.pdf) said intraday breaches would not be penalised "until further directions". |
| {{date:2025-07-01}} | Open interest for limits measured as delta-adjusted FutEq; end-of-day index-option limits of {{fact:opt-position-limit-index-eod-net}} net and {{fact:opt-position-limit-index-eod-gross}} gross per PAN phased in to {{date:2025-12-06}} ([May 2025 circular](https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748521484014.pdf)). *History:* its annexure repeated the no-penalty stance for intraday breaches. |
| {{date:2025-09-01}} | NSE expiries move to {{fact:fo-nifty-weekly-expiry-day}}, BSE's to {{fact:fo-sensex-weekly-expiry-day}}; every other contract expires in the last week of the month on that day ([May 2025 expiry-day circular](https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748266377271.pdf)). |
| {{date:2025-10-01}} | Intraday index-option limits per entity of {{fact:opt-position-limit-index-intraday-net}} net and {{fact:opt-position-limit-index-intraday-gross}} gross FutEq, checked at the snapshots, with expiry-day breaches penalised from {{date:2025-12-06}} ([Sep 2025 circular](https://www.sebi.gov.in/sebi_data/attachdocs/sep-2025/1756745625835.pdf)) — superseding the two history rows above. Stock MWPL redefined as the {{fact:fo-mwpl-formula}}, with the ban at {{fact:fo-mwpl-ban-threshold}} of it on FutEq open interest. |
| {{date:2025-12-08}} | Pre-open session live for current-month futures, in the {{fact:mkt-fo-preopen-since}} window ([NSE circular FAOP/71582](https://nsearchives.nseindia.com/content/circulars/FAOP71582.pdf)). |
| {{date:2026-01-06}} | New index lots in force: Nifty 50 {{fact:fo-nifty-lot}} (from 75), Bank Nifty {{fact:fo-banknifty-lot}}, FinNifty {{fact:fo-finnifty-lot}}, Nifty Midcap Select {{fact:fo-midcpnifty-lot}} ([NSE circular FAOP/70616](https://nsearchives.nseindia.com/content/circulars/FAOP70616.pdf)). |
| {{date:2026-05-05}} | Calendar-spread benefit on expiry day {{fact:opt-calendar-spread-expiry-rule}} for single-stock derivatives as well. |
| {{date:2026-08-03}} | Closing Auction Session {{fact:mkt-closing-session}} for stocks with derivatives; derivatives trade {{fact:mkt-fo-session}}; expiring index options settle on the auction-built index close. |
| {{date:2026-11-02}} | Index freeze quantities revised again (Nifty {{fact:fo-freeze-qty-nifty}}), after the {{date:2026-10-05}} change. |
| {{date:2026-12-07}} | Auction moves to {{fact:opt-cas-window-from-2026-12-07}}; derivatives trade {{fact:mkt-fo-session-from-2026-12-07}}; an expiring index contract stops at {{fact:opt-expiring-index-close-time-from-2026-12-07}} and settles on a thirty-minute VWAP index value. |

### The regulator's own before-and-after

SEBI's [study of July 2025](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2025/1751900271726.pdf) compared December 2024 to May 2025 with the same months a year earlier: index-options premium turnover fell 9 per cent and notional turnover 29 per cent, the number of unique individual traders in equity derivatives fell by a fifth, and about 91 per cent of individuals still lost money in FY25. Market-wide average daily index-option premium was ₹61,533 crore against ₹67,467 crore a year earlier and ₹54,086 crore two years earlier. The same study traced the boom the measures were aimed at: individuals' average daily traded value in index options had risen from ₹1,256 crore in FY20 to ₹25,324 crore in FY25, and of every ₹100 individuals traded in equity derivatives, ₹5 went to index options in FY20 and ₹41 in FY25. {{label:EVIDENCE}} The FY26 studies then showed the same-day-expiry share easing from 70 per cent to {{fact:opt-zero-dte-share-fy26}}, and the weekly share recovering to about ninety-seven per cent.

### How strategies adapted

{{label:MECHANISM}} The adaptations follow from the rules rather than from any study of trader behaviour:

- **Concentration into the surviving weeklies.** With {{fact:opt-weekly-expiries-per-exchange}} weekly per exchange, Nifty on {{fact:fo-nifty-weekly-expiry-day}} and Sensex on {{fact:fo-sensex-weekly-expiry-day}} absorb the activity that four weeklies once shared; the dip-and-recovery in the weekly share says so.
- **More hedged structures.** Upfront premium removed buyers' intraday leverage; the expiry-day ELM add-on made naked shorts dearer on the day they were most popular. A long wing lowers SPAN ([Spreads and delta-neutral structures](../spreads-and-delta-neutral/)); SEBI's FY26 data says only that mainly-sellers were the one group with a positive median return, not which structures they used.
- **Calendars unwound before expiry.** The expiring leg loses its spread benefit, so the margin jumps on expiry morning.
- **Bigger lots, fewer lots.** The {{fact:fo-min-contract-value}} floor roughly doubled the rupee value of one lot; a trader who once held two lots holds one, and the [position-size calculator](../../tools/position-size/) often says zero.
- **Stock options under a tighter ban regime.** The MWPL formula and the FutEq ban test changed which stocks enter the ban list and what a trader may do inside it ([Settlement, circuits, ASM and the ban list](../settlement-circuits-asm-ban/)); SEBI's May 2025 circular also set eligibility rules for derivatives on non-benchmark indices (at least fourteen constituents, a top weight of no more than a fifth, the top three no more than forty-five per cent).

## Watch items

- {{label:LORE}} **The end of weekly expiries.** Press reports in 2025 and 2026 said SEBI's chairman had floated a consultation on ending weekly options ([one such report](https://marketinsiders.in/2026/08/31/sebi-may-end-weekly-options-expiry-to-curb-risk/)); no consultation paper or circular appeared in SEBI's archive through October 2026, and NSE's contract page still listed four weekly Nifty expiries on {{date:2026-11-01}}. Until a document exists this is lore, and the [What changed](../../changelog/) page will carry it the day it stops being so.
- **The strike framework** (consultation of May 2026) and **the December 2026 close**: both are dated above; [Expiry-day dynamics](../expiry-day-dynamics/) covers the second.
- **The next lot review.** Lots are reviewed half-yearly against the {{fact:fo-min-contract-value}} rule; [Index derivatives contract specs](../index-derivatives-specs/) explains the band.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)), and their transaction costs were about {{fact:sebi-costs-share}} of loss-makers' gross losses. Liquidity and costs are the part of the problem a trader controls. Figures and their sources live in the [verified facts register](../../facts/).
:::

:::evidence What the evidence says
- {{label:EVIDENCE}} Turnover concentrates in same-day and weekly contracts (SEBI, Aug 2026); after the 2024–25 measures premium turnover fell 9 per cent, notional 29 per cent and unique traders by a fifth (SEBI, Jul 2025); individuals' costs stayed flat as turnover fell.
- {{label:MECHANISM}} Tick size and thin far-strike books make cheap options the most expensive to trade in spread terms; per-order and per-premium charges do not shrink in quiet markets; freeze quantities turn a large order into several queued ones.
- {{label:MECHANISM}} The adaptations — concentration into two weeklies, more hedged structures, calendars unwound before expiry, fewer lots — follow from the rules.
- {{label:LORE}} An end to weekly expiries: press reports only, no SEBI document as of November 2026.
:::
