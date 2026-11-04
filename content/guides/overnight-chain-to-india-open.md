---
title: The overnight chain: from the US close to the India open
section: Macro & events
summary: One clock in IST for the twenty-four hours before Nifty opens: when New York closes, how GIFT Nifty trades through the night and absorbs US data, when Tokyo and Hong Kong open, and how to read a GIFT Nifty quote against the previous close without mistaking a futures premium for a gap.
updated: 2026-11-04
level: beginner
order: 1
topics: [overnight chain, gift nifty, nyse close, es futures, asia open, pre-open auction, us cpi, nfp, fomc, ist]
related: [trading-day-ist, opening-range-and-gaps, policy-days-vix-and-sizing, flows-rupee-and-rbi, orb-15-min-nifty, gap-fill-fade, flows-and-calendar-effects]
sources:
  - NSE IX — Trading Hours, index futures (GIFT Nifty sessions) | https://www.nseix.com/markets/trading/tradinghoursnew | accessed 2026-11-01
  - NSE IX — Press release on GIFT Nifty volumes and the record day (Sep 2026) | https://www.nseix.com/web/pressrelease/2026-09/PR_CC_25092026_1_20260925200618.pdf | accessed 2026-11-01
  - NYSE — Trading Hours & Calendars | https://www.nyse.com/trade/hours-calendars | accessed 2026-11-01
  - CME Group — E-mini S&P 500 futures contract specifications | https://www.cmegroup.com/markets/equities/sp/e-mini-sandp500.contractSpecs.html | accessed 2026-11-01
  - JPX — Trading Hours, domestic stocks | https://www.jpx.co.jp/english/equities/trading/domestic/01.html | accessed 2026-11-01
  - HKEX — Securities Market trading hours | https://www.hkex.com.hk/Services/Trading-hours-and-Severe-Weather-Arrangements/Trading-Hours/Securities-Market?sc_lang=en | accessed 2026-11-01
  - NIST — Daylight Saving Time | https://www.nist.gov/pml/time-and-frequency-division/popular-links/daylight-saving-time-dst | accessed 2026-11-01
  - BLS — Schedule of Releases for the Consumer Price Index | https://www.bls.gov/schedule/news_release/cpi.htm | accessed 2026-11-01
  - BLS — Schedule of Releases for the Employment Situation | https://www.bls.gov/schedule/news_release/empsit.htm | accessed 2026-11-01
  - Federal Reserve — FOMC statement (Oct 2026), release header | https://www.federalreserve.gov/newsevents/pressreleases/monetary20261028a.htm | accessed 2026-11-01
  - SEBI circular (Jan 2026) — Introduction of Closing Auction Session and modifications in the pre-open session | https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf | accessed 2026-11-01
  - NSE — India VIX index page, header ticker (Nifty 50 close and GIFT Nifty quote, Oct 2026) | https://www.nseindia.com/static/products-services/indices-indiavix-index | accessed 2026-11-01
---
## One clock, in IST

By the time Nifty opens, the world has already traded for eighteen hours since it closed. New York has finished a full session, US data have been released, S&P 500 futures have reacted to all of it, and Tokyo and Hong Kong have been open for hours. The Indian trader who reads that chain in order knows roughly where the open will be before the pre-open auction says so. The one who skips it is surprised by a gap that everyone else saw coming.

