---
title: Pre-market gainer momentum in cash equities
summary: An equity intraday setup: screen the pre-open auction for F&O-universe stocks indicated sharply higher on unusual pre-open quantity with a news reason, buy the break of the first five minutes after 09:20, and be flat before the closing auction. The US evidence says day-trading returns concentrate in "stocks in play"; the Indian hit rate is lore.
updated: 2026-11-01
level: intermediate
order: 8
instruments: [Cash equity (MIS) in the F&O universe, Not in ASM/GSM or the F&O ban list]
window: Screen in the pre-open; entries 09:20–10:30; flat before the closing auction
evidence: MECHANISM
glance_stop: 1.5 per cent below entry or below the pullback low, whichever is nearer
glance_target: 2R for half, trail the rest on 15-minute lows; time stop 14:30; never into the auction
glance_size: Shares = risk budget ÷ (entry − stop); broker intraday margin must cover the notional
topics: [pre-open, pre-market gainers, momentum, stocks in play, mis, equity intraday]
related: [opening-range-and-gaps, settlement-circuits-asm-ban, intraday-leverage-today, trading-day-ist, vwap-reclaim-reject, order-types-and-products]
tools: [position-size, charges]
sources:
  - SEBI circular (Jan 2026) — Introduction of Closing Auction Session and modifications in the pre-open session, paras 4.1–4.5, 5 and 6.2 | https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf | accessed 2026-11-01
  - Zarattini, Barbon and Aziz — A Profitable Day Trading Strategy for the U.S. Equity Market, SSRN working paper 4729284, 2024 | https://doi.org/10.2139/ssrn.4729284 | accessed 2026-11-01
  - Singh — A Temporal Analysis of Intraday Volatility of Nifty Futures on the National Stock Exchange, SSRN working paper 3272375, 2018 | https://doi.org/10.2139/ssrn.3272375 | accessed 2026-11-01
  - SEBI circular (Oct 2026) — Review of the Closing Auction Session, market timings and settlement methodology for derivatives, para 4.2 | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf | accessed 2026-11-01
  - Zerodha Support — Intraday auto square-off timings (broker example) | https://support.zerodha.com/category/trading-and-markets/trading-faqs/market-sessions/articles/intraday-auto-square-off-timings | accessed 2026-11-01
  - SEBI — Analysis of profit and loss of individual traders dealing in equity cash segment, intraday (Jul 2024) | https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1721818140715.pdf | accessed 2026-11-01
---
## Context & instruments

The cash pre-open is a call auction: orders collect in the {{fact:mkt-preopen-window}} window, the exchange publishes an indicative equilibrium price, the cumulative buy and sell quantity and the imbalance while it runs, and matching follows before continuous trading begins. A stock indicated several per cent higher on many times its usual pre-open quantity, with a reason in the morning's news, is a stock "in play" — and the best US evidence on day trading says that is where the returns concentrated. The playbook buys such a stock as an intraday cash position (MIS) in the F&O universe, where liquidity is adequate, and never in a name under ASM or GSM surveillance or in the F&O ban list ([Settlement, circuits, ASM and the ban list](../../guides/settlement-circuits-asm-ban/)). [The opening range and gaps](../../guides/opening-range-and-gaps/) explains the auction mechanics in full.

:::warning Base rates first
In FY23, {{fact:sebi-intraday-cash-loss-share}} of individual intraday equity traders lost money ([SEBI, Jul 2024](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1721818140715.pdf)), and in FY26 {{fact:sebi-loss-2026-share}} of individual F&O traders did. A news-driven stock moves more in both directions. Sources for every figure are in the [verified facts register](../../facts/).
:::

## Time window (IST)

Screen while the pre-open indicative prices are live; entries from 09:20, after the first five minutes have shown whether the auction price holds, until 10:30. Exit well before the closing auction. For a stock with derivatives, continuous trading runs {{fact:mkt-continuous-session-cas-stocks}} until {{date:2026-12-06}} and the closing auction follows at {{fact:mkt-closing-session}}; from {{date:2026-12-07}} the continuous session is {{fact:mkt-continuous-session}} for every stock, with the auction at {{fact:opt-cas-window-from-2026-12-07}}. Brokers begin squaring off intraday cash positions from {{fact:mkt-squareoff-example-cash}} in one broker's published policy, and earlier on volatile days.

## Pre-conditions

- Pre-open indicative change of three per cent or more, on a pre-open quantity at least three times the stock's twenty-day average.
- A reason: results, an order win, a block deal, a regulatory decision. No reason, no trade.
- Average daily turnover of ₹50 crore or more, and a daily range (ATR) of at least two per cent of the price, so the move has room.
- Not under ASM or GSM, not in the F&O ban list, not inside its own results-call window.

## Entry

A 5-minute close above the high of the first five minutes after 09:20, or the first pullback that holds session VWAP ([VWAP reclaim and reject](../vwap-reclaim-reject/) has the pullback rules). One entry; a stop-out ends the day in that stock.

## Stop

1.5 per cent below the entry or below the pullback low, whichever is nearer. Worked example at illustrative prices: entry ₹500, stop ₹492.50, a risk of ₹7.50 a share.

## Target / exit

