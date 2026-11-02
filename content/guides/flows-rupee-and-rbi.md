---
title: FII and DII flows, the rupee and the RBI
section: Macro & events
summary: Where the daily foreign and domestic flow figures come from and why two official series for the same day can carry opposite signs, how USD/INR is benchmarked at {{fact:mac-usdinr-reference-rate-time}}, what the RBI says it does in the currency market and what it publishes only monthly, with worked rupee conversions at the current rate.
updated: 2026-11-02
level: intermediate
order: 2
topics: [fii, fpi, dii, nsdl, provisional flows, usd/inr, fbil reference rate, rbi intervention, forex reserves, trade deficit]
related: [overnight-chain-to-india-open, crude-yields-dollar-sector-map, policy-days-vix-and-sizing, reading-the-option-chain, multi-timeframe-relative-strength, commentary-ratings-block-deals]
sources:
  - NSE — FII/FPI and DII trading activity (provisional daily figures and the notes on their basis) | https://www.nseindia.com/reports/fii-dii | accessed 2026-11-01
  - NSDL — FPI Monitor, latest daily investment data | https://www.fpi.nsdl.co.in/web/Reports/Latest.aspx | accessed 2026-11-01
  - CDSL — Foreign Portfolio Investors statistics | https://www.cdslindia.com/Publications/ForeignPortInvestor.html | accessed 2026-11-01
  - FBIL — Reference Rates (USD/INR at 1:00 PM) | https://www.fbil.org.in/ | accessed 2026-11-01
  - RBI — Governor's Statement, Monetary Policy (Oct 2026) | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63744 | accessed 2026-11-01
  - RBI — Monthly Bulletin, Current Statistics (forex intervention tables) | https://www.rbi.org.in/SCRIPTs/BS_ViewBulletin.aspx | accessed 2026-11-01
  - RBI — Database on Indian Economy (DBIE) | https://data.rbi.org.in/ | accessed 2026-11-01
  - NSE — India VIX index page, header ticker (USDINR futures and Nifty 50 close, Oct 2026) | https://www.nseindia.com/static/products-services/indices-indiavix-index | accessed 2026-11-01
---
## Two official series for the same day

Every evening the financial press reports what "FIIs" bought or sold. Fewer readers know that there are two official figures for the same day, built on different bases, and that they can disagree in sign. Read the wrong one for the wrong purpose and the flow story you tell yourself is simply untrue.

