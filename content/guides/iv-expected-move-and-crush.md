---
title: Implied volatility, the expected move and IV crush
section: Options
summary: What implied volatility is and how India VIX is built, why IV percentile and rank must be computed by you, how a straddle prices the expected move in rupees per lot of {{fact:fo-nifty-lot}} units, what NSE's own index files show about IV on the two Budget days and the {{date:2024-06-04}} election count, and which event-day claims remain lore.
updated: 2026-11-04
level: intermediate
order: 2
topics: [implied volatility, india vix, iv percentile, iv rank, expected move, straddle, variance risk premium, iv crush, budget day, event day, black-scholes]
related: [greeks-for-a-day-trader, expiry-day-dynamics, buying-vs-selling-options, spreads-and-delta-neutral, reading-the-option-chain, indicators-and-why-they-lag, policy-days-vix-and-sizing, results-season-playbook, event-day-iv-crush-hedged, volatility-tells-skew-term-structure]
tools: [expected-move, black-scholes-greeks]
sources:
  - NSE — About India VIX, computation methodology | https://nsearchives.nseindia.com/s3fs-public/inline-files/India_VIX_comp_meth.pdf | accessed 2026-11-01
  - NSE — Nifty 50 derivatives contract specifications (Black–Scholes formula for base prices) | https://www.nseindia.com/products-services/equity-derivatives-nifty50 | accessed 2026-11-01
  - NSE — Index close file, Budget day Feb 2025 (ind_close_all_01022025.csv) | https://nsearchives.nseindia.com/content/indices/ind_close_all_01022025.csv | accessed 2026-11-01
  - NSE — Index close file, Budget day Feb 2026 (ind_close_all_01022026.csv) | https://nsearchives.nseindia.com/content/indices/ind_close_all_01022026.csv | accessed 2026-11-01
  - NSE — Index close file, election count day Jun 2024 (ind_close_all_04062024.csv) | https://nsearchives.nseindia.com/content/indices/ind_close_all_04062024.csv | accessed 2026-11-01
  - Carr and Wu — Variance risk premiums, Review of Financial Studies (2009), abstract | https://ideas.repec.org/a/oup/rfinst/v22y2009i3p1311-1341.html | accessed 2026-11-01
  - Anticipating uncertainty: straddles around earnings announcements, Journal of Financial and Quantitative Analysis (2018), abstract | https://www.cambridge.org/core/journals/journal-of-financial-and-quantitative-analysis/article/abs/anticipating-uncertainty-straddles-around-earnings-announcements/7B34877AD5E06304BA3C55FBA3219FDD | accessed 2026-11-01
  - Sinclair — Volatility Trading, second edition (Wiley, 2013) | https://www.wiley.com/en-us/Volatility+Trading%2C+%2B+Website%2C+2nd+Edition-p-9781118347133 | accessed 2026-11-01
  - Natenberg — Option Volatility and Pricing, second edition (McGraw-Hill, 2014), catalogue page | https://books.google.com/books?vid=ISBN9780071818773 | accessed 2026-11-01
  - Zerodha Varsity — Options theory for professional trading (module) | https://zerodha.com/varsity/module/option-theory/ | accessed 2026-11-01
---
## Implied volatility is a price, not a forecast

An option's price depends on the index level, the strike, the time to expiry, the interest rate and one number nobody can observe: the volatility the index will have between now and expiry. The Black–Scholes formula that NSE prints on its [Nifty 50 contract page](https://www.nseindia.com/products-services/equity-derivatives-nifty50) for computing base prices — a call is worth S·N(d₁) − X·e^(−rt)·N(d₂) — takes volatility as an input. Implied volatility (IV) runs the formula backwards: it is the volatility that makes the model price equal the price the market is actually paying. {{label:MECHANISM}}

So IV is a price expressed in volatility units. It is what buyers and sellers agreed to pay for uncertainty, quoted annualised: an IV of 12 means the market is pricing moves consistent with a 12 per cent standard deviation over a year. To bring it down to a period, multiply by the square root of the fraction of a year: over a month, 12 ÷ √12 ≈ 3.5 per cent; over a week, 12 × √(7 ÷ 365) ≈ 1.66 per cent.

### India VIX

India VIX is NSE's single-number summary of Nifty 50 implied volatility. Its [methodology document](https://nsearchives.nseindia.com/s3fs-public/inline-files/India_VIX_comp_meth.pdf) describes an expected volatility over the next thirty calendar days, computed from the best bid and ask quotes of out-of-the-money near- and mid-month Nifty options with the CBOE method, time to expiry measured in minutes, and the at-the-money strike taken as the one just below the forward index level. Because it is built from the whole out-of-the-money strip rather than one strike, it moves when skew moves as well as when at-the-money prices move. The daily value is in NSE's index close files, which is also where the history for the next section comes from.

