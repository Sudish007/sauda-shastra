---
title: OI-shift breakout
summary: A breakout through a clean level, taken only after the option chain shows writers at the strike beyond it covering and writers below it adding — the "shift" in change-in-OI. The one Indian study finds OI repositioning follows breaks rather than leading them, so this playbook uses open interest as context and confirmation, never as the trigger.
updated: 2026-11-01
level: advanced
order: 7
instruments: [Nifty 50 or Bank Nifty futures, A near-the-money weekly option bought in the breakout direction]
window: 09:45–14:30 IST
evidence: MECHANISM
glance_stop: Back inside the range below the level, with a small buffer; worked 45-point stop
glance_target: The next heavy-OI strike (about 1.9R); out early if OI at the break strike rebuilds
glance_size: One per cent of capital ÷ the stop, one unit only: a confirmation filter, not an edge
topics: [open interest, change in oi, breakout, option chain, writers, oi walls]
related: [reading-the-option-chain, price-action-market-structure, candles-order-flow-depth, index-derivatives-specs, orb-15-min-nifty]
tools: [position-size]
sources:
  - S — Open Interest Repositioning around Intraday Price-structure Breaks, Evidence from Nifty 50 Index Options, SSRN working paper 7394780, 2026 | https://doi.org/10.2139/ssrn.7394780 | accessed 2026-11-01
  - Bhuyan and Chaudhury — Trading on the Information Content of Open Interest, SSRN 288123 (Derivatives Use, Trading and Regulation, 2005) | https://doi.org/10.2139/ssrn.288123 | accessed 2026-11-01
  - SEBI circular (May 2025) — Measures for enhancing trading convenience and strengthening risk monitoring in equity derivatives (2025/79), paras 5.1 and 5.5 | https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748521484014.pdf | accessed 2026-11-01
  - Elms — From Pinning to Amplification, Evidence of a Regime Shift in S&P 500 Options Expiration Dynamics 2016–2025, SSRN working paper 6564078, 2026 | https://doi.org/10.2139/ssrn.6564078 | accessed 2026-11-01
  - NSE Clearing — Participant-wise open interest, daily file (Oct 2026) | https://nsearchives.nseindia.com/content/nsccl/fao_participant_oi_30102026.csv | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
---
## Context & instruments

The option chain's change-in-OI columns show where option writers are adding and where they are covering. The lore reads a "shift" — call open interest at the strike just above a resistance level falling while put open interest at the strike below rises — as writers conceding that the level will break. The playbook trades Nifty 50 or Bank Nifty futures (one lot is {{fact:fo-nifty-lot}} or {{fact:fo-banknifty-lot}} units) or a near-the-money weekly option in the breakout direction, but it inverts the lore's logic: the price break is the trade and the OI shift is a filter that must already be visible, because the only Indian study of the question found that OI repositioning tracks breaks rather than anticipating them. [Reading the option chain](../../guides/reading-the-option-chain/) explains every column used here.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). Open interest is a crowd count, not a forecast. Sources for every figure are in the [verified facts register](../../facts/).
:::

## Time window (IST)

Entries from 09:45 to 14:30. The first half-hour's OI changes are dominated by overnight positions being adjusted and are noisy; after 14:30 the chain is increasingly about closing positions, and on the day before an expiry about rolling them. OI figures on most platforms update with a lag of a few minutes, so a shift that "appears" at the moment of the break was printed earlier.

## Pre-conditions

- A clean structure level: a range high or low, or the previous day's high or low ([Price action and market structure](../../guides/price-action-market-structure/)).
- Call OI at the strike just above resistance falling through the session while put OI at the strike just below rises — the shift — visible before the break, not inferred after it.
- Price within two-tenths of a per cent of the level, so the break is imminent rather than hoped for.
- Not the expiry day of the instrument, when OI changes are dominated by unwinding.

## Entry

On the 5-minute close through the level with the OI shift already on the screen. Never before the close: the data say open interest follows price, so an entry on the OI change alone is a bet on a break that has not happened. One entry per level per day.

## Stop

Back inside the range below the level, with a small buffer. Worked example at illustrative levels: the level is 25,300, the breakout candle closes at 25,315, and the stop sits at 25,270, a 45-point stop, which at a lot of {{fact:fo-nifty-lot}} units is ₹2,925 per lot.

## Target / exit

The next strike carrying heavy open interest — 25,400 in the example, 85 points for 45 risked, about 1.9R — because that is where the next set of writers will defend. Exit early if open interest at the breakout strike rebuilds within thirty minutes of the break: writers re-selling the level is the shift reversing. Strikes on Nifty are spaced {{fact:opt-strike-interval-nifty}} apart, so the target is usually two strikes away.

## Position-size rule

One unit only, because this is a confirmation filter and not an edge. Lots = the risk budget divided by the stop in rupees, rounded down: on a one-per-cent rule with ₹6,00,000 of capital, ₹6,000 ÷ ₹2,925 = 2.05, so two lots. The [position-size calculator](../../tools/position-size/) does the arithmetic; [Position sizing and loss limits](../../guides/position-sizing-and-loss-limits/) sets the daily cap of two to three R.

