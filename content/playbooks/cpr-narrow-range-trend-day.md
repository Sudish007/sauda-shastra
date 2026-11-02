---
title: Narrow CPR as a trend-day filter
summary: When the Central Pivot Range computed from yesterday's session is unusually narrow, practitioners expect a trend day; this playbook trades the opening-range break in the direction of the open, stopped beyond the CPR. The formulas are deterministic; the narrow-range-to-trend claim is lore, and volatility clustering argues against it.
updated: 2026-11-01
level: intermediate
order: 4
instruments: [Nifty 50 or Bank Nifty futures, An at-the-money Nifty weekly option bought in the direction of the open]
window: 09:30–14:30 IST (CPR computed before the open)
evidence: LORE
glance_stop: Beyond the far edge of the CPR plus a small buffer; worked 80 points, so size down
glance_target: Camarilla R3/R4 or yesterday's high/low as scaling points; trail on 15-minute swings
glance_size: One per cent of capital ÷ the stop; zero lots means a bought option or no trade
topics: [cpr, central pivot range, narrow range, trend day, camarilla, pivots]
related: [cpr-and-camarilla-pivots, volume-and-market-profile, opening-range-and-gaps, position-sizing-and-loss-limits, trend-day-pyramiding]
tools: [position-size, black-scholes-greeks]
sources:
  - Zerodha Varsity — Technical Analysis, The Central Pivot Range | https://zerodha.com/varsity/chapter/the-central-pivot-range/ | accessed 2026-11-01
  - TradingView Help Center — Pivot Points Standard (Camarilla formulas) | https://www.tradingview.com/support/solutions/43000521824-pivot-points-standard/ | accessed 2026-11-01
  - Cont — Empirical properties of asset returns, stylized facts and statistical issues, Quantitative Finance 1(2), 2001 | https://doi.org/10.1080/713665670 | accessed 2026-11-01
  - Dalton, Jones and Dalton — Mind Over Markets, Updated Edition (Wiley; the Market Profile trend day) | https://www.wiley.com/en-us/Mind+Over+Markets%3A+Power+Trading+with+Market+Generated+Information%2C+Updated+Edition-p-9781118531730 | accessed 2026-11-01
  - Gao, Han, Li and Zhou — Market intraday momentum, Journal of Financial Economics 129(2), 2018 | https://doi.org/10.1016/j.jfineco.2018.05.009 | accessed 2026-11-01
  - PivotBoss — Frank Ochoa, Secrets of a Pivot Boss (author site) | https://pivotboss.com/ | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
---
## Context & instruments

The Central Pivot Range is three lines computed from the previous session: the pivot (high + low + close) ÷ 3, the bottom central (high + low) ÷ 2, and the top central, which is the pivot plus the distance from the pivot to the bottom central. Its width is the day's first piece of information, available before the open. The lore says a narrow CPR foreshadows a trend day, and this playbook takes that claim seriously enough to trade it only with the direction of the open and a stop beyond the range, and honestly enough to say that the published statistics on volatility point the other way. The instrument is Nifty 50 or Bank Nifty futures (one lot is {{fact:fo-nifty-lot}} or {{fact:fo-banknifty-lot}} units) or, when the stop is too wide for the account, an at-the-money weekly option bought in the direction of the open. [CPR and camarilla pivots](../../guides/cpr-and-camarilla-pivots/) derives every level.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). A narrow range is a condition, not an edge. Every figure's source is in the [verified facts register](../../facts/).
:::

## Time window (IST)

Compute the CPR from yesterday's high, low and close before 09:15. Watch the first fifteen minutes without trading; entries run from 09:30 to 14:30. Hold into the afternoon only while the day keeps printing higher lows (or lower highs); be flat before the closing-auction window, which for stocks with derivatives begins at {{fact:mkt-closing-session}} today and moves to {{fact:opt-cas-window-from-2026-12-07}}.

## Pre-conditions

- CPR width below your own twenty-day median width. Worked example at illustrative levels: yesterday's high 25,320, low 25,080, close 25,250 give a pivot of 25,216.67, a bottom central of 25,200.00 and a top central of 25,233.33 — a width of 33.33 points, or 0.13 per cent of the index, which is narrow if the twenty-day median is, say, a quarter of a per cent.
- The open is above the top central (long bias) or below the bottom central (short bias), not inside the range.
- The first 15-minute candle does not re-enter the CPR.
- No scheduled release during the session ([IST calendar](../../calendar/)).

## Entry

Long on a 5-minute close above the opening-range high while price holds above the top central; short on a 5-minute close below the opening-range low while price holds below the bottom central. One entry; a re-entry only after a fresh higher low above the top central.

## Stop

Beyond the far edge of the CPR with a small buffer. In the example the long is entered at 25,265 and the stop sits a 15-point buffer below the bottom central, at 25,185: 80 points, which at a lot of {{fact:fo-nifty-lot}} units is ₹5,200 per lot. That is a wide stop, and it is the point of the playbook — the size has to come down to match it.

## Target / exit

