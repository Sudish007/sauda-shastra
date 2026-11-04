---
title: Buying versus selling options
section: Options
summary: What SEBI's FY26 study says about who buys options ({{fact:opt-buyer-share-fy26}} of individual traders mainly bought) and who kept the money, why bought options bleed, why selling is not free money (the {{date:2024-06-04}} gap priced per lot), what a long wing does to margin, and how to size either side with the calculators.
updated: 2026-11-04
level: intermediate
order: 5
topics: [option buying, option selling, variance risk premium, sebi study, retail losses, naked options, gap risk, span, elm, hedged selling, upfront premium, oi confirmation]
related: [iv-expected-move-and-crush, spreads-and-delta-neutral, expiry-day-dynamics, greeks-for-a-day-trader, what-a-trade-costs, intraday-leverage-today, what-sebi-loss-studies-say, position-sizing-and-loss-limits, oi-shift-breakout, retail-traps]
tools: [position-size, charges]
sources:
  - SEBI press release 50/2026 (Aug 2026) — Trends in retail participation, trading behaviour and profitability in equity derivatives | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf | accessed 2026-11-01
  - SEBI — Profitability of individual traders in the equity derivatives segment, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
  - SEBI press release 22/2024 (Sep 2024) — Individual traders' losses in equity futures and options, FY22–FY24 | https://www.sebi.gov.in/sebi_data/attachdocs/sep-2024/1727086965496.pdf | accessed 2026-11-01
  - SEBI study Jul 2025 — Growth in equity derivatives vis-à-vis the cash market after recent measures | https://www.sebi.gov.in/sebi_data/attachdocs/jul-2025/1751900271726.pdf | accessed 2026-11-01
  - SEBI circular Oct 2024 (2024/132) — Measures to strengthen the equity index derivatives framework (upfront premium) | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf | accessed 2026-11-01
  - NSE — Index close file, election count day Jun 2024 (ind_close_all_04062024.csv) | https://nsearchives.nseindia.com/content/indices/ind_close_all_04062024.csv | accessed 2026-11-01
  - NSE Clearing — Equity derivatives margins (SPAN, ELM, crystallised obligation) | https://www.nseclearing.in/risk-management/equity-derivatives/margins | accessed 2026-11-01
  - SEBI circular Feb 2020 (2020/27) — Review of the margin framework for cash and derivatives segments | https://www.sebi.gov.in/sebi_data/attachdocs/feb-2020/1582545012845.pdf | accessed 2026-11-01
  - SEBI consultation paper Jul 2024 — Measures to strengthen the index derivatives framework (expiry-day illustrations) | https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1722407296072.pdf | accessed 2026-11-01
  - Carr and Wu — Variance risk premiums, Review of Financial Studies (2009), abstract | https://ideas.repec.org/a/oup/rfinst/v22y2009i3p1311-1341.html | accessed 2026-11-01
  - Retail traders love 0DTE options… but should they? — FoFI 2024 conference paper (Dec 2023) | https://wp.lancs.ac.uk/fofi2024/files/2024/04/FoFI-2024-146-Leander-Gayda.pdf | accessed 2026-11-01
---
## What the FY26 numbers say