## When NOT to trade

- Expiry day, when open interest is being unwound rather than built.
- When the "wall" at a strike may be an institutional hedge rather than a directional bet: since SEBI moved index limits to delta-adjusted future-equivalent terms — {{fact:opt-position-limit-index-eod-net}} net and {{fact:opt-position-limit-index-eod-gross}} gross per entity at end of day — the largest open interest is often delta-hedged inventory with no view at all.
- Inside the first thirty minutes of the session.
- Around scheduled releases ([IST calendar](../../calendar/)).

## Known failure modes

- **Late print.** The shift appears after the move, the entry is late and the stop is wide; the two-tenths-of-a-per-cent proximity rule limits how late.
- **Shift back.** The breakout fails and writers re-sell the strike; the thirty-minute rebuild rule is the exit.
- **Total OI instead of change in OI.** A strike with huge total OI built over weeks says nothing about today; only the change does.
- **Mixing units.** Open interest is quoted in contracts on some screens and in units on others; a lot is {{fact:fo-nifty-lot}} units on Nifty, so the two differ by that factor.
- **Max-pain folklore.** The belief that price is drawn to the strike where option holders lose most is a separate claim with its own weak evidence; it is not part of this setup.

## Evidence label

:::evidence Mechanism, with contrary evidence
- {{label:EVIDENCE}} Contrary: on a year of Nifty 50 index-option data, the put-minus-call change in open interest around intraday structure breaks is associated with the break's direction but builds before and after confirmation — reactive, not anticipatory — and a parameter-locked real-time signal did not survive the January–April 2026 hold-out (SSRN working paper, 2026).
- {{label:EVIDENCE}} Weak support: an old US study found information in open-interest distributions, but on thirty stocks over five months of 1999 (Bhuyan and Chaudhury).
- {{label:MECHANISM}} Position limits in future-equivalent terms (SEBI, May 2025) explain why large open interest need not mean conviction: a market maker's hedged book shows up as OI too.
- {{label:EVIDENCE}} High open interest at a strike went with wider, not narrower, ranges in 2016–2025 S&P 500 expiry data (Elms, 2026) — US, and about expiry day, but a warning against reading walls as magnets.
:::

## Schematic

<figure class="schematic">
  <svg viewBox="0 0 720 280" role="img" aria-labelledby="sch-title">
    <title id="sch-title">Schematic of an OI-shift breakout: a thin shaded band marks the resistance level; the price line consolidates below it and then closes above it, where a dotted vertical marks the entry; a short-dashed stop line sits back inside the range below the level and a long-dashed target line sits at the next heavy-open-interest strike above; four small shaded columns near the bottom show call open interest at the strike above shrinking and put open interest at the strike below growing before the break. Tick marks at the open, the earliest entry time and the last entry time.</title>
    <line class="ax" x1="40" y1="250" x2="700" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="ax" x1="40" y1="20" x2="40" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="60" y1="250" x2="60" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="120" y1="250" x2="120" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="610" y1="250" x2="610" y2="262" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="60" y="118" width="640" height="10" rx="2" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="300" y="200" width="18" height="40" rx="2" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="324" y="216" width="18" height="24" rx="2" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="360" y="216" width="18" height="24" rx="2" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="384" y="200" width="18" height="40" rx="2" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="60,170 90,158 120,166 150,150 180,160 210,142 240,152 270,138 300,146 330,134 360,140 390,130 420,112 450,104 480,110 510,96 540,88 570,94 600,78 630,70" vector-effect="non-scaling-stroke"/>
    <line class="stop" x1="420" y1="156" x2="700" y2="156" vector-effect="non-scaling-stroke"/>
    <line class="target" x1="420" y1="68" x2="700" y2="68" vector-effect="non-scaling-stroke"/>
    <line class="entry" x1="420" y1="112" x2="420" y2="250" vector-effect="non-scaling-stroke"/>
  </svg>
  <figcaption class="legend">
    <ul>
      <li><span class="sw sw-band" aria-hidden="true"></span><span>Thin shaded band — the level: a range high where call writers sat; the four shaded columns below are change in open interest before the break, call OI at the strike above shrinking (left pair) and put OI at the strike below growing (right pair)</span></li>
      <li><span class="sw sw-line sw-price" aria-hidden="true"></span><span>Solid line — price, consolidating under the level and then breaking through it</span></li>
      <li><span class="sw sw-line sw-entry" aria-hidden="true"></span><span>Dotted vertical — entry: the 5-minute close through the level with the shift already visible</span></li>
      <li><span class="sw sw-line sw-stop" aria-hidden="true"></span><span>Short-dashed ▼ line — stop back inside the range below the level</span></li>
      <li><span class="sw sw-line sw-target" aria-hidden="true"></span><span>Long-dashed ▲ line — target at the next strike with heavy open interest</span></li>
    </ul>
    <p>Time runs left to right; the tick marks are the open, the earliest entry (09:45) and the last entry (14:30). Schematic, not real data.</p>
  </figcaption>
</figure>
