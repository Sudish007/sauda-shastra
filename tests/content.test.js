import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent, validate, parseGuide, parsePlaybook, parseSources, checkPlaybookTemplate, SECTIONS, PLAYBOOK_SECTIONS } from '../src/build/content.js';
import { parseFrontMatter, renderMarkdown } from '../src/build/markdown.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const content = await loadContent(path.join(root, 'content'));

/** A minimal valid content object (the empty set) with overrides, so validate() can be exercised with fixtures. */
function makeContent(over = {}) {
  const c = { guides: [], playbooks: [], facts: [], glossary: [], calendar: { note: '', filters: [], events: [] }, changelog: [], resources: [], library: { courses: [], books: [], path: { intro: '', stages: [] } }, reviewed: '2026-11-01', ...over };
  c.byFact = Object.fromEntries(c.facts.map((f) => [f.id, f]));
  c.byGuide = Object.fromEntries(c.guides.map((g) => [g.slug, g]));
  c.byPlaybook = Object.fromEntries(c.playbooks.map((p) => [p.slug, p]));
  return c;
}

const FACTS = [{ id: 'stt-options-sell', label: 'STT on option sell (premium)', value: '0.1%', since: '2024-10-01', source: 'Finance (No. 2) Act 2024 | https://example.gov/finance-act-2024', verified: '2026-11-01' }];

const GUIDE = `---
title: Market sessions in IST
section: Foundations
summary: What happens between 09:00 and 15:30 on NSE and BSE, and why the first fifteen minutes behave differently from the rest of the day.
updated: 2026-11-01
level: beginner
reading_time: 7
topics: [sessions, pre-open, nse]
related: []
sources:
  - NSE market timings | https://www.nseindia.com/resources/exchange-communication-holidays | accessed 2026-11-01
---
## Pre-open

Orders collect from 09:00. STT on an option sale is {{fact:stt-options-sell}} of premium.

## Continuous session

Text.

## Closing session

Text.
`;

const PLAYBOOK = `---
title: 15-minute opening range breakout
summary: Trade the break of the first fifteen-minute range on the index, with a volatility-scaled stop and a time stop.
updated: 2026-11-01
level: intermediate
instruments: [Nifty 50 futures, Nifty 50 options]
window: 09:30–11:00 IST
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
a
## Target / exit
a
## Position-size rule
a
## When NOT to trade
a
## Known failure modes
a
## Evidence label
MECHANISM
## Schematic
<figure><svg viewBox="0 0 100 40" role="img" aria-label="range then breakout"><rect x="10" y="10" width="30" height="20"/></svg><figcaption>schematic, not real data</figcaption></figure>
`;

test('the committed content set loads, validates and exposes the expected shape (empty set allowed)', () => {
  assert.ok(Array.isArray(content.guides) && Array.isArray(content.playbooks) && Array.isArray(content.facts) && Array.isArray(content.glossary));
  assert.ok(Array.isArray(content.calendar.events) && Array.isArray(content.library.courses) && Array.isArray(content.library.books));
  assert.match(content.reviewed, /^\d{4}-\d{2}-\d{2}$/);
  assert.doesNotThrow(() => validate(content));
  assert.equal(SECTIONS.length, 10);
  assert.equal(PLAYBOOK_SECTIONS.length, 11);
});

test('every committed guide and playbook meets the content rules', () => {
  for (const g of content.guides) {
    assert.ok(g.summary.length > 40 && g.summary.length < 400, `${g.slug} summary length`);
    assert.ok(g.headings.filter((h) => h.depth === 2).length >= 3, `${g.slug} sections`);
    assert.ok(g.words >= 600, `${g.slug} is substantive (${g.words} words)`);
    for (const s of g.sources) assert.match(s.accessed, /^\d{4}-\d{2}-\d{2}$/, `${g.slug}: ${s.title}`);
  }
  for (const p of content.playbooks) {
    assert.deepEqual(checkPlaybookTemplate(p), [], p.slug);
    assert.ok(p.words >= 400, `${p.slug} is substantive (${p.words} words)`);
  }
});

