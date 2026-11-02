---
title: Market data for Indian backtests: free, broker, paid
section: Algo & systematic
summary: Where the data for an Indian backtest comes from and what each source cannot do — NSE's daily bhavcopy files and ban-list CSV, BSE's bhavcopy, the history each broker API includes with its plan, the paid tick vendors TrueData and Global Datafeeds, the exchange's tick feed — and the hygiene rules (corporate actions, lot sizes, the expiry-day move) that decide whether a history means anything.
updated: 2026-11-02
level: intermediate
order: 4
topics: [market data, bhavcopy, udiff, nse archives, bse bhavcopy, ban list csv, historical data api, fyers data, kite historical, dhan data api, truedata, global datafeeds, tick data, tick-by-tick feed, corporate actions, survivorship bias]
related: [strategy-families-and-backtest-hygiene, no-code-platforms-and-python-stack, broker-apis-compared, execution-realities-and-architecture, index-derivatives-specs, scanners-and-where-data-lives, settlement-circuits-asm-ban, trading-day-ist]
sources:
  - NSE archives — UDiFF bhavcopy, cash market (file for 31 Oct 2025) | https://nsearchives.nseindia.com/content/cm/BhavCopy_NSE_CM_0_0_0_20251031_F_0000.csv.zip | accessed 2026-11-01
  - NSE archives — UDiFF bhavcopy, futures and options (file for 31 Oct 2025) | https://nsearchives.nseindia.com/content/fo/BhavCopy_NSE_FO_0_0_0_20251031_F_0000.csv.zip | accessed 2026-11-01
  - NSE — All reports (daily files, browser-rendered) | https://www.nseindia.com/all-reports | accessed 2026-11-01
  - NSE archives — F&O securities in ban period, daily CSV | https://nsearchives.nseindia.com/content/fo/fo_secban.csv | accessed 2026-11-01
  - BSE — Bhavcopy download page | https://www.bseindia.com/markets/MarketInfo/BhavCopy | accessed 2026-11-01
  - FYERS — API plans and rate limits (history depth by plan) | https://fyers.in/api-docs/v3/getting-started/plans-and-limits/ | accessed 2026-11-01
  - Zerodha — Kite Connect APIs: plans and pricing | https://zerodha.com/products/api/ | accessed 2026-11-01
  - DhanHQ — Trading APIs | https://dhanhq.co/trading-apis | accessed 2026-11-01
  - TrueData — authorised market-data vendor (home page) | https://www.truedata.in/ | accessed 2026-11-01
  - Global Datafeeds — Shop (NimbleData feeds and market-data APIs) | https://globaldatafeeds.in/shop/ | accessed 2026-11-01
  - SEBI circular CIR/MRD/DP/2018/62 — Measures to strengthen algorithmic trading and the co-location framework (Apr 2018) | https://www.sebi.gov.in/sebi_data/attachdocs/apr-2018/1523271816354.pdf | accessed 2026-11-01
  - SEBI circular CIR/2024/132 — Measures to strengthen the equity index derivatives framework (Oct 2024) | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf | accessed 2026-11-01
  - NSE circular FAOP/70616 — Revision of lot sizes for index derivatives (Oct 2025) | https://nsearchives.nseindia.com/content/circulars/FAOP70616.pdf | accessed 2026-11-01
---
## Free end-of-day data from the exchanges

