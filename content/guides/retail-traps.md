---
title: Retail traps: tips, averaging, leverage and naked shorts
section: Edges, habits & traps
summary: Seven recurring traps, each labelled by what supports it: Telegram tips, “sure-shot” services, averaging losers, martingale, over-leverage, revenge trades and overnight gap risk in naked shorts. SEBI's loss-study base rate appears beside every item, with the mechanism and the limit of the evidence.
updated: 2026-11-05
level: beginner
order: 4
topics: [telegram tips, social media tips, sure-shot services, averaging losers, disposition effect, martingale, over-leverage, revenge trading, naked short options, gap risk]
related: [what-sebi-loss-studies-say, position-sizing-and-loss-limits, psychology-journaling-prop-firms, buying-vs-selling-options, investing-abroad-from-india, tariff-war-oil-shocks, commentary-ratings-block-deals, governance-red-flags, gap-fill-fade, no-code-platforms-and-python-stack]
tools: [charges, position-size]
sources:
  - SEBI interim order — Stock recommendations through social-media platforms (May 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/may-2026/ORDER_1779429679.pdf | accessed 2026-11-01
  - SEBI — Retail participation, behaviour and profitability in equity derivatives (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf | accessed 2026-11-01
  - SEBI — Profitability of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
  - SEBI — Trading behaviour of individual traders in equity derivatives, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233601328.pdf | accessed 2026-11-01
  - SEBI press release Sep 2024 — Individual F&O losses and transaction costs, FY22–FY24 | https://www.sebi.gov.in/sebi_data/attachdocs/sep-2024/1727086965496.pdf | accessed 2026-11-01
  - Odean — Are investors reluctant to realise their losses?, Journal of Finance (1998), author paper | https://faculty.haas.berkeley.edu/odean/papers%20current%20versions/areinvestorsreluctant.pdf | accessed 2026-11-01
  - Barber and Odean — Trading is hazardous to your wealth, Journal of Finance (2000), author paper | https://faculty.haas.berkeley.edu/odean/papers%20current%20versions/individual_investor_performance_final.pdf | accessed 2026-11-01
  - Grinstead and Snell — Introduction to Probability, gambler's ruin chapter | https://math.dartmouth.edu/~prob/prob/prob.pdf | accessed 2026-11-01
  - NSE — Index close file, election count day Jun 2024 | https://nsearchives.nseindia.com/content/indices/ind_close_all_04062024.csv | accessed 2026-11-01
  - SEBI circular Feb 2020 — Margin framework for cash and derivatives | https://www.sebi.gov.in/sebi_data/attachdocs/feb-2020/1582545012845.pdf | accessed 2026-11-01
  - SEBI circular Sep 2025 — Intraday index-option position limits and expiry-day penalties | https://www.sebi.gov.in/sebi_data/attachdocs/sep-2025/1756745625835.pdf | accessed 2026-11-01
  - RBI — Alert List of unauthorised forex entities and platforms | https://rbi.org.in/scripts/bs_viewcontent.aspx?Id=4235 | accessed 2026-11-01
---
## Tips and paid certainty

### Telegram and social-media tips

{{label:EVIDENCE}} SEBI's [May 2026 interim order](https://www.sebi.gov.in/sebi_data/attachdocs/may-2026/ORDER_1779429679.pdf) describes a prima facie scheme across 82 low-liquidity scrips between December 2023 and January 2026. The operators built positions, circulated recommendations through accounts with about 13,600 and 40,500 followers, then sold into the resulting rise; SEBI calculated prima facie wrongful gains of ₹20.25 crore. The finding is an interim order, so the allegations had not reached a final adjudication when researched.

The mechanism is the conflict of interest. The sender chooses the stock, timing and audience after taking a position. Followers supply the exit liquidity, and the sender's sale is invisible until later disclosures, if it appears at all. A screenshot of an earlier winner proves only that one message existed, not that subscribers received, entered and exited it at the shown price.

The relevant base rate is not the channel's selected screenshot. SEBI's FY26 study found {{fact:sebi-loss-2026-share}} of individual equity-derivatives traders lost money and aggregate net losses of {{fact:sebi-loss-2026-amount}} ([study](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). Read the full base rate in [What SEBI's loss studies say](../../guides/what-sebi-loss-studies-say/).

**What the evidence does not say.** One order shows that some social-media recommendations formed part of an alleged manipulation. It does not establish that every channel is manipulative, or that fading every tip is profitable.

### “Sure-shot” services

{{label:EVIDENCE}} A service selling a “sure-shot” call removes uncertainty in words while leaving it in the payoff. SEBI's [FY22–FY24 release](https://www.sebi.gov.in/sebi_data/attachdocs/sep-2024/1727086965496.pdf) found individual F&O traders paid about ₹50,000 crore in transaction costs over those years, roughly ₹26,000 per person in FY24, and only one per cent earned more than ₹1 lakh after costs. In FY26, costs were {{fact:sebi-costs-share}} of loss-makers' gross losses. More calls create more brokerage, tax, spread and slippage even when gross selections break even.

The mechanism is selection and missing denominators. A seller can advertise the best call, delete the failed one, show a theoretical entry that subscribers could not fill and quote gross points without position size or costs. A service should be judged by a complete, time-stamped record reconciled with contract notes, not testimonials. India's rules on paid research and unregistered advice are summarised on the [About and disclaimer page](../../about/).

The RBI's [Alert List](https://rbi.org.in/scripts/bs_viewcontent.aspx?Id=4235) is a separate check when a tip or funded-account service also offers unauthorised forex dealing or a forex platform. RBI says the list is not exhaustive and absence is not authorisation; it is not a blacklist of Indian equity educators.

**What the evidence does not say.** The SEBI cost study covers the whole individual F&O population, not subscribers to one service. It establishes the hurdle that frequent calls must clear, not that every paid course or research service fails.

## Averaging and doubling

### Averaging a losing option

{{label:EVIDENCE}} Odean's [study of ten thousand US brokerage accounts](https://faculty.haas.berkeley.edu/odean/papers%20current%20versions/areinvestorsreluctant.pdf) documented the disposition effect: investors realised winners more readily than losers, and later performance did not vindicate the losers they held. SEBI's [FY26 behaviour study](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf) provides the Indian base rate: about nine in ten two-year losers who continued lost again, and for 79 per cent of traders with mixed quarters the average gain was smaller than the average loss. Across the full FY26 sample, {{fact:sebi-loss-2026-share}} lost.

The mechanism is that a lower average entry feels like progress while total exposure rises. Nothing about buying the second lot changes the first trade's probability; it merely doubles delta and premium at risk after evidence has moved against the position.

:::example Average price, doubled risk
An illustrative 25,000 call is bought at ₹166 and bought again at ₹83. The average is ₹124.50, but cash at risk is (₹166 + ₹83) × {{fact:fo-nifty-lot}} = ₹16,185 across two lots. At expiry the index must be near 25,125 merely to cover the average premium before costs. The lower displayed average did not repair the thesis; it increased the amount that can expire at zero.
:::

**What the evidence does not say.** The disposition study covers US shares, and SEBI reports persistence rather than tagging “averaging” orders. Averaging into a planned long-term allocation is a different act from adding to a leveraged intraday loser.

### Martingale after a loss

{{label:MECHANISM}} Martingale doubles risk after every loss so one eventual win recovers the sequence and earns the original stake. [Gambler's ruin](https://math.dartmouth.edu/~prob/prob/prob.pdf) supplies the mechanism: finite capital, position limits and any negative edge end the sequence before an unlimited run of bets can rescue it. Brokerage and slippage make an otherwise even game negative.

:::example Six losses are not remote
Start at ₹5,000 of risk and double after each loss. With win probability 0.45, six straight losses have probability 0.55⁶ ≈ 2.8 per cent, about one such run in thirty-six independent sequences. Those six trades lose ₹5,000 + ₹10,000 + ₹20,000 + ₹40,000 + ₹80,000 + ₹1,60,000 = ₹3,15,000. The next trade requires ₹3,20,000, sixty-four times the starting risk, to recover the sequence and make ₹5,000.
:::

SEBI's warning is the population base rate: {{fact:sebi-loss-2026-share}} lost in FY26, while only {{fact:sebi-loss-2026-five-year-consistent}} of traders active for all five years profited in every year ([behaviour study](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233601328.pdf)). A doubling scheme increases exposure precisely when that base rate says another loss is ordinary.

**What the evidence does not say.** The probability example assumes independent trades with a fixed win rate. Real losses can cluster, which makes it optimistic, but the example is not a measured Nifty strategy result.

## Size and state of mind

### Over-leverage

{{label:EVIDENCE}} SEBI's [FY26 findings](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf) report that roughly 35 per cent of individual derivatives traders held no equities and about 78 per cent had portfolios below ₹1 lakh. The sub-₹1-lakh group produced about 70 per cent of losses. Trading days, turnover and turnover relative to capital were among the strongest correlates of loss. The overall loss share was {{fact:sebi-loss-2026-share}}, with an average net loss of {{fact:sebi-loss-2026-avg}}.

The mechanism is exposure relative to resources. Margin answers how much the broker will let an account control; it does not cap a gap loss. Frequent small trades add a certain cost to uncertain gross returns. Ten round trips mean twenty orders, so brokerage alone at {{fact:chg-brokerage-example-options}} is ₹400 before STT, exchange charges, GST, spread or slippage. The [charges calculator](../../tools/charges/) prices the whole line and the [position-size calculator](../../tools/position-size/) starts from loss at the stop.

The rule correction matters here. Buyers have paid the full premium upfront since {{fact:opt-upfront-premium-since}}. SEBI's [September 2025 circular](https://www.sebi.gov.in/sebi_data/attachdocs/sep-2025/1756745625835.pdf) introduced separate intraday index-option limits from {{date:2025-10-01}} and penalties for expiry-day breaches from {{date:2025-12-06}}. The old statement that intraday breaches were never penalised is no longer true. The leverage trap now sits chiefly in oversized short-option and notional exposure, not broker funding of a buyer's premium.

**What the evidence does not say.** Portfolio size and trading intensity are correlations, not proof that leverage alone caused every loss. They do show that more activity and more capital at risk did not cure the base rate.

### Revenge trades

{{label:MECHANISM}} Revenge trading is an unplanned order placed to erase a fresh loss. The loss changes the objective from following a tested rule to restoring an account number; size rises, filters loosen and the next stop becomes negotiable. No Indian study in the research pack tags an order as “revenge”, so the label is mechanism rather than evidence.

The surrounding evidence is still strong. SEBI found roughly 85 per cent of trader-quarters were losses and about nine in ten continuing two-year losers lost again ([August 2026 behaviour study](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf)). Barber and Odean's [US household study](https://faculty.haas.berkeley.edu/odean/papers%20current%20versions/individual_investor_performance_final.pdf) found the most active traders earned 11.4 per cent a year against 17.9 per cent for the market and linked excessive trading to overconfidence. The Indian FY26 base rate remains {{fact:sebi-loss-2026-share}}.

The control is a pre-commitment: a daily loss limit, a cooling-off interval and no increase in rupee risk after a stop. [Psychology, journaling and prop firms](../../guides/psychology-journaling-prop-firms/) provides the journal and rule set. A feeling cannot be audited; a new order inside the lockout can.

**What the evidence does not say.** Loss persistence and trading intensity do not identify which orders were emotional. The controls reduce the opportunity to revenge-trade; they do not prove a profitable strategy underneath.

## Overnight gap risk in a naked short

{{label:EVIDENCE}} NSE's [index file for {{date:2024-06-04}}](https://nsearchives.nseindia.com/content/indices/ind_close_all_04062024.csv) records Nifty opening below the prior close, falling to 21,281.45 and closing down 5.93 per cent; the intraday low was 8.5 per cent below that prior close. The preceding session had risen 3.25 per cent while India VIX fell 14.9 per cent. An overnight short option had no stop between those closes.

{{label:MECHANISM}} SPAN is a deposit calibrated to scenarios, not a maximum loss. SEBI's [margin framework](https://www.sebi.gov.in/sebi_data/attachdocs/feb-2020/1582545012845.pdf) sets the index price-scan range at six standard deviations scaled by √2 with a {{fact:fo-span-price-scan-floor}} floor; base ELM adds {{fact:fo-elm-index-base}} of notional, with further expiry and deep-out-of-the-money additions. A move can consume the margin while the short remains open-ended. That mechanism is why a long wing changes the loss shape, as [Buying versus selling options](../../guides/buying-vs-selling-options/) explains.

:::example Premium collected versus gap liability
An illustrative 23,000 put sold before the count for ₹60 collects ₹60 × {{fact:fo-nifty-lot}} = ₹3,900. At the 21,281 low, intrinsic value is about ₹1,719 a unit, or ₹1,11,735 per lot — almost twenty-nine times the premium collected. Net of that premium the mark is about ₹1,07,835 against the seller, before volatility and execution. The {{fact:fo-span-price-scan-floor}} scan plus {{fact:fo-elm-index-base}} base ELM on the ₹14,95,000 notional is roughly ₹1,69,000; most of that buffer can disappear in one session.
:::

The base rate still belongs beside the dramatic day: {{fact:sebi-loss-2026-share}} of individual derivatives traders lost in FY26 and options caused most aggregate losses ([SEBI](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf)). Defined risk does not create an edge, but it prevents one gap from becoming an unlimited claim on the account.

**What the evidence does not say.** The count day is one extreme observation, not the frequency of such gaps. The margin formula is a clearing safeguard, not a forecast that the next move will fit inside it.

## The common test

For every tip, add, doubling step, larger lot or overnight short, write four lines before the order: the evidence label, the mechanism, the maximum loss and the evidence's limit. If any line is blank, the position is relying on a story rather than a controlled risk.
