---
title: The opening range and gaps
section: Technical analysis
summary: Why the first minutes of the {{fact:mkt-continuous-session}} session are the most volatile of the day in India and the US, how the pre-open auction sets the first print, what the US evidence on opening-range breakouts does and does not transfer, gap-and-go versus gap-fill — and an honest line on Nifty gap statistics, which have no Indian primary source yet.
updated: 2026-11-01
level: intermediate
order: 3
topics: [opening range, orb, gap up, gap down, gap fill, pre-open auction, u-shaped volatility, stocks in play]
related: [price-action-market-structure, vwap-and-anchored-vwap, trading-day-ist, order-types-and-products, overnight-chain-to-india-open, results-season-playbook, scanners-and-where-data-lives, orb-15-min-nifty, gap-fill-fade, premarket-gainer-momentum]
tools: [position-size]
sources:
  - Singh — A Temporal Analysis of Intraday Volatility of Nifty Futures on the National Stock Exchange, SSRN working paper 3272375, 2018 | https://doi.org/10.2139/ssrn.3272375 | accessed 2026-11-01
  - Wood, McInish and Ord — An Investigation of Transactions Data for NYSE Stocks, Journal of Finance 40(3), 1985 | https://doi.org/10.1111/j.1540-6261.1985.tb04996.x | accessed 2026-11-01
  - SEBI circular (Jan 2026) — Introduction of Closing Auction Session and modifications in the pre-open session, paras 5 and 6.2 | https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf | accessed 2026-11-01
  - SEBI circular (May 2025) — Measures for enhancing trading convenience and strengthening risk monitoring in equity derivatives (2025/79), para 5.6 | https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748521484014.pdf | accessed 2026-11-01
  - Zarattini and Aziz — Can Day Trading Really Be Profitable? SSRN working paper 4416622, 2023 | https://doi.org/10.2139/ssrn.4416622 | accessed 2026-11-01
  - Zarattini, Barbon and Aziz — A Profitable Day Trading Strategy for the U.S. Equity Market, SSRN working paper 4729284, 2024 | https://doi.org/10.2139/ssrn.4729284 | accessed 2026-11-01
  - Plastun, Sibande, Gupta and Wohar — Price Gap Anomaly in the US Stock Market, SSRN 3461283 (2019; North American Journal of Economics and Finance, 2020) | https://doi.org/10.2139/ssrn.3461283 | accessed 2026-11-01
  - Caporale and Plastun — Price gaps, another market anomaly? Investment Analysts Journal 46(4), 2017 | https://doi.org/10.1080/10293523.2017.1333563 | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
---
## The first fifteen minutes are the most volatile of the day

Every market with a fixed opening time shows the same shape when volatility is plotted against the clock: a spike at the open, a long trough through the middle of the day and a smaller rise into the close. Traders call it the U-shape.

