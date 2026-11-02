---
title: SEBI's retail algo rules: what you must register, and when
section: Algo & systematic
summary: SEBI's February 2025 framework, binding on every broker since {{fact:algo-framework-effective-date}}: the broker answers for every API order, a self-coded algo is registered only above the {{fact:algo-order-rate-threshold}} threshold, static IP and two-factor login are mandatory, black-box providers must be research analysts, and NSE registers an algo within {{fact:algo-registration-tat}}.
updated: 2026-11-02
level: intermediate
order: 1
topics: [algo trading, sebi algo framework, algo id, orders per second, static ip, white-box algo, black-box algo, empanelled algo provider, api trading, research analyst, kill switch, nse operational modalities]
related: [broker-apis-compared, no-code-platforms-and-python-stack, execution-realities-and-architecture, liquidity-slippage-and-sebi-measures, what-sebi-loss-studies-say, order-types-and-products]
sources:
  - SEBI circular CIR/2025/0000013 — Safer participation of retail investors in algorithmic trading (Feb 2025) | https://www.sebi.gov.in/sebi_data/attachdocs/feb-2025/1738665456458.pdf | accessed 2026-11-01
  - SEBI circular CIR/2025/132 — Extension of timeline for implementing the retail algo framework (Sep 2025) | https://www.sebi.gov.in/sebi_data/attachdocs/sep-2025/1759232056254.pdf | accessed 2026-11-01
  - SEBI circular CIR/2025/46 — Extension of timeline for the implementation standards (Apr 2025) | https://www.sebi.gov.in/sebi_data/attachdocs/apr-2025/1743506236509.pdf | accessed 2026-11-01
  - NSE circular INVG/69255 — Detailed operational modalities for the retail algo framework, with annexures (Jul 2025) | https://nsearchives.nseindia.com/content/circulars/INVG69255.zip | accessed 2026-11-01
  - NSE circular INVG/69289 — Corrigendum to the operational modalities, NNF-ID table (Jul 2025) | https://nsearchives.nseindia.com/content/circulars/INVG69289.pdf | accessed 2026-11-01
  - NSE FAQs — Safer participation of retail investors in algorithmic trading (file dated Nov 2025) | https://nsearchives.nseindia.com/web/sites/default/files/inline-files/FAQ_Retail%20Algo_03112025_NSE.pdf | accessed 2026-11-01
  - BSE notice 20250729-58 — Extension in timelines, reproducing SEBI circular CIR/2025/108 (Jul 2025) | https://www.bseindia.com/markets/MarketInfo/DispNewNoticesCirculars.aspx?page=20250729-58 | accessed 2026-11-01
  - BSE notice 20250930-74 — Kill switch mechanism for algo IDs (Sep 2025) | https://www.bseindia.com/markets/MarketInfo/DispNewNoticesCirculars.aspx?page=20250930-74 | accessed 2026-11-01
  - NSE — Decision support tools and algorithmic trading, with the list of empanelled algo providers (page updated May 2026) | https://www.nseindia.com/static/trade/platform-services-non-neat-decision-support-tools-algorithm-trading | accessed 2026-11-01
  - Angel One SmartAPI — Exchange regulations: static IP for API orders (Apr 2026) | https://smartapi.angelbroking.com/exchange-regulations | accessed 2026-11-01
  - Upstox developer API — Announcements, static-IP management endpoints (2026) | https://upstox.com/developer/api-documentation/announcements/ | accessed 2026-11-01
---
## Who answers for an API order

