---
title: SIP maths and the order of returns
section: Investing: India
summary: What a SIP automates, the annuity-due formula behind it, the two worked cases in the compounding calculator, why contribution timing makes return order matter, what the dated {{fact:inv-sip-monthly-inflow}} flow figure does and does not prove, and rules for stepping up, pausing and moving a near-term goal out of equity.
updated: 2026-11-04
level: beginner
order: 2
topics: [sip, rupee-cost averaging, compounding, annuity due, sequence risk, step-up sip, lumpsum, inflation, goal planning, behavioural investing]
related: [index-funds-india, asset-allocation-and-gold-after-sgb, wrappers-nps-ppf-epf-elss-reits, direct-equity-and-valuation-bands]
tools: [sip-compounding]
sources:
  - AMFI — Monthly Note, Sep 2026 | https://www.amfiindia.com/uploads/AMFI_Monthly_Note_September2026_554f6604b6.pdf | accessed 2026-11-01
  - NSE Indices — Nifty 50 factsheet, Oct 2026 | https://www.niftyindices.com/Factsheet/ind_nifty50.pdf | accessed 2026-11-01
  - SEBI Master Circular for Mutual Funds, Mar 2026 | https://www.sebi.gov.in/sebi_data/attachdocs/mar-2026/1774024028162.pdf | accessed 2026-11-01
  - National Savings Institute — scheme-wise small-savings interest rates | https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=132 | accessed 2026-11-01
---
## What a SIP does, and what it cannot do

A systematic investment plan is a standing instruction to buy fund units at regular intervals. It solves three operational problems: the transfer happens without a monthly decision, a fixed rupee amount buys more units when the NAV is low, and the habit continues while headlines are uncomfortable.

{{label:MECHANISM}} Rupee-cost averaging changes the **entry path**, not the expected return of the asset. A SIP into an expensive index still owns an expensive index. A SIP into a falling index still loses money on the units already bought. Its advantage is behavioural: the investor does not have to identify one perfect entry date and is less likely to leave a lump sum in cash forever.

The money also has a job before it has an asset. Emergency reserves and money needed in the next few years do not belong in an equity SIP merely because monthly investing feels safe. [Asset allocation](../asset-allocation-and-gold-after-sgb/) sets the equity, debt and gold split; the SIP is only the way new cash reaches that split.

## The annuity-due formula

Most SIP calculators treat each contribution as arriving at the **start** of a month. That is an annuity due. With monthly contribution `P`, monthly return `r` and `n` contributions, the future value is:

`FV = P × [((1 + r)^n − 1) ÷ r] × (1 + r)`

The last factor gives every deposit one more month of compounding than an end-of-month annuity. At a zero return the formula reduces to contributions: `P × n`. At a non-zero return, the quoted annual return is divided by twelve for `r`, while `n` is years multiplied by twelve. This convention matches the site’s [SIP and compounding calculator](../../tools/sip-compounding/).

Two cautions matter more than the formula. First, a smooth annual rate is an illustration; markets deliver a jagged sequence. Second, future value is not profit. Every display should put the amount contributed beside the result, and inflation should be shown separately rather than buried in the assumed return.

## The calculator’s two worked cases

:::example Example one — monthly contributions
The calculator’s first worked case contributes ₹10,000 at the start of every month for twenty years and assumes a twelve-per-cent annual return with six-per-cent inflation. Contributions total ₹24,00,000. The nominal future value is ₹99,91,479.19, of which ₹75,91,479.19 is growth; discounted by the inflation assumption, the result is ₹31,15,390.44 in today’s money. The implied real annual growth rate is 5.66 per cent.

None of those assumptions is a prediction. Change the return downward, raise inflation and test a missed contribution year before using the result in a goal plan.
:::

:::example Example two — one lump sum
The second worked case invests ₹5,00,000 once for fifteen years, assumes a ten-per-cent annual return and five-per-cent inflation. It ends at ₹20,88,624.08 nominally and ₹10,04,663.90 in today’s money, a real annual growth rate of 4.76 per cent. The invested amount stays ₹5,00,000; every other rupee is modelled growth.
:::

The two cases answer different questions. A SIP asks what repeated savings may become. A lump sum asks what already-available money may become. Splitting an available lump sum into instalments can reduce regret after a near-term fall, but keeping part of it in cash also lowers market exposure while it waits. That is a comfort trade-off, not a return source.

## Why the order of returns matters

