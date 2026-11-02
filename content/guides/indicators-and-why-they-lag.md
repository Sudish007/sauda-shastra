---
title: Indicators and why they lag
section: Technical analysis
summary: Moving averages, RSI, MACD, Bollinger Bands, ATR and Supertrend — what each one computes, why every one of them turns after price does, what the published tests found before and after costs, and how to use ATR to set a stop in points and in rupees per lot of {{fact:fo-nifty-lot}} Nifty units.
updated: 2026-11-01
level: beginner
order: 5
topics: [moving average, ema, rsi, macd, divergence, bollinger bands, squeeze, atr, supertrend, indicator lag, transaction costs]
related: [price-action-market-structure, vwap-and-anchored-vwap, multi-timeframe-relative-strength, what-a-trade-costs, position-sizing-and-loss-limits, scanners-and-where-data-lives]
tools: [position-size]
sources:
  - Zerodha Varsity — Technical Analysis, Moving Averages | https://zerodha.com/varsity/chapter/moving-averages/ | accessed 2026-11-01
  - Zerodha Varsity — Technical Analysis, Indicators (Part 1) | https://zerodha.com/varsity/chapter/indicators-part-1/ | accessed 2026-11-01
  - Chong and Ng — Technical analysis and the London stock exchange, testing the MACD and RSI rules using the FT30, Applied Economics Letters 15(14), 2008 (IDEAS record) | https://ideas.repec.org/a/taf/apeclt/v15y2008i14p1111-1114.html | accessed 2026-11-01
  - Mitra — How rewarding is technical analysis in the Indian stock market? Quantitative Finance 11(2), 2011 (IDEAS record) | https://ideas.repec.org/a/taf/quantf/v11y2011i2p287-297.html | accessed 2026-11-01
  - Park and Irwin — What Do We Know About the Profitability of Technical Analysis? Journal of Economic Surveys 21(4), 2007 | https://doi.org/10.1111/j.1467-6419.2007.00519.x | accessed 2026-11-01
  - BollingerBands.com — Bollinger Band Rules (John Bollinger) | https://www.bollingerbands.com/bollinger-band-rules | accessed 2026-11-01
  - BollingerBands.com — A complete explanation of Bollinger Bands | https://www.bollingerbands.com/bollinger-bands | accessed 2026-11-01
  - StockCharts ChartSchool — Average True Range (ATR) | https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/average-true-range-atr | accessed 2026-11-01
  - TradingView Help Center — Supertrend | https://www.tradingview.com/support/solutions/43000634738-supertrend/ | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
---
## Why every indicator lags

{{label:MECHANISM}} An indicator is a formula applied to past prices. A moving average is the mean of the last n closes; RSI compares average gains with average losses over n bars; ATR averages n true ranges. Whatever n is, the formula cannot know about a turn in price until enough new bars have arrived to outweigh the old ones. The lag is not a flaw to be engineered away — it is the definition. An indicator with no lag would have to use prices that do not exist yet.

