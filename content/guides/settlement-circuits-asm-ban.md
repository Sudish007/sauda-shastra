---
title: Settlement, circuits, ASM/GSM and the F&O ban
section: Foundations
summary: The rules that stop a trade or change its terms without warning — {{fact:mkt-settlement-cycle}} and optional T+0 settlement, market-wide circuit breakers, stock price bands and dynamic F&O bands, the ASM and GSM surveillance stages, and the F&O ban that starts at {{fact:fo-mwpl-ban-threshold}} of a stock's market-wide position limit.
updated: 2026-11-01
level: beginner
order: 4
topics: [settlement, t+1, t+0, circuit breaker, price bands, asm, gsm, f&o ban, mwpl, futeq]
related: [trading-day-ist, order-types-and-products, index-derivatives-specs, scanners-and-where-data-lives, governance-red-flags]
sources:
  - NSE — Index-based market-wide circuit breakers (halt table) | https://www.nseindia.com/products-services/equity-market-circuit-breakers | accessed 2026-11-01
  - SEBI circular CIR/MRD/DP/25/2013 — Index-based market-wide circuit breaker mechanism | https://www.sebi.gov.in/sebi_data/attachdocs/1378198702862.pdf | accessed 2026-11-01
  - SEBI circular May 2025 (2025/79) — Enhancing trading convenience and strengthening risk monitoring in equity derivatives (MWPL, FutEq, ban rules) | https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748521484014.pdf | accessed 2026-11-01
  - NSE Clearing — Position limits and security in ban period | https://www.nseclearing.in/risk-management/equity-derivatives/position-limits | accessed 2026-11-01
  - NSE — FAQs on the Additional Surveillance Measure (updated Aug 2026) | https://nsearchives.nseindia.com//web/mediaattachment/2026-08/FAQs_-_Additional_Surveillance_Measure_ASM_20260812103311.pdf | accessed 2026-11-01
  - NSE — Graded Surveillance Measure (updated Jun 2026) | https://www.nseindia.com/regulations/graded-surveillance-measure | accessed 2026-11-01
  - SEBI circular Dec 2024 (2024/172) — Enhancement in the scope of optional T+0 settlement | https://www.sebi.gov.in/sebi_data/attachdocs/dec-2024/1733829354031.pdf | accessed 2026-11-01
  - SEBI circular Sep 2021 — Introduction of T+1 rolling settlement on an optional basis | https://www.sebi.gov.in/legal/circulars/sep-2021/introduction-of-t-1-rolling-settlement-on-an-optional-basis_52462.html | accessed 2026-11-01
  - NSE circular FAOP/73928 (Apr 2026) — F&O Consolidated Circular (dynamic price bands) | https://nsearchives.nseindia.com/content/circulars/FAOP73928.zip | accessed 2026-11-01
---
## Settlement: when money and shares actually move

A trade and its settlement are two different events. You agree the price at 11:00; the shares and the cash change hands later, on a schedule the exchange fixes.

### T+1, the default

Indian equities settle on a {{fact:mkt-settlement-cycle}} cycle: shares bought on Monday reach your demat account on Tuesday, and the seller's money arrives the same day. SEBI introduced the cycle on an optional basis in its [circular of {{date:2021-09-07}}](https://www.sebi.gov.in/legal/circulars/sep-2021/introduction-of-t-1-rolling-settlement-on-an-optional-basis_52462.html) and its later T+0 circulars describe it as the existing standard. Two consequences for a trader:

- Shares you bought today have not landed yet, so brokers show them as "T1 holdings". Selling them before they arrive is possible at most brokers, with the risk of a short delivery if your own seller defaults; check your broker's policy.
- Sale proceeds are credited on settlement day. Most brokers let you reuse a large part of them for new trades the same day under SEBI's margin rules, but the cash itself cannot be withdrawn until it settles.

### T+0, the optional same-day segment

