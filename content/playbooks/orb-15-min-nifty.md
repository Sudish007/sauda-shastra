---
title: 15-minute opening range breakout on Nifty
summary: Mark the first fifteen minutes of the session as a range, trade the first close outside it with the stop at the midpoint and the first target one range width away; one lot is {{fact:fo-nifty-lot}} units. US studies back the structure; the Nifty parameters are lore.
updated: 2026-11-05
level: intermediate
order: 1
instruments: [Nifty 50 futures (current month), Near-ATM Nifty weekly option bought in the breakout direction]
window: 09:30–11:00 IST (range marked 09:15–09:30)
evidence: LORE
glance_stop: Range midpoint (tight) or the far side of the range (loose)
glance_target: One range width beyond the break (2R on the midpoint stop), then trail 5-minute swings
glance_size: One per cent of capital per attempt, two attempts a day; options sized by premium at risk
topics: [opening range, orb, breakout, nifty futures, first fifteen minutes]
related: [opening-range-and-gaps, position-sizing-and-loss-limits, trading-day-ist, what-a-trade-costs, gap-fill-fade, flows-and-calendar-effects, overnight-chain-to-india-open]
tools: [position-size, charges]
sources:
  - Zarattini and Aziz — Can Day Trading Really Be Profitable? SSRN working paper 4416622, 2023 | https://doi.org/10.2139/ssrn.4416622 | accessed 2026-11-01
  - Zarattini, Barbon and Aziz — A Profitable Day Trading Strategy for the U.S. Equity Market, SSRN working paper 4729284, 2024 | https://doi.org/10.2139/ssrn.4729284 | accessed 2026-11-01
  - Singh — A Temporal Analysis of Intraday Volatility of Nifty Futures on the National Stock Exchange, SSRN working paper 3272375, 2018 | https://doi.org/10.2139/ssrn.3272375 | accessed 2026-11-01
  - SEBI circular (May 2025) — Measures for enhancing trading convenience and strengthening risk monitoring in equity derivatives (2025/79), para 5.6 and timeline | https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748521484014.pdf | accessed 2026-11-01
  - SEBI circular (Jan 2026) — Introduction of Closing Auction Session and modifications in the pre-open session, paras 4.2 and 5 | https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf | accessed 2026-11-01
  - SEBI circular (Oct 2026) — Review of the Closing Auction Session framework, derivatives timings and settlement, para 4.2 | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf | accessed 2026-11-01
  - Zerodha Support — Intraday auto square-off timings (broker example) | https://support.zerodha.com/category/trading-and-markets/trading-faqs/market-sessions/articles/intraday-auto-square-off-timings | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
---
## Context & instruments

