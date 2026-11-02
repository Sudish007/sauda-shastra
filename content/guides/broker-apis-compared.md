---
title: Broker APIs compared: price, limits, data, compliance
section: Algo & systematic
summary: Zerodha Kite Connect, Upstox, Dhan, Angel One SmartAPI, FYERS and 5paisa side by side — the subscription each charged on the day its page was read, what streaming and historical data the plan includes, the order throttles the documentation states, and the static-IP and two-factor rules all of them now share. The worked example shows why brokerage, not the API fee, decides the bill.
updated: 2026-11-02
level: intermediate
order: 2
topics: [broker api, kite connect, upstox api, dhanhq, smartapi, fyers api, 5paisa xstream, breeze api, api pricing, rate limits, order throttles, static ip, websocket, historical data]
related: [sebi-retail-algo-framework, no-code-platforms-and-python-stack, market-data-for-backtesting-india, execution-realities-and-architecture, what-a-trade-costs, liquidity-slippage-and-sebi-measures]
tools: [charges]
sources:
  - Zerodha — Kite Connect APIs: plans and pricing | https://zerodha.com/products/api/ | accessed 2026-11-01
  - Zerodha — Kite Connect 3 documentation: exceptions, errors and rate limits | https://kite.trade/docs/connect/v3/exceptions/ | accessed 2026-11-01
  - Upstox — Trading API suite | https://upstox.com/trading-api/ | accessed 2026-11-01
  - Upstox developer API — Announcements (2026) | https://upstox.com/developer/api-documentation/announcements/ | accessed 2026-11-01
  - DhanHQ — Trading APIs | https://dhanhq.co/trading-apis | accessed 2026-11-01
  - Dhan support — How does the DhanHQ Data API subscription work? | https://dhan.co/support/platforms/dhanhq-api/how-does-the-dhanhq-data-api-subscription-work/ | accessed 2026-11-01
  - DhanHQ — API v2 documentation and rate limits | https://dhanhq.co/docs/v2/ | accessed 2026-11-01
  - Angel One — SmartAPI | https://smartapi.angelbroking.com/ | accessed 2026-11-01
  - Angel One SmartAPI — Exchange regulations: static IP for API orders (Apr 2026) | https://smartapi.angelbroking.com/exchange-regulations | accessed 2026-11-01
  - FYERS — API plans and rate limits | https://fyers.in/api-docs/v3/getting-started/plans-and-limits/ | accessed 2026-11-01
  - FYERS — Prime subscription | https://fyers.in/prime | accessed 2026-11-01
  - FYERS support — Does FYERS charge any subscription fees for the trading API? | https://support.fyers.in/portal/en/kb/articles/does-fyers-charge-any-subscription-fees-for-trading-api | accessed 2026-11-01
  - 5paisa — Xstream API | https://xstream.5paisa.com/ | accessed 2026-11-01
  - ICICI Direct — Breeze API reference | https://api.icicidirect.com/breezeapi/documents/index.html | accessed 2026-11-01
  - SEBI circular CIR/2025/0000013 — Safer participation of retail investors in algorithmic trading (Feb 2025) | https://www.sebi.gov.in/sebi_data/attachdocs/feb-2025/1738665456458.pdf | accessed 2026-11-01
  - NSE circular INVG/69255 — Detailed operational modalities for the retail algo framework (Jul 2025) | https://nsearchives.nseindia.com/content/circulars/INVG69255.zip | accessed 2026-11-01
---
## What every broker API now shares

