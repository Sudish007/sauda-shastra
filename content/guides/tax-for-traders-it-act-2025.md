---
title: Tax for traders under the Income-tax Act 2025
section: Risk, psychology & tax
summary: Which Act applies to which year, why intraday equity is speculative business income and exchange-traded F&O is not, the set-off and carry-forward rules ({{fact:tax-spec-loss-carry-forward}} for speculation losses, {{fact:tax-nonspec-loss-carry-forward}} for F&O), turnover for the audit test, the presumptive trap, STT as an expense, advance tax, slabs, due dates and the return form for 2026.
updated: 2026-11-01
level: intermediate
order: 5
topics: [income tax, income-tax act 2025, speculative business, non-speculative business, f&o tax, intraday tax, set-off, carry forward, turnover, tax audit, presumptive taxation, advance tax, itr-3, stt deduction]
related: [tax-for-investors, what-a-trade-costs, position-sizing-and-loss-limits, what-sebi-loss-studies-say]
tools: [fo-tax-estimator]
sources:
  - Income-tax Act 2025, as amended by the Finance Act 2026 — ss. 26, 32, 58, 62, 63, 66, 108–113, 121, 156, 202, 263, 404–408, 424–428 | https://www.incometaxindia.gov.in/income-tax-act-2025 | accessed 2026-11-01
  - Income-tax Act 1961, as amended by the Finance Act 2025 — ss. 43(5), 44AB, 44AD, 73, 111A, 112A (AY 2026-27) | https://www.incometaxindia.gov.in/income-tax-act | accessed 2026-11-01
  - Finance Act 2026 — s. 3 (rates, surcharge and cess for the tax year 2026-27) and s. 159 (securities transaction tax) | https://www.incometaxindia.gov.in/finance-acts | accessed 2026-11-01
  - CBDT press release (Apr 2026) — Income-tax Act 2025 comes into force | https://www.incometaxindia.gov.in/documents/d/guest/press-release-income-tax-act-2025-comes-into-force-from-01-april-2026-pdf | accessed 2026-11-01
  - CBDT press release (Sep 2026) — Due date for furnishing the return of income for AY 2026-27 extended | https://www.incometaxindia.gov.in/documents/d/guest/cbdt-extends-due-date-for-furnishing-return-of-income-for-ay-2026-27 | accessed 2026-11-01
  - Income Tax Department — Income tax returns, forms for 2026 | https://www.incometaxindia.gov.in/income-tax-returns | accessed 2026-11-01
  - Income Tax Department — FAQs and guidance notes on forms under the Income-tax Rules 2026 | https://www.incometaxindia.gov.in/faqs-and-guidance-notes-on-forms-as-per-income-tax-rules-2026 | accessed 2026-11-01
  - NSE — SEBI turnover fees, STT and other levies (rates with effect from Apr 2026) | https://www.nseindia.com/invest/first-time-investor-sebi-turnover-fees-stt-other-levies | accessed 2026-11-01
  - ICAI — Guidance Note on Tax Audit under section 44AB of the Income-tax Act 1961 (Revised 2026), publication page | https://publication.icai.org/publication/968 | accessed 2026-11-01
  - Zerodha Varsity — Turnover, balance sheet and P&L (Module 7), describing the ICAI guidance-note method | https://zerodha.com/varsity/chapter/turnover-balance-sheet-and-pl/ | accessed 2026-11-01
  - Ministry of Finance — Memorandum explaining the provisions in the Finance Bill 2026 (secondary; locator for s. 3 and s. 159) | https://www.indiabudget.gov.in/doc/memo.pdf | accessed 2026-11-01
---
## Which law applies to which year

