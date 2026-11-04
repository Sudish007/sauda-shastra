---
title: Gap-fill fade back to the previous close
summary: Fading an opening gap in Nifty or a liquid stock future only after price fails back inside the previous day's range, with the stop beyond the gap-day extreme and the target at the previous close. The published evidence says gaps continue more often than they fill, so confirmation is the whole trade.
updated: 2026-11-05
level: intermediate
order: 2
instruments: [Nifty 50 or Bank Nifty futures, Futures on a liquid F&O stock, Options only as a bought directional hedge]
window: 09:30–12:00 IST (decide by 09:45; flat by 14:30)
evidence: LORE
glance_stop: Beyond the gap-day extreme (above the high for a gap-up fade); worked 50-point stop
glance_target: The previous close, half off there and the rest at VWAP if VWAP sits in between
glance_size: One per cent of capital, one attempt only; a failed fade is information, not a re-entry
topics: [gap fill, gap and go, opening gap, fade, previous close]
related: [opening-range-and-gaps, price-action-market-structure, vwap-and-anchored-vwap, volume-and-market-profile, orb-15-min-nifty, overnight-chain-to-india-open, retail-traps]
tools: [position-size]
sources:
  - Plastun, Sibande, Gupta and Wohar — Price Gap Anomaly in the US Stock Market, SSRN 3461283 (2019; North American Journal of Economics and Finance, 2020) | https://doi.org/10.2139/ssrn.3461283 | accessed 2026-11-01
  - Caporale and Plastun — Price gaps, another market anomaly? Investment Analysts Journal 46(4), 2017 | https://doi.org/10.1080/10293523.2017.1333563 | accessed 2026-11-01
  - Singh — A Temporal Analysis of Intraday Volatility of Nifty Futures on the National Stock Exchange, SSRN working paper 3272375, 2018 | https://doi.org/10.2139/ssrn.3272375 | accessed 2026-11-01
  - Berkowitz, Logue and Noser — The Total Cost of Transactions on the NYSE, Journal of Finance 43(1), 1988 | https://doi.org/10.1111/j.1540-6261.1988.tb02591.x | accessed 2026-11-01
  - Dalton, Jones and Dalton — Mind Over Markets, Updated Edition (Wiley; Market Profile open types and trend days) | https://www.wiley.com/en-us/Mind+Over+Markets%3A+Power+Trading+with+Market+Generated+Information%2C+Updated+Edition-p-9781118531730 | accessed 2026-11-01
  - SEBI circular (Jan 2026) — Introduction of Closing Auction Session and modifications in the pre-open session, para 5 | https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
---
## Context & instruments

A gap is the distance between today's open, discovered in the {{fact:mkt-preopen-window}} auction, and yesterday's close. The fade bets that the gap was an overreaction and that price will trade back to the previous close. It is the less popular side of the argument for a reason: the best published study of index gaps found that prices tend to keep moving in the gap's direction on the gap day, which is why this playbook refuses to fade a gap until the market itself has started filling it. The instrument is Nifty 50 or Bank Nifty futures (one lot is {{fact:fo-nifty-lot}} or {{fact:fo-banknifty-lot}} units) or the futures of a liquid F&O stock; a bought option is used only as a directional hedge against a position elsewhere, because a fade needs a tight stop and an option's premium is not a tight stop. [The opening range and gaps](../../guides/opening-range-and-gaps/) covers gap-and-go versus gap-fill in full.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). A fade with confirmation is a defined-risk trade; it is not a documented edge. Sources for every figure sit in the [verified facts register](../../facts/).
:::

## Time window (IST)

Decide by 09:45 whether the gap is a candidate; trade between 09:30 and 12:00; be flat by 14:30. The first fifteen minutes are the most volatile of the Indian day by the published one-minute Nifty futures evidence, so the reversal bar that qualifies the fade usually prints inside them, and a fill that has not happened by noon is a gap that is being accepted rather than rejected.

## Pre-conditions

- The gap is at least four-tenths of a per cent and at most one per cent of the index or stock, and there is no fresh fundamental news behind it. News gaps are the ones the evidence says continue.
- The first 15-minute candle closes back inside the previous day's range, not merely wicks into it.
- Volume on the reversal candle is higher than on the gap candle: sellers (for a gap-up) are present, not just absent buyers.
- The open is not above the prior twenty sessions' range — that is a breakout day, not a fade day.

## Entry

Gap-up case: short on a 5-minute close below the low of the first fifteen minutes, after the reversal candle has qualified the gap. Gap-down case: the mirror — long on a 5-minute close above the first-fifteen-minute high. One entry, no re-entry.

## Stop

Beyond the gap-day extreme. Worked example at illustrative levels: the previous close was 25,250 and the pre-open discovers 25,400, a gap of 0.59 per cent. The first fifteen minutes top out at 25,420 and close back inside yesterday's range; the entry prints at 25,380 and the stop sits at 25,430, just above the gap-day high — a 50-point stop, which at a lot of {{fact:fo-nifty-lot}} units is ₹3,250 per lot.

## Target / exit

The previous close, 25,250 in the example: 130 points earned for 50 risked, or 2.6R. Take half off at the previous close and let the rest run to session VWAP if VWAP sits between entry and target ([VWAP and anchored VWAP](../../guides/vwap-and-anchored-vwap/) explains why large orders are worked toward it). If the gap is not filled by 12:00, exit at market; a gap the market has held for three hours has been accepted.

