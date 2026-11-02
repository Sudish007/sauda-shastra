---
title: Expiry-day dynamics
section: Options
summary: Who trades expiry day and how concentrated it is ({{fact:opt-zero-dte-share-fy26}} of FY26 index-option turnover was in same-day contracts), the close minute by minute under today's closing auction and under the regime that starts on {{date:2026-12-07}}, the {{fact:fo-expiry-day-elm-addon}} margin add-on, exercise versus square-off, and what the pinning evidence does and does not say.
updated: 2026-11-01
level: advanced
order: 4
topics: [expiry day, 0dte, weekly expiry, closing auction session, cas, settlement price, vwap settlement, expiry-day elm, exercise, square off, pinning, position limits]
related: [greeks-for-a-day-trader, iv-expected-move-and-crush, liquidity-slippage-and-sebi-measures, spreads-and-delta-neutral, trading-day-ist, index-derivatives-specs, policy-days-vix-and-sizing, expiry-day-straddle-scalp, 0920-short-straddle, last-hour-positioning]
tools: [expected-move]
sources:
  - SEBI press release 50/2026 (Aug 2026) — Trends in retail participation, trading behaviour and profitability in equity derivatives | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf | accessed 2026-11-01
  - SEBI — Profitability of individual traders in the equity derivatives segment, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
  - SEBI consultation paper Jul 2024 — Measures to strengthen the index derivatives framework (expiry-day turnover tables) | https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1722407296072.pdf | accessed 2026-11-01
  - SEBI circular Oct 2024 (2024/132) — Measures to strengthen the equity index derivatives framework | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf | accessed 2026-11-01
  - SEBI circular Jan 2026 — Introduction of the Closing Auction Session in the equity cash segment | https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf | accessed 2026-11-01
  - SEBI circular Oct 2026 — Review of the CAS, market timings and settlement methodology for derivatives contracts | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf | accessed 2026-11-01
  - SEBI interim order Aug 2026 — Manipulative trades during the closing auction on a Sensex weekly expiry at BSE | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/ORDER_1787144554.pdf | accessed 2026-11-01
  - SEBI circular Sep 2025 (2025/122) — Framework for intraday position-limit monitoring for equity index derivatives | https://www.sebi.gov.in/sebi_data/attachdocs/sep-2025/1756745625835.pdf | accessed 2026-11-01
  - NSE circular SURV/75524 (Jul 2026) — Changes in FutEq intraday monitoring on account of the CAS | https://nsearchives.nseindia.com/content/circulars/SURV75524.pdf | accessed 2026-11-01
  - NSE Clearing circular CMPT/64639 (Oct 2024) — Changes in extreme loss margins (expiry-day example) | https://nsearchives.nseindia.com/content/circulars/CMPT64639.pdf | accessed 2026-11-01
  - NSE Clearing — Settlement price, equity derivatives | https://www.nseclearing.in/clearing-settlement/equity-derivatives/settlement-price | accessed 2026-11-01
  - Retail traders love 0DTE options… but should they? — FoFI 2024 conference paper (Dec 2023) | https://wp.lancs.ac.uk/fofi2024/files/2024/04/FoFI-2024-146-Leander-Gayda.pdf | accessed 2026-11-01
  - Golez and Jackwerth — Pinning in the S&P 500 futures, Journal of Financial Economics (2012), abstract | https://ideas.repec.org/a/eee/jfinec/v106y2012i3p566-585.html | accessed 2026-11-01
  - Journal of Futures Markets (2005) — Futures and options expiration-day effects: the Indian evidence, abstract | https://ideas.repec.org/a/wly/jfutmk/v25y2005i11p1045-1065.html | accessed 2026-11-01
---
## Who trades expiry day

Expiry day is where Indian index-option volume lives. SEBI's [August 2026 press release](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf) on its FY25–FY26 studies puts {{fact:opt-zero-dte-share-fy26}} of FY26 index-options turnover in contracts expiring the same day ("0DTE"), about three-quarters within one day of expiry and almost all of it — ninety-seven per cent — within a week. The underlying [profitability study](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf) gives the earlier years: the same-day share was 70 per cent in FY25 and 38 per cent in FY22, so the concentration has eased slightly since the 2024 measures and remains the dominant pattern.

