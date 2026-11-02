---
title: Reading the option chain
section: Options
summary: What each column of a Nifty option chain shows and what it cannot show, why open interest counts contracts rather than direction, how to read change in OI, the put–call ratio and max pain without over-reading them, what SEBI's delta-adjusted FutEq measure is, and what the published evidence on expiry pinning says (US, modest) versus the Indian max-pain claims (lore).
updated: 2026-11-01
level: beginner
order: 1
topics: [option chain, open interest, change in oi, put-call ratio, pcr, max pain, pinning, futeq, participant-wise oi, nifty options, strikes]
related: [iv-expected-move-and-crush, expiry-day-dynamics, buying-vs-selling-options, index-derivatives-specs, candles-order-flow-depth, flows-rupee-and-rbi, oi-shift-breakout]
sources:
  - NSE — Nifty 50 derivatives contract specifications (strike scheme, tick, trading cycle) | https://www.nseindia.com/products-services/equity-derivatives-nifty50 | accessed 2026-11-01
  - NSE Clearing — Participant-wise open interest, daily file (Oct 2026) | https://nsearchives.nseindia.com/content/nsccl/fao_participant_oi_30102026.csv | accessed 2026-11-01
  - SEBI circular May 2025 (2025/79) — Enhancing trading convenience and strengthening risk monitoring in equity derivatives (FutEq open interest) | https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748521484014.pdf | accessed 2026-11-01
  - Ni, Pearson and Poteshman — Stock price clustering on option expiration dates, Journal of Financial Economics (2005), abstract | https://experts.illinois.edu/en/publications/stock-price-clustering-on-option-expiration-dates/ | accessed 2026-11-01
  - Avellaneda and Lipkin — A market-induced mechanism for stock pinning, Quantitative Finance (2003), author PDF | https://www.cis.upenn.edu/~mkearns/finread/PinningPaper.pdf | accessed 2026-11-01
  - Golez and Jackwerth — Pinning in the S&P 500 futures, Journal of Financial Economics (2012), abstract | https://ideas.repec.org/a/eee/jfinec/v106y2012i3p566-585.html | accessed 2026-11-01
  - Journal of Futures Markets (2005) — Futures and options expiration-day effects: the Indian evidence, abstract | https://ideas.repec.org/a/wly/jfutmk/v25y2005i11p1045-1065.html | accessed 2026-11-01
  - Zerodha Varsity — Max pain and PCR ratio (chapter) | https://zerodha.com/varsity/chapter/max-pain-pcr-ratio/ | accessed 2026-11-01
---
## What a chain row shows, and what it cannot