## Position-size rule

Lots = the risk budget divided by the stop in rupees, rounded down. On a one-per-cent rule with ₹6,00,000 of capital the budget is ₹6,000; ₹6,000 ÷ ₹3,250 = 1.8, so one lot. One attempt only — a stopped-out fade is the market telling you the gap is a continuation gap, and the second attempt is the one that pays for both. The [position-size calculator](../../tools/position-size/) does the arithmetic; [Position sizing and loss limits](../../guides/position-sizing-and-loss-limits/) sets the daily cap.

## When NOT to trade

- A gap on results, an RBI statement, the Budget or a global shock: the news is still being priced.
- A gap larger than one per cent — the continuation odds rise with gap size in the US index evidence.
- An open outside the prior twenty-session range: a breakout, not an overreaction.
- Expiry day of the instrument, when option gamma rather than the gap drives the tape.
- The first fifteen minutes did not close back inside yesterday's range.

## Known failure modes

- **Gap-and-go.** The index never looks back. This is the documented base case in US indices from 1928 to 2018, which is why the playbook waits for the reversal candle and accepts missing many fills.
- **Partial fill, then resumption.** Price fills half the gap, stalls at VWAP and reverses; the half-off rule at the previous close does not help here, so the stop must stay where it was placed.
- **Fading a trend day.** A gap that opens near one extreme and never re-enters the opening range is a Market Profile trend day; its open type is visible within the first forty-five minutes ([Volume and market profile](../../guides/volume-and-market-profile/)).
- **Averaging into the fade.** Adding to a losing short because "it has to fill" is the retail trap the one-attempt rule exists to prevent.

## Evidence label

:::evidence Lore, with contrary evidence
- {{label:EVIDENCE}} Contrary: on the Dow, S&P 500 and Nasdaq from 1928 to 2018, prices tend to continue in the gap's direction on the gap day, the effect is temporary, and the belief that gaps "get filled" is not supported (Plastun, Sibande, Gupta and Wohar). Across stocks, currencies and commodities 2000–2015, post-gap behaviour was mostly consistent with efficiency, currencies excepted (Caporale and Plastun).
- {{label:MECHANISM}} The structure filter — a close back inside the previous day's range on higher volume — is a reason to expect the fill; it is explained, not measured.
- {{label:MECHANISM}} VWAP is the benchmark large orders are worked against, which is why the remainder is held to it.
- {{label:EVIDENCE}} The site's [computed Nifty gap table](../../stats/#gaps) reports same-session fills by absolute gap-size bucket over a dated ten-year daily sample. It is descriptive evidence from Yahoo's index series, labelled historical and not a forecast.
- {{label:LORE}} The win rate of this filtered intraday fade — reversal candle, volume condition, stop and costs — is still unmeasured. A daily fill count is not a strategy backtest.
:::

## Schematic

<figure class="schematic">
  <svg viewBox="0 0 720 280" role="img" aria-labelledby="sch-title">
    <title id="sch-title">Schematic of a gap-fill fade: a shaded band marks the gap between the previous close and the open; the price line opens above the band, pushes higher, then turns down through the first-fifteen-minute low where a dotted vertical marks the short entry; a short-dashed stop line sits above the gap-day high and a long-dashed target line sits at the previous close, which the price reaches on the right. Tick marks at the open, the end of the first fifteen minutes and the noon time stop.</title>
    <line class="ax" x1="40" y1="250" x2="700" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="ax" x1="40" y1="20" x2="40" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="60" y1="250" x2="60" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="210" y1="250" x2="210" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="560" y1="250" x2="560" y2="262" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="60" y="110" width="640" height="60" rx="3" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="60,106 85,98 110,92 135,104 160,114 185,108 210,122 235,118 260,132 285,138 310,146 335,142 360,154 385,160 410,168 435,172 460,166 485,174 510,170" vector-effect="non-scaling-stroke"/>
    <line class="stop" x1="260" y1="86" x2="700" y2="86" vector-effect="non-scaling-stroke"/>
    <line class="target" x1="60" y1="170" x2="700" y2="170" vector-effect="non-scaling-stroke"/>
    <line class="entry" x1="260" y1="132" x2="260" y2="250" vector-effect="non-scaling-stroke"/>
  </svg>
  <figcaption class="legend">
    <ul>
      <li><span class="sw sw-band" aria-hidden="true"></span><span>Shaded band — the gap: the space between the previous close and today's open</span></li>
      <li><span class="sw sw-line sw-price" aria-hidden="true"></span><span>Solid line — price, gapping up and then failing back through the gap</span></li>
      <li><span class="sw sw-line sw-entry" aria-hidden="true"></span><span>Dotted vertical — short entry: a 5-minute close below the first-fifteen-minute low</span></li>
      <li><span class="sw sw-line sw-stop" aria-hidden="true"></span><span>Short-dashed ▼ line — stop just above the gap-day high</span></li>
      <li><span class="sw sw-line sw-target" aria-hidden="true"></span><span>Long-dashed ▲ line — target at the previous close, where the gap is filled</span></li>
    </ul>
    <p>Time runs left to right; the tick marks are the open, the end of the first fifteen minutes and the 12:00 time stop. Schematic, not real data.</p>
  </figcaption>
</figure>
