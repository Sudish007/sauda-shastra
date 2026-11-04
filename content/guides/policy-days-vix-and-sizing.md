---
title: Policy days, India VIX and sizing on event days
section: Macro & events
summary: What happens on an RBI or Fed day in IST and what the RBI publishes at {{fact:mac-rbi-mpc-time-ist}}, when India's CPI, IIP and GDP land, how India VIX turns into an expected daily move in Nifty points and rupees per lot of {{fact:fo-nifty-lot}} units, what ten years of data say about VIX bands, and a sizing rule that keeps one event-day standard deviation inside your daily loss limit.
updated: 2026-11-04
level: intermediate
order: 4
topics: [rbi mpc, repo rate, fomc, fed funds, india vix, expected move, event day, sizing, daily loss limit, budget day, cpi, iip, gdp]
related: [iv-expected-move-and-crush, expiry-day-dynamics, position-sizing-and-loss-limits, event-day-iv-crush-hedged, overnight-chain-to-india-open, crude-yields-dollar-sector-map, greeks-for-a-day-trader, volatility-tells-skew-term-structure]
tools: [expected-move, position-size]
sources:
  - RBI — Meeting Schedule of the Monetary Policy Committee for 2026-27 (Mar 2026) | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62422 | accessed 2026-11-01
  - RBI — Monetary Policy Committee resolution (Oct 2026) | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63742 | accessed 2026-11-01
  - RBI — Governor's Statement, Monetary Policy (Oct 2026) | https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63744 | accessed 2026-11-01
  - RBI — Monetary Policy overview (process, resolution and minutes) | https://www.rbi.org.in/Scripts/FS_Overview.aspx?fn=2752 | accessed 2026-11-01
  - RBI — Monetary Policy page (documents published on each policy day) | https://www.rbi.org.in/scripts/Annualpolicy.aspx | accessed 2026-11-01
  - Reserve Bank of India, official YouTube channel — Monetary Policy Statement stream listing (Jun 2026) | https://www.youtube.com/watch?v=9u3MtqbdZ44 | accessed 2026-11-01
  - Federal Reserve — FOMC meeting calendars, 2026 and 2027 | https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm | accessed 2026-11-01
  - Federal Reserve — FOMC statement (Oct 2026) | https://www.federalreserve.gov/newsevents/pressreleases/monetary20261028a.htm | accessed 2026-11-01
  - NSE — India VIX computation methodology | https://nsearchives.nseindia.com/s3fs-public/inline-files/India_VIX_comp_meth.pdf | accessed 2026-11-01
  - NSE — India VIX index page | https://www.nseindia.com/static/products-services/indices-indiavix-index | accessed 2026-11-01
  - PIB — MoSPI revises the release time of CPI and IIP (Nov 2024) | https://pib.gov.in/PressReleasePage.aspx?PRID=2070932 | accessed 2026-11-01
  - PIB — IIP to be released on the 28th of every month (Apr 2025) | https://pib.gov.in/PressReleasePage.aspx?PRID=2122427 | accessed 2026-11-01
  - PIB — MoSPI revises the release time of GDP estimates (Nov 2024) | https://pib.gov.in/PressReleasePage.aspx?PRID=2071663 | accessed 2026-11-01
  - PIB — Estimates of GDP for the first quarter of 2026-27 (Aug 2026) | https://pib.gov.in/PressReleasePage.aspx?PRID=2304949 | accessed 2026-11-01
  - NSE circular NSE/CMTR/72349 (Jan 2026) — live trading session on Budget day | https://nsearchives.nseindia.com/content/circulars/CMTR72349.pdf | accessed 2026-11-01
  - Ministry of Finance — Budget Speech 2026-27, paras 94–96 | https://www.indiabudget.gov.in/doc/budget_speech.pdf | accessed 2026-11-01
  - BLS — Schedule of Releases for the Consumer Price Index | https://www.bls.gov/schedule/news_release/cpi.htm | accessed 2026-11-01
  - BLS — Schedule of Releases for the Employment Situation | https://www.bls.gov/schedule/news_release/empsit.htm | accessed 2026-11-01
  - SEBI — LODR Regulations as amended (Dec 2025), Regulation 33 | https://www.sebi.gov.in/sebi_data/attachdocs/dec-2025/1766489756276.pdf | accessed 2026-11-01
---
## The scheduled events, in IST

