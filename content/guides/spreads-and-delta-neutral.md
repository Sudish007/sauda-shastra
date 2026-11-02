---
title: Spreads and delta-neutral structures
section: Options
summary: Verticals, iron flies and condors, ratio and broken-wing spreads with their defined and undefined risks, how SPAN's portfolio scan rewards a long wing while ELM does not, why a tight spread's expiry-day margin is mostly ELM, delta-neutral straddles and strangles with practitioner adjustment rules, and the calendar-spread benefit that is {{fact:opt-calendar-spread-expiry-rule}}.
updated: 2026-11-01
level: advanced
order: 6
topics: [vertical spread, bear call spread, iron fly, iron condor, ratio spread, broken-wing butterfly, delta neutral, short straddle, short strangle, adjustments, span, elm, calendar spread, margin benefit]
related: [iv-expected-move-and-crush, greeks-for-a-day-trader, buying-vs-selling-options, expiry-day-dynamics, intraday-leverage-today, 0920-short-straddle, expiry-day-straddle-scalp, event-day-iv-crush-hedged]
tools: [black-scholes-greeks, position-size]
sources:
  - SEBI circular Feb 2020 (2020/27) — Review of the margin framework for cash and derivatives segments (SPAN parameters) | https://www.sebi.gov.in/sebi_data/attachdocs/feb-2020/1582545012845.pdf | accessed 2026-11-01
  - NSE Clearing — Equity derivatives margins (SPAN, ELM, crystallised obligation) | https://www.nseclearing.in/risk-management/equity-derivatives/margins | accessed 2026-11-01
  - SEBI circular Oct 2024 (2024/132) — Measures to strengthen the equity index derivatives framework (calendar spread, expiry-day ELM) | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf | accessed 2026-11-01
  - NSE Clearing circular CMPT/66047 (Jan 2025) — Removal of calendar-spread treatment on the expiry day | https://nsearchives.nseindia.com/content/circulars/CMPT66047.pdf | accessed 2026-11-01
  - SEBI circular Feb 2026 — Calendar-spread margin benefit for single-stock derivatives on expiry day | https://www.sebi.gov.in/sebi_data/attachdocs/feb-2026/1770288869049.pdf | accessed 2026-11-01
  - Baltussen, Da, Lammers and Martens — Hedging demand and market intraday momentum, Journal of Financial Economics (2021), abstract | https://ideas.repec.org/a/eee/jfinec/v142y2021i1p377-403.html | accessed 2026-11-01
  - Natenberg — Option Volatility and Pricing, second edition (McGraw-Hill, 2014), catalogue page | https://books.google.com/books?vid=ISBN9780071818773 | accessed 2026-11-01
  - Sinclair — Volatility Trading, second edition (Wiley, 2013) | https://www.wiley.com/en-us/Volatility+Trading%2C+%2B+Website%2C+2nd+Edition-p-9781118347133 | accessed 2026-11-01
  - Hull — Options, Futures, and Other Derivatives, eleventh edition (Pearson, 2021) | https://www.pearson.com/en-us/subject-catalog/p/options-futures-and-other-derivatives/P200000005938/9780136939979 | accessed 2026-11-01
  - Zerodha Varsity — Option strategies (module) | https://zerodha.com/varsity/module/option-strategies/ | accessed 2026-11-01
---
## Why combine options at all