Alongside T+1 there is a T+0 segment — {{fact:mkt-t0-segment-status}} — that settles the same afternoon. It runs from the open until 13:30, with trade modification allowed until 13:45, and brokers may charge a different brokerage for it. SEBI widened it from a small beta to the top-500 stocks in phases from {{date:2025-01-31}} in its [circular of {{date:2024-12-10}}](https://www.sebi.gov.in/sebi_data/attachdocs/dec-2024/1733829354031.pdf); it remains optional in 2026, and NSE publishes notices of stocks temporarily unavailable in it. For an intraday trader it changes little — the position is closed before any settlement — but it is a separate order book with its own prices, so make sure you are in the one you meant.

## Market-wide circuit breakers

When the whole market falls or rises too far too fast, every equity and equity-derivative order book halts. The trigger levels are {{fact:mkt-index-circuit-breaker}} moves in Nifty 50 or Sensex, whichever is hit first, measured from the previous day's close; the exchanges recompute the rupee levels every morning. The mechanism comes from SEBI's [circular CIR/MRD/DP/25/2013](https://www.sebi.gov.in/sebi_data/attachdocs/1378198702862.pdf) and NSE publishes the [current halt table](https://www.nseindia.com/products-services/equity-market-circuit-breakers).

### Halts depend on when the trip happens

- **Ten per cent** — before 13:00: a 45-minute halt; between 13:00 and 14:30: a 15-minute halt; at or after 14:30: no halt, trading continues.
- **Fifteen per cent** — before 13:00: a halt of one hour and forty-five minutes; between 13:00 and 14:00: a 45-minute halt; at or after 14:00: closed for the rest of the day.
- **Twenty per cent** — closed for the rest of the day, whenever it happens.

Trading resumes with a 15-minute pre-open auction in every case, so the practical gap is the halt plus fifteen minutes.

:::example
Nifty 50 closed at 23,000. Tomorrow's first trip levels are 20,700 on the way down and 25,300 on the way up. If the index trades through 20,700 at 12:30, the market takes its 45-minute halt, runs a pre-open auction for fifteen minutes, and reopens at about 13:30 — with every stop-loss order you had resting in the book cancelled or triggered into a very different market. Position sizes that assume you can always get out assume no halt.
:::

## Price bands: stocks have them, F&O stocks mostly do not

A stock **without** derivatives has a fixed daily price band around the previous close; it cannot trade outside the band that day, and the exchange moves a stock between band categories as its volatility changes. The exact band for each stock is on NSE's [Price Bands](https://www.nseindia.com/products-services/equity-market-price-bands) page and in your terminal's scrip information.

A stock **with** derivatives, and every futures and options contract, has no fixed band. Instead the exchange runs a dynamic band: when the last trade reaches roughly ten per cent of the base price, the band is widened in steps — five per cent twice, three per cent twice, then two per cent at a time — after a short cooling period, as NSE's [F&O Consolidated Circular](https://nsearchives.nseindia.com/content/circulars/FAOP73928.zip) describes. Such a stock can therefore fall far more than a banded stock in one session; the only hard stop is the market-wide breaker above. During the closing auction window, futures bands align to the auction's {{fact:mkt-cas-band}} band around the reference price.

## ASM and GSM: surveillance that changes the rules for one stock

The exchanges run two sets of graded measures on individual stocks. Both are announced by circular, usually the evening before they apply, and both are listed on NSE's and BSE's surveillance pages.

### Additional Surveillance Measure (ASM)

ASM targets stocks whose price or volume behaviour is unusual against the market: NSE's [ASM FAQ](https://nsearchives.nseindia.com//web/mediaattachment/2026-08/FAQs_-_Additional_Surveillance_Measure_ASM_20260812103311.pdf) lists the criteria — high-low and close-to-close variation against a beta-adjusted index move, the share of volume from the top twenty-five clients, delivery percentage, number of unique PANs, price-earnings ratio and market capitalisation.

- **Long-term ASM** has four stages. Stage I asks for margin equal to the full trade value from the third day after shortlisting — which ends MIS leverage in that stock. Later stages cut the price band to five per cent and, for an F&O stock, shrink the market-wide position limit to three-quarters and then half. A stock placed straight into Stage IV stays at least ninety calendar days.
- **Short-term ASM** has two stages — margin of half the trade value, then the full value — with a minimum stay of five or fifteen trading days and an exit when the criteria stop being met.

### Graded Surveillance Measure (GSM)

GSM is for stocks whose price looks disconnected from any fundamentals (tiny companies, no earnings, no net worth to speak of). NSE's [GSM page](https://www.nseindia.com/regulations/graded-surveillance-measure) gives the stage table: Stage I is full-value margin with a five per cent band; Stage II moves the stock to trade-for-trade settlement with the same band and takes an additional surveillance deposit of half the trade value from buyers; Stages III and IV allow trading only once a week with a deposit equal to the full value, and Stage IV blocks any upward price move. The list is reviewed every quarter; the next review circular is due {{date:2026-12-04}}.

:::rule
Trade-for-trade (T2T) means every buy must be taken as delivery and every sell must come from holdings — there is no intraday netting, so no MIS, no cover orders, no squaring off. If a stock on your scanner is in GSM Stage II or above, or in a T2T series for any other reason, it is not an intraday instrument.
:::

## The F&O ban: when a stock's derivatives freeze

Every stock in F&O has a market-wide position limit (MWPL): the maximum open interest the whole market may hold in its derivatives. Since {{date:2025-10-01}} the limit is {{fact:fo-mwpl-formula}}, and open interest is counted as **FutEq** — net, delta-adjusted futures-equivalent exposure aggregated across clients — under SEBI's [circular of {{date:2025-05-29}}](https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748521484014.pdf).

When the market's combined FutEq open interest in a stock crosses {{fact:fo-mwpl-ban-threshold}} of its MWPL at the end of a day, the stock enters the **ban period** from the next session. NSE Clearing's [position-limits page](https://www.nseclearing.in/risk-management/equity-derivatives/position-limits) carries the live list and the rule: during the ban, trades in that stock's derivatives are allowed only to **reduce** your FutEq exposure by the end of the day; flipping from long to short does not count as a reduction, and a rise in exposure caused purely by price movement is ignored. The ban lifts once open interest is back at or below 80 per cent of the limit. The trading system warns members at ten-minute intervals once a stock crosses 60 per cent, and the exchanges have monitored utilisation intraday since {{date:2025-11-03}}.

:::example
A stock's MWPL is 1,00,00,000 shares. It enters the ban when the market's combined FutEq open interest exceeds 95,00,000 shares at the close, and comes out when open interest has fallen to 80,00,000 or fewer. While it is in the ban you can close a futures position or buy back a short option, but you cannot open a fresh long or add to one — the order is rejected. A stock in the ban is also a stock whose cash price is moving on a crowded, one-sided derivatives book, which is worth knowing even if you never touch its options.
:::

Stock derivatives also settle physically: every stock future or option open at expiry results in {{fact:fo-stock-fo-settlement}}. An intraday trader rarely meets that rule, but a position held into the last session does, and [Index derivatives contract specs](../index-derivatives-specs/) explains the margin consequences.

## What to check before the open

- Is the stock in ASM or GSM, and at which stage? A full-margin stage removes intraday leverage; a T2T stage removes intraday trading.
- Is the stock in the F&O ban? If so, its options and futures take closing trades only.
- Does the stock have derivatives? If not, note its daily band; if so, remember it has none.
- Where are today's market-wide trip levels? A thin market near one of them behaves differently from a thin market far from them.

The exchanges publish all four lists every trading day on their surveillance pages; [Stock scanners and where the data lives](../scanners-and-where-data-lives/) covers where to pull them and how to use them as exclusions.