The opening range breakout treats the first fifteen minutes of continuous trading as a measuring stick: overnight news, the GIFT Nifty lead and the pre-open auction are all expressed in that range, and a close outside it says the early two-way auction has been resolved. The playbook trades that resolution on Nifty 50 futures — the current-month contract, one lot of {{fact:fo-nifty-lot}} units — or, when a defined premium at risk is wanted, a near-the-money weekly option bought in the breakout direction. [Buying vs selling options](../../guides/buying-vs-selling-options/) explains what the option costs in time decay and spread that the future does not. The same rules work on Bank Nifty futures (lot {{fact:fo-banknifty-lot}}) and on Sensex futures on BSE (lot {{fact:fo-sensex-lot}}; BSE charges per your broker's contract note). [The opening range and gaps](../../guides/opening-range-and-gaps/) is the background reading.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). A setup defines risk; it does not supply an edge. Every figure here and its source is in the [verified facts register](../../facts/).
:::

## Time window (IST)

The range is the high and low of the first three 5-minute candles after the open, so it is complete at 09:30. Entries are allowed from 09:30 to 11:00 and not later: Indian one-minute futures data show volatility highest at the open and the close and lowest in between, so a breakout that has not travelled by late morning is leaning on the quietest hours of the day. Derivatives trade in the {{fact:mkt-fo-session}} session today and later in the {{fact:mkt-fo-session-from-2026-12-07}} session, but this is a morning playbook: an open position after lunch means the plan has failed. The derivatives pre-open, live since {{date:2025-12-08}} in the {{fact:mkt-fo-preopen-since}} window, gives an early read of where current-month futures will open.

## Pre-conditions

- The index is in play: a gap or overnight news, visible as a GIFT Nifty move of roughly four-tenths of a per cent or more against the previous close.
- The range is between a quarter and six-tenths of a per cent of the index level. Narrower is noise; wider leaves no room for a one-range target.
- No RBI policy statement ({{fact:mac-rbi-mpc-time-ist}}), Budget, CPI or results release inside the window — check the [IST calendar](../../calendar/).
- Not the expiry day of the traded index: on that day gamma, not structure, runs the tape ([Expiry-day straddle scalp](../expiry-day-straddle-scalp/)).

## Entry

A 5-minute candle closes outside the range: long above the range high, short below the range low. The close is the trigger, not a wick through the level. One entry per side and two attempts in total for the day — the second only if the first was stopped out and the opposite side then breaks.

## Stop

Choose before entry. Tight: the range midpoint. Loose: the far side of the range. Worked example at illustrative levels: the range is 25,180–25,260, an 80-point range, so the midpoint stop on a long from 25,260 sits 40 points away; at a lot of {{fact:fo-nifty-lot}} units that is ₹2,600 per lot. The loose stop at 25,180 is 80 points, ₹5,200 per lot, and halves the position for the same rupee risk.

## Target / exit

The first target is one range width beyond the break: 25,340 in the example, 80 points earned for 40 risked, or 2R on the midpoint stop. Take half there and trail the rest under 5-minute swing lows (above swing highs for a short). Time stop: if neither the stop nor the target is hit by 11:00, exit at market. The trade was a bet on the morning's volatility, and that bet has expired.

## Position-size rule

Lots = the risk budget divided by the stop in rupees, rounded down. With ₹6,00,000 of capital and a one-per-cent rule the budget is ₹6,000; ₹6,000 ÷ ₹2,600 = 2.3, so two lots on the midpoint stop (₹5,200 at risk) and one lot on the loose stop. With a bought option, size by premium at risk — the whole premium of a lot is the loss if it expires worthless — never by notional. The [position-size calculator](../../tools/position-size/) does this arithmetic from a stop in points or rupees; [Position sizing and loss limits](../../guides/position-sizing-and-loss-limits/) adds the daily limit of two to three R. Costs matter at this frequency: the [charges calculator](../../tools/charges/) shows what two attempts a day cost before the first rupee is earned.

## When NOT to trade

- Inside days: a range narrower than a quarter of a per cent is the auction still thinking.
- A scheduled release inside the window.
- Expiry day of the traded index.
- A range that already contains a full reversal — both edges tested before 09:30 — because the breakout has lost its meaning.
- Both attempts used; the third signal of the day is the one that pays for the first two.

## Known failure modes

- **Whipsaw.** The first breakout fails and the opposite side breaks. The two-attempt cap exists so a whipsaw costs 2R at most, not the day.
- **Slippage on the breakout bar.** A fast market fills the order several points away, and an order above the freeze quantity ({{fact:fo-freeze-qty-nifty}} for Nifty derivatives) is split so the later slices fill worse — [Liquidity, slippage and SEBI's measures](../../guides/liquidity-slippage-and-sebi-measures/).
- **Trading the 5-minute variant.** More signals, more costs, and a stop that sits inside the noise.
- **Mistaking a gap-fill for a trend.** A gap-up that breaks the range low is often the gap filling, not a new downtrend; [Gap-fill fade](../gap-fill-fade/) targets the previous close, not one range width.

## Evidence label

:::evidence Lore, with partial evidence
- {{label:EVIDENCE}} Opening-range breakouts were profitable net of commissions on US instruments in two working papers: QQQ 2016–2023 (Zarattini and Aziz, 2023) and a 5-minute range on 7,000-plus US stocks that paid only on "stocks in play" with unusual volume (Zarattini, Barbon and Aziz, 2024).
- {{label:EVIDENCE}} Intraday volatility is U-shaped in one-minute Nifty futures 2011–2018 (Singh, working paper) — the reason the window closes at 11:00.
- {{label:LORE}} The fifteen-minute parameter on Nifty and any hit rate for it: no Indian study, exchange or regulator publishes one. The site's [computed statistics](../../stats/#ranges) cover full-session daily ranges, not intraday opening bars, so this claim remains lore.
- {{label:EVIDENCE}} Base rate: SEBI's FY26 study found {{fact:sebi-loss-2026-share}} of individual F&O traders lost money; a defined stop does not change that by itself.
:::

## Schematic

<figure class="schematic">
  <svg viewBox="0 0 720 280" role="img" aria-labelledby="sch-title">
    <title id="sch-title">Schematic of the opening range breakout: a shaded range band at the left, a price line that breaks above it, a short-dashed stop line at the range midpoint, a long-dashed target line one range width above the range high, and a dotted vertical at the entry. Tick marks on the time axis at the range start, the range end and the last entry time.</title>
    <line class="ax" x1="40" y1="250" x2="700" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="ax" x1="40" y1="20" x2="40" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="60" y1="250" x2="60" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="250" y1="250" x2="250" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="520" y1="250" x2="520" y2="262" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="60" y="150" width="190" height="70" rx="3" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="60,205 85,185 110,210 135,170 160,195 185,160 210,205 235,175 260,165 285,140 310,125 335,135 360,110 385,100 410,118 435,92 460,78 485,88 510,70" vector-effect="non-scaling-stroke"/>
    <line class="stop" x1="250" y1="185" x2="700" y2="185" vector-effect="non-scaling-stroke"/>
    <line class="target" x1="250" y1="80" x2="700" y2="80" vector-effect="non-scaling-stroke"/>
    <line class="entry" x1="285" y1="140" x2="285" y2="250" vector-effect="non-scaling-stroke"/>
  </svg>
  <figcaption class="legend">
    <ul>
      <li><span class="sw sw-band" aria-hidden="true"></span><span>Shaded band — the opening range, the first fifteen minutes</span></li>
      <li><span class="sw sw-line sw-price" aria-hidden="true"></span><span>Solid line — price, breaking above the range</span></li>
      <li><span class="sw sw-line sw-entry" aria-hidden="true"></span><span>Dotted vertical — entry: the first 5-minute close above the range</span></li>
      <li><span class="sw sw-line sw-stop" aria-hidden="true"></span><span>Short-dashed ▼ line — stop at the range midpoint</span></li>
      <li><span class="sw sw-line sw-target" aria-hidden="true"></span><span>Long-dashed ▲ line — target one range width above the range high (2R)</span></li>
    </ul>
    <p>Time runs left to right; the tick marks are the range start (the open), the range end (09:30) and the last entry time (11:00). Schematic, not real data.</p>
  </figcaption>
</figure>
