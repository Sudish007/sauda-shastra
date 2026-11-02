---
title: VWAP reclaim and reject
summary: Trading the moment price closes back across the session VWAP after a directional open — a reclaim from below or a rejection from above — with the stop beyond the signal candle and the target at the session extreme. VWAP's pull is mechanical; the reclaim edge itself is untested in public data.
updated: 2026-11-01
level: intermediate
order: 3
instruments: [Nifty 50 futures, Futures on a liquid F&O stock, Cash equity (MIS) in a stock with derivatives]
window: 10:00–14:30 IST
evidence: MECHANISM
glance_stop: Beyond the signal candle: below the reclaim low or above the rejection high
glance_target: The session high or low (about 2R); out early on a close back across VWAP
glance_size: One per cent of capital divided by the stop in rupees; stocks sized in shares the same way
topics: [vwap, reclaim, rejection, pullback, session vwap, institutional benchmark]
related: [vwap-and-anchored-vwap, price-action-market-structure, multi-timeframe-relative-strength, trading-day-ist, position-sizing-and-loss-limits]
tools: [position-size]
sources:
  - Berkowitz, Logue and Noser — The Total Cost of Transactions on the NYSE, Journal of Finance 43(1), 1988 | https://doi.org/10.1111/j.1540-6261.1988.tb02591.x | accessed 2026-11-01
  - SEBI circular (Jan 2026) — Introduction of Closing Auction Session and modifications in the pre-open session, paras 4.1–4.2 and 6.1 | https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf | accessed 2026-11-01
  - SEBI circular (Oct 2026) — Review of the Closing Auction Session, market timings and settlement methodology for derivatives, paras 4.2 and 6.1 | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf | accessed 2026-11-01
  - Gao, Han, Li and Zhou — Market intraday momentum, Journal of Financial Economics 129(2), 2018 | https://doi.org/10.1016/j.jfineco.2018.05.009 | accessed 2026-11-01
  - Alphatrends — Brian Shannon (Anchored VWAP) | https://alphatrends.net/ | accessed 2026-11-01
  - Zerodha Support — Auto square-off timings for open intraday positions (broker example) | https://support.zerodha.com/category/trading-and-markets/trading-faqs/market-sessions/articles/intraday-auto-square-off-timings | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
---
## Context & instruments

The session VWAP is the average price paid so far today, weighted by volume. Institutional desks are measured against it, so large orders are worked toward it, and in India the closing auction's reference price and the expiry-settlement index from {{date:2026-12-07}} are both VWAP-defined. That gives the line a real pull without making any single crossing of it a signal. The playbook waits for a directional open, a pullback to VWAP, and then a close back across it: a reclaim (price returns above VWAP after a dip below) in a rising session, a rejection (price fails back below after a test from beneath) in a falling one. It trades Nifty 50 futures (one lot is {{fact:fo-nifty-lot}} units), the futures of a liquid F&O stock, or the stock itself as an intraday cash position. [VWAP and anchored VWAP](../../guides/vwap-and-anchored-vwap/) has the formula and the anchored variant.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). VWAP tells you where the average participant is; it does not tell you that the next move pays. Every figure's source is in the [verified facts register](../../facts/).
:::

## Time window (IST)

VWAP needs about forty-five minutes of volume before it means anything, so entries begin at 10:00 and stop at 14:30, leaving the final hour to closing-auction mechanics rather than to this setup: for stocks with derivatives the continuous session runs {{fact:mkt-continuous-session-cas-stocks}} until {{date:2026-12-06}} and {{fact:mkt-continuous-session}} from {{date:2026-12-07}}, after which the closing auction takes over ({{fact:mkt-closing-session}} today, then {{fact:opt-cas-window-from-2026-12-07}}). Brokers begin squaring off intraday cash positions from {{fact:mkt-squareoff-example-cash}} in one broker's published policy, earlier for stocks in the closing auction.

## Pre-conditions

- A directional open: price at least three-tenths of a per cent away from VWAP once the first forty-five minutes are done, so the session has a side.
- A pullback to VWAP on falling volume — the move back to the average is a pause, not a reversal.
- The 15-minute structure agrees: a higher low into VWAP for a reclaim, a lower high for a rejection ([Multi-timeframe analysis and relative strength](../../guides/multi-timeframe-relative-strength/)).
- Price has not already crossed VWAP more than three times today.

## Entry

Reclaim: a 5-minute candle closes back above VWAP after trading below it, and that candle's low is higher than the previous swing low. Rejection: a 5-minute close back below VWAP after a test from beneath, with a lower high. Worked example at illustrative levels: VWAP is 25,220 and the reclaim candle closes at 25,230.

## Stop

Beyond the signal candle: below the reclaim candle's low, above the rejection candle's high. In the example the reclaim low is 25,195, a 35-point stop, which at a lot of {{fact:fo-nifty-lot}} units is ₹2,275 per lot. For a stock, the stop is the same candle's low in rupees per share.

## Target / exit