An option chain is a table of every listed strike for one expiry, calls on one side and puts on the other. For each contract it shows the last traded price, the best bid and ask, the day's volume, the open interest (OI), the change in OI since the previous close and an implied volatility (IV). Nifty 50 strikes sit {{fact:opt-strike-interval-nifty}} apart at every index level, with {{fact:opt-strike-count-nifty}} strikes listed when a series is introduced and more added as the index moves; prices step in units of {{fact:opt-tick-size-options}}; one lot is {{fact:fo-nifty-lot}} units. All of that is on NSE's [contract specifications page](https://www.nseindia.com/products-services/equity-derivatives-nifty50).

What the chain cannot show is who holds the positions, why, or whether a contract was opened as a bet or as a hedge. Every number in it is an aggregate of anonymous orders. That limitation decides how much weight each column can carry.

:::note Check the unit before you compare
Some displays count open interest in contracts (lots), others in units. A displayed open interest of 12,00,000 units at the 25,000 call is 12,00,000 ÷ {{fact:fo-nifty-lot}} ≈ 18,462 lots. Comparing a lots figure from one source with a units figure from another is the commonest beginner's error on this screen.
:::

## Open interest counts contracts, not direction

Open interest is the number of contracts that exist at a strike. Every contract has one buyer and one seller, so OI cannot say whether "the market" is long or short — it is always both, in equal measure. When price rises and OI rises together, new longs have been matched with new shorts. The popular four-box grid that reads those two numbers as a sentiment signal is a convention, not a measurement: {{label:MECHANISM}}

| Price | OI | Conventional reading |
|---|---|---|
| Up | Up | "Long build-up": fresh positions, buyers paying up |
| Up | Down | "Short covering": existing shorts closing |
| Down | Up | "Short build-up": fresh positions, sellers pressing |
| Down | Down | "Long unwinding": existing longs closing |

The grid is useful as a vocabulary and useless as a forecast on its own. A "long build-up" at the 25,000 call is equally a short build-up at the 25,000 call; which side is the smart one, the chain cannot say.

### Change in OI

Change in OI compares the current OI with the previous close, so during the day it tells you where positions are being added or removed today. In a weekly series OI accumulates through the contract's life and drops to zero at expiry, so a large OI figure late in the week may simply be old positions that have not yet closed. Look at change in OI for today's story and at total OI for where the standing positions are.

### Participant-wise OI exists, but only at the close

NSE Clearing publishes an end-of-day [participant-wise open-interest file](https://nsearchives.nseindia.com/content/nsccl/fao_participant_oi_30102026.csv) splitting the market into Client, DII, FII and Pro, each by index and stock futures (long and short) and by index and stock calls and puts (long and short). The file dated {{date:2026-10-30}}, for example, shows clients short 41,26,285 index-put contracts against 7,11,954 for FIIs. Two cautions: it is end of day, so it cannot tell you what any group is doing right now, and "Client" lumps every non-institutional account together, from a one-lot retail trader to a family office. The Edges section of this site returns to this data set once it is written.

### FutEq: the regulator counts delta, not contracts

Since SEBI's [circular of {{date:2025-05-29}}](https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748521484014.pdf), open interest for position limits is measured as delta-adjusted "future equivalent" (FutEq) exposure: a long future counts as plus one times its notional, a long call as somewhere between zero and plus one depending on its delta, a long put between zero and minus one, and short options with the opposite sign. The clearing corporations publish FutEq OI per index. The chain's raw OI and the regulator's FutEq figure are therefore different numbers for the same positions; the limits that apply to them, and the fact that they are now checked during the day, are in [Index derivatives contract specs](../index-derivatives-specs/).

## The put–call ratio

The put–call ratio (PCR) is total put OI divided by total call OI, either for the whole expiry or for a pair of strikes. If the 24,800 put carries 15,00,000 units of OI and the 25,000 call carries 12,00,000, the ratio for that pair is 15,00,000 ÷ 12,00,000 = 1.25. The honest translation is "more puts are open than calls at these strikes", and nothing more.

{{label:MECHANISM}} The sentiment story — a high PCR means hedgers have bought puts and the market is well protected, so dips get bought; a low PCR means complacency — is a mechanism explanation that treats put buyers as hedgers and call buyers as speculators. Both assumptions fail often: an index put is sold by someone as surely as it is bought, and a large put OI at a strike may be a seller's income trade rather than a hedger's insurance. No Indian study publishes a hit rate for PCR thresholds, so any such threshold is a practitioner's rule. [Zerodha Varsity's chapter](https://zerodha.com/varsity/chapter/max-pain-pcr-ratio/) explains the computation with Indian examples; its lot sizes and expiry days predate the current rules.

## Max pain and the evidence on pinning

Max pain is the strike at which the total value of all in-the-money options at expiry would be lowest — the settlement level that pays option buyers, taken together, the least. To compute it, assume the index settles at each strike in turn, add up the intrinsic value of every call and put that would be in the money at that level, and pick the strike with the smallest total. The claim attached to it is that the index tends to settle near that strike because option sellers — assumed to be the better-capitalised side — push it there.

What does the evidence say? Three strands, none of them Indian max-pain statistics:

- {{label:EVIDENCE}} **US stocks cluster at strikes on expiry days.** Ni, Pearson and Poteshman ([Journal of Financial Economics, 2005](https://experts.illinois.edu/en/publications/stock-price-clustering-on-option-expiration-dates/)) found that closing prices of optionable stocks cluster at strike prices on expiration days and that returns are altered by at least 16.5 basis points on average, attributing most of it to market makers rebalancing their hedges and some to proprietary traders.
- {{label:MECHANISM}} **Why hedging can pin.** Avellaneda and Lipkin ([Quantitative Finance, 2003](https://www.cis.upenn.edu/~mkearns/finread/PinningPaper.pdf)) modelled the effect: when open interest at a strike is unusually large, the aggregate delta-hedging of market makers who are long those options pushes the underlying toward the strike; the probability of pinning rises with open interest and falls with volatility and with time to expiry.
- {{label:EVIDENCE}} **Index futures, too, but in both directions.** Golez and Jackwerth ([Journal of Financial Economics, 2012](https://ideas.repec.org/a/eee/jfinec/v106y2012i3p566-585.html)) found S&P 500 futures pulled toward the at-the-money strike on serial-option expiry days and pushed away from it before index-option expiries, again driven by hedge rebalancing, with a notional shift of at least $115 million per expiry day.
- {{label:EVIDENCE}} **India has an expiry-day pattern, not a max-pain result.** The one peer-reviewed Indian study located, in the [Journal of Futures Markets (2005)](https://ideas.repec.org/a/wly/jfutmk/v25y2005i11p1045-1065.html), found underlying prices marginally depressed the day before NSE expiries and significantly higher the day after, with abnormally high expiry-day volume, and attributed it to arbitrage unwinding and limits on short selling in the cash market.
- {{label:LORE}} **A Nifty or Sensex max-pain hit rate.** No peer-reviewed study of either index settling at its max-pain strike was found on {{date:2026-11-01}}; only vendor and blog backtests exist. Every "the index closes within x points of max pain y per cent of the time" claim is therefore lore until this site's planned statistics page computes a dated figure from exchange data.

Two further points keep the idea in proportion. Pinning, where it exists, is a last-hours effect, not a whole-week forecast, and the pack of positions that could pin the index changes as traders roll. And India's settlement mechanics are moving away from a single closing print: since {{date:2026-08-03}} expiring index options settle on an index built from constituents' closing-auction prices, and from {{date:2026-12-07}} on a thirty-minute volume-weighted index value — an average that is harder to steer than one print. [Expiry-day dynamics](../expiry-day-dynamics/) covers both regimes.

## Reading a chain in five steps

1. **Fix the expiry and the unit.** Nifty weeklies expire on {{fact:fo-nifty-weekly-expiry-day}}; a holiday moves the expiry to the previous trading day ([calendar](../../calendar/)). Note whether OI is in lots or units.
2. **Find the at-the-money strike and the straddle.** The call plus the put at the strike nearest the index is the market's price for the expected move; [Implied volatility, the expected move and IV crush](../iv-expected-move-and-crush/) shows how to read it.
3. **Mark the largest OI strikes above and below.** Call them "where positions sit". Whether they act as support or resistance, and when they fail, is a question for the evidence, not for the chain.
4. **Read change in OI for today's story**, and remember that every added contract has an added seller.
5. **Compare the IV column across strikes and against India VIX.** A put IV far above the call IV at the same distance from the index (skew) prices downside fear; it is a price, not a prediction.

:::warning Base rates first
In FY26, {{fact:sebi-loss-2026-share}} of individual traders in equity derivatives lost money, and about {{fact:opt-buyer-share-fy26}} of them were mainly option buyers ([SEBI, Aug 2026](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf)). A chain shows where the crowd's positions are; it does not say the crowd is wrong. Figures and their sources live in the [verified facts register](../../facts/).
:::

:::evidence What the evidence says
- {{label:MECHANISM}} OI counts contracts open; the long/short build-up grid is a vocabulary, not a forecast. PCR sentiment readings rest on assumptions about who buys puts.
- {{label:EVIDENCE}} US stocks cluster at strikes on expiration days (2005); S&P 500 futures are pulled toward and pushed away from strikes around expiries (2012); hedge rebalancing is the mechanism (2003 model).
- {{label:EVIDENCE}} Indian expiries show a day-before dip, day-after rise and abnormal volume (2005 study).
- {{label:LORE}} Any Nifty or Sensex max-pain hit rate, and any PCR threshold: no Indian primary source exists.
:::
