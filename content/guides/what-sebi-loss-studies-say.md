---
title: What SEBI's loss studies say
section: Risk, psychology & tax
summary: Five SEBI studies from 2023 to 2026 counted who made money in equity derivatives. In FY26 {{fact:sebi-loss-2026-share}} of individual traders lost, {{fact:sebi-loss-2026-amount}} between them and {{fact:sebi-loss-2026-avg}} each on average — the base rate every trading plan has to start from. The figures, the samples, who lost more, and what did not help.
updated: 2026-11-04
level: beginner
order: 1
topics: [sebi study, retail losses, base rate, f&o, index options, intraday, transaction costs, persistence, under-30s]
related: [expectancy-and-drawdown-maths, position-sizing-and-loss-limits, psychology-journaling-prop-firms, buying-vs-selling-options, what-a-trade-costs, liquidity-slippage-and-sebi-measures, strategy-families-and-backtest-hygiene, retail-traps]
tools: [expectancy-kelly]
sources:
  - SEBI — Profitability of individual traders in the equity derivatives segment, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
  - SEBI — Trading behaviour of individual traders in the equity derivatives segment, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233601328.pdf | accessed 2026-11-01
  - SEBI — Comparative study of growth in the equity derivatives segment vis-à-vis the cash market after recent measures (Jul 2025) | https://www.sebi.gov.in/sebi_data/attachdocs/jul-2025/1751900271726.pdf | accessed 2026-11-01
  - SEBI — Analysis of profits and losses in the equity derivatives segment, FY22–FY24 (Sep 2024) | https://www.sebi.gov.in/sebi_data/attachdocs/sep-2024/1727085659479.pdf | accessed 2026-11-01
  - SEBI — Analysis of intraday trading by individuals in the equity cash segment (Jul 2024) | https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1721818140715.pdf | accessed 2026-11-01
  - SEBI — Analysis of profit and loss of individual traders dealing in the equity F&O segment (Jan 2023) | https://www.sebi.gov.in/sebi_data/attachdocs/jan-2023/1674645296493.pdf | accessed 2026-11-01
  - SEBI — Research papers and articles listing (checked for later studies) | https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=4&ssid=81&smid=109 | accessed 2026-11-01
---
## Five studies, one table

Between January 2023 and August 2026 SEBI's Department of Economic and Policy Analysis published five studies on what individual traders actually earned. Each one pulled the profit-and-loss records of individual clients from the largest brokers, netted them of transaction costs, and counted. The headline figures are reused across this site, so they live in the [verified facts register](../../facts/) and render here with the date they were last checked.