Within the day, the concentration repeats. SEBI's [consultation paper of July 2024](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1722407296072.pdf) tabulated one weekly expiry: the last half-hour carried 27% (Sensex), 20% (Bankex), 16% (Nifty) and 13% (Bank Nifty) of the expiry day's notional turnover, and the expiry day itself carried 96 per cent, 97 per cent, 64 per cent and 62 per cent respectively of the five-day turnover of those contracts. {{label:EVIDENCE}} The regulator's own reading, in the [October 2024 circular](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf), is that expiry-day index-option trading is largely speculative, with average holding periods measured in minutes and increased index volatility through the day and at expiry.

{{label:EVIDENCE}} The US evidence on the same behaviour is not flattering either. A [conference paper on retail 0DTE trading](https://wp.lancs.ac.uk/fofi2024/files/2024/04/FoFI-2024-146-Leander-Gayda.pdf) found that more than three-quarters of retail S&P 500 option trades were same-day contracts in 2022–23, that retail investors lost on average $241,000 a day on them between February 2021 and September 2023 and $350,000 a day after daily expiries began in May 2022, and that single-leg debit trades in high-IV options drove the losses while multi-leg and short-volatility structures did better.

## The close, minute by minute — today

Since {{date:2026-08-03}} the cash market closes stocks that have derivatives through a Closing Auction Session (CAS), and the expiring index option's settlement value is built from those auction prices. SEBI's [circular of {{date:2026-01-16}}](https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf) sets the mechanics; [The trading day in IST](../trading-day-ist/) covers every session. On an expiry day, in order:

- **Continuous trading** runs {{fact:mkt-continuous-session-cas-stocks}} for stocks with derivatives (other stocks trade {{fact:mkt-continuous-session}}).
- **The auction** occupies {{fact:mkt-closing-session}}: a reference price is computed from the volume-weighted average of the last fifteen minutes of continuous trading; orders are accepted in the {{fact:mkt-cas-order-entry-current}} window, with limit-only entry in its last five minutes and a random close; matching follows. Orders must sit within {{fact:mkt-cas-band}} of the reference price, and stop-loss and iceberg orders are not allowed.
- **Derivatives keep trading** through the auction, until the end of the {{fact:mkt-fo-session}} session. The expiring Nifty option is therefore still quoted while the constituents' closing prices are being discovered.
- **Settlement.** The expiring index option settles on the index value computed from the constituents' CAS closing prices ([NSE Clearing's settlement-price page](https://www.nseclearing.in/clearing-settlement/equity-derivatives/settlement-price) has the rule text). Stock futures and options settle on each stock's volume-weighted price over the last half-hour of its session, across exchanges, and stock contracts deliver shares.

Position limits are monitored through all of this: exchanges take at least {{fact:opt-intraday-monitoring-snapshots}} random snapshots a day, including one in the final stretch after 14:45, and NSE's [circular SURV/75524](https://nsearchives.nseindia.com/content/circulars/SURV75524.pdf) moves the snapshots around the auction so that none falls between its start and the index equilibrium price.

### Why the regime is changing

On the Sensex weekly expiry of {{date:2026-08-13}}, ten days into the auction regime, SEBI's [interim order](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/ORDER_1787144554.pdf) records the indicative Sensex jumping by 362.02 points in two seconds, 132.67 points in twelve seconds and 405.08 points in twenty-eight seconds during the auction, from a reference level of 77,829.60 to a CAS close of 78,079.96; two entities holding expiry-day Sensex options around the 78,000 strike were barred from the auction and ₹3,67,80,773 was impounded. {{label:EVIDENCE}} An enforcement order is not a study, but it shows the weakness of settling a derivative on a single auction print per constituent: a few large orders in a thin auction can move the index that settles thousands of contracts.

:::note From 7 Dec 2026
SEBI's [circular of {{date:2026-10-15}}](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf) rebuilds the close:

- The auction moves to {{fact:opt-cas-window-from-2026-12-07}}, with a one-minute reference price from the last fifteen minutes' VWAP and a random close in its last two minutes; every stock's continuous session then runs {{fact:mkt-continuous-session}}.
- Index and stock derivatives trade {{fact:mkt-fo-session-from-2026-12-07}} — except that an **expiring** index contract stops at {{fact:opt-expiring-index-close-time-from-2026-12-07}} on its expiry day.
- The expiring index contract settles on an index value computed from each constituent's volume-weighted average price over the last thirty minutes of continuous trading, and the exchanges broadcast an indicative value live through that half-hour. Stock derivatives settle on the last thirty minutes' VWAP, including on expiry.
- During the auction window, stock-futures price bands align to the auction band and dynamic flexing is suspended.
:::

For the expiry-day trader the change is sharp. Today you can trade the expiring Nifty option while the constituents' closing prices are being set in the auction. From {{date:2026-12-07}} the expiring contract stops trading at {{fact:opt-expiring-index-close-time-from-2026-12-07}}, at the very moment the thirty-minute average that will settle it is completed — so the last half-hour of its life is traded against a settlement value that is accumulating in plain sight, and once it stops there is nothing more to do but wait for the print. A half-hour average is far harder to move than one auction, which is the point; it also means that a late burst in the index counts for only a fraction of its size in the settlement value. {{label:MECHANISM}} Playbooks for the last hour will be re-based on this regime once it is live.

## Margins on expiry day

Three margin rules make the expiring contract more expensive to be short.

**The ELM add-on.** Every short index option expiring today carries an additional {{fact:fo-expiry-day-elm-addon}} extreme-loss margin on its notional, on positions open at the start of the day and on new shorts opened during it — a total of four per cent, and five per cent for deep out-of-the-money shorts, as the [October 2024 circular](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf) and NSE Clearing's [example circular](https://nsearchives.nseindia.com/content/circulars/CMPT64639.pdf) set out.

:::example
A trader is short one lot of the 25,000 Nifty call on its expiry day. Notional is 25,000 × {{fact:fo-nifty-lot}} = ₹16,25,000, so the extreme-loss margin is about ₹32,500 on a normal day and about ₹65,000 on expiry day, on top of SPAN. A short straddle doubles that. Size by the expiry-day figure, not yesterday's; the [position-size calculator](../../tools/position-size/) sizes from the loss limit and reports the margin alongside.
:::

**No calendar-spread benefit for the expiring leg.** The spread benefit is {{fact:opt-calendar-spread-expiry-rule}}, so a trader long next week's option against this week's short sees the margin on the short leg jump on expiry morning. [Spreads and delta-neutral structures](../spreads-and-delta-neutral/) has the detail.

**Intraday position limits with teeth.** Under SEBI's [circular of {{date:2025-09-01}}](https://www.sebi.gov.in/sebi_data/attachdocs/sep-2025/1756745625835.pdf), from {{date:2025-10-01}} an entity's intraday index-option exposure is capped at {{fact:opt-position-limit-index-intraday-net}} net and {{fact:opt-position-limit-index-intraday-gross}} gross in delta-adjusted terms, checked at the random snapshots above, and an expiry-day breach draws a penalty or a surveillance deposit from {{date:2025-12-06}}. This replaced the regulator's stance of March to May 2025, when intraday breaches were recorded but not penalised; that history is in [Liquidity, slippage and SEBI's measures](../liquidity-slippage-and-sebi-measures/). A retail account is nowhere near the figures, but the market's largest sellers now manage their expiry-afternoon books around snapshot times.

