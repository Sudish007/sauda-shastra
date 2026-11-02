---
title: Last-hour positioning rules, 14:30 to the close
summary: Rules for the final ninety minutes — when to be flat in each instrument under the closing-auction regime in force today and the one that starts on {{date:2026-12-07}}, a momentum rule for a final leg with the day's direction at half size, and the expiry-day cut-off. Intraday momentum into the close has published support; the Indian cut-off times are rules, not an edge.
updated: 2026-11-01
level: intermediate
order: 12
instruments: [Every intraday instrument — this playbook is mostly rules, Nifty 50 futures for the momentum leg]
window: 14:30 to the end of trading
evidence: EVIDENCE
glance_stop: The 14:30 candle's extreme on the 15-minute chart; worked 40 points on Nifty futures
glance_target: Flat by 15:10 in derivatives today and before a stock's session ends; no price target
glance_size: Half the normal unit; no last-hour trade at all once the daily loss limit is hit
topics: [last hour, closing auction, cas, square-off, settlement vwap, post-close, intraday momentum]
related: [trading-day-ist, order-types-and-products, expiry-day-dynamics, intraday-leverage-today, trend-day-pyramiding, expiry-day-straddle-scalp]
tools: [position-size]
sources:
  - SEBI circular (Jan 2026) — Introduction of Closing Auction Session and modifications in the pre-open session, paras 4.1–4.9 and 6.1 | https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf | accessed 2026-11-01
  - SEBI circular (Oct 2026) — Review of the Closing Auction Session, market timings and settlement methodology for derivatives, paras 4.2–4.9 and 6.1–6.2 | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf | accessed 2026-11-01
  - Zerodha Support — Intraday auto square-off timings (broker example) | https://support.zerodha.com/category/trading-and-markets/trading-faqs/market-sessions/articles/intraday-auto-square-off-timings | accessed 2026-11-01
  - Gao, Han, Li and Zhou — Market intraday momentum, Journal of Financial Economics 129(2), 2018 | https://doi.org/10.1016/j.jfineco.2018.05.009 | accessed 2026-11-01
  - Baltussen, Da, Lammers and Martens — Hedging demand and market intraday momentum, Journal of Financial Economics 142(1), 2021 | https://doi.org/10.1016/j.jfineco.2021.04.029 | accessed 2026-11-01
  - Agarwalla and Pandey — Expiration-Day Effects and the Impact of Short Trading Breaks on Intraday Volatility, Journal of Futures Markets 33(11), 2013 | https://doi.org/10.1002/fut.21632 | accessed 2026-11-01
  - Singh — A Temporal Analysis of Intraday Volatility of Nifty Futures on the National Stock Exchange, SSRN working paper 3272375, 2018 | https://doi.org/10.2139/ssrn.3272375 | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
---
## Context & instruments

The last hour has the day's second volatility peak and the least time to recover from a mistake, and since {{date:2026-08-03}} it also contains a closing auction whose rules differ from continuous trading. This playbook is therefore mostly rules: when each instrument must be flat, what the auction allows, and what changes on {{date:2026-12-07}}. It carries one trade — a final leg with the day's direction on Nifty 50 futures (one lot is {{fact:fo-nifty-lot}} units) at half size — because the published momentum evidence is about exactly this window. [The trading day in IST](../../guides/trading-day-ist/) is the full session map; [Order types and products](../../guides/order-types-and-products/) covers what the auction accepts.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). The last hour is where a day's discipline is tested, not where it is earned. Sources for every figure are in the [verified facts register](../../facts/).
:::

## Time window (IST)

From 14:30 to the end of trading, under two regimes.