Since {{fact:algo-framework-effective-date}} the compliance layer is the same at every broker, because [SEBI's retail algo framework](../sebi-retail-algo-framework/) and NSE's operational modalities wrote it for them. A client gets a unique API key; a client who runs their own code sends orders from a whitelisted static IP; the login is OAuth with a second factor; every order that arrives through the API is tagged as an algo order and routed through the broker's own trading system, with the routing server in India; the broker keeps the audit trail for five years and may not cross one client's orders against another's. A broker that advertises an "open" API, or lets you skip the static IP for self-hosted code, is behind the rule, not ahead of it.

That leaves four things to compare: what the API costs, what data the plan includes, how fast it lets you send orders, and what tooling sits around it. Prices below are the ones each provider's page showed on {{date:2026-11-01}}; they live in the site's [verified facts register](../../facts/) and carry the date they were read.

## The comparison

| Broker API | Price seen | Data in the plan | Throttles and tooling |
|---|---|---|---|
| [Zerodha Kite Connect](https://zerodha.com/products/api/) | Personal plan {{fact:algo-kite-personal-price}} for orders, GTT, alerts, margin computation and portfolio; the full Connect plan {{fact:algo-kite-connect-price}} | Streaming (WebSocket) and historical candles only on the paid plan | {{fact:algo-kite-order-limits}}; quotes one request a second, candles three; Python client [kiteconnect](https://pypi.org/project/kiteconnect/) |
| [Upstox](https://upstox.com/trading-api/) | Subscription {{fact:algo-upstox-api-price}}; each API order charged {{fact:algo-upstox-api-order-charge}} as a promotion that runs to {{date:2026-12-31}} (GTT orders exempt) | Trading and market-data APIs included | Static-IP endpoints (since {{date:2026-04-10}}), a kill-switch API, a one-year read-only "analytics token" for data and P&L without a daily login; rate limits in the [developer docs](https://upstox.com/developer/api-documentation/announcements/) |
| [Dhan (DhanHQ)](https://dhanhq.co/trading-apis) | Trading APIs {{fact:algo-dhan-api-price}}; data APIs {{fact:algo-dhan-data-api-price}}, renewing every thirty days | Live feed, quotes and history behind the data subscription | {{fact:algo-dhan-order-limits}}; [v2 docs](https://dhanhq.co/docs/v2/) |
| [Angel One SmartAPI](https://smartapi.angelbroking.com/) | {{fact:algo-angel-smartapi-price}} | Market data included | API orders accepted only from the [registered static IP](https://smartapi.angelbroking.com/exchange-regulations), set in the dashboard, since {{date:2026-04-01}} |
| [FYERS API](https://fyers.in/api-docs/v3/getting-started/plans-and-limits/) | Standard plan {{fact:algo-fyers-api-price}}; [Prime](https://fyers.in/prime) {{fact:algo-fyers-prime-price}} | Standard: five years of daily candles, one year intraday, a hundred streamed symbols; Prime: twenty-five-plus years daily, five-plus intraday, five thousand streamed symbols, fifteen tick-by-tick symbols | {{fact:algo-fyers-api-rate-limit}} on transaction endpoints; data endpoints five a second on Standard, ten on Prime |
| [5paisa Xstream](https://xstream.5paisa.com/) | {{fact:algo-5paisa-api-price}} for trading and market data | Market data included; two hundred WebSocket subscriptions | {{fact:algo-5paisa-order-limits}}; twenty-five OHLC requests a second; TOTP login |
| [ICICI Direct Breeze](https://api.icicidirect.com/breezeapi/documents/index.html) | Not captured | Public reference documentation | Listed on the [Resources](../../resources/) page; no price read |

Three cautions about the table. The FYERS support desk's answer that the API is free refers to the Standard plan; Prime is a limits upgrade, not a licence. Dhan's "free lifetime" wording covers order placement, and anyone who wants the broker to stream prices pays the data subscription. And the Upstox order charge is time-boxed: the page names an end date, after which the register entry will be re-verified and the figure here will change.

## Where the money goes

The API fee is the small number. [What a trade costs](../what-a-trade-costs/) walks through the statutory lines — STT at {{fact:chg-stt-options-sell}} of the premium on an option sale, the NSE transaction charge of {{fact:chg-nse-txn-options}} of premium turnover on each side, the SEBI fee, stamp duty on the buy and GST at {{fact:chg-gst-rate}} on the brokerage and exchange lines — and every one of them applies to an API order exactly as to a tap on the app. What the API changes is how many orders you send.

:::example Worked example — sixty round trips a day
An options scalper runs one Nifty lot of {{fact:fo-nifty-lot}} per trade, buying at ₹100 and selling at ₹101, sixty times a session: a hundred and twenty executed orders. The [charges calculator](../../tools/charges/) gives the statutory cost of one such round trip as ₹15.54 with no brokerage at all, so the day's floor is ₹932.40 before any broker is paid.

- At a flat {{fact:chg-brokerage-example-options}} the round trip costs ₹62.74 and the day ₹3,764.40, of which ₹2,400 is brokerage.
- At Upstox's promotional {{fact:algo-upstox-api-order-charge}} the round trip costs ₹39.14 and the day ₹2,348.40, of which ₹1,200 is the order charge.
- The Kite Connect subscription of {{fact:algo-kite-connect-price}} works out at about ₹23.81 a session over twenty-one trading days — less than one round trip's brokerage.

The gross profit on each trade, before any of this, is a single point: ₹65 on one lot. Twenty-four of the sixty trades would have to be winners of that size just to pay the flat-brokerage bill, and the calculator shows the break-even per unit for any other premium. The API fee never decides this arithmetic; brokerage and the order count do.
:::

If the day's figures look large, that is the point of the example. A scalper choosing a broker by API price is choosing on the wrong column; the brokerage model and the per-order charge decide the bill, and [Liquidity, slippage and SEBI's measures](../liquidity-slippage-and-sebi-measures/) adds the spread you pay on every market order.

## Streaming and history, plan by plan

For a backtest you need history; for a live strategy you need a stream; most plans price the two together.

- **Zerodha.** The Personal plan places orders and reads your book but has no WebSocket and no candles; both arrive with the Connect plan. A trader who backtests elsewhere and only executes through Kite can stay on the free plan.
- **Upstox.** The announcements page describes an analytics token — a read-only token valid for a year that reaches market data, holdings and P&L without the daily login — which suits a monitoring dashboard that never trades.
- **Dhan.** The data subscription is the one line item; it renews every thirty days rather than monthly, which matters for a budget line.
- **FYERS.** The Standard and Prime plans differ most on history depth and symbol counts, which is why [Market data for Indian backtests](../market-data-for-backtesting-india/) treats FYERS as a data source as much as a broker.
- **5paisa and Angel One.** Both bundle market data at no charge on the pages read; neither page listed history depth, so check the documentation for the candle range before planning a backtest around it.

## Throttles, and why they sit where they do

Kite's limits read as a stack: orders per second, orders per minute, orders per day and modifications per order. Dhan's stack has the same shape with an hourly layer. 5paisa's per-second cap is higher than either. The per-second caps at Kite and Dhan sit exactly at the {{fact:algo-order-rate-threshold}} threshold of NSE's modalities, so an unregistered algo on those brokers cannot exceed the registration threshold even by accident. A broker that allows a faster rate does not exempt you from the rule: code that sends more than the threshold must be registered, whatever the API permits. [Execution realities](../execution-realities-and-architecture/) turns these numbers into what a basket order or a freeze-quantity split actually costs in seconds.

## Setting up compliantly

- **Static IP.** Buy one from your internet provider or run the algo on a hosted machine with a fixed address, then register it: Angel One's field is in the SmartAPI dashboard; Upstox exposes GET and PUT endpoints for the user's IP; the other brokers have a form in their developer console. Orders from any other address are rejected.
- **Two-factor login.** API sessions start with an OAuth login that asks for the time-based one-time password; a script that cannot complete that step cannot trade. Store the daily access token, not your password.
- **Tagging.** You do nothing: the broker tags every API order with "99999" until your algo is registered, after which it carries your algo ID.
- **Kill switch.** Upstox exposes one as an API; the exchanges hold their own per algo ID; your own code needs a daily-loss check that stops new orders. [Position sizing and loss limits](../position-sizing-and-loss-limits/) sets the number.

:::note Re-verify before you budget
API prices change without a circular. Each figure on this page carries the date it was read, and the Upstox order charge expires on a stated date. Treat the register's verified date as the age of the number.
:::
