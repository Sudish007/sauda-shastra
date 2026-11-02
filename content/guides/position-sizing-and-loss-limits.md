---
title: Position sizing and loss limits
section: Risk, psychology & tax
summary: The one-per-cent rule as a formula; sizing shares, Nifty futures lots (one lot is {{fact:fo-nifty-lot}} units) and options by the loss at the stop rather than by the margin available; why a short option's margin is not its risk; daily, weekly and monthly loss limits as pre-commitments; and what SEBI's FY26 data says about capital and the chance of losing.
updated: 2026-11-01
level: intermediate
order: 3
topics: [position sizing, one per cent rule, risk per trade, lot size, premium at risk, notional, margin, daily loss limit, drawdown, peak margin, upfront premium]
related: [expectancy-and-drawdown-maths, what-sebi-loss-studies-say, psychology-journaling-prop-firms, intraday-leverage-today, buying-vs-selling-options, spreads-and-delta-neutral, what-a-trade-costs, policy-days-vix-and-sizing, execution-realities-and-architecture]
tools: [position-size]
sources:
  - Zerodha Varsity — Position sizing for the active trader (Module 9) | https://zerodha.com/varsity/chapter/position-sizing/ | accessed 2026-11-01
  - Zerodha Varsity — Trading biases (Module 9) | https://zerodha.com/varsity/chapter/trading-biases/ | accessed 2026-11-01
  - SEBI — Trading behaviour of individual traders in the equity derivatives segment, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233601328.pdf | accessed 2026-11-01
  - SEBI — Master circular for stock brokers (Jun 2025), paras 40–41 on upfront and peak margin | https://www.sebi.gov.in/sebi_data/attachdocs/jun-2025/1750158789381.pdf | accessed 2026-11-01
  - SEBI circular Oct 2024 (2024/132) — Measures to strengthen the equity index derivatives framework (upfront premium, lot sizes) | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf | accessed 2026-11-01
  - NSE circular FAOP/70616 (Dec 2025) — Revision in market lot of index derivatives contracts | https://nsearchives.nseindia.com/content/circulars/FAOP70616.pdf | accessed 2026-11-01
---
## The rule and the formula

{{label:MECHANISM}} Fixed-fractional sizing risks the same share of equity on every trade. One per cent is the common conservative convention and two per cent the upper bound most authors will defend; above that, the streak arithmetic in [Expectancy and drawdown maths](../expectancy-and-drawdown-maths/) starts to bite. The size of the position falls out of two numbers — the rupees you are willing to lose and the rupees you lose per unit if the stop is hit:

> risk ₹ = equity × risk fraction
> units = risk ₹ ÷ |entry − stop| (per unit), rounded **down**

Every example below uses an account of ₹6,00,000 and a one-per-cent risk budget of ₹6,000. Varsity's [position-sizing chapters](https://zerodha.com/varsity/chapter/position-sizing/) use the same construction, and the [position-size calculator](../../tools/position-size/) does it live, with the lot sizes read from the [verified facts register](../../facts/).

:::example Equity intraday
A stock at ₹1,000 with the stop at ₹988: the loss per share is ₹12, so the size is ₹6,000 ÷ ₹12 = **500 shares**, a notional of ₹5,00,000. With the cash-segment rule that at least {{fact:sebi-upfront-margin-waiver-threshold}} of the trade value is collected upfront, about ₹1,00,000 of margin controls that position — but the margin is not what you can lose. A stop ₹12 away is the planned loss; a gap through it is not.
:::

The stop comes first and the size second. A trader who picks "two lots" and then looks for a stop that fits has inverted the formula, and the stop ends up wherever the arithmetic needs it rather than where the trade is wrong.

## Futures and options: size the loss, not the margin

{{label:MECHANISM}} For a futures contract the loss per lot is the stop distance in points times the lot size, so the lot count is risk ₹ ÷ (points × lot).

:::example Nifty futures with a twenty-five-point stop
One Nifty lot is {{fact:fo-nifty-lot}} units, so a stop twenty-five points away risks ₹1,625 per lot (the stop distance × {{fact:fo-nifty-lot}} units). ₹6,000 ÷ ₹1,625 = 3.69, rounded down to **three lots**, with ₹4,875 at risk — a little under the budget, as rounding down ensures. Four lots would risk ₹6,500 and break the rule by ₹500. The margin on three lots is a multiple of the risk; it is the exchange's deposit, not your loss.
:::

A bought option is the one instrument whose maximum loss is known exactly: the premium paid. So size a long option on **premium at risk**, never on the notional it controls.

:::example A bought option
A Nifty option at ₹120 costs ₹120 × {{fact:fo-nifty-lot}} = ₹7,800 per lot, and that whole amount is the maximum loss if it expires worthless. ₹7,800 is above the ₹6,000 budget, so the honest choices are two: one lot with a premium stop at ₹60 (a loss of ₹60 × {{fact:fo-nifty-lot}} = ₹3,900 if hit, inside the budget — but only if the stop is actually taken, which on expiry day it often is not), or the conclusion that this contract is too large for a ₹6,00,000 account at one per cent, and that a cheaper strike or a spread is the trade. Two lots, at ₹15,600 of premium, would be 2.6 per cent of the account at risk before any stop.
:::

A sold option is the opposite case: the margin is large and the risk is open-ended, so the margin tells you nothing about the loss. Size a short option on a **stress loss** — what the position loses on a move of two or three times the straddle-implied range — or convert it into a defined-risk spread whose worst case is the width minus the credit.

