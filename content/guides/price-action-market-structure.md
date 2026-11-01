---
title: Price action and market structure
section: Technical analysis
summary: Swing highs and lows, higher highs and higher lows, breaks of structure, support and resistance as zones, liquidity sweeps — and what the published record says about chart patterns and simple rules once costs are counted. Worked on a Nifty 5-minute chart with one lot of {{fact:fo-nifty-lot}} units.
updated: 2026-11-01
level: beginner
order: 1
topics: [price action, market structure, higher highs, break of structure, support and resistance, liquidity sweep, dow theory, chart patterns]
related: [vwap-and-anchored-vwap, opening-range-and-gaps, candles-order-flow-depth, index-derivatives-specs]
tools: [position-size]
sources:
  - Zerodha Varsity — Technical Analysis, The Dow Theory (Part 1) | https://zerodha.com/varsity/chapter/dow-theory-part-1/ | accessed 2026-11-01
  - Zerodha Varsity — Technical Analysis, Support and Resistance | https://zerodha.com/varsity/chapter/support-resistance/ | accessed 2026-11-01
  - Brock, Lakonishok and LeBaron — Simple Technical Trading Rules and the Stochastic Properties of Stock Returns, Journal of Finance 47(5), 1992 | https://doi.org/10.1111/j.1540-6261.1992.tb04681.x | accessed 2026-11-01
  - Mitra — How rewarding is technical analysis in the Indian stock market? Quantitative Finance 11(2), 2011 (IDEAS record) | https://ideas.repec.org/a/taf/quantf/v11y2011i2p287-297.html | accessed 2026-11-01
  - Park and Irwin — What Do We Know About the Profitability of Technical Analysis? Journal of Economic Surveys 21(4), 2007 | https://doi.org/10.1111/j.1467-6419.2007.00519.x | accessed 2026-11-01
  - Lo, Mamaysky and Wang — Foundations of Technical Analysis, NBER Working Paper 7613, 2000 | https://doi.org/10.3386/w7613 | accessed 2026-11-01
  - Open Interest Repositioning around Intraday Price-structure Breaks — Evidence from Nifty 50 Index Options, SSRN working paper, 2026 | https://doi.org/10.2139/ssrn.7394780 | accessed 2026-11-01
  - Wiley — Trading Price Action Trends (Al Brooks, 2011) | https://www.wiley.com/en-us/Trading+Price+Action+Trends%3A+Technical+Analysis+of+Price+Charts+Bar+by+Bar+for+the+Serious+Trader-p-9781118066515 | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
---
## Swings, structure and the two kinds of trend

Price action is the discipline of reading a chart with nothing on it but price and, usually, volume. Its vocabulary starts with swings. A **swing high** is a bar whose high is higher than the highs of the bars on either side of it; a **swing low** is the mirror image. Join the swings and a chart that looked like noise resolves into a sequence of pushes and pullbacks.

{{label:MECHANISM}} The trend definitions come from Dow Theory, which Indian retail traders usually meet through Zerodha Varsity's [Dow Theory chapter](https://zerodha.com/varsity/chapter/dow-theory-part-1/). An **uptrend** is a series of higher highs (HH) and higher lows (HL): every pullback stops above the previous low and every push clears the previous high. A **downtrend** is lower highs (LH) and lower lows (LL). Anything else is a **range**: price oscillates between a ceiling and a floor without making progress in either direction. These are definitions, not forecasts. They tell you what price has been doing; the trade is a bet that it keeps doing it a little longer.

### Which swings count

The same chart contains swings of every size. A 5-minute Nifty chart has ten or more swings an hour; a daily chart has a few a month. Decide the timeframe you trade on first, then mark only the swings that stand out on that timeframe. A common filter is to require a pullback of at least a fixed fraction of the recent average range before a new swing is recognised, so that a two-bar wobble does not count. [Multi-timeframe analysis](../multi-timeframe-relative-strength/) covers how the swings on a higher timeframe frame the ones you trade.

## Break of structure and change of character

A **break of structure (BoS)** is a close beyond the most recent swing in the direction of the trend — a new higher high in an uptrend. A **change of character (CHoCH)** is a close beyond the most recent swing against the trend — the first lower low after a run of higher lows. Traders use the first as a continuation signal and the second as the earliest warning that the trend may be ending.