## Exercise or square off?

An index option in the money at settlement is exercised automatically and cash-settled; one out of the money expires worthless with nothing to pay. The cost difference between letting an option be exercised and selling it before the close used to be large, because an exercised option paid a higher rate of securities transaction tax than a sold one. Since {{date:2026-04-01}} the two rates are the same: {{fact:chg-stt-options-exercise}} of the intrinsic value on exercise, and {{fact:chg-stt-options-sell}} of the premium on a sale.

:::example
A long 25,000 call settles with Nifty at 25,120. Intrinsic value is ₹120 × {{fact:fo-nifty-lot}} = ₹7,800 per lot, and the tax on exercise is ₹11.70. Selling the same option at ₹120 a moment before the close carries the same ₹11.70 of tax plus the sell-side brokerage, exchange charge and GST — about ₹27 more on a ₹20-per-order plan — and the risk of a bad fill in a thin last minute. The [charges calculator](../../tools/charges/) has an "exercised" toggle that computes both routes with the register's rates.
:::

So the old reflex "always square off in-the-money options before expiry" no longer saves tax; what it still buys is certainty about the exit price when the settlement value is being discovered in an auction you cannot see into. From {{date:2026-12-07}} that choice disappears for expiring index contracts after {{fact:opt-expiring-index-close-time-from-2026-12-07}}: whatever is open then is settled on the average.

