---
title: Greeks for a day trader
section: Options
summary: Delta as direction and a rough probability, gamma as the reason expiry afternoons trend or pin, theta as a calendar-time bill the market charges continuously, vega as the event-day Greek — each with a Nifty 25,000 example priced per lot of {{fact:fo-nifty-lot}} units by the site's calculator, plus the published evidence on dealer hedging and intraday momentum.
updated: 2026-11-01
level: intermediate
order: 3
topics: [delta, gamma, theta, vega, greeks, black-scholes, time decay, intraday theta, dealer hedging, gamma hedging, expiry day]
related: [iv-expected-move-and-crush, expiry-day-dynamics, spreads-and-delta-neutral, buying-vs-selling-options, reading-the-option-chain]
tools: [black-scholes-greeks]
sources:
  - Options Industry Council — Understanding options Greeks | https://www.optionseducation.org/advancedconcepts/understanding-options-greeks | accessed 2026-11-01
  - NSE — Nifty 50 derivatives contract specifications (Black–Scholes formula for base prices) | https://www.nseindia.com/products-services/equity-derivatives-nifty50 | accessed 2026-11-01
  - SEBI consultation paper Jul 2024 — Measures to strengthen the index derivatives framework (expiry-day illustrations) | https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1722407296072.pdf | accessed 2026-11-01
  - Baltussen, Da, Lammers and Martens — Hedging demand and market intraday momentum, Journal of Financial Economics (2021), abstract | https://ideas.repec.org/a/eee/jfinec/v142y2021i1p377-403.html | accessed 2026-11-01
  - Barbon and Buraschi — Gamma fragility (2021), author PDF | https://abarbon.com/assets/Barbon_Buraschi_2021_Gamma_Fragility.pdf | accessed 2026-11-01
  - Hull — Options, Futures, and Other Derivatives, eleventh edition (Pearson, 2021) | https://www.pearson.com/en-us/subject-catalog/p/options-futures-and-other-derivatives/P200000005938/9780136939979 | accessed 2026-11-01
  - Natenberg — Option Volatility and Pricing, second edition (McGraw-Hill, 2014), catalogue page | https://books.google.com/books?vid=ISBN9780071818773 | accessed 2026-11-01
  - Zerodha Varsity — Options theory for professional trading (module) | https://zerodha.com/varsity/module/option-theory/ | accessed 2026-11-01
---
## Four numbers, one position

