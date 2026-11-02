---
title: Expiry-day straddle and strangle scalps with strict gamma rules
summary: On the expiring weekly — Nifty on {{fact:fo-nifty-weekly-expiry-day}}, Sensex on {{fact:fo-sensex-weekly-expiry-day}} — gamma, not structure, runs the day. Two scalps with the rules that make each survivable: the bought straddle (long gamma, premium at risk capped) and the sold strangle with wings (short gamma, never into the close), each sized to the extra expiry-day margin.
updated: 2026-11-01
level: advanced
order: 6
instruments: [The expiring Nifty weekly (NSE), The expiring Sensex weekly (BSE)]
window: 09:30–14:30 IST; no new short after 14:30; flat by 15:00
evidence: MECHANISM
glance_stop: Long straddle: 70 per cent of premium paid; short strangle: 1.5× the credit per leg, hard
glance_target: Long gamma: 1× premium paid or out at 13:00; short gamma: half the credit or out at 14:30
glance_size: Premium at risk ≤ one per cent of capital; short legs: a one per cent move costs ≤ two
topics: [expiry day, 0dte, gamma, straddle, strangle, settlement vwap, pinning]
related: [expiry-day-dynamics, greeks-for-a-day-trader, iv-expected-move-and-crush, liquidity-slippage-and-sebi-measures, 0920-short-straddle, last-hour-positioning]
tools: [expected-move, black-scholes-greeks, position-size, charges]
sources:
  - Agarwalla and Pandey — Expiration-Day Effects and the Impact of Short Trading Breaks on Intraday Volatility, Journal of Futures Markets 33(11), 2013 | https://doi.org/10.1002/fut.21632 | accessed 2026-11-01
  - Ni, Pearson and Poteshman — Stock Price Clustering on Option Expiration Dates, SSRN 519044 (Journal of Financial Economics, 2005) | https://doi.org/10.2139/ssrn.519044 | accessed 2026-11-01
  - Golez and Jackwerth — Pinning in the S&P 500 Futures, SSRN 1664261 (Journal of Financial Economics, 2012) | https://doi.org/10.2139/ssrn.1664261 | accessed 2026-11-01
  - Avellaneda and Lipkin — A market-induced mechanism for stock pinning, Quantitative Finance 3(6), 2003 | https://doi.org/10.1088/1469-7688/3/6/301 | accessed 2026-11-01
  - Elms — From Pinning to Amplification, Evidence of a Regime Shift in S&P 500 Options Expiration Dynamics 2016–2025, SSRN working paper 6564078, 2026 | https://doi.org/10.2139/ssrn.6564078 | accessed 2026-11-01
  - Baltussen, Da, Lammers and Martens — Hedging demand and market intraday momentum, Journal of Financial Economics 142(1), 2021 | https://doi.org/10.1016/j.jfineco.2021.04.029 | accessed 2026-11-01
  - SEBI circular (Oct 2024) — Measures to strengthen equity index derivatives framework (2024/132), paras 5.2, 5.3 and 5.6 | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf | accessed 2026-11-01
  - SEBI circular (Jan 2026) — Introduction of Closing Auction Session and modifications in the pre-open session, paras 4.2 and 6.1 | https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf | accessed 2026-11-01
  - SEBI circular (Oct 2026) — Review of the Closing Auction Session, market timings and settlement methodology for derivatives, paras 4.2 and 6.1 | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
  - SEBI press release 50/2026 (Aug 2026) — Trading behaviour of individual traders in equity derivatives, finding A-9 | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf | accessed 2026-11-01
---
## Context & instruments

On its last day an at-the-money option has almost no time value left to lose slowly and all of it to lose or gain suddenly: gamma is at its peak, so a modest index move re-prices every near-the-money contract in minutes. Two scalps live there. The long-gamma scalp buys the at-the-money straddle when the morning range is small relative to the straddle's own price and sells it after one straddle width of movement. The short-gamma scalp sells a strangle away from the money, with bought wings further out, and buys it back after half the credit has decayed. Both are confined to the expiring weekly — Nifty on NSE (one lot is {{fact:fo-nifty-lot}} units) or Sensex on BSE (lot {{fact:fo-sensex-lot}}; BSE charges per your broker's contract note). [Expiry-day dynamics](../../guides/expiry-day-dynamics/) and [Greeks for a day trader](../../guides/greeks-for-a-day-trader/) are the background.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each, ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)), and {{fact:opt-zero-dte-share-fy26}} of index-option turnover was in same-day-expiry contracts ([SEBI press release 50/2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf)). Sources for every figure are in the [verified facts register](../../facts/).
:::

