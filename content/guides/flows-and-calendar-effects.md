---
title: Flows and calendar effects: rebalance, rollover and the open
section: Edges, habits & traps
summary: Which calendar flows are published and which are stories: Nifty rebalances, futures rollover, GIFT Nifty before the open, the first fifteen minutes, monthly SIP money and RBI intervention. Each claim is separated into evidence, mechanism or lore.
updated: 2026-11-04
level: intermediate
order: 3
topics: [index rebalance, nifty 50 review, rollover, gift nifty, opening range, pre-open, sip flows, rbi intervention, calendar effects]
related: [overnight-chain-to-india-open, flows-rupee-and-rbi, trading-day-ist, orb-15-min-nifty, volatility-tells-skew-term-structure]
sources:
  - NSE Indices — Nifty equity-indices methodology (Sep 2026) | https://www.niftyindices.com/Methodology/Method_NIFTY_Equity_Indices.pdf | accessed 2026-11-01
  - Chhatwani — Price and volume effects of Nifty 50 index reorganisation (2020) | https://www.publishingindia.com/storage/PDFBrochures/6125.pdf | accessed 2026-11-01
  - SEBI circular May 2025 — Futures pre-open, rollover and risk monitoring | https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748521484014.pdf | accessed 2026-11-01
  - NSE circular FAOP/71582 — Equity-derivatives pre-open update (Dec 2025) | https://nsearchives.nseindia.com/content/circulars/FAOP71582.pdf | accessed 2026-11-01
  - Domestic and international information linkages between Nifty spot and futures, Decision (2016) | https://link.springer.com/article/10.1007/s40622-016-0137-1 | accessed 2026-11-01
  - NSE IX — GIFT Nifty 50 index derivatives | https://www.nseix.com/products/equity-derivatives/gift-nifty-50-index-derivatives | accessed 2026-11-01
  - NSE IX — Trading hours | https://www.nseix.com/markets/trading/tradinghoursnew | accessed 2026-11-01
  - Intraday liquidity patterns in the Indian stock market, Journal of Asian Economics (2013) | https://ideas.repec.org/a/eee/asieco/v28y2013icp99-114.html | accessed 2026-11-01
  - SEBI circular Jan 2026 — Cash pre-open and the Closing Auction Session | https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf | accessed 2026-11-01
  - AMFI — Monthly note, Sep 2026 | https://www.amfiindia.com/uploads/AMFI_Monthly_Note_September2026_554f6604b6.pdf | accessed 2026-11-01
  - RBI DBIE — US dollar purchases and sales by the RBI | https://dbie.rbihub.in/banking/usd-sale-purchase | accessed 2026-11-01
---
## Index rebalances: known dates, uncertain profits

