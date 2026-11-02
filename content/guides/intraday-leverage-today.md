---
title: Intraday leverage today
section: Foundations
summary: What "intraday leverage" can legally mean after SEBI's peak-margin rules — upfront VaR + ELM in cash, SPAN + ELM in F&O, the {{fact:sebi-upfront-margin-waiver-threshold}} collection rule behind five-times equity leverage, the expiry-day ELM add-on, and the penalty table when margin falls short.
updated: 2026-11-01
level: intermediate
order: 3
topics: [peak margin, upfront margin, var, elm, span, mis, square-off, margin penalty, expiry-day elm]
related: [order-types-and-products, what-a-trade-costs, index-derivatives-specs, position-sizing-and-loss-limits, buying-vs-selling-options, premarket-gainer-momentum]
tools: [position-size]
sources:
  - SEBI Master Circular for Stock Brokers (Jun 2025), paras 40–41 — upfront margin, peak-margin snapshots, penalty | https://www.sebi.gov.in/sebi_data/attachdocs/jun-2025/1750158789381.pdf | accessed 2026-11-01
  - SEBI circular CIR/DNPD/7/2011 (Aug 2011) — Short-collection and non-collection of client margins | https://www.sebi.gov.in/sebi_data/attachdocs/1312975056472.pdf | accessed 2026-11-01
  - SEBI circular Oct 2024 (2024/132) — Measures to strengthen the equity index derivatives framework | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf | accessed 2026-11-01
  - SEBI circular Feb 2026 — Calendar-spread margin benefit for single-stock derivatives on expiry day | https://www.sebi.gov.in/sebi_data/attachdocs/feb-2026/1770288869049.pdf | accessed 2026-11-01
  - Zerodha Support — How much margin or leverage does Zerodha provide? (broker example) | https://support.zerodha.com/category/trading-and-markets/margins/margin-leverage-and-product-and-order-types/articles/how-much-margins-leverage-does-zerodha-provide | accessed 2026-11-01
  - Zerodha Support — Additional ELM on index expiry (broker example) | https://support.zerodha.com/category/trading-and-markets/margins/margin-leverage-and-product-and-order-types/articles/additional-elm-for-index-expiry | accessed 2026-11-01
  - Zerodha Policies and Procedures (broker example: square-off timings and charge) | https://zerodha.com/policies-and-procedures/ | accessed 2026-11-01
---
## What "leverage" means after peak margin

Before 2020 an Indian broker could lend you almost any intraday exposure it liked, because margin was checked only at the end of the day. A position opened at 09:20 and closed at 15:10 never showed up in that check, so brokers advertised intraday leverage in multiples that would be illegal today. SEBI's peak-margin framework ended that between late 2020 and 2021, and the rule set now sits in paragraphs 40 and 41 of the [Master Circular for Stock Brokers](https://www.sebi.gov.in/sebi_data/attachdocs/jun-2025/1750158789381.pdf).

The core rule is simple. In the cash segment your broker must collect {{fact:sebi-upfront-margin-rule}} from you before the trade — VaR is the exchange's estimate of a day's likely loss on that stock, ELM the extra buffer for a bad day. In F&O the equivalent is the full SPAN plus exposure (ELM) margin the clearing corporation charges. And "before the trade" is enforced by sampling: the clearing corporation takes at least four random snapshots of every client's positions during the day and compares the margin due at each snapshot with what the broker had collected. Since {{fact:sebi-peak-margin-since}} the broker must have collected the whole of the highest snapshot — the peak — not just the end-of-day figure.

Three details from the same circular matter in practice:

- Snapshots in derivatives are valued with the beginning-of-day SPAN and ELM parameters, so an intraday margin increase by the clearing corporation does not create a surprise shortfall by itself.
- Early pay-in of shares to the clearing corporation counts as margin collected, which is why selling delivery shares you already hold needs no margin.
- Brokers report both end-of-day and peak margin per client, and the exchanges verify the reports against the broker's ledgers weekly. The penalty for a shortfall is levied on the broker, who passes it to the client under the broker–client agreement.

## Equity intraday: why it tops out near five times

The one deliberate exception is also in paragraph 40. If a broker collects at least {{fact:sebi-upfront-margin-waiver-threshold}} of the trade value upfront in the cash segment instead of the full VaR + ELM, no short-collection penalty applies. A fifth of the value upfront is five times exposure — and that is where the "5×" in every discount broker's leverage page comes from. It is not a product; it is the penalty-free floor.

:::example
You have ₹1,00,000 in your trading account. With {{fact:sebi-upfront-margin-waiver-threshold}} collected upfront, the largest intraday (MIS) stock position your broker can give you without risking a penalty is ₹5,00,000 of stock. A one-per-cent move the wrong way costs ₹5,000 — five per cent of your capital — before charges. The [position-size calculator](../../tools/position-size/) shows this margin figure beside the loss-based size, which is usually smaller.
:::

Brokers may be stricter than the floor, and most are for volatile or thinly traded stocks. As a published example, Zerodha's [margin page](https://support.zerodha.com/category/trading-and-markets/margins/margin-leverage-and-product-and-order-types/articles/how-much-margins-leverage-does-zerodha-provide) offers up to five times on eligible stocks through MIS and cover orders and states that peak-margin rules leave no room for extra leverage in F&O.