Start with the regulator's census, because it answers the question most new traders ask backwards. SEBI's [press release of August 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf) on its FY25–FY26 studies reports that about {{fact:opt-buyer-share-fy26}} of individual traders predominantly bought options and about two per cent were mainly sellers — and that "majorly options sellers" was the only strategy group with a positive median return on capital employed. In the same year {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, the aggregate net loss was {{fact:sebi-loss-2026-amount}}, the average loss {{fact:sebi-loss-2026-avg}}, and options produced about 92 per cent of the losses.

Who kept the money? Proprietary traders booked about ₹44,000 crore of gross trading profit and foreign portfolio investors about ₹14,000 crore, 99 per cent of it from entities using algorithms; individuals' gross trading loss was about ₹72,000 crore and their transaction costs about ₹25,000 crore. The losses persist: nine in ten traders who lost in two consecutive years and kept trading lost again, about 85 per cent of trader-quarters were loss-making, and for 79 per cent of traders with mixed results the average gain in a winning quarter was smaller than the average loss in a losing one. The earlier [September 2024 release](https://www.sebi.gov.in/sebi_data/attachdocs/sep-2024/1727086965496.pdf) covering FY22–FY24 told the same story: 93 per cent of more than one crore individual traders lost, {{fact:sebi-loss-2024-amount}} in aggregate, while proprietary traders and FPIs earned ₹33,000 crore and ₹28,000 crore gross in FY24, almost all of it through algorithms.

:::warning Base rates first
Those figures are the base rate for everything below. {{fact:opt-buyer-share-fy26}} of individuals bought; the only group with a positive median return sold; {{fact:sebi-loss-2026-share}} lost either way. The register's [verified facts](../../facts/) carry each number's source and date; [What a trade costs](../what-a-trade-costs/) prices the transaction-cost line.
:::

## Why bought options bleed

Three forces work against a bought option, and none of them is about being wrong on direction.

**The variance premium.** {{label:EVIDENCE}} Carr and Wu ([Review of Financial Studies, 2009](https://ideas.repec.org/a/oup/rfinst/v22y2009i3p1311-1341.html)) documented that the variance implied by option prices has on average exceeded the variance realised afterwards, across five equity indices and thirty-five stocks. A buyer pays implied and receives realised; on average the difference is a cost. This is US and European evidence, applied to India as a mechanism rather than as a measured Indian premium.

**Same-day decay.** {{label:EVIDENCE}} SEBI's [consultation paper of July 2024](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1722407296072.pdf) illustrates what time does to an at-the-money option on expiry day: thirty minutes before expiry a comparable contract traded at a fifth or less of its previous-day close. With {{fact:opt-zero-dte-share-fy26}} of FY26 index-option turnover in same-day contracts, most bought premium is bought on the steepest part of the decay curve. [Greeks for a day trader](../greeks-for-a-day-trader/) puts theta in rupees per lot.

**Costs that did not fall.** The FY26 studies note that although individuals' premium turnover fell, their total transaction costs were broadly unchanged, because the securities transaction tax had risen from {{date:2024-10-01}}; cumulative transaction costs for FY22–FY26 were about one lakh crore rupees. The upfront-premium rule in force since {{fact:opt-upfront-premium-since}} ([October 2024 circular](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf)) also removed the intraday leverage brokers once extended to buyers: the premium is collected in full before the trade.

:::example
Nifty at 25,000, the 25,000 call at ₹179 with seven days to expiry (IV 12 per cent; the [Black–Scholes calculator](../../tools/black-scholes-greeks/) gives the price). The buyer needs Nifty at about 25,179 at expiry just to break even before costs, and has ₹179 × {{fact:fo-nifty-lot}} = ₹11,635 of premium at risk per lot. If the trade fails and the option is sold at ₹120, the loss is ₹3,835 per lot plus about ₹67 of charges on a flat-brokerage plan ([charges calculator](../../tools/charges/)). A trader whose rule caps the loss on one trade at ₹6,000 and who will exit at half the premium (₹90 × {{fact:fo-nifty-lot}} = ₹5,850) can hold one lot; two lots would break the rule.
:::

## Why selling is not free money

The seller collects the premium, benefits from decay and from the variance premium, and the FY26 data says sellers were the one group with a positive median return. The catch is the shape of the payoff: a bounded gain against an unbounded loss, realised on the days the distribution's tail arrives.

{{label:EVIDENCE}} NSE's [index close file for {{date:2024-06-04}}](https://nsearchives.nseindia.com/content/indices/ind_close_all_04062024.csv), the election count day, is the Indian case study. Nifty 50 opened at 23,179.50 against the previous close of 23,263.90, fell to 21,281.45 and closed at 21,884.50, down 5.93 per cent; Bank Nifty lost 7.95 per cent; India VIX closed at 26.75, up 27.75 per cent — one day after it had fallen 14.9 per cent on a session in which Nifty had risen 3.25 per cent on the exit polls.

:::example
Recomputed at today's lot of {{fact:fo-nifty-lot}} units and with schematic prices: a 23,000 put sold the previous afternoon for ₹60 brought in ₹3,900 per lot. At the day's low the put's intrinsic value alone was about ₹1,719 a unit, so the position was showing a loss of roughly ₹1,659 a unit — ₹1,659 × {{fact:fo-nifty-lot}} = ₹1,07,835 per lot — at the worst point, before the market's volatility premium on top — about twenty-eight times the premium collected. The broker's risk desk would have squared off long before that, at whatever price the book offered, and charged for doing so ([Intraday leverage today](../intraday-leverage-today/)).
:::

**What the margin covers, and what it does not.** NSE Clearing's [margins page](https://www.nseclearing.in/risk-management/equity-derivatives/margins) and SEBI's [2020 margin framework](https://www.sebi.gov.in/sebi_data/attachdocs/feb-2020/1582545012845.pdf) describe the two layers. SPAN is a portfolio margin that covers a 99 per cent one-day value-at-risk, with a price-scan range for indices of six standard deviations scaled by √2 and floored at 9.3 per cent (17.7 per cent for contracts beyond nine months), plus a volatility-scan range. The extreme-loss margin (ELM) adds two per cent of notional for index derivatives, three per cent for short index options more than ten per cent out of the money, five per cent for shorts with more than nine months to expiry, and on expiry day a further {{fact:fo-expiry-day-elm-addon}} for shorts expiring that day. A margin is a deposit against a normal bad day; it is not a cap on the loss, which belongs entirely to the seller.

## Hedged selling: what a long wing buys you

SPAN scans the whole portfolio for its worst loss across price and volatility scenarios, netted per client and computed online during the day. {{label:MECHANISM}} A long option further out caps the worst-case scenario loss, so the SPAN component of a spread cannot exceed that cap; ELM, by contrast, is charged per short notional and does not fall when a wing is added. The wing therefore buys a defined maximum loss and a lower SPAN, at the price of some of the premium.

:::example
Short one lot of the 25,000 call alone, or as a 25,000/25,200 bear call spread with the 25,200 call bought against it at ₹94: the spread's worst-case loss is (200 − 85) × {{fact:fo-nifty-lot}} ≈ ₹7,475 after the ₹85 net credit, so SPAN cannot exceed the ₹13,000 width of the spread, while the ELM on the short leg's ₹16,25,000 notional stays about ₹32,500 and doubles on expiry day. On a tight spread, ELM — not SPAN — is most of the expiry-day margin. [Spreads and delta-neutral structures](../spreads-and-delta-neutral/) works through the structures.
:::

The June 2024 seller with a wing bought a few hundred points below would have lost the width of the spread and no more. {{label:EVIDENCE}} The US 0DTE evidence points the same way: single-leg debit trades in high-IV options drove retail losses, while multi-leg and short-volatility structures did better ([conference paper](https://wp.lancs.ac.uk/fofi2024/files/2024/04/FoFI-2024-146-Leander-Gayda.pdf)). No Indian study splits outcomes by structure; SEBI's FY26 data separates buyers from sellers only.

## Directional buying with "OI confirmation", honestly

The popular version of option buying is directional: buy a call when the chart breaks out and the option chain "confirms" with rising call open interest or falling put open interest. Two cautions keep that honest. Open-interest data is aggregated and, for the participant-wise split, end of day — the chain cannot say who added the contracts or why ([Reading the option chain](../reading-the-option-chain/)). And {{label:LORE}} no published study shows that an open-interest pattern predicts the next move in Nifty; "OI confirmation" is a filter traders find reassuring, not a measured edge. Used as a filter with a stop and a size, it costs nothing; used as the reason to size up, it is lore dressed as data.

## Sizing either side

- **A buyer sizes by premium at risk**, not by how many lots the account can afford. The premium is the maximum loss only if the trader is willing to lose all of it; a stop at a fraction of the premium is the usual compromise, and it should set the lot count. The [position-size calculator](../../tools/position-size/) takes the loss limit and the stop in rupees per unit.
- **A seller sizes by the stress loss**, not by the margin available. Ask what the position loses on a move of two or three times the straddle-implied range ([Implied volatility, the expected move and IV crush](../iv-expected-move-and-crush/)) and size so that loss fits the daily limit; the margin requirement is the clearing corporation's number, not yours.
- **Both pay the costs line.** A bought option that doubles still pays brokerage on two orders, STT on the sale, exchange charges on both legs and GST on the fees; the [charges calculator](../../tools/charges/) shows that a round trip from ₹179 to ₹237 on one lot costs about ₹82 against a gross gain of ₹3,744 — small when the trade works, and a steady drain across the many that do not.

:::evidence What the evidence says
- {{label:EVIDENCE}} FY26: most individuals bought options, the sellers were the only group with a positive median return, most lost either way, and costs stayed flat as turnover fell (SEBI, Aug 2026). FY22–FY24: a similar loss rate, with proprietary and foreign algorithms on the winning side (SEBI, Sep 2024).
- {{label:EVIDENCE}} Implied variance exceeds realised on average across equity indices (2009, US and Europe); single-leg retail 0DTE trades lost on average while multi-leg structures did better (US, 2021–2023).
- {{label:EVIDENCE}} The June 2024 count day in NSE's own file: a near-six-per-cent fall and a jump of more than a quarter in India VIX in one session.
- {{label:MECHANISM}} SPAN rewards a long wing by capping the scanned loss; ELM does not.
- {{label:LORE}} "OI confirmation" as a predictor of the next move.
:::