The session high for a reclaim (25,300 in the example, 70 points for 35 risked, or 2R), the session low for a rejection. Trail the remainder on 5-minute swing lows. Exit regardless of profit if price closes back across VWAP — the premise has been cancelled — and exit at 14:30 if still in.

## Position-size rule

Lots = the risk budget divided by the stop in rupees, rounded down: on a one-per-cent rule with ₹6,00,000 of capital, ₹6,000 ÷ ₹2,275 = 2.6, so two lots. For a stock, shares = the risk budget divided by (entry − stop) in rupees per share. The [position-size calculator](../../tools/position-size/) handles both; [Position sizing and loss limits](../../guides/position-sizing-and-loss-limits/) sets the daily cap of two to three R.

## When NOT to trade

- Price has crossed VWAP more than three times already: a chop day, where VWAP is a magnet rather than a level.
- Within thirty minutes of a scheduled release — RBI at {{fact:mac-rbi-mpc-time-ist}}, India CPI at {{fact:mac-india-cpi-release-ist}} ([IST calendar](../../calendar/)).
- The last hour, when closing-auction VWAP mechanics change how price behaves around the line.
- Expiry day of the traded instrument.

## Known failure modes

- **Magnet days.** On most sessions price oscillates around VWAP and every reclaim is followed by a rejection; the three-crossing rule and the structure requirement filter most of them, not all.
- **Low-volume reclaims.** A close above VWAP on thin volume is noise; the higher-low requirement helps, volume confirmation helps more.
- **Session versus anchored VWAP.** A reclaim of the session VWAP while price sits below a VWAP anchored at yesterday's swing high is a reclaim into resistance.
- **Entering at VWAP without structure.** Buying the touch rather than the reclaim turns a confirmation trade into a guess.

## Evidence label

:::evidence Mechanism, with lore around the timing
- {{label:MECHANISM}} VWAP is the execution benchmark institutional desks are measured against (Berkowitz, Logue and Noser, 1988), so large orders are worked toward it.
- {{label:MECHANISM}} In India the closing auction's reference price is a VWAP of the last fifteen minutes of continuous trading, and from {{date:2026-12-07}} expiring index derivatives settle on the constituents' last-half-hour VWAP (SEBI circulars of January and October 2026): rules, not an edge.
- {{label:EVIDENCE}} Trading with the open's direction has support in US data: the first half-hour return of the S&P 500 ETF predicted the last half-hour return from 1993 to 2013 (Gao, Han, Li and Zhou). US, not Indian.
- {{label:LORE}} The reclaim/reject edge itself — that a close back across VWAP after a directional open pays — is untested in public data, in India or elsewhere.
:::

## Schematic

<figure class="schematic">
  <svg viewBox="0 0 720 280" role="img" aria-labelledby="sch-title">
    <title id="sch-title">Schematic of a VWAP reclaim: a thin shaded ribbon runs across the drawing as the session VWAP; the price line opens above it, pulls back below it, then closes back above it where a dotted vertical marks the entry; a short-dashed stop line sits below the reclaim candle's low and a long-dashed target line sits at the session high, which the price reaches on the right. Tick marks at the open, the earliest entry time and the last exit time.</title>
    <line class="ax" x1="40" y1="250" x2="700" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="ax" x1="40" y1="20" x2="40" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="60" y1="250" x2="60" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="190" y1="250" x2="190" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="610" y1="250" x2="610" y2="262" vector-effect="non-scaling-stroke"/>
    <path class="band" d="M60,138 C200,146 400,152 700,148 L700,158 C400,162 200,156 60,148 Z" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="60,110 85,100 110,94 135,108 160,120 185,136 210,152 235,166 260,172 285,160 310,150 335,140 360,132 385,138 410,124 435,116 460,108 485,100 510,96" vector-effect="non-scaling-stroke"/>
    <line class="stop" x1="335" y1="180" x2="700" y2="180" vector-effect="non-scaling-stroke"/>
    <line class="target" x1="110" y1="92" x2="700" y2="92" vector-effect="non-scaling-stroke"/>
    <line class="entry" x1="335" y1="140" x2="335" y2="250" vector-effect="non-scaling-stroke"/>
  </svg>
  <figcaption class="legend">
    <ul>
      <li><span class="sw sw-band" aria-hidden="true"></span><span>Shaded ribbon — the session VWAP</span></li>
      <li><span class="sw sw-line sw-price" aria-hidden="true"></span><span>Solid line — price: a directional open, a pullback below VWAP, then the reclaim</span></li>
      <li><span class="sw sw-line sw-entry" aria-hidden="true"></span><span>Dotted vertical — entry: the 5-minute close back above VWAP with a higher low</span></li>
      <li><span class="sw sw-line sw-stop" aria-hidden="true"></span><span>Short-dashed ▼ line — stop below the reclaim candle's low</span></li>
      <li><span class="sw sw-line sw-target" aria-hidden="true"></span><span>Long-dashed ▲ line — target at the session high</span></li>
    </ul>
    <p>Time runs left to right; the tick marks are the open, the earliest entry (10:00) and the final exit (14:30). Schematic, not real data.</p>
  </figcaption>
</figure>
