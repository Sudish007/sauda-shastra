---
title: All-Weather, dual momentum and the 200-day rule
section: Investing: USA & global
summary: What risk parity is trying to balance, why the US 60/40 portfolio failed as a hedge in 2022, how Meb Faber’s ten-month trend rule and Gary Antonacci’s dual-momentum rule are actually specified, and how taxes, whipsaws and hypothetical backtests change the result for an Indian resident.
updated: 2026-11-04
level: advanced
order: 3
topics: [All Weather, risk parity, 60 40 portfolio, trend following, 200-day moving average, dual momentum, global equities momentum, backtest, whipsaw, asset allocation]
related: [cape-expected-returns-and-currency, asset-allocation-and-gold-after-sgb, strategy-families-and-backtest-hygiene, market-data-for-backtesting-india]
sources:
  - Bridgewater Associates — The All Weather Story | https://www.bridgewater.com/research-and-insights/the-all-weather-story | accessed 2026-11-01
  - Aswath Damodaran — Historical returns on US stocks, bonds and bills, updated Jan 2026 | https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html | accessed 2026-11-01
  - Meb Faber — Timing model and published-paper FAQ | https://mebfaber.com/timing-model/ | accessed 2026-11-01
  - Meb Faber — Author-released books | https://mebfaber.com/books/ | accessed 2026-11-01
  - Gary Antonacci — Global Equities Momentum | https://www.optimalmomentum.com/global-equities-momentum/ | accessed 2026-11-01
  - Antonacci — Risk Premia Harvesting Through Dual Momentum, Journal of Management and Entrepreneurship 2016 | https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2042750 | accessed 2026-11-01
  - Income-tax Act 2025 — ss. 2(101) and 197, foreign securities | https://incometaxindia.gov.in/w/section-197-78 | accessed 2026-11-01
---
## All Weather balances economic risks, not rupee amounts