## Time window (IST)

Scalps from 09:30 to 14:30; no new short position after 14:30; everything flat by 15:00. The last half-hour is a settlement-mechanics window, not a trading window. Until {{date:2026-12-06}} the expiring index contract settles on the index built from the constituents' closing-auction prices, with the auction at {{fact:mkt-closing-session}}; after that, expiring index contracts stop trading at {{fact:opt-expiring-index-close-time-from-2026-12-07}} on their expiry day and settle on the constituents' VWAP over the last half-hour of continuous trading, broadcast live. Indian data show expiry-day volatility concentrating in exactly that last half-hour.

## Pre-conditions

- The at-the-money straddle's price at 09:30 is known: it is the day's implied range ([expected-move calculator](../../tools/expected-move/)).
- Strikes with the deepest open interest are used for liquidity ([Reading the option chain](../../guides/reading-the-option-chain/)).
- Margin is computed before the first order, including the additional {{fact:fo-expiry-day-elm-addon}} of contract value on expiring short options and the fact that the calendar-spread benefit is {{fact:opt-calendar-spread-expiry-rule}}.
- No scheduled release coincides with the expiry ([IST calendar](../../calendar/)).

## Entry

Long gamma: buy the at-the-money straddle when the first fifteen minutes' range is below forty per cent of the straddle's price and the index sits at an edge of that range. Short gamma: only after 11:00, sell a strangle one to one-and-a-half straddle widths from the money, and only with bought wings further out. Worked example at illustrative levels: at 09:30 the at-the-money straddle costs ₹120 (call ₹60, put ₹60), so the premium at risk is ₹120 × {{fact:fo-nifty-lot}} = ₹7,800 per lot.

## Stop

Long straddle: thirty per cent of the premium paid — in the example a stop at ₹84, a loss of ₹36 a unit or ₹2,340 per lot. Short strangle: 1.5 times the credit, per leg, hard, with no averaging and no "rolling" of a leg that is being run over.

## Target / exit

Long gamma: one times the premium paid — the straddle doubles when the index has moved one straddle width — or exit at 13:00 if it has not happened. Short gamma: fifty per cent of the credit, or 14:30, whichever comes first. Never carry short gamma past 15:00.

## Position-size rule

Bought straddles: premium at risk at most one per cent of capital, so ₹7,800 per lot means one lot for every ₹7,80,000 of capital; the [position-size calculator](../../tools/position-size/) takes the premium as the stop. Short strangles: size so that a one per cent index move, about 252 points at these levels, costs no more than two per cent of capital after the wings, and keep the add-on margin in the account — on a contract value of 25,200 × {{fact:fo-nifty-lot}} = ₹16,38,000 the expiry-day add-on is roughly ₹32,760 per short lot. Position limits are checked at a minimum of {{fact:opt-intraday-monitoring-snapshots}} random snapshots a day. The [charges calculator](../../tools/charges/) prices a four-leg round trip; [Position sizing and loss limits](../../guides/position-sizing-and-loss-limits/) sets the daily cap.

## When NOT to trade

- A scheduled event on the expiry day itself.
- Straddle premium below the index's ten-day median first-hour range: no room for the long scalp, and the short scalp is selling too cheaply.
- After two stop-outs in the day.
- The last half-hour, when the settlement price is being formed.
- Both exchanges' expiries on the same day after a holiday shift ([IST calendar](../../calendar/)).

## Known failure modes

