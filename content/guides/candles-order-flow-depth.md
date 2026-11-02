---
title: Candlesticks, order flow and market depth
section: Technical analysis
summary: What a candlestick pattern encodes and what the published hit rates (US, Taiwan, one Indian study) actually measured, then the order book — NSE's data tiers, the {{fact:mkt-depth-levels-free}} and {{fact:mkt-depth-levels-l3}} levels of depth your platform shows, what the book cannot show, and how to read depth for liquidity rather than for prediction.
updated: 2026-11-01
level: intermediate
order: 8
topics: [candlestick patterns, hit rates, bulkowski, order book, market depth, level 2, level 3, tick by tick, iceberg orders, liquidity, slippage, freeze quantity]
related: [price-action-market-structure, indicators-and-why-they-lag, order-types-and-products, index-derivatives-specs, liquidity-slippage-and-sebi-measures, reading-the-option-chain]
sources:
  - Zerodha Varsity — Technical Analysis, Single candlestick patterns (Part 1) and following chapters | https://zerodha.com/varsity/chapter/single-candlestick-patterns-part-1/ | accessed 2026-11-01
  - Marshall, Young and Rose — Market Timing with Candlestick Technical Analysis, SSRN 980583 (Journal of Banking and Finance, 2006) | https://doi.org/10.2139/ssrn.980583 | accessed 2026-11-01
  - Lu, Shiu and Liu — Profitable candlestick trading strategies, the evidence from a new perspective, Review of Financial Economics 21(2), 2012 | https://doi.org/10.1016/j.rfe.2012.02.001 | accessed 2026-11-01
  - Seth and Singh — Evaluating Profitability of Shooting Star Candlestick Pattern in Indian Stock Market, IJRTE 8(2), 2019 | https://www.ijrte.org/wp-content/uploads/papers/v8i2/B3483078219.pdf | accessed 2026-11-01
  - ThePatternSite.com — Top 10 Reversal Candlesticks (Thomas Bulkowski) | https://thepatternsite.com/CandleReverse.html | accessed 2026-11-01
  - Wiley — Encyclopedia of Candlestick Charts (Thomas Bulkowski, 2008) | https://www.wiley.com/en-us/Encyclopedia+of+Candlestick+Charts-p-9780470182017 | accessed 2026-11-01
  - NSE — Paid real-time data (data levels) | https://www.nseindia.com/static/market-data/real-time-data-subscription | accessed 2026-11-01
  - Zerodha Z-Connect — Introducing extended (level 3) market depth on Kite (broker example) | https://zerodha.com/z-connect/kite/introducing-20-depth-or-level-3-data-beta-on-kite | accessed 2026-11-01
  - SEBI circular (Oct 2026) — Review of the Closing Auction Session, market timings and settlement methodology for derivatives, paras 4.5 and 4.8 | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
---
## What a candlestick encodes