Every backtest starts with a price file, and for Indian markets the exchanges publish the best free one. NSE's daily **bhavcopy** — the record of every traded instrument's open, high, low, close, volume and open interest for the session — is published in the UDiFF format on its archive host. The cash-market file sits under `content/cm/` and the derivatives file under `content/fo/`, each named with the trade date; the files for {{date:2025-10-31}} are the [cash bhavcopy](https://nsearchives.nseindia.com/content/cm/BhavCopy_NSE_CM_0_0_0_20251031_F_0000.csv.zip) and the [F&O bhavcopy](https://nsearchives.nseindia.com/content/fo/BhavCopy_NSE_FO_0_0_0_20251031_F_0000.csv.zip), the first under 200 kilobytes zipped and the second about a megabyte, because it carries every option strike and every expiry.

The human entry point, NSE's [All reports](https://www.nseindia.com/all-reports) page, is rendered by scripts in the browser; the archive host serves the files directly. Two more files belong beside them. The [F&O ban list](https://nsearchives.nseindia.com/content/fo/fo_secban.csv) is a daily CSV naming the stocks in which new derivative positions are barred that day — a backtest that opens positions in a banned stock is testing something that could not have happened. BSE's [bhavcopy page](https://www.bseindia.com/markets/MarketInfo/BhavCopy) gives the equivalent for BSE-listed stocks and Sensex derivatives.

What the free files cannot do is the point of this guide. They are end-of-day: one row per instrument per session. An intraday strategy, an opening-range rule, a VWAP reclaim or an expiry-day scalp cannot be tested on them, because the row does not say what happened between the open and the close. Daily rows test daily strategies — a trend rule on the index, a factor sort, an end-of-day pairs signal — and nothing shorter.

:::tip Build the archive, then never touch it
Download the bhavcopy for each trading day once, store the raw zip files unchanged, and build every derived table from them. A raw archive you can re-derive from is worth more than any cleaned dataset, because every cleaning rule you later regret can be undone.
:::

## Broker historical APIs

Brokers sell intraday history with their APIs, and the depth depends on the plan. Prices are the ones each page showed on {{date:2026-11-01}}; [Broker APIs compared](../broker-apis-compared/) has the full table.

- **FYERS** publishes the depth by plan. The free Standard plan serves five years of daily candles and one year of intraday candles; [Prime](https://fyers.in/prime), at {{fact:algo-fyers-prime-price}}, extends that to twenty-five-plus years of daily and five-plus years of intraday history and raises the data rate from five requests a second to ten. For expired derivative contracts the plans page lists two years of daily candles on Standard against seven-plus years on Prime, with intraday requests for expired contracts capped at ten a day on Standard.
- **Zerodha** serves historical candles only on the Kite Connect plan at {{fact:algo-kite-connect-price}}; the free Personal plan has orders and portfolio, no candles and no stream. The candle endpoint is rate-limited to three requests a second, so a long backfill is a patient loop.
- **Dhan** prices its live feed, quotes and history together at {{fact:algo-dhan-data-api-price}}, renewing every thirty days.

Broker history is convenient and comes with the same symbols you will trade, but three limits follow it. The depth is whatever the plan says this quarter. The candles are the broker's aggregation of the exchange feed, not the exchange's own record, so two brokers' one-minute candles for the same stock can differ by a tick at the edges. And the data is tied to the account: close the account and the backfill goes with it, which is one more reason to store what you download.

## Paid tick data, and the exchange feed

For tick-level work — order-book replay, latency-sensitive execution studies, intraday options at the strike level — the sources are commercial.

- **[TrueData](https://www.truedata.in/)** describes itself as an authorised NSE, BSE and MCX market-data vendor offering real-time WebSocket APIs, historical data and desktop plugins for AmiBroker, NinjaTrader and Excel. It is paid, price on request: its pricing page was not reachable on {{date:2026-11-01}}, so this site records no figure.
- **[Global Datafeeds](https://globaldatafeeds.in/shop/)** sells NimbleData desktop feeds and market-data APIs with trials; prices sit on per-product shop pages and are not recorded here. Paid, price on request.

The exchange's own tick-by-tick order-book feed has a different price structure. SEBI's [2018 circular](https://www.sebi.gov.in/sebi_data/attachdocs/apr-2018/1523271816354.pdf) on algorithmic trading and co-location made it free of charge — but it is delivered to the exchange's co-location facility, so receiving it means renting a rack. [Execution realities](../execution-realities-and-architecture/) prices that rack from the register and explains why it puts the feed out of a retail trader's reach.

## Data hygiene: what breaks a history

A clean price file can still describe a market that no longer exists. Five adjustments decide whether an Indian history means anything.

1. **Corporate actions.** A stock split, bonus or demerger changes the price without changing the value; unadjusted history shows a crash that never happened. Adjust the series backwards from each action date, keeping the raw file untouched.
2. **Lot-size and contract changes.** SEBI's {{date:2024-10-01}} [measures](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf) set a minimum index-derivative contract value of {{fact:fo-min-contract-value}} at introduction, with lot sizes reviewed to keep the value in range; the Nifty lot has been {{fact:fo-nifty-lot}} since the January 2026 expiries under NSE's [revision circular](https://nsearchives.nseindia.com/content/circulars/FAOP70616.pdf). A per-lot P&L series that ignores the change mixes contracts of different sizes. [Index derivatives contract specs](../index-derivatives-specs/) lists the current values.
3. **Expiry-day and weekly changes.** Nifty's weekly expiry moved to {{fact:fo-nifty-weekly-expiry-day}} from {{date:2025-09-01}}, Bank Nifty weekly options are {{fact:fo-banknifty-weekly-status}}, and each exchange may list {{fact:opt-weekly-expiries-per-exchange}} weekly index expiry. An expiry-day strategy backtested across the change is testing two different calendars; split the sample at the date.
4. **Symbol and universe changes.** Companies rename, merge and leave the F&O list. A universe built from today's list and applied to the past has survivorship bias, the error [Strategy families and the backtest checklist](../strategy-families-and-backtest-hygiene/) explains with code; keep a dated membership table.
5. **Session and settlement changes.** The closing auction, the shorter continuous session for stocks with derivatives and the derivatives close described in [The trading day in IST](../trading-day-ist/) all changed in 2026, and a VWAP or closing-price rule means different things on either side of those dates. The ban list above and the restrictions in [Settlement, circuits, ASM/GSM and the F&O ban](../settlement-circuits-asm-ban/) remove days on which a position could not have been opened.

:::example Worked example — sizing a five-year Nifty options backtest
A trader wants to test a weekly expiry-day strategy on Nifty options over five years. That is roughly 250 weekly expiries, each with dozens of listed strikes, and every one of those contracts has expired — so the question is who still serves expired-contract history.

- On FYERS Standard the expired-contract daily history runs two years, and intraday requests for expired contracts are capped at ten a day: the five-year, intraday test is out of reach on the free plan.
- FYERS Prime at {{fact:algo-fyers-prime-price}} extends expired-contract daily history to seven-plus years and intraday to five-plus years, which covers the test if daily or minute candles are enough.
- If the strategy needs tick-level fills at the strike, the data is a paid vendor's, price on request, and the cost of the data belongs in the strategy's budget before a single order is sent.

The free bhavcopy helps less than it looks: it carries the close and the open interest for every strike, which tests an end-of-day option-writing rule, but says nothing about the path inside the expiry session.
:::

## What this site's own statistics use

The [computed statistics page](../../stats/) on this site is built from a free daily series for the Nifty 50 and India VIX, enough for gap-size and daily-range distributions and a VIX band table, dated and recomputed at each build. It is an example of the limit above: daily data answers daily questions. Nothing on that page could test an intraday rule, and nothing on this page should be read as a recommendation to buy any vendor's feed. Which data you need follows from the shortest interval your rule reads; buy nothing finer.
