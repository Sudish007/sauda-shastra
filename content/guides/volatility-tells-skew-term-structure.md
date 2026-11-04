---
title: Volatility tells: expected move, skew and term structure
section: Edges, habits & traps
summary: The mathematics behind a straddle-implied range, what US variance-premium and event studies do and do not establish for India, how to read volatility by strike and expiry, and why weekday patterns after the expiry-calendar change need more care than a backtest average.
updated: 2026-11-04
level: advanced
order: 2
topics: [straddle expected move, implied volatility, variance risk premium, skew, term structure, india vix, iv crush, expiry day, weekday effect]
related: [iv-expected-move-and-crush, greeks-for-a-day-trader, policy-days-vix-and-sizing, event-day-iv-crush-hedged, positioning-data-oi-gamma-pinning]
tools: [expected-move, black-scholes-greeks]
sources:
  - NSE — Nifty 50 derivatives contract specifications and Black–Scholes base-price formula | https://www.nseindia.com/products-services/equity-derivatives-nifty50 | accessed 2026-11-01
  - NSE — India VIX computation methodology | https://nsearchives.nseindia.com/s3fs-public/inline-files/India_VIX_comp_meth.pdf | accessed 2026-11-01
  - Carr and Wu — Variance risk premiums, Review of Financial Studies (2009) | https://ideas.repec.org/a/oup/rfinst/v22y2009i3p1311-1341.html | accessed 2026-11-01
  - Anticipating uncertainty: straddles around earnings announcements, Journal of Financial and Quantitative Analysis (2018) | https://www.cambridge.org/core/journals/journal-of-financial-and-quantitative-analysis/article/abs/anticipating-uncertainty-straddles-around-earnings-announcements/7B34877AD5E06304BA3C55FBA3219FDD | accessed 2026-11-01
  - NSE — Index close file, Budget session Feb 2025 | https://nsearchives.nseindia.com/content/indices/ind_close_all_01022025.csv | accessed 2026-11-01
  - NSE — Index close file, Budget session Feb 2026 | https://nsearchives.nseindia.com/content/indices/ind_close_all_01022026.csv | accessed 2026-11-01
  - SEBI — Retail participation, behaviour and profitability in equity derivatives (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf | accessed 2026-11-01
  - SEBI consultation paper Jul 2024 — Index-derivatives turnover around expiry | https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1722407296072.pdf | accessed 2026-11-01
  - SEBI circular Oct 2024 — Measures for the equity index-derivatives framework | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf | accessed 2026-11-01
  - NSE circular FAOP/68589 — Revision of derivatives expiry day (Jun 2025) | https://nsearchives.nseindia.com/content/circulars/FAOP68589.pdf | accessed 2026-11-01
  - Yadav and Kadian — Day-of-the-week effect in Indian indices during Covid-19 (2024) | https://www.publishingindia.com/storage/PDFBrochures/8019.pdf | accessed 2026-11-01
  - Sinclair — Volatility Trading, second edition (Wiley, 2013) | https://www.wiley.com/en-us/Volatility+Trading%2C+2nd+Edition-p-9781118347133 | accessed 2026-11-01
  - Natenberg — Option Volatility and Pricing, second edition (McGraw-Hill, 2014), catalogue | https://books.google.com/books?vid=ISBN9780071818773 | accessed 2026-11-01
  - Hull — Options, Futures, and Other Derivatives, eleventh edition (Pearson, 2021) | https://www.pearson.com/en-us/subject-catalog/p/options-futures-and-other-derivatives/P200000005938/9780136939979 | accessed 2026-11-01
---
## A straddle turns uncertainty into points

{{label:MECHANISM}} An at-the-money option with little time left is approximately 0.4 × S × σ × √T under the same Black–Scholes formula NSE uses for [Nifty base prices](https://www.nseindia.com/products-services/equity-derivatives-nifty50). A call and put together are therefore about 0.8 × S × σ × √T, while one standard deviation of the underlying is S × σ × √T. The market's one-standard-deviation move is consequently about 1.25 times the at-the-money straddle. It is an approximation, not a promise that price will stop at either edge.

:::example Recompute the weekly range
At an illustrative Nifty level of 25,000, annual IV of twelve per cent and seven calendar days to expiry:

- one σ = 25,000 × 0.12 × √(7 ÷ 365) ≈ 416 points;
- the at-the-money straddle ≈ 0.8 × 416 ≈ ₹332 a unit;
- one lot costs about ₹332 × {{fact:fo-nifty-lot}} = ₹21,580; and
- the one-σ range is approximately 24,584–25,416.

The [expected-move calculator](../../tools/expected-move/) performs both the straddle and IV versions. The [Black–Scholes calculator](../../tools/black-scholes-greeks/) shows how delta, gamma, theta and vega change inside the range.
:::

The straddle is a price for uncertainty. It contains expected movement, supply and demand for protection, transaction costs and compensation for carrying rare losses. A realised move smaller than the premium helps the seller; a larger move helps the buyer, but path, IV and time can change the result before expiry.

{{label:EVIDENCE}} **The variance premium is documented outside India.** Carr and Wu's [2009 study](https://ideas.repec.org/a/oup/rfinst/v22y2009i3p1311-1341.html) formed synthetic variance-swap rates from options across five equity indices and thirty-five stocks and found implied variance generally above the variance later realised. This is US and international evidence. No Indian variance-risk-premium study was found for this site, so it cannot supply a Nifty selling edge or an Indian return estimate.

{{label:EVIDENCE}} **Scheduled events can reverse the average, again in US evidence.** A [2018 earnings study](https://www.cambridge.org/core/journals/journal-of-financial-and-quantitative-analysis/article/abs/anticipating-uncertainty-straddles-around-earnings-announcements/7B34877AD5E06304BA3C55FBA3219FDD) found US single-stock straddles losing on average, but straddles bought three days before earnings and held to the announcement earning 3.34 per cent on average. Event uncertainty was under-priced before the release and IV fell afterwards. That result is not an Indian Budget or results backtest.

### Two Indian event days, opposite outcomes

{{label:EVIDENCE}} NSE's files show why “IV crush after the event” needs a condition. On the Budget session of {{date:2025-02-01}}, Nifty moved only −0.11 per cent while India VIX fell from 16.25 to 14.10, a drop of 13.25 per cent ([NSE file](https://nsearchives.nseindia.com/content/indices/ind_close_all_01022025.csv)). Scale the ₹332 straddle above by the IV change and it falls to about ₹289, a loss of roughly ₹43 a unit or ₹2,795 per lot from volatility alone, with the index nearly still.

{{label:EVIDENCE}} On {{date:2026-02-01}}, Nifty fell 1.96 per cent, about 490 points from an illustrative 25,000, while India VIX rose from 13.63 to 15.10; it fell only the next session ([NSE file](https://nsearchives.nseindia.com/content/indices/ind_close_all_01022026.csv)). The move exceeded the approximately 416-point one-σ range, so the buyer could gain from direction even though a later crush followed. IV falls after an event when the uncertainty removed is larger than the surprise delivered, not simply because the calendar says the event is over.

## Skew: volatility across strikes

{{label:MECHANISM}} Skew is the implied volatility quoted at different strikes for the same expiry. Equity-index puts below spot usually carry more IV than equally distant calls because investors pay for downside protection and crashes are asymmetric. A put with richer IV is not forecasting a fall; it says protection at that strike is expensive relative to the model's common-volatility baseline.

A useful read compares like with like:

1. Keep expiry fixed and compare strikes by delta or percentage distance from spot, not by raw points.
2. Compare today's curve with its own history. A steep downside curve after a fall may be fear already paid for, not fresh information.
3. Separate bid–ask distortion. A far out-of-the-money option with one stale quote can display an absurd IV.
4. Ask what position expresses the view. A vertical spread trades the difference between two points on the curve; a naked option also carries direction and tail risk.

[Sinclair's *Volatility Trading*](https://www.wiley.com/en-us/Volatility+Trading%2C+2nd+Edition-p-9781118347133), [Natenberg's *Option Volatility and Pricing*](https://books.google.com/books?vid=ISBN9780071818773) and [Hull's derivatives text](https://www.pearson.com/en-us/subject-catalog/p/options-futures-and-other-derivatives/P200000005938/9780136939979) are the textbook basis for this vocabulary. {{label:MECHANISM}} No Indian skew study was fetched for the research pack. “Put skew is steep, therefore Nifty must fall” remains an unsupported directional jump.

## Term structure: volatility across expiries

{{label:MECHANISM}} Term structure holds strike or delta roughly constant and compares IV across expiries. A nearby event can lift the weekly expiry above the next month; a known quiet week can leave it below. The gap can be traded with calendars and diagonals, but those structures also carry different gamma, theta and settlement risks.

India VIX is not a weekly-option IV. NSE's [methodology](https://nsearchives.nseindia.com/s3fs-public/inline-files/India_VIX_comp_meth.pdf) targets thirty calendar days using out-of-the-money near- and mid-month Nifty options, with time measured in minutes. Weekly options are excluded. A trader comparing a weekly at-the-money IV with India VIX is constructing a term-structure comparison, not reading two versions of the same number.

{{label:EVIDENCE}} The short end is where Indian activity concentrates: SEBI reports about {{fact:opt-zero-dte-share-fy26}} of FY26 index-option turnover in same-day-expiry contracts, three-quarters within one day and almost all within a week ([August 2026 study](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf)). High turnover does not make the near IV accurate. It explains why event, expiry and order-flow shocks show up there first and why the term curve can kink sharply.

### India VIX regimes

{{label:LORE}} Named bands such as “calm”, “normal” or “stressed” are practitioner conventions. NSE defines how India VIX is calculated, not cut-offs that forecast Nifty direction or a strategy's return.

{{label:EVIDENCE}} The site's [computed VIX table](../../stats/#vix) creates sample quartiles from ten years of India VIX closes and reports the following Nifty session's range distribution in each. The bands are explicitly the sample's own quarters, not exchange definitions, and the table is historical rather than predictive. It upgrades the descriptive relationship between VIX and later range; it does not validate a named regime or direction call.

## Weekday and expiry effects

{{label:EVIDENCE}} SEBI's [July 2024 consultation](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1722407296072.pdf) found that, on the weekly expiry it examined, the last half-hour accounted for sixteen per cent of Nifty's expiry-day notional and the expiry session carried nearly two-thirds of that contract week's notional. Its [October circular](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf) described expiry-day holding periods in minutes and associated the concentration with higher intraday and closing volatility. That is evidence of concentration, not a direction rule.

{{label:EVIDENCE}} A [2024 Indian day-of-week study](https://www.publishingindia.com/storage/PDFBrochures/8019.pdf), limited to the Covid period, found a significant negative Monday return only for Sensex and positive results on some other weekdays and indices. The effects differed by index. The correct conclusion is “mixed and sample-specific”, not “Tuesday always rises”.

{{label:MECHANISM}} Since {{date:2025-09-01}}, NSE derivatives expire on {{fact:fo-nifty-weekly-expiry-day}} and BSE weeklies on {{fact:fo-sensex-weekly-expiry-day}} under [NSE circular FAOP/68589](https://nsearchives.nseindia.com/content/circulars/FAOP68589.pdf). A post-change weekday average now mixes the ordinary weekday with a venue's expiry effect. A Tuesday result for Nifty could be gamma, unwinding, news or Tuesday itself; a simple weekday table cannot separate them.

{{label:EVIDENCE}} The site's [computed daily-range table](../../stats/#ranges) provides a dated Indian check across weekdays over ten years. Its medians sit close together and the page labels the sample historical, not a forecast. It measures full-session ranges, not returns, expiry-only sessions or a tradable hit rate. Named weekday rules remain lore unless a test separates those confounders and includes costs.

## A disciplined volatility read

- {{label:MECHANISM}} Convert the straddle or IV into the same horizon as the intended holding period.
- {{label:MECHANISM}} Read skew across equal deltas and term structure across comparable strikes.
- {{label:EVIDENCE}} Name the market behind a claim: the variance-premium and earnings results above are US or international; the two Budget observations and the expiry-turnover concentration are Indian.
- {{label:LORE}} Do not turn a steep skew, an inverted weekly curve or a weekday average into direction without a measured test.

The useful “tell” is a price that makes the assumption visible. It is not a hidden forecast.