The Greeks are the sensitivities of an option's price to the things that move it: the index (delta, and gamma for how delta itself changes), the passage of time (theta) and implied volatility (vega). The [Options Industry Council's primer](https://www.optionseducation.org/advancedconcepts/understanding-options-greeks) defines them; [Hull](https://www.pearson.com/en-us/subject-catalog/p/options-futures-and-other-derivatives/P200000005938/9780136939979) derives them; [Natenberg](https://books.google.com/books?vid=ISBN9780071818773) teaches how a trader uses them. This guide does the Indian arithmetic.

Every figure below comes from the [Black–Scholes calculator](../../tools/black-scholes-greeks/) with the same inputs: Nifty 50 at 25,000, the 25,000 call, seven days to expiry, IV 12 per cent and the RBI repo rate as the interest rate. It prices the call at ₹179.16 with delta 0.5286, gamma 0.0010, vega ₹13.78 and theta −₹13.77. The levels are schematic, not a live quote; one lot is {{fact:fo-nifty-lot}} units throughout.

## Delta: direction, and a rough probability

Delta is the change in the option's price for a one-point change in the index. A call's delta runs from zero (far out of the money) to one (deep in the money); a put's from zero to minus one. At-the-money options sit near one half — our call's 0.5286 says that a one-point rise in Nifty adds about 53 paise to the call.

:::example
Nifty rises 100 points to 25,100. Delta alone predicts a gain of 0.5286 × 100 = ₹52.86 a unit, which is 52.86 × {{fact:fo-nifty-lot}} ≈ ₹3,436 per lot. The calculator's repriced value at 25,100 is ₹236.76, a gain of ₹57.60 a unit or ₹3,744 per lot — more than delta predicted, because delta itself rose during the move. That difference is gamma's work (½ × 0.0010 × 100² ≈ ₹5 a unit). The same 100 points downward take the call to ₹131.10, a loss of ₹48.06 a unit or ₹3,124 per lot — less than delta predicted, for the same reason. A long option gains more than it loses for a symmetric move; a short option does the reverse.
:::

Delta is also a rough probability that the option finishes in the money — rough because it is a risk-neutral quantity and ignores the premium paid. A 0.25-delta call is, loosely, a one-in-four shot of expiring in the money, and a trader who buys it has paid for that chance up front.

A position's delta is the option's delta times the lot size times the number of lots. Ten lots of our call carry a delta of 0.5286 × {{fact:fo-nifty-lot}} × 10 ≈ 344 index units — the exposure of about five lots of Nifty futures. This futures-equivalent idea is exactly what SEBI's FutEq measure of open interest formalises, which is why the position limits in [Index derivatives contract specs](../index-derivatives-specs/) are stated in delta-adjusted terms. {{label:MECHANISM}}

## Gamma: why the last hours trend or pin

Gamma is the change in delta for a one-point change in the index. It is largest at the money and grows as expiry approaches: our seven-day call has gamma 0.0010 per point, so a 100-point move changes its delta by about 0.10; with one day left the same strike's gamma is 0.0025, and in the last hours of expiry it is many times that. For an option buyer gamma is the reason a small move late on expiry day can double a cheap option; for a seller it is the reason the same move can wipe out a week of collected premium.

Gamma matters beyond the single position because of who holds the other side. Market makers and dealers who are short gamma must hedge by trading with the market — buying as it rises, selling as it falls — which pushes prices further; dealers who are long gamma hedge against the move and damp it.

- {{label:EVIDENCE}} Baltussen, Da, Lammers and Martens ([Journal of Financial Economics, 2021](https://ideas.repec.org/a/eee/jfinec/v142y2021i1p377-403.html)) showed that hedging short gamma generates intraday momentum: across more than sixty futures markets from 1974 to 2020, the return in the last half-hour of the day was positively predicted by the return over the rest of the day, with the effect reverting over the following days.
- {{label:EVIDENCE}} Barbon and Buraschi ([Gamma fragility, 2021](https://abarbon.com/assets/Barbon_Buraschi_2021_Gamma_Fragility.pdf)) linked large aggregate dealer gamma imbalances to intraday momentum when dealers are short gamma and reversal when they are long, stronger in illiquid names, and to the frequency and size of flash crashes.
- {{label:LORE}} Both are US and global studies built from dealer-position data that does not exist publicly for India. NSE's participant-wise open-interest file is end of day and does not separate market makers, so Indian "gamma levels" published by vendors are reconstructions, not measurements.

The practical reading: on expiry day, when gamma is highest, afternoons tend either to trend (if the hedgers are short gamma) or to stick near a heavily traded strike (if they are long). Which regime you are in is not observable in real time in India. [Expiry-day dynamics](../expiry-day-dynamics/) and [Reading the option chain](../reading-the-option-chain/) cover the pinning evidence.

## Theta: a calendar bill, charged continuously

Theta is the change in the option's price per day with everything else unchanged. Our call's theta of −₹13.77 means it loses about that much per calendar day at seven days out; per lot that is 13.77 × {{fact:fo-nifty-lot}} ≈ ₹895 a day. Let one actual day pass in the calculator (six days left) and the call is worth ₹164.94, a fall of ₹14.22 — slightly more than the instantaneous theta, because decay accelerates. With one day left the same strike is worth ₹64.54 and its theta is −₹33.23 a day, or about ₹2,160 per lot.

Three things about theta surprise new traders:

1. **It is calendar time, not trading time.** Options lose value over weekends and holidays; the market prices Monday's contract on Friday afternoon with the weekend's decay already in it. A long weekly bought on a Friday afternoon pays for two days in which nothing can be done about it.
2. **There is no official "intraday theta curve".** Within a day, an option's price drifts down for two reasons at once: time passing, and the usual fall in implied volatility after the opening hour's uncertainty is resolved. Charts that show a steep morning decay are showing both; no exchange publishes a separate intraday decay schedule. {{label:MECHANISM}}
3. **Near expiry theta is not a line, it is a cliff.** SEBI's [consultation paper of July 2024](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1722407296072.pdf) illustrates it: thirty minutes before expiry a comparable at-the-money option traded at a fifth or less of its previous-day close, and the paper tabulates positions opened and closed within three minutes of each other near the end. {{label:EVIDENCE}} That is theta and gamma together, with liquidity thinning.

## Vega: the event-day Greek

Vega is the change in the option's price for a one-point change in implied volatility. Our call's vega of ₹13.78 means that if IV falls from 12 to 11 the call loses about ₹13.78 a unit, or ₹896 per lot, with the index unmoved. Vega is largest at the money and for longer-dated options; a weekly's vega is small per unit, but IV on a weekly can move by several points in a session, which is why event days belong to vega.

:::example
Nifty rises 100 points *and* IV falls 1.6 points to 10.4 per cent — the size of the fall India VIX showed on the 2025 Budget day. The call reprices to ₹215.77: a gain of ₹36.61 a unit, or about ₹2,380 per lot, against ₹3,744 if IV had stayed put. A third of the directional gain went to the volatility change. The reverse case — right on direction, IV rises — helps a long option and hurts a short one. [Implied volatility, the expected move and IV crush](../iv-expected-move-and-crush/) has the Budget-day and election-day numbers from NSE's files.
:::

## One lot, one morning

| Scenario (same day unless stated) | Call value | Per lot |
|---|---|---|
| Nifty +100 points, IV unchanged | ₹236.76 | +₹3,744 |
| Nifty +100 points, IV down to 10.4 | ₹215.77 | +₹2,380 |
| Nifty unchanged, one day passes | ₹164.94 | −₹924 |
| Nifty −100 points, IV unchanged | ₹131.10 | −₹3,124 |

Each row is a derived figure from the calculator at the stated inputs. The point of the table is not the rupees but the shape: the index can be right and the trade still lose to time or volatility, and a long and a short option see the same scenarios with opposite signs.

## What a day trader actually watches

- **Delta for size.** Size the position by its delta in futures-equivalent units, not by the premium paid: a lot of a 0.53-delta call moves like half a futures lot, a lot of a 0.10-delta call like a tenth of one, until the index comes to it.
- **Gamma for timing.** The closer to expiry and the closer to the money, the faster delta changes; the same stop distance in points is a different risk in rupees mid-morning than in the last hour of expiry day.
- **Theta for holding.** A long option that is not working is paying rent every hour; a short option that is working is collecting it only until the next move.
- **Vega for events.** Before RBI, CPI, the Budget or results, ask what IV is pricing and which way it will go once the number is out; [Spreads and delta-neutral structures](../spreads-and-delta-neutral/) covers structures that reduce vega.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). The Greeks describe a position's risks precisely; they say nothing about whether the position should exist. Figures and their sources live in the [verified facts register](../../facts/).
:::

:::evidence What the evidence says
- {{label:MECHANISM}} Delta, gamma, theta and vega are the partial derivatives of the Black–Scholes price; every rupee figure above is the calculator's output at stated inputs.
- {{label:EVIDENCE}} Hedging of short gamma creates intraday momentum across sixty-plus futures markets (1974–2020); dealer gamma imbalances predict momentum, reversal and flash crashes (2021).
- {{label:EVIDENCE}} SEBI's 2024 illustration: an at-the-money option at a fifth or less of the previous close thirty minutes before expiry.
- {{label:LORE}} Indian "dealer gamma levels" and any intraday theta schedule: no public dealer-position data or exchange publication exists.
:::
