---
title: Order types and products
section: Foundations
summary: Limit, market, stop-loss and SL-M, IOC, spread and iceberg orders as the exchange defines them — and MIS, NRML, CNC, cover, bracket, GTT and AMO as your broker defines them. Where each is refused, and why an oversized Nifty order bounces.
updated: 2026-11-01
level: beginner
order: 2
topics: [order types, stop-loss, sl-m, mis, nrml, cnc, gtt, amo, iceberg, freeze quantity]
related: [trading-day-ist, intraday-leverage-today, index-derivatives-specs]
sources:
  - NSE circular FAOP/73928 (Apr 2026) — F&O Consolidated Circular, order types, freeze quantity and price bands | https://nsearchives.nseindia.com/content/circulars/FAOP73928.zip | accessed 2026-11-01
  - SEBI circular Oct 2026 — Review of the CAS (order types allowed in the auction, iceberg transition) | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf | accessed 2026-11-01
  - SEBI circular Jan 2026 — Introduction of the Closing Auction Session (order rules, band) | https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf | accessed 2026-11-01
  - NSE circular FAOP/77189 (Oct 2026) — Quantity freeze limits for index derivatives | https://nsearchives.nseindia.com/content/circulars/FAOP77189.pdf | accessed 2026-11-01
  - NSE circular FAOP/71092 (Nov 2025) — Pre-open session in equity derivatives, with FAQ | https://nsearchives.nseindia.com/content/circulars/FAOP71092.zip | accessed 2026-11-01
  - Zerodha Policies and Procedures (broker example: products, cover orders, square-off) | https://zerodha.com/policies-and-procedures/ | accessed 2026-11-01
---
## Two vocabularies on one screen

An order ticket mixes two sets of words. One set belongs to the exchange: limit, market, stop-loss, trigger price, immediate-or-cancel, disclosed quantity. The other belongs to your broker: MIS, NRML, CNC, cover order, bracket order, GTT, AMO. The exchange never sees a "MIS" order — it sees a limit or market order, and the broker's own system decides how much margin to block for it and when to force it closed. Keeping the two sets apart explains most "why was my order rejected?" questions.

| Set by | Examples | Who enforces it |
|---|---|---|
| The exchange | Limit, market, stop-loss (SL and SL-M), IOC, spread, iceberg | NSE and BSE matching engines |
| The broker | MIS, NRML, CNC; cover and bracket orders; GTT; AMO | The broker's risk system, under SEBI's margin rules |

## The exchange order types

A **limit order** names the worst price you will accept and waits in the book until that price is available. A **market order** takes whatever is on the other side right now; in a thin option contract that can be several ticks away from the last trade, which is why most intraday traders use limits even when they want immediate fills.

A **stop-loss order** sleeps until the market touches a trigger price, then wakes up as either a limit order or a market order. NSE's [F&O Consolidated Circular](https://nsearchives.nseindia.com/content/circulars/FAOP73928.zip) lists the F&O order attributes — regular lot, stop-loss, immediate-or-cancel and spread orders — in its first chapter.

### SL versus SL-M

The two stop-loss flavours differ in what they release at the trigger:

- **SL (stop-loss limit)** releases a limit order at the price you set. If the market gaps through both the trigger and the limit, the order sits unfilled while the loss grows.
- **SL-M (stop-loss market)** releases a market order. It fills, but at whatever price is available after the gap.

:::example
You hold a ₹1,000 stock with a sell stop triggered at ₹998. Bad news hits and the next trade prints at ₹985. An SL-M order fills near ₹985 — a worse exit than planned, but an exit. An SL order with its limit at ₹997 is triggered too, but it is now a sell limit at ₹997 in a market trading at ₹985, so it stays pending until the stock recovers, if it does. Neither is "right"; SL-M buys certainty of exit, SL buys certainty of price.
:::

An **IOC (immediate-or-cancel)** order fills whatever it can at once and cancels the rest; it never rests in the book. A **spread order** in F&O buys one month and sells another as a single order at a price difference. An **iceberg order** exists in the cash segment: a large order is sent as a sequence of smaller disclosed legs so the full size never shows in the depth — this is the exchange feature, distinct from the "slicing" some broker apps offer on their own servers.

## Broker products: MIS, NRML and CNC

These codes tell the broker what you intend to do with the position, and the broker prices the risk accordingly.

- **CNC (cash and carry)** — equity delivery. The broker blocks the full value; shares arrive on the {{fact:mkt-settlement-cycle}} cycle. No leverage, no forced exit.
- **NRML (normal)** — carry-forward F&O or currency positions. Margin is the exchange's SPAN plus exposure margin, held overnight.
- **MIS (margin intraday square-off)** — intraday only. The broker may block less than the full value or exchange margin because it promises to close the position before the session ends. [Intraday leverage today](../intraday-leverage-today/) explains why that promise is worth less than it used to be.

### Cover, bracket, GTT and AMO

