---
title: The 09:20 short straddle and why its edge eroded
summary: A case study, not a recommendation — selling the at-the-money call and put of the nearest weekly five minutes after the open, with a fixed stop per leg. The timing is lore from backtesting platforms; the rules that changed since 2024 (one weekly per exchange, a {{fact:fo-min-contract-value}} minimum contract value, extra expiry-day margin, upfront premium) removed the conditions it depended on.
updated: 2026-11-01
level: advanced
order: 5
instruments: [Nifty weekly options (NSE), Sensex weekly options (BSE)]
window: Entry 09:20; out by 15:00 or at the stop
evidence: LORE
glance_stop: Per leg at 1.5–2× its premium, or combined at a quarter to a third of the credit
glance_target: Keep 40–50 per cent of the credit by 14:00, or exit at 15:00 regardless
glance_size: Risk the stop amount, not the margin: one lot per ₹6,000 of risk budget
topics: [short straddle, 0920, theta, premium selling, sebi measures, weekly expiry]
related: [buying-vs-selling-options, spreads-and-delta-neutral, liquidity-slippage-and-sebi-measures, what-sebi-loss-studies-say, event-day-iv-crush-hedged, expiry-day-straddle-scalp]
tools: [expected-move, black-scholes-greeks, position-size]
sources:
  - Zerodha Varsity — Option Strategies, The Short Straddle | https://zerodha.com/varsity/chapter/the-short-straddle/ | accessed 2026-11-01
  - SEBI circular (Oct 2024) — Measures to strengthen equity index derivatives framework (2024/132), paras 5.1–5.6 | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf | accessed 2026-11-01
  - SEBI circular (May 2025) — Final settlement day (expiry day) for equity derivatives (2025/76) | https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748266377271.pdf | accessed 2026-11-01
  - SEBI press release (Jul 2025) — Comparative study of growth in trading in equity derivatives vis-à-vis the cash market after recent measures | https://www.sebi.gov.in/sebi_data/attachdocs/jul-2025/1751900802566.pdf | accessed 2026-11-01
  - SEBI press release (Sep 2024) — Updated study on the profitability of individual traders in equity derivatives (PR 22/2024) | https://www.sebi.gov.in/sebi_data/attachdocs/sep-2024/1727086965496.pdf | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
  - SEBI press release 50/2026 (Aug 2026) — Trading behaviour of individual traders in equity derivatives, finding A-9 | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf | accessed 2026-11-01
  - Zerodha Support — Why is the entire margin required to enter into a hedged position? (broker example) | https://support.zerodha.com/category/trading-and-markets/margins/margin-leverage-and-product-and-order-types/articles/hedged-position-margins | accessed 2026-11-01
---
## Context & instruments

For a few years the most-shared intraday options idea in India was mechanical: at 09:20, sell the at-the-money call and the at-the-money put of the nearest weekly expiry, place a stop on each leg, and let the day's time decay pay. It was taught by backtesting platforms and social media, not by any study. This page keeps it as a case study of a strategy whose conditions changed by regulation. Today the only weeklies are Nifty on NSE, expiring on {{fact:fo-nifty-weekly-expiry-day}}, and Sensex on BSE, expiring on {{fact:fo-sensex-weekly-expiry-day}}; Bank Nifty weekly options are {{fact:fo-banknifty-weekly-status}}. One Nifty lot is {{fact:fo-nifty-lot}} units; a Sensex lot is {{fact:fo-sensex-lot}} units, and BSE charges per your broker's contract note. [Spreads and delta-neutral structures](../../guides/spreads-and-delta-neutral/) covers the mechanics the straddle rests on.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each, after {{fact:sebi-loss-2025-share}} in FY25 ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). Every figure's source is in the [verified facts register](../../facts/).
:::

## Time window (IST)

Entry at 09:20, after the first five minutes have absorbed the opening auction. Exit by 15:00 or at the stop, never later: derivatives trade in the {{fact:mkt-fo-session}} session today, but a straddle held into the last half-hour is exposed to the day's second volatility peak with no time left to recover. On the expiry day of the contract the additional expiry-day margin applies to both short legs from the moment they are sold.

## Pre-conditions

As the lore ran: India VIX in a middling regime, no scheduled event, both legs liquid at the strike. As the playbook now reads, three computations come first, and if any of them fails there is no trade:

- The margin for one lot including the expiry-day add-on of {{fact:fo-expiry-day-elm-addon}} of contract value on short options expiring that day.
- The premium at risk at the stop, in rupees per lot, against the daily loss limit.
- The expected move priced by the straddle itself ([expected-move calculator](../../tools/expected-move/)) against the day's event list ([IST calendar](../../calendar/)).

## Entry

Sell the at-the-money call and put of the nearest weekly. Worked example at illustrative levels: with the index at 25,200 the 25,200 call trades at ₹95 and the put at ₹90, a credit of ₹185 a unit, which at a lot of {{fact:fo-nifty-lot}} units is ₹12,025 per lot. The breakevens at expiry are the strike plus and minus the credit, 25,015 and 25,385 — about 0.73 per cent either side.

## Stop

Per leg at 1.5 to 2 times that leg's premium, or a combined stop when the straddle's value has risen by a quarter to a third of the credit: ₹46–55 a unit in the example, ₹2,990–3,575 per lot. Hard stops, placed at entry, never widened. The alternative to a stop is a hedge: buying wings turns the position into an iron fly, the structure [Event-day IV crush, hedged](../event-day-iv-crush-hedged/) uses.

## Target / exit

Time decay: when the straddle has lost 40 to 50 per cent of its value, usually by early afternoon, buy it back. Exit at 15:00 regardless. The breakevens are the zone where "do nothing" is the right action, not an exit rule, because an expiry-day straddle can trade well outside them at noon and inside them at the close.

