---
title: Relative-strength pairs — Bank Nifty vs Nifty, stock vs sector
summary: Two legs, traded on their ratio: long the laggard and short the leader when a divergence stalls (convergence), or with the leader when the ratio breaks out (momentum). Pairs and industry momentum have published evidence at daily and monthly horizons in US data; the intraday timing is lore, and with financial services at {{fact:inv-nifty50-financials-weight}} of Nifty 50 the two index legs are far from independent.
updated: 2026-11-01
level: advanced
order: 9
instruments: [Bank Nifty futures vs Nifty 50 futures, A bank stock vs Nifty Bank futures or vs another bank, ATM options as proxies when futures margin is too large]
window: Ratio read at 10:00; entries 10:00–13:00; both legs flat by 15:00
evidence: EVIDENCE
glance_stop: On the ratio, 0.4 per cent beyond the extreme, translated to rupees per leg before entry
glance_target: Ratio back to its ten-day mean (convergence) or 1R (momentum); both legs exit together
glance_size: Notional-neutral legs; ratio-stop risk ≤ one per cent of capital, else the stock pair
topics: [pairs trading, relative strength, ratio chart, bank nifty, sector rotation, industry momentum]
related: [multi-timeframe-relative-strength, index-derivatives-specs, what-a-trade-costs, position-sizing-and-loss-limits, trend-day-pyramiding]
tools: [position-size, charges]
sources:
  - Gatev, Goetzmann and Rouwenhorst — Pairs Trading, Performance of a Relative Value Arbitrage Rule, SSRN 141615 (Review of Financial Studies, 2006) | https://doi.org/10.2139/ssrn.141615 | accessed 2026-11-01
  - Moskowitz and Grinblatt — Do Industries Explain Momentum? Journal of Finance 54(4), 1999 | https://doi.org/10.1111/0022-1082.00146 | accessed 2026-11-01
  - Jegadeesh and Titman — Returns to Buying Winners and Selling Losers, Journal of Finance 48(1), 1993 | https://doi.org/10.1111/j.1540-6261.1993.tb04702.x | accessed 2026-11-01
  - NSE Indices — Nifty 50 factsheet (Oct 2026) | https://www.niftyindices.com/Factsheet/ind_nifty50.pdf | accessed 2026-11-01
  - NSE Indices — Nifty Bank factsheet (Oct 2026) | https://www.niftyindices.com/Factsheet/ind_nifty_bank.pdf | accessed 2026-11-01
  - SEBI circular (Jan 2026) — Introduction of Closing Auction Session and modifications in the pre-open session, para 4.2 | https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf | accessed 2026-11-01
  - SEBI circular (Oct 2026) — Review of the Closing Auction Session, market timings and settlement methodology for derivatives, para 4.2 | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
---
## Context & instruments

A pair trade owns the difference between two instruments rather than the direction of either. The index pair is Bank Nifty futures against Nifty 50 futures, read on their ratio; the stock pair is a bank against Nifty Bank futures, or two banks against each other. Both legs are futures (one Nifty lot is {{fact:fo-nifty-lot}} units, one Bank Nifty lot {{fact:fo-banknifty-lot}}), with at-the-money options as proxies when the margin for two futures legs is too large for the account. Two legs mean two sets of charges — STT on every sale of a future at {{fact:chg-stt-futures}}, exchange and SEBI fees on both — so [What a trade costs](../../guides/what-a-trade-costs/) applies twice. [Multi-timeframe analysis and relative strength](../../guides/multi-timeframe-relative-strength/) explains the ratio chart itself.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). A hedged pair is not a hedged account: leg risk and double costs are real. Sources for every figure are in the [verified facts register](../../facts/).
:::

## Time window (IST)

Pairs need a settled open: read the ratio at 10:00, enter between 10:00 and 13:00, and have both legs flat by 15:00. Derivatives trade in the {{fact:mkt-fo-session}} session today and later in the {{fact:mkt-fo-session-from-2026-12-07}} session, but a pair carried into the last half-hour risks one leg filling in a thin auction while the other does not.

## Pre-conditions

- A divergence of at least half a per cent between the two legs since the open, with no leg-specific news behind it.
- The ratio (Bank Nifty ÷ Nifty) at a ten-day extreme on your own chart — build the ratio from futures of the same expiry.
- Both legs liquid at the moment of entry, with the depth to fill a lot each at the touch.
- Not an RBI day for banks, not a results day for either leg.

## Entry

Convergence: long the laggard and short the leader when the ratio stalls at its extreme and the 15-minute candle on the ratio turns. Momentum: long the leader and short the laggard when the ratio breaks out of its ten-day range with the leader making new highs — industry momentum applied intraday. Enter the harder-to-fill leg first and the other immediately after; never leave one leg open while waiting for a better price on the second.

## Stop

On the ratio, 0.4 per cent beyond the extreme. Translate that into rupees per leg before entering: on the index pair at illustrative levels, 0.4 per cent of one leg's notional is roughly ₹6,550, and the stop is executed as two orders, both legs out together.

## Target / exit

Convergence: the ratio back to its ten-day mean. Momentum: 1R on the ratio. Both legs exit together in every case; a pair closed one leg at a time has become two directional trades. Time stop at 15:00.

## Position-size rule