### IV percentile and IV rank: compute them yourself

A raw IV means little without context; 12 is high for a dull year and low for a crisis. Two normalisations are common. **IV percentile** is the share of the past year's trading days on which IV was below today's value. **IV rank** places today's IV between the year's low and high: (IV − low) ÷ (high − low). Neither is published by NSE for Nifty options, so the reader's own tool must compute them from a stored history of the option's IV or of India VIX. {{label:MECHANISM}} They are descriptive statistics, not signals: an IV at its yearly high says volatility is expensive relative to its own past, which is exactly when the underlying has usually been moving most.

## The straddle prices the expected move

The cheapest way to read the market's expected move is the at-the-money straddle: the call plus the put at the strike nearest the index. For an at-the-money option with little time left, the Black–Scholes price simplifies to roughly 0.4 × S × σ × √T, where σ is the IV and T the time to expiry in years, so the straddle is roughly 0.8 × S × σ × √T. The one-standard-deviation (one-σ) move over the same period is S × σ × √T. Put the two together and the straddle is about 0.8 of a one-σ move, so one σ is about 1.25 times the straddle. {{label:MECHANISM}} [Natenberg](https://books.google.com/books?vid=ISBN9780071818773) and [Sinclair](https://www.wiley.com/en-us/Volatility+Trading%2C+%2B+Website%2C+2nd+Edition-p-9781118347133) both derive it; it follows from the shape of the normal curve.

:::example
Nifty 50 at 25,000, IV 12 per cent, seven days to expiry. σ√T = 0.12 × √(7 ÷ 365) = 1.662 per cent, so the one-σ move is about ₹415 and the one-σ range is roughly 24,585–25,415. The straddle is about 0.8 × 415 ≈ ₹332; the [Black–Scholes calculator](../../tools/black-scholes-greeks/) at the current repo rate prices the 25,000 call at ₹179 and the put at ₹153, which is ₹332 together. Per lot that is ₹332 × {{fact:fo-nifty-lot}} = ₹21,580 of premium changing hands for the market's view of one week.

Now the afternoon of expiry with six hours of trading left: √T falls to about 0.0262, the one-σ move to about ₹79 and the straddle to about ₹63. The index has not become calmer; there is simply almost no time left for it to move.
:::

The square root is the whole story of time decay in this picture. Reading down the calculator's output for the same strike at IV 12 per cent:

| Time to expiry | At-the-money straddle |
|---|---|
| Seven days | ≈ ₹332 |
| Three days | ≈ ₹217 |
| Two days | ≈ ₹177 |
| One day | ≈ ₹125 |
| Six hours | ≈ ₹63 |

The [expected-move calculator](../../tools/expected-move/) reads this both ways: from a quoted straddle to an implied range, and from an IV to a one-σ range. It also shows the practitioner's shortcut "expected move ≈ 0.8 × straddle". {{label:LORE}} That shortcut is a different claim from the identity above — it says the index usually moves less than the straddle — and no public study measures it for Nifty, so the calculator labels it lore. The identity is maths; the shortcut is a belief about the variance premium, which the next section discusses.

## Implied usually exceeds realised — but not always