Scale out at camarilla R3 and R4 (S3 and S4 for shorts) or at the previous day's high or low, whichever comes first; trail the remainder under 15-minute swing lows. Hold past 14:30 only if the day still fits the Market Profile definition of a trend day — open near one extreme, no return to the opening range, little overlap between half-hour periods. Otherwise exit at 14:30.

## Position-size rule

Lots = the risk budget divided by the stop in rupees, rounded down. On a one-per-cent rule with ₹6,00,000 of capital the budget is ₹6,000; ₹6,000 ÷ ₹5,200 = 1.15, so one lot. With a smaller account the answer rounds to zero lots, and the rule exists to say so: buy an at-the-money option instead, sized by premium at risk (the [Black–Scholes calculator](../../tools/black-scholes-greeks/) prices it), or skip the day. The [position-size calculator](../../tools/position-size/) does the division; [Position sizing and loss limits](../../guides/position-sizing-and-loss-limits/) sets the daily cap.

## When NOT to trade

- CPR wider than your median: a range day is the better bet.
- Price opens inside the CPR — no bias.
- A scheduled event day: RBI at {{fact:mac-rbi-mpc-time-ist}}, the Budget, CPI.
- Expiry day of the traded index.
- After two consecutive narrow-CPR days that failed to trend: the lore says "trend", the stylized facts say quiet begets quiet.

## Known failure modes

- **Narrow followed by narrow.** Volatility clusters — large moves follow large moves and small moves follow small ones — so the base case after a quiet day is another quiet day, not a trend. This is the main reason the label below is lore.
- **The fake open.** Price opens above the top central, breaks the opening range, then reverses through the whole CPR; the stop beyond the range is wide precisely because this happens.
- **Pivot levels as targets without volume.** A camarilla line is a number many people watch, not a place the market owes you a reaction.
- **Line soup.** Stacking CPR, camarilla, floor pivots and yesterday's levels gives a reason to exit every ten points; use the CPR for bias and one set of targets.

## Evidence label

:::evidence Lore, with contrary evidence
- {{label:LORE}} "A narrow CPR precedes a trend day": no located study tests it on Indian or any other data. The formulas themselves are documented (Zerodha Varsity, TradingView).
- {{label:EVIDENCE}} Contrary: volatility clustering is a stylized fact across markets (Cont, 2001) — large and small moves come in runs, which argues against expecting a trend day right after a quiet one.
- {{label:MECHANISM}} CPR and camarilla levels are deterministic numbers many participants watch, so reactions near them are unsurprising; that explains behaviour, it does not predict direction.
- {{label:EVIDENCE}} Holding a confirmed trend has support in US data: the first half-hour return predicted the last half-hour return in the S&P 500 ETF, 1993–2013 (Gao, Han, Li and Zhou). The Market Profile trend-day definition comes from Dalton, Jones and Dalton.
:::

## Schematic

<figure class="schematic">
  <svg viewBox="0 0 720 280" role="img" aria-labelledby="sch-title">
    <title id="sch-title">Schematic of a narrow-CPR trend day: a thin shaded band across the lower part of the drawing is the Central Pivot Range; the price line opens above it, holds above it through the first fifteen minutes, breaks the opening-range high where a dotted vertical marks the entry, and trends upward; a short-dashed stop line sits just below the band and a long-dashed target line sits at the first camarilla target above. Tick marks at the open, the end of the opening range and the last entry time.</title>
    <line class="ax" x1="40" y1="250" x2="700" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="ax" x1="40" y1="20" x2="40" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="60" y1="250" x2="60" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="180" y1="250" x2="180" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="610" y1="250" x2="610" y2="262" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="60" y="186" width="640" height="14" rx="2" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="60,172 85,160 110,170 135,158 160,166 185,154 210,148 235,156 260,140 285,132 310,138 335,122 360,114 385,120 410,104 435,96 460,102 485,86 510,78" vector-effect="non-scaling-stroke"/>
    <line class="stop" x1="210" y1="212" x2="700" y2="212" vector-effect="non-scaling-stroke"/>
    <line class="target" x1="210" y1="84" x2="700" y2="84" vector-effect="non-scaling-stroke"/>
    <line class="entry" x1="210" y1="148" x2="210" y2="250" vector-effect="non-scaling-stroke"/>
  </svg>
  <figcaption class="legend">
    <ul>
      <li><span class="sw sw-band" aria-hidden="true"></span><span>Shaded band — the Central Pivot Range from yesterday's session, unusually narrow</span></li>
      <li><span class="sw sw-line sw-price" aria-hidden="true"></span><span>Solid line — price, opening above the range and trending away from it</span></li>
      <li><span class="sw sw-line sw-entry" aria-hidden="true"></span><span>Dotted vertical — entry: the 5-minute close above the opening-range high</span></li>
      <li><span class="sw sw-line sw-stop" aria-hidden="true"></span><span>Short-dashed ▼ line — stop a small buffer below the bottom of the range</span></li>
      <li><span class="sw sw-line sw-target" aria-hidden="true"></span><span>Long-dashed ▲ line — first target at camarilla R3</span></li>
    </ul>
    <p>Time runs left to right; the tick marks are the open, the end of the opening range (09:30) and the last entry time (14:30). Schematic, not real data.</p>
  </figcaption>
</figure>