:::example A sold option
Selling one lot of a Nifty option might require ₹1,00,000 or more of margin. On a day that moves twice the expected range the option's premium can rise by ₹300, which on {{fact:fo-nifty-lot}} units is ₹19,500 per lot — 3.25 per cent of the ₹6,00,000 account, from a single naked lot. The one-per-cent rule is already broken before the trade is placed. A spread with a wing bought a hundred points away caps the loss at (100 − credit) × {{fact:fo-nifty-lot}}, which can be sized to the budget. [Buying versus selling options](../buying-vs-selling-options/) and [Spreads and delta-neutral structures](../spreads-and-delta-neutral/) work through the structures; the margin mechanics are in [Intraday leverage today](../intraday-leverage-today/).
:::

Since {{fact:opt-upfront-premium-since}} the full option premium has been collected from buyers upfront, so the "premium at risk" is also the cash that leaves the account at entry — the sizing figure and the margin figure coincide for a buyer, and for nobody else.

## Capital and the chance of losing

{{label:EVIDENCE}} SEBI's [behaviour study](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233601328.pdf) for FY25–FY26 splits traders by the peak margin they used. 77 per cent used under ₹1 lakh of margin; they generated eight per cent of turnover and 14 per cent of losses. The other 23 per cent generated 92 per cent of turnover and 86 per cent of losses. The incidence of loss fell with capital — about 90 per cent of traders using under ₹1 lakh lost, against 67.6 per cent of those using between ten lakh rupees and one crore — but the average loss per loss-maker rose from about ₹5,600 to ₹9.6 lakh. More capital did not buy an edge; it bought a bigger loss.

Two things follow for sizing. A small account is not protected by being small: a single Nifty lot is a large position for a ₹1 lakh account, and the data shows that group losing most often. And a larger account is not protected by its size either, because the trader with more capital tends to trade more notional, not the same notional at a lower fraction. The fraction, not the balance, is the control.

## Loss limits as pre-commitment

{{label:MECHANISM}} Per-trade sizing does not stop the sequence that does the real damage: a loss, a bigger trade to win it back, a bigger loss. Loss limits are rules written before the session that end it. They are practitioner conventions rather than tested parameters — Varsity's [trading-biases chapters](https://zerodha.com/varsity/chapter/trading-biases/) describe the biases they guard against — and their value is that the decision to stop is made while calm.

:::example A limit ladder for the ₹6,00,000 account
- **Day: −2R, which is −₹12,000 (two per cent).** Two full losses in a day and the terminal is closed. The second loss is also the natural point at which the urge to size up appears.
- **Week: −₹30,000 (five per cent).** Size is halved for the following week — risk ₹3,000 per trade — and the journal is reviewed before the next Monday.
- **Month: −₹48,000 (eight per cent).** Live trading stops; the month is replayed on paper, and the method is re-tested before capital returns. From the drawdown table, an eight-per-cent hole needs 8.7 per cent to recover — still arithmetic. A 25 per cent hole would need a third.
:::

Size also resets *after* a drawdown, not only at the limits: the one-per-cent budget is one per cent of the current equity, so after a losing week the rupee risk per trade falls automatically. Reverting to the old rupee size "to recover faster" is the mistake the limits exist to prevent.

## Never size on the margin available

{{label:MECHANISM}} The margin shown as "available" is the broker's and the clearing corporation's number, not a risk figure. In the cash segment the upfront margin is {{fact:sebi-upfront-margin-rule}}, with the short-collection penalty waived when at least {{fact:sebi-upfront-margin-waiver-threshold}} of the trade value is collected — the regulatory basis of the roughly five-times intraday leverage brokers offer on stocks. In derivatives, SPAN plus ELM is collected upfront and checked at random peak-margin snapshots during the day. None of these rules caps your loss; they cap the broker's exposure to you. [Intraday leverage today](../intraday-leverage-today/) sets out what the margins are and how the broker's risk desk squares off a position that breaches them.

The check is simple. If the position you want "fits in the margin" but the loss at the stop is larger than your risk budget, the position is too large. If the loss at the stop fits the budget but the margin does not, the account is too small for that instrument, and the answer is a smaller contract or a different one, not a wider stop.

## Why one per cent, in one line

[Expectancy and drawdown maths](../expectancy-and-drawdown-maths/) shows that even a method with a win rate of 0.45 and winners 1.8 times its losers has a Kelly fraction of about 14 per cent and a half-Kelly of about seven. One per cent is far below both, deliberately: it absorbs the error in estimating the win rate, survives the five- and ten-trade losing streaks the win rate predicts, and keeps the drawdown in the region where recovery is a small percentage rather than a doubling. The [position-size calculator](../../tools/position-size/) accepts any risk fraction; the argument for keeping the default is the whole of this page.

:::evidence What the evidence says
- {{label:MECHANISM}} Fixed-fractional sizing, premium-at-risk for bought options, stress-loss sizing for sold options and loss-limit ladders are mechanisms: arithmetic and pre-commitment, not measured edges.
- {{label:EVIDENCE}} FY25–FY26: traders using more peak margin lost less often but lost far more per loss-maker (about ₹5,600 under ₹1 lakh of margin against ₹9.6 lakh between ten lakh and one crore), and 23 per cent of traders made 86 per cent of the losses (SEBI, Aug 2026).
- {{label:MECHANISM}} Upfront and peak margins ({{fact:sebi-upfront-margin-rule}} in cash; SPAN plus ELM in derivatives) cap the broker's exposure, not the trader's loss.
:::
