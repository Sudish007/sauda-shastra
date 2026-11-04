---
title: Factor indices: evidence, back-fills and the fee hurdle
section: Investing: India
summary: What momentum, quality, low-volatility, value and alpha indices select; their dated five-year and 2026 year-to-date records; why pre-launch back-filled history is not a live result; and how a {{fact:inv-momentum30-ter-direct}} fee plus {{fact:inv-momentum30-td-1y}} tracking difference can consume the factor premium.
updated: 2026-11-04
level: intermediate
order: 3
topics: [factor index, smart beta, momentum, quality, low volatility, value, alpha, back-filled index, tracking difference, cyclicality, factor fund]
related: [index-funds-india, direct-equity-and-valuation-bands, strategy-families-and-backtest-hygiene, market-data-for-backtesting-india, factors-dividends-quality]
tools: [sip-compounding]
sources:
  - NSE Indices — Nifty200 Momentum 30 factsheet, Sep 2026 | https://www.niftyindices.com/Factsheet/Factsheet_Nifty200_Momentum30.pdf | accessed 2026-11-01
  - NSE Indices — Nifty100 Quality 30 factsheet, Sep 2026 | https://www.niftyindices.com/Factsheet/Nifty100_Quality30.pdf | accessed 2026-11-01
  - NSE Indices — Nifty100 Low Volatility 30 factsheet, Sep 2026 | https://www.niftyindices.com/Factsheet/Nifty100_LowVolatility30.pdf | accessed 2026-11-01
  - NSE Indices — Nifty50 Value 20 factsheet, Sep 2026 | https://www.niftyindices.com/Factsheet/Nifty50_Value20.pdf | accessed 2026-11-01
  - NSE Indices — Nifty Alpha 50 factsheet, Sep 2026 | https://www.niftyindices.com/Factsheet/Factsheet_Nifty_Alpha50.pdf | accessed 2026-11-01
  - NSE Indices — Nifty 50 factsheet, Oct 2026 | https://www.niftyindices.com/Factsheet/ind_nifty50.pdf | accessed 2026-11-01
  - UTI Mutual Fund — UTI Nifty200 Momentum 30 Index Fund, data Sep 2026 | https://www.utimf.com/mutual-funds/uti-nifty200-momentum-30-index-fund | accessed 2026-11-01
  - UTI Mutual Fund — UTI Nifty Midcap 150 Quality 50 Index Fund, data Sep 2026 | https://www.utimf.com/mutual-funds/uti-nifty-midcap-150-quality-50-index-fund | accessed 2026-11-01
  - Kenneth R. French — Data Library | https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html | accessed 2026-11-01
---
## What each factor is trying to own

A factor index starts with a broad universe and applies a published rule. It is passive in execution — no manager chooses a stock on instinct — but active in exposure because it deliberately departs from market-cap weights.

- **Momentum** favours stocks whose price performed strongly over the index’s look-back, with volatility adjustment and periodic rebalancing. It assumes trends persist long enough to survive turnover.
- **Quality** favours profitable companies with stable earnings and conservative leverage. The idea is to pay for durable businesses without making a discretionary forecast for each one.
- **Low volatility** selects and weights stocks whose realised price variation was lower. It aims for a smoother equity path, not protection from every market fall.
- **Value** favours stocks that look inexpensive on measures such as earnings, book value, sales or dividend yield. Cheap can stay cheap, so the exposure can lag for years.
- **Alpha** ranks stocks on historical excess return after accounting for market movement. It is a price-derived signal, not proof that management created economic value.

The exact formula belongs to the index methodology and can change. Read the current methodology and factsheet before investing; a label such as “quality” is not enough to tell you the universe, weights, rebalance schedule or turnover.

## What the dated factsheets show