{{label:EVIDENCE}} NSE Indices publishes the Nifty 50 review rule in its [methodology](https://www.niftyindices.com/Methodology/Method_NIFTY_Equity_Indices.pdf). The index is reviewed twice a year using six-month data ending in January and July. Changes take effect on the last trading day of March and September after about four weeks' notice. That makes the date and the names public before passive funds must hold the new weights.

{{label:MECHANISM}} A fund tracking Nifty 50 has to buy an entrant and sell an exclusion, normally near the effective close so tracking error stays small. Active traders can position earlier after the notice. The chain is real: announcement, anticipatory orders, benchmark-close flow, then the removal of forced demand. It does not say which part of the chain remains profitable after everyone reads the same notice.

{{label:EVIDENCE}} One Indian study of Nifty 50 reorganisations over 2000–2016 found positive abnormal returns around inclusion that later reversed, while excluded shares showed roughly four to seven per cent positive abnormal returns over horizons from sixty to 240 days after removal ([Chhatwani, 2020](https://www.publishingindia.com/storage/PDFBrochures/6125.pdf)). The sample ends in 2016. It predates much of the current passive-fund base, closing-auction design and speed of algorithmic execution, so the measured anomaly is evidence of a historical effect, not a current intraday rule.

:::example A flow map, not an order
Suppose a stock's announced index weight implies ₹2,000 crore of benchmark demand. The useful questions are not “buy or sell?” They are how much is already owned by trackers, how much volume the stock normally trades, what portion can be crossed in the closing auction and how far price moved after the notice. If the market has already repriced the full demand, the effective-day order can mark the end of the move. The amount is illustrative; the methodology supplies dates, not rupee flows.
:::

## Rollover: visible migration, untested sentiment

{{label:MECHANISM}} A futures contract loses liquidity as its monthly expiry approaches while the next-month contract gains it. Closing the near contract and opening the far contract is a rollover. The calendar spread between their prices reflects financing, dividends, positioning and temporary order pressure. Volume and OI migrating from one contract to the next are observable; interpreting the migration as bullish or bearish is separate.

The regulator recognises that migration in market structure. SEBI's [May 2025 circular](https://www.sebi.gov.in/sebi_data/attachdocs/may-2025/1748521484014.pdf) extended the futures pre-open to next-month contracts in the final five sessions before expiry. NSE went live on {{date:2025-12-08}}: current-month stock and index futures use the {{fact:mkt-fo-preopen-since}} window, and next-month futures join during those last sessions ([NSE update](https://nsearchives.nseindia.com/content/circulars/FAOP71582.pdf)). This is the exchange go-live date, not the preceding Saturday in the regulatory timeline.

{{label:LORE}} “High rollover is bullish” has no public Indian study behind it in the research pack. A high percentage can be longs renewed, shorts renewed or hedges moved as one spread. The direction lives in the basis and in who owns each side, neither of which a headline rollover percentage identifies. Use rollover to know where liquidity is, not to infer sentiment.

## GIFT Nifty: an overnight lead, not a superior venue

{{label:MECHANISM}} GIFT Nifty trades while NSE is closed, in the {{fact:mac-gift-nifty-session-1}} and {{fact:mac-gift-nifty-session-2}} windows. US data, the New York close and the first Asian sessions therefore reach a Nifty-linked futures price before India's cash pre-open. That is why the quote leads the *opening gap*. The [overnight chain](../overnight-chain-to-india-open/) shows the full clock and why the same-expiry NSE futures close is the right comparison.

{{label:EVIDENCE}} The stronger claim, that the offshore venue discovers Nifty's price better whenever both markets trade, is contradicted by the available study. Using data from August 2008 to March 2015, researchers found NSE spot leading NSE futures and NSE futures leading the SGX, Osaka and CME Nifty contracts during overlapping hours ([Decision, 2016](https://link.springer.com/article/10.1007/s40622-016-0137-1)). The venue now sits at GIFT City rather than Singapore, but the evidence still warns against confusing overnight availability with superior daytime discovery.

{{label:LORE}} A one-for-one forecast remains lore. A quote one hundred points above the prior close does not establish a one-hundred-point NSE opening: futures basis, USD/INR, news after the time stamp and the cash pre-open can all alter it. No exchange publication gives that forecast a hit rate.

:::example Put a hundred points in context
At an illustrative Nifty level of 25,000, one hundred points is 0.4 per cent. With an illustrative annual volatility of twelve per cent, one trading-day σ is about 12% ÷ √252 = 0.76 per cent, or roughly 189 points. The gap is therefore just over half a normal one-σ day. One Nifty lot changes by ₹100 × {{fact:fo-nifty-lot}} = ₹6,500 for that move. This comparison sizes the information; it does not predict whether the auction accepts it.
:::

## The first fifteen minutes

{{label:EVIDENCE}} Indian intraday research finds a U-shaped liquidity day: volume is high and spreads wide after the open, both ease through the middle and rise again near the close ([Journal of Asian Economics, 2013](https://ideas.repec.org/a/eee/asieco/v28y2013icp99-114.html)). High volume at the open does not mean cheap execution, because the wide spread and rapid repricing can dominate it. This evidence supports the *shape* of the opening period, not an opening-range strategy's return.

{{label:MECHANISM}} The opening print follows an auction. Under SEBI's [January 2026 circular](https://www.sebi.gov.in/sebi_data/attachdocs/jan-2026/1768576287344.pdf), cash orders enter in the {{fact:mkt-preopen-window}} window, which ends randomly in its final two minutes, then match and transition into continuous trading. Futures have had their own pre-open since {{date:2025-12-08}}. Overnight imbalance meets the continuous book at the open, which explains the large volume and wide spread.

{{label:LORE}} The claim that the first fifteen-minute high or low predicts the day's direction, or that a Nifty ORB wins at a stated rate, remains lore. The site's [computed statistics](../../stats/#ranges) measure full-session daily ranges and weekday distributions, not intraday bars. They cannot upgrade an ORB hit rate. The [15-minute Nifty playbook](../../playbooks/orb-15-min-nifty/) keeps its Lore label for that reason.

## SIP dates: large flow, missing clock

{{label:EVIDENCE}} AMFI's latest monthly note in the register puts SIP contributions at {{fact:inv-sip-monthly-inflow}} and industry assets at {{fact:inv-mf-industry-aum}} ([AMFI, September 2026](https://www.amfiindia.com/uploads/AMFI_Monthly_Note_September2026_554f6604b6.pdf)). The aggregate is large enough to matter to fund cash management. It establishes the month's size, not the day on which money reached the market.

{{label:LORE}} AMFI does not publish the distribution of SIP debit dates, the time fund houses receive cash or the dates on which each scheme deploys it. “SIP money lifts Nifty at the start of the month” therefore skips three unobserved steps. Without those data and a return study, a particular SIP-date effect is lore. The older March draft was dropped in favour of the newer September figure shown above.

## RBI intervention tells

{{label:MECHANISM}} The RBI publishes outright dollar purchases and sales and its forward position in the monthly Bulletin, mirrored in the [DBIE intervention series](https://dbie.rbihub.in/banking/usd-sale-purchase). The lag is weeks. Comparing the eventual series with reserves and USD/INR can explain a past month; it cannot identify a trade on today's screen. [FII and DII flows, the rupee and the RBI](../flows-rupee-and-rbi/) explains the two official flow series and the exchange-rate channel.

{{label:LORE}} State-owned banks selling dollars near a round number, a sudden rupee reversal or a quiet patch after a spike are commonly called “RBI tells”. No public real-time source confirms the counterparty, and the later monthly total cannot match an intervention to a minute. The observation may be a dealer's useful hypothesis. It is not verifiable evidence of an intraday RBI trade.

## What belongs on the calendar

- {{label:EVIDENCE}} Put published dates on it: index review notices and effective closes, monthly expiry and official data releases.
- {{label:MECHANISM}} Mark liquidity migrations: the final sessions before futures expiry and the pre-open windows.
- {{label:LORE}} Keep forecast claims off it: rollover sentiment, a one-for-one GIFT lead, an ORB hit rate, a SIP-date lift and an intraday RBI tell.

A calendar is an edge only in the modest sense that it prevents surprise. The direction still has to come from price and risk has to come from a pre-written limit.
