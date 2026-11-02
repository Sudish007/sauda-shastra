---
title: What a trade costs
section: Foundations
summary: Brokerage, STT, the exchange levy, SEBI fee, stamp duty, GST and the DP charge — who pays which side, what the {{date:2026-04-01}} STT increase did to F&O, and five worked examples with the current rates: equity intraday, delivery, Nifty futures, a Nifty option and an option left to expire.
updated: 2026-11-01
level: beginner
order: 6
topics: [brokerage, stt, transaction charges, sebi fee, stamp duty, gst, dp charge, contract note, break-even]
related: [intraday-leverage-today, order-types-and-products, index-derivatives-specs, tax-for-traders-it-act-2025, expectancy-and-drawdown-maths, broker-apis-compared, strategy-families-and-backtest-hygiene]
tools: [charges]
sources:
  - Finance Act 2026, s. 159 — Securities transaction tax rates from Apr 2026 | https://www.incometaxindia.gov.in/finance-acts | accessed 2026-11-01
  - NSE — SEBI turnover fees, STT and other levies (rates with effect from Apr 2026) | https://www.nseindia.com/invest/first-time-investor-sebi-turnover-fees-stt-other-levies | accessed 2026-11-01
  - NSE circular FA/73061 (Feb 2026) — Revision in transaction charges from Mar 2026 | https://nsearchives.nseindia.com/content/circulars/FA73061.pdf | accessed 2026-11-01
  - Zerodha — Charges (broker example: brokerage, DP charge) | https://zerodha.com/charges/ | accessed 2026-11-01
  - Finance Bill 2026, clause 143 (locator for the enacted s. 159) | https://www.indiabudget.gov.in/doc/Finance_Bill.pdf | accessed 2026-11-01
---
## The stack, in the order your contract note lists it

Every executed order picks up the same seven lines, and only two of them go to the broker. The rest are statutory or exchange levies that no discount can remove, which is why "zero brokerage" trades still cost money. This is the order they appear on a contract note, who pays, and what each is calculated on.

| Line | Calculated on | Who pays |
|---|---|---|
| Brokerage | Per executed order, per the broker's plan | Buyer and seller |
| Securities transaction tax (STT) | Trade value (premium for options) | Depends on the segment — see below |
| Exchange levy, including the IPFT contribution | Trade value (premium for options) | Buyer and seller |
| SEBI turnover fee | Trade value | Buyer and seller |
| Stamp duty | Trade value (premium for options) | Buyer only |
| GST | Brokerage + exchange levy + SEBI fee | Whoever paid those three |
| DP charge | Per stock sold from demat, per day | Seller, delivery only |

The rates are facts that change by Finance Act and by exchange circular, so every figure below is rendered from the site's [verified facts register](../../facts/) with the date it was last checked. The [charges calculator](../../tools/charges/) applies the same rates to any trade you type in.

### Current rates by segment

| Charge | Equity intraday | Equity delivery | Index futures | Index options |
|---|---|---|---|---|
| STT | {{fact:chg-stt-equity-intraday}} of sell value | {{fact:chg-stt-equity-delivery}} of buy value and again of sell value | {{fact:chg-stt-futures}} of sell value | {{fact:chg-stt-options-sell}} of premium sold |
| NSE levy | {{fact:chg-nse-txn-equity}} of value, buy and sell | {{fact:chg-nse-txn-equity}} of value, buy and sell | {{fact:chg-nse-txn-futures}} of value, buy and sell | {{fact:chg-nse-txn-options}} of premium, buy and sell |
| SEBI fee | {{fact:chg-sebi-fee}} of value, buy and sell | same | same | same |
| Stamp duty (buy only) | {{fact:chg-stamp-intraday}} | {{fact:chg-stamp-delivery}} | {{fact:chg-stamp-futures}} | {{fact:chg-stamp-options}} of premium |
| GST | {{fact:chg-gst-rate}} of brokerage + NSE levy + SEBI fee | same | same | same |
| Brokerage (broker example) | {{fact:chg-brokerage-example-intraday-futures}} | {{fact:chg-brokerage-example-delivery}} | {{fact:chg-brokerage-example-intraday-futures}} | {{fact:chg-brokerage-example-options}} |
| DP charge (broker example) | — | {{fact:chg-dp-example-broker}} per stock per day | — | — |