[Bridgewater’s All Weather history](https://www.bridgewater.com/research-and-insights/the-all-weather-story) starts with four broad environments: growth rising or falling, crossed with inflation rising or falling. Equities tend to dominate when growth surprises upward; nominal bonds tend to help when growth and inflation fall; inflation-linked bonds and commodities respond differently when inflation rises.

{{label:MECHANISM}} A conventional portfolio may put sixty per cent of its money in shares and forty per cent in bonds, yet most of its volatility still comes from shares. Risk parity instead tries to equalise risk contributions. Because government bonds usually move less than equities, the method often gives bonds a larger capital weight or uses leverage to raise their risk contribution.

The mechanism is coherent, but the name can mislead. It does not mean every weather produces a positive return. Estimates of volatility and correlation change, leverage raises financing and drawdown risk, and the assets available to an Indian household differ from an institutional US portfolio. A rupee investor also adds currency movement to every foreign leg.

## The US 2022 stress test

{{label:EVIDENCE}} Damodaran’s [US historical-return series](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html), updated in January 2026, records the S&P 500 including dividends at −18.04% in 2022, the US ten-year Treasury at −17.83%, gold at +0.55% and three-month Treasury bills at +2.09%. These are US asset returns in one calendar year.

:::example When both 60/40 legs fall
A simple US 60/40 mix gives:

`0.60 × (−18.04%) + 0.40 × (−17.83%) = −17.96%`

On $100,000, the arithmetic loss is about $17,960 before rebalancing, fees and tax. Gold’s small positive return and the bill return show that “everything fell” is too broad, but the two main 60/40 legs did not hedge one another. Levering the bond sleeve in a risk-parity portfolio would magnify the bond loss as well as the expected diversification benefit.
:::

The lesson is narrower than “bonds no longer work”. Inflation rose, yields reset sharply and both duration and equity valuation were vulnerable to the same shock. Bonds can diversify a growth recession and still fail during an inflation shock. An allocation needs more than one story about correlation.

The [India asset-allocation guide](../asset-allocation-and-gold-after-sgb/) keeps this observation labelled as US evidence. No primary Indian equity/debt/gold correlation study was fetched, so the US year is not used to prescribe an Indian mix.

## Faber’s ten-month trend rule

Meb Faber’s [timing-model page](https://mebfaber.com/timing-model/) describes the rule from his 2007 paper and later updates: at a month end, hold an asset when its price is above its ten-month simple moving average; otherwise hold cash. The ten-month average is close to the familiar 200-day average. The test is monthly, not a daily crossover system.

{{label:EVIDENCE}} Faber reports that nearby moving-average choices, from several months to about a year and including exponential averages, produced broadly similar historical behaviour. That parameter stability is more useful than one optimised setting. The page is the accessible author source because the SSRN copy was blocked during research. His [author-released books page](https://mebfaber.com/books/) provides the broader global-allocation context.

A trend filter has a clear mechanism: accept small losses when a trend reverses in exchange for avoiding part of a prolonged decline. Its cost is equally clear. Sideways markets create repeated exits and re-entries, a signal at month end can gap before execution, cash earns a changing rate, and tax is realised each time a profitable position is sold.

A disciplined test therefore uses total-return series, a realistic month-end execution rule, a cash return available at that date, spreads, custody costs, Indian tax lots and no look-ahead. The [backtest-hygiene guide](../strategy-families-and-backtest-hygiene/) supplies that checklist.

## Antonacci’s dual momentum rule

Gary Antonacci’s [Global Equities Momentum page](https://www.optimalmomentum.com/global-equities-momentum/) combines two comparisons at a monthly decision point:

1. **Relative momentum:** compare the trailing twelve-month return of the S&P 500 with an all-country index excluding the US, then select the stronger equity index.
2. **Absolute momentum:** hold that selected equity index only when its trailing return beats Treasury bills; otherwise use US aggregate bonds.

{{label:EVIDENCE}} Antonacci identifies the displayed results as index simulations rather than fund performance. The related 2016 paper, [Risk Premia Harvesting Through Dual Momentum](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2042750), is the dated published backtest; its SSRN page could not be fetched from the research network, so the claim here stays limited to the author page and journal citation.

The rule makes three active choices that need naming: the look-back, the two equity universes and the defensive asset. Replacing Treasury bills with an Indian liquid fund, or US aggregate bonds with rupee debt, creates a different strategy. Replacing the ex-US index with Nifty 50 creates another. A backtest of one is not evidence for the others.

## Tax and currency can reverse the paper result

An Indian resident’s foreign ETF becomes long-term only after {{fact:glb-foreign-stock-ltcg-period}}. A monthly trend or momentum rule can reset that clock repeatedly. Long-term gains use {{fact:glb-foreign-stock-ltcg-rate}} without indexation; short-term gains enter the slab.

:::example One realised gain under two clocks
Assume a strategy realises a ₹5,00,000 gain. If repeated switching leaves it short-term and the investor is in an assumed thirty-per-cent slab, base tax is thirty per cent of the gain and {{fact:tax-cess-rate}} raises the total to ₹1,56,000. If the identical gain qualifies as long-term, {{fact:glb-foreign-stock-ltcg-rate}} produces ₹62,500 before cess and ₹65,000 after it. Surcharge, losses and brokerage are omitted.
:::

The strategy can also switch after the rupee has moved. A dollar-price signal does not see the Indian investor’s INR return. Backtesting only the US index can therefore show a loss while the rupee holding gained, or the reverse. The signal, execution currency and tax currency must be explicit.

## A rule card before any backtest

Write the complete rule before opening the data:

- exact total-return index and investable instrument;
- observation date, time zone and execution price;
- moving-average or look-back formula, including missing-data treatment;
- defensive asset and its historical return series;
- rebalance frequency, spreads, FX spread, transfer fee and tax-lot method;
- treatment of distributions and foreign withholding;
- maximum allocation and whether leverage is prohibited;
- a benchmark that uses the same asset universe and currency.

Then keep an untouched out-of-sample period. Test nearby parameters rather than celebrating the best one, and count every model variation tried. A trend rule may lower a historical drawdown while lagging for years; a momentum rule may concentrate in one country just before leadership changes; risk parity may depend on leverage exactly when financing becomes costly.

:::evidence What the evidence says
- {{label:EVIDENCE}} The US 2022 figures come from the linked NYU series; Faber and Antonacci provide dated hypothetical backtests and disclose their rule structures.
- {{label:MECHANISM}} Risk balancing, trend persistence and relative-plus-absolute momentum explain how the systems act. They do not promise future excess return.
- {{label:LORE}} A 200-day line, one look-back or an “All Weather” allocation works in every market. None of the cited sources supports that literal claim.
:::