{{label:EVIDENCE}} Carr and Wu ([Review of Financial Studies, 2009](https://ideas.repec.org/a/oup/rfinst/v22y2009i3p1311-1341.html)) defined the variance risk premium as realised variance minus a synthetic variance-swap rate built from an option portfolio, and documented its history for five equity indices and thirty-five stocks: on average, the variance implied by option prices exceeded the variance that was realised. That is the standard reference for the sentence "implied usually exceeds realised", and the economic reason selling options can earn a premium. It is US and European index evidence; no equivalent Indian study was located for this site.

{{label:EVIDENCE}} The premium is not uniform in time. A [Journal of Financial and Quantitative Analysis paper (2018)](https://www.cambridge.org/core/journals/journal-of-financial-and-quantitative-analysis/article/abs/anticipating-uncertainty-straddles-around-earnings-announcements/7B34877AD5E06304BA3C55FBA3219FDD) found that straddles on US single stocks lose money on average, yet at-the-money straddles bought three days before an earnings announcement and held to it returned about 3.34 per cent on average: investors under-priced event uncertainty beforehand, and IV collapsed after. The lesson for an Indian trader is the shape of the finding, not the number: around a scheduled event the premium can run the other way, and the collapse afterwards is the "crush".

## IV crush, with NSE's own numbers

IV crush is the fall in implied volatility once an awaited event has happened and the uncertainty it carried is resolved. NSE's index close files give three clean Nifty examples; the site's research used the files directly rather than a vendor's chart.

| Session | Nifty 50 | India VIX |
|---|---|---|
| Budget, {{date:2025-02-01}} | −0.11% to 23,482.15 | 16.25 → 14.10 (−13.25%) |
| Budget, {{date:2026-02-01}} | −1.96% to 24,825.45 | 13.63 → 15.10 (+10.73%) |
| Election count, {{date:2024-06-04}} | −5.93% to 21,884.50 | → 26.75 (+27.75%) |

**The textbook crush.** On the Saturday special session for the 2025 Budget the index barely moved and India VIX fell by more than an eighth, to 14.10 ([file](https://nsearchives.nseindia.com/content/indices/ind_close_all_01022025.csv)); it was 14.35 at the next session. Reprice the worked example for that: a ₹332 straddle at IV 12 per cent becomes about ₹288 if IV falls by the same proportion to about 10.4 per cent, with the index unchanged — a fall of about ₹44 a unit, or roughly ₹2,850 per lot, from the volatility change alone. A buyer who was right that "something would happen" and wrong about its size paid that.

**No crush on the day.** On the Sunday special session for the 2026 Budget the index fell almost two per cent and India VIX *rose* to 15.10 ([file](https://nsearchives.nseindia.com/content/indices/ind_close_all_01022026.csv)); the crush came the next day, to 13.87, a fall of about eight per cent. IV falls after an event only if the move that arrives is smaller than the move that was priced. When the move is larger, IV can rise while the straddle buyer is already profitable on direction.

**The opposite case.** On the election count day of {{date:2024-06-04}} Nifty opened at 23,179.50 against the previous close of 23,263.90, fell to 21,281.45 and closed at 21,884.50; Bank Nifty lost 7.95 per cent, and India VIX closed at 26.75, up 27.75 per cent — one day after it had fallen 14.9 per cent on a session in which Nifty had risen 3.25 per cent ([file](https://nsearchives.nseindia.com/content/indices/ind_close_all_04062024.csv)). Whoever sold volatility into the exit-poll relief rally met the other tail within a day. [Buying versus selling options](../buying-vs-selling-options/) prices that day per lot.

{{label:LORE}} RBI policy days, India CPI releases, FOMC nights and results are the same mechanism — a scheduled resolution of uncertainty — but no primary source publishes per-event IV changes for Nifty beyond what the index files show for the two Budgets above. Any "IV always drops x per cent after the RBI" claim remains lore. The site's [computed statistics page](../../stats/#vix) groups the next session's daily range by VIX quartile; it does not group event-day IV changes and cannot supply that missing hit rate. The [IST calendar](../../calendar/) lists the dates and release times.

## Using it on the day

- **Compare the straddle with the day's realised range.** If the at-the-money straddle on a seven-day contract is pricing a one-σ move of ₹415 for the week, a 150-point morning is inside the market's expectation, not a surprise. [Indicators and why they lag](../indicators-and-why-they-lag/) covers ATR as the realised-range measure.
- **Decide which side of the event you are on.** Buying before a scheduled event pays the event premium and needs a move larger than priced; selling into it collects the premium and takes the gap. Neither is a free lunch; the June 2024 file shows what the seller's tail looks like.
- **Watch IV, not just price, when you hold through news.** A long option can be right on direction and still lose if IV collapses; a short can be right on direction and still bleed if IV rises. [Greeks for a day trader](../greeks-for-a-day-trader/) puts rupee numbers on vega.
- **Treat percentile and rank as context.** Expensive volatility is a reason to prefer structures that sell it or to size smaller; it is not, by itself, a reason to sell naked. [Spreads and delta-neutral structures](../spreads-and-delta-neutral/) shows what a long wing costs and what it buys.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, an average of {{fact:sebi-loss-2026-avg}} each ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). Knowing how a straddle is priced makes a trade's assumption explicit; it does not make the assumption right. Figures and their sources live in the [verified facts register](../../facts/).
:::

:::evidence What the evidence says
- {{label:MECHANISM}} IV is the volatility that makes the Black–Scholes price equal the market price; the at-the-money straddle ≈ 0.8 of a one-σ move, so one σ ≈ 1.25 × straddle.
- {{label:EVIDENCE}} Implied variance has on average exceeded realised variance across US and European equity indices (2009); straddles bought into US earnings announcements earned a positive return on average although straddles lose on average (2018).
- {{label:EVIDENCE}} NSE's index files: India VIX fell more than an eighth on the 2025 Budget day with the index flat, rose on the 2026 Budget day as the index fell almost two per cent, and jumped more than a quarter on the June 2024 count day.
- {{label:LORE}} The "0.8 × straddle" shortcut, and any per-event IV statistic for RBI, CPI, FOMC or results days: no Indian primary source exists.
:::
