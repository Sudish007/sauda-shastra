---
title: Volume profile and Market Profile
section: Technical analysis
summary: Two histograms that look alike and count different things — volume by price and time by price — the initial balance, value area, single prints and day types of Steidlmayer's Market Profile, how Indian traders read yesterday's value area on Nifty futures, and the honest limit: a profile shows where business was done, not where price goes next.
updated: 2026-11-01
level: advanced
order: 6
topics: [volume profile, market profile, tpo, value area, point of control, initial balance, single prints, day types, trend day, intraday momentum]
related: [vwap-and-anchored-vwap, price-action-market-structure, opening-range-and-gaps, trading-day-ist]
sources:
  - Wiley — Steidlmayer on Markets, Trading with Market Profile, 2nd edition | https://www.wiley.com/en-us/Steidlmayer+on+Markets%3A+Trading+with+Market+Profile%2C+2nd+Edition-p-9780471215561 | accessed 2026-11-01
  - Wiley — Mind Over Markets, Power Trading with Market Generated Information, updated edition (Dalton, Jones and Dalton) | https://www.wiley.com/en-us/Mind+Over+Markets%3A+Power+Trading+with+Market+Generated+Information%2C+Updated+Edition-p-9781118531730 | accessed 2026-11-01
  - Gao, Han, Li and Zhou — Market intraday momentum, Journal of Financial Economics 129(2), 2018 | https://doi.org/10.1016/j.jfineco.2018.05.009 | accessed 2026-11-01
  - Baltussen, Da, Lammers and Martens — Hedging demand and market intraday momentum, Journal of Financial Economics 142(1), 2021 | https://doi.org/10.1016/j.jfineco.2021.04.029 | accessed 2026-11-01
  - Li, Sakkas and Urquhart — Intraday time-series momentum, Journal of Financial Markets 57, 2022 | https://doi.org/10.1016/j.finmar.2021.100619 | accessed 2026-11-01
  - SEBI circular (Jan 2026) — Introduction of Closing Auction Session and modifications in the pre-open session | https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
---
## Two histograms, two questions

A conventional chart puts time on the horizontal axis and asks "what was the price at each moment?". A profile turns the chart on its side and asks the opposite question: "how much happened at each price?". Two tools answer it with different units.

{{label:MECHANISM}} A **volume profile** stacks traded volume by price level. Its tallest bar — the high-volume node — is the price at which the most shares or contracts changed hands; a low-volume node is a price the market passed through quickly. A **Market Profile**, the original form, stacks *time* by price: each 30-minute period of the session gets a letter, and the letter is written beside every price that traded during that period. The result is a histogram of time-price opportunities, or **TPOs**. Where many letters pile up, the market spent a long time; a price with a single letter was visited once and rejected.

The Market Profile was developed by J. Peter Steidlmayer at the Chicago Board of Trade; his [Steidlmayer on Markets](https://www.wiley.com/en-us/Steidlmayer+on+Markets%3A+Trading+with+Market+Profile%2C+2nd+Edition-p-9780471215561) is the originator's text, and [Mind Over Markets](https://www.wiley.com/en-us/Mind+Over+Markets%3A+Power+Trading+with+Market+Generated+Information%2C+Updated+Edition-p-9781118531730) by Dalton, Jones and Dalton is the standard practitioner treatment of what its authors call market-generated information. Both are cited here for the vocabulary; neither claims a measured edge, and this guide attributes no statistics to them.

## The vocabulary of a profile

- **Initial balance (IB).** The range of the first two 30-minute periods — the first hour. Steidlmayer's reading was that the first hour is dominated by short-timeframe participants finding a fair price; the rest of the day either stays inside that balance or extends it.
- **Point of control (POC).** The price with the most TPOs: where the market spent the most time.
- **Value area (VA).** The narrowest band of prices around the POC that holds about seventy per cent of the day's TPOs. It is the profile's definition of "fair" for that day.
- **Single prints.** Prices with only one letter, left behind when the market moved through them fast. They mark the moment a new set of participants entered.
- **Day types.** A **normal day** stays within or near the initial balance; a **trend day** opens at one extreme, extends in one direction for most of the session and closes near the other extreme, leaving a long thin profile; a **neutral day** extends both sides of the balance and closes in the middle.

{{label:MECHANISM}} Every one of these is a description of where and how long price traded. None of them is a prediction. That distinction is the whole of the honest case for profiles, so it is worth holding onto through the example.

## Worked example: yesterday's profile on Nifty futures

:::example
The Nifty futures session runs through the {{fact:mkt-fo-session}} window, which gives thirteen half-hour periods, lettered A to M (M is the short final period after the cash market has moved into its closing auction). Yesterday's profile, on 10-point rows:

| Price | TPOs |
|---|---|
| 25,270 | M |
| 25,260 | L M |
| 25,250 | K L M |
| 25,240 | A J K L |
| 25,230 | A B I J K |
| 25,220 | A B C H I J |
| 25,210 | B C D G H I |
| 25,200 | C D E F G H |
| 25,190 | D E F G |
| 25,180 | E F |
| 25,170 | F |

The initial balance (periods A and B) was 25,210–25,240. The market extended below it through the middle of the day — period F reached 25,170 — and then worked back up, leaving the close near the top. The point of control is 25,210, where six letters stack, and the value area is 25,190–25,230: 27 of the 40 TPOs, about two-thirds of the day's time. The single print at 25,170 marks a price the market rejected in one period.

If today's pre-open discovers 25,260, the session is opening above yesterday's value area — an **open outside value**. Profile traders read that as the market saying yesterday's fair price is no longer fair, and watch the first hour for one of two things: acceptance (TPOs building above 25,230, a new higher balance) or rejection (a quick return into yesterday's value, which usually means a rotation back toward 25,210). The levels are illustrative, not a quote.
:::