Notional-neutral sizing. Worked example at illustrative levels: Nifty futures at 25,200 × {{fact:fo-nifty-lot}} = ₹16,38,000 of notional per lot; Bank Nifty at 56,000 × {{fact:fo-banknifty-lot}} = ₹16,80,000 per lot, so one lot each leaves about ₹42,000 of residual exposure, roughly two and a half per cent of a leg, which the trader accepts or offsets with a small option position. Total risk at the ratio stop is about ₹6,550, so the one-per-cent rule needs about ₹6.55 lakh of capital for one lot per side; smaller accounts trade the stock-versus-sector version in cash or skip. Index cross-margin benefit is limited and set by the clearing corporation's SPAN file — the broker's calculator decides, not the trader's assumption. The [position-size calculator](../../tools/position-size/) handles the per-leg arithmetic; [Position sizing and loss limits](../../guides/position-sizing-and-loss-limits/) sets the daily cap.

## When NOT to trade

- The divergence has a reason: RBI policy at {{fact:mac-rbi-mpc-time-ist}}, a bank's results, a regulatory action.
- When weights make the legs near-identical. Financial services are {{fact:inv-nifty50-financials-weight}} of Nifty 50, and the two largest private banks alone are roughly a fifth of Nifty 50 and a third of Nifty Bank ([Nifty 50](https://www.niftyindices.com/Factsheet/ind_nifty50.pdf) and [Nifty Bank](https://www.niftyindices.com/Factsheet/ind_nifty_bank.pdf) factsheets, {{date:2026-10-30}}), so a move in two stocks drives both legs.
- Expiry day of either leg.
- Low-volume mid-session chop, when the ratio wanders without meaning.

## Known failure modes

- **The leader keeps leading.** Convergence trades fight momentum, and the published pairs evidence is daily and US, not intraday.
- **Leg risk.** One leg fills and the other slips or does not fill; the pair is briefly a naked directional position in the wrong instrument.
- **Double costs.** Two entries, two exits, STT on both sales, and the round trip costs about twice what a single-leg trade does.
- **Margin assumptions.** Cross-margin benefit between index futures is smaller than traders expect, and a margin shortfall draws the clearing corporation's penalty.
- **Mismatched expiries.** A ratio built on futures with different expiries moves with the calendar spread, not with relative strength.

## Evidence label

:::evidence Evidence at daily and monthly horizons; lore for the intraday timing
- {{label:EVIDENCE}} Pairs trading on close substitutes earned average annualised excess returns of up to eleven per cent on US daily data 1962–2002, above conservative cost estimates (Gatev, Goetzmann and Rouwenhorst) — a daily horizon, not an intraday one.
- {{label:EVIDENCE}} Industry momentum — buying past winning industries and selling losers — is profitable and explains much of individual-stock momentum at monthly horizons (Moskowitz and Grinblatt, 1999); past winners beat losers over three-to-twelve-month horizons (Jegadeesh and Titman, 1993). US data.
- {{label:MECHANISM}} Index-weight arithmetic from the NSE Indices factsheets explains why the two index legs move together more than a pair should.
- {{label:LORE}} Intraday convergence timing — that a stalled ratio at a ten-day extreme reverts within the session — has no public study in India or elsewhere.
:::

## Schematic

<figure class="schematic">
  <svg viewBox="0 0 720 280" role="img" aria-labelledby="sch-title">
    <title id="sch-title">Schematic of a convergence pair on the ratio: a shaded band marks the ratio's ten-day range; the ratio line rises above the band to an extreme, stalls and turns down, where a dotted vertical marks the entry; a short-dashed stop line sits above the extreme and a long-dashed target line sits at the middle of the band, the ten-day mean, which the ratio reaches on the right. Tick marks at the open, the first ratio read, the last entry time and the time stop.</title>
    <line class="ax" x1="40" y1="250" x2="700" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="ax" x1="40" y1="20" x2="40" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="60" y1="250" x2="60" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="150" y1="250" x2="150" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="450" y1="250" x2="450" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="620" y1="250" x2="620" y2="262" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="60" y="120" width="640" height="70" rx="3" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="60,150 90,140 120,128 150,118 180,106 210,98 240,90 270,96 300,88 330,94 360,104 390,112 420,122 450,130 480,138 510,146 540,150 570,158 600,154 630,160" vector-effect="non-scaling-stroke"/>
    <line class="stop" x1="330" y1="76" x2="700" y2="76" vector-effect="non-scaling-stroke"/>
    <line class="target" x1="330" y1="155" x2="700" y2="155" vector-effect="non-scaling-stroke"/>
    <line class="entry" x1="330" y1="94" x2="330" y2="250" vector-effect="non-scaling-stroke"/>
  </svg>
  <figcaption class="legend">
    <ul>
      <li><span class="sw sw-band" aria-hidden="true"></span><span>Shaded band — the ratio's ten-day range</span></li>
      <li><span class="sw sw-line sw-price" aria-hidden="true"></span><span>Solid line — the ratio (leader ÷ laggard), stretching above its range and then stalling</span></li>
      <li><span class="sw sw-line sw-entry" aria-hidden="true"></span><span>Dotted vertical — entry: the 15-minute ratio candle turns at the extreme; long the laggard, short the leader</span></li>
      <li><span class="sw sw-line sw-stop" aria-hidden="true"></span><span>Short-dashed ▼ line — stop 0.4 per cent beyond the extreme, both legs out together</span></li>
      <li><span class="sw sw-line sw-target" aria-hidden="true"></span><span>Long-dashed ▲ line — target at the ten-day mean of the ratio</span></li>
    </ul>
    <p>Time runs left to right; the tick marks are the open, the first ratio read (10:00), the final entry (13:00) and the exit (15:00). Schematic, not real data.</p>
  </figcaption>
</figure>