{{label:EVIDENCE}} For India, a [working paper by Singh (2018)](https://doi.org/10.2139/ssrn.3272375) built the picture from one-minute Nifty 50 futures data from January 2011 to August 2018: volatility was highest at the open and the close, and hourly volatility declined over the period studied. It is a working paper, not peer-reviewed, but it is the Indian evidence for the shape. {{label:EVIDENCE}} For the US, Wood, McInish and Ord (1985) found unusually high returns and standard deviations in the first half-hour and at the close in minute-by-minute NYSE data ([Journal of Finance](https://doi.org/10.1111/j.1540-6261.1985.tb04996.x)) — the classic reference.

The opening range turns that observation into a tool. Define the range as the high and low of the first N minutes after continuous trading starts; the breakout trade waits for price to leave it. The range is doing two jobs at once: it measures the day's early volatility, and it gives the trade a natural stop (the other side of the range) and a natural first target (one range width beyond the break). {{label:MECHANISM}}

## How the day actually opens

The first print is not a random event. SEBI's [circular of January 2026](https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf) redesigned the cash-market pre-open with effect from {{date:2026-09-07}}: orders are collected in the {{fact:mkt-preopen-window}} window, which closes at a random moment between 09:08 and 09:10 so that nobody can time the last order; only limit orders are accepted after 09:05; iceberg and stop-loss orders are not allowed at all; matching follows and the market transitions into the {{fact:mkt-continuous-session}} continuous session. The pre-open finds the single price that clears the most quantity, so the opening print already reflects overnight news and the GIFT Nifty lead.

Derivatives have a pre-open of their own. SEBI's [May 2025 circular](https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748521484014.pdf) introduced a pre-open session for current-month stock and index futures, extending to the next month's contract in the last five days before expiry; NSE went live with it on {{date:2025-12-08}}, in the {{fact:mkt-fo-preopen-since}} window. [The trading day in IST](../trading-day-ist/) walks through every session; [Order types and products](../order-types-and-products/) covers what you may and may not place in each.

For the opening-range trader two consequences follow. The opening print of Nifty futures is a discovered price, not a stale one, so a "gap" is real information rather than an artefact of a thin first trade. And the first bar of the continuous session often has a wide range because the auction's unmatched orders meet the continuous book all at once.

## Opening-range breakout: what the evidence says and what transfers

{{label:EVIDENCE}} The strongest published results on opening-range breakouts are American and recent. Zarattini and Aziz (2023) tested an opening-range breakout on the QQQ exchange-traded fund from 2016 to 2023, a period that included two bear markets, and reported an annualised alpha of 33 per cent net of commissions; by using the leveraged TQQQ to get around broker leverage limits, their strategy returned 1,484 per cent against 169 per cent for buying and holding QQQ ([SSRN working paper](https://doi.org/10.2139/ssrn.4416622)). Zarattini, Barbon and Aziz (2024) then ran a 5-minute opening-range breakout across more than 7,000 US stocks over the same years and found that the selection filter mattered most: restricting the trade to "stocks in play" — names with unusual volume, usually on news — produced a top-twenty portfolio that gained more than 1,600 per cent net with a Sharpe ratio of 2.81 and an annualised alpha of 36 per cent, against 198 per cent for the S&P 500; they also compared 15-, 30- and 60-minute range variants ([SSRN working paper](https://doi.org/10.2139/ssrn.4729284)). Both are working papers on US data.

What transfers to India is the structure of the finding, not the numbers:

- **Trade names in play.** The edge in the 2024 study came from the filter, not the breakout. An Indian equivalent is the pre-market gainers and losers list and the stocks with unusual pre-open volume — which is a [scanner](../scanners-and-where-data-lives/) question, not a chart question.
- **Respect the range stop.** The strategy's risk control was mechanical: the stop sat at the other side of the range or its midpoint, and the position size came from the stop distance.
- **Costs decide.** Net-of-commission results in a market with sub-penny spreads say little about a market where [what a trade costs](../what-a-trade-costs/) includes STT on every sale.

{{label:LORE}} Hit rates for a Nifty opening-range breakout — "the 15-minute ORB works sixty per cent of the time", and similar claims — have no Indian primary source. No exchange, regulator or peer-reviewed study publishes one, and a search on {{date:2026-11-01}} found none. Until this site's planned statistics page computes such figures from daily data, every number of this kind is a practitioner's claim.

### Five, fifteen or thirty minutes

{{label:MECHANISM}} A shorter range gives earlier entries and tighter stops but is set by the most chaotic bars of the day; a longer range costs part of the move but filters the auction's noise. The 15-minute range is the most common compromise on Nifty because it ends when the first three 5-minute candles close and before the 09:30 flow from late-arriving participants. There is no published evidence favouring one length on Indian data.

## Worked example: a 15-minute range on Nifty

:::example
Between the open and 09:30 Nifty futures trade between 25,180 and 25,260 — an 80-point range. The long rule is a 5-minute close above 25,260. The stop goes at the range midpoint, 25,220, which is 40 points below the entry; at a lot of {{fact:fo-nifty-lot}} units that is ₹2,600 of risk per lot. The first target is one range width above the break, at 25,340: 80 points for 40 risked, or 2R.

A trader whose rule caps the loss on one trade at ₹6,000 can take two lots (₹5,200 at risk); three lots would risk ₹7,800 and break the rule. The [position-size calculator](../../tools/position-size/) does the same arithmetic from a stop distance in points or in rupees. The levels are illustrative, not a live quote.
:::

The example also shows the trade's weakness. A 40-point stop on a day whose range turns out to be 70 points is not a small stop; on a day whose range is 250 points it is a coin toss. Reading the range against recent daily ranges — the ATR explained in [Indicators and why they lag](../indicators-and-why-they-lag/) — tells you which kind of day you are in.

## Gaps: gap-and-go versus gap-fill

A gap is the difference between today's open and yesterday's close. If the previous close was 25,250 and the pre-open discovers 25,400, Nifty has gapped up 150 points, or 0.59 per cent. Two trades compete for that gap. **Gap-and-go** bets the move continues: the overnight news is not fully priced and the first pullback is a buying opportunity. **Gap-fill** bets the move reverses: the gap was an overreaction and price trades back to 25,250.

{{label:EVIDENCE}} The published evidence favours continuation, at least in the US. Plastun, Sibande, Gupta and Wohar studied the Dow Jones, S&P 500 and Nasdaq indices from 1928 to 2018 and found that on gap days prices tend to keep moving in the direction of the gap, that the momentum is temporary, that there is no seasonality in it, and that the results contradict the popular belief that gaps "tend to get filled" ([SSRN; published in 2020](https://doi.org/10.2139/ssrn.3461283)). Caporale and Plastun (2017) tested six gap hypotheses across stock, currency and commodity daily data from 2000 to 2015 and found price behaviour after gaps mostly consistent with an efficient market, the exception being currencies, where a gap strategy earned abnormal profits ([Investment Analysts Journal](https://doi.org/10.1080/10293523.2017.1333563)).

{{label:LORE}} For Nifty, the gap-fill rate is unknown in public. Claims such as "seventy per cent of Nifty gaps fill the same day" circulate widely and have no primary source behind them. This site treats them as lore, exactly as its research notes recorded, until the planned statistics page computes a dated figure from daily index data. US evidence is named here as US evidence; it is not a Nifty statistic.

### Reading a gap in context

Three questions make a gap tradable without a hit rate:

1. **Where is the gap relative to yesterday's range?** An open inside yesterday's range is a different animal from an open above yesterday's high, which leaves no overhead reference nearby.
2. **What happens in the first fifteen minutes?** A gap-up whose opening range holds above the previous close is behaving like gap-and-go; one that trades back into yesterday's range inside the first range is not.
3. **Is there a reason?** A gap on a results announcement, an RBI decision or an overnight US move has a known cause whose size can be judged; a gap with no news is more often the kind that fades.

## Sizing on the open

The first fifteen minutes are the most volatile of the day by the evidence above, which cuts both ways: the biggest moves start there and so do the biggest losses. Size the first trade of the day from the stop distance, as in the worked example, never from the margin available, and know the auto-square-off rules your broker applies to intraday products before you hold anything into the afternoon ([Intraday leverage today](../intraday-leverage-today/) explains both).

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). The opening range is a way to define risk early; it is not evidence that the risk pays. Figures and their sources live in the [verified facts register](../../facts/).
:::

:::evidence What the evidence says
- {{label:EVIDENCE}} Intraday volatility is U-shaped: Nifty futures 2011–2018 (Indian working paper) and NYSE minute data (US, 1985).
- {{label:EVIDENCE}} Opening-range breakouts were profitable net of commissions on US instruments in 2016–2023 working papers; the filter for stocks in play carried the edge.
- {{label:EVIDENCE}} US index gaps tend to continue rather than fill (1928–2018); across stocks and commodities, post-gap behaviour was mostly efficient, with currencies the exception.
- {{label:MECHANISM}} The pre-open auction discovers the opening price; range length trades earliness against noise.
- {{label:LORE}} Any Nifty gap-fill rate or opening-range hit rate: no Indian primary source exists.
:::