{{label:EVIDENCE}} These terms long had no agreed definition; they now have at least one that can be tested. A [working paper of 2026](https://doi.org/10.2139/ssrn.7394780) defines intraday break-of-structure and change-of-character events on Nifty 50 index-options data with a swing detector that uses two reversal thresholds, and studies how open interest moves around them. Its findings are sobering for anyone hoping to front-run the crowd: over a year of data, open interest repositioned in the direction of the break, but it built both before and after the break was confirmed — a reactive pattern, not an anticipatory one — and a signal locked in real time did not hold up in an out-of-sample window from January to April 2026. It is a working paper, not peer-reviewed, and it studies Indian index options, so it is one of the few India-specific pieces of evidence in this section.

The practical lesson survives the caveats: a structure break is a description of what just happened. Whether it continues is a separate question, and the answer is usually decided by what the next pullback does.

## Support and resistance are zones

{{label:MECHANISM}} Support is a price area where earlier selling ran out and buying took over; resistance is the reverse. Varsity's [support and resistance chapter](https://zerodha.com/varsity/chapter/support-resistance/) teaches the standard construction: look for areas the price has reversed from at least two or three times, on the timeframe you trade, and draw the area rather than a single line. The repeated touches matter because one reversal is an accident and three are a pattern of behaviour.

### How wide a zone should be

A line invites false precision. Price does not stop at 25,000 because 25,000 is special; it stops in the neighbourhood of 25,000 because a cluster of orders sits there. A workable rule is to make the zone as wide as the average candle on your timeframe — roughly one average true range, which [Indicators and why they lag](../indicators-and-why-they-lag/) explains — and to treat a close beyond the zone, not a wick into it, as the break. Zones built from daily swings carry more weight than zones from 5-minute swings, because more participants saw them.

## Liquidity sweeps

The newest word in the price-action vocabulary is the oldest idea in the market. Stop-loss orders cluster just beyond obvious levels — a few points under a well-known swing low, a few points over the day's high. A **liquidity sweep** (or stop run) is a fast move through such a level that triggers those stops and then reverses, leaving a long wick and a trapped crowd.

{{label:LORE}} No public study with Indian or US data tests the sweep as a trading signal; a search of the academic record on {{date:2026-11-01}} found none. The nearest published material is Al Brooks' bar-by-bar treatment of breakouts and failed breakouts in [Trading Price Action Trends](https://www.wiley.com/en-us/Trading+Price+Action+Trends%3A+Technical+Analysis+of+Price+Charts+Bar+by+Bar+for+the+Serious+Trader-p-9781118066515), which describes the failed breakout as a setup without measuring its hit rate. Treat sweeps as a plausible story about where stops sit, not as an edge with a number attached.

## What the academic record actually says

Technical analysis has been tested more thoroughly than most traders assume. Four results frame everything on this page.

{{label:EVIDENCE}} **Chart patterns carry information, in a narrow statistical sense.** Lo, Mamaysky and Wang's [Foundations of Technical Analysis](https://doi.org/10.3386/w7613) (2000) formalised pattern recognition with kernel regression and tested whether patterns such as head-and-shoulders change the distribution of subsequent returns. It is the reference paper on the question; this page cites it for the method and claims no figures from it.

{{label:EVIDENCE}} **Simple rules worked on US data before costs.** Brock, Lakonishok and LeBaron (1992) tested moving-average and trading-range-break rules on the Dow Jones index over 1897–1986 and found that buy signals earned higher and less volatile returns than sell signals, in a way that random-walk and GARCH-type models could not reproduce ([Journal of Finance](https://doi.org/10.1111/j.1540-6261.1992.tb04681.x)). The study is pre-cost and the data are old.

{{label:EVIDENCE}} **The survey view is mixed.** Park and Irwin's [2007 survey](https://doi.org/10.1111/j.1467-6419.2007.00519.x) found that early studies saw profits in currencies and futures but not in stocks, and that of 95 modern studies, 56 reported positive results and twenty negative, with the rest mixed. The authors stress data-snooping (test enough rules and some will look good by chance) and transaction costs as the two reasons to discount the positives.

{{label:EVIDENCE}} **In India, costs eat the signal.** Mitra (2011) ran moving-average rules on four Indian index series and found that they captured the direction of moves and produced positive returns both long and short — but that realistic costs (the bid-ask spread and brokerage) stopped a trader from keeping them, and that short moving averages traded far too often ([Quantitative Finance](https://ideas.repec.org/a/taf/quantf/v11y2011i2p287-297.html)). For an Indian intraday trader this is the single most relevant finding on the page: the edge, where it exists, is smaller than the cost of trading it unless trade frequency is controlled. [What a trade costs](../what-a-trade-costs/) puts rupee figures on that.

## Worked example: a structure trade on Nifty

:::example
On a Nifty 5-minute chart the index makes a swing low at 25,180, pushes to a higher high at 25,260, and pulls back to a higher low at 25,210. The structure is bullish: HL above the prior low, HH above the prior high. A break of structure is a 5-minute close above 25,260.

The structure-based stop sits just under the higher low, at 25,205, which is 55 points below the breakout level. With one Nifty futures lot of {{fact:fo-nifty-lot}} units that is ₹3,575 of risk per lot. A trader whose rule caps the loss on any one trade at ₹6,000 can carry one lot; a second lot would put ₹7,150 at risk and break the rule. The [position-size calculator](../../tools/position-size/) does this arithmetic from capital, risk percentage and stop distance.

With options the same idea applies to the premium: the risk per lot is the premium you would give back if the structure fails, not the notional. The futures example is illustrative; 25,260 is not a level in any live market.
:::

The example shows why structure traders size from the stop rather than from the margin. The stop is where the idea is proved wrong; the lot count follows from the distance to it. [Intraday leverage today](../intraday-leverage-today/) explains why the margin figure is almost always larger than the loss-based size.

## Where structure fits with the other tools

Structure answers "which way and from where". It says nothing about "how far" or "how fast", which is why most price-action traders pair it with one of two reference lines: [VWAP](../vwap-and-anchored-vwap/), which shows the day's average price and is the benchmark institutions are measured against, and the [opening range](../opening-range-and-gaps/), which frames the first and most volatile part of the session. [Candlesticks, order flow and depth](../candles-order-flow-depth/) covers what a single bar and the order book can and cannot add.

:::warning Base rates first
SEBI's latest study found that {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money in FY26, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). Reading structure well changes where you enter and exit; it does not change that base rate by itself. The site's [verified facts register](../../facts/) carries the figures with their sources.
:::

:::evidence What the evidence says
- {{label:MECHANISM}} Higher highs and higher lows, breaks of structure and support/resistance zones are definitions of past price behaviour, taught consistently across Indian retail education.
- {{label:EVIDENCE}} On Nifty index-options data (working paper, 2026), open interest repositioned around structure breaks reactively, and a real-time signal failed out of sample.
- {{label:EVIDENCE}} Simple rules had information before costs on US data (1992); the 2007 survey of 95 studies is mixed and warns of data-snooping; on Indian indices (2011) costs prevented the gains from being kept.
- {{label:LORE}} Liquidity sweeps as a signal: a plausible mechanism, no public test on Indian or US data.
:::