For years an order sent through a broker's API sat in a grey zone: the broker executed it, a third-party platform may have generated it, and nobody was clearly responsible when it misfired. SEBI's circular of {{date:2025-02-04}}, [Safer participation of retail investors in algorithmic trading](https://www.sebi.gov.in/sebi_data/attachdocs/feb-2025/1738665456458.pdf), settles the question. When orders flow through a broker's API, the broker is the principal and any algo provider or fintech vendor acts as the broker's agent. The broker carries the responsibility for the order, for handling the client's grievance and for checking who the client is.

Two consequences follow. First, every algo order that flows through a broker's API must carry a unique identifier issued by the stock exchange, so that an order can be traced to the algo that produced it. Second, every order that arrives through an API counts as an algo order. NSE's [frequently asked questions](https://nsearchives.nseindia.com/web/sites/default/files/inline-files/FAQ_Retail%20Algo_03112025_NSE.pdf) (file dated {{date:2025-11-03}}) are explicit: a client's API orders need the standardised tag even when the client sends them slowly. A script that places one order a day is, in the exchange's eyes, an algo.

Brokers had to change how they let anyone in. The circular bars open APIs: access is only through a unique API key issued to the client (or to the vendor for that client), from a static IP address the broker has whitelisted, with OAuth-based authentication and two-factor login on API access. Brokers may deal only with algo providers the exchanges have empanelled, and must do their own due diligence before onboarding one. [Broker APIs compared](../broker-apis-compared/) shows what each broker's version of these rules looks like in practice.

## When your own code must be registered

The circular left the headline number to the exchanges, and NSE's [operational modalities](https://nsearchives.nseindia.com/content/circulars/INVG69255.zip) of {{date:2025-07-22}} set it: a client-developed algo must be registered with the exchange, through the broker, if it sends more than {{fact:algo-order-rate-threshold}}. Below that rate the algo runs without its own registration, through a predefined API key, and the broker tags its orders with the generic algo identifier "99999" (and a zero in the thirteenth digit of the fifteen-digit NNF identifier that every order message carries). Above it, the algo is registered and receives its own algo ID.

A registered self-coded algo may be used for the investor's own account and for family — spouse, dependent children and dependent parents — but not for other investors. That is the line between a retail coder and an algo provider: the moment someone else trades on your logic, you are in the provider category, with the empanelment and research-analyst rules below.

### Static IP and the "tech-savvy" investor

The static-IP rule applies to what the modalities call a tech-savvy investor: someone who hosts the algo at their own end and sends orders to the broker's API from their own machine. That investor needs a static IP address, whitelisted with the broker, from which every API order originates. An investor who uses an empanelled vendor's platform does not: the vendor's algo runs on the broker's servers, and the broker's server IP covers it. The FAQ also spares the tech-savvy investor the monthly mock trading sessions, because the logic and its outcome are the investor's own while risk management stays with the broker.

### What the registration asks for

Registering a client-developed algo that runs above the threshold needs three documents, submitted by the broker: an auditor's certificate on the format in the modalities' annexure, a write-up of the strategy, and a write-up of the risk-management controls. NSE's turnaround time is {{fact:algo-registration-tat}}; execution algos use a faster track (T+7 working days) and empanelling a new provider takes longer (T+30). Re-registration is required whenever the logic changes, when the broker's order- or risk-management system changes in a way that alters the algo's code, for a change of segment or version, for a change mandated by the exchange or a new SEBI circular, for a change in the login or password policy, and when the broker's API itself changes.

## White box, black box and the research-analyst rule

The circular sorts algos into two classes. A **white-box** algo discloses its logic, which the client could replicate; the circular calls these execution algos, and NSE's categorisation lists execution, TWAP and VWAP algos as the typical members. A **black-box** algo keeps its logic hidden; the exchange's examples are arbitrage, alpha-seeking, high-frequency, scalping and "others".

The classes carry different duties. A provider offering a black-box algo must be registered with SEBI as a [research analyst](../../glossary/#research-analyst-sebi-registered), must keep a research report for every algo it offers, and must register any change in logic as a fresh algo — a registered black-box algo cannot be modified in place. NSE's FAQ adds the order of operations: a research analyst who wants to deploy a black-box algo must first become an empanelled algo provider. None of this binds an investor whose own code trades their own account; the categories matter when you buy or subscribe to someone else's strategy, and [No-code platforms versus a Python stack](../no-code-platforms-and-python-stack/) covers that choice.

## Empanelled providers and what the broker must do

Algo providers are not regulated by SEBI. They are empanelled with the exchanges, which set the criteria, and they work as the broker's agent. A broker may share its subscription charges or brokerage with a provider as long as the client is told. The exchanges keep a standard operating procedure for testing algos, run surveillance on all algo orders and hold a kill switch that can halt the orders of any algo ID; the circular describes the kill switch as an emergency, last-line control that stops trading on pre-defined conditions. BSE's [notice of {{date:2025-09-30}}](https://www.bseindia.com/markets/MarketInfo/DispNewNoticesCirculars.aspx?page=20250930-74) describes its three actions — cancel the pending orders of an algo ID, stop its incoming orders, revoke the stop — and [Execution realities](../execution-realities-and-architecture/) explains where a trader's own kill switch sits beside them.

On the broker's side the modalities add operating rules: no crossing of one client's orders against another's, every API order routed through the member's trading system with the routing server in India, an audit trail that identifies the real user and is kept for five years, two-factor authentication on API access, and the unique client API key plus whitelisted static IP. Members who offer algo-provider or API services must also meet the base minimum capital of the category that covers brokers with algos. NSE's [algo page](https://www.nseindia.com/static/trade/platform-services-non-neat-decision-support-tools-algorithm-trading), updated {{date:2026-05-27}}, publishes the list of empanelled providers and points members who want to offer a "Client Direct API" to circular NSE/INVG/73992 of {{date:2026-04-30}}.

## The timeline, date by date

The framework arrived in instalments, and the date that matters to a retail trader is the last one: it has applied to every broker since {{fact:algo-framework-effective-date}}.

| Date | What happened | Where it is written |
|---|---|---|
| {{date:2025-02-04}} | SEBI issues the framework; implementation standards due by {{date:2025-04-01}}, provisions to apply from {{date:2025-08-01}} | [SEBI circular](https://www.sebi.gov.in/sebi_data/attachdocs/feb-2025/1738665456458.pdf), para 7 |
| {{date:2025-04-01}} | Standards deadline moved to {{date:2025-05-01}}; the {{date:2025-08-01}} date kept | [SEBI circular](https://www.sebi.gov.in/sebi_data/attachdocs/apr-2025/1743506236509.pdf) |
| {{date:2025-05-05}} | NSE publishes the implementation standards (NSE/INVG/67858); BSE follows the next day | cited in the [operational modalities](https://nsearchives.nseindia.com/content/circulars/INVG69255.zip) |
| {{date:2025-07-22}} | NSE's detailed operational modalities: the {{fact:algo-order-rate-threshold}} threshold, turnaround times, re-registration triggers; BSE's notice follows on {{date:2025-07-23}} | [NSE/INVG/69255](https://nsearchives.nseindia.com/content/circulars/INVG69255.zip) |
| {{date:2025-07-29}} | Applicability moved from {{date:2025-08-01}} to {{date:2025-10-01}} | [BSE notice reproducing SEBI CIR/2025/108](https://www.bseindia.com/markets/MarketInfo/DispNewNoticesCirculars.aspx?page=20250729-58) |
| {{date:2025-09-19}} | Exchanges clarify the modalities (NSE/INVG/70309) | cited in the Sep 2025 SEBI circular, para 2 |
| {{date:2025-09-30}} | Glide path: brokers that are ready go live on {{date:2025-10-01}}; the rest apply to register their API algo product and one strategy by {{date:2025-10-31}}, finish registration by {{date:2025-11-30}} and join a mock session by {{date:2026-01-03}}; from {{date:2026-01-05}} a broker still not ready may take no new API-algo clients | [SEBI circular](https://www.sebi.gov.in/sebi_data/attachdocs/sep-2025/1759232056254.pdf), paras 4–8 |
| {{date:2026-04-01}} | The framework, standards and modalities apply to all brokers | same circular, final para |
| {{date:2026-04-30}} | NSE's application process for members offering a Client Direct API (NSE/INVG/73992) | [NSE algo page](https://www.nseindia.com/static/trade/platform-services-non-neat-decision-support-tools-algorithm-trading) |

Brokers published matching deadlines: Angel One's [exchange-regulations page](https://smartapi.angelbroking.com/exchange-regulations) accepts API orders only from the client's registered static IP from {{date:2026-04-01}}, and Upstox's [developer announcements](https://upstox.com/developer/api-documentation/announcements/) added static-IP management endpoints on {{date:2026-04-10}}.

:::example Worked example — a bot at the open
A Python bot that sends three orders a second in the first minutes after the open stays inside the {{fact:algo-order-rate-threshold}} threshold. It needs no registration of its own, but it still needs the broker's API key, a two-factor login and a whitelisted static IP, and every order it sends is tagged "99999". Scale the same bot to twenty-five orders a second and it must be registered: the broker submits the auditor's certificate, the strategy write-up and the risk-management write-up, NSE answers within {{fact:algo-registration-tat}}, and the bot trades under its own algo ID. Whether the broker's own API throttle lets you reach twenty-five orders a second is a separate question, answered in [Execution realities](../execution-realities-and-architecture/). This site quotes no VPS or ISP prices; a static IP is something you buy from an internet provider or a hosting company.
:::

## Before your first API order

- Check that your broker completed its registration. A broker that missed the glide path has been barred from taking new API-algo clients since {{date:2026-01-05}}, and the easiest sign is a developer console that asks for your static IP.
- Get a static IP and whitelist it in the broker's dashboard. Angel One's field is in the SmartAPI dashboard; Upstox exposes it as an API endpoint; others have their own forms.
- Turn on the time-based one-time password for your account. API logins use OAuth with that second factor.
- Count your own order rate. Stay under the threshold, or register and accept the paperwork and the {{fact:algo-registration-tat}} wait.
- Keep your own logs. Brokers must keep an audit trail for five years; a trader should at least keep the orders, the fills and the reasons.

:::rule Rules, not edges
Nothing in this framework makes an algo profitable. SEBI's FY26 study found that {{fact:sebi-loss-2026-share}} of individual F&O traders lost money; [What SEBI's loss studies say](../what-sebi-loss-studies-say/) has the figures. The framework decides who is answerable when an order goes wrong, and the dates and thresholds above are in the site's [verified facts register](../../facts/) with their sources.
:::