- **Today.** Stocks with derivatives trade continuously in the {{fact:mkt-continuous-session-cas-stocks}} session and then enter the closing auction, {{fact:mkt-closing-session}}, whose order entry runs {{fact:mkt-cas-order-entry-current}}; other stocks trade {{fact:mkt-continuous-session}}; equity derivatives trade {{fact:mkt-fo-session}}; the post-close session is {{fact:mkt-post-close-session}}, at the closing price only. One broker's published policy begins squaring off intraday cash positions from {{fact:mkt-squareoff-example-cash}} and intraday derivative positions from {{fact:mkt-squareoff-example-fo}}, earlier for auction stocks and on volatile days.
- **From {{date:2026-12-07}}.** Every stock trades continuously in the {{fact:mkt-continuous-session}} session; the auction moves to {{fact:opt-cas-window-from-2026-12-07}}; derivatives trade {{fact:mkt-fo-session-from-2026-12-07}}, except that an expiring index contract stops at {{fact:opt-expiring-index-close-time-from-2026-12-07}} on its expiry day and settles on the constituents' VWAP over the last half-hour of continuous trading, broadcast live.

## Pre-conditions

- A trend day ([Trend-day pyramiding](../trend-day-pyramiding/)) or a clear range; no momentum leg on a chop day.
- You know the cut-off times above for the instrument you hold, and the day's event schedule ([IST calendar](../../calendar/)).
- The daily loss limit has not been hit.

## Entry

The momentum rule: if at 14:30 the index is at least six-tenths of a per cent above (below) the previous close and above (below) session VWAP, take the side of the day for a final leg once the 14:30 candle on the 15-minute chart closes. Worked example at illustrative levels: Nifty futures at 25,420, up 0.8 per cent on the day, the 14:30 candle's low at 25,380.

## Stop

The 14:30 candle's extreme: 25,380 in the example, a 40-point stop, which at a lot of {{fact:fo-nifty-lot}} units is ₹2,600 per lot. No stop-loss order can be placed inside the closing auction, so the stop is a working order in continuous trading and the position is closed before the auction begins.

## Target / exit

Time, not price. Be flat in futures and options by 15:10 today, and twenty minutes before the derivatives close from {{date:2026-12-07}}. In a stock with derivatives, be flat ten minutes before its continuous session ends under either regime; never carry an intraday position into the closing auction. On the expiring index's expiry day, hold no option position after 15:00 — Indian expiry days show their volatility spike in the last half-hour, which from {{date:2026-12-07}} is also the settlement window.

## Position-size rule

Half the normal unit: on a one-per-cent rule with ₹6,00,000 of capital, the budget is ₹3,000 rather than ₹6,000, and ₹3,000 ÷ ₹2,600 = 1.15, so one lot. The [position-size calculator](../../tools/position-size/) does the division; [Position sizing and loss limits](../../guides/position-sizing-and-loss-limits/) explains the daily limit — once it is hit there is no last-hour trade at all.

## When NOT to trade

- The index is within three-tenths of a per cent of the previous close at 14:30: no momentum to ride.
- Expiry day for the expiring index.
- An intraday stock position that the broker will square off while the stock is in the auction's reference-price window.
- A release scheduled after 14:30; US data at {{fact:mac-us-cpi-release-ist-dst}} or {{fact:mac-us-cpi-release-ist-std}} land after the Indian close and belong to tomorrow's open.
- Any trade whose stop would have to live inside the auction.

## Known failure modes

- **The auction transition.** Unexecuted continuous-session limit orders carry into the auction with their time priority and can fill at the auction price; the auction accepts limit and market orders only, inside a {{fact:mkt-cas-band}} band around a reference price that is itself a VWAP.
- **Narrower bands.** From {{date:2026-12-07}} the stock-futures price band is aligned to the auction band in the last window, so a stop can sit outside what the exchange will let you trade.
- **Broker square-off at a bad print.** A position left to the risk desk is closed at whatever is available, for a fee of {{fact:chg-rms-squareoff-example-broker}} in one broker's schedule.
- **Chasing the settlement VWAP.** On expiry day the last half-hour is where the settlement price is being formed, not where it can be traded.
- **Pre-auction habits.** "Closing-price painting" belonged to the era before the auction; the post-close session trades at the closing price only. From {{date:2027-02-08}}, unexecuted iceberg orders also carry into the auction as disclosed limit orders unless the trader opted out.