The chain only makes sense on one clock. India runs on IST, UTC+5:30, with no daylight-saving change. The United States moves its clocks twice a year, so every US time has two IST equivalents: Eastern Daylight Time is IST minus nine and a half hours, Eastern Standard Time is IST minus ten and a half. In 2026 US daylight saving time runs {{fact:mac-us-dst-2026}}, by the rule [NIST publishes](https://www.nist.gov/pml/time-and-frequency-division/popular-links/daylight-saving-time-dst): the second Sunday of March to the first Sunday of November. Every US row below therefore shows two times.

| Step | Session in IST | Why it matters |
|---|---|---|
| NSE cash market closes | {{fact:mkt-continuous-session}} | Equity derivatives keep trading in the {{fact:mkt-fo-session}} window; the Indian day ends there |
| GIFT Nifty, second session | {{fact:mac-gift-nifty-session-2}} | Nifty futures keep pricing in dollars on NSE IX while New York trades |
| NYSE core session | {{fact:mac-nyse-session-ist-dst}} in US daylight saving time; {{fact:mac-nyse-session-ist-std}} otherwise | The US cash session; its close is the last big print before Asia |
| US CPI and jobs report | {{fact:mac-us-cpi-release-ist-dst}} in US daylight saving time; {{fact:mac-us-cpi-release-ist-std}} otherwise | Released before New York opens, after India has closed; GIFT Nifty is open |
| FOMC statement | {{fact:mac-fomc-statement-ist-dst}} in US daylight saving time; {{fact:mac-fomc-statement-ist-std}} the next calendar day otherwise | Eight times a year, during the US cash session |
| S&P 500 futures (ES, CME Globex) | Almost round the clock from Sunday evening to Friday afternoon US time, except a daily break at {{fact:mac-cme-es-break-ist-dst}} in US daylight saving time and {{fact:mac-cme-es-break-ist-std}} otherwise | The reference for "how did the US take the news" once the cash market is shut |
| Tokyo (JPX) | {{fact:mac-jpx-morning-session-ist}} and {{fact:mac-jpx-afternoon-session-ist}} | The first large cash market to open in Asia |
| Hong Kong (HKEX) | {{fact:mac-hkex-morning-session-ist}} and {{fact:mac-hkex-afternoon-session-ist}} | China-linked names and metals trade here first |
| GIFT Nifty, first session | {{fact:mac-gift-nifty-session-1}} | Opens before Tokyo's morning ends; the quote Indian traders read at breakfast |
| NSE cash pre-open | {{fact:mkt-preopen-window}} | Orders are collected and matched at one price; order entry closes at a random moment in its last two minutes |

The sources are the exchanges' own hours pages: [NYSE](https://www.nyse.com/trade/hours-calendars), [CME Group](https://www.cmegroup.com/markets/equities/sp/e-mini-sandp500.contractSpecs.html), [JPX](https://www.jpx.co.jp/english/equities/trading/domestic/01.html), [HKEX](https://www.hkex.com.hk/Services/Trading-hours-and-Severe-Weather-Arrangements/Trading-Hours/Securities-Market?sc_lang=en) and [NSE IX](https://www.nseix.com/markets/trading/tradinghoursnew). The Indian sessions are explained hour by hour in [The trading day in IST](../trading-day-ist/), and the dated releases sit in the [IST event calendar](../../calendar/).

### Why the US rows shift twice a year

The US jobs report and CPI are both released at half past eight in the morning Eastern Time by the [Bureau of Labor Statistics](https://www.bls.gov/schedule/news_release/cpi.htm). In Indian terms CPI lands at {{fact:mac-us-cpi-release-ist-std}} from November to March and {{fact:mac-us-cpi-release-ist-dst}} from March to November; the [jobs report](https://www.bls.gov/schedule/news_release/empsit.htm) follows the same clock, {{fact:mac-us-nfp-release-ist-std}} in US standard time and {{fact:mac-us-nfp-release-ist-dst}} in daylight saving time. The next two releases on the BLS schedule, the jobs report on {{date:2026-11-06}} and CPI on {{date:2026-11-10}}, both fall after the US clocks go back, so they land in the Indian evening at the later time. The [Federal Reserve](https://www.federalreserve.gov/newsevents/pressreleases/monetary20261028a.htm) releases its statement at two in the afternoon Eastern Time: the {{date:2026-10-28}} statement arrived at {{fact:mac-fomc-statement-ist-dst}}; the December statement will arrive at {{fact:mac-fomc-statement-ist-std}}, which is already the next calendar day in India. Write both times into your own calendar, or you will be waiting an hour late for half the year.

## What GIFT Nifty is, and what it is not

GIFT Nifty is a Nifty 50 futures contract denominated in US dollars, traded on NSE International Exchange at GIFT City in Gujarat. Full-scale trading began on {{date:2023-07-03}}. It trades in two sessions, the morning one in the {{fact:mac-gift-nifty-session-1}} window and the evening one in the {{fact:mac-gift-nifty-session-2}} window, so it is open for almost twenty hours a day and covers the whole of the New York session.

{{label:EVIDENCE}} It is liquid enough to be a real price. By {{date:2026-09-24}} the exchange counted more than 75.68 million contracts and $3.50 trillion of turnover since the move, and that day set a record of 457,999 contracts and $21.18 billion of turnover ([NSE IX press release](https://www.nseix.com/web/pressrelease/2026-09/PR_CC_25092026_1_20260925200618.pdf)). A quote with that much volume behind it is information, not noise.

{{label:MECHANISM}} It leads the Indian open because it is the main venue where Nifty is priced while the news arrives. Participants who want Nifty exposure at midnight go there, and the price they agree is the market's best guess of where NSE futures will open. It is a guess made in a different currency, on a different exchange, by a partly different crowd. The NSE pre-open auction, not GIFT Nifty, sets the actual first price.

{{label:LORE}} "GIFT Nifty is up 100, so Nifty will open up 100" is the folk version. No exchange or regulator publishes how often the implied gap is realised at the open, and this site found no peer-reviewed Indian study of it on {{date:2026-11-01}}. Treat the quote as a strong prior that the pre-open auction can overturn, not as a fact about the open.

### Reading the quote: a premium is not a gap

The commonest mistake is to compare a GIFT Nifty futures price with the Nifty 50 cash close. Futures trade above spot by the cost of carry, roughly the interest on the index value until expiry less dividends, so part of the difference is always premium, not news.

:::example
On {{date:2026-10-30}} Nifty 50 closed at 23,053.10, up 116.35 points or 0.51 per cent ([NSE](https://www.nseindia.com/static/products-services/indices-indiavix-index)). At 02:29 IST on {{date:2026-10-31}}, near the end of GIFT Nifty's evening session, the November contract quoted 23,242.50. Subtract the cash close and the headline reads "GIFT Nifty up 189 points".

Take the carry out first. At the RBI repo rate of {{fact:mac-repo-rate}} as a rough financing rate, the carry on 23,053.10 for the 24 days to the {{date:2026-11-23}} expiry is about 83 points (23,053.10 × the repo rate × 24 ÷ 365), ignoring dividends. A fair futures price for an unchanged market is therefore roughly 23,136, and the quote of 23,242.50 implies an open about 106 points, or a little under half a per cent, above the previous close — not 189.

The cleaner comparison is with the previous close of the NSE Nifty futures contract of the same expiry, which already carries the same premium. The levels are illustrative readings of that one night, not a forecast.
:::

Two further cautions. GIFT Nifty is quoted in dollars, so a sharp USD/INR move overnight changes the rupee value of the same contract without any view on Nifty; the [flows and rupee guide](../flows-rupee-and-rbi/) covers that channel. And the contract's evening session ends at a fixed time, so a headline after it closes shows up only when the morning session opens — read the time stamp on the quote, not just the number.

## US data land in the Indian evening

The Indian cash market closes before any US data of the day are out. US CPI and the jobs report arrive at {{fact:mac-us-cpi-release-ist-dst}} or {{fact:mac-us-cpi-release-ist-std}} depending on the season; the FOMC statement arrives late at night or just after midnight. None of them can be traded on NSE when they happen. All of them can be watched in GIFT Nifty's evening session and in S&P 500 futures, which is why the evening session matters even to someone who never trades it.

:::example
A FOMC night in US standard time. The statement lands at {{fact:mac-fomc-statement-ist-std}}, and within the hour ES futures are down one per cent. GIFT Nifty's evening session is still open for roughly two more hours, so its reaction is visible before that session ends; the morning session reopens at breakfast with any adjustment from the Asian open. The Indian trader is not guessing before the pre-open how "the US" took the decision; the two prices have already answered.
:::

The same logic applies in reverse to Indian data. India's CPI is released at {{fact:mac-india-cpi-release-ist}} on the twelfth of the month, after the cash close, so the first instrument to price it is GIFT Nifty's evening session. [Policy days, India VIX and sizing](../policy-days-vix-and-sizing/) goes through the RBI and Fed days in detail, and the [IST event calendar](../../calendar/) lists every dated release with its Indian time.

## From Asia's open to India's first print

Tokyo opens in the {{fact:mac-jpx-morning-session-ist}} window and Hong Kong in the {{fact:mac-hkex-morning-session-ist}} window, both before GIFT Nifty's morning session has run for long. They answer a different question from the US close: how is Asia, and especially anything China-linked, taking the overnight news. A US session that closed well but a Hong Kong open that is selling off is a mixed message, and mixed messages usually mean a smaller gap than the US close alone would suggest.

Then comes the auction. SEBI's [circular of January 2026](https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf) redesigned the cash pre-open: orders are collected in the {{fact:mkt-preopen-window}} window, order entry closes at a random moment in its last two minutes so nobody can time the final order, and the matching that follows finds the single price that clears the most quantity. That price, not GIFT Nifty, is the open; the futures quote was the market's forecast of it. [The opening range and gaps](../opening-range-and-gaps/) explains what to do with the first fifteen minutes once the auction has spoken.

## A ten-minute morning routine

1. **US close.** Which way did the S&P 500 and Nasdaq finish, and on what: data, earnings or a headline? Was it a late-session reversal? A reason you can name is worth more than the sign.
2. **ES futures since the close.** Did S&P 500 futures hold the cash close through Asia, or give it back? Note the daily break so you do not read a stale quote.
3. **GIFT Nifty against yesterday's NSE futures close**, same expiry, as in the worked example — never against the cash close.
4. **Asia.** Tokyo and Hong Kong relative to their own previous closes; any China headline.
5. **Today's Indian events** from the [calendar](../../calendar/): an RBI decision at {{fact:mac-rbi-mpc-time-ist}}, a weekly expiry on a {{fact:fo-nifty-weekly-expiry-day}}, results due. Size accordingly, as [Policy days, India VIX and sizing](../policy-days-vix-and-sizing/) describes.
6. **Decide whether the day is in play.** A large implied gap with a nameable reason is the raw material for the [15-minute opening-range breakout](../../playbooks/orb-15-min-nifty/) or the [gap-fill fade](../../playbooks/gap-fill-fade/); a small gap with no news is a day to wait for the auction.

None of this says which way to trade. It says what the market already knows, so that the first trade of the day is not a reaction to information that was public at 02:00.

:::evidence What the evidence says
- {{label:EVIDENCE}} GIFT Nifty is liquid: more than 75 million contracts and $3.50 trillion of turnover since {{date:2023-07-03}}, with a record day in September 2026, per NSE IX's own release.
- {{label:MECHANISM}} It leads the open because it is the only venue pricing Nifty while US and Asian news arrives; the NSE pre-open auction sets the actual first price.
- {{label:MECHANISM}} A futures quote carries a cost-of-carry premium over the cash index, so the implied gap is the quote against the previous NSE futures close, not against spot.
- {{label:LORE}} Any hit rate for "GIFT Nifty predicts the open": no exchange, regulator or peer-reviewed Indian study publishes one.
:::