A **cover order** (CO) is a market or limit order bundled with a compulsory stop-loss; a **bracket order** (BO) adds a target as well. Both are intraday products that are auto-squared-off, and their availability differs by broker and segment. As a published example, Zerodha's [policies page](https://zerodha.com/policies-and-procedures/) offers cover orders only for NSE equity — not for stock options and not on BSE — and does not accept them during the pre-open session.

A **GTT (good-till-triggered)** order lives on the broker's server, not the exchange's: when the trigger price prints, the broker sends a fresh limit order. It survives overnight and across days, which an exchange stop-loss order does not. An **AMO (after-market order)** is likewise a broker queue: you place it after hours and the broker releases it to the exchange at the next pre-open. Do not confuse it with the exchange's own post-close session, which trades at the closing price only (see [The trading day in IST](../trading-day-ist/)).

### When the broker closes it for you

MIS, CO and BO positions that are still open late in the day are squared off by the broker's risk desk. The same Zerodha page gives its own timings — from {{fact:mkt-squareoff-example-cash}} onwards for equity cash and {{fact:mkt-squareoff-example-fo}} onwards for equity derivatives, at the broker's discretion — and charges {{fact:chg-rms-squareoff-example-broker}} plus GST for each position it has to close. A MIS position the broker cannot square off is converted to CNC or NRML and carried. Other brokers publish other times; read yours.

## Where orders are refused

Three parts of the day accept fewer order types than the continuous session, and one quantity rule applies all day.

### Pre-open: limit and market only

Both the cash pre-open ({{fact:mkt-preopen-window}} for order entry) and the futures pre-open ({{fact:mkt-fo-preopen-since}}) take limit and market orders only; stop-loss and IOC orders are rejected, as NSE's [pre-open FAQ for derivatives](https://nsearchives.nseindia.com/content/circulars/FAOP71092.zip) spells out. A stop-loss you want live at the open has to be placed once continuous trading begins.

### The closing auction: no stops, no new icebergs

In the Closing Auction Session for stocks with derivatives ({{fact:mkt-closing-session}}) only limit and market orders can be placed, inside a band of {{fact:mkt-cas-band}} around the reference price. Stop-loss orders are not accepted, and no new iceberg orders may be entered. Pending stop-loss orders and orders priced outside the band are **not** carried over from continuous trading into the auction — they lapse when the stock leaves the continuous session. SEBI's [circular of {{date:2026-01-16}}](https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf) set these rules and the [review of {{date:2026-10-15}}](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf) keeps them when the auction moves to {{fact:opt-cas-window-from-2026-12-07}}; from {{date:2027-02-08}} an unexecuted iceberg order will be carried into the auction as a fully disclosed limit order with lower time priority, unless the broker opts out.

:::warning
If your stop-loss in an F&O stock has not triggered by the time continuous trading ends for that stock, it is gone, not paused. Either close the position in the continuous session or re-enter an exit as a limit order in the auction window.
:::

### Freeze quantity: the size cap per order

Every derivative contract has a quantity-freeze limit — the largest single order the exchange will accept. For Nifty 50 derivatives it is {{fact:fo-freeze-qty-nifty}} units per order; Bank Nifty's is {{fact:fo-freeze-qty-banknifty}}, FinNifty's {{fact:fo-freeze-qty-finnifty}}, Nifty Midcap Select's {{fact:fo-freeze-qty-midcpnifty}} and Nifty Next 50's {{fact:fo-freeze-qty-niftynxt50}}, all from NSE's [circular FAOP/77189](https://nsearchives.nseindia.com/content/circulars/FAOP77189.pdf). The limits are set from index-level bands and change when the index moves far enough, so treat the register value as the thing to check, not something to memorise. For stock derivatives the freeze is derived from the stock's market-wide position limit (the consolidated circular's freeze section has the method).

:::example
With a Nifty lot of {{fact:fo-nifty-lot}}, a freeze of {{fact:fo-freeze-qty-nifty}} units allows 27 lots in one order ({{fact:fo-freeze-qty-nifty}} ÷ {{fact:fo-nifty-lot}} = 27.7, rounded down). A 40-lot order is 2,600 units and is rejected outright — it is not partly filled. Send it as 27 lots and 13 lots instead. Broker platforms often do this split for you, but the second order joins the queue after the first, and on an expiry afternoon that gap can be the trade.
:::

## A checklist before you confirm

- Is the ticket a **limit** or a **market** order, and does the contract have enough depth for a market order?
- Is the stop an **SL** or an **SL-M**, and have you decided which risk you would rather carry through a gap?
- Is the product **MIS** or **NRML/CNC**, and do you know the broker's square-off time for that segment?
- Is the time right — before the pre-open window closes, inside continuous trading, or inside the auction entry window — for the order type you chose?
- Is the size under the freeze quantity for that contract?

Costs come next: [What a trade costs](../what-a-trade-costs/) prices each of these order types with the current statutory rates.
