---
title: Execution realities: latency, freeze quantity, throttles, kill switches
section: Algo & systematic
summary: What happens to an order between your code and the exchange — the latency chain NSE publishes, the freeze quantities that force a split (Nifty {{fact:fo-freeze-qty-nifty}} an order), broker throttles against the {{fact:algo-order-rate-threshold}} registration threshold, the margins and limits that reject an order, three layers of kill switch, a reference architecture, and why retail high-frequency trading is not a thing.
updated: 2026-11-02
level: advanced
order: 6
topics: [execution, latency, freeze quantity, order splitting, rate limits, order throttles, rejections, kill switch, upfront premium, expiry-day elm, intraday position limits, colocation, order-to-trade ratio, tick-by-tick feed, reference architecture, retail hft]
related: [sebi-retail-algo-framework, broker-apis-compared, strategy-families-and-backtest-hygiene, liquidity-slippage-and-sebi-measures, position-sizing-and-loss-limits, index-derivatives-specs, expiry-day-dynamics, order-types-and-products]
tools: [position-size]
sources:
  - NSE circular FAOP/77189 — Quantity freeze limits for index derivatives (Oct 2026) | https://nsearchives.nseindia.com/content/circulars/FAOP77189.pdf | accessed 2026-11-01
  - NSE — Equity derivatives contract information (per-underlying freeze quantities) | https://www.nseindia.com/static/products-services/equity-derivatives-contract-information | accessed 2026-11-01
  - SEBI circular CIR/2025/122 — Intraday position limits for index options (Sep 2025) | https://www.sebi.gov.in/sebi_data/attachdocs/sep-2025/1756745625835.pdf | accessed 2026-11-01
  - SEBI circular CIR/2024/132 — Measures to strengthen the equity index derivatives framework (Oct 2024) | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf | accessed 2026-11-01
  - SEBI circular CIR/MRD/DP/2018/62 — Measures to strengthen algorithmic trading and the co-location framework (Apr 2018) | https://www.sebi.gov.in/sebi_data/attachdocs/apr-2018/1523271816354.pdf | accessed 2026-11-01
  - SEBI circular CIR/MRD/DP/09/2012 — Broad guidelines on algorithmic trading (Mar 2012) | https://www.sebi.gov.in/sebi_data/attachdocs/1333109064175.pdf | accessed 2026-11-01
  - NSE — Co-location facility: tariff and reference latency report | https://www.nseindia.com/static/trade/platform-services-co-location-facility | accessed 2026-11-01
  - Zerodha — Kite Connect 3 documentation: exceptions, errors and rate limits | https://kite.trade/docs/connect/v3/exceptions/ | accessed 2026-11-01
  - DhanHQ — API v2 documentation and rate limits | https://dhanhq.co/docs/v2/ | accessed 2026-11-01
  - 5paisa — Xstream API | https://xstream.5paisa.com/ | accessed 2026-11-01
  - BSE notice 20250930-74 — Kill switch mechanism for algo IDs (Sep 2025) | https://www.bseindia.com/markets/MarketInfo/DispNewNoticesCirculars.aspx?page=20250930-74 | accessed 2026-11-01
  - Upstox developer API — Announcements: static-IP endpoints and the kill-switch API (2026) | https://upstox.com/developer/api-documentation/announcements/ | accessed 2026-11-01
  - NSE circular INVG/69255 — Detailed operational modalities for the retail algo framework (Jul 2025) | https://nsearchives.nseindia.com/content/circulars/INVG69255.zip | accessed 2026-11-01
  - NSE FAQs — Safer participation of retail investors in algorithmic trading (file dated Nov 2025) | https://nsearchives.nseindia.com/web/sites/default/files/inline-files/FAQ_Retail%20Algo_03112025_NSE.pdf | accessed 2026-11-01
---
## The latency chain

An order from a retail algo travels three hops: from your machine to the broker's order-management system, from the broker's system through its risk checks to the exchange, and inside the exchange to the matching engine. Only the last hop is measured publicly. SEBI's [2018 circular](https://www.sebi.gov.in/sebi_data/attachdocs/apr-2018/1523271816354.pdf) on algorithmic trading and co-location requires exchanges to publish their minimum, maximum, mean and 50th- and 99th-percentile latencies together with a reference latency — the time from a reference rack in the co-location facility to the core router — and NSE does so in a quarterly [reference latency report](https://www.nseindia.com/static/trade/platform-services-co-location-facility) on its co-location page (the report dated {{date:2026-09-22}} was the current one when this page was written).

