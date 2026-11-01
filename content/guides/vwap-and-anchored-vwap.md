---
title: VWAP and anchored VWAP
section: Technical analysis
summary: The volume-weighted average price by hand, why execution desks are measured against it, session VWAP versus anchored VWAP — and the Indian twist, where the closing price itself is a volume-weighted average and, from {{date:2026-12-07}}, so are the closing auction's reference price and expiry settlements.
updated: 2026-11-01
level: intermediate
order: 2
topics: [vwap, anchored vwap, execution benchmark, closing price, closing auction session, reclaim, reject, confluence]
related: [price-action-market-structure, opening-range-and-gaps, volume-and-market-profile, trading-day-ist]
sources:
  - Berkowitz, Logue and Noser — The Total Cost of Transactions on the NYSE, Journal of Finance 43(1), 1988 | https://doi.org/10.1111/j.1540-6261.1988.tb02591.x | accessed 2026-11-01
  - Madhavan — Volume-Weighted Average Price (VWAP), Encyclopedia of Quantitative Finance (Wiley, 2010) | https://doi.org/10.1002/9780470061602.eqf07036 | accessed 2026-11-01
  - SEBI circular (Jan 2026) — Introduction of Closing Auction Session and modifications in the pre-open session, paras 4.1 and 6.1 | https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf | accessed 2026-11-01
  - SEBI circular (Oct 2026) — Review of the Closing Auction Session, market timings and settlement methodology for derivatives, paras 4.3.1, 4.9.1 and 6.1 | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf | accessed 2026-11-01
  - Alphatrends — Brian Shannon (Anchored VWAP) | https://alphatrends.net/ | accessed 2026-11-01
  - Zerodha Varsity — Technical Analysis, Moving Averages | https://zerodha.com/varsity/chapter/moving-averages/ | accessed 2026-11-01
  - Zerodha Support — Auto square-off timings for open intraday positions (broker example) | https://support.zerodha.com/category/trading-and-markets/trading-faqs/market-sessions/articles/intraday-auto-square-off-timings | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
---
## The formula, by hand

The volume-weighted average price is the average price at which a stock actually changed hands over a window, with each trade counted by its size:

VWAP = Σ(price × volume) ÷ Σ volume

Three prints are enough to see it work.

| Trade | Shares | Price | Price × shares |
|---|---|---|---|
| First | 100 | ₹500.00 | ₹50,000 |
| Second | 200 | ₹502.00 | ₹1,00,400 |
| Third | 100 | ₹498.00 | ₹49,800 |
| Total | 400 | — | ₹2,00,200 |

VWAP = ₹2,00,200 ÷ 400 = **₹500.50**. The simple average of the three prices is ₹500.00; the extra fifty paise comes from the largest trade being the highest-priced one. A charting platform recomputes this on every tick from the first trade of the session, which is why the line is smooth at noon and jumpy at the open.

