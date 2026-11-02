---
title: Stock scanners and where the data lives
section: Fundamentals & news
summary: A liquidity-first scan — start from NSE's F&O universe, drop anything on the ASM or GSM lists or in the F&O ban that starts at {{fact:fo-mwpl-ban-threshold}} of a stock's market-wide position limit, rank by ATR per cent and pre-open volume — and a dated map of the data: NSE, BSE and NSDL for primary feeds; Screener, Trendlyne, Tickertape and Chartink for screens, with the prices seen.
updated: 2026-11-02
level: beginner
order: 4
topics: [stock scanner, screener, f&o universe, liquidity filter, asm, gsm, f&o ban, atr percent, pre-open volume, data sources, screener.in, trendlyne, tickertape, chartink]
related: [results-season-playbook, commentary-ratings-block-deals, governance-red-flags, settlement-circuits-asm-ban, indicators-and-why-they-lag, multi-timeframe-relative-strength, opening-range-and-gaps, premarket-gainer-momentum, what-a-trade-costs, market-data-for-backtesting-india]
tools: [charges]
sources:
  - NSE — List of underlyings and information (equity derivatives) | https://www.nseindia.com/products-services/equity-derivatives-list-underlyings-information | accessed 2026-11-01
  - NSE — Additional Surveillance Measure reports | https://www.nseindia.com/reports/asm | accessed 2026-11-01
  - NSE — Graded Surveillance Measure | https://www.nseindia.com/regulations/graded-surveillance-measure | accessed 2026-11-01
  - NSE — F&O securities in ban period (daily CSV) | https://nsearchives.nseindia.com/content/fo/fo_secban.csv | accessed 2026-11-01
  - NSE Clearing — Position limits and securities in ban period | https://www.nseclearing.in/risk-management/equity-derivatives/position-limits | accessed 2026-11-01
  - NSE — Pre-open market (CM and Emerge) | https://www.nseindia.com/market-data/pre-open-market-cm-and-emerge-market | accessed 2026-11-01
  - NSE — Corporate filings: pledged data | https://www.nseindia.com/companies-listing/corporate-filings-pledged-data | accessed 2026-11-01
  - NSE — Corporate filings: announcements | https://www.nseindia.com/companies-listing/corporate-filings-announcements | accessed 2026-11-01
  - NSE — Bulk and block deals | https://www.nseindia.com/report-detail/display-bulk-and-block-deals | accessed 2026-11-01
  - NSE — FII/FPI and DII trading activity | https://www.nseindia.com/reports/fii-dii | accessed 2026-11-01
  - NSDL — FPI Monitor, latest data | https://www.fpi.nsdl.co.in/web/Reports/Latest.aspx | accessed 2026-11-01
  - BSE — Bhavcopy (end-of-day files) | https://www.bseindia.com/markets/MarketInfo/BhavCopy | accessed 2026-11-01
  - Screener.in — Premium plan page | https://www.screener.in/premium/ | accessed 2026-11-01
  - Trendlyne — Subscription plans | https://trendlyne.com/subscription/plans/ | accessed 2026-11-01
  - Tickertape — Pricing | https://www.tickertape.in/pricing | accessed 2026-11-01
  - Chartink — Premium subscription | https://chartink.com/subscription | accessed 2026-11-01
  - SEBI DEPA-II profitability study (FY25–FY26), 20 Aug 2026 | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
---
## Start from liquidity, not from a chart

A scanner answers one question: which of the two thousand or so listed stocks deserve a chart today? Most retail scans start with a pattern and end with an illiquid stock whose spread eats the edge. Reverse the order. Start with the names you can get into and out of, remove the ones the exchange has put under restrictions, and only then rank by what moved.

{{label:MECHANISM}} The simplest liquidity filter is NSE's own list of stocks on which futures and options trade, the [F&O universe](https://www.nseindia.com/products-services/equity-derivatives-list-underlyings-information). A stock reaches that list by meeting SEBI's eligibility tests on market size and cash-market delivery value, so every member has a working order book, a known market-wide position limit and a lot size; a few hundred stocks qualify. For an equity intraday trader the list is useful even without touching a derivative: it is a pre-filtered set of names where a market order for a normal retail size does not move the price.

### Three exclusions, every morning

The exchanges publish three lists that change daily, and a stock on any of them is removed before ranking.