{{label:EVIDENCE}} The five factor rows below come from [NSE Indices factsheets dated {{date:2026-09-30}}](https://www.niftyindices.com/indices/equity/strategy-indices). The Nifty 50 comparator comes from {{date:2026-10-30}}, one month later. The mismatch is visible because it prevents a precise same-date claim; the table is context, not a contest with an engineered finish line.

| Index | Five-year total-return CAGR | 2026 year to date | Read it as |
|---|---:|---:|---|
| Nifty 50 | {{fact:inv-nifty50-5y-tr}} | not compared: later factsheet | Broad market-cap core |
| Nifty200 Momentum 30 | {{fact:inv-momentum30-5y-tr}} | {{fact:inv-momentum30-ytd-tr}} | Trend exposure had a weak current year |
| Nifty100 Quality 30 | {{fact:inv-quality30-5y-tr}} | {{fact:inv-quality30-ytd-tr}} | Defensive label did not prevent a decline |
| Nifty100 Low Volatility 30 | {{fact:inv-lowvol30-5y-tr}} | {{fact:inv-lowvol30-ytd-tr}} | Lower historical variation, still equity risk |
| Nifty50 Value 20 | {{fact:inv-value20-5y-tr}} | {{fact:inv-value20-ytd-tr}} | Deepest fall in this dated factor set |
| Nifty Alpha 50 | {{fact:inv-alpha50-5y-tr}} | {{fact:inv-alpha50-ytd-tr}} | Strongest current-year result in the set |

Four factor rows sit above the Nifty 50’s five-year number in this mixed-date snapshot; Nifty50 Value 20 sits below it. Their current-year outcomes spread from a large loss to a gain. That is evidence of **dispersion**, not evidence that buying the latest winner will repeat the ranking. The factor exposure is the source of both the possible premium and the tracking pain.

The global research base is deeper than the Indian live-fund record. Kenneth French’s [Data Library](https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html) publishes value, size, profitability, investment and momentum series across regions, while the Indian rows above are index factsheets. The [global factors guide](../factors-dividends-quality/) separates those academic portfolios from investable products; this page does not transplant a US premium into an India forecast.

## The back-fill problem

{{label:EVIDENCE}} An index provider can calculate a new rule on old data. Nifty200 Momentum 30, for example, launched on {{date:2020-08-25}} but its factsheet history begins at a base date of {{date:2005-04-01}}. Everything before launch is back-filled: the rule applied to a dataset after the design choices were known, without a live fund paying spreads, taxes, cash drag and reconstitution costs.

Back-filled data are useful for seeing how a formula behaves in different markets. They are weak evidence of an investor’s realised return. The honest comparison has three lines:

1. **Back-filled index history**, clearly ending at launch.
2. **Live index history** from launch onward.
3. **Live fund return after tracking difference**, from the fund’s own start date.

A factor can look stable across two decades of index history and disappoint immediately as a fund because the pre-launch rule was selected from many candidates, trading is costly, crowding changed the opportunity, or the factor entered a normal drought.

## The fee and tracking hurdle

A factor fund generally trades more and has a smaller asset base than a plain Nifty 50 fund. The result can be a larger TER and tracking gap before the factor earns anything.

:::example The premium has to clear costs first
Use the two UTI pages only as dated examples, not product recommendations. On ₹5,00,000, the Momentum 30 fund’s direct TER of {{fact:inv-momentum30-ter-direct}} is ₹4,100 for a year at an unchanged balance. The Nifty 50 example’s {{fact:inv-nifty50-ter-direct}} is ₹1,250. The annual fee hurdle is therefore ₹2,850 before comparing factor performance.

The momentum fund’s regular plan reported a one-year tracking difference of {{fact:inv-momentum30-td-1y}}. That gap is larger than the plain Nifty example’s entire direct TER. If a factor premium is small, implementation can consume it; if the factor lags, the higher cost compounds the lag.
:::

Tracking difference matters more than the label. Compare funds following the **same** factor index, over identical dates, and examine whether the gap widens around rebalances. A low headline TER with poor execution is not low cost.

## Why factors cycle

{{label:MECHANISM}} Every factor owns a recurring economic bet. Momentum owns recent winners and pays high turnover when leadership reverses. Value owns companies the market dislikes and can inherit genuine business deterioration. Quality can become expensive when everyone seeks safety. Low volatility can crowd into bond-like sectors and suffer when rates rise. Alpha can overlap momentum because both use past prices.

Those bets respond differently to growth, inflation, rates and market breadth. A multi-year drought is not proof that a factor died, and a strong backtest is not proof it will return. The practical consequence is sizing: a factor is a **tilt around a diversified core**, not the whole equity allocation, unless the investor can tolerate a long, visible lag against Nifty 50.

Factor overlap also defeats superficial diversification. Holding momentum, alpha and quality funds is not necessarily three independent strategies; inspect constituent overlap and sector weights after each rebalance. The [backtest checklist](../strategy-families-and-backtest-hygiene/) explains why a ruleset must be tested with dated constituents, costs and out-of-sample periods.

## A decision checklist

1. **Name the hypothesis.** One sentence: what behaviour or risk is expected to pay, and why might it persist after costs?
2. **Separate back-fill from live history.** Mark the launch date on the chart and judge the investable fund only after its own inception.
3. **Compare implementation.** TER, tracking difference, turnover, assets, bid–ask spread for an ETF, and exit load for a mutual fund.
4. **Measure overlap.** Compare constituents and sectors with the existing Nifty 50 holding and with other factor funds.
5. **Set a tilt cap in the allocation policy.** The cap is based on tolerance for underperformance, not on the latest return.
6. **Choose a review rule.** Review process and tracking annually; do not switch factors because the latest year changed the ranking.
7. **Use the right benchmark.** A mid-cap quality index is not fairly judged against a large-cap market index without separating size from quality.

:::evidence What the evidence says
- {{label:EVIDENCE}} The table is a dated record from NSE Indices. It shows factor dispersion and the back-filled history disclosed in the factsheets.
- {{label:MECHANISM}} Cyclicality, overlap and the fee hurdle explain why a factor premium can fail to reach an investor; they do not predict the next leader.
- {{label:LORE}} A factor that led this year is “in season” for the next one. No public rule can infer that from the ranking alone.
:::
