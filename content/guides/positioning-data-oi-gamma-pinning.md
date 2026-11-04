---
title: Positioning data, dealer gamma and expiry pinning
section: Edges, habits & traps
summary: What NSE Clearing's participant-wise open-interest report proves, why it does not forecast direction, what US studies and Indian expiry evidence say about dealer hedging and pinning, and why a large strike-OI wall or a vendor Nifty gamma level can fail.
updated: 2026-11-04
level: advanced
order: 1
topics: [participant-wise oi, futeq, fii, proprietary traders, dealer gamma, gamma exposure, pinning, max pain, strike oi walls, closing auction]
related: [reading-the-option-chain, expiry-day-dynamics, oi-shift-breakout, volatility-tells-skew-term-structure]
sources:
  - NSE Clearing — Participant-wise open interest, daily report (Oct 2026) | https://nsearchives.nseindia.com/content/nsccl/fao_participant_oi_30102026.csv | accessed 2026-11-01
  - SEBI circular May 2025 — Future-equivalent open interest and position limits | https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748521484014.pdf | accessed 2026-11-01
  - SEBI — Retail participation, behaviour and profitability in equity derivatives (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf | accessed 2026-11-01
  - Ni, Pearson and Poteshman — Stock price clustering on option expiration dates, Journal of Financial Economics (2005) | https://experts.illinois.edu/en/publications/stock-price-clustering-on-option-expiration-dates/ | accessed 2026-11-01
  - Avellaneda and Lipkin — A market-induced mechanism for stock pinning, Quantitative Finance (2003) | https://www.cis.upenn.edu/~mkearns/finread/PinningPaper.pdf | accessed 2026-11-01
  - Golez and Jackwerth — Pinning in S&P 500 futures, Journal of Financial Economics (2012) | https://ideas.repec.org/a/eee/jfinec/v106y2012i3p566-585.html | accessed 2026-11-01
  - Baltussen, Da, Lammers and Martens — Hedging demand and market intraday momentum, Journal of Financial Economics (2021) | https://ideas.repec.org/a/eee/jfinec/v142y2021i1p377-403.html | accessed 2026-11-01
  - Barbon and Buraschi — Gamma Fragility (2021), author paper | https://abarbon.com/assets/Barbon_Buraschi_2021_Gamma_Fragility.pdf | accessed 2026-11-01
  - Journal of Futures Markets — Futures and options expiration-day effects: Indian evidence (2005) | https://ideas.repec.org/a/wly/jfutmk/v25y2005i11p1045-1065.html | accessed 2026-11-01
  - SEBI interim order — Sensex expiry and the closing auction (Aug 2026) | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/ORDER_1787144554.pdf | accessed 2026-11-01
  - NSE — Nifty 50 derivatives contract specifications | https://www.nseindia.com/products-services/equity-derivatives-nifty50 | accessed 2026-11-01
  - SEBI circular Oct 2026 — Closing auction, market times and derivatives settlement | https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf | accessed 2026-11-01
---
## Participant-wise OI: a report, not a compass

{{label:EVIDENCE}} **The data exists.** [NSE Clearing's participant-wise OI report](https://nsearchives.nseindia.com/content/nsccl/fao_participant_oi_30102026.csv) is an end-of-day file with Client, DII, FII and Pro rows. Each row splits index and stock futures, calls and puts into long and short open interest. It answers a narrow question: which broad participant bucket held contracts at the close? It does not identify an account, separate a speculative position from a hedge or reveal what happened after the snapshot.

The file for {{date:2026-10-30}} is a useful warning against storytelling. Clients held 35,59,948 long index puts and 41,26,285 short index puts, a net short count of 5,66,337. FIIs held 12,27,641 long and 7,11,954 short index puts, a net long count of 5,15,687. One observer can call the first row bullish because clients sold puts; another can call the second bearish because institutions held puts. Both descriptions use the same file, and neither establishes what the next Nifty return will be.

:::example Contracts, lots and FutEq are different
A mechanical division of 5,66,337 by the Nifty lot size, {{fact:fo-nifty-lot}}, gives about 8,713 lots. That is only a unit conversion. SEBI's [May 2025 circular](https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748521484014.pdf) measures regulatory exposure as future-equivalent OI: each option is multiplied by its delta, while a future has a weight of one. Until the strikes and deltas are known, neither the net contract count nor the lots conversion is a directional exposure number.
:::

{{label:EVIDENCE}} **The other side is well resourced.** SEBI's [FY26 study](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787236407005.pdf) reports roughly ₹44,000 crore of gross equity-derivatives profit for proprietary traders and ₹14,000 crore for FPIs, with almost all of that profit attributed to entities using algorithms; individuals lost roughly ₹72,000 crore gross. The result describes who earned in that year. It does not turn tonight's Pro or FII row into tomorrow's signal.

{{label:LORE}} **“Follow the FII OI” is the edge claim.** No published Indian study located for this site tests whether the participant-wise file predicts the next session's Nifty direction after costs. The report is evidence about positions. Treating its sign as a forecast remains lore. [Reading the option chain](../reading-the-option-chain/) explains the same distinction at strike level.

## Dealer gamma and pinning

{{label:MECHANISM}} An option dealer who is short gamma must buy the underlying as it rises and sell as it falls to restore a delta hedge. That trading reinforces a move. A dealer who is long gamma does the reverse and can damp it. Near expiry, gamma is concentrated around the at-the-money strike, so a large inventory can create momentum away from a strike or repeated hedging back toward it. Avellaneda and Lipkin's [pinning model](https://www.cis.upenn.edu/~mkearns/finread/PinningPaper.pdf) makes the mechanism explicit: more open interest raises the modelled pull, while more volatility and more time weaken it.

{{label:EVIDENCE}} **US expiry evidence.** Ni, Pearson and Poteshman found US optionable stocks clustering at strikes on expiration days and an average return displacement of at least 16.5 basis points ([Journal of Financial Economics, 2005](https://experts.illinois.edu/en/publications/stock-price-clustering-on-option-expiration-dates/)). Golez and Jackwerth found S&P 500 futures pulled toward the at-the-money strike on serial-option expiries but pushed away before index-option expiries, with at least $115 million of notional displacement per expiry day ([2012 paper](https://ideas.repec.org/a/eee/jfinec/v106y2012i3p566-585.html)). Pinning is therefore conditional, not a rule that every large strike becomes a magnet.

{{label:EVIDENCE}} **Gamma can also amplify.** A study of more than sixty futures markets over 1974–2020 linked short-gamma hedging demand to same-direction returns late in the session and reversal over following days ([Baltussen and co-authors, 2021](https://ideas.repec.org/a/eee/jfinec/v142y2021i1p377-403.html)). [Barbon and Buraschi](https://abarbon.com/assets/Barbon_Buraschi_2021_Gamma_Fragility.pdf) found negative dealer-gamma imbalance associated with intraday momentum and positive imbalance with reversal in US data. These are US and global results built with dealer-position estimates, not a study of Nifty dealers.

:::example The hedge-flow arithmetic
Take a schematic dealer short 10,000 Nifty straddle lots, gamma 0.0012 per index point. After a 100-point move the delta changes by 0.12 per option unit. The hedge change is 0.0012 × 100 × {{fact:fo-nifty-lot}} × 10,000 = 78,000 Nifty units. At an illustrative index level of 25,000, that is about ₹195 crore of futures notional. This recomputation is ten times the often-quoted ₹19.5 crore shortcut. It explains how a large book could matter; it does not show that such an Indian dealer book exists.
:::

{{label:EVIDENCE}} **Indian evidence is narrower.** A [2005 NSE study](https://ideas.repec.org/a/wly/jfutmk/v25y2005i11p1045-1065.html) found a mild fall before expiry, a rise after it and unusually high expiry volume, attributing the pattern to arbitrage unwinds and short-sale constraints. On {{date:2026-08-13}}, SEBI recorded the indicative Sensex moving hundreds of points within seconds in the closing auction while entities held expiry-day options; its [interim order](https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/ORDER_1787144554.pdf) later barred two entities from that auction and impounded ₹3.68 crore. One enforcement case proves that the settlement window can be attacked. It is not an estimate of ordinary pinning frequency.

{{label:LORE}} **A public Nifty GEX level is not observed data.** NSE publishes participant buckets, not a dealer or market-maker inventory. A vendor can multiply strike OI by model gamma and assume which side dealers hold; changing that assumption reverses the sign. The calculation may be internally consistent, but the hidden dealer side makes any Indian “gamma flip” or “zero-gamma level” lore unless the vendor discloses and validates it.

## Strike-OI walls: story, claim and failure

{{label:MECHANISM}} A strike with large OI can matter because hedgers may trade the underlying as delta changes, and because traders closing or rolling positions create orders near the strike. NSE's [contract page](https://www.nseindia.com/products-services/equity-derivatives-nifty50) also shows why round strikes gather positions: Nifty options are introduced on a fixed ladder around the index. That is a causal route from inventory to flow.

{{label:LORE}} Calling a large put-OI strike “support” or a large call-OI strike “resistance” goes further. OI contains one long and one short, says nothing about either side's hedge and is reported after trades have occurred. A wall can be old, spread against another expiry or delta-neutral. No Indian public study found for this guide measures its support-and-resistance hit rate. The [OI-shift breakout](../../playbooks/oi-shift-breakout/) therefore uses price as the trigger and OI only as context.

{{label:EVIDENCE}} Walls fail when event flow overwhelms inventory. On {{date:2024-06-04}}, Nifty fell 8.5 per cent from the previous close at its intraday low and closed down 5.93 per cent in the exchange's [index file](https://nsearchives.nseindia.com/content/indices/ind_close_all_04062024.csv). On the Sensex expiry above, the auction itself moved the settlement reference. Neither existing OI nor a round strike prevented the move.

Settlement design changes the final-hour mechanism too. From {{date:2026-12-07}}, expiring index derivatives stop at {{fact:opt-expiring-index-close-time-from-2026-12-07}} and settle on an index built from constituents' last half-hour volume-weighted prices under SEBI's [October 2026 circular](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2026/1792079571420.pdf). A half-hour average is harder to pin with one late print. [Expiry-day dynamics](../expiry-day-dynamics/) covers both settlement regimes.

## A hierarchy for using positioning data

1. {{label:EVIDENCE}} Start with what is published: the NSE Clearing report, its date, participant bucket, contract type and long/short columns.
2. {{label:MECHANISM}} Convert options to delta-adjusted exposure before comparing them with futures; raw contracts are not FutEq.
3. {{label:LORE}} Treat a directional story from one participant row, a strike wall or a vendor GEX level as a hypothesis, never as the trigger.
4. {{label:EVIDENCE}} Check the hypothesis against price, liquidity and the event calendar. Election day and the Sensex auction show that a wall can disappear exactly when it seems most useful.

The edge here is not secret data. It is refusing to claim that a descriptive report predicts something it never measured.