A candlestick compresses one period's trading into four prices — open, high, low, close — and draws the body between open and close with wicks to the extremes. A pattern is a short sequence of such bars read as a story about who won the period. {{label:MECHANISM}} Zerodha Varsity's [candlestick chapters](https://zerodha.com/varsity/chapter/single-candlestick-patterns-part-1/) teach the standard set with Indian chart examples; the table gives the vocabulary.

| Pattern | Bars | What the bars show |
|---|---|---|
| Marubozu | one | A full-bodied bar with little or no wick: one side controlled the whole period |
| Doji | one | Open and close almost equal: a stand-off |
| Hammer / hanging man | one | A small body with a long lower wick after a fall (hammer) or a rise (hanging man): a rejection of lower prices |
| Engulfing | two | The second body covers the first in the opposite direction: a change of control |
| Harami | two | A small body inside the previous large one: a pause |
| Morning / evening star | three | A strong bar, a small indecisive bar, then a strong bar the other way: a turn in three acts |

Each description is a reading of what already happened. Whether the reading predicts the next bar is the question the next section answers with data.

## The honest note on hit rates

Candlestick patterns are the most tested part of technical analysis, and the results are mixed in a specific way: they depend on the market, the period and how "success" is defined.

{{label:EVIDENCE}} **Reversal rates are not win rates.** Thomas Bulkowski's [ranking of reversal candlesticks](https://thepatternsite.com/CandleReverse.html), from his own database of US stocks, lists how often price reversed after each pattern: three stars in the south 86 per cent, bearish three-line strike 84 per cent, three white soldiers 82 per cent, identical three crows and bearish engulfing 79 per cent each, morning star 78 per cent. A "reversal" in his method means price moved the predicted way by his measurement rule, not that a trade taken on the pattern made money after costs — the two are different claims, and his [Encyclopedia of Candlestick Charts](https://www.wiley.com/en-us/Encyclopedia+of+Candlestick+Charts-p-9780470182017) (Wiley, 2008) sets out the methodology behind the figures. US data, named as such.

{{label:EVIDENCE}} **Large US stocks: no.** Marshall, Young and Rose tested candlestick timing strategies on large US stocks and concluded that they were not generally profitable, and that basing decisions on them alone did not seem sensible ([SSRN version of the 2006 Journal of Banking and Finance paper](https://doi.org/10.2139/ssrn.980583)).

{{label:EVIDENCE}} **Taiwan: some.** Lu, Shiu and Liu (2012) tested two-day reversal patterns on the constituents of the Taiwan Top-50 index from late 2002 to the end of 2008 and found three bullish reversal patterns profitable under a buy-on-bullish, hold-until-bearish rule, with the result surviving out-of-sample and bootstrap checks ([Review of Financial Economics](https://doi.org/10.1016/j.rfe.2012.02.001)).

{{label:EVIDENCE}} **India: one small study.** Seth and Singh (2019) tested the shooting-star pattern on Nifty 50 constituent stocks using daily data from 2000 to 2017, with seven trading strategies and bootstrapped, skewness-adjusted t-tests; three strategies were superior over one- and two-day holding periods, and the authors recommend trading smaller shooting stars and closing shorts within two days ([IJRTE](https://www.ijrte.org/wp-content/uploads/papers/v8i2/B3483078219.pdf)). It appears in a lower-tier engineering journal, which is the caveat to carry with it.

The pattern that emerges is not "candles work" or "candles fail" but "the answer is market-specific and definition-specific". An Indian intraday trader has one small daily-data study in their favour and a large-cap US study against; nothing published tests intraday candles on Nifty. {{label:MECHANISM}} The useful residue is the mechanism: a long lower wick really does mean sellers pushed and buyers pushed back within the period. What it does not carry is a probability.

## The order book: NSE's data tiers

Behind every candle is a book of resting orders, and depth is the window onto it.

{{label:EVIDENCE}} NSE sells its real-time data in tiers, described on its [real-time data page](https://www.nseindia.com/static/market-data/real-time-data-subscription): Level-1 is the best bid and offer; Level-2 is depth to the best {{fact:mkt-depth-levels-free}} prices on each side; Level-3 extends that to {{fact:mkt-depth-levels-l3}} prices; and the tick-by-tick feed carries the full order book, across the cash, derivatives and currency segments. The standard depth window on a retail platform is the Level-2 view. As a published broker example, Zerodha's [Kite announcement](https://zerodha.com/z-connect/kite/introducing-20-depth-or-level-3-data-beta-on-kite) describes offering the extended depth for NSE stocks and derivatives alongside the standard view, and notes that exchanges supply the normal feed to members and sell the full tick-by-tick book as a premium product.

### What depth cannot show

{{label:MECHANISM}} A depth window is a snapshot of resting limit orders and nothing else. It cannot show:

- **Market orders**, which never rest — they execute against the book the instant they arrive.
- **Stop-loss orders**, which sit with the exchange or broker as triggers and only become live orders when the trigger price trades.
- **The hidden part of iceberg orders.** An iceberg discloses one slice at a time; the rest is invisible until the slice fills. SEBI's [circular of October 2026](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf) illustrates the point from the other direction: orders placed in the Closing Auction Session must disclose their full quantity, and from {{date:2027-02-08}} any iceberg left unexecuted at the end of continuous trading is carried into the auction as a fully disclosed limit order. During continuous trading, the undisclosed quantity is simply not in the depth you see.
- **Orders that will be cancelled** before price reaches them, which is most large orders placed away from the touch.

{{label:LORE}} "A big bid is support" follows from none of this. A large resting bid is a large resting bid until the moment it is pulled, and the trader who placed it can see your order as easily as you can see theirs. No study measures how often visible size holds; treat the claim as a story.

## Reading depth for liquidity, not direction

What depth does show, reliably, is how much can be traded right now and at what cost. That is a liquidity question, and it is the one worth asking.

:::example
A stock's offer side shows 650 shares at ₹500.05, 950 at ₹500.10, 2,100 at ₹500.15, 1,250 at ₹500.20 and 1,500 at ₹500.25 — 6,450 shares visible across the best {{fact:mkt-depth-levels-free}} prices. The stock trades about 40,000 shares a minute, so the entire visible offer stack is under ten seconds of normal flow.

A market order to buy 1,000 shares (about ₹5,00,000) takes the 650 at ₹500.05 and 350 at ₹500.10 — it walks two levels — for an average of ₹500.07 and ₹17.50 more than the best offer would have cost. Harmless here; the same order into a book showing 80 shares at the touch would walk ten levels. Illustrative numbers.
:::

Three readings follow from the example:

1. **Spread and size at the touch** tell you the cost of immediacy. A wide spread or a thin touch means a limit order, not a market order, is the right tool — [Order types and products](../order-types-and-products/) covers the choice.
2. **Depth against your size** tells you whether you are a price-taker or a price-mover. If your order is larger than the first two or three levels, the depth is a warning, and slicing the order is the answer.
3. **Depth against turnover** tells you how stale the picture is. Visible depth that covers ten seconds of flow describes the next ten seconds, not the next hour.

In index derivatives the exchange adds a hard ceiling of its own: no single order may exceed the freeze quantity, which for Nifty contracts is {{fact:fo-freeze-qty-nifty}} units, so a large order is sliced whether the depth demands it or not. [Index derivatives contract specs](../index-derivatives-specs/) carries the figures for every index.

## Where this leaves order flow

Order-flow trading in its serious form — footprint charts, cumulative delta, reading the full tick-by-tick book — depends on data most retail platforms do not provide and on a continuous market where resting orders can be watched filling. Depth as shown on a retail platform is a liquidity gauge first and a very noisy sentiment gauge second. Combined with [structure](../price-action-market-structure/) for direction and a stop in [ATR units](../indicators-and-why-they-lag/) for size, it earns its place on the screen; on its own it is a picture of five prices that will have changed before you finish reading it.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). A pattern or a bid stack is information about the last few minutes; it does not change that base rate. Every figure on this page is in the [verified facts register](../../facts/) with its source.
:::

:::evidence What the evidence says
- {{label:MECHANISM}} Candlestick patterns describe who controlled a period; the definitions are consistent across Indian retail education.
- {{label:EVIDENCE}} Hit rates are market-specific: Bulkowski's US reversal rates measure reversal, not profit; large US stocks showed no profitable timing (2006); Taiwan showed profitable bullish two-day patterns (2012); one lower-tier Indian study found one- to two-day profits for shooting stars on Nifty constituents (2019).
- {{label:EVIDENCE}} NSE's depth tiers are a product definition: best bid and offer, then five, then twenty price levels, then the full book.
- {{label:MECHANISM}} Depth excludes market orders, stop-loss triggers, hidden iceberg quantity and orders that will be cancelled.
- {{label:LORE}} Large visible bids as support: unmeasured.
:::