## How Indian intraday traders use it

Most Indian profile traders work on Nifty or Bank Nifty futures rather than on options, because the futures volume is continuous and the profile needs a continuous instrument. Three uses recur:

1. **Yesterday's value area as today's reference.** An open inside value suggests a two-sided day and the extremes of the area are faded; an open outside value suggests the day has a direction until proven otherwise.
2. **The initial balance as a frame.** It plays the role the [opening range](../opening-range-and-gaps/) plays for breakout traders, with a longer window: extension beyond the balance, with TPOs building rather than single prints, is "range extension" and is the profile's definition of a developing trend day.
3. **Single prints and low-volume nodes as targets.** Price that rotates back through thin areas tends to do so fast, because few orders were ever done there. [VWAP](../vwap-and-anchored-vwap/) usually sits inside the value area for the same reason: both are built from the same trades.

An Indian wrinkle matters for anyone drawing a cash-stock profile rather than a futures one. Since {{date:2026-08-03}} a stock with derivatives trades continuously only in the {{fact:mkt-continuous-session-cas-stocks}} window and then goes into a Closing Auction Session in the {{fact:mkt-closing-session}} window, while its futures trade on to the end of the derivatives session. The last letter of a cash profile is therefore an auction print, not continuous trade, and futures and cash profiles no longer end at the same time. [The trading day in IST](../trading-day-ist/) covers the full schedule, including the change due from {{date:2026-12-07}}.

## What a profile cannot tell you

{{label:MECHANISM}} A profile is a record. It shows where business was done, how long the market stayed there and which prices it rejected. It does not show who did the business, whether they were opening or closing positions, or what they will do tomorrow. "The market will return to the point of control" is a statement about an average tendency of rotations, not a law; on a trend day the point of control is left behind for good.

No peer-reviewed study of the profitability of Market Profile or volume-profile trading rules was located for Indian or any other market. The constructs are definitions, taught consistently by their originators, and that is what this guide claims for them.

## The evidence that does bear on trend days

The nearest published evidence to the profile trader's "trend day" is the literature on intraday momentum, which asks whether the early part of a session predicts the late part.

{{label:EVIDENCE}} Gao, Han, Li and Zhou (2018) found that on the S&P 500 exchange-traded fund from 1993 to 2013 the first half-hour's return (measured from the previous close) predicted the last half-hour's return, more strongly on volatile, high-volume and macro-news days, and that the effect appeared in ten other actively traded ETFs ([Journal of Financial Economics](https://doi.org/10.1016/j.jfineco.2018.05.009)). {{label:EVIDENCE}} Baltussen, Da, Lammers and Martens (2021) extended the finding to more than sixty futures markets across equities, bonds, commodities and currencies from 1974 to 2020: the return over the rest of the day positively predicted the last half-hour, the effect reversed over the following days, and the authors link it to the hedging demand of option dealers ([Journal of Financial Economics](https://doi.org/10.1016/j.jfineco.2021.04.029)). {{label:EVIDENCE}} Li, Sakkas and Urquhart (2022) found intraday time-series momentum economically sizeable in most of sixteen developed markets, stronger when liquidity is low and volatility high — India was not in the sample ([Journal of Financial Markets](https://doi.org/10.1016/j.finmar.2021.100619)).

Read together, these say that a day which opens strongly and extends through the morning has, in US and developed-market data, a measurable tendency to finish in the same direction. That is the trend day of the profile vocabulary, with a published mechanism attached — but measured on indices and futures abroad, not on Nifty.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). A profile organises the day's information; it does not supply an edge. Every figure on this page sits in the [verified facts register](../../facts/) with its source.
:::

:::evidence What the evidence says
- {{label:MECHANISM}} Volume profile and Market Profile are histograms of volume and of time by price; initial balance, value area, single prints and day types are definitions from the originators' texts.
- {{label:MECHANISM}} A profile records where business was done; no profitability test of profile rules was located for any market.
- {{label:EVIDENCE}} Intraday momentum — early-session returns predicting the last half-hour — is documented on US ETFs (1993–2013), on more than sixty global futures (1974–2020) and in most of sixteen developed markets; India was not in those samples.
:::