- **ASM.** The [Additional Surveillance Measure](https://www.nseindia.com/reports/asm) report lists stocks under long-term and short-term surveillance with their stage; higher stages mean margins at or near the full trade value and, at many brokers, no intraday leverage.
- **GSM.** The [Graded Surveillance Measure](https://www.nseindia.com/regulations/graded-surveillance-measure) list covers stocks whose price has detached from any fundamentals; its stages add trade-for-trade settlement, which rules out intraday netting altogether.
- **The F&O ban.** When the open interest in a stock's derivatives crosses {{fact:fo-mwpl-ban-threshold}} of its market-wide position limit, new positions are barred until it falls back to eighty per cent; NSE publishes the [day's ban list](https://nsearchives.nseindia.com/content/fo/fo_secban.csv) as a CSV and [NSE Clearing](https://www.nseclearing.in/risk-management/equity-derivatives/position-limits) explains the limit. A banned stock still trades in cash, but the options trader's exits are gone and the day's flows are distorted.

[Settlement, circuits, ASM/GSM and the F&O ban](../settlement-circuits-asm-ban/) explains what each regime does to a position; this guide only needs the lists.

## Rank by ATR per cent and pre-open volume

Once the universe is clean, rank it by two numbers that are cheap to compute and hard to fake.

{{label:MECHANISM}} **ATR per cent** is the average true range over a lookback — fourteen periods is Wilder's convention — divided by the price and multiplied by a hundred. Dividing by price puts a ₹100 stock and a ₹2,400 stock on the same scale: it measures how far the stock usually travels in a day as a share of its price, which is the raw material an intraday trade is made of. [Indicators and why they lag](../indicators-and-why-they-lag/) covers ATR as a stop-sizing unit; here it is a filter.

:::example Worked example
A stock at ₹1,000 with a fourteen-day ATR of ₹30 has an ATR per cent of 3.0; a filter set at 2.5 keeps it. A stock at ₹1,000 with an ATR of ₹12 scores 1.2 and is dropped — not because it is a bad company, but because a normal day in it does not pay for the round-trip costs and the stop. A scan written as "F&O stock, ATR per cent at or above 2.5, not on ASM or GSM, not in the ban" is already shorter than most watchlists.
:::

**Pre-open volume and price change** come from NSE's [pre-open market page](https://www.nseindia.com/market-data/pre-open-market-cm-and-emerge-market), which shows indicative prices and quantities while orders are collected in the {{fact:mkt-preopen-window}} window and the final equilibrium price once the window has closed at a random moment in its last two minutes. A stock whose pre-open quantity is several times its usual, with a price change to match, has news or a large order behind it; [Opening ranges and gaps](../opening-range-and-gaps/) and the [pre-market gainer playbook](../../playbooks/premarket-gainer-momentum/) describe what to do with the list. A slower version uses the first fifteen minutes of continuous trading against the stock's own twenty-day average volume for that interval, which needs a data feed but removes the pre-open's thin-quantity noise.

{{label:MECHANISM}} Neither number is a signal. ATR per cent says the stock moves; pre-open volume says someone wants it today. Relative strength against the index, in [Multi-timeframe analysis, relative strength and sector rotation](../multi-timeframe-relative-strength/), is the third ranking most traders add, and it is the one that needs a sector view to interpret.

## Check before holding overnight

A scan built for the session can produce a position someone wants to keep. Before that happens, three filings from the [Fundamentals & news](../) section apply:

- **Results date.** The board-meeting intimation on the [announcements page](https://www.nseindia.com/companies-listing/corporate-filings-announcements) tells you whether the number lands tomorrow; [Results season](../results-season-playbook/) explains the clock.
- **Pledge.** The [pledged-data page](https://www.nseindia.com/companies-listing/corporate-filings-pledged-data) shows whether a lender can become a seller; [Governance red flags](../governance-red-flags/) explains the loop.
- **Deals.** The evening [bulk and block deal lists](https://www.nseindia.com/report-detail/display-bulk-and-block-deals) show whether size moved in the name today; [Management commentary, analyst ratings and block deals](../commentary-ratings-block-deals/) explains how little a print says about why.

## Where the data lives

Primary feeds first. Everything below is free and published by the exchange, the clearing corporation or a depository; the full linked list, including broker API documentation, is on the [Resources](../../resources/) page.

| Data | Primary source | Notes |
|---|---|---|
| F&O universe, lot sizes | [NSE underlyings list](https://www.nseindia.com/products-services/equity-derivatives-list-underlyings-information) | Contract information per stock |
| ASM and GSM lists | [NSE ASM](https://www.nseindia.com/reports/asm), [NSE GSM](https://www.nseindia.com/regulations/graded-surveillance-measure) | Daily, with stage; CSV download |
| F&O ban list | [NSE CSV](https://nsearchives.nseindia.com/content/fo/fo_secban.csv); [NSE Clearing](https://www.nseclearing.in/risk-management/equity-derivatives/position-limits) | Published before the open |
| Pre-open prices and quantities | [NSE pre-open](https://www.nseindia.com/market-data/pre-open-market-cm-and-emerge-market) | Live during the window; the page is script-heavy and slow to load |
| Announcements, results, board meetings | [NSE](https://www.nseindia.com/companies-listing/corporate-filings-announcements), [BSE](https://www.bseindia.com/corporates/ann.html) | Filed within the LODR deadlines |
| Promoter pledge | [NSE pledged data](https://www.nseindia.com/companies-listing/corporate-filings-pledged-data) | Takeover-code disclosures by company |
| Bulk and block deals | [NSE](https://www.nseindia.com/report-detail/display-bulk-and-block-deals) | Same day, after market hours |
| FII and DII flows | [NSE provisional](https://www.nseindia.com/reports/fii-dii); [NSDL confirmed](https://www.fpi.nsdl.co.in/web/Reports/Latest.aspx) | Two series on different bases; see [Flows, the rupee and the RBI](../flows-rupee-and-rbi/) |
| End-of-day prices and volumes | [BSE bhavcopy](https://www.bseindia.com/markets/MarketInfo/BhavCopy) | Daily files for backtests |

### The four screeners, with prices seen on {{date:2026-11-01}}

The exchanges give you the raw tables; the screeners join them to fundamentals, estimates and charts and let you save a scan. All four have a usable free tier. The paid prices below were read on each provider's own pricing page on {{date:2026-11-01}}; they change, and this site does not track them.

| Provider | Free tier | Paid tier, price seen {{date:2026-11-01}} | Best for |
|---|---|---|---|
| [Screener.in](https://www.screener.in/) | Yes | Active Investor ₹4,999/year ([plan page](https://www.screener.in/premium/)) | Fundamentals, ratios and custom screens; results and announcement alerts |
| [Trendlyne](https://trendlyne.com/) | Yes | GURUQ ₹390/month; PRO ₹1,500/month; PRO PLUS ₹2,000/month, billed monthly, annual plans discounted ([plans](https://trendlyne.com/subscription/plans/)) | Analyst consensus, results dashboards, F&O analytics |
| [Tickertape](https://www.tickertape.in/) | Yes | Pro ₹399/month, ₹899/quarter, or ₹2,399.2/year with a promotional code ([pricing](https://www.tickertape.in/pricing)) | Screens across stocks, mutual funds and ETFs |
| [Chartink](https://chartink.com/) | Yes, on delayed data | Premium ₹780/month, ₹2,220/quarter or ₹8,500/year including taxes ([subscription](https://chartink.com/subscription)) | Technical scans on one- to three-minute data, alerts, scheduled dashboards |

At those prices the cheapest paid tier of each — ₹4,999, twelve months of GURUQ at ₹4,680, the Tickertape annual price of ₹2,399.2 and Chartink's ₹8,500 — adds up to ₹20,578.2 a year, an illustrative sum of list prices before taxes and promotions. Nobody needs all four. A fundamentals reader lives in Screener; a technical scanner lives in Chartink; the other two overlap with both. Pick one, learn its scan language, and spend the rest of the money on data you cannot get free, if you ever need it.

## What a scan cannot do

{{label:LORE}} No scanner publishes the hit rate of its users' scans, and no Indian study measures whether stocks selected by volume or range filters go on to outperform intraday. "Scan for the top gainers and ride momentum" is a practitioner's claim; the only evidence-grade statement is that a liquidity filter lowers transaction costs, which is arithmetic.

:::warning Base rates first
SEBI's study of individual traders found that {{fact:sebi-loss-2026-share}} of individual F&O traders lost money in FY26, an average net loss of {{fact:sebi-loss-2026-avg}} each. A better watchlist does not change that base rate; costs and sizing do. [What SEBI's loss studies say](../what-sebi-loss-studies-say/) has the figures, and [What a trade costs](../what-a-trade-costs/) has the arithmetic.
:::

Two last steps belong to every scan. Run the candidate's round trip through the [charges calculator](../../tools/charges/) with your own brokerage, so the ATR per cent you selected on is compared with the cost it has to clear; and size from the stop, not from the scan's enthusiasm, with the rule in [Position sizing and loss limits](../position-sizing-and-loss-limits/). A scanner finds names. It does not find trades.

:::evidence What the evidence says
- {{label:EVIDENCE}} The F&O universe, the ASM and GSM lists, the daily ban list and the {{fact:fo-mwpl-ban-threshold}} trigger are published by NSE and NSE Clearing, linked above; the four providers' prices were read on their own pages on {{date:2026-11-01}}.
- {{label:MECHANISM}} ATR per cent normalises daily range across prices; pre-open quantity flags interest before the open; a liquidity filter lowers costs.
- {{label:LORE}} Any claim that scanner-selected stocks outperform: no published Indian evidence.
:::