A scheduled event is the one kind of volatility whose date and time you know in advance. The trader who knows that the RBI speaks at {{fact:mac-rbi-mpc-time-ist}}, that India's inflation print lands after the cash close and that the Fed speaks in the middle of the Indian night can decide before the day begins how much risk to carry into each. The table gives the Indian times; the [IST event calendar](../../calendar/) carries the dates.

| Event | Lands in IST | Is NSE open? |
|---|---|---|
| RBI policy decision | {{fact:mac-rbi-mpc-time-ist}} on the last day of each MPC meeting | Yes, forty-five minutes into the session |
| India CPI, twelfth of the month | {{fact:mac-india-cpi-release-ist}} | No; GIFT Nifty's evening session is open |
| India IIP, twenty-eighth of the month | {{fact:mac-india-iip-release-ist}} | No |
| India GDP, quarterly | {{fact:mac-india-gdp-release-ist}} on MoSPI's advance-release dates | No |
| Union Budget | {{fact:mac-budget-date}}, during market hours | Yes; in 2026 the exchanges opened on a Sunday for it |
| US CPI and jobs report | {{fact:mac-us-cpi-release-ist-dst}} in US daylight saving time; {{fact:mac-us-cpi-release-ist-std}} otherwise | No |
| FOMC statement | {{fact:mac-fomc-statement-ist-dst}} in US daylight saving time; {{fact:mac-fomc-statement-ist-std}} the next calendar day otherwise | No |
| Weekly index expiry | Every {{fact:fo-nifty-weekly-expiry-day}} on NSE and every {{fact:fo-sensex-weekly-expiry-day}} on BSE | Yes, with an extra {{fact:fo-expiry-day-elm-addon}} ELM on short options expiring that day |

### What an RBI day contains

