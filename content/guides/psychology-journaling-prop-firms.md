---
title: Psychology, journaling and prop firms
section: Risk, psychology & tax
summary: What SEBI's behaviour data says about experience, persistence and activity ({{fact:sebi-loss-2026-five-year-consistent}} of five-year traders profited every year), the classic over-trading studies, revenge- and over-trading controls written as rules, a downloadable trade-journal template with a weekly review, and what a "funded account" is for an Indian trader — RBI's Alert List, the LRS rule and the regulated alternative.
updated: 2026-11-04
level: beginner
order: 4
topics: [trading psychology, revenge trading, over-trading, overconfidence, daily loss limit, trade journal, journaling template, csv, prop firm, funded account, ftmo, rbi alert list, lrs]
related: [what-sebi-loss-studies-say, position-sizing-and-loss-limits, expectancy-and-drawdown-maths, buying-vs-selling-options, retail-traps]
sources:
  - SEBI — Trading behaviour of individual traders in the equity derivatives segment, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233601328.pdf | accessed 2026-11-01
  - SEBI — Analysis of profits and losses in the equity derivatives segment, FY22–FY24 (Sep 2024) | https://www.sebi.gov.in/sebi_data/attachdocs/sep-2024/1727085659479.pdf | accessed 2026-11-01
  - SEBI — Analysis of intraday trading by individuals in the equity cash segment (Jul 2024) | https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1721818140715.pdf | accessed 2026-11-01
  - Barber and Odean — Trading is hazardous to your wealth, Journal of Finance (2000), author copy | https://faculty.haas.berkeley.edu/odean/papers/returns/Individual_Investor_Performance_Final.pdf | accessed 2026-11-01
  - Barber, Lee, Liu, Odean and Zhang — Do day traders rationally learn about their ability? (2017), working paper | https://faculty.haas.berkeley.edu/odean/papers/Day%20Traders/Day%20Trading%20and%20Learning%20110217.pdf | accessed 2026-11-01
  - RBI — Alert List of entities not authorised to deal in forex or to operate forex trading platforms (Nov 2025) | https://rbi.org.in/scripts/bs_viewcontent.aspx?Id=4235 | accessed 2026-11-01
  - RBI press release (Nov 2025) — Alert List updated | https://rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=61646 | accessed 2026-11-01
  - RBI — Master Direction on the Liberalised Remittance Scheme, para 5 (prohibited remittances) | https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=10192 | accessed 2026-11-01
  - SEBI — Master circular for stock brokers (Jun 2025), paras 30–31 on proprietary trading and pro-account terminals | https://www.sebi.gov.in/sebi_data/attachdocs/jun-2025/1750158789381.pdf | accessed 2026-11-01
  - FTMO — Frequently asked questions (provider's own description of its product) | https://ftmo.com/en/faq/ | accessed 2026-11-01
  - Zerodha Varsity — Trading biases (Module 9) | https://zerodha.com/varsity/chapter/trading-biases/ | accessed 2026-11-01
---
## What the data says about behaviour

Trading psychology is usually taught as a list of feelings. It is more useful to start from what the regulator measured, because the measurements say which habits cost money.

{{label:EVIDENCE}} **Experience does not fix outcomes.** In SEBI's [behaviour study](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233601328.pdf) of FY25–FY26, about 91 per cent of first-year traders lost, and the loss-maker share *rose* above 95 per cent among traders with four or more consecutive years in the market. Of those active in all five years FY22–FY26, {{fact:sebi-loss-2026-five-year-consistent}} were profitable every year and 65.6 per cent lost every year.

{{label:EVIDENCE}} **Losers mostly keep going.** The [Sep 2024 study](https://www.sebi.gov.in/sebi_data/attachdocs/sep-2024/1727085659479.pdf) found that over 75 per cent of FY24 loss-makers had also lost in each of the two preceding years and kept trading; the FY26 study found that between 90 and 92 per cent of two-year losers lost again, that 88 per cent of traders with more than ten lakh rupees of cumulative losses were still trading, and that most of those who did quit had lost in their final quarter — people leave after the damage, not before it.

{{label:EVIDENCE}} **Activity goes with loss.** Traders active more than a hundred days a year were 42 per cent of the FY26 crowd but 94 per cent of turnover and 87 per cent of losses. In the equity cash [intraday study](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1721818140715.pdf), 80 per cent of those placing more than five hundred trades a year lost, against {{fact:sebi-intraday-cash-loss-share}} of intraday traders overall; three-year veterans were still 54 per cent loss-makers.

{{label:EVIDENCE}} **The same pattern elsewhere, decades earlier.** [Barber and Odean (2000)](https://faculty.haas.berkeley.edu/odean/papers/returns/Individual_Investor_Performance_Final.pdf) followed 66,465 US households at a discount broker from 1991 to 1996: the most active fifth earned 11.4 per cent a year against a market return of 17.9 per cent, while the average household turned over three-quarters of its portfolio a year and earned 16.4 per cent. They attributed the over-trading to overconfidence. [Barber, Lee, Liu, Odean and Zhang (2017)](https://faculty.haas.berkeley.edu/odean/papers/Day%20Traders/Day%20Trading%20and%20Learning%20110217.pdf) studied Taiwanese day traders over fifteen years and found aggregate performance negative, the large majority unprofitable, and many continuing despite losses; their earlier work put the share of predictably profitable day traders below one per cent. This is US and Taiwanese evidence about retail traders, not Indian data, and it is quoted here because it agrees with SEBI's.

The lesson is not "feel calmer". It is that the behaviours that lose — trading more after losing, trading more often, adding size — are measurable, and so are the rules that interrupt them.

## Controls written as rules

{{label:MECHANISM}} These are pre-commitments, decided while calm and obeyed while not. They are practitioner conventions, not tested parameters; Varsity's [trading-biases chapters](https://zerodha.com/varsity/chapter/trading-biases/) describe the biases each one guards against.

1. **A written plan before the open.** Which setups, which instruments, the maximum number of trades, and the risk per trade in rupees — [Position sizing and loss limits](../position-sizing-and-loss-limits/) sets the figure. A trade that is not on the list is not taken.
2. **A daily loss limit and a trade cap.** −2R or two per cent of equity, whichever is written down, and a maximum of, say, four trades. When either is hit the platform is closed for the day — not watched.
3. **Two stop-outs in the first hour ends the day.** The opening hour has the widest ranges and the most noise; two consecutive losses there say the read is wrong today.
4. **A ten-minute lockout after any stop-out.** No order for ten minutes. The next trade is placed from the plan, not from the loss.
5. **Never add size after a loss.** The next trade is the same rupee risk as the plan, or smaller. "Making it back" is the single sequence that turns a one-per-cent plan into a ten-per-cent day.
6. **Halve size after a losing week.** After a week down five per cent, risk per trade is halved for the next week and the journal is reviewed first.
7. **Trading capital separate from savings.** SEBI's FY26 data shows about 35 per cent of derivatives traders held no equity portfolio at all; a trading account that *is* the savings cannot tolerate normal drawdowns, and the trader behaves accordingly.
8. **A weekly journal review** — the five lines in the next section.

:::example The revenge loop, in rupees
Account ₹6,00,000; planned risk ₹6,000 a trade (one per cent). The first trade loses ₹6,000. The second is doubled "to get it back" and loses ₹12,000. The third is tripled and loses ₹18,000. Forty minutes after the first stop-out the day is −₹36,000 — six per cent of the account, from a plan that allowed one per cent per trade. A written −2R limit would have ended the day at −₹12,000 after the second loss, and rule 5 would have made the second loss ₹6,000 instead of ₹12,000.
:::

## The journal: what to record and why

A journal is the only place expectancy can be computed honestly, because memory keeps the winners. Download the template — <a href="../../downloads/trade-journal-template.csv" download>trade-journal-template.csv</a> — a UTF-8 CSV with a header row and two schematic rows (not real trades) that opens in any spreadsheet. The columns are grouped below; the ones in the first group are the minimum.

| Column group | Columns | Why they are there |
|---|---|---|
| The trade | date, entry_time_ist, exit_time_ist, market, instrument, expiry, strike, option_type, product, direction, qty_lots | Enough to reconstruct the position and check it against the contract note; option fields stay empty for stocks and futures |
| The plan | playbook, planned_trade, stop_price, target_price, risk_rupees_1r, setup_grade | The playbook slug ties the trade to a written setup; risk_rupees_1r is the rupee loss at the stop, not the margin; setup_grade (A to D) is written **before** entry |
| The result | entry_price, exit_price, pnl_gross, charges, pnl_net, r_multiple | r_multiple = pnl_net ÷ risk_rupees_1r, so trades of different sizes compare; charges come from the contract note or the [charges calculator](../../tools/charges/) |
| The behaviour | followed_plan, mistake_tags, emotion_before, emotion_after, screenshot_link, notes | mistake_tags uses a fixed vocabulary — revenge, no-setup, size-up, moved-stop, early-exit, late-entry, news-chase, over-trade, fomo, held-overnight — so the counts can be compared week to week |

In the schematic rows, the first trade is a planned Nifty option bought on the {{fact:fo-nifty-weekly-expiry-day}} weekly expiry of {{date:2026-11-03}}: one lot of {{fact:fo-nifty-lot}} units bought at ₹180 with a stop at ₹140 (1R = ₹2,600) and sold at ₹255 for a gross ₹4,875, about ₹84 of charges and +1.84R. The second is an unplanned Bank Nifty option, one lot of {{fact:fo-banknifty-lot}} units on the {{date:2026-11-23}} monthly expiry, bought four minutes after a stop-out with no setup, tagged *revenge; no-setup; size-up* and graded D before entry: a loss of −1.13R. The second row is the one the journal exists to count.

**The weekly review, five lines.** Every Saturday compute, from the week's rows and the running total:

1. Win rate (share of trades with pnl_net above zero) and average R — the two inputs of [expectancy](../expectancy-and-drawdown-maths/).
2. Expectancy in R and in rupees, after charges.
3. Longest losing streak this week and this year, against what the win rate predicts.
4. Maximum drawdown from the equity peak, in rupees and as a share of equity.
5. Mistake-tag counts, and the R lost to trades tagged *revenge*, *no-setup* or *size-up* — the cost of indiscipline, separately from the cost of the method.

If the fifth line is larger than the second, the method is not the problem.

## Prop firms and funded accounts in India

The product advertised as a "funded account" works like this, in the words of its best-known provider: [FTMO's own FAQ](https://ftmo.com/en/faq/) describes a paid evaluation on a simulated account, educational tools, a refund of the fee under stated conditions, and a share of the simulated profits paid to traders who pass; it says it is not a broker, provides only simulated trading, and does not aim its content at residents of places where that would breach local law. Treat every other provider's page as a claim of the same kind until read.

{{label:EVIDENCE}} For an Indian resident, three facts about the regulatory position matter more than any payout schedule.

- **RBI's Alert List.** The Reserve Bank publishes an [Alert List](https://rbi.org.in/scripts/bs_viewcontent.aspx?Id=4235) of entities that are neither authorised to deal in foreign exchange under FEMA nor permitted to operate electronic trading platforms for forex transactions. The list updated on {{date:2025-11-19}} ([press release](https://rbi.org.in/scripts/BS_PressReleaseDisplay.aspx?prid=61646)) runs to about 95 names and includes FTMO, FundedNext and Smart Prop Trader. The RBI also states that the list is not exhaustive and that a name's absence from it should not be taken as authorisation. This page uses the RBI's wording and makes no further characterisation of any firm.
- **LRS does not cover margins.** Under the [Master Direction on the Liberalised Remittance Scheme](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=10192) (para 5), remittances for margins or margin calls to overseas exchanges or overseas counterparties are not permitted. An evaluation fee is a payment for a service; what the account then trades, and where, is a separate question for the provider and the remitting bank.
- **None of it is NSE or BSE.** Funded accounts trade the provider's simulated book of forex, metals, indices and US contracts. Nothing on this site about Indian liquidity, freeze quantities, lot sizes, SEBI margins or expiry mechanics transfers to them, and nothing learned there about Indian markets is tested.

{{label:MECHANISM}} The regulated version of "trading someone else's capital" in India is proprietary trading at a SEBI-registered stock broker. SEBI's [master circular for stock brokers](https://www.sebi.gov.in/sebi_data/attachdocs/jun-2025/1750158789381.pdf) (paras 30–31) requires a broker that trades on its own account to disclose this to clients and restricts "pro-account" order entry to terminals at the member's own offices; the people entering those orders are the member's employees or dealers, trading its capital under its risk systems. That route is a job, obtained by application and usually by a track record, not a product bought with an evaluation fee. For anyone considering it, the question to ask a trading member is whether it runs a proprietary desk and how it hires for it.

:::example Evaluation-fee arithmetic, symbolically
With a fee F, a simulated capital C, a profit target of T per cent and a payout split of S per cent, the fee buys an attempt at earning S × T × C — if the target is reached inside the rules on drawdown and time. The break-even pass rate for the trader is F ÷ (S × T × C); the provider's revenue is the fee multiplied by the number of attempts, whether or not anyone passes. No prices are quoted here because none were fetched with a date; fill in the provider's current numbers before deciding whether the attempt is worth the fee.
:::

:::evidence What the evidence says
- {{label:EVIDENCE}} FY22–FY26: experience did not lower the loss rate, {{fact:sebi-loss-2026-five-year-consistent}} of five-year traders profited every year, and most losers kept trading (SEBI, Aug 2026 and Sep 2024).
- {{label:EVIDENCE}} Activity and loss go together in India (FY26 and the FY23 intraday study) and in the US and Taiwanese retail data (Barber and Odean, 2000; Barber, Lee, Liu, Odean and Zhang, 2017).
- {{label:MECHANISM}} Daily loss limits, trade caps, lockouts, no-size-up and halving after a losing week are pre-commitments, not tested parameters.
- {{label:EVIDENCE}} RBI's Alert List names FTMO, FundedNext and Smart Prop Trader among entities not authorised to deal in forex or run forex trading platforms; LRS remittances for margins to overseas exchanges or counterparties are not permitted (RBI, Nov 2025 and the LRS Master Direction).
:::
