---
title: The trading day in IST
section: Foundations
summary: Every session of an NSE and BSE trading day in 2026 — pre-open, continuous trading, the Closing Auction Session, the derivatives close and post-close — what shifts on {{date:2026-12-07}}, and where the 2026 holiday list lives.
updated: 2026-11-01
level: beginner
order: 1
topics: [sessions, pre-open, closing auction, derivatives timings, holidays, nse, bse]
related: [order-types-and-products, settlement-circuits-asm-ban, index-derivatives-specs]
sources:
  - SEBI circular Jan 2026 — Introduction of the Closing Auction Session and modifications in the pre-open session | https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf | accessed 2026-11-01
  - SEBI circular Oct 2026 — Review of the CAS, market timings and settlement methodology for derivatives | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf | accessed 2026-11-01
  - NSE circular CMTR/74466 (May 2026) — CAS trading modalities and FAQs | https://nsearchives.nseindia.com/content/circulars/CMTR74466.zip | accessed 2026-11-01
  - NSE circular CMTR/73362 (Mar 2026) — Operational guidelines and SOP on the CAS | https://nsearchives.nseindia.com/content/circulars/CMTR73362.pdf | accessed 2026-11-01
  - NSE circular FAOP/71640 (Dec 2025) — Pre-open session in equity derivatives, go-live | https://nsearchives.nseindia.com/content/circulars/FAOP71640.pdf | accessed 2026-11-01
  - NSE Market Timings page | https://www.nseindia.com/market-data/market-timings | accessed 2026-11-01
  - NSE circular CMTR/71775 (Dec 2025) — Trading holidays for the calendar year 2026 | https://nsearchives.nseindia.com/content/circulars/CMTR71775.pdf | accessed 2026-11-01
  - NSE Clearing circular CMPT/71904 (Dec 2025) — Settlement holidays 2026 | https://nsearchives.nseindia.com/content/circulars/CMPT71904.pdf | accessed 2026-11-01
  - Zerodha Policies and Procedures (broker example: auto square-off timings) | https://zerodha.com/policies-and-procedures/ | accessed 2026-11-01
---
## The day at a glance

An Indian cash-market day is no longer one continuous session from open to close. Since {{date:2026-08-03}} it has two different closes — one for stocks that have derivatives on them, one for everything else — and the whole closing schedule changes again on {{date:2026-12-07}}. The table below is the day as it runs today; every time comes from the site's [verified facts register](../../facts/), and the rail on the right shows the circular behind each one.

| Session | Time (IST) | What happens |
|---|---|---|
| Block-deal window, morning | {{fact:mkt-block-window-1}} | Large negotiated trades, separate order book |
| Pre-open order entry | {{fact:mkt-preopen-window}} | Orders collect; one opening price per stock is discovered |
| Continuous trading, stocks without derivatives | {{fact:mkt-continuous-session}} | Normal order matching all day |
| Continuous trading, stocks with derivatives | {{fact:mkt-continuous-session-cas-stocks}} | Ends early; the stock moves into the closing auction |
| Closing Auction Session (CAS) | {{fact:mkt-closing-session}} | One closing price per F&O stock, by auction |
| Equity derivatives | {{fact:mkt-fo-session}} | Index and stock futures and options |
| Block-deal window, afternoon | {{fact:mkt-block-window-2}} | Second negotiated-trade window |
| Post-close | {{fact:mkt-post-close-session}} | Trades at the closing price only |

Two things in that table surprise traders who learned the market before 2026: the pre-open order window no longer shuts at 09:08, and stocks with derivatives stop continuous trading at 15:15. The rest of this guide walks through the day in order and then explains what changes in December.

## Pre-open: 09:00 to the first trade

The pre-open session discovers one opening price for every stock instead of letting the first market orders of the day set it. Orders are collected during the order-entry window, {{fact:mkt-preopen-window}}. Since {{date:2026-09-07}} that window closes at a random moment between 09:08 and 09:10, so nobody can time an order for the last second. Only limit and market orders are accepted in this phase; stop-loss and immediate-or-cancel orders are not.

