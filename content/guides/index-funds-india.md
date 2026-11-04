---
title: Index funds in India: four useful building blocks
section: Investing: India
summary: How Nifty 50, Nifty Next 50, Nifty Midcap 150 and Nifty Smallcap 250 differ; their dated five-year total returns and one-year volatility; why tracking difference matters more than a low advertised fee; and a direct-versus-regular cost example using {{fact:inv-nifty50-ter-direct}}, {{fact:inv-nifty50-ter-regular}} and {{fact:inv-nifty50-td-10y}}.
updated: 2026-11-04
level: beginner
order: 1
topics: [index fund, nifty 50, nifty next 50, midcap 150, smallcap 250, expense ratio, direct plan, regular plan, tracking difference, tracking error, passive investing]
related: [sip-maths-and-sequencing, factor-indices-evidence, direct-equity-and-valuation-bands, asset-allocation-and-gold-after-sgb, tax-for-investors, us-index-core-three-fund]
tools: [sip-compounding]
sources:
  - SEBI (Mutual Funds) Regulations 2026, as amended Jul 2026 — Regulation 66 expense structure | https://www.sebi.gov.in/sebi_data/attachdocs/jul-2026/1783933012694.pdf | accessed 2026-11-01
  - SEBI Master Circular for Mutual Funds (Mar 2026) — tracking error, tracking difference and rebalancing | https://www.sebi.gov.in/sebi_data/attachdocs/mar-2026/1774024028162.pdf | accessed 2026-11-01
  - UTI Mutual Fund — UTI Nifty 50 Index Fund, data Sep 2026 | https://www.utimf.com/mutual-funds/uti-nifty-50-index-fund | accessed 2026-11-01
  - UTI Mutual Fund — UTI Nifty Next 50 Index Fund, data Sep 2026 | https://www.utimf.com/mutual-funds/uti-nifty-next-50-index-fund | accessed 2026-11-01
  - NSE Indices — Nifty 50 factsheet, Oct 2026 | https://www.niftyindices.com/Factsheet/ind_nifty50.pdf | accessed 2026-11-01
  - NSE Indices — Nifty Next 50 factsheet, Oct 2026 | https://www.niftyindices.com/Factsheet/ind_next50.pdf | accessed 2026-11-01
  - NSE Indices — Nifty Midcap 150 factsheet, Sep 2026 | https://www.niftyindices.com/Factsheet/ind_Nifty_Midcap_150.pdf | accessed 2026-11-01
  - NSE Indices — Nifty Smallcap 250 factsheet, Sep 2026 | https://www.niftyindices.com/Factsheet/ind_Nifty_Smallcap_250.pdf | accessed 2026-11-01
  - AMFI — Total expense ratio of mutual-fund schemes | https://www.amfiindia.com/ter-of-mf-schemes | accessed 2026-11-01
---
## What the four indices actually add

An index fund is a delivery system. It owns the securities in an index, in the index weights, and tries to give the investor the index return after costs. The useful first decision is therefore the index, not the fund-house logo.