{{label:MECHANISM}} Note what VWAP is not. It is not a moving average: a 20-period moving average (Varsity's [chapter](https://zerodha.com/varsity/chapter/moving-averages/) explains the family) forgets everything older than twenty bars, whereas session VWAP remembers every trade since the open and so gets steadily harder to move as the day goes on.

## Why institutions care, and why price "respects" it

{{label:EVIDENCE}} VWAP entered finance as a yardstick for execution quality, not as a signal. Berkowitz, Logue and Noser (1988) measured the cost of NYSE trades against the day's volume-weighted average price in a sample of about 14,000 trades and found total costs averaging 23 basis points — 18 in commission and five in market impact ([Journal of Finance](https://doi.org/10.1111/j.1540-6261.1988.tb02591.x)). Madhavan's encyclopedia entry describes VWAP and its time-weighted cousin TWAP as the common benchmarks against which trading and execution are judged ([Wiley, 2010](https://doi.org/10.1002/9780470061602.eqf07036)).

:::example
A dealer buys 300 shares for a fund at an average of ₹501.20 while the day's VWAP is ₹500.50. The desk's report says the execution was ₹0.70 a share, or 0.14 per cent, worse than VWAP: ₹210 on a ₹1,50,360 ticket. Multiply that by a fund's annual turnover and the reason desks care becomes obvious.
:::

That benchmark role is the one solid reason price behaves differently around VWAP. An execution algorithm told to "beat VWAP" buys more when price is below the line and less when it is above; many algorithms doing the same thing create demand under the line and supply over it. It is a mechanism with a clear cause, not a mystery of crowd psychology. {{label:MECHANISM}}

## Session VWAP and anchored VWAP

Session VWAP starts from the first trade of the {{fact:mkt-continuous-session}} continuous session and resets every day. An **anchored VWAP** starts wherever you choose: a gap bar, an earnings day, a swing low, the first bar after a policy announcement. The method is Brian Shannon's, set out in his book *Maximum Trading Gains with Anchored VWAP* and course on [Alphatrends](https://alphatrends.net/). {{label:MECHANISM}}

The logic is the same as session VWAP's: the anchored line is the average price paid by everyone who has traded since the anchor. Anchor it to a gap-up open and the line tells you whether the average buyer since the gap is in profit. Anchor it to a swing low and a price falling below the line means the average participant in the rally is now under water — the kind of information that structure alone, covered in [Price action and market structure](../price-action-market-structure/), does not give.

### Choosing an anchor

Anchors that mean something to many participants — the session open, the day of a results announcement, a Budget or RBI policy day — produce lines many traders watch. Anchors that mean something only to you produce lines only you watch. The [opening range](../opening-range-and-gaps/) guide shows the most common intraday anchor, the first bars of the day.

## India's closing price is a VWAP

Here the Indian market has a mechanical feature traders elsewhere lack.

{{label:EVIDENCE}} For years the official closing price on NSE and BSE was the volume-weighted average of the last half-hour of continuous trading. SEBI's [circular of January 2026](https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf) changed that for stocks with derivatives from {{date:2026-08-03}}: their continuous session is now {{fact:mkt-continuous-session-cas-stocks}} and the closing price comes out of a Closing Auction Session in the {{fact:mkt-closing-session}} window, while every other stock keeps the last-half-hour VWAP close. Even the auction leans on VWAP: its reference price is the volume-weighted average of the last 15 minutes of continuous trading, and auction orders must stay within {{fact:mkt-cas-band}} of it. Index futures and options trade on past the cash close, through their own {{fact:mkt-fo-session}} session.

{{label:EVIDENCE}} The [review circular of October 2026](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf) goes further from {{date:2026-12-07}}. The auction moves to {{fact:opt-cas-window-from-2026-12-07}}, the derivatives session becomes {{fact:mkt-fo-session-from-2026-12-07}}, and the final settlement price of an expiring index contract becomes an index computed from each constituent's VWAP over the last half-hour of continuous trading, with expiring stock derivatives settling on the stock's own last-half-hour VWAP across exchanges. Exchanges will broadcast the indicative values in real time. [The trading day in IST](../trading-day-ist/) lays out both regimes side by side.

The consequence for a VWAP trader is concrete. In the last half-hour of a session — and especially on an expiry day — a large part of the order flow is trying to set, hedge or match a volume-weighted average rather than express a view. VWAP-anchored behaviour in that window has a cause you can point to in a circular. {{label:MECHANISM}}

## Reclaim and reject patterns

Two setups account for most of what intraday traders do with the line.

- **Reclaim.** Price has traded below VWAP, pushes back above it and holds there on a closing basis. The reading: the average participant has moved from loss to profit, and the sellers who leaned on the line have failed.
- **Reject.** Price rallies into VWAP from below and turns down without closing above it. The reading: sellers are defending their average, and buyers who chased above the line are now trapped.

{{label:MECHANISM}} The mechanics above explain why these levels see activity. {{label:LORE}} Whether a reclaim or a reject has a measurable edge on Nifty or on Indian stocks is untested: no public study of these patterns on Indian data was found, and any hit rate quoted for them is a practitioner's claim until someone measures it. The honest way to use them is as a location for a trade whose risk is defined by structure, not as a signal with a known probability.

### EMA and VWAP confluence

{{label:LORE}} A popular refinement says that a level where a 20-period EMA and VWAP meet is stronger than either alone. Moving-average rules have information before costs in several studies, and VWAP is a genuine benchmark, but the combination has never been tested in public. [Indicators and why they lag](../indicators-and-why-they-lag/) explains what the EMA is doing when it "agrees" with VWAP.

## Reading the line through the day

Early in the session VWAP moves with almost every trade; by mid-afternoon it barely moves at all. The practical rules follow from the arithmetic:

1. In the first half-hour, treat VWAP as a rough centre of the day's early range, not as a firm level. The [opening range](../opening-range-and-gaps/) is more useful there.
2. From late morning, a slope in the line — a steady rise or fall — says the day has a direction; a flat line with price crossing it repeatedly says it does not.
3. Into the close, remember who is trading: desks matching a benchmark and, for stocks with derivatives, an auction whose reference price is itself a VWAP. Brokers also start squaring off intraday positions around then — Zerodha's published schedule, for example, begins at {{fact:mkt-squareoff-example-fo}} for derivatives and earlier for stocks in the closing auction ([support page](https://support.zerodha.com/category/trading-and-markets/trading-faqs/market-sessions/articles/intraday-auto-square-off-timings)); read your own broker's.

:::warning Base rates first
Of individual traders in equity derivatives, {{fact:sebi-loss-2026-share}} lost money in FY26, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). A reference line changes where you trade; it does not change what trading costs or how often you are wrong. The [verified facts register](../../facts/) holds every figure on this page with its source and date.
:::

:::evidence What the evidence says
- {{label:EVIDENCE}} VWAP is an execution benchmark (NYSE study, 1988; Madhavan, 2010); desks are measured against it, which is why algorithms trade around it.
- {{label:EVIDENCE}} India's closing price was a last-half-hour VWAP; since {{date:2026-08-03}} stocks with derivatives close by auction with a VWAP reference price, and from {{date:2026-12-07}} expiring derivatives settle on last-half-hour VWAPs (SEBI circulars, Jan and Oct 2026).
- {{label:MECHANISM}} Reclaim and reject patterns describe where benchmark-driven flow sits.
- {{label:LORE}} Any hit rate for reclaims, rejects or EMA/VWAP confluence on Indian data.
:::
