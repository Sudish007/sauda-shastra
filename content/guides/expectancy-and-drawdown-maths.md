---
title: Expectancy and drawdown maths
section: Risk, psychology & tax
summary: Expectancy and R-multiples, the break-even win rate for any reward-to-risk ratio, why a high win rate can still lose money, what costs do inside the formula, how much a drawdown needs to recover, how long losing streaks really get, and why the Kelly fraction is a ceiling rather than a target — six worked examples in rupees.
updated: 2026-11-01
level: beginner
order: 2
topics: [expectancy, r-multiple, win rate, reward to risk, break-even, drawdown, losing streak, kelly criterion, transaction costs]
related: [what-sebi-loss-studies-say, position-sizing-and-loss-limits, psychology-journaling-prop-firms, what-a-trade-costs, strategy-families-and-backtest-hygiene]
tools: [expectancy-kelly]
sources:
  - Zerodha Varsity — Position sizing for the active trader (Module 9) | https://zerodha.com/varsity/chapter/position-sizing/ | accessed 2026-11-01
  - Zerodha Varsity — Kelly's criterion (Module 9) | https://zerodha.com/varsity/chapter/kellys-criterion/ | accessed 2026-11-01
  - Kelly, J. L. — A new interpretation of information rate, Bell System Technical Journal (1956) | https://doi.org/10.1002/j.1538-7305.1956.tb03809.x | accessed 2026-11-01
  - SEBI — Trading behaviour of individual traders in the equity derivatives segment, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233601328.pdf | accessed 2026-11-01
  - SEBI — Profitability of individual traders in the equity derivatives segment, FY25–FY26 (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf | accessed 2026-11-01
  - SEBI — Analysis of intraday trading by individuals in the equity cash segment (Jul 2024) | https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1721818140715.pdf | accessed 2026-11-01
---
## Expectancy: the number a method is worth per trade

{{label:MECHANISM}} A trading method is a bet repeated many times, and the only number that says whether it is worth repeating is its expectancy — the average result per trade, after costs:

> expectancy = p × average win − (1 − p) × average loss

where p is the win rate as a decimal. It is easier to carry around in **R-multiples**: call the rupees you planned to lose at the stop 1R, and measure every result as a multiple of it. A trade that risked ₹2,000 and made ₹6,000 is +3R; one that lost the planned amount is −1R; one that lost more because the stop was skipped is −1.5R. In R terms the formula becomes p × RR − (1 − p), where RR is the average winner in R, and the answer is "R per trade". Varsity's [position-sizing chapters](https://zerodha.com/varsity/chapter/position-sizing/) walk through the same arithmetic.

Expectancy is viable only if it is positive *after* costs, and it is only an estimate: the p and the RR you compute from your last fifty trades are samples, not constants.

:::example Three expectancies
1. **A method with a modest win rate.** p = 0.40, average win ₹6,000, average loss ₹3,000: 0.40 × 6,000 − 0.60 × 3,000 = ₹2,400 − ₹1,800 = **₹600 per trade**, or +0.2R on a ₹3,000 risk. Two hundred such trades a year are worth ₹1,20,000 before costs.
2. **A method that wins most of the time and still loses.** p = 0.70, average win ₹1,000, average loss ₹3,000: 0.70 × 1,000 − 0.30 × 3,000 = ₹700 − ₹900 = **−₹200 per trade**. Seven winners in ten, and the account shrinks.
3. **Reading a small sample in R.** Planned risk ₹2,000 a trade; results +₹4,000, −₹2,000, +₹6,000, −₹2,000, −₹2,000. In R: +2, −1, +3, −1, −1, a sum of +2R over five trades, so **+0.4R per trade** = ₹800 per trade at that risk. Two winners out of five, and the method is positive — the size of the winners carried it.
:::

The [expectancy calculator](../../tools/expectancy-kelly/) takes a win rate, an average win and loss in R, a rupee value per R and a trade count, and returns the expectancy, the payoff ratio, the Kelly fraction and the expected rupees.

## Break-even win rate

{{label:MECHANISM}} Setting expectancy to zero gives the win rate a method needs just to stay flat for a given reward-to-risk ratio: break-even p = 1 ÷ (1 + RR). The table is worth memorising because it shows that "win rate" on its own is meaningless.

| Average winner, in R | Break-even win rate | Reads as |
|---|---|---|
| 0.5R | 66.7 per cent | two winners for every loser, just to break even |
| 1R | 50 per cent | a coin toss before costs |
| 2R | 33.3 per cent | one winner in three keeps you flat |
| 3R | 25 per cent | one in four |

Example 2 above sits at 0.33R and would need a win rate above 75 per cent to break even before costs. Many intraday habits — taking a small profit quickly, letting the loser "come back" — push a method towards the top row without the trader noticing.

{{label:EVIDENCE}} SEBI's [behaviour study](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233601328.pdf) of FY25–FY26 shows the crowd on the wrong side of this table: only 15 per cent of trader-quarters were profitable, and the median losing quarter (−₹10,525) was about 2.4 times the size of the median winning quarter (+₹4,366). A typical quarter is a small win or a larger loss — the shape of a high-win-rate, low-RR method.

## Costs sit inside the formula

Every trade pays brokerage, STT, exchange charges, the SEBI fee, stamp duty and GST, and they are charged whether the trade wins or loses. In expectancy terms a round-trip cost c lowers the average win and raises the average loss by the same amount, so the formula becomes p × (win − c) − (1 − p) × (loss + c) = expectancy − c.

:::example Example 1 after costs
With a round-trip cost of ₹150 on each trade in example 1, the expectancy falls from ₹600 to **₹450 per trade**, and the year's two hundred trades are worth ₹90,000 instead of ₹1,20,000 — a quarter of the edge gone to a line that was known before the first order. On a Nifty futures lot the cost line is several hundred rupees after the {{date:2026-04-01}} STT increase; [What a trade costs](../what-a-trade-costs/) has the worked examples, and the [charges calculator](../../tools/charges/) prices your own.
:::

{{label:EVIDENCE}} The studies measure the same effect on the whole crowd. In FY26 costs were {{fact:sebi-costs-share}} of loss-makers' gross losses and turned 4.4 lakh gross-profitable traders into net losers ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf)). In the equity cash intraday study, costs added 57 per cent to loss-makers' losses and took 19 per cent of profit-makers' profits ([SEBI, Jul 2024](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2024/1721818140715.pdf)). The more often a method trades, the larger c is relative to its edge, which is why frequency is the first thing to question when expectancy is thin.

## Drawdown arithmetic

{{label:MECHANISM}} Losses and gains are not symmetric in percentage terms. A fall of d (as a fraction of the peak) needs a gain of d ÷ (1 − d) to get back to the peak, and the required gain grows much faster than the fall.

| Drawdown from the peak | Gain needed to recover |
|---|---|
| ten per cent | 11.1 per cent |
| twenty per cent | a quarter |
| a third | a half |
| a half | double |
| three-quarters | four times |

:::example A drawdown in rupees
An account of ₹6,00,000 falls twenty per cent to ₹4,80,000. Getting back to ₹6,00,000 needs ₹1,20,000 of profit on ₹4,80,000 — a quarter. If the same account had fallen by half, to ₹3,00,000, it would need to double. The practical rule follows: cut size as the drawdown deepens, so that the hole stays in the region where recovery is arithmetic rather than heroic. [Position sizing and loss limits](../position-sizing-and-loss-limits/) turns that into weekly and monthly rules.
:::

## Losing streaks are normal

{{label:MECHANISM}} If trades are independent, the probability of k consecutive losses starting from any given trade is (1 − p)^k. At p = 0.40 the chance of five losses in a row from a given trade is 0.6⁵ ≈ 7.8 per cent — and across two hundred trades a year you should expect about six separate runs of five or more. Streaks like that are not evidence that the method has broken; they are what the method's own numbers predict.

:::example The same streak at two sizes
Five straight losses at one per cent of equity per trade cost about five per cent of the account (1 − 0.99⁵ ≈ 4.9 per cent). The same five losses at five per cent per trade cost about 23 per cent (1 − 0.95⁵ ≈ 22.6 per cent) — from which, by the table above, the account needs a gain of about 29 per cent just to recover. The method is identical in both cases; only the size differs, and only the second trader is in trouble.
:::

Sizing has to be chosen for the streaks the win rate implies, not for the average trade. A quick check: the longest losing run you should plan for over N trades is roughly log(N) ÷ log(1 ÷ (1 − p)); at p = 0.40 and N = 200 that is about ten in a row.

## Kelly is a ceiling, not a target

{{label:MECHANISM}} [Kelly (1956)](https://doi.org/10.1002/j.1538-7305.1956.tb03809.x) showed that for a repeated bet with win probability p and payoff ratio b (average win ÷ average loss), the fraction of capital that maximises long-run growth is

> f* = p − (1 − p) ÷ b

Any larger fraction grows capital more slowly in the long run and, past twice Kelly, destroys it. Two things make the formula a ceiling rather than an instruction. First, p and b are estimates from a sample and the formula is very sensitive to them — a method that looks like p = 0.45 over fifty trades may be p = 0.40 over five hundred. Second, full-Kelly betting accepts drawdowns most people cannot sit through: a fall of half the account is routine. Practitioners therefore use a fraction of Kelly, commonly half, as Varsity's [Kelly's criterion chapter](https://zerodha.com/varsity/chapter/kellys-criterion/) describes.

:::example Kelly for a decent method
p = 0.45 and b = 1.8: f* = 0.45 − 0.55 ÷ 1.8 = 0.45 − 0.306 ≈ **14.4 per cent** of capital per trade; half-Kelly is about 7.2 per cent. Both are far above the one to two per cent that disciplined traders actually risk — which is the point. The one-per-cent convention is not timid; it is a margin of safety against the error in p and b and against the streaks in the previous section.
:::

For example 2 the formula gives a negative f*: the method has no edge, and the only correct size is zero. The [calculator](../../tools/expectancy-kelly/) shows the Kelly and half-Kelly fractions beside the expectancy and warns when there is no edge.

## Putting the five together

- Compute expectancy in R from a journal, not from memory — [Psychology, journaling and prop firms](../psychology-journaling-prop-firms/) has the template.
- Check the win rate against the break-even row for your average winner; a method near its break-even row is a cost-paying machine.
- Subtract the real cost per round trip before calling the number positive.
- Size for the streaks the win rate predicts, so the drawdown stays where recovery is arithmetic.
- Treat Kelly as the upper bound and stay well below it.

:::evidence What the evidence says
- {{label:MECHANISM}} Expectancy, break-even win rate, drawdown recovery, streak probability and the Kelly fraction are arithmetic identities; they hold for any method whose trades are roughly independent.
- {{label:EVIDENCE}} FY25–FY26: only 15 per cent of trader-quarters were profitable and the median losing quarter was about 2.4 times the median winning one (SEBI, Aug 2026).
- {{label:EVIDENCE}} Costs were {{fact:sebi-costs-share}} of loss-makers' gross losses in FY26 (SEBI, Aug 2026) and added 57 per cent to intraday equity loss-makers' losses in FY23 (SEBI, Jul 2024).
:::