Three notes on the table. NSE's levy is quoted per ₹1 crore of turnover and already includes its Investor Protection Fund contribution of {{fact:chg-ipft-nse}}, per NSE's [circular FA/73061](https://nsearchives.nseindia.com/content/circulars/FA73061.pdf). The brokerage and DP figures are one broker's published plan ([Zerodha's charges page](https://zerodha.com/charges/)) and are labelled as an example throughout — substitute your own. BSE charges are not in the register: take them from your broker's contract note.

## What changed in 2026

Two changes this year moved the numbers, both recorded on the [What changed](../../changelog/) page.

- **STT went up on {{date:2026-04-01}}.** Section 159 of the Finance Act 2026 raised the derivatives rates: futures from 0.02% to {{fact:chg-stt-futures}} of sell value, options sold by half again to {{fact:chg-stt-options-sell}} of premium, and options exercised from 0.125% to {{fact:chg-stt-options-exercise}} of the intrinsic value, paid by the buyer. Equity delivery and intraday STT did not change. NSE's [levies page](https://www.nseindia.com/invest/first-time-investor-sebi-turnover-fees-stt-other-levies) carries the schedule with its effective date.
- **NSE re-based its transaction charges on {{date:2026-03-01}}.** The separate IPFT line was folded into the headline rate, so the per-crore figures look different from 2025 but the total outflow per trade is the same, as the circular's own comparison table shows.

The practical effect of the STT change falls almost entirely on F&O. In the futures example below, STT is now more than four-fifths of the whole cost.

## Five worked examples

All figures use NSE, the broker-example brokerage above, and the calculator's rounding rule: each line rounded half-up to the paisa as it is computed, totals as the sum of rounded lines. The first two are the calculator's built-in examples; the other three are its documented checks.

:::example Equity intraday — 100 shares, buy ₹1,000, sell ₹1,010
Turnover ₹2,01,000 (₹1,00,000 bought, ₹1,01,000 sold); brokerage model {{fact:chg-brokerage-example-intraday-futures}}.

| Line | Amount |
|---|---|
| Brokerage, two orders | ₹20.00 + ₹20.00 |
| STT on the sell | ₹25.25 |
| Exchange levy | ₹6.17 |
| SEBI fee | ₹0.20 |
| Stamp duty on the buy | ₹3.00 |
| GST | ₹8.35 |
| **Total** | **₹82.97** |

Gross profit ₹1,000.00, net ₹917.03. The trade had to move ₹0.83 a share before it made anything — about eight per cent of the gross went in costs.
:::

:::example Equity delivery — fifty shares, buy ₹2,000, sell ₹2,200
Turnover ₹2,10,000; brokerage {{fact:chg-brokerage-example-delivery}} on delivery.

| Line | Amount |
|---|---|
| Brokerage | ₹0.00 |
| STT on buy and sell | ₹210.00 |
| Exchange levy | ₹6.45 |
| SEBI fee | ₹0.21 |
| Stamp duty on the buy | ₹15.00 |
| DP charge on the sell | {{fact:chg-dp-example-broker}} |
| GST | ₹1.20 |
| **Total** | **₹248.20** |

Gross profit ₹10,000.00 — costs took about two and a half per cent, almost all of it STT, which is charged on both sides for delivery.
:::

:::example Nifty futures — one lot, buy 23,000, sell 23,050
One lot is {{fact:fo-nifty-lot}} units, so the turnover is ₹29,93,250; brokerage model {{fact:chg-brokerage-example-intraday-futures}}.

| Line | Amount |
|---|---|
| Brokerage, two orders | ₹20.00 + ₹20.00 |
| STT on the sell | ₹749.13 |
| Exchange levy | ₹54.78 |
| SEBI fee | ₹2.99 |
| Stamp duty on the buy | ₹29.90 |
| GST | ₹17.60 |
| **Total** | **₹894.40** |

Gross profit: a 50-point gain × {{fact:fo-nifty-lot}} units = ₹3,250.00; net ₹2,355.60. Costs took 27.5 per cent of the gain, and the break-even move is 13.76 points. That ratio is the April-2026 STT increase in one line.
:::

:::example Nifty option — one lot, buy ₹100, sell ₹120
One lot is {{fact:fo-nifty-lot}} units, so the premium turnover is ₹14,300 (₹6,500 paid, ₹7,800 received); brokerage {{fact:chg-brokerage-example-options}}.

| Line | Amount |
|---|---|
| Brokerage, two orders | ₹20.00 + ₹20.00 |
| STT on the premium sold | ₹11.70 |
| Exchange levy | ₹5.08 |
| SEBI fee | ₹0.01 |
| Stamp duty on the buy | ₹0.20 |
| GST | ₹8.12 |
| **Total** | **₹65.11** |

Gross profit ₹1,300.00, net ₹1,234.89. Costs are about five per cent of the gain here, and roughly ₹1 of premium per unit is the break-even.
:::

:::example The same option held to expiry
Suppose instead you hold a 23,000 call to expiry and the index settles at 23,150. The option is exercised with an intrinsic value of 150 points. STT is {{fact:chg-stt-options-exercise}} × 150 × {{fact:fo-nifty-lot}} = ₹14.63, against ₹11.70 when you sold the ₹120 premium in the market. The difference is small on one lot; the principle is not — exercise STT applies to the full intrinsic value, not to the premium, so for a deep-in-the-money option it can be a multiple of the sell-side tax.
:::

## Why you sell an in-the-money option rather than let it expire

The exercise rule explains a habit of experienced option buyers: close the position before the final bell. Selling an option is taxed at {{fact:chg-stt-options-sell}} of the premium you receive; letting it expire in the money is taxed at {{fact:chg-stt-options-exercise}} of the intrinsic value you receive. For an option bought cheaply that finishes far in the money, the second base is far larger than the first. Add the risk of a poor exit price in the last half hour of an expiry session — when the expiring contract's price is being pinned to a settlement value — and the market exit usually wins. [Expiry-day dynamics](../expiry-day-dynamics/) covers the settlement mechanics.

## Reading your own contract note

- **Brokerage** is the only line you can negotiate; the broker example above charges nothing on delivery and a capped amount per order elsewhere.
- **STT** is the tax that scales with turnover, and in F&O it now dwarfs everything else. It applies to the sell side in intraday, futures and options, to both sides in delivery, and to the buyer on exercise.
- **GST** at {{fact:chg-gst-rate}} is charged on brokerage, the exchange levy and the SEBI fee — never on STT or stamp duty.
- **Stamp duty** is the buyer's alone and is tiny except on delivery.
- **The DP charge** appears only when you sell shares out of demat, once per stock per day regardless of quantity — a reason to avoid selling the same stock in several small lots across the day.
- A **broker-squared-off** position adds the broker's own charge; see [Intraday leverage today](../intraday-leverage-today/).

Costs are the one part of a trade you know before you place it. The [charges calculator](../../tools/charges/) shows them for your size and price before you commit, and the [facts register](../../facts/) shows when each rate was last verified.