## Evidence label

:::evidence Evidence for intraday momentum; the cut-offs are rules
- {{label:EVIDENCE}} The first half-hour return predicted the last half-hour return in the S&P 500 ETF, 1993–2013 (Gao, Han, Li and Zhou); the rest-of-day return predicted the last-thirty-minute return across sixty-plus futures markets, 1974–2020 (Baltussen and others). US and global, not Indian.
- {{label:EVIDENCE}} Indian expiry-day volatility concentrated in the last half-hour when settlement used the last-half-hour VWAP (Agarwalla and Pandey, 2013); the intraday volatility curve is U-shaped (Singh, 2018, working paper).
- {{label:MECHANISM}} The auction, derivatives and post-close timings, the order types the auction accepts and the settlement windows are SEBI circulars of January and October 2026; the square-off times are one broker's published example.
- {{label:LORE}} Any specific Indian last-hour win rate: no public study.
:::

## Schematic

<figure class="schematic">
  <svg viewBox="0 0 720 280" role="img" aria-labelledby="sch-title">
    <title id="sch-title">Schematic timeline of the last ninety minutes under today's regime: the price line is Nifty futures from 14:30, rising with the day's direction; a dotted vertical marks the entry after the 14:30 candle closes; a short-dashed stop line sits at that candle's low; a long-dashed vertical marks the time to be flat in derivatives; a shaded band marks the closing auction for stocks with derivatives, and the price line ends at the derivatives close. Tick marks at 14:30, 15:00, the auction start, the auction end, the derivatives close, and the start of the post-close session.</title>
    <line class="ax" x1="40" y1="250" x2="700" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="ax" x1="40" y1="20" x2="40" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="60" y1="250" x2="60" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="273" y1="250" x2="273" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="380" y1="250" x2="380" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="522" y1="250" x2="522" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="558" y1="250" x2="558" y2="262" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="629" y1="250" x2="629" y2="262" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="380" y="20" width="142" height="230" rx="3" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="60,150 85,142 110,156 135,146 160,138 185,130 210,136 235,124 260,116 285,122 310,110 335,104 360,112 385,100 410,106 435,96 460,104 485,92 510,98 535,88 558,94" vector-effect="non-scaling-stroke"/>
    <line class="stop" x1="167" y1="162" x2="558" y2="162" vector-effect="non-scaling-stroke"/>
    <line class="target" x1="344" y1="20" x2="344" y2="250" vector-effect="non-scaling-stroke"/>
    <line class="entry" x1="167" y1="130" x2="167" y2="250" vector-effect="non-scaling-stroke"/>
  </svg>
  <figcaption class="legend">
    <ul>
      <li><span class="sw sw-band" aria-hidden="true"></span><span>Shaded band — the closing auction for stocks with derivatives under today's regime</span></li>
      <li><span class="sw sw-line sw-price" aria-hidden="true"></span><span>Solid line — Nifty futures from 14:30, with the day's direction, ending at the derivatives close</span></li>
      <li><span class="sw sw-line sw-entry" aria-hidden="true"></span><span>Dotted vertical — entry for the final leg after the 14:30 candle closes</span></li>
      <li><span class="sw sw-line sw-stop" aria-hidden="true"></span><span>Short-dashed ▼ line — stop at the 14:30 candle's low</span></li>
      <li><span class="sw sw-line sw-target" aria-hidden="true"></span><span>Long-dashed ▲ vertical — flat by here in derivatives (15:10 today)</span></li>
    </ul>
    <p>Time runs left to right from 14:30; the tick marks are 14:30, 15:00, the start and the end of the closing auction for stocks with derivatives, the derivatives close, and the start of the post-close session. Schematic, not real data.</p>
  </figcaption>
</figure>
