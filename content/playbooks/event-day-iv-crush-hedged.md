---
title: Event-day IV crush, sold with a hedge
summary: Selling the premium that a scheduled event (RBI policy, the Budget, CPI, FOMC, a stock's results) builds into at-the-money options, always as an iron fly or iron condor with the wings bought first. The pricing of event uncertainty is documented in US equity options; the crush is arithmetic; any Indian event-day win rate is lore.
updated: 2026-11-01
level: advanced
order: 10
instruments: [Nifty or Sensex weekly options as an iron fly or iron condor, Stock options around results (physical settlement applies)]
window: Entry 30–60 minutes before an intraday release; out within 60–90 minutes after it or at the stop
evidence: EVIDENCE
glance_stop: Half the net credit lost, or price through a short strike's breakeven before IV has fallen
glance_target: 40–60 per cent of the net credit once IV collapses after the release; exit as one ticket
glance_size: Max loss of the structure ≤ two per cent of capital; wings first for the hedged margin
topics: [iv crush, event day, iron fly, iron condor, rbi policy, budget, results, hedged selling]
related: [iv-expected-move-and-crush, policy-days-vix-and-sizing, spreads-and-delta-neutral, greeks-for-a-day-trader, intraday-leverage-today, 0920-short-straddle, expiry-day-straddle-scalp]
tools: [expected-move, black-scholes-greeks, position-size]
sources:
  - Johannes and Dubinsky — Earnings Announcements and Option Prices, SSRN working paper 600593 (2004/2006) | https://doi.org/10.2139/ssrn.600593 | accessed 2026-11-01
  - Dubinsky, Johannes, Kaeck and Seeger — Option Pricing of Earnings Announcement Risks, Review of Financial Studies 32(2), 2019 | https://doi.org/10.1093/rfs/hhy060 | accessed 2026-11-01
  - Zerodha Support — Why is the entire margin required to enter into a hedged position? (broker example) | https://support.zerodha.com/category/trading-and-markets/margins/margin-leverage-and-product-and-order-types/articles/hedged-position-margins | accessed 2026-11-01
  - SEBI circular (Oct 2024) — Measures to strengthen equity index derivatives framework (2024/132), paras 5.1, 5.2 and 5.6 | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf | accessed 2026-11-01
  - Zerodha Varsity — Option Strategies, The Short Straddle | https://zerodha.com/varsity/chapter/the-short-straddle/ | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
---
## Context & instruments

Before a scheduled release, option prices carry the uncertainty of the outcome: implied volatility rises into the event and falls the moment the number is known, whatever the number is. That fall is the IV crush, and selling into it is a trade on the event's uncertainty rather than its direction. The playbook sells the at-the-money straddle on Nifty or Sensex weeklies — never naked — inside an iron fly (wings one strike interval or more away) or an iron condor, with the wings bought first. Around results the same structure uses the stock's options ({{fact:fo-stock-fo-settlement}} at expiry). One Nifty lot is {{fact:fo-nifty-lot}} units; a Sensex lot is {{fact:fo-sensex-lot}}, with BSE charges per your broker's contract note. [IV, expected move and crush](../../guides/iv-expected-move-and-crush/) is the background; [Spreads and delta-neutral structures](../../guides/spreads-and-delta-neutral/) prices the fly.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). Event premium is high because events move markets. Sources for every figure are in the [verified facts register](../../facts/).
:::

## Time window (IST)

For an intraday release — RBI's statement at {{fact:mac-rbi-mpc-time-ist}}, the Budget speech on {{fact:mac-budget-date}} — enter thirty to sixty minutes before it and exit within sixty to ninety minutes after it, or at the stop. India CPI at {{fact:mac-india-cpi-release-ist}}, US CPI at {{fact:mac-us-cpi-release-ist-dst}} (or {{fact:mac-us-cpi-release-ist-std}} in US winter) and FOMC statements at {{fact:mac-fomc-statement-ist-dst}} or {{fact:mac-fomc-statement-ist-std}} all land after the Indian close; for those, enter between 14:30 and 15:00 the day before and only hedged, because overnight gap risk on an unhedged short leg is unlimited. The [IST calendar](../../calendar/) lists every date.

## Pre-conditions

- The at-the-money straddle is expensive against its ten-day median — implied volatility in the top third of its recent range ([expected-move calculator](../../tools/expected-move/)).
- Wings exist with open interest at the strikes you need, so they can be bought and later sold.
- The margin for the hedged structure is computed first, and if the sold options expire that day, the additional {{fact:fo-expiry-day-elm-addon}} of contract value is in the account.
- The expected move priced by the straddle is smaller than the wing width.

## Entry

Buy the wings first, then sell the at-the-money straddle, because the broker charges full margin on a short leg until its hedge exists. Worked example at illustrative levels: sell the 25,200 call and put for ₹185 in total; buy the 25,500 call and the 24,900 put for ₹25 each. Net credit ₹135 a unit, or ₹135 × {{fact:fo-nifty-lot}} = ₹8,775 per lot; maximum loss (300 − 135) × {{fact:fo-nifty-lot}} = ₹10,725 per lot, reached only if the index closes beyond a wing at expiry.

## Stop

Half the net credit lost — about ₹4,390 per lot in the example — or price trading through a short strike's breakeven before implied volatility has fallen. The stop is a single ticket for the whole structure, never one leg.

## Target / exit

Forty to sixty per cent of the net credit once implied volatility collapses after the release. Illustrative: with no index move and IV falling from 16 to 12 per cent, the straddle goes from about ₹185 to about ₹140, a gain of ₹45 a unit or ₹2,925 per lot before the wings' small loss of value. Exit the whole structure together; a fly unwound one leg at a time is a different position at every step.

## Position-size rule

The structure's maximum loss is the risk figure: keep it at or below two per cent of capital, so ₹10,725 per lot means one lot for every ₹5.4 lakh of capital. The hedge is also what makes the margin workable — one broker's published example shows a short futures lot's margin falling from about ₹1.07 lakh to about ₹44,000 once a bought option hedges it, and option spreads behave the same way; the broker's calculator decides. The [position-size calculator](../../tools/position-size/) takes the maximum loss as the stop; [Position sizing and loss limits](../../guides/position-sizing-and-loss-limits/) sets the daily cap.

## When NOT to trade

- Unscheduled events: there is no inflated premium to sell, only risk.
- When the straddle's expected move exceeds the wing width — the market expects a move the fly cannot absorb.
- When the release falls in the last fifteen minutes of trading or after hours and the structure is not fully hedged.
- Expiry day of the sold options without the add-on margin already budgeted.
- When the structure cannot be entered and exited as one ticket on your platform (leg risk).

## Known failure modes

- **The move exceeds the wings.** Budget days have produced swings larger than a week's expected move; the loss is then the wing width minus the credit.
- **IV rises instead of falling.** The event spawns a second event — a press conference, a follow-up number — and uncertainty is re-priced upward.
- **Wings with no bid.** In the first minute after the release the far strikes go illiquid; buying them first and selling them last is the order of operations for a reason.
- **Assignment at expiry.** Short stock-option legs left to expiry in the money are physically settled; close them.
- **The hedge leaves first.** Selling the wing before the short, or a broker's risk desk doing it, spikes the margin to the naked level at once.

## Evidence label

:::evidence Evidence that events are priced in; mechanism for the crush; lore for the win rate
- {{label:EVIDENCE}} Uncertainty about scheduled earnings announcements is priced into US individual equity options and leaves after the announcement; the authors estimate "earnings jump volatility" from option prices (Johannes and Dubinsky, working paper; peer-reviewed as Dubinsky, Johannes, Kaeck and Seeger, Review of Financial Studies 2019 — title-level citation).
- {{label:MECHANISM}} The crush arithmetic — a straddle priced roughly in proportion to implied volatility — and the lower margin on a hedged structure (broker example) are explained, not measured.
- {{label:EVIDENCE}} Rules: upfront premium from buyers since {{fact:opt-upfront-premium-since}}, the calendar-spread benefit {{fact:opt-calendar-spread-expiry-rule}}, and the extra expiry-day ELM (SEBI, October 2024).
- {{label:LORE}} Any claimed win rate for selling Indian event days: no public study.
:::

## Schematic

<figure class="schematic">
  <svg viewBox="0 0 720 280" role="img" aria-labelledby="sch-title">
    <title id="sch-title">Iron-fly payoff at expiry: index level left to right, profit or loss up and down with a zero line across the middle; the payoff is flat at the maximum loss beyond either wing and peaks at the sold strike; a shaded band marks the profit zone between the breakevens, a dotted vertical the strike, a short-dashed line the stop below zero and a long-dashed line the target above it.</title>
    <line class="ax" x1="40" y1="250" x2="700" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="ax" x1="40" y1="20" x2="40" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="ax" x1="40" y1="170" x2="700" y2="170" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="180" y1="250" x2="180" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="279" y1="250" x2="279" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="360" y1="250" x2="360" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="441" y1="250" x2="441" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="540" y1="250" x2="540" y2="262" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="279" y="109" width="162" height="61" rx="3" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="60,244 180,244 360,109 540,244 660,244" vector-effect="non-scaling-stroke"/>
    <line class="stop" x1="60" y1="200" x2="700" y2="200" vector-effect="non-scaling-stroke"/>
    <line class="target" x1="60" y1="140" x2="700" y2="140" vector-effect="non-scaling-stroke"/>
    <line class="entry" x1="360" y1="109" x2="360" y2="250" vector-effect="non-scaling-stroke"/>
  </svg>
  <figcaption class="legend">
    <ul>
      <li><span class="sw sw-band" aria-hidden="true"></span><span>Shaded band — the profit zone between the two breakevens at expiry</span></li>
      <li><span class="sw sw-line sw-price" aria-hidden="true"></span><span>Solid line — the iron fly's profit or loss at expiry, capped beyond either wing</span></li>
      <li><span class="sw sw-line sw-entry" aria-hidden="true"></span><span>Dotted vertical — the at-the-money strike where the straddle is sold, after the wings are bought</span></li>
      <li><span class="sw sw-line sw-stop" aria-hidden="true"></span><span>Short-dashed ▼ line — stop: half the net credit lost</span></li>
      <li><span class="sw sw-line sw-target" aria-hidden="true"></span><span>Long-dashed ▲ line — target: about half the net credit kept after the crush</span></li>
    </ul>
    <p>The horizontal axis is the index level, the vertical axis is profit or loss and the middle rule is zero; the tick marks are the lower wing, the lower breakeven, the strike, the upper breakeven and the upper wing. Schematic, not real data.</p>
  </figcaption>
</figure>