## Position-size rule

Size by the stop, not by the margin. The margin is large: one broker's published example shows a short Nifty futures lot needing about ₹1.07 lakh unhedged and about ₹44,000 once a bought option hedges it, and the contract value in the example, 25,200 × {{fact:fo-nifty-lot}} = ₹16,38,000, adds roughly ₹32,760 of extra margin per short lot on expiry day. With a ₹6,000 risk budget and the combined stop above, the answer is one lot. The [position-size calculator](../../tools/position-size/) takes a rupee stop directly; [Position sizing and loss limits](../../guides/position-sizing-and-loss-limits/) explains why the margin is never the risk figure.

## When NOT to trade

- Event days: RBI policy at {{fact:mac-rbi-mpc-time-ist}}, the Budget, India or US CPI, FOMC overnight, a results window for index heavyweights.
- Expiry day without the add-on margin already in the account.
- When one leg's stop alone would exceed the daily loss limit.
- A VIX spike overnight: the credit is bigger because the move is bigger.
- When the lot's contract value — ₹16.38 lakh in the example — is more than four times the trading capital.

## Known failure modes

- **The one-sided trend day.** A one per cent move, 252 points, against the straddle costs about (252 − 185) × {{fact:fo-nifty-lot}} = ₹4,355 per lot before costs if nothing else changes, and more with slippage on the stop.
- **The double stop-out.** Both legs are stopped in a whipsaw, the market closes near the strike, and the straddle would have expired worthless.
- **Overnight gap.** Never held overnight; the stop cannot protect a position while the market is closed.
- **Margin calls from intraday snapshots.** At least {{fact:opt-intraday-monitoring-snapshots}} random snapshots a day check positions, and the calendar-spread benefit is {{fact:opt-calendar-spread-expiry-rule}}.
- **Expiry-day gamma.** A cheap option can multiply several times in minutes near the close; [Expiry-day straddle scalp](../expiry-day-straddle-scalp/) has the rules for that day.

## Evidence label

:::evidence Lore: the timing was never studied, and the rules that made it work are gone
- {{label:LORE}} The 09:20 timing and the claimed edge come from platform backtests and social media; no primary study of its profitability exists. The mechanics are those of any short straddle (Zerodha Varsity).
- {{label:EVIDENCE}} The environment changed by rule (SEBI, October 2024 and May 2025): weekly expiries limited to {{fact:opt-weekly-expiries-per-exchange}} benchmark index per exchange, the minimum contract value raised from ₹5–10 lakh to {{fact:fo-min-contract-value}}, an additional {{fact:fo-expiry-day-elm-addon}} ELM on expiring short options, upfront premium from buyers since {{fact:opt-upfront-premium-since}}, no calendar-spread offset on expiry day, intraday position snapshots.
- {{label:EVIDENCE}} SEBI's own data record expiry-day index-option trading with holding periods measured in minutes (the July 2024 consultation cited in the October 2024 circular); in FY26, {{fact:opt-zero-dte-share-fy26}} of index-option turnover was in same-day-expiry contracts, and {{fact:sebi-loss-2026-share}} of individual F&O traders lost money. Whatever edge existed depended on cheap, frequent weeklies and thin margins; those conditions no longer hold.
:::

## Schematic

<figure class="schematic">
  <svg viewBox="0 0 720 280" role="img" aria-labelledby="sch-title">
    <title id="sch-title">Schematic of a short straddle's payoff at expiry: the horizontal axis is the index level, the vertical axis is profit or loss with a zero line across the middle; the payoff line rises from the left to a peak at the strike and falls again to the right; a shaded band marks the profit zone between the two breakevens; a dotted vertical marks the at-the-money strike; a short-dashed line below zero marks the combined stop and a long-dashed line above zero marks the target.</title>
    <line class="ax" x1="40" y1="250" x2="700" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="ax" x1="40" y1="20" x2="40" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="ax" x1="40" y1="170" x2="700" y2="170" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="210" y1="250" x2="210" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="360" y1="250" x2="360" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="510" y1="250" x2="510" y2="262" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="210" y="90" width="300" height="80" rx="3" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="60,250 210,170 360,90 510,170 660,250" vector-effect="non-scaling-stroke"/>
    <line class="stop" x1="60" y1="194" x2="700" y2="194" vector-effect="non-scaling-stroke"/>
    <line class="target" x1="60" y1="134" x2="700" y2="134" vector-effect="non-scaling-stroke"/>
    <line class="entry" x1="360" y1="90" x2="360" y2="250" vector-effect="non-scaling-stroke"/>
  </svg>
  <figcaption class="legend">
    <ul>
      <li><span class="sw sw-band" aria-hidden="true"></span><span>Shaded band — the profit zone between the two breakevens at expiry</span></li>
      <li><span class="sw sw-line sw-price" aria-hidden="true"></span><span>Solid line — the straddle's profit or loss at expiry against the index level</span></li>
      <li><span class="sw sw-line sw-entry" aria-hidden="true"></span><span>Dotted vertical — the at-the-money strike where both legs are sold at 09:20</span></li>
      <li><span class="sw sw-line sw-stop" aria-hidden="true"></span><span>Short-dashed ▼ line — combined stop: a loss of a quarter to a third of the credit</span></li>
      <li><span class="sw sw-line sw-target" aria-hidden="true"></span><span>Long-dashed ▲ line — target: about half the credit kept, then out by 15:00</span></li>
    </ul>
    <p>The horizontal axis is the index level, the vertical axis is profit or loss, and the middle rule is zero; the tick marks are the lower breakeven, the strike and the upper breakeven. Schematic, not real data.</p>
  </figcaption>
</figure>
