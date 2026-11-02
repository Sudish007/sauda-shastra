---
title: Multi-timeframe analysis, relative strength and sector rotation
section: Technical analysis
summary: Top-down reading from the daily chart to the entry timeframe, relative strength against Nifty as a return differential or a ratio line, what the momentum evidence actually covers (monthly horizons, US data), how Bank Nifty's {{fact:inv-nifty50-financials-weight}} block links it to Nifty arithmetically, and a recipe for measuring intraday sector rotation yourself — because nobody has published it.
updated: 2026-11-01
level: intermediate
order: 7
topics: [multi-timeframe, top-down, triple screen, relative strength, ratio chart, momentum, industry momentum, sector rotation, sectoral indices, bank nifty]
related: [indicators-and-why-they-lag, price-action-market-structure, volume-and-market-profile, index-derivatives-specs, relative-strength-pairs, trend-day-pyramiding]
sources:
  - Wiley — The New Trading for a Living (Alexander Elder, 2014) | https://www.wiley.com/en-us/The+New+Trading+for+a+Living%3A+Psychology%2C+Discipline%2C+Trading+Tools+and+Systems%2C+Risk+Control%2C+Trade+Management-p-9781118443927 | accessed 2026-11-01
  - Alphatrends — Brian Shannon, Technical Analysis Using Multiple Timeframes (author site) | https://alphatrends.net/ | accessed 2026-11-01
  - Levy — Relative Strength as a Criterion for Investment Selection, Journal of Finance 22(4), 1967 | https://doi.org/10.2307/2326004 | accessed 2026-11-01
  - Jegadeesh and Titman — Returns to Buying Winners and Selling Losers, Journal of Finance 48(1), 1993 | https://doi.org/10.1111/j.1540-6261.1993.tb04702.x | accessed 2026-11-01
  - Moskowitz and Grinblatt — Do Industries Explain Momentum? Journal of Finance 54(4), 1999 | https://doi.org/10.1111/0022-1082.00146 | accessed 2026-11-01
  - NSE Indices — Nifty 50 factsheet (Oct 2026) | https://www.niftyindices.com/Factsheet/ind_nifty50.pdf | accessed 2026-11-01
  - NSE Indices — Nifty Bank factsheet (Oct 2026) | https://www.niftyindices.com/Factsheet/ind_nifty_bank.pdf | accessed 2026-11-01
  - NSE Indices — Sectoral indices | https://www.niftyindices.com/indices/equity/sectoral-indices | accessed 2026-11-01
  - Gao, Han, Li and Zhou — Market intraday momentum, Journal of Financial Economics 129(2), 2018 | https://doi.org/10.1016/j.jfineco.2018.05.009 | accessed 2026-11-01
  - Li, Sakkas and Urquhart — Intraday time-series momentum, Journal of Financial Markets 57, 2022 | https://doi.org/10.1016/j.finmar.2021.100619 | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
---
## Top-down: three screens, three questions

