---
title: Strategy families and the backtest checklist
section: Algo & systematic
summary: The six families systematic traders build from — momentum, mean reversion, pairs, hedged option selling, volatility and machine learning — with the evidence for each, and the checklist that separates a backtest from a story: look-ahead and survivorship bias, costs and slippage at current rates, walk-forward tests, a haircut for your trial count and a Monte Carlo shuffle of the trade order.
updated: 2026-11-02
level: advanced
order: 5
topics: [strategy families, momentum, mean reversion, pairs trading, statistical arbitrage, volatility risk premium, option selling, machine learning, backtest, look-ahead bias, survivorship bias, slippage, walk-forward, overfitting, multiple testing, monte carlo, purged cross-validation]
related: [market-data-for-backtesting-india, no-code-platforms-and-python-stack, execution-realities-and-architecture, expectancy-and-drawdown-maths, what-a-trade-costs, what-sebi-loss-studies-say, buying-vs-selling-options, position-sizing-and-loss-limits]
tools: [charges, expectancy-kelly]
sources:
  - Jegadeesh and Titman — Returns to Buying Winners and Selling Losers, Journal of Finance (1993) | https://doi.org/10.1111/j.1540-6261.1993.tb04702.x | accessed 2026-11-01
  - NSE Indices — Nifty200 Momentum 30 index | https://www.niftyindices.com/indices/equity/strategy-indices/nifty200-momentum-30 | accessed 2026-11-01
  - Gatev, Goetzmann and Rouwenhorst — Pairs Trading: Performance of a Relative Value Arbitrage Rule, NBER working paper 7032 | https://www.nber.org/papers/w7032 | accessed 2026-11-01
  - Chan — Algorithmic Trading: Winning Strategies and Their Rationale (Wiley, 2013) | https://www.wiley.com/en-us/Algorithmic+Trading%3A+Winning+Strategies+and+Their+Rationale-p-9781118460146 | accessed 2026-11-01
  - AQR — Understanding the Volatility Risk Premium (white paper, 2020) | https://www.aqr.com/Insights/Research/White-Papers/Understanding-the-Volatility-Risk-Premium | accessed 2026-11-01
  - Cboe — PUT index dashboard (collateralised S&P 500 put-writing benchmark) | https://www.cboe.com/us/indices/dashboard/put/ | accessed 2026-11-01
  - SEBI — Study on the profitability of individual traders in the equity derivatives segment, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/reports-and-statistics/research/aug-2026/study-profitability-of-individual-traders-in-the-equity-derivatives-segment-fy25-fy26-_103835.html | accessed 2026-11-01
  - Gu, Kelly and Xiu — Empirical Asset Pricing via Machine Learning, NBER working paper 25398 | https://www.nber.org/papers/w25398 | accessed 2026-11-01
  - López de Prado — Advances in Financial Machine Learning (Wiley, 2018) | https://www.wiley.com/en-us/Advances+in+Financial+Machine+Learning-p-9781119482086 | accessed 2026-11-01
  - Bailey, Borwein, López de Prado and Zhu — The Probability of Backtest Overfitting (author PDF; Journal of Computational Finance, 2017) | https://www.davidhbailey.com/dhbpapers/backtest-prob.pdf | accessed 2026-11-01
  - Harvey and Liu — Backtesting, Journal of Portfolio Management (2015) | https://doi.org/10.3905/jpm.2015.42.1.013 | accessed 2026-11-01
  - Pardo — The Evaluation and Optimization of Trading Strategies, 2nd edition (Wiley, 2008) | https://www.wiley.com/en-us/The+Evaluation+and+Optimization+of+Trading+Strategies%2C+2nd+Edition-p-9780470128015 | accessed 2026-11-01
  - Chan — Quantitative Trading: How to Build Your Own Algorithmic Trading Business, 2nd edition (Wiley, 2021) | https://www.wiley.com/en-us/Quantitative+Trading%3A+How+to+Build+Your+Own+Algorithmic+Trading+Business%2C+2nd+Edition-p-9781119800064 | accessed 2026-11-01
  - Brown, Goetzmann, Ibbotson and Ross — Survivorship Bias in Performance Studies, Review of Financial Studies (1992) | https://doi.org/10.1093/rfs/5.4.553 | accessed 2026-11-01
---
## Six families, and what is known about each

Almost every systematic strategy a retail trader will meet belongs to one of six families. Each is labelled below with what the published evidence actually supports — a study, a mechanism, or neither.