The [Income-tax Act 2025](https://www.incometaxindia.gov.in/income-tax-act-2025) came into force on {{fact:tax-act-in-force}}, with the Income-tax Rules 2026 notified on {{date:2026-03-20}} ([CBDT press release](https://www.incometaxindia.gov.in/documents/d/guest/press-release-income-tax-act-2025-comes-into-force-from-01-april-2026-pdf)). It replaces the previous-year and assessment-year pair with a single **tax year**, the twelve months beginning in April. Two consequences for a trader filing now:

- Income earned in **FY 2025-26** (assessment year 2026-27, the return being filed in 2026) is still assessed under the [Income-tax Act 1961](https://www.incometaxindia.gov.in/income-tax-act). For audited cases CBDT extended that return's due date from the usual {{fact:tax-return-due-date-audit}} to {{date:2026-11-21}}, with the audit report due by {{date:2026-10-21}} ([CBDT, Sep 2026](https://www.incometaxindia.gov.in/documents/d/guest/cbdt-extends-due-date-for-furnishing-return-of-income-for-ay-2026-27)).
- Income earned from **tax year 2026-27** onward falls under the 2025 Act, whose sections are numbered differently. The rules below are the 2025 Act's; where a figure is the same as under the 1961 Act this page says "unchanged" without a date.

The section map, for reading a CA's note or an old article:

| Topic | Income-tax Act 2025 | Income-tax Act 1961 (AY 2026-27) |
|---|---|---|
| Speculative transaction | s. 66(31); derivatives carve-out s. 66(33) | s. 43(5) |
| Speculation loss | s. 113 | s. 73 |
| Business loss carry-forward | s. 112 | s. 72 |
| Tax audit | s. 63 | s. 44AB |
| Presumptive taxation | s. 58 | s. 44AD |
| Advance tax | ss. 404–408 | ss. 208–211 |
| Return due dates | s. 263(1)(c) | s. 139(1) |
| Equity STCG / LTCG | s. 196 / s. 198 | s. 111A / s. 112A |

The section references on this page are also rows in the [verified facts register](../../facts/), with the Act page as their source.

## Classifying trading income

Everything else depends on which head and which basket a trade falls into.

- **Intraday equity is speculative business income.** Under s. 66(31) a purchase or sale settled otherwise than by actual delivery is a speculative transaction, and intraday cash trades are exactly that. The profit or loss is business income (s. 26), but kept in its own speculation basket.
- **Exchange-traded F&O is non-speculative business income.** Section 66(33) carves a "specified derivative transaction" — an exchange-traded derivative done through a SEBI-registered broker on a recognised exchange, with a time-stamped contract note showing the client ID and PAN — out of the definition of speculation, so futures and options on NSE or BSE sit in the ordinary business basket with its fuller set-off rights.
- **Delivery trades are capital gains** unless the shares are held as stock-in-trade, in which case they too are business income. The investor side — holding periods, rates, dividends — is in [Tax for investors](../tax-for-investors/).

## Set-off and carry-forward

{{label:MECHANISM}} The rules are asymmetric by design: speculation losses are ring-fenced; business losses are not; nothing is ever set off against salary; and no loss travels forward unless the return that claims it is filed on time.

| Loss | Set off in the same year against | Carried forward | Condition |
|---|---|---|---|
| Speculation (intraday equity) | speculation profit only (s. 113) | {{fact:tax-spec-loss-carry-forward}} | return filed by the due date (s. 121) |
| F&O (non-speculative business) | any head except Salaries, including capital gains (s. 109) | {{fact:tax-nonspec-loss-carry-forward}}, against business profits (s. 112) | return filed by the due date (s. 121) |
| Short-term capital loss | any capital gain (s. 108(2)) | eight tax years, against capital gains (s. 111) | return filed by the due date |
| Long-term capital loss | long-term capital gains only | eight tax years, long-term only | return filed by the due date |

Section 121 is the sting: a belated return is still assessed, but its losses cannot be carried forward, and s. 263(1)(a)(viii) obliges anyone who wants to carry a loss forward to file at all. A losing year with no return is a loss thrown away.

:::example Losses across heads
1. **Salary ₹14,00,000, F&O loss ₹3,00,000, intraday profit ₹50,000, bank interest ₹40,000.** The F&O loss is set off first against the intraday profit (both business) and then against the interest (other sources) — never against the salary. ₹3,00,000 − ₹50,000 − ₹40,000 = **₹2,10,000** is carried forward for up to {{fact:tax-nonspec-loss-carry-forward}} against future business profits, but only if the return is filed by the due date; the salary is taxed on its own.
2. **Intraday loss ₹80,000, F&O profit ₹2,00,000.** The speculation loss cannot touch the F&O profit. The ₹2,00,000 is taxed at slab as business income; the ₹80,000 is carried forward for up to {{fact:tax-spec-loss-carry-forward}}, usable only against a future intraday profit. The [F&O tax estimator](../../tools/fo-tax-estimator/) applies exactly these two rules.
:::

## Turnover, books and audit

**Turnover** for the audit test is not the contract value. The method comes from the ICAI's [Guidance Note on Tax Audit](https://publication.icai.org/publication/968), as [Varsity describes it](https://zerodha.com/varsity/chapter/turnover-balance-sheet-and-pl/): for speculative trades, the sum of the absolute values of profits and losses; for F&O, the absolute favourable and unfavourable differences, plus any option premium received on sale that is not already in that figure, plus differences on reverse trades; for delivery, the sale value. Whether differences are aggregated per scrip or per trade is a disclosed choice (the note's text was not read for this page; Varsity's description of it is cited).

**Audit** under s. 63 is required when business turnover exceeds ₹1 crore — or {{fact:tax-audit-threshold-digital}} when cash receipts and cash payments are each at most five per cent of the totals, which describes almost every exchange-traded account — when professional receipts exceed fifty lakh rupees, or when a presumptive-scheme user declares a profit below the deemed rate (next section). The report is due a month before the return.

**Books** are compulsory for an individual or HUF in business (s. 62) once business income exceeds {{fact:tax-books-threshold-income}} or turnover exceeds {{fact:tax-books-threshold-turnover}} in any of the three preceding tax years — thresholds a modest F&O account crosses in its first year.

:::example Turnover of an options account
Three hundred option trades in a year, with the absolute sum of all profits and losses at ₹18,00,000: the turnover is about ₹18 lakh plus any premium received on sales not already counted — far below the {{fact:tax-audit-threshold-digital}} digital threshold, so no audit on turnover grounds. An audit can still arise another way: if this trader used the presumptive scheme in an earlier year and now declares a loss while total income is above the basic exemption.
:::

## The presumptive scheme and its trap

{{label:MECHANISM}} Section 58 lets a resident individual, HUF or partnership firm (not an LLP) with business turnover up to {{fact:tax-presumptive-limit}} — ₹3 crore where cash receipts are at most five per cent — declare {{fact:tax-presumptive-rate-digital}} of digital receipts and {{fact:tax-presumptive-rate-other}} of the rest as profit, or a higher actual profit, and skip books and audit. Advance tax is then a single instalment, {{fact:tax-advance-tax-presumptive}}.

For a trader it is a trap in two ways. No loss and no deduction can be claimed against presumptive income (s. 58(4)), so a losing year under the scheme is a year of deemed profit on the turnover. And declaring below the deemed rate while total income exceeds the exemption brings books and audit back (s. 58(3)); opting out within five years of opting in bars re-entry for five years (s. 58(7)). A trader with real, variable P&L is usually better off with books, where a loss is a loss.

## Deductible expenses, including STT

Business income is net of the expenses of earning it: brokerage, exchange and SEBI charges, GST on them, data and software subscriptions, a share of internet and device costs, and — under s. 32(k) — the securities transaction tax paid, when the trades are in the course of business and taxed under the business head. (For capital gains, s. 76(4) denies the STT deduction; see the investors' guide.)

{{label:MECHANISM}} Since {{date:2026-04-01}} the STT rates on derivatives have been higher, under s. 159 of the [Finance Act 2026](https://www.incometaxindia.gov.in/finance-acts): {{fact:chg-stt-options-sell}} of premium on an option sold (from 0.1 per cent), {{fact:chg-stt-options-exercise}} of intrinsic value on an option exercised (from 0.125 per cent), and {{fact:chg-stt-futures}} of the sell value on futures (from 0.02 per cent); NSE's [levies page](https://www.nseindia.com/invest/first-time-investor-sebi-turnover-fees-stt-other-levies) carries the schedule. Equity intraday STT is {{fact:chg-stt-equity-intraday}} of the sell value, unchanged. [What a trade costs](../what-a-trade-costs/) prices the whole line.

:::example STT as a business expense
A seller who collects ₹8,00,000 of option premium in a year pays STT of {{fact:chg-stt-options-sell}} × ₹8,00,000 = **₹1,200**, against ₹800 at the earlier rate. The ₹1,200 is a deductible business expense under s. 32(k), so at a twenty-per-cent marginal slab the after-tax cost is ₹960 — still real money.
:::

## Slabs, rebate, surcharge, cess and advance tax

The default (new-regime) rates in s. 202(1) apply to a trader's total income — salary after the {{fact:tax-std-deduction-new-regime}} standard deduction, business income, other sources — with capital gains at their own rates on top. The rates were left unchanged for the tax year 2026-27 by the Finance Act 2026.

| Slab | Taxable income band and rate |
|---|---|
| First | {{fact:tax-slab-1}} |
| Second | {{fact:tax-slab-2}} |
| Third | {{fact:tax-slab-3}} |
| Fourth | {{fact:tax-slab-4}} |
| Fifth | {{fact:tax-slab-5}} |
| Sixth | {{fact:tax-slab-6}} |
| Seventh | {{fact:tax-slab-7}} |

Three adjustments sit on top of the slab tax. The s. 156 **rebate** of up to {{fact:tax-rebate-156}} wipes out slab tax when total income is at most {{fact:tax-rebate-156-income-limit}}, with marginal relief just above it — but it is capped at the slab tax (s. 156(3)) and never offsets the special-rate tax on equity gains. A **surcharge** applies above fifty lakh rupees of total income, rising with income, and is capped at {{fact:tax-surcharge-cg-cap}} on dividends and on ss. 196–198 capital gains (Finance Act 2026, s. 3 and the First Schedule). The **Health and Education Cess** of {{fact:tax-cess-rate}} is charged on tax plus surcharge. A business assessee may opt out of the default regime once and, after withdrawing, never again (s. 202(4)).

{{label:MECHANISM}} **Advance tax** applies once the year's liability reaches {{fact:tax-advance-tax-threshold}} (s. 404), in cumulative instalments under s. 408(1); paying less than ninety per cent of the assessed tax by the year end draws simple interest of one per cent a month (s. 424), plus deferment interest on late instalments (s. 425). Salary TDS covers the salary; trading income has to be estimated and paid as the year goes.

:::example A salaried F&O trader's year
Salary ₹10,75,000, which after the {{fact:tax-std-deduction-new-regime}} standard deduction is ₹10,00,000 of taxable salary. On its own that attracts ₹40,000 of slab tax, all of it removed by the rebate — the employer deducts nothing. Add an F&O profit of ₹5,00,000 and total income becomes ₹15,00,000: slab tax ₹1,05,000, no rebate (the income is above {{fact:tax-rebate-156-income-limit}}), cess ₹4,200, **total ₹1,09,200**. The F&O profit cost more than the slab rate on ₹5,00,000 because it also switched off the rebate, and none of it is covered by TDS, so it is due as advance tax:

| Instalment | Cumulative share of the year's tax | On ₹1,09,200 |
|---|---|---|
| First | {{fact:tax-advance-tax-q1}} | ₹16,380 |
| Second | {{fact:tax-advance-tax-q2}} | ₹49,140 |
| Third | {{fact:tax-advance-tax-q3}} | ₹81,900 |
| Fourth | {{fact:tax-advance-tax-q4}} | ₹1,09,200 |

The [F&O tax estimator](../../tools/fo-tax-estimator/) reproduces this case and shows the slab-by-slab working.
:::

## Due dates, forms and records

Under s. 263(1)(c), as substituted with effect from the 2025 Act's commencement, the return is due on {{fact:tax-return-due-date-business-noaudit}} for business or professional income without audit, {{fact:tax-return-due-date-audit}} for audited persons and {{fact:tax-return-due-date-other}} for everyone else. A belated return may be filed within nine months of the tax-year end (s. 263(4)) and a revised one within twelve (s. 263(5)); the late-filing fee is {{fact:tax-late-fee}} (less where total income is at most ₹5 lakh), under s. 428.

**The form.** For the return due in 2026 (assessment year 2026-27, under the 1961 Act) a trader with business income files {{fact:tax-itr-form-trader}}; a presumptive-scheme trader with income up to fifty lakh rupees may use ITR-4 Sugam, and an investor with only capital gains uses ITR-2, per the department's [returns page](https://www.incometaxindia.gov.in/income-tax-returns). Under the Income-tax Rules 2026 the audit report that used to be Forms 3CA/3CB/3CD becomes Form 26, per the department's [form map](https://www.incometaxindia.gov.in/faqs-and-guidance-notes-on-forms-as-per-income-tax-rules-2026). The Rules-2026 return forms for the tax year 2026-27 — the ones a trader will file in 2027 — had **not** been notified as of {{date:2026-11-01}}; the [What changed](../../changelog/) page will record them when they appear, and this page will be re-verified then.

**Records.** Keep, for every year: contract notes and the broker's annual tax P&L statement; ledger, fund and bank statements showing every transfer to and from the broker; bills for claimed expenses; the turnover computation with its per-scrip or per-trade choice stated; and the department's annual information statement, reconciled before filing. Retention is as the Rules prescribe under s. 62(3).

:::warning Not advice
Worked numbers, not tax advice; forms, utilities and interpretations change. Surcharge bands, marginal relief and the audit question in a presumptive year are where a chartered accountant earns the fee. The [verified facts register](../../facts/) shows when each figure here was last checked.
:::