| Study (published) | Period | Loss-makers | Aggregate net loss | Average per trader |
|---|---|---|---|---|
| [Jan 2023](https://www.sebi.gov.in/sebi_data/attachdocs/jan-2023/1674645296493.pdf), equity F&O | FY22 | {{fact:sebi-loss-2023-share}} | not totalled in the study | loss-makers lost ₹1.1 lakh each; profit-makers made ₹1.5 lakh |
| [Jul 2024](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1721818140715.pdf), equity cash intraday | FY23 | {{fact:sebi-intraday-cash-loss-share}} | not totalled in the study | — |
| [Sep 2024](https://www.sebi.gov.in/sebi_data/attachdocs/sep-2024/1727085659479.pdf), equity F&O | FY24 (with FY22–FY24) | {{fact:sebi-loss-2024-share}} | about ₹75,000 crore in FY24; {{fact:sebi-loss-2024-amount}} over three years | net loss ₹1.20 lakh |
| [Jul 2025](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2025/1751900271726.pdf), equity F&O | FY25 | {{fact:sebi-loss-2025-share}} | {{fact:sebi-loss-2025-amount}} | net loss about ₹1.10 lakh |
| [Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf), equity F&O | FY26 | {{fact:sebi-loss-2026-share}} | {{fact:sebi-loss-2026-amount}} | net loss {{fact:sebi-loss-2026-avg}} |

Three things about the samples, because they decide how far the numbers travel. The studies cover the top brokers only — ten in the first study (about two-thirds of individual turnover), thirteen to fifteen in the later F&O studies — so the absolute rupee totals understate the market and the percentages are the better figures. "Net" is after brokerage, taxes and exchange charges, which is why the same trader can show a gross profit and a net loss. And the series is not perfectly continuous: the {{date:2025-07-07}} study put FY25's loss at {{fact:sebi-loss-2025-amount}} on thirteen brokers, and the {{date:2026-08-20}} study revised it to ₹1,11,788 crore on fifteen. Where a figure differs between studies, this page shows one study per row and says which.

The Aug 2026 study also re-stated the whole run on its own fifteen-broker base: loss-maker shares of 90.2 per cent (FY22), 91.5 per cent (FY23), {{fact:sebi-loss-2024-share}} (FY24), 90.9 per cent (FY25) and {{fact:sebi-loss-2026-share}} (FY26), and aggregate net losses of ₹40,824 crore, ₹65,747 crore, ₹74,812 crore, ₹1,11,788 crore and {{fact:sebi-loss-2026-amount}} — a cumulative {{fact:sebi-loss-fy22-fy26-cumulative}} over five years. SEBI's [research listing](https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=4&ssid=81&smid=109) showed no later F&O profitability study on {{date:2026-11-01}}.

## Net means after costs

{{label:EVIDENCE}} Costs are the part of the loss a trader controls, and the studies measure them. In FY26, transaction costs were {{fact:sebi-costs-share}} of loss-makers' gross losses and about 21 per cent of profit-makers' gross profits; 4.4 lakh traders were profitable before costs and loss-making after them (5.3 lakh in FY25). Individuals paid roughly ₹25,000 crore in costs in each of FY25 and FY26, close to a lakh crore rupees over FY22–FY26, and the securities transaction tax they paid rose by about a third between the two years as its rate went up. The FY26 cost mix was brokerage 44.3 per cent, STT 26.7 per cent, exchange charges 15.8 per cent, GST eleven per cent, stamp duty 1.3 per cent and the SEBI fee under one per cent.

The earlier studies say the same thing in different years. In FY22 the typical active loss-maker paid a further 28 per cent of the net trading loss as costs, and profit-makers gave up between 15 and 50 per cent of their profits. Over FY22–FY24 individuals spent over ₹50,000 crore on costs — around ₹26,000 per person in FY24 alone. In the equity cash intraday study, costs added 57 per cent to loss-makers' losses and took 19 per cent of profit-makers' profits. [What a trade costs](../what-a-trade-costs/) prices the cost line for each product at today's rates; it is the one line in the expectancy formula that is known before the trade.

## Who loses more

{{label:EVIDENCE}} Every cut of the data points the same way: more activity, more leverage, less capital and younger traders go with a higher loss rate.

- **Options, not futures.** In FY26, {{fact:sebi-loss-2026-share}} of options traders lost against about two-thirds of futures traders; by product, index options 87 per cent, stock options 76 per cent, stock futures 64 per cent and index futures 62 per cent. Options produced about 92 per cent of all FY26 losses.
- **Buyers, mostly.** In SEBI's behaviour sample, 93 per cent of traders only bought options and about two per cent mostly sold them. Nine in ten buyers lost; 44 per cent of sellers lost — but a losing seller lost ₹51.7 lakh on average against ₹1.3 lakh for a losing trader who only bought. [Buying versus selling options](../buying-vs-selling-options/) takes this apart.
- **Frequency and size.** Traders active more than a hundred days a year were 42 per cent of traders but 94 per cent of turnover and 87 per cent of losses. In FY24, 95 per cent of "high-value" traders (over ₹1 crore of premium turnover) lost, against 91.5 per cent of the rest.
- **Capital.** In FY25–FY26, 78 per cent of traders held equity portfolios under ₹1 lakh yet made 70 per cent of the losses; about 35 per cent held no equity portfolio at all, and 24 per cent had no cash-market turnover in FY26.
- **Age and income.** Under-30s were 43 per cent of traders in both FY24 and FY26 (31 per cent in FY23); 93 per cent of them lost in FY24 and 89 per cent in FY26. In FY24 over 75 per cent of traders declared annual income under ₹5 lakh, and 88 per cent of that group lost in FY26; 72 per cent came from beyond the top thirty cities.

## What did not help

{{label:EVIDENCE}} Two intuitions fail the data: that experience fixes outcomes, and that losers quit.

- **Experience.** The loss-maker share was about 91 per cent among first-year traders and above 95 per cent among those with four or more consecutive years of trading. Only 15 per cent of trader-quarters were profitable; the median losing quarter was −₹10,525 against a median winning quarter of +₹4,366.
- **Persistence.** Over 75 per cent of FY24 loss-makers had also lost in each of the two preceding years and kept trading. Between 90 and 92 per cent of two-year losers lost again the next year. Of traders active in all five years FY22–FY26, {{fact:sebi-loss-2026-five-year-consistent}} were profitable every year and 65.6 per cent lost every year. 88 per cent of those with more than ten lakh rupees of cumulative losses were still trading.
- **New money.** 42 lakh FY24 traders were new that year; 92.1 per cent of them lost, about ₹46,000 each. In the intraday cash study, three-year veterans were still 54 per cent loss-makers.

## Reading the FY26 dip with care

The FY26 loss share fell by more than three points, the largest move in the series, and the aggregate loss fell 18 per cent. Read both with the denominators. Active individual traders in equity derivatives fell 18 per cent too, from 106.2 lakh to 87.5 lakh — the first yearly fall since FY16 — and new entrants fell 40 per cent to 20.8 lakh from a FY24 peak of 43.1 lakh; about 46 lakh FY25 traders did not trade at all in FY26. The crowd shrank more than the loss did, so the average loss per trader went *up* to {{fact:sebi-loss-2026-avg}}. The Jul 2025 study had already shown the same pattern after the November 2024 measures: fewer unique traders and lower premium turnover, with the quarterly loss share staying between 84 and 89 per cent throughout.

Where the money went also narrowed. Of every ₹100 individuals traded in equity derivatives, about ₹5 went to index options in FY20 and ₹41 in FY25, and {{fact:opt-zero-dte-share-fy26}} of FY26 index-option turnover was in contracts expiring the same day. About 23 per cent of traders bore around 90 per cent of FY26 losses. The structural changes behind these shifts — fewer weekly expiries, larger lots, upfront premium — are in [Liquidity, slippage and SEBI's measures](../liquidity-slippage-and-sebi-measures/).

## The base rate as a worked example

:::example A random FY26 participant's expected year
The Aug 2026 study gives a 12.3 per cent chance of ending the year a profit-maker (average profit ₹1.22 lakh) and an {{fact:sebi-loss-2026-share}} chance of ending it a loss-maker (average loss ₹1.47 lakh). The expectation for someone drawn at random from that crowd is 0.123 × ₹1,22,000 − 0.877 × ₹1,47,000 ≈ −₹1,14,000 for the year, or about −₹9,500 a month — close to the study's reported average of {{fact:sebi-loss-2026-avg}}. Costs alone, at the FY24 figure of ₹26,000 a year per person, are about ₹2,170 a month before any market loss. The [expectancy calculator](../../tools/expectancy-kelly/) does the same arithmetic for your own win rate and average win and loss.
:::

The point of the example is not that trading cannot work; the top one per cent of FY22 profit-makers took about half of all net profit, so some participants clearly earned a lot. The point is that the default outcome is a loss, and a plan that does not say *why its holder will be in the small group* is a plan to be in the large one.

:::warning What these studies cannot tell you
They describe a crowd drawn from the largest brokers, net of costs, year by year. They cannot say whether a particular method or a particular trader has an edge — only that the base rate against which any claimed edge should be judged is a loss for roughly nine in ten participants, and that the group has not learned its way out of it in five years. Anyone selling a course or a tip should be asked how their results differ from this base rate, with evidence of the same quality.
:::

## How to use these numbers

- Start the plan from the base rate, not from the screenshot. [Expectancy and drawdown maths](../expectancy-and-drawdown-maths/) turns a win rate and a payoff into a number per trade.
- Treat costs as the known part of every trade and size for the losses that the data says are normal — [Position sizing and loss limits](../position-sizing-and-loss-limits/).
- Build the controls the behaviour data argues for: fewer trades, no size increase after a loss, a written stop for the day — [Psychology, journaling and prop firms](../psychology-journaling-prop-firms/).

:::evidence What the evidence says
- {{label:EVIDENCE}} Five SEBI studies, FY22–FY26: roughly nine in ten individual equity-derivatives traders lost in every year, {{fact:sebi-loss-fy22-fy26-cumulative}} in total, with the FY26 share at {{fact:sebi-loss-2026-share}} on a smaller crowd.
- {{label:EVIDENCE}} Costs were {{fact:sebi-costs-share}} of loss-makers' gross losses in FY26 and turned 4.4 lakh gross profits into net losses.
- {{label:EVIDENCE}} Options traders, frequent traders, small accounts and under-30s lost at higher rates; experience did not lower the loss rate, and most losers kept trading.
- {{label:EVIDENCE}} Equity cash intraday, FY23: {{fact:sebi-intraday-cash-loss-share}} of individual intraday traders lost.
:::