Order matching then runs from 09:10 to 09:12, and the equilibrium price — the one at which the most quantity trades — becomes the open. A short buffer follows until the continuous session starts at {{fact:mkt-continuous-session}}. Those are the current phases from SEBI's [circular of {{date:2026-01-16}} on the Closing Auction Session and the pre-open changes](https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf); NSE's [FAQ attached to circular FAOP/71092](https://nsearchives.nseindia.com/content/circulars/FAOP71092.zip) describes the older 09:08 close that it replaced.

### Derivatives have a pre-open too

Since {{date:2025-12-08}} the futures segment has run its own pre-open, {{fact:mkt-fo-preopen-since}}, for current-month index and stock futures (and for next-month futures during the last five trading days before expiry). The shape is the same — order entry, a matching phase, a buffer — and again only limit and market orders are allowed. NSE's go-live notice is [circular FAOP/71640](https://nsearchives.nseindia.com/content/circulars/FAOP71640.pdf). Options still have no pre-open; their first prints come after the continuous session starts.

:::tip
A newly listed or re-listed stock gets a longer special pre-open on its first day. Do not expect it to trade at the normal opening time; the exchange notice for the listing gives the schedule.
:::

## Continuous trading and the two closes

From {{fact:mkt-continuous-session}} the order book works the way most tutorials describe: continuous matching, every exchange order type available, price bands enforced. The difference in 2026 is how the day ends.

### Stocks with derivatives leave early

For a stock that has futures and options on it, continuous trading runs {{fact:mkt-continuous-session-cas-stocks}}. At 15:15 the stock enters the Closing Auction Session, {{fact:mkt-closing-session}}. The first five minutes fix a reference price — the volume-weighted average price of the last fifteen minutes of continuous trading — and take no orders. Orders are then accepted {{fact:mkt-cas-order-entry-current}}: limit and market orders in the first five minutes of that window, limit orders only in the last five, which end at a random moment in the final two minutes. Matching follows, and the auction price becomes the day's close for that stock. Orders in the auction must sit within {{fact:mkt-cas-band}} of the reference price.

Stocks without derivatives are unaffected: they keep trading continuously to the end of {{fact:mkt-continuous-session}} and close on the usual volume-weighted basis. NSE's [circular CMTR/74466](https://nsearchives.nseindia.com/content/circulars/CMTR74466.zip) carries the trading modalities and an FAQ (question 26 covers the non-F&O stocks), and [circular CMTR/73362](https://nsearchives.nseindia.com/content/circulars/CMTR73362.pdf) is the operational SOP.

:::example
A stock with derivatives last traded at ₹1,000 and its reference price works out to ₹1,000. The auction band is then ₹970 to ₹1,030; a limit order outside that range is rejected. A trader who sends a plain market order at 15:17 gets no continuous-session fill — the stock is already in the reference-price phase, so the order is rejected or has to wait for the entry window. Pending stop-loss orders are not carried into the auction at all; see [Order types and products](../order-types-and-products/).
:::

### Derivatives and the post-close

Equity derivatives keep trading after the cash close: the session is {{fact:mkt-fo-session}} on every trading day, so index futures and options still move for a few minutes after the F&O stocks have found their auction price. Futures price bands narrow to the auction band during this stretch. After everything else has finished, the cash post-close session runs {{fact:mkt-post-close-session}}: you can still buy or sell, but only at the day's closing price.

## What changes from {{date:2026-12-07}}

SEBI's [circular of {{date:2026-10-15}}](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf) reviewed the first months of the auction and moved the whole closing schedule later. The register carries both regimes; the figures below render with "from" until the switch date.

:::note From 7 Dec 2026
- Continuous trading runs to the end of {{fact:mkt-continuous-session}} for **every** stock again, derivatives or not.
- The Closing Auction Session moves to {{fact:opt-cas-window-from-2026-12-07}}, with orders accepted from 15:31 and a random close in the last two minutes.
- Equity derivatives trade {{fact:mkt-fo-session-from-2026-12-07}} — except an expiring index contract, which stops at {{fact:opt-expiring-index-close-time-from-2026-12-07}} on its expiry day.
- An expiring index contract then settles at an index value built from its constituents' volume-weighted prices over the last thirty minutes of continuous trading, broadcast live, instead of the value built from the auction closes. [Index derivatives contract specs](../index-derivatives-specs/) has the detail.
- Post-close stays {{fact:mkt-post-close-session}}. On special sessions (Muhurat, for instance) derivatives close five minutes after the auction and post-close starts five minutes later.
- From {{date:2027-02-08}} an unexecuted iceberg order is carried into the auction as a fully disclosed limit order unless the broker has opted out.
:::

The [What changed](../../changelog/) page lists these dates with their circulars, and the [calendar](../../calendar/) marks {{date:2026-12-07}}.

## Why the clock matters for an intraday trader

Most of this is plumbing, but four consequences reach into a day trader's routine.

- **The "last fifteen minutes" is now the last fifteen minutes of a different session.** For a stock with derivatives, the window before the auction ends at 15:15 until December. A routine built around exiting at 15:22 in such a stock is a routine of placing auction orders, not continuous-market orders.
- {{label:MECHANISM}} **Closing-price logic behaves differently in an auction.** A stop that triggers off the last traded price has no last traded price to watch between 15:15 and the auction match; a market-on-close habit becomes a limit order inside the auction band. Plan the exit before the reference-price phase or accept the auction price.
- **Broker square-off timings predate the auction.** As a published example, Zerodha's [policies page](https://zerodha.com/policies-and-procedures/) says intraday (MIS, cover and bracket) positions in equity cash are squared off from {{fact:mkt-squareoff-example-cash}} onwards and equity derivatives from {{fact:mkt-squareoff-example-fo}} onwards, at the broker's discretion. For an F&O stock the cash time now falls inside the auction. Check your own broker's current policy rather than assuming the old continuous-market behaviour; the charge for a position the broker squares off for you is covered in [Intraday leverage today](../intraday-leverage-today/).
- **Derivatives outlive the cash close.** An index option still prints after its underlying stocks have stopped; on expiry day the settlement method decides what that last quarter-hour means, which is why the December change matters more to options traders than to anyone else.

## Holidays: 2026 and 2027

NSE and BSE are closed on {{fact:mkt-holidays-current-year-count}} weekdays in 2026, counting the special closure on {{date:2026-01-15}} for the Maharashtra municipal elections that the December list did not include; the other dates sit in [circular CMTR/71775](https://nsearchives.nseindia.com/content/circulars/CMTR71775.pdf) and on the [event calendar](../../calendar/). Four more holidays fall on weekends and cost no trading day. Diwali Laxmi Pujan is {{date:2026-11-08}}, a Sunday, so the one-hour Muhurat session is notified separately.

The list for 2027 is {{fact:mkt-holidays-next-year-status}} as of {{date:2026-11-01}}; NSE published the 2026 list on {{date:2025-12-12}}, so expect the 2027 circular around mid-December. Settlement holidays are a separate list from NSE Clearing ([circular CMPT/71904](https://nsearchives.nseindia.com/content/circulars/CMPT71904.pdf)): on those days you can trade but funds and shares do not move, which matters for pay-in deadlines.

:::warning
A holiday on an expiry weekday ({{fact:fo-nifty-weekly-expiry-day}} on NSE, {{fact:fo-sensex-weekly-expiry-day}} on BSE) moves that week's expiry to the previous trading day. The calendar lists each 2026 shift; confirm against your broker's contract master before an expiry-week position.
:::

## Where the official pages disagree

On {{date:2026-11-01}} NSE's [Market Timings page](https://www.nseindia.com/market-data/market-timings) still showed a pre-open order window closing at 09:08 and a "closing session" of 15:40–16:00. Both predate the 2026 changes. The governing documents are SEBI's circulars of {{date:2026-01-16}} and {{date:2026-10-15}} and NSE's CAS circulars CMTR/73362 and CMTR/74466, linked above and in the sources below. When a web page and a circular disagree, the circular wins — and this site's register cites the circular.