For a portfolio with no cash flow, multiplication is commutative: a gain of thirty per cent, then ten per cent, then a loss of twenty per cent ends at the same place in any order. Contributions break that symmetry because later deposits experience fewer returns and the balance is larger in later years.

:::example Same returns, different order
Invest ₹1,00,000 at the start of each of three years. If annual returns arrive as plus thirty per cent, plus ten per cent and minus twenty per cent, the path is ₹1,30,000; then ₹2,53,000 after the next deposit and return; then ₹2,82,400 after the final deposit and loss.

Reverse the order to minus twenty per cent, plus ten per cent and plus thirty per cent. The path becomes ₹80,000; then ₹1,98,000; then ₹3,87,400. The same three returns and the same ₹3,00,000 of contributions produce outcomes ₹1,05,000 apart because the positive year landed on the largest balance in the second path.
:::

{{label:MECHANISM}} For a saver, bad early returns can help new contributions buy more units, while a bad late return hits the accumulated balance. For a retiree withdrawing money, the danger reverses: an early fall forces sales from a smaller base and can permanently damage the plan. A single CAGR cannot show either path.

## What the current flow number means

{{label:EVIDENCE}} AMFI’s [September 2026 monthly note](https://www.amfiindia.com/uploads/AMFI_Monthly_Note_September2026_554f6604b6.pdf) recorded monthly SIP contributions of {{fact:inv-sip-monthly-inflow}} while the [Nifty 50 factsheet](https://www.niftyindices.com/Factsheet/ind_nifty50.pdf) showed a year-to-date price return of {{fact:inv-nifty50-ytd-price}} at the end of October. The juxtaposition shows that standing contributions can continue through a down year.

It does **not** show that SIP inflows put a floor under the index, cause the next rally or earn a premium. AMFI reports money entering schemes; it does not identify the return each investor earned, when those investors began or whether they later redeemed. Treat the flow as a market fact and the habit as a mechanism.

## Sequencing money by goal

A practical sequence makes the monthly transfer serve the plan instead of replacing it.

1. **Build the cash buffer first.** A forced redemption during a job loss turns temporary volatility into a permanent sale.
2. **Match the horizon.** Near-term bills stay in cash or suitable short-duration debt. Equity is for goals that can tolerate an uncertain path and a delayed date.
3. **Choose the allocation.** Decide the equity/debt/gold split before choosing a scheme. An index-fund SIP is not an asset-allocation plan by itself.
4. **Automate just after income arrives.** This improves cash-flow discipline; the day of the month has no established return edge.
5. **Increase with income.** A step-up SIP raises savings, not expected market return. State the step-up assumption separately in every projection.
6. **De-risk the goal.** As a fixed-date goal approaches, move the amount already needed from equity into the goal’s spending asset in stages. Do not wait for a “better market”.
7. **Rebalance new money first.** Direct the next contributions to whichever asset is below target before selling and creating tax or exit-load friction.

The [index-fund guide](../index-funds-india/) explains how to compare tracking quality once the exposure is chosen. [Wrappers](../wrappers-nps-ppf-epf-elss-reits/) explains when a locked or tax-linked account changes access to the money.

## Rules for stepping up, pausing and stopping

{{label:MECHANISM}} A step-up belongs in the plan when income rises, because the goal is funded by savings plus returns. It is not a reason to increase the return assumption. Run three calculator cases instead: current contribution, planned step-up approximated as a later manual increase, and a stress case with no step-up.

Pause a SIP when cash flow has genuinely changed, the emergency reserve is being rebuilt, or the goal and asset allocation changed. Do not pause solely because the index fell. That locks in the behavioural mistake the SIP was meant to prevent: buying fewer units after prices became lower.

Stop or replace the fund when its benchmark changed, its process no longer matches the chosen exposure, or persistent tracking difference is poor against funds following the same index. Do not switch because another category led the last year. The [SEBI mutual-fund master circular](https://www.sebi.gov.in/sebi_data/attachdocs/mar-2026/1774024028162.pdf) makes tracking disclosures comparable; use them.

:::evidence What the evidence says
- {{label:EVIDENCE}} The monthly flow and the dated Nifty return are published by AMFI and NSE Indices. They show contributions continuing during a down period, not what happens next.
- {{label:MECHANISM}} The annuity-due formula, rupee-cost averaging and sequence risk are arithmetic. Step-ups add savings; they do not add an investing edge.
- {{label:LORE}} A particular SIP date, fund-flow day or market level is “best”: no primary Indian study in this research supports that claim.
:::