The temptation is to shorten n. A 5-period average turns faster than a 50-period one, so it "sees" the turn sooner. It also turns on every wobble, and each turn is a trade. {{label:EVIDENCE}} That trade-off is exactly what Mitra (2011) measured on four Indian index series: moving-average rules captured the direction of moves and showed positive returns long and short, but realistic transaction costs — the bid-ask spread and brokerage — prevented a trader from keeping the gains, and the short averages traded far too often to be worth it ([Quantitative Finance](https://ideas.repec.org/a/taf/quantf/v11y2011i2p287-297.html)). [What a trade costs](../what-a-trade-costs/) shows the rupee figure every one of those extra signals pays.

## Moving averages

Varsity's [chapter on moving averages](https://zerodha.com/varsity/chapter/moving-averages/) covers the two standard forms. The **simple moving average** weights every close in the window equally. The **exponential moving average** weights recent closes more, so it hugs price more closely and turns a little sooner — at the cost of reacting to a little more noise. Both are lagging by construction. {{label:MECHANISM}}

A moving average is best read as a statement about the recent average participant: when price is above a rising 20-period EMA, the average buyer of the last twenty bars is in profit. That is a fact about positioning, not a forecast.

{{label:LORE}} A popular refinement treats the meeting of a 20-period EMA and [VWAP](../vwap-and-anchored-vwap/) as a stronger level than either alone. Moving-average rules have information before costs, and VWAP is a genuine institutional benchmark, but the combination has not been tested anywhere public.

## RSI and MACD

{{label:MECHANISM}} Varsity's [indicators chapter](https://zerodha.com/varsity/chapter/indicators-part-1/) gives the standard definitions as Indian retail traders learn them. **RSI** (Wilder) scales the ratio of average gains to average losses over the lookback — fourteen periods by default — onto a 0–100 range; readings above seventy are called overbought and below thirty oversold. **MACD** (Appel) is the difference between two EMAs, by default 12/26, plotted with a 9-period EMA of itself as the signal line; a crossover of the two is the classic trigger.

{{label:EVIDENCE}} These rules have been tested on long series. Chong and Ng (2008) ran RSI and MACD rules on six decades of the London FT30 index and found that, in most of the cases tested, the rules generated returns above buy-and-hold ([Applied Economics Letters](https://ideas.repec.org/a/taf/apeclt/v15y2008i14p1111-1114.html)). The study is British, pre-cost and about level and crossover rules — the standard ones above.

### Divergence

Divergence is the pattern where price makes a new high but RSI or MACD does not, read as momentum weakening before the turn. {{label:LORE}} It is the most quoted oscillator signal and the least tested: the FT30 result covers level and crossover rules, not divergence, and no peer-reviewed test on Indian data was located. The mechanism is real — the oscillator is measuring a smaller average gain — but "smaller gain" and "reversal" are different claims.

## Bollinger Bands and the squeeze

{{label:MECHANISM}} John Bollinger's own [explanation](https://www.bollingerbands.com/bollinger-bands) and [rules](https://www.bollingerbands.com/bollinger-band-rules) are the primary source, and they contradict much of what is taught about the bands. The defaults are a 20-period moving average with bands two population standard deviations above and below, unchanged for roughly thirty-five years. Standard deviation is the adaptive part — it widens the bands when the market gets noisy — in the same role that ATR plays for Keltner channels and highs and lows play for Donchian channels. His rules state that a tag of a band is not a signal by itself, and that a close outside the bands is initially a continuation signal, not a reversal: it is the basis of volatility-breakout systems, not of fading. BandWidth, the distance between the bands divided by the middle line, exists mainly to identify the Squeeze.

:::example
On a Nifty 5-minute chart the 20-period mean is 25,200 and the standard deviation of the last twenty closes is thirty points. The bands sit at 25,140 and 25,260, and BandWidth = (25,260 − 25,140)/25,200 = 0.48 per cent. A squeeze is a BandWidth reading that is low by the instrument's own history — for example the lowest of the past twenty sessions at the same hour. The computation is the point; the number is illustrative.
:::

{{label:MECHANISM}} The squeeze rule says that a period of unusually narrow bands tends to precede a larger move, with Bollinger's continuation rule telling you to go with the first close outside the bands rather than against it. No Indian test of the rule was located. Remember what [CPR and camarilla pivots](../cpr-and-camarilla-pivots/) says about volatility clustering: quiet periods tend to be followed by quiet periods on average, so the squeeze is a conditional setup, not a scheduled event.

## ATR: the unit for stops and targets

{{label:MECHANISM}} Average True Range, also Wilder's, is the one indicator on this page that does not try to predict anything. StockCharts' [ChartSchool entry](https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/average-true-range-atr) explains the construction: the true range of a bar is the largest of (high − low), (high − previous close) and (previous close − low), so that a gap counts as range even if the bar itself is small; ATR is the average of the last n true ranges, usually fourteen. It measures volatility, not direction, and was designed for commodities and daily bars.

Its intraday use is as a ruler. A stop placed at a fixed number of points is arbitrary; a stop placed at a multiple of ATR scales with what the market is doing that day.

:::example
The 5-minute ATR(14) on Nifty futures reads 28 points. A stop at 1.5 × ATR is 42 points. With one lot of {{fact:fo-nifty-lot}} units that is ₹2,730 of risk per lot. A trader whose rule caps the loss on any trade at ₹6,000 can carry two lots (₹5,460 at risk); a third lot would risk ₹8,190 and break the rule. The [position-size calculator](../../tools/position-size/) takes the stop in points and returns the lot count. The same ATR multiple on a 60-minute chart might be ten times wider — the ruler scales with the timeframe.
:::

The ATR stop is a sizing device, not a prediction of where price will turn. It says how far price can wander on an ordinary day without the trade being wrong, and it keeps the stop outside the noise so that the lot count, not the stop distance, carries the risk decision.

## Supertrend

{{label:MECHANISM}} Supertrend, created by Olivier Seban, is an ATR line dressed as a trend signal. TradingView's [documentation](https://www.tradingview.com/support/solutions/43000634738-supertrend/) gives the construction: take the bar's midpoint, (high + low)/2; build an upper and a lower band at the midpoint plus and minus a multiplier times ATR; plot the lower band while the trend is up and the upper band while it is down; flip when the close crosses the opposite band. The inputs are the ATR length and the multiplier.

Because it is built on ATR, Supertrend inherits ATR's lag and then adds its own: the line can only flip after price has already crossed a band that was itself computed from past ranges. In a trend it keeps you in; in a range it flips repeatedly, and each flip is a round trip at full cost. It is a trailing stop with a marketing name, and it is at its best used as one.

## What the survey of the evidence says

{{label:EVIDENCE}} Park and Irwin's [2007 survey](https://doi.org/10.1111/j.1467-6419.2007.00519.x) of the technical-analysis literature found that early studies saw profits in currencies and futures but not in stocks, and that of 95 modern studies, 56 reported positive results and twenty negative, with the rest mixed. Their two warnings are the ones to carry: data-snooping (test enough indicator settings and some will look good by chance) and transaction costs, which turn many positive gross results negative.

Put together, the record supports a modest use of indicators:

1. **Measure, do not predict.** ATR for the size of the day's moves, a moving-average slope for the state of the trend, BandWidth for whether the market is quiet or loud.
2. **Keep n long enough that the signals are rare.** Costs are per trade; the Indian evidence says frequency is what kills the edge.
3. **Decide the stop first.** Every indicator setting on this page can be tuned to look good on last month's chart. A stop in ATR units and a lot count from the stop cannot be flattered that way.

:::warning Base rates first
Of individual traders in equity derivatives, {{fact:sebi-loss-2026-share}} lost money in FY26, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). No indicator setting changes that base rate; costs and position size do. The [verified facts register](../../facts/) carries every figure on this page with its source.
:::

:::evidence What the evidence says
- {{label:MECHANISM}} Every indicator is a function of past prices and turns after price does; shorter settings trade more often.
- {{label:EVIDENCE}} Moving-average rules on Indian indices had information before costs but not after (Mitra, 2011); RSI and MACD level and crossover rules beat buy-and-hold on six decades of UK data, pre-cost (Chong and Ng, 2008); the 2007 survey of 95 studies is mixed.
- {{label:LORE}} Divergence as a reversal signal, and EMA/VWAP confluence: no public test.
- {{label:MECHANISM}} The Bollinger squeeze, by Bollinger's own rules, is a continuation setup; no Indian test was located.
:::