Half off at 2R — ₹515 in the example — and the rest trailed on 15-minute swing lows. Time stop at 14:30 if the trade has gone nowhere. Never carry an intraday position into the closing auction: the auction allows only limit and market orders, not stop-losses, and a position squared off by the broker's risk desk during the reference-price phase fills at whatever prints.

## Position-size rule

Shares = the risk budget divided by (entry − stop). On a [one-per-cent rule](../../guides/position-sizing-and-loss-limits/) with ₹2,50,000 of capital the budget is ₹2,500; ₹2,500 ÷ ₹7.50 = 333 shares, a notional of ₹1,66,500. The broker's intraday margin for the stock must cover that notional — [Intraday leverage today](../../guides/intraday-leverage-today/) explains the upfront VaR + ELM requirement and why leverage is lower on volatile names. The [position-size calculator](../../tools/position-size/) works in shares; the [charges calculator](../../tools/charges/) shows the STT and other costs of a cash intraday round trip.

## When NOT to trade

- The stock is under ASM or GSM, in the F&O ban list, or trading near a circuit limit.
- A pre-open gap of more than ten per cent: circuit and auction risk, and the move may already be done.
- Illiquid names, where the bid–ask spread is wider than two-tenths of a per cent.
- A market-wide gap day when every stock is up — there is no relative strength in that.
- The stock's own results day before the management call, when the second move is unknowable.

## Known failure modes

- **The pre-open trap.** The auction is thin; the indicative price is set by a few orders and the 09:15 open reverses it. The 09:20 rule exists to see whether the price survives five minutes of continuous trading.
- **The 10:30 lull.** Momentum fades as the morning's volatility peak passes — the Indian intraday volatility curve is U-shaped — and a late entry buys the top of the morning.
- **Square-off into the auction.** A position held too long is squared off by the broker while the stock is in the closing-auction reference window, at a poor print and for a fee.
- **Surveillance mid-day.** Exchanges can move a stock into a surveillance measure during the day; liquidity changes at once.
- **Pyramiding a distributed stock.** Adding to a gainer whose volume is rising while price stalls is buying from the sellers who created the news.

## Evidence label

:::evidence Mechanism, with US evidence
- {{label:EVIDENCE}} US: a 5-minute opening-range breakout across 7,000-plus stocks, 2016–2023, worked only when restricted to "stocks in play" — unusual volume, usually news (Zarattini, Barbon and Aziz, 2024, working paper).
- {{label:MECHANISM}} The pre-open call auction and its disseminated indicative price, quantities and imbalance are the rules of the session (SEBI, January 2026); they explain why the open is a discovered price, not why it continues.
- {{label:EVIDENCE}} Intraday volatility peaks in the first minutes of the Indian session (Singh, 2018, Nifty futures) — the reason the window closes at 10:30.
- {{label:LORE}} Any specific Indian hit rate for pre-open gainers: no exchange, regulator or study publishes one.
:::

## Schematic

<figure class="schematic">
  <svg viewBox="0 0 720 280" role="img" aria-labelledby="sch-title">
    <title id="sch-title">Schematic of pre-market gainer momentum: a shaded band at the far left marks the pre-open auction's indicative price zone; the price line starts at the open, forms a five-minute range, breaks above it where a dotted vertical marks the entry, pulls back and trends higher; a short-dashed stop line sits below the pullback low and a long-dashed target line sits two risk-units above the entry. Tick marks at the pre-open start, the open, the earliest entry time and the time stop.</title>
    <line class="ax" x1="40" y1="250" x2="700" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="ax" x1="40" y1="20" x2="40" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="60" y1="250" x2="60" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="110" y1="250" x2="110" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="170" y1="250" x2="170" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="620" y1="250" x2="620" y2="262" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="60" y="156" width="50" height="24" rx="3" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="110,168 130,158 150,170 170,160 190,148 210,154 230,140 250,150 270,136 290,128 310,134 330,120 350,112 370,118 390,104 410,98 430,106 450,92 470,86 490,94 510,80" vector-effect="non-scaling-stroke"/>
    <line class="stop" x1="190" y1="176" x2="700" y2="176" vector-effect="non-scaling-stroke"/>
    <line class="target" x1="190" y1="92" x2="700" y2="92" vector-effect="non-scaling-stroke"/>
    <line class="entry" x1="190" y1="148" x2="190" y2="250" vector-effect="non-scaling-stroke"/>
  </svg>
  <figcaption class="legend">
    <ul>
      <li><span class="sw sw-band" aria-hidden="true"></span><span>Shaded band — the pre-open auction's indicative price zone before the open</span></li>
      <li><span class="sw sw-line sw-price" aria-hidden="true"></span><span>Solid line — the stock from the open: a five-minute range, the break, a pullback, the trend</span></li>
      <li><span class="sw sw-line sw-entry" aria-hidden="true"></span><span>Dotted vertical — entry: the 5-minute close above the first five minutes' high</span></li>
      <li><span class="sw sw-line sw-stop" aria-hidden="true"></span><span>Short-dashed ▼ line — stop 1.5 per cent below entry or below the pullback low</span></li>
      <li><span class="sw sw-line sw-target" aria-hidden="true"></span><span>Long-dashed ▲ line — target at 2R, where half the position is sold</span></li>
    </ul>
    <p>Time runs left to right; the tick marks are the start of the pre-open, the open, the earliest entry (09:20) and the 14:30 time stop. Schematic, not real data.</p>
  </figcaption>
</figure>