**Momentum.** {{label:EVIDENCE}} Buying the stocks that rose most over the past three to twelve months and selling the ones that fell most produced significant abnormal returns in US stocks over 1965–1989, in [Jegadeesh and Titman's](https://doi.org/10.1111/j.1540-6261.1993.tb04702.x) 1993 Journal of Finance paper, and the effect has been studied in most markets since. India has an investable version of the idea in NSE's [Nifty200 Momentum 30](https://www.niftyindices.com/indices/equity/strategy-indices/nifty200-momentum-30) index, whose methodology and factsheet are public; the evidence on Indian factor indices is a long-term investing topic rather than a trading one, and the register carries the index's own return figures.

**Mean reversion.** {{label:MECHANISM}} A price that has stretched far from its average tends to come back, on horizons from minutes to weeks; the family includes Bollinger-band fades, pairs and most market-making. Ernest Chan's [Algorithmic Trading](https://www.wiley.com/en-us/Algorithmic+Trading%3A+Winning+Strategies+and+Their+Rationale-p-9781118460146) sets out the mechanics and the cautions — above all that mean-reversion profits are many small wins eaten by costs, which in India means STT and exchange charges on every leg. No Indian intraday study of the family exists; the label is mechanism, not evidence.

**Pairs and statistical arbitrage.** {{label:EVIDENCE}} [Gatev, Goetzmann and Rouwenhorst](https://www.nber.org/papers/w7032) matched US stocks by the minimum distance between their normalised prices and traded the spread when it diverged; over 1962–1997 the top pairs earned average annualised excess returns of up to about 12 per cent. The authors say that part of the profit may be a microstructure effect — the bid-ask bounce — and that the returns did exceed a conservative cost estimate. Nobody has published the equivalent for NSE pairs; the [relative-strength pairs playbook](../../playbooks/relative-strength-pairs/) treats the Indian version as a discretionary setup for that reason.

**Hedged option selling.** {{label:EVIDENCE}} The documented edge behind systematic option selling is the volatility risk premium: implied volatility has, on average, exceeded the volatility that was subsequently realised, which [AQR's white paper](https://www.aqr.com/Insights/Research/White-Papers/Understanding-the-Volatility-Risk-Premium) explains and Cboe's [PUT index](https://www.cboe.com/us/indices/dashboard/put/) — a collateralised S&P 500 put-writing benchmark — tracks publicly. The Indian retail record is the other half of the evidence: SEBI's [FY25–FY26 study](https://www.sebi.gov.in/reports-and-statistics/research/aug-2026/study-profitability-of-individual-traders-in-the-equity-derivatives-segment-fy25-fy26-_103835.html) found {{fact:sebi-loss-2026-share}} of individual F&O traders lost money, that about {{fact:opt-buyer-share-fy26}} of them mainly bought options, and that the small group who mainly sold was the only one with a positive median return on capital. The premium exists; collecting it with a hedge, a margin buffer and a cost model is the whole job, and [Buying versus selling options](../buying-vs-selling-options/) weighs the two sides.

**Volatility.** {{label:EVIDENCE}} Trading volatility directly — long or short straddles, dispersion, VIX-linked positions — rests on the same premium and the same AQR evidence, with the added risk that the premium is paid for in rare large losses. India VIX is the index; its regime bands on this site's [statistics page](../../stats/#vix) are computed from ten years of data, and [Policy days, India VIX and sizing on event days](../policy-days-vix-and-sizing/) uses them.

**Regime and machine learning.** {{label:EVIDENCE}} [Gu, Kelly and Xiu](https://www.nber.org/papers/w25398) found that machine-learning forecasts of US stock returns added economic value mainly through non-linearities and interactions, with tree models and neural networks ahead of linear ones. López de Prado's [Advances in Financial Machine Learning](https://www.wiley.com/en-us/Advances+in+Financial+Machine+Learning-p-9781119482086) supplies the method that makes such results trustworthy — purged cross-validation, combinatorial purged cross-validation and the deflated Sharpe ratio — and is the reason the checklist below has a section on it.

## The backtest checklist

A backtest is an experiment on data that already happened, and every item below is a way the experiment lies. Each is labelled {{label:MECHANISM}}: these are errors with known causes, not matters of opinion, and the Python fragments show the fix. The register values the code reads come from the [verified facts register](../../facts/), never from memory.

### Look-ahead bias

{{label:MECHANISM}} The commonest error: a rule uses information that was not available when the order would have been placed. A moving-average signal computed on today's close and applied to today's trade is the classic case; so is a "monthly rebalance" that uses month-end data on the first of the month. The fix is to shift every signal by one bar and to trade at the next bar's open.

```python
import pandas as pd
df = pd.read_csv("nifty_daily.csv", parse_dates=["date"]).set_index("date")
# wrong: today's close decides today's trade
above = df["close"] > df["close"].rolling(20).mean()
# right: yesterday's information, acted on at today's open
df["signal"] = above.astype(int).shift(1)
df["ret"] = df["open"].shift(-1).div(df["open"]).sub(1.0)   # open to next open
df["strategy"] = df["signal"] * df["ret"]
```

### Survivorship bias

{{label:MECHANISM}} Building the universe from today's list — today's F&O stocks, today's Nifty 50 — and applying it to the past tests only the companies that survived to be on the list. The original study is [Brown, Goetzmann, Ibbotson and Ross](https://doi.org/10.1093/rfs/5.4.553) in the 1992 Review of Financial Studies, on mutual funds; Chan's [Quantitative Trading](https://www.wiley.com/en-us/Quantitative+Trading%3A+How+to+Build+Your+Own+Algorithmic+Trading+Business%2C+2nd+Edition-p-9781119800064) treats it alongside look-ahead as the two biases that invent returns. The fix is a dated membership table, as [Market data for Indian backtests](../market-data-for-backtesting-india/) describes.

```python
# the universe as it stood on each date, not as it stands today
members = pd.read_csv("fo_universe_history.csv", parse_dates=["from", "to"])
def universe(day):
    live = (members["from"] <= day) & (members["to"].fillna(pd.Timestamp.max) >= day)
    return set(members.loc[live, "symbol"])
```

### Costs and slippage at today's rates

{{label:MECHANISM}} A backtest without costs is a backtest of a different instrument. Every leg carries brokerage, STT ({{fact:chg-stt-options-sell}} of the premium on an option sale, {{fact:chg-stt-futures}} on a futures sale), the NSE transaction charge, the SEBI fee, stamp duty on the buy and GST at {{fact:chg-gst-rate}} on the brokerage and exchange lines. [What a trade costs](../what-a-trade-costs/) explains each, and the [charges calculator](../../tools/charges/) computes them. Slippage is the rest: assume at least one tick against you on every leg, and more for market orders in thin strikes.

```python
R = load_register()   # the verified facts register as {id: numeric value}
def option_round_trip_cost(buy, sell, units, brokerage_per_order):
    tb, ts = buy * units, sell * units
    stt = R["chg-stt-options-sell"] * ts
    exchange = R["chg-nse-txn-options"] * (tb + ts)
    sebi = R["chg-sebi-fee"] * (tb + ts)
    stamp = R["chg-stamp-options"] * tb
    gst = R["chg-gst-rate"] * (2 * brokerage_per_order + exchange + sebi)
    return 2 * brokerage_per_order + stt + exchange + sebi + stamp + gst
```

### Walk-forward testing and parameter stability

{{label:MECHANISM}} Optimising parameters on the whole history and reporting the result is fitting, not testing. Robert Pardo's [Evaluation and Optimization of Trading Strategies](https://www.wiley.com/en-us/The+Evaluation+and+Optimization+of+Trading+Strategies%2C+2nd+Edition-p-9780470128015) formalised the alternative: choose parameters on a training window, test them on the window that follows, roll both forward, and judge the strategy only on the stitched out-of-sample results. Parameter stability is the companion check — a rule that works with a twenty-day lookback and fails at eighteen and twenty-two was never working.

```python
def walk_forward(data, fit, test, train_days=500, test_days=125):
    results, start = [], 0
    while start + train_days + test_days <= len(data):
        train = data.iloc[start:start + train_days]
        held_out = data.iloc[start + train_days:start + train_days + test_days]
        params = fit(train)                 # choose parameters on the past only
        results.append(test(held_out, params))
        start += test_days                  # roll forward, never back
    return results
```

### Many variants, one haircut

{{label:MECHANISM}} Try two hundred parameter sets and report the best, and the best will look good whether or not any of them works; the more you try, the better the winner looks. [Harvey and Liu](https://doi.org/10.3905/jpm.2015.42.1.013) propose haircutting a backtested Sharpe ratio for the number of trials behind it, and [Bailey, Borwein, López de Prado and Zhu](https://www.davidhbailey.com/dhbpapers/backtest-prob.pdf) give a method, combinatorially symmetric cross-validation, that estimates the probability that the selection itself is the result. Both require one honest number: how many things you tried. Keep a count, including the variants you discarded, and report it with the result.

### Monte Carlo of the trade order

{{label:MECHANISM}} The historical drawdown is one draw. The same trades in a different order would have produced a different equity curve and, often, a deeper trough. Shuffle the trade P&L sequence many times and read the distribution of drawdowns; the worst five per cent of paths is a better planning number than the one path that happened. [Expectancy and drawdown maths](../expectancy-and-drawdown-maths/) explains why, and López de Prado's book goes further with synthetic data.

```python
import numpy as np
def max_drawdown(pnl):
    equity = np.cumsum(pnl)
    return float(np.max(np.maximum.accumulate(equity) - equity))
def shuffled_drawdowns(pnl, runs=10_000, seed=7):
    rng = np.random.default_rng(seed)
    return np.array([max_drawdown(rng.permutation(pnl)) for _ in range(runs)])
dd = shuffled_drawdowns(trade_pnl)
print(np.percentile(dd, 95))   # the drawdown your history understates
```

### Purged cross-validation for learned models

{{label:MECHANISM}} Ordinary k-fold cross-validation leaks when observations overlap in time: a label that depends on tomorrow's price sits in the training fold beside a test observation from today. López de Prado's purged k-fold removes training observations whose labels overlap the test fold and adds an embargo after it; the combinatorial version tests many train-test paths at once. Any machine-learning result on market data that reports plain k-fold accuracy should be read as untested.

:::example Worked example — a 500-trade backtest, honestly
A backtest of 500 trades, each one Nifty option lot of {{fact:fo-nifty-lot}} at an average premium near ₹150, shows a gross profit of ₹1,20,000: ₹240 a trade, under four points a lot.

- **Costs.** The [charges calculator](../../tools/charges/) prices one such round trip at ₹70.77 with brokerage of {{fact:chg-brokerage-example-options}} on each order — the STT on the sale at {{fact:chg-stt-options-sell}} of premium is the largest line after brokerage. Five hundred trades cost ₹35,385.
- **Slippage.** One tick of {{fact:opt-tick-size-options}} against you on each of two legs is ₹6.50 a trade on a lot of {{fact:fo-nifty-lot}}, so ₹3,250 over the test.
- **Net.** ₹1,20,000 − ₹35,385 − ₹3,250 = ₹81,365. Costs took a third of the gross before the strategy was asked a single hard question.
- **The futures version.** Had the same 500 trades been one Nifty futures lot at an index level near 25,000, each round trip would have cost about ₹966, of which the sell-side STT at {{fact:chg-stt-futures}} of ₹16,25,000 is ₹812.50 on its own; the costs, about ₹4,83,000, would have exceeded the gross.
- **The haircut.** If this strategy was the best of 200 variants, its Sharpe ratio is a maximum over 200 draws, not an estimate; Harvey and Liu's haircut shrinks it with the trial count, and a reader who was not told the count cannot apply it.
- **The shuffle.** The historical maximum drawdown was ₹18,000. Ten thousand shuffles of the same 500 trades put the worst five per cent of paths near ₹36,000 — about twice the figure the history shows — which is the drawdown to size for. The numbers in this example are illustrative, not a record of any real strategy.
:::

## Reading a backtest someone else shows you

Ask five questions in order. Was every signal shifted so that it used only information available at the time? Was the universe the one that existed then? Were the costs today's rates and the slippage at least a tick a leg? Was the result out of sample, on a walk-forward basis, and how many variants were tried before this one? And what does the drawdown distribution look like when the trades are shuffled? A backtest that cannot answer all five is a chart.

:::evidence What the evidence says
- {{label:EVIDENCE}} Momentum (Jegadeesh and Titman, 1993), pairs (Gatev, Goetzmann and Rouwenhorst, with the microstructure caveat), the volatility risk premium (AQR; Cboe's PUT index) and machine-learning forecasts (Gu, Kelly and Xiu) are US findings with linked primary sources; the Indian retail option-selling record is SEBI's FY26 study.
- {{label:MECHANISM}} Mean reversion, and every item on the checklist — look-ahead, survivorship, costs and slippage, walk-forward, the multiple-testing haircut, trade-order Monte Carlo, purged cross-validation — are errors with known causes and textbook treatments (Chan, Pardo, López de Prado).
- {{label:LORE}} Any claim that one of these families "works in Indian intraday" without a dated, out-of-sample record and a trial count is a practitioner's claim. None has a published Indian study behind it.
:::
