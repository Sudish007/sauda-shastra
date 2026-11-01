// Shared fixtures for the unit tests (not a test file: node --test matches *.test.js only).

/** The five home-hero facts (design §6.6) with one shared verified date; any non-empty register must hold them. */
export const HERO_FACTS = [
  { id: 'sebi-loss-2026-share', label: 'Loss-making individual F&O traders, FY26', value: '87.7%', since: '2026-08-20', source: 'SEBI DEPA-II profitability study (FY25–FY26), 20 Aug 2026 | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf', verified: '2026-11-01' },
  { id: 'sebi-loss-2026-amount', label: 'Net loss of individual F&O traders, FY26', value: '₹91,685 crore', since: '2026-08-20', source: 'SEBI DEPA-II profitability study (FY25–FY26), 20 Aug 2026 | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf', verified: '2026-11-01' },
  { id: 'sebi-loss-2026-avg', label: 'Average net loss per individual F&O trader, FY26', value: '₹1.17 lakh', since: '2026-08-20', source: 'SEBI DEPA-II profitability study (FY25–FY26), 20 Aug 2026 | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf', verified: '2026-11-01' },
  { id: 'sebi-costs-share', label: 'Costs as a share of loss-makers’ gross losses, FY26', value: '35%', since: '2026-08-20', source: 'SEBI DEPA-II profitability study, 20 Aug 2026, pp. 66–67 | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233506209.pdf', verified: '2026-11-01' },
  { id: 'sebi-loss-2026-five-year-consistent', label: 'Traders profitable in all five years FY22–FY26', value: '0.5%', since: '2026-08-20', source: 'SEBI DEPA-II trading-behaviour study, 20 Aug 2026, p. 7 | https://www.sebi.gov.in/sebi_data/attachdocs/aug-2026/1787233601328.pdf', verified: '2026-11-01' },
];

/**
 * A minimal valid content object (the empty set) with overrides, so validate() and the renderers can be exercised.
 * A non-empty `facts` list gets the hero rows appended (the build requires them) unless `hero: false`.
 */
export function makeContent(over = {}, { hero = true } = {}) {
  const c = { guides: [], playbooks: [], pages: {}, facts: [], glossary: [], calendar: { note: '', filters: [], events: [] }, changelog: [], resources: [], library: { courses: [], books: [], path: { intro: '', stages: [] } }, reviewed: '2026-11-01', ...over };
  if (hero && c.facts.length && !c.facts.some((f) => f.id === HERO_FACTS[0].id)) c.facts = [...c.facts, ...HERO_FACTS];
  c.byFact = Object.fromEntries(c.facts.map((f) => [f.id, f]));
  c.byGuide = Object.fromEntries(c.guides.map((g) => [g.slug, g]));
  c.byPlaybook = Object.fromEntries(c.playbooks.map((p) => [p.slug, p]));
  return c;
}

export const FACTS = [
  { id: 'chg-stt-options-sell', label: 'STT on option sell (premium)', value: '0.1%', since: '2024-10-01', source: 'Finance (No. 2) Act 2024 | https://example.gov/finance-act-2024', verified: '2026-11-01' },
  { id: 'fo-nifty-lot', label: 'Nifty 50 lot size', value: '65', since: '2026-01-06', source: 'NSE circular FAOP/70616 | https://example.org/faop70616.pdf', verified: '2026-11-01' },
];
export const FACT_MAP = Object.fromEntries(FACTS.map((f) => [f.id, f]));

export const GUIDE = `---
title: Market sessions in IST
section: Foundations
summary: What happens between the open and the close on NSE and BSE, and why the first fifteen minutes behave differently from the rest of the day.
updated: 2026-11-01
level: beginner
reading_time: 7
topics: [sessions, pre-open, nse]
related: []
sources:
  - NSE market timings | https://www.nseindia.com/resources/exchange-communication-holidays | accessed 2026-11-01
---
## Pre-open

Orders collect before the open. STT on an option sale is {{fact:chg-stt-options-sell}} of premium, and it is still {{fact:chg-stt-options-sell}} on the next sale.

## Continuous session

Text.

## Closing session

Text.
`;

export const SCHEMATIC = `<figure class="schematic"><svg viewBox="0 0 720 280" role="img" aria-labelledby="t1"><title id="t1">range then breakout</title><rect class="band" x="60" y="150" width="190" height="70" vector-effect="non-scaling-stroke"/><line class="stop" x1="250" y1="185" x2="700" y2="185" vector-effect="non-scaling-stroke"/></svg><figcaption class="legend"><ul><li><span class="sw sw-band" aria-hidden="true"></span><span>Shaded band — the opening range</span></li><li><span class="sw sw-line sw-stop" aria-hidden="true"></span><span>Short-dashed ▼ line — stop</span></li></ul><p>Time runs left to right. Schematic, not real data.</p></figcaption></figure>`;

export const PLAYBOOK = `---
title: 15-minute opening range breakout
summary: Trade the break of the first fifteen-minute range on the index, with a volatility-scaled stop and a time stop.
updated: 2026-11-01
level: intermediate
instruments: [Nifty 50 futures, Nifty 50 options]
window: 09:30–11:00 IST
glance_stop: Range midpoint (tight) or the opposite side of the range (loose)
glance_target: One range width, then trail under 5-minute swings
glance_size: 1% of capital per attempt; two attempts a day
evidence: MECHANISM
topics: [orb, breakout]
related: []
sources:
  - Opening range research | https://example.org/orb | accessed 2026-11-01
---
## Context & instruments
a
## Time window (IST)
a
## Pre-conditions
a
## Entry
a
## Stop
One lot is {{fact:fo-nifty-lot}} units.
## Target / exit
a
## Position-size rule
a
## When NOT to trade
a
## Known failure modes
a
## Evidence label
:::evidence
- {{label:EVIDENCE}} A study.
- {{label:LORE}} A claim.
:::
## Schematic
${SCHEMATIC}
`;