## Pinning, and what the Indian evidence shows

The idea that an index is drawn to a heavily traded strike at expiry has evidence behind it in the US and a weaker Indian record; [Reading the option chain](../reading-the-option-chain/) sets it out. In brief:

- {{label:EVIDENCE}} Golez and Jackwerth ([Journal of Financial Economics, 2012](https://ideas.repec.org/a/eee/jfinec/v106y2012i3p566-585.html)) found S&P 500 futures pulled toward the at-the-money strike on serial-option expiry days and pushed away before index-option expiries, driven by market makers' hedge rebalancing.
- {{label:EVIDENCE}} For India, the [Journal of Futures Markets (2005)](https://ideas.repec.org/a/wly/jfutmk/v25y2005i11p1045-1065.html) found underlying prices marginally depressed the day before NSE expiries and significantly higher the day after, with abnormal expiry-day volume — a reversal pattern around expiry, not a pinning result.
- {{label:LORE}} A Nifty or Sensex max-pain hit rate has no peer-reviewed source. The 2026 Sensex order shows how a single auction could be moved; the thirty-minute settlement from December is designed to make that harder, which also makes any pre-2026 pinning statistic a poor guide to what comes next.

## A checklist for the last session

Nothing here is a trade. These are the facts to have in front of you before holding anything into an expiry afternoon:

1. Which contract expires today — Nifty on {{fact:fo-nifty-weekly-expiry-day}}, Sensex on {{fact:fo-sensex-weekly-expiry-day}}, monthly contracts on the last such day — and whether a holiday has shifted it ([calendar](../../calendar/)).
2. What the at-the-money straddle is pricing for the remaining hours; the [expected-move calculator](../../tools/expected-move/) converts it to a range, and [Greeks for a day trader](../greeks-for-a-day-trader/) explains why gamma dominates after lunch.
3. Whether your position's margin has already been repriced for the add-on, and whether your broker's intraday products are squared off before the close ([Intraday leverage today](../intraday-leverage-today/)).
4. When the expiring contract stops trading — the end of the normal session today, {{fact:opt-expiring-index-close-time-from-2026-12-07}} from {{date:2026-12-07}} — and how its settlement value is being built while you watch.
5. Whether an in-the-money position will be exercised or sold, and what each route costs today.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)), and the regulator's own description of expiry-day trading is "largely speculative". Figures and their sources live in the [verified facts register](../../facts/).
:::

:::evidence What the evidence says
- {{label:EVIDENCE}} Same-day contracts carried the majority of FY26 index-option turnover; one 2024 weekly expiry had up to 27% of its day's turnover in the last half-hour; US retail 0DTE traders lost money on average (2021–2023).
- {{label:EVIDENCE}} A single auction print could be moved: SEBI's August 2026 order on the Sensex expiry.
- {{label:MECHANISM}} A thirty-minute VWAP settlement with trading stopped at its end replaces that print from December 2026; the expiry-day ELM add-on and the loss of the spread benefit make shorts dearer that day.
- {{label:EVIDENCE}} Pinning toward strikes is documented in US futures (2012); Indian expiries show a day-before dip and day-after rise (2005).
- {{label:LORE}} Any Nifty or Sensex max-pain hit rate.
:::