test('a guide fixture parses: front matter, sources with accessed dates, fact shortcode, headings', () => {
  const facts = Object.fromEntries(FACTS.map((f) => [f.id, f]));
  const g = parseGuide(GUIDE, 'market-sessions', facts);
  assert.equal(g.title, 'Market sessions in IST');
  assert.equal(g.section, 'Foundations');
  assert.equal(g.level, 'beginner');
  assert.equal(g.minutes, 7);
  assert.deepEqual(g.topics, ['sessions', 'pre-open', 'nse']);
  assert.deepEqual(g.sources, [{ title: 'NSE market timings', url: 'https://www.nseindia.com/resources/exchange-communication-holidays', accessed: '2026-11-01' }]);
  assert.deepEqual(g.factRefs, ['stt-options-sell']);
  assert.match(g.html, /<span class="fact" data-fact="stt-options-sell"><span class="fact-value">0.1%<\/span><small class="fact-verified">verified 2026-11-01<\/small><\/span>/);
  assert.deepEqual(g.headings.map((h) => h.id), ['pre-open', 'continuous-session', 'closing-session']);
  assert.doesNotThrow(() => validate(makeContent({ guides: [g], facts: FACTS })));
});

test('validation rejects: unknown section, missing accessed date, unknown fact, bad level, unknown related', () => {
  const facts = Object.fromEntries(FACTS.map((f) => [f.id, f]));
  const bad = (raw, re) => assert.throws(() => validate(makeContent({ guides: [parseGuide(raw, 'x', facts)], facts: FACTS })), re);
  bad(GUIDE.replace('section: Foundations', 'section: Nowhere'), /unknown section/);
  bad(GUIDE.replace(' | accessed 2026-11-01', ''), /needs "accessed YYYY-MM-DD"/);
  bad(GUIDE.replace('{{fact:stt-options-sell}}', '{{fact:no-such-fact}}'), /unknown fact/);
  bad(GUIDE.replace('level: beginner', 'level: pro'), /level must be one of/);
  bad(GUIDE.replace('related: []', 'related: [ghost]'), /unknown related ghost/);
  assert.throws(() => validate(makeContent({ guides: [parseGuide(GUIDE, 'x', {})] })), /unknown fact/);
});