The Monetary Policy Committee meets six times a year; the [schedule for 2026-27](https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=62422) was published in March 2026 under the RBI Act, and the two decision days still to come in this cycle are {{date:2026-12-04}} and {{date:2027-02-05}}. On the last day the Governor's statement is streamed at {{fact:mac-rbi-mpc-time-ist}} — the time is stated in the RBI's [own listing of the stream](https://www.youtube.com/watch?v=9u3MtqbdZ44), and no press release states it, which is why that listing is the source. The [RBI's policy page](https://www.rbi.org.in/scripts/Annualpolicy.aspx) then carries four documents for the day: the Governor's statement, the MPC resolution with the vote, the Statement on Developmental and Regulatory Policies, and a post-policy press conference. The [minutes](https://www.rbi.org.in/Scripts/FS_Overview.aspx?fn=2752), with each member's vote and reasoning, follow on the fourteenth day after the meeting, and the Governor holds a casting vote if the committee ties.

For the market the sequence matters. The headline rate decision hits at the statement; the stance and the inflation projection follow in the same speech; the regulatory statement can contain rules that move a sector (bank capital, lending norms) with no connection to the rate at all. Bank and rate-sensitive stocks reprice during the speech, bond yields move with it, and the press conference can reverse the first reaction. Nothing about a scheduled event makes its direction predictable; what it makes predictable is the hour in which the uncertainty is resolved.

### Indian data after the close, US data at night

MoSPI moved the CPI and IIP releases to {{fact:mac-india-cpi-release-ist}} from half past five with effect from November 2024 ([PIB](https://pib.gov.in/PressReleasePage.aspx?PRID=2070932)), and from April 2025 the IIP comes out on the twenty-eighth of the month, twenty-eight days after the reference month instead of forty-two ([PIB](https://pib.gov.in/PressReleasePage.aspx?PRID=2122427)). GDP press notes moved to {{fact:mac-india-gdp-release-ist}} in the same reform ([PIB](https://pib.gov.in/PressReleasePage.aspx?PRID=2071663)); the first-quarter estimate for 2026-27, released on {{date:2026-08-31}}, put real growth at 7.8 per cent and nominal growth at 10.3 per cent ([PIB](https://pib.gov.in/PressReleasePage.aspx?PRID=2304949)). All three land after the cash market has closed, so the first instrument to price them is GIFT Nifty's evening session and the first NSE price is the next morning's pre-open.

US data are later still. CPI and the jobs report arrive at {{fact:mac-us-cpi-release-ist-dst}} in the Indian evening during US daylight saving time and at {{fact:mac-us-cpi-release-ist-std}} otherwise; the jobs report follows the same clock, {{fact:mac-us-nfp-release-ist-dst}} and {{fact:mac-us-nfp-release-ist-std}}. The FOMC statement, eight times a year, arrives at {{fact:mac-fomc-statement-ist-dst}} or, in US standard time, at {{fact:mac-fomc-statement-ist-std}} — by then it is the next calendar day in India, and the next NSE session is a few hours away. [The overnight chain](../overnight-chain-to-india-open/) explains how to read the reaction before the open.

Two more dates fill the calendar. The Union Budget is presented on {{fact:mac-budget-date}}; in 2026 that was a Sunday, and NSE ran a live session with the normal hours under [circular 72349](https://nsearchives.nseindia.com/content/circulars/CMTR72349.pdf), so the market priced the speech as it was read. That speech set the fiscal deficit at 4.4 per cent of GDP in the revised estimate for 2025-26 and 4.3 per cent for 2026-27, on total expenditure of ₹53.5 lakh crore and net tax receipts of ₹28.7 lakh crore ([Budget Speech](https://www.indiabudget.gov.in/doc/budget_speech.pdf), paras 94–96). Results season follows the listing rules: quarterly results within {{fact:sebi-results-deadline-quarterly}} of the quarter's end and audited annual results within {{fact:sebi-results-deadline-annual}} of the year's end under [Regulation 33](https://www.sebi.gov.in/sebi_data/attachdocs/dec-2025/1766489756276.pdf), which puts the heaviest weeks of each season in the second half of July, October, January and April–May.

## October 2026 as a worked case

On {{date:2026-10-07}} the MPC raised the repo rate by a quarter point to {{fact:mac-repo-rate}} by a unanimous vote, with the standing deposit facility a quarter point below it and the marginal standing facility and Bank Rate a quarter point above, and changed its stance to "calibrated tightening" ([resolution](https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63742)). The same resolution projected real GDP growth of 7.1 per cent for 2026-27 after 7.8 per cent in the first quarter, and CPI inflation of 5.2 per cent for the year with 6.0 per cent in the third quarter and 5.7 in the fourth, against 4.8 per cent in August and 4.5 in July, core inflation at 4.2. The [Governor's statement](https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63744) added the crude, currency and transmission detail that the [sector map](../crude-yields-dollar-sector-map/) relies on.

Three weeks later the Federal Reserve held its target range at {{fact:mac-fed-funds-range}} on {{date:2026-10-28}} by a ten-to-two vote, the two dissenters (Cook and Hammack) preferring a quarter-point increase, after raising the rate by a quarter point in September ([FOMC statement](https://www.federalreserve.gov/newsevents/pressreleases/monetary20261028a.htm)). The statement reached India at {{fact:mac-fomc-statement-ist-dst}}, the last FOMC of the year before the US clocks changed.

{{label:MECHANISM}} What a trader does with those facts is not to predict the next vote. It is to notice three things about every scheduled decision. The move in the index comes from the surprise against what was priced, not from the decision itself. Implied volatility is bid up into the event and tends to fall once the uncertainty is gone, whichever way the decision went — the crush that [Implied volatility, the expected move and IV crush](../iv-expected-move-and-crush/) documents from NSE's own files for the two Budget days. And the event's hour decides whether the move happens in your face or while you sleep.

## India VIX: from an annual number to a daily move

India VIX is NSE's measure of the volatility that Nifty options are pricing for the next thirty calendar days, expressed as an annualised percentage. The [methodology document](https://nsearchives.nseindia.com/s3fs-public/inline-files/India_VIX_comp_meth.pdf) computes it from the best bid and ask quotes of out-of-the-money near- and mid-month Nifty options, by the CBOE method adapted with cubic splines, with time to expiry counted in minutes and NSE MIBOR as the risk-free rate. The number itself is the easy part; the arithmetic that makes it useful takes two lines.

{{label:MECHANISM}} An annualised volatility V implies a one-standard-deviation move of about V × √(30 ÷ 365) over thirty days and about V ÷ √252 over one trading day, because volatility scales with the square root of time. At a VIX of 14 the thirty-day figure is about 4.0 per cent and the one-day figure about 0.88 per cent.

| India VIX | One-day σ | Points on Nifty at 23,053.10 | ₹ per lot of {{fact:fo-nifty-lot}} units |
|---|---|---|---|
| 14 | 0.88% | ±203 | ₹13,195 |
| 22 | 1.39% | ±320 | ₹20,800 |

The Nifty level is the close of {{date:2026-10-30}} ([NSE](https://www.nseindia.com/static/products-services/indices-indiavix-index)); the per-lot figure is the point move multiplied by the lot. The [expected-move calculator](../../tools/expected-move/) does the same arithmetic for any index level, VIX and horizon, and also prices the move from a straddle instead of from VIX, which on an event day is usually the better input because the straddle prices that day and VIX prices thirty.

### Regimes: convention versus computed data

{{label:LORE}} Traders quote VIX "regimes" — below twelve is calm, above twenty is stressed, and so on. These are conventions. No NSE or SEBI document defines regime bands, and the [India VIX page](https://www.nseindia.com/static/products-services/indices-indiavix-index) checked on {{date:2026-11-01}} carries no such table. Any blog table of bands is someone's habit, not a measurement.

{{label:EVIDENCE}} What can be measured is how the next session's range has behaved at different VIX levels. This site's [computed statistics page](../../stats/#vix) takes ten years of daily India VIX closes, splits them into quartiles, and reports for each quarter the median and the upper percentiles of the following Nifty session's high-to-low range. The ranges widen band by band, and the median range after a close in the highest quarter runs at roughly twice the median after a close in the lowest. The page states its data source, its method and its date, and labels the table historical, not a forecast — which is exactly the status of any VIX "regime": a description of the past distribution of ranges, nothing more.

## Sizing on event days

The sizing rule follows from the arithmetic above and from the loss limits in [Position sizing and loss limits](../position-sizing-and-loss-limits/): size the position so that a one-standard-deviation move against you costs no more than the day's loss limit, then adjust for where in the day the event lands.

:::example
A trader runs a daily loss limit of ₹1,00,000 and trades Nifty futures, lot {{fact:fo-nifty-lot}}. At a VIX of 14 the one-day σ is about ₹13,195 a lot, so the limit allows seven lots (₹92,365 at risk for a one-σ move against the position). At a VIX of 22 it is about ₹20,800 a lot, so four lots (₹83,200). The [position-size calculator](../../tools/position-size/) gives the same answer when the stop is set at the σ distance in points.

On a day when the event lands inside Indian hours — an RBI decision at {{fact:mac-rbi-mpc-time-ist}} — halve that: three lots at a VIX of 14, two at 22. The one-σ figure is the whole day's expected range; an announcement compresses most of it into minutes, during which a stop can be filled far from its level. When the event lands after the close — US CPI at {{fact:mac-us-cpi-release-ist-std}}, the FOMC at {{fact:mac-fomc-statement-ist-std}} — the risk is a gap at the next open that no intraday stop can protect, so an overnight position is better held in a defined-risk structure such as the spreads in [Spreads and delta-neutral structures](../spreads-and-delta-neutral/), where the maximum loss is known in advance, or not held at all. The figures are illustrative; the lots and the limit are the reader's to set.
:::

{{label:MECHANISM}} Two further adjustments are mechanical rather than discretionary. When the event falls on an expiry day — a FOMC night running into a {{fact:fo-sensex-weekly-expiry-day}} Sensex expiry, or an RBI decision on a {{fact:fo-nifty-weekly-expiry-day}} Nifty expiry — short options carry the extra {{fact:fo-expiry-day-elm-addon}} expiry-day margin and the gamma described in [Expiry-day dynamics](../expiry-day-dynamics/), so the same rupee limit buys fewer lots. And on any event day the straddle-implied move, not the VIX-implied move, is the σ to use, because the market has already loaded that day's premium into the near expiry.

:::warning Base rates first
Event days concentrate volume and losses alike. In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)); [What SEBI's loss studies say](../what-sebi-loss-studies-say/) sets out the detail. A sizing rule limits the damage of being wrong; it is not evidence that event-day trading pays. Every figure here is in the [verified facts register](../../facts/).
:::

:::evidence What the evidence says
- {{label:EVIDENCE}} The RBI decided on {{date:2026-10-07}} and the Fed on {{date:2026-10-28}} as described, in their own documents; the Indian release times are the publishers' stated times, converted to IST.
- {{label:EVIDENCE}} Ten years of India VIX closes, split into quartiles on this site's statistics page, show the next session's Nifty range widening band by band — historical, dated, not a forecast.
- {{label:MECHANISM}} VIX ÷ √252 is the one-day σ; an announcement inside market hours compresses the day's range into minutes; an announcement after the close converts the risk into a gap.
- {{label:LORE}} Named VIX regime bands, and any claim that a given VIX level predicts the direction of the move: no primary source.
:::