The published figures describe the inside of the exchange, in microseconds, for members in the same building. A retail order starts on the public internet, passes through a broker's risk system that checks margin and position limits before forwarding, and arrives milliseconds later. Under NSE's [operational modalities](https://nsearchives.nseindia.com/content/circulars/INVG69255.zip) every API order is routed through the member's trading system, with the routing server in India. Nothing in your code changes this chain; what it can change is how many orders it sends, how large each one is, and what happens when one is rejected.

## Freeze quantity and order splitting

Every derivatives order carries a quantity cap set by the exchange: the **freeze quantity**. An order above it is not partially filled; it is frozen and rejected. NSE fixed the current index limits in [circular FAOP/77189](https://nsearchives.nseindia.com/content/circulars/FAOP77189.pdf), in force since {{date:2026-11-02}}, having withdrawn the older formula-based method for indices; per-stock freeze quantities sit on the [contract information page](https://www.nseindia.com/static/products-services/equity-derivatives-contract-information). The index figures are in the register with their lot sizes, so the number of whole lots one order may carry follows by division.

| Index | Freeze quantity per order | Lot size | Largest order in whole lots |
|---|---|---|---|
| Nifty 50 | {{fact:fo-freeze-qty-nifty}} | {{fact:fo-nifty-lot}} | 27 lots (1,755 units) |
| Bank Nifty | {{fact:fo-freeze-qty-banknifty}} | {{fact:fo-banknifty-lot}} | thirty lots |
| FinNifty | {{fact:fo-freeze-qty-finnifty}} | {{fact:fo-finnifty-lot}} | thirty lots |
| Nifty Midcap Select | {{fact:fo-freeze-qty-midcpnifty}} | {{fact:fo-midcpnifty-lot}} | 23 lots (2,760 units) |
| Nifty Next 50 | {{fact:fo-freeze-qty-niftynxt50}} | {{fact:fo-niftynxt50-lot}} | 24 lots |

:::example Worked example — the splitter
A strategy wants 77 Nifty lots, 5,005 units, which exceeds the {{fact:fo-freeze-qty-nifty}} freeze. Each order must hold whole lots of {{fact:fo-nifty-lot}}, so the largest legal slice is 27 lots, 1,755 units, and the order goes out as three: 27, 27 and 23 lots. Each slice is a separate order with its own fill price, and the three fills average worse than the first in a thin strike — the splitter must therefore sit *before* the risk gate, so the position limit and the loss limit see the whole intended size, not the first slice. The freeze quantities changed twice in the autumn of 2026; a splitter that hard-codes the limit breaks silently on the next revision, which is why the register, not the code, should hold the number.
:::

## Throttles against the registration threshold

Brokers cap the rate at which an API key may send orders, and the caps are published. Zerodha's limits are {{fact:algo-kite-order-limits}}; Dhan's are {{fact:algo-dhan-order-limits}}; 5paisa's are {{fact:algo-5paisa-order-limits}}; FYERS states {{fact:algo-fyers-api-rate-limit}} on its transaction endpoints. [Broker APIs compared](../broker-apis-compared/) has the sources for each.

Set these beside the regulatory line. NSE's modalities register a client-developed algo only when it sends more than {{fact:algo-order-rate-threshold}}, and Zerodha's and Dhan's per-second caps sit exactly there: on those brokers an unregistered algo cannot cross the threshold even by mistake. 5paisa's cap is higher, which is headroom you may use only after registering. Two practical consequences:

- A basket of thirty legs — a hedged option structure across strikes, or a pairs rebalance across stocks — needs at least three seconds to leave a Kite key, and the legs fill at different prices. Hedge legs go first.
- A strategy designed around twenty-five orders a second must be registered, must find a broker whose API allows the rate, and must accept that the exchange's own order-to-trade penalties, below, start to matter.

Modifications count too: Kite's limit of twenty-five modifications per order means a stop that is trailed tick by tick runs out of modifications, and the right pattern is cancel-and-replace at a coarser step.

## Why orders are rejected

A rejected order is not an error in your code; it is a rule you did not model. The causes, each with the rule behind it:

- **Price outside the band or quantity above the freeze.** SEBI's [2012 guidelines](https://www.sebi.gov.in/sebi_data/attachdocs/1333109064175.pdf) require order-level price and quantity checks against exchange limits before any algo order leaves the broker.
- **Margin shortfall.** Options premium has been collected upfront from buyers since {{fact:opt-upfront-premium-since}}; an order the available margin cannot cover is rejected, not queued. On an index's expiry day short option contracts carry an additional ELM of {{fact:fo-expiry-day-elm-addon}}, and the calendar-spread margin benefit on contracts expiring that day: {{fact:opt-calendar-spread-expiry-rule}}. A position sized on yesterday's margin fails today.
- **Position-limit breach.** Index-option positions are measured against the intraday limits of {{fact:opt-position-limit-index-intraday-net}} net and {{fact:opt-position-limit-index-intraday-gross}} gross future-equivalent per entity under SEBI's [circular of {{date:2025-09-01}}](https://www.sebi.gov.in/sebi_data/attachdocs/sep-2025/1756745625835.pdf), monitored through at least {{fact:opt-intraday-monitoring-snapshots}} random snapshots a day, with expiry-day breaches penalised since {{date:2025-12-06}}. The earlier position that intraday breaches went unpunished ended with that circular. The figures are far above any retail book, but a runaway loop is how a small book becomes a large position; this is the rule that catches it.
- **Non-whitelisted IP or missing tag.** Orders from an address the broker has not whitelisted, or from a key that is not tagging orders as [SEBI's framework](../sebi-retail-algo-framework/) requires, do not reach the exchange.
- **A kill switch fired.** The exchange's, the broker's or your own — the next section.

Log every rejection with the broker's error text; the catalogue above is the first thing to compare it against.

## Three layers of kill switch

SEBI's framework defines a kill switch as an emergency, last-line function that halts trading on pre-defined conditions, and requires exchanges to hold one for orders from any algo ID. BSE's [notice of {{date:2025-09-30}}](https://www.bseindia.com/markets/MarketInfo/DispNewNoticesCirculars.aspx?page=20250930-74) describes the mechanics through its risk terminal: cancel the pending orders of an algo ID and session, stop its incoming orders with a rejection message naming the algo ID, or revoke the stop — each action lasting only for the trading day on which it is used. The 2012 guidelines already required exchanges to identify looping or runaway algos and shut them down, and allowed an exchange to close a member's terminal in an exigency.

The broker's layer is its risk-management system, which the modalities keep with the broker even for a tech-savvy client, plus at some brokers a switch you can call: Upstox's [developer announcements](https://upstox.com/developer/api-documentation/announcements/) list a kill-switch API that disables trading segments for the account.

Your own layer has three parts: a daily loss limit that stops new orders at the figure from [Position sizing and loss limits](../position-sizing-and-loss-limits/); an order counter that stops the strategy once it has sent more orders than the session plan allows, because a loop looks exactly like enthusiasm; and a heartbeat that cancels working orders and squares the book if the data feed or the strategy process goes silent. None of these is clever. All of them must exist before the first live order.

## A minimal reference architecture

<figure class="schematic">
  <svg viewBox="0 0 720 280" role="img" aria-labelledby="arch-title">
    <title id="arch-title">Schematic of a retail algo trading system: a data store and a research module on the left feed a strategy service, which passes orders through a risk gate to the broker API and on to the exchange; a dotted vertical marks the regulatory boundary at the broker API; a journal and an alerts module sit below the strategy and the risk gate; a return line from the broker API carries the live price stream back to the data store.</title>
    <rect class="band" x="20" y="36" width="120" height="60" rx="4" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="20" y="150" width="120" height="60" rx="4" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="190" y="92" width="120" height="60" rx="4" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="360" y="92" width="120" height="60" rx="4" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="530" y="92" width="90" height="60" rx="4" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="650" y="92" width="60" height="60" rx="4" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="190" y="200" width="120" height="48" rx="4" vector-effect="non-scaling-stroke"/>
    <rect class="band" x="360" y="200" width="120" height="48" rx="4" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="140,66 165,66 165,110 190,110" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="140,180 165,180 165,134 190,134" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="80,150 80,96" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="310,122 360,122" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="480,122 530,122" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="620,122 650,122" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="250,152 250,200" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="420,152 420,200" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="575,92 575,20 80,20 80,36" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="183,104 190,110 183,116" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="183,128 190,134 183,140" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="353,116 360,122 353,128" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="523,116 530,122 523,128" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="643,116 650,122 643,128" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="74,43 80,36 86,43" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="74,103 80,96 86,103" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="244,193 250,200 256,193" vector-effect="non-scaling-stroke"/>
    <polyline class="price" points="414,193 420,200 426,193" vector-effect="non-scaling-stroke"/>
    <line class="entry" x1="505" y1="8" x2="505" y2="272" vector-effect="non-scaling-stroke"/>
    <line class="ax" x1="20" y1="266" x2="700" y2="266" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="80" y1="266" x2="80" y2="276" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="250" y1="266" x2="250" y2="276" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="420" y1="266" x2="420" y2="276" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="575" y1="266" x2="575" y2="276" vector-effect="non-scaling-stroke"/>
    <line class="tick" x1="680" y1="266" x2="680" y2="276" vector-effect="non-scaling-stroke"/>
  </svg>
  <figcaption class="legend">
    <ul>
      <li><span class="sw sw-band" aria-hidden="true"></span><span>Shaded boxes, middle row left to right — strategy service, risk gate, broker API, exchange; stacked at the left — the data store (top: bhavcopy archive, broker history, live stream) and the research module (bottom: pandas, backtester, checklist); below the row — the journal under the strategy, the alerts under the risk gate</span></li>
      <li><span class="sw sw-line sw-price" aria-hidden="true"></span><span>Solid lines with arrowheads — data into the strategy, orders out of it; the line across the top returns the broker's live price stream to the data store</span></li>
      <li><span class="sw sw-line sw-entry" aria-hidden="true"></span><span>Dotted vertical — the regulatory boundary: left of it runs on your machine behind your whitelisted static IP; right of it is the broker's system and the exchange, where orders carry the generic tag or your registered algo ID</span></li>
    </ul>
    <p>The risk gate holds the position and daily-loss limits, the order-rate throttle under the registration threshold, the freeze-quantity splitter and your own kill switch; the broker API step is the OAuth login with a one-time password. The tick marks sit under the data store, the strategy service, the risk gate, the broker API and the exchange. Schematic, not real data.</p>
  </figcaption>
</figure>

Two rules of the drawing matter more than the boxes. The risk gate is the last thing your code does before the broker, so every order — the slices a splitter produces, the exits a stop generates — passes the same limits. And the boundary sits at the broker API: the exchange sees the broker, the broker sees your key and your IP, and [SEBI's framework](../sebi-retail-algo-framework/) makes the broker answerable for what crosses it. Let the journal record what the risk gate saw, not only what filled.

## The honest limits of retail high-frequency trading

Everything in this guide so far concerns strategies that can tolerate the latency of a broker API — seconds, not microseconds. The alternative is to sit in the exchange's building, and NSE publishes what that costs. A full co-location rack lists at {{fact:algo-nse-colo-full-rack}} plus a one-time setup charge, excluding taxes, on the [co-location tariff](https://www.nseindia.com/static/trade/platform-services-co-location-facility). Message-rate charges come on top, by category: the slowest category, forty messages a second, is {{fact:algo-nse-colo-msg-rate-a}}, and the fastest, ten thousand messages a second, is {{fact:algo-nse-colo-msg-rate-h}} on ordinary trading days. Only members may rent the rack at all.

The exchange's tick-by-tick order-book feed is free under the 2018 circular, but it is delivered to the co-location facility: without a rack there is no tick feed, and a strategy written for the full order book cannot be run from a flat in Pune. The same circular narrowed the exemption from order-to-trade-ratio penalties to orders priced within {{fact:algo-otr-exemption-band}}, so a high-cancellation strategy pays for its cancellations, and extended the rule to the cash segment.

Set those figures against the retail position. The API fee is a few hundred rupees a month; the rack is lakhs a year before the message charges, the member status and the people to run it. A retail trader's latency edge over a co-located member does not exist. The useful conclusion is scope, not despair: the strategies open to a retail algo are the ones in [Strategy families and the backtest checklist](../strategy-families-and-backtest-hygiene/) that do not care who is first — end-of-day rules, hedged option structures, pairs on daily data, slow momentum — and the skills that pay are the splitter, the risk gate and the cost model, not the microsecond.

:::evidence What the evidence says
- {{label:EVIDENCE}} NSE publishes its latency percentiles, reference latency and co-location tariff; the freeze quantities, the position limits, the upfront-premium and expiry-day margin rules and the kill-switch mechanics are exchange and SEBI documents, all linked above and in the register.
- {{label:MECHANISM}} Throttles, freeze-quantity splitting, rejection causes and the three-layer kill switch follow from those rules by arithmetic; no study is needed and none is claimed.
- {{label:LORE}} Any claim that a retail trader gains an edge from a "low-latency VPS" against co-located members: no evidence, and the published tariff and the microsecond latency figures argue the other way.
:::