A single bought option pays for time and volatility it may not need; a single sold option carries a loss with no floor. Spreads trade some of the upside of one leg for a limit on the downside of the other, and the margin system — SPAN plus ELM — prices that limit in a way worth understanding before choosing a structure. The mechanics below are standard, as set out by [Natenberg](https://books.google.com/books?vid=ISBN9780071818773), [Sinclair](https://www.wiley.com/en-us/Volatility+Trading%2C+%2B+Website%2C+2nd+Edition-p-9781118347133), [Hull](https://www.pearson.com/en-us/subject-catalog/p/options-futures-and-other-derivatives/P200000005938/9780136939979) and [Varsity's strategies module](https://zerodha.com/varsity/module/option-strategies/); the rupee figures are from the site's [Black–Scholes calculator](../../tools/black-scholes-greeks/) with Nifty 50 at 25,000, seven days to expiry, IV 12 per cent and the repo rate, one lot being {{fact:fo-nifty-lot}} units. Levels are schematic, not quotes. Varsity's examples use lot sizes and expiry days from before the current rules.

## Verticals: defined risk on one side

A vertical spread buys one option and sells another of the same type and expiry at a different strike. Debit verticals (bull call, bear put) pay a net premium and can lose at most that premium; credit verticals (bull put, bear call) collect a net premium and can lose at most the distance between the strikes less the credit.

:::example
Bear call spread: sell the 25,000 call at ₹179.16 and buy the 25,200 call at ₹93.79, a net credit of about ₹85 a unit, or ₹85.37 × {{fact:fo-nifty-lot}} ≈ ₹5,549 per lot. Maximum loss is the 200-point width less the credit: (200 − 85.37) × {{fact:fo-nifty-lot}} ≈ ₹7,451 per lot, reached if Nifty settles at or above 25,200. Break-even is about 25,085. The naked 25,000 call would have collected ₹179.16 × {{fact:fo-nifty-lot}} ≈ ₹11,645 per lot with no ceiling on the loss; the wing cost about ₹6,100 per lot of premium and bought a floor.
:::

## Iron fly and iron condor: defined risk on both sides

An iron fly sells the at-the-money straddle and buys a put and a call further out as wings; an iron condor sells a strangle (an out-of-the-money put and call) and buys wings beyond each. Both are short volatility with a known maximum loss on either side.

:::example
Iron fly: sell the 25,000 straddle for ₹331.97 (call ₹179.16 plus put ₹152.81), buy the 24,600 put at ₹32.15 and the 25,400 call at ₹42.68. Net credit ≈ ₹257 a unit, or ₹257.14 × {{fact:fo-nifty-lot}} ≈ ₹16,714 per lot. Maximum loss on either side is the 400-point wing distance less the credit: (400 − 257.14) × {{fact:fo-nifty-lot}} ≈ ₹9,286 per lot. Break-evens are about 24,743 and 25,257.

Compare that with the market's own expected move from [Implied volatility, the expected move and IV crush](../iv-expected-move-and-crush/): the one-σ range for the week is roughly 24,585–25,415. The fly's profit zone is narrower than one standard deviation, which is the trade in a sentence — a high probability of a modest gain against a lower probability of a loss larger than the gain. {{label:MECHANISM}}
:::

The condor widens the zone and lowers the credit; the same seven-day inputs price a 24,500 put at ₹19.56 and a 25,500 call at ₹27.21, so a condor sold at those strikes collects far less than the fly and loses only if the index leaves a 1,000-point corridor. Neither structure is "safer" in any absolute sense: the maximum loss is smaller per lot, so traders sell more lots, and the loss arrives on the same days.

## Ratio and broken-wing spreads: the tail you left open

A ratio spread sells more options than it buys — for example, buy one 25,200 call and sell two 25,400 calls — so that the extra short leg finances the long one. A broken-wing butterfly moves one wing further out than the other so that the structure has no risk on one side and a larger, defined risk on the other, or a small risk on one side and a large one beyond the far wing. Both are ways of paying less premium by accepting an unhedged or under-hedged tail. {{label:MECHANISM}} That tail is a naked short with exactly the margin and the gap risk described in [Buying versus selling options](../buying-vs-selling-options/); the structure's name does not change what happens on a day like {{date:2024-06-04}}.

## Margin: SPAN scans the portfolio, ELM counts each short

NSE Clearing's [margins page](https://www.nseclearing.in/risk-management/equity-derivatives/margins) and SEBI's [2020 framework](https://www.sebi.gov.in/sebi_data/attachdocs/feb-2020/1582545012845.pdf) describe two layers that behave differently when a wing is added.

**SPAN** is portfolio-based: it computes the worst loss across a grid of price and volatility scenarios, nets positions per client, grosses them across clients at the member level and is recomputed online during the day. Its initial margin covers a 99 per cent one-day value-at-risk (two-day for futures); the index price-scan range is six standard deviations scaled by √2 with a floor of 9.3 per cent (17.7 per cent beyond nine months), the volatility-scan range is a quarter of the EWMA volatility with a minimum of four per cent, there is no separate short-option minimum charge for index or stock derivatives, and the calendar-spread charge for index futures is 2.2 per cent of the far-month contract. Because a long wing caps the worst-case scenario, it lowers SPAN. {{label:MECHANISM}}

**ELM**, the extreme-loss margin, is two per cent of notional for index derivatives, three per cent for short index options more than ten per cent out of the money, five per cent for short index options with more than nine months to expiry and 5.25 per cent for single-stock options more than thirty per cent out of the money — plus the additional {{fact:fo-expiry-day-elm-addon}} on short index options on their expiry day. It is charged per short notional, so a wing does not reduce it.

:::example
The bear call spread above has a worst-case scenario loss of 200 × {{fact:fo-nifty-lot}} = ₹13,000 before the credit, so SPAN cannot exceed that. The short leg's notional is 25,000 × {{fact:fo-nifty-lot}} = ₹16,25,000, so ELM is about ₹32,500 on an ordinary day and about ₹65,000 on expiry day.

| Component | Ordinary day | Expiry day |
|---|---|---|
| SPAN (capped by the wing) | ≤ ₹13,000 | ≤ ₹13,000 |
| ELM on the short leg | ≈ ₹32,500 | ≈ ₹65,000 |

On a tight spread, ELM — not SPAN — is most of the margin, and on expiry day it is most of it by a wide margin. The [position-size calculator](../../tools/position-size/) reports the margin next to the loss limit so the two are sized together.
:::

One stale line to know about: NSE Clearing's margins page still described, on {{date:2026-11-01}}, the old treatment of stock calendar spreads; SEBI's [February 2026 circular](https://www.sebi.gov.in/sebi_data/attachdocs/feb-2026/1770288869049.pdf) controls, as the next-but-one section explains.

## Delta-neutral straddles and strangles

A short straddle sells the at-the-money call and put; a short strangle sells an out-of-the-money call and put. Both start close to delta-neutral and both are short gamma, so every move in the index gives the position a delta against the move — the mechanics in [Greeks for a day trader](../greeks-for-a-day-trader/). At inception our 25,000 straddle is short 0.5286 of call delta and long 0.4714 of put delta, a net of about −0.06 a unit, or about minus four delta-units per lot: near enough neutral.

{{label:MECHANISM}} Practitioners manage the position with adjustment rules rather than forecasts. Two common ones, as taught in [Sinclair](https://www.wiley.com/en-us/Volatility+Trading%2C+%2B+Website%2C+2nd+Edition-p-9781118347133) and [Natenberg](https://books.google.com/books?vid=ISBN9780071818773): re-centre when the net delta exceeds a chosen fraction of one lot's delta — a quarter of a lot is ±0.25 × {{fact:fo-nifty-lot}}, about sixteen delta-units — or when the index touches a break-even or a wing. These are rules of thumb with no published Indian hit rate; they trade a small, frequent cost of adjusting against the rare large loss of not adjusting.

:::example
Nifty rises 100 points to 25,100. The calculator now gives the 25,000 call a delta of 0.6225 and the put −0.3775, so the short straddle's net delta is about −0.245 a unit, or −0.245 × {{fact:fo-nifty-lot}} ≈ minus sixteen delta-units per lot — right at the quarter-lot threshold. The adjustment is a choice among costs: buy back part of the short call, sell a higher call to roll the top up, or buy a small long delta elsewhere. The guide does not prefer one; each converts an open-ended risk into a paid-for one.
:::

A strangle starts with smaller deltas on each leg, so it reaches the same threshold later and collects less for the wait. In both structures gamma grows into expiry, and the research on hedging demand explains why that matters beyond the single account: {{label:EVIDENCE}} Baltussen, Da, Lammers and Martens ([Journal of Financial Economics, 2021](https://ideas.repec.org/a/eee/jfinec/v142y2021i1p377-403.html)) showed that hedging short gamma means trading with the move and creates intraday momentum, so a market full of short straddles tends to move further in the direction that hurts them.

## Calendar spreads and the expiry-day rule

A calendar spread holds opposite positions in two expiries of the same contract — long next week's option against this week's short, for instance — and the clearing corporation normally recognises the offset with a lower margin. On expiry day that recognition is {{fact:opt-calendar-spread-expiry-rule}}: the expiring leg's worst-scenario loss is computed on its own. SEBI's [October 2024 circular](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf) introduced the rule for index contracts and NSE Clearing's [circular CMPT/66047](https://nsearchives.nseindia.com/content/circulars/CMPT66047.pdf) made it effective on {{date:2025-02-10}}; SEBI's [circular of {{date:2026-02-05}}](https://www.sebi.gov.in/sebi_data/attachdocs/feb-2026/1770288869049.pdf) extended it to single-stock derivatives from {{date:2026-05-05}}, citing the sudden margin jump and the basis risk between an expiring and a non-expiring leg. Spreads between two non-expiring months keep the benefit.

The practical consequence is a margin call on expiry morning for anyone still holding the expiring leg of a calendar, which is why calendars are unwound or rolled the day before. [Expiry-day dynamics](../expiry-day-dynamics/) has the rest of that day's rules.

## Choosing a structure

| Structure | Maximum loss | What drives its margin |
|---|---|---|
| Debit vertical | Net premium paid | Premium, paid upfront |
| Credit vertical | Width less credit | ELM on the short leg; SPAN capped by the wing |
| Iron fly / condor | Wing distance less credit | ELM on two shorts; SPAN capped |
| Ratio / broken-wing | Open on one side | SPAN on the naked tail plus ELM |
| Short straddle / strangle | Open on both sides | SPAN scan range plus ELM |

A defined-risk structure is not a smaller risk; it is a known one. The known loss is the number the [position-size calculator](../../tools/position-size/) needs, and the daily loss limit in [Intraday leverage today](../intraday-leverage-today/) is the number it is compared against.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). A spread caps what one trade can lose; it does not change the odds that the trade loses. Figures and their sources live in the [verified facts register](../../facts/).
:::

:::evidence What the evidence says
- {{label:MECHANISM}} A wing caps the worst-case scenario and so lowers SPAN; ELM is charged per short notional and does not fall. On a tight spread, expiry-day ELM is most of the margin.
- {{label:MECHANISM}} Delta-neutral adjustment thresholds (a fraction of a lot's delta, a break-even touch) are practitioner rules with no published Indian hit rate.
- {{label:EVIDENCE}} Hedging short gamma creates intraday momentum across sixty-plus futures markets (2021).
- {{label:LORE}} Any claim that a particular spread "works x per cent of the time" on Nifty.
:::
