---
title: CPR and camarilla pivots
section: Technical analysis
summary: The Central Pivot Range and camarilla levels computed by hand from one day's high, low and close, how to measure a "narrow" CPR on your own data instead of trusting a rule of thumb, why the trend-day claim is lore that the volatility record argues against, and how traders use the levels as zones.
updated: 2026-11-01
level: intermediate
order: 4
topics: [cpr, central pivot range, camarilla, pivot points, narrow range, trend day, volatility clustering, support and resistance]
related: [price-action-market-structure, opening-range-and-gaps, vwap-and-anchored-vwap, indicators-and-why-they-lag]
sources:
  - Zerodha Varsity — Technical Analysis, The Central Pivot Range | https://zerodha.com/varsity/chapter/the-central-pivot-range/ | accessed 2026-11-01
  - TradingView Help Center — Pivot Points Standard (Camarilla formulas) | https://www.tradingview.com/support/solutions/43000521824-pivot-points-standard/ | accessed 2026-11-01
  - PivotBoss — Frank Ochoa, Secrets of a Pivot Boss (author site) | https://pivotboss.com/ | accessed 2026-11-01
  - Cont — Empirical properties of asset returns, stylized facts and statistical issues, Quantitative Finance 1(2), 2001 | https://doi.org/10.1080/713665670 | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
---
## What a pivot is

A pivot level is a price computed from yesterday's bar and drawn on today's chart before the open. Its appeal is that it is objective: every trader who uses the same formula sees the same line, and a line many people watch is a line where orders cluster. That is the whole mechanism, and it is worth stating plainly before the arithmetic, because none of the formulas below contains any information about today that yesterday's high, low and close did not already carry. {{label:MECHANISM}}

## The Central Pivot Range

The CPR is three lines built from the previous session's high (H), low (L) and close (C). Varsity's [chapter on the Central Pivot Range](https://zerodha.com/varsity/chapter/the-central-pivot-range/) gives the formulas as Kite's charts implement them; the method is popularised by Frank Ochoa's book *Secrets of a Pivot Boss*, listed on the [author's site](https://pivotboss.com/) (the site also sells rooms and courses; this guide cites the book only).

- Pivot = (H + L + C)/3
- Bottom central (BC) = (H + L)/2
- Top central (TC) = (Pivot − BC) + Pivot, which is the same as 2 × Pivot − BC

:::example
Yesterday Nifty made a high of 25,320, a low of 25,080 and closed at 25,250.

- Pivot = (25,320 + 25,080 + 25,250)/3 = 75,650/3 = **25,216.67**
- BC = (25,320 + 25,080)/2 = 50,400/2 = **25,200.00**
- TC = 2 × 25,216.67 − 25,200.00 = **25,233.33**

The range between TC and BC is 33.33 points, which is 0.13 per cent of the close. The three lines sit below yesterday's close, because the close was in the upper part of yesterday's range. All figures are illustrative.
:::

### What "narrow" means, and how to measure it

The CPR's width is the number everyone argues about. The practitioner rule says a narrow CPR foreshadows a trend day and a wide one a range day. Before using that rule, measure what narrow means for the instrument you trade:

1. Compute the width (TC − BC) as a percentage of the close for every session in your data — a spreadsheet of daily highs, lows and closes is enough.
2. Take the rolling 20-day median of that percentage.
3. Call today's CPR narrow when its width is below, say, half the median, and wide when it is above twice the median. The thresholds are yours to set; the point is that they come from the data rather than from a chat group.
4. Then record what the day's range actually did after each narrow reading. You now have your own hit rate, dated and reproducible, which is more than any published source offers.

{{label:LORE}} "Narrow CPR predicts a trend day" has no located study behind it, Indian or otherwise. {{label:EVIDENCE}} The one piece of published evidence that bears on it points the other way. Volatility clustering — the tendency of large price changes to be followed by large changes and small by small — is one of the most robust stylised facts in finance, documented across markets and decades in Cont's [survey of 2001](https://doi.org/10.1080/713665670). A quiet day, which is what a narrow CPR records, is on average followed by another quiet day, not by an expansion. A trend day after a narrow CPR is certainly possible; the base rate argues against expecting one.

## Camarilla pivots

Camarilla levels use the previous session's range and close with a fixed multiplier. TradingView's [Pivot Points Standard](https://www.tradingview.com/support/solutions/43000521824-pivot-points-standard/) documentation gives the formulas: the first levels are R1 = C + 1.1 × (H − L)/12 and S1 = C − 1.1 × (H − L)/12, and the higher levels replace the divisor twelve with six, four and two for R2/S2, R3/S3 and R4/S4; the Camarilla and Traditional types also compute an R5 and S5. {{label:MECHANISM}}

:::example
With the same bar — high 25,320, low 25,080, close 25,250 — the range is 240 points and 1.1 × 240 = 264.

| Level | Formula | Value |
|---|---|---|
| R4 | C + 264/2 | 25,382 |
| R3 | C + 264/4 | 25,316 |
| R2 | C + 264/6 | 25,294 |
| R1 | C + 264/12 | 25,272 |
| S1 | C − 264/12 | 25,228 |
| S2 | C − 264/6 | 25,206 |
| S3 | C − 264/4 | 25,184 |
| S4 | C − 264/2 | 25,118 |

Illustrative levels on an illustrative bar.
:::

### How traders use the layers

{{label:MECHANISM}} The usual reading treats R3 and S3 as the expected extremes of a normal day — the levels to fade toward the centre when the day lacks a driver — and R4 and S4 as breakout levels, beyond which the day is accepted as a trend day and traded in the direction of the break. The narrower R1/S1 and R2/S2 pair marks the zone where a quiet day's business is done. None of these readings has a published test; they are conventions about where a shared set of lines sits, and they work in so far as other participants are watching the same lines.

## Using the levels as zones, not lines

A pivot computed to two decimals invites false precision. Three habits keep the tool honest:

- **Width.** Treat each level as a zone roughly as wide as an average candle on your timeframe, and require a close beyond the zone before calling it broken. [Price action and market structure](../price-action-market-structure/) explains why zones beat lines.
- **Confluence.** A camarilla level that coincides with yesterday's high, the [opening range](../opening-range-and-gaps/) boundary or [VWAP](../vwap-and-anchored-vwap/) is watched by more people than one that stands alone. Confluence is a count of watchers, not a guarantee.
- **The stop still comes first.** Levels say where; they do not say how big. The distance from entry to the invalidation level, in points and then in rupees per lot, decides the size — [Indicators and why they lag](../indicators-and-why-they-lag/) shows how to express that distance in units of the average true range.

Pivots are at their most useful on days with no scheduled event, when the market has nothing new to price and participants fall back on reference levels. On a policy day or a results morning the levels are overrun by information, and the first question is the news, not the line.

:::warning Base rates first
Of individual traders in equity derivatives, {{fact:sebi-loss-2026-share}} lost money in FY26, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). Pivots give every trader the same lines; they give nobody an edge by themselves. The [verified facts register](../../facts/) carries the figures and their sources.
:::

:::evidence What the evidence says
- {{label:MECHANISM}} The CPR and camarilla formulas are arithmetic on yesterday's bar; their value lies in being widely watched.
- {{label:LORE}} A narrow CPR foretells a trend day: no located study.
- {{label:EVIDENCE}} Volatility clustering (Cont, 2001) means quiet days are more often followed by quiet days — the opposite of the narrow-range rule's premise.
- {{label:MECHANISM}} R3/S3 as range extremes and R4/S4 as breakout levels are conventions without a published test.
:::