| Series | Who publishes it | What it counts | When it appears |
|---|---|---|---|
| Provisional FII/FPI and DII activity | [NSE](https://www.nseindia.com/reports/fii-dii) (BSE publishes its own) | Members' same-day trades, identified by PAN, as buy, sell and net in ₹ crore; one column for NSE alone and one for all exchanges; includes expiry-day physical-settlement obligations | After the close, the same day |
| Confirmed FPI investment | [NSDL](https://www.fpi.nsdl.co.in/web/Reports/Latest.aspx), with [CDSL](https://www.cdslindia.com/Publications/ForeignPortInvestor.html) | Custodian reports: gross buys, gross sells and net in ₹ crore and $ million with the conversion rate used, split by category (equity, debt, hybrid) and route (stock exchange or primary market) | With a lag, covering trades up to the previous trading day or days |
| DII activity | NSE | Net cash-market flow of mutual funds, insurers, banks and pension funds | After the close, with the FPI figure |

{{label:MECHANISM}} NSDL's own note explains the gap: the exchanges compile provisional figures from what trading members report on the trade date, while the depository's confirmed data come from custodians and cover trades up to the previous day or days. Different reporters, different cut-offs, different bases. Neither is wrong; they measure different things.

:::example
The two series for {{date:2026-10-30}}, both read on {{date:2026-11-01}}. NSE's provisional table showed foreign investors as net buyers of ₹3,344.76 crore on NSE and ₹3,598.54 crore across all exchanges, with domestic institutions net sellers of ₹700.66 crore on NSE and ₹817.51 crore across exchanges. NSDL's confirmed table for the same reporting date showed foreign investors as net *sellers* of equity through the stock exchanges: gross purchases of ₹13,626.03 crore against gross sales of ₹14,438.76 crore, a net outflow of ₹812.73 crore, or $85.22 million at the ₹95.3688 per dollar rate the table used.

Opposite signs, same date. Nothing is broken. The provisional figure captured one day's trades on one basis; the confirmed figure captured custodian-reported settlements on another. Do not average the two or pick the one that suits your position.
:::

### Which to read when

For the next morning's read, use NSE's provisional figure: it is the only one available the same evening and it is the one the market reacts to. For a positional or monthly view, use NSDL's confirmed series: it includes the primary-market route, splits debt from equity, and is the figure that ends up in the RBI's and SEBI's own tables. The one thing never to do is mix them in a single running total.

## Turning flows into rupees, and rupees into dollars

Foreign flows are reported in rupees by the exchanges and in both currencies by NSDL, while the people doing the selling think in dollars. Keep the conversion to hand.

:::example
At the FBIL reference rate of ₹94.9432 per dollar published on {{date:2026-10-23}}, one billion dollars of foreign selling is ₹9,494 crore (1,000 million dollars × 94.9432 = ₹94,943 million, and ten million rupees make a crore). Running the other way, NSDL's net outflow of ₹812.73 crore on {{date:2026-10-30}} is ₹8,127.3 million, which at the table's own rate of ₹95.3688 is $85.2 million — the figure NSDL printed.

Indian figures here are in ₹ crore with Indian grouping; US figures are in dollars with US grouping. A flow number without its currency and date is not a number.
:::

A billion dollars sounds large. What moves prices is the persistence and the surprise, not the size of one day's print, which is why the worked example above is a lesson in reading, not a signal.

## USD/INR: the benchmark, the futures and the RBI

The rupee has one official daily benchmark and one liquid intraday price. The benchmark is the reference rate that Financial Benchmarks India Pvt Ltd publishes at {{fact:mac-usdinr-reference-rate-time}} every working day: ₹94.9432 per dollar on {{date:2026-10-23}}, alongside sterling, the euro and the yen ([FBIL](https://www.fbil.org.in/)). The intraday price is the NSE USDINR future: the November 2026 contract last traded at ₹95.2675 on {{date:2026-10-30}} ([NSE](https://www.nseindia.com/static/products-services/indices-indiavix-index)). Futures trade above the reference rate by the interest-rate differential between the two currencies, exactly as Nifty futures trade above the index, so the two numbers are not supposed to match.

### What the RBI says it does

{{label:EVIDENCE}} The RBI does not defend a level. In the [Governor's statement of {{date:2026-10-07}}](https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63744) the Bank restated that it remains committed to an orderly adjustment of the exchange rate in line with fundamentals and to curbing excessive volatility — a description of smoothing, not of a target. The same statement put foreign-exchange reserves at about eleven months of imports and 94.4 per cent of external debt, said the capital-flow measures taken in the June 2026 policy had supported inflows, and expected the balance of payments to be in surplus in 2026-27. Reserves of that size are why rupee moves tend to be gradual rather than sudden, and why a sharp move is news.

The pressure on the currency comes from trade. The same statement recorded a merchandise trade deficit of $58.7 billion in July–August 2026 against $55.1 billion a year earlier, led by electronics and crude; imports of petroleum, crude and products ran to $35.0 billion in those two months, up 21.3 per cent on a year earlier. [Crude, US yields, the dollar and the sector map](../crude-yields-dollar-sector-map/) follows that channel into the index.

### What the RBI does not publish

The RBI's intervention data — outright dollar sales and purchases, and its forward book — appear monthly, with a lag, in the Current Statistics tables of the [RBI Bulletin](https://www.rbi.org.in/SCRIPTs/BS_ViewBulletin.aspx) and in the [Database on Indian Economy](https://data.rbi.org.in/). There is no same-day official print.

{{label:LORE}} Every intraday claim that "the RBI is selling dollars" is therefore inference from price action: a sharp reversal near a round number, state-owned banks reported as sellers, a sudden fall in volatility. Dealers who watch the screen all day may read those tells well. No public dataset lets anyone check how often they are right, so this site labels them lore. The monthly table is the only evidence, and by the time it arrives the trade is long over.

## Reading flows as a trader

Flows explain more than they predict. Three habits keep them useful.

**Read persistence, not one day.** A single day's provisional figure has the noise of a single day plus the reporting differences above. A fortnight of the same sign, confirmed in NSDL's series, is a regime; one print is not.

**Separate the flow from the price.** {{label:LORE}} "FIIs sold, so the market fell" is said every down day. Whether foreign selling predicts the next day's return for Nifty has no primary Indian study behind it that this site could find on {{date:2026-11-01}}, so it stays a practitioner's claim. The {{date:2026-10-30}} example above, where the two official series disagreed even about the sign, is reason enough not to build a rule on one evening's print.

**Use the rupee as a sector signal, not an index signal.** {{label:MECHANISM}} A weaker rupee lifts the rupee revenue of exporters who bill in dollars, information-technology services above all, and raises the import bill of oil refiners and marketers. The direction is mechanical even when the index is unmoved; the [sector map](../crude-yields-dollar-sector-map/) sets out the four pairs with what breaks each one, and [Multi-timeframe analysis, relative strength and sector rotation](../multi-timeframe-relative-strength/) shows how to check a sector's behaviour against Nifty before acting on a story.

For the derivatives side of positioning — who holds the index futures and options open interest — NSE Clearing's participant-wise file is described in [Reading the option chain](../reading-the-option-chain/). Flows tell you who bought the cash market; that file tells you who is positioned in the futures.

:::evidence What the evidence says
- {{label:EVIDENCE}} NSE's provisional and NSDL's confirmed FPI series are built on different bases and cut-offs and can carry opposite signs on the same date, as on {{date:2026-10-30}}; both publishers document the basis.
- {{label:EVIDENCE}} The RBI describes its currency policy as orderly adjustment and curbing excessive volatility, with reserves of about eleven months of imports (Governor's statement, October 2026).
- {{label:MECHANISM}} A weaker rupee raises exporters' rupee revenue and importers' costs; the futures price exceeds the reference rate by the interest differential.
- {{label:LORE}} Intraday "RBI is selling dollars" tells, and "FII selling means a down day": no same-day official data and no Indian study.
:::