- **Gamma squeeze on a short leg.** Near the close a modest move can multiply a cheap option several times; the per-leg stop and the bought wing are what cap it.
- **Expecting a pin.** US evidence of expiry pinning comes from earlier decades; a 2016–2025 S&P 500 sample finds none and shows wider ranges on high-open-interest days instead.
- **Wings with no bid.** Far out-of-the-money liquidity vanishes in a fast market, so the hedge is bought first and the shorts are closed first.
- **Broker risk-desk order.** A risk desk may square off the hedge before the short; know the policy and the {{fact:chg-rms-squareoff-example-broker}} fee one broker publishes for it.
- **Freeze-quantity splits.** Orders above {{fact:fo-freeze-qty-nifty}} units are split and the later slices fill worse ([Liquidity, slippage and SEBI's measures](../../guides/liquidity-slippage-and-sebi-measures/)).

## Evidence label

:::evidence Mechanism, with evidence on the environment
- {{label:MECHANISM}} Gamma peaks for at-the-money options at expiry; the premium path on the day follows from that, not from any study.
- {{label:EVIDENCE}} India: stock volatility rose in the last half-hour of expiry day and not in other intervals when single-stock futures settled on the last-half-hour spot VWAP (Agarwalla and Pandey, 2013, NSE data) — the regime India returns to from {{date:2026-12-07}}.
- {{label:EVIDENCE}} US pinning: optionable stocks clustered at strikes on expiry dates (Ni, Pearson and Poteshman, 2005) and S&P 500 futures were pulled toward the at-the-money strike (Golez and Jackwerth, 2012), with a delta-hedging model behind it (Avellaneda and Lipkin, 2003); a 2016–2025 working paper finds no pinning and wider ranges on high-open-interest days (Elms, 2026).
- {{label:EVIDENCE}} Intraday momentum into the last half-hour across sixty-plus futures markets is linked to gamma-hedging demand (Baltussen and others, 2021). The margin, spread-benefit, snapshot and settlement rules are SEBI circulars of October 2024, January 2026 and October 2026.
:::

## Schematic

<figure class="schematic">
  <svg viewBox="0 0 720 280" role="img" aria-labelledby="sch-title">
    <title id="sch-title">Expiry-day long straddle: the at-the-money straddle's premium through the day, rising in the morning as the index moves and then decaying; a dotted vertical marks the purchase at 09:30, a long-dashed line the target where the premium has doubled, a short-dashed line the stop, and a shaded band at the right the last half-hour when settlement is computed.</title>
    <line class="ax" x1="40" y1="250" x2="700" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="ax" x1="40" y1="20" x2="40" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="60" y1="250" x2="60" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="110" y1="250" x2="110" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="600" y1="250" x2="600" y2="262" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="632" y="20" width="68" height="230" rx="3" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="60,160 85,172 110,170 135,150 160,120 185,100 210,88 235,110 260,128 285,140 310,150 335,162 360,170 385,180 410,186 435,194 460,200 485,206 510,212 535,216 560,222 585,226 610,232 635,222 660,204 685,236" vector-effect="non-scaling-stroke"/>
    <line class="stop" x1="110" y1="194" x2="700" y2="194" vector-effect="non-scaling-stroke"/>
    <line class="target" x1="110" y1="90" x2="700" y2="90" vector-effect="non-scaling-stroke"/>
    <line class="entry" x1="110" y1="170" x2="110" y2="250" vector-effect="non-scaling-stroke"/>
  </svg>
  <figcaption class="legend">
    <ul>
      <li><span class="sw sw-band" aria-hidden="true"></span><span>Shaded band — the last half-hour, when the settlement price forms and nothing new is opened</span></li>
      <li><span class="sw sw-line sw-price" aria-hidden="true"></span><span>Solid line — the at-the-money straddle's premium through expiry day</span></li>
      <li><span class="sw sw-line sw-entry" aria-hidden="true"></span><span>Dotted vertical — entry: the straddle bought at 09:30 with the index at the edge of a small range</span></li>
      <li><span class="sw sw-line sw-stop" aria-hidden="true"></span><span>Short-dashed ▼ line — stop at seventy per cent of the premium paid</span></li>
      <li><span class="sw sw-line sw-target" aria-hidden="true"></span><span>Long-dashed ▲ line — target: the premium doubles after one straddle width of movement</span></li>
    </ul>
    <p>Time runs left to right from the open to the close and the vertical axis is the straddle's premium; the tick marks are the open, the entry (09:30) and the 15:00 cut-off. Schematic, not real data.</p>
  </figcaption>
</figure>