### The square-off that pays for the leverage

An MIS position exists only because the broker promised the exchange it will be closed intraday. Zerodha's [policies page](https://zerodha.com/policies-and-procedures/) is a typical published example: squaring off starts at {{fact:mkt-squareoff-example-cash}} for equity cash and {{fact:mkt-squareoff-example-fo}} for equity derivatives, "onwards" and at the broker's discretion, with a charge of {{fact:chg-rms-squareoff-example-broker}} plus GST for every position the risk desk has to close. Since {{date:2026-08-03}} a stock with derivatives stops continuous trading at 15:15 — before that cash square-off time — so for such stocks the broker's exit now happens in the closing auction. Read your own broker's policy; the timings are the broker's, not the exchange's, and [The trading day in IST](../trading-day-ist/) explains the auction.

## F&O: no broker leverage at all

In futures and options the broker adds nothing. Your margin is the clearing corporation's SPAN + ELM, and SEBI's [circular of {{date:2024-10-01}}](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2024/1727786261636.pdf) added three rules that make expiry day dearer than it looks:

- **Premium upfront for buyers.** Since {{fact:opt-upfront-premium-since}} (SEBI's date was {{date:2025-02-01}}; exchanges went live the following week) the full option premium must be in your account before a buy order goes through, and it is counted in the intraday snapshots. No more "pay for the premium out of the day's profit".
- **Extra ELM on expiry day.** Every short option contract that expires that day carries an additional {{fact:fo-expiry-day-elm-addon}} extreme-loss margin, whether the position was carried in or opened intraday, hedged or naked.
- **No calendar-spread benefit on the expiring leg.** The margin offset for a spread across two expiries is {{fact:opt-calendar-spread-expiry-rule}} — for index derivatives since Feb 2025 and, by SEBI's [circular of {{date:2026-02-05}}](https://www.sebi.gov.in/sebi_data/attachdocs/feb-2026/1770288869049.pdf), for single-stock derivatives since {{date:2026-05-05}}.

:::example
You sell one lot of a Nifty 23,000 call on its expiry day. The additional margin is {{fact:fo-expiry-day-elm-addon}} × 23,000 × {{fact:fo-nifty-lot}} units = ₹29,900 per lot, on top of the normal SPAN + ELM — the same arithmetic Zerodha's [support note](https://support.zerodha.com/category/trading-and-markets/margins/margin-leverage-and-product-and-order-types/articles/additional-elm-for-index-expiry) shows with a different strike. Four lots need almost ₹1.2 lakh of extra margin that a Monday position did not.
:::

Index derivatives also carry position limits that are now monitored intraday; [Index derivatives contract specs](../index-derivatives-specs/) covers the figures.

## The penalty table

When the collected margin falls short of what was due at the peak or at the end of the day, the exchange levies a penalty under SEBI's [circular CIR/DNPD/7/2011](https://www.sebi.gov.in/sebi_data/attachdocs/1312975056472.pdf), still the operative schedule:

| Shortfall | Penalty on the shortfall |
|---|---|
| Below ₹1 lakh **and** below a tenth of the margin due | {{fact:sebi-margin-penalty-rate-low}} |
| ₹1 lakh or more, **or** a tenth or more of the margin due | {{fact:sebi-margin-penalty-rate-high}} |
| Beyond the third consecutive day, or beyond the fifth day in a month | {{fact:sebi-margin-penalty-rate-repeat}} |

The penalty is computed per client per day on the higher of the end-of-day shortfall and the peak-snapshot shortfall. It is waived for the first two days after a day on which the index moved three per cent or more close-to-close, since margins jump on such days.

:::example
Your F&O position needed ₹50,000 of margin at the peak snapshot and you had ₹47,000 in the account — a ₹3,000 shortfall, six per cent of the requirement and well under ₹1 lakh. The penalty is {{fact:sebi-margin-penalty-rate-low}} of ₹3,000, which is ₹15.00 per day. Leave it unfixed into a fourth consecutive day and the rate becomes {{fact:sebi-margin-penalty-rate-repeat}}, or ₹150.00 per day. Small numbers — the damage is in the habit, because a shortfall usually means the position was sized to the margin rather than to a loss limit.
:::

## What this means for sizing

Leverage is a ceiling imposed by the rules, not a target. Three habits follow from everything above:

1. **Size by the loss you can take, not by the margin the broker allows.** A five-times MIS position in a stock that moves two per cent a day risks a tenth of your capital on an ordinary day. The [position-size calculator](../../tools/position-size/) starts from capital and a risk percentage and only then reports margin.
2. **Know the day's extra margins before you sell options.** Expiry day adds the ELM figure above and removes the spread benefit on the expiring leg; a position that fit the day before may not fit on expiry day.
3. **Keep a buffer above the peak.** The snapshots are random and the penalty is on the peak. A margin utilisation that reads 95 per cent at 10:30 is a penalty waiting for a volatile hour.

How these rules changed what a trade costs is the subject of [What a trade costs](../what-a-trade-costs/); how to turn a risk budget into a lot count is the subject of [Position sizing and loss limits](../position-sizing-and-loss-limits/).