test('a playbook fixture parses and the fixed template order is enforced', () => {
  const p = parsePlaybook(PLAYBOOK, 'orb-15');
  assert.equal(p.evidence, 'MECHANISM');
  assert.deepEqual(p.instruments, ['Nifty 50 futures', 'Nifty 50 options']);
  assert.equal(p.window, '09:30–11:00 IST');
  assert.deepEqual(checkPlaybookTemplate(p), []);
  assert.doesNotThrow(() => validate(makeContent({ playbooks: [p] })));
  const swapped = parsePlaybook(PLAYBOOK.replace('## Stop\na\n## Target / exit\na\n', '## Target / exit\na\n## Stop\na\n'), 'x');
  assert.ok(checkPlaybookTemplate(swapped).some((m) => /h2 #5 must be "Stop" \(found "Target \/ exit"\)/.test(m)), JSON.stringify(checkPlaybookTemplate(swapped)));
  const extra = parsePlaybook(PLAYBOOK + '\n## Variants\nb\n', 'x');
  assert.ok(checkPlaybookTemplate(extra).some((m) => /unexpected extra h2 "Variants"/.test(m)));
  const noSvg = parsePlaybook(PLAYBOOK.replace(/<svg[\s\S]*?<\/svg>/, '(diagram)'), 'x');
  assert.ok(checkPlaybookTemplate(noSvg).some((m) => /inline <svg>/.test(m)));
  const noCaption = parsePlaybook(PLAYBOOK.replace('schematic, not real data', 'diagram'), 'x');
  assert.ok(checkPlaybookTemplate(noCaption).some((m) => /caption/.test(m)));
  assert.throws(() => validate(makeContent({ playbooks: [parsePlaybook(PLAYBOOK.replace('evidence: MECHANISM', 'evidence: GUESS'), 'x')] })), /evidence must be one of/);
});

test('facts need id, label, value, since, source and verified; library entries need the brief’s fields', () => {
  assert.doesNotThrow(() => validate(makeContent({ facts: FACTS })));
  assert.throws(() => validate(makeContent({ facts: [{ ...FACTS[0], verified: undefined }] })), /verified must be/);
  assert.throws(() => validate(makeContent({ facts: [{ ...FACTS[0], source: 'no url here' }] })), /source must be/);
  assert.throws(() => validate(makeContent({ facts: [FACTS[0], FACTS[0]] })), /duplicate id/);
  const course = { id: 'varsity', title: 'Zerodha Varsity', by: 'Zerodha', type: 'course', cost: 'free', links: [{ label: 'Varsity', url: 'https://zerodha.com/varsity/' }], year: 2025, level: 'beginner', fits: ['intraday', 'options'], hours: 40, why: 'The standard free Indian-markets curriculum.', caveats: 'Check modules against post-2024 SEBI rules.' };
  assert.doesNotThrow(() => validate(makeContent({ library: { courses: [course], books: [], path: { intro: '', stages: [{ title: 'Month 1', hoursPerWeek: 5, steps: [{ entry: 'varsity', note: 'Modules 1–5' }] }] } } })));
  assert.throws(() => validate(makeContent({ library: { courses: [{ ...course, fits: ['everything'] }], books: [], path: { stages: [] } } })), /fits must be/);
  assert.throws(() => validate(makeContent({ library: { courses: [{ ...course, cost: 'paid', price: { amount: 999, currency: 'INR' } }], books: [], path: { stages: [] } } })), /needs the date it was seen/);
  assert.throws(() => validate(makeContent({ library: { courses: [course], books: [], path: { stages: [{ title: 'M', steps: [{ entry: 'ghost' }] }] } } })), /unknown library entry ghost/);
});

test('glossary, changelog and resources are validated', () => {
  assert.throws(() => validate(makeContent({ glossary: [{ term: 'VWAP', def: 'x' }, { term: 'VWAP', def: 'y' }] })), /duplicate/);
  assert.throws(() => validate(makeContent({ changelog: [{ date: '2025-09-01', what: 'Weekly expiry moved', source: 'not-a-url' }] })), /source URL required/);
  assert.throws(() => validate(makeContent({ resources: [{ name: 'NSE', category: 'Data' }] })), /url required/);
  assert.doesNotThrow(() => validate(makeContent({ glossary: [{ term: 'VWAP', def: 'Volume-weighted average price.' }], changelog: [{ date: '2025-09-01', what: 'Weekly expiry moved', source: 'https://example.org/c' }], resources: [{ name: 'NSE', category: 'Data', url: 'https://www.nseindia.com/' }] })));
});

test('parseSources accepts two- and three-part strings', () => {
  assert.deepEqual(parseSources(['A | https://a.example', 'B | https://b.example | accessed 2026-01-02']), [{ title: 'A', url: 'https://a.example', accessed: '' }, { title: 'B', url: 'https://b.example', accessed: '2026-01-02' }]);
});

test('front matter parser handles scalars, inline arrays and dash lists', () => {
  const { data, body } = parseFrontMatter('---\ntitle: Hi there\norder: 2\ntags: [a, b]\nsources:\n  - One | https://x\n  - Two | https://y\n---\nBody');
  assert.deepEqual(data, { title: 'Hi there', order: 2, tags: ['a', 'b'], sources: ['One | https://x', 'Two | https://y'] });
  assert.equal(body, 'Body');
});

test('markdown renders callouts, heading anchors, wrapped tables, safe external links and missing-fact markers', () => {
  const headings = [];
  const factRefs = [];
  const html = renderMarkdown('## Rules\n\n:::warning Careful\nText here\n:::\n\n:::evidence\nStudy\n:::\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n[x](https://ex.com) and [y](../other/) and {{fact:ghost}}', { headings, factRefs });
  assert.match(html, /<h2 id="rules">Rules<a class="anchor"/);
  assert.match(html, /callout callout-warning/);
  assert.match(html, /<p class="callout-title">Careful<\/p>/);
  assert.match(html, /callout-evidence.*<p class="callout-title">Evidence<\/p>/);
  assert.match(html, /<div class="table-wrap"><table>/);
  assert.match(html, /href="https:\/\/ex.com" rel="noopener noreferrer" target="_blank"/);
  assert.match(html, /<a href="..\/other\/">y<\/a>/);
  assert.match(html, /fact-missing/);
  assert.deepEqual(factRefs, ['ghost']);
  assert.deepEqual(headings, [{ depth: 2, id: 'rules', text: 'Rules' }]);
});