{{label:MECHANISM}} Multi-timeframe analysis is the habit of deciding direction on a slower chart than the one you trade on. The best-known formulation is Alexander Elder's Triple Screen in [The New Trading for a Living](https://www.wiley.com/en-us/The+New+Trading+for+a+Living%3A+Psychology%2C+Discipline%2C+Trading+Tools+and+Systems%2C+Risk+Control%2C+Trade+Management-p-9781118443927): the first screen reads the trend on the higher timeframe, the second looks for a pullback against it with an oscillator on the middle timeframe, and the third times the entry on the lower one. Brian Shannon's [Technical Analysis Using Multiple Timeframes](https://alphatrends.net/) applies the same idea to swing and intraday trading with a daily, 60-minute and 5-minute sequence. Both are cited for the method; neither is a measured edge.

The reason the method persists is arithmetic rather than mystical. A 5-minute chart shows a few hours of context. A move that looks like a breakout on it may be the middle of a daily candle that is about to close as a reversal. The higher timeframe does not predict better; it simply shows where the lower timeframe's swings sit inside larger ones, which [Price action and market structure](../price-action-market-structure/) describes as the first decision in reading a chart.

### A working sequence for an Indian intraday trader

1. **Daily chart, before the open.** Is the index above or below its recent swing low? Is yesterday's close in the top or bottom third of its range? Where are the nearest daily swing high and low? These frame the day.
2. **60-minute chart, at the open.** Which side of the daily range is the market working? Has the 60-minute structure broken in either direction this week?
3. **5-minute chart, for the entry.** Only here do you look for a setup — a structure break, a VWAP reclaim, an opening-range breakout — and only in the direction the two slower charts allow, unless you are deliberately fading.

Nothing in the sequence requires an indicator. [Indicators and why they lag](../indicators-and-why-they-lag/) explains why adding one on each timeframe adds lag on each timeframe.

## Relative strength against Nifty

**Relative strength** (RS) is a stock's or sector's return compared with a benchmark over the same window. It is not the RSI oscillator, which compares a stock with its own past. Two forms are in common use:

- **Return differential.** Stock up 1.2 per cent since the open while Nifty is up 0.3 per cent: RS = +0.9 percentage points.
- **Ratio line.** Divide the stock's price by the Nifty level and plot the result as a chart of its own. A rising ratio line means the stock is outperforming whatever the index is doing; a falling line means it is lagging even if both are rising.

{{label:EVIDENCE}} The published evidence for relative strength is long-horizon. Levy's [1967 paper](https://doi.org/10.2307/2326004) first tested relative strength as a selection rule (cited here for priority, not for figures). Jegadeesh and Titman (1993) showed that buying US stocks that had done well over the previous three to twelve months and selling those that had done badly earned significant positive returns over holding periods of the same length, not explained by systematic risk, with part of the gain reversing over the following two years ([Journal of Finance](https://doi.org/10.1111/j.1540-6261.1993.tb04702.x)). That is momentum at monthly horizons in the US market. {{label:MECHANISM}} Intraday relative strength — the stock that is up when the index is down at 10:30 — borrows the vocabulary but not the evidence; its justification is mechanical: a stock that attracts buyers against an index-level selling wave has a buyer who is not the index.

### Bank Nifty and Nifty: the arithmetic link

The most watched relative-strength pair in India is Bank Nifty against Nifty, and the two are linked by weights before they are linked by sentiment. The [Nifty 50 factsheet](https://www.niftyindices.com/Factsheet/ind_nifty50.pdf) dated {{date:2026-10-30}} puts the Financial Services sector at {{fact:inv-nifty50-financials-weight}} of the index; HDFC Bank and ICICI Bank are the two largest constituents of both indices on the [Nifty Bank factsheet](https://www.niftyindices.com/Factsheet/ind_nifty_bank.pdf) of the same date. Bank Nifty is a rough proxy for that financial-services block — the block also holds non-bank lenders and insurers — so Bank Nifty's move explains a predictable share of Nifty's.

:::example
At 10:30 Bank Nifty is up 0.8 per cent and Nifty is up 0.3 per cent. With financial services at about {{fact:inv-nifty50-financials-weight}} of Nifty, the banks' move contributes roughly 0.8 × 0.37 ≈ 0.30 percentage points to the index. Nifty is up 0.30 per cent. The rest of the index — IT, energy, autos, consumer names — is therefore flat on net. The Bank Nifty ÷ Nifty ratio line is rising; "Nifty is strong" would be the wrong reading, because the strength is in one sector. Illustrative figures.
:::

The same factsheet carries the index's valuation — a price-to-earnings ratio of {{fact:inv-nifty50-pe}}, price-to-book of {{fact:inv-nifty50-pb}} and a dividend yield of {{fact:inv-nifty50-dy}} on that date — which is context for an investor, not a signal for a day trader. [Index derivatives contract specs](../index-derivatives-specs/) covers the lot sizes and expiries of the two indices' contracts.

## Sector rotation: the evidence and the lore

{{label:EVIDENCE}} At monthly horizons, sector momentum is real and large in the US record. Moskowitz and Grinblatt (1999) found that buying industries that had done well and selling those that had done badly was highly profitable and accounted for much of the individual-stock momentum effect ([Journal of Finance](https://doi.org/10.1111/0022-1082.00146)). That is the published basis for "money rotates between sectors".

{{label:LORE}} Intraday sector rotation — banks leading in the first hour, IT taking over after lunch, metals moving on a China headline — is a different claim, and no study of it was located for India or any other market. Practitioners describe it constantly; nobody has measured it in public. The honest position is to treat it as lore and measure it yourself.

### A measurement recipe

NSE Indices publishes a family of [sectoral indices](https://www.niftyindices.com/indices/equity/sectoral-indices) — Bank, Private Bank, PSU Bank, Financial Services, IT, FMCG, Metal, Pharma, Healthcare, Auto, Energy, Oil & Gas, Realty, Media, Consumer Durables, Infrastructure and others — each a free, live benchmark for its sector.

1. Pick four fixed clock times through the session — for example 09:45, 10:30, 12:00 and 14:00.
2. At each time, record every sectoral index's change since the open minus Nifty's change since the open: a table of relative-strength differentials.
3. Rank the sectors at each time, and log whether the morning's leader was still leading at the later checkpoints.
4. After sixty sessions, you have a dated, reproducible answer to "does intraday leadership persist?" for the market you trade — which is more than any published source currently offers.

## The nearest intraday evidence

{{label:EVIDENCE}} What has been measured is intraday momentum at the index level. Gao, Han, Li and Zhou (2018) found that the first half-hour's return on the S&P 500 ETF predicted the last half-hour's, 1993 to 2013, more strongly on volatile and high-volume days ([Journal of Financial Economics](https://doi.org/10.1016/j.jfineco.2018.05.009)); Li, Sakkas and Urquhart (2022) found intraday time-series momentum present in most of sixteen developed markets, stronger when liquidity is low and volatility high, with India not in the sample ([Journal of Financial Markets](https://doi.org/10.1016/j.finmar.2021.100619)). [Volume profile and Market Profile](../volume-and-market-profile/) connects these findings to the trend-day vocabulary.

For a relative-strength trader the implication is narrow but useful: an index or sector that leads strongly in the first hour has, in US and developed-market data, a measurable tendency to extend late in the day. Whether the same holds on Nifty is something the recipe above will tell you and the literature currently will not.

## Putting it together

A top-down, relative-strength day looks like this. The daily chart says the index is in an uptrend and yesterday closed strong. At the open the 60-minute chart confirms the structure is intact. By mid-morning the sector table shows banks leading and Bank Nifty's ratio line rising. The 5-minute chart of a leading private bank then offers a pullback to [VWAP](../vwap-and-anchored-vwap/) in the direction of all three slower readings. The setup is the last and least important part; the alignment is the trade. When the readings disagree — a strong stock in a weak sector in a falling index — the method says stand aside, which is its most valuable instruction.

:::warning Base rates first
Of individual traders in equity derivatives, {{fact:sebi-loss-2026-share}} lost money in FY26, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). Alignment across timeframes reduces how often you trade; it is not evidence that the trades you keep are profitable. Figures and sources are in the [verified facts register](../../facts/).
:::

:::evidence What the evidence says
- {{label:MECHANISM}} Top-down analysis (Elder's Triple Screen, Shannon's daily–60-minute–5-minute sequence) is a method for framing lower-timeframe swings, not a measured edge.
- {{label:EVIDENCE}} Momentum is documented at monthly horizons in US stocks (1993) and US industries (1999); the intraday version is unmeasured.
- {{label:EVIDENCE}} Bank Nifty's link to Nifty is arithmetic: the financial-services weight on the dated factsheet.
- {{label:LORE}} Intraday sector rotation: described by practitioners, measured by nobody in public.
- {{label:EVIDENCE}} Intraday index momentum — early strength extending into the close — is documented on US ETFs and in most of sixteen developed markets; India was not in the samples.
:::