- **Nifty 50** is the large-company core. Its [October 2026 factsheet](https://www.niftyindices.com/Factsheet/ind_nifty50.pdf) shows that Financial Services alone was {{fact:inv-nifty50-financials-weight}} of the index. It is diversified across companies, but its sector weights are not equal.
- **Nifty Next 50** holds the next large companies outside Nifty 50. It is not a gentler version of the core: constituents are less established, sector weights differ and the index has historically moved more.
- **Nifty Midcap 150** moves down the size ladder. It spreads one allocation across a broad mid-cap universe instead of asking the investor to identify the next large company.
- **Nifty Smallcap 250** reaches further down. It diversifies company-specific risk, but it does not remove the liquidity, governance and drawdown risks of smaller companies.

A saver does not need all four. A Nifty 50 fund can be the whole equity allocation. Adding Next 50, mid-cap or small-cap exposure is an active choice to take more size risk, not a requirement for a “complete” portfolio.

## Dated return and risk evidence

{{label:EVIDENCE}} The table uses the latest factsheets fetched for this guide. Return is **total return**, which includes reinvested dividends. Risk is the factsheet’s annualised standard deviation over the latest year. The Nifty 50 and Next 50 rows are dated {{date:2026-10-30}}; the two size-index rows are dated {{date:2026-09-30}}, so their figures are not a perfectly same-date league table.

| Index | Five-year total-return CAGR | One-year standard deviation | What the row says |
|---|---:|---:|---|
| Nifty 50 | {{fact:inv-nifty50-5y-tr}} | {{fact:inv-nifty50-sd-1y}} | Large-company core; lowest volatility in this dated set |
| Nifty Next 50 | {{fact:inv-next50-5y-tr}} | {{fact:inv-next50-sd-1y}} | Higher return and a wider ride over this window |
| Nifty Midcap 150 | {{fact:inv-midcap150-5y-tr}} | {{fact:inv-midcap150-sd-1y}} | Broad mid-cap exposure, not a stock-picking shortcut |
| Nifty Smallcap 250 | {{fact:inv-smallcap250-5y-tr}} | {{fact:inv-smallcap250-sd-1y}} | Broadest small-company basket and high variability |

These are observations, not expected returns. A five-year ranking can reverse in the next five years, and one-year standard deviation does not show the shape of a crash. Use the table to understand that moving down the size ladder changes the risk budget. Do not use it to choose whichever row finished first.

:::warning Different dates, different jobs
NSE Indices refreshes each factsheet on its own schedule. Compare price return with price return, total return with total return, and identical end dates wherever possible. This table keeps the dates visible rather than pretending the rows form a backtest.
:::

## Cost has three layers

The first layer is the legal ceiling. Under [Regulation 66](https://www.sebi.gov.in/sebi_data/attachdocs/jul-2026/1783933012694.pdf) of the 2026 mutual-fund regulations, an open-ended index fund or ETF has a base expense-ratio cap of {{fact:inv-index-fund-ter-cap}} of daily net assets. Brokerage, statutory transaction costs and GST on fees can sit outside that base ratio, so the cap is not the expected cost of a good fund.

The second layer is the plan. A **direct** plan has no distributor commission; a **regular** plan pays for distribution from the scheme. The portfolio and benchmark are the same, but the NAV paths separate by the fee difference. The [UTI Nifty 50 Index Fund page](https://www.utimf.com/mutual-funds/uti-nifty-50-index-fund), used only as a dated example and not as a recommendation, showed {{fact:inv-nifty50-ter-direct}} for its direct plan and {{fact:inv-nifty50-ter-regular}} for its regular plan. The provider’s Next 50 page showed a direct TER of {{fact:inv-next50-ter-direct}}.

The third layer is implementation. **Tracking difference** is fund return minus index return over a period. It captures the TER, cash held for redemptions, index-reconstitution trading, taxes and imperfect execution. **Tracking error** measures how variable that gap is. SEBI’s [mutual-fund master circular](https://www.sebi.gov.in/sebi_data/attachdocs/mar-2026/1774024028162.pdf) caps annualised tracking error for equity index funds and ETFs at {{fact:inv-tracking-error-cap}}, requires tracking difference to be published monthly over several horizons, and gives an equity index fund seven calendar days to rebalance after an index change.

A low TER with a persistently poor tracking difference is not cheap. The number to compare across funds following the same index is the long-horizon tracking difference, beside TER and liquidity.

## Worked cost example

:::example A fee is small each year and large across years
Put ₹10,00,000 into the dated Nifty 50 example. At {{fact:inv-nifty50-ter-direct}}, the first year’s stated TER is ₹2,500; at {{fact:inv-nifty50-ter-regular}}, it is ₹3,700. The ₹1,200 difference buys distribution, not a different portfolio.

Now assume the index compounds at twelve per cent a year for ten years. With no drag, ₹10,00,000 becomes ₹31,05,848. A tracking drag equal to the example fund’s {{fact:inv-nifty50-td-10y}} turns that path into roughly ₹29,96,691. The difference is ₹1,09,157. The assumed return is an illustration, not a forecast; the tracking figure is the provider’s dated observation.
:::

The arithmetic is why “only a few basis points” is the wrong frame. A recurring drag applies to the growing balance every year. Use the [SIP and compounding calculator](../../tools/sip-compounding/) to change the contribution, return and horizon, then test a lower return as well as a higher one.

## Active versus passive, without an India percentage

{{label:MECHANISM}} Passive investing makes a narrow promise: own the index at low cost. It does not promise to beat every active fund or avoid a falling market. Active management makes a different promise: security selection, position sizing and cash can differ from the benchmark, with a higher fee and manager risk.

No India SPIVA scorecard or India investor-return-gap study was fetched for this research. This guide therefore quotes **no Indian active-versus-passive success percentage**. A US scorecard cannot answer the India question, and importing its result would turn a sourced US observation into an unsupported Indian claim.

The defensible decision rule is mechanical. The [US index-core guide](../us-index-core-three-fund/) puts that market’s scorecard in its own context; it still cannot answer the India question. If the investor has no documented process for selecting and monitoring an active manager, start with the index. If an active fund is considered, compare it with the correct total-return benchmark after fees, over a full cycle, and ask whether the current manager and mandate produced the record. A trailing-return rank is not a process.

## A selection checklist

1. **Choose the exposure.** Write down why the portfolio needs large, next-large, mid-cap or small-cap risk. “It returned more recently” is not a reason.
2. **Compare like with like.** Same index, direct plans, identical date, growth option, and total return.
3. **Read tracking difference.** Use the one-, three- and five-year disclosures on the AMC and [AMFI TER page](https://www.amfiindia.com/ter-of-mf-schemes), not only the latest TER.
4. **Check operating fit.** For an ETF, inspect traded volume, bid–ask spread and the gap between market price and NAV. For an index mutual fund, inspect exit load, cut-off rules and minimum contribution.
5. **Keep the allocation stable.** The [SIP guide](../sip-maths-and-sequencing/) handles contribution sequencing; [asset allocation](../asset-allocation-and-gold-after-sgb/) decides how much belongs in equity at all.
6. **Review annually, not daily.** Replace a fund when its process, benchmark or persistent tracking quality changes, not because another size index won the latest year.

:::evidence What the evidence says
- {{label:EVIDENCE}} The return, volatility, sector-weight and fee figures above come from dated NSE Indices and provider documents linked on this page.
- {{label:MECHANISM}} Direct plans remove distributor commission; tracking drag compounds; adding smaller companies changes the risk budget. These mechanisms do not forecast which index leads next.
- {{label:LORE}} “Small caps always win over long periods” and “an index fund cannot lose” are unsupported shortcuts. All four equity indices can fall.
:::
