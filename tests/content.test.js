import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent, validate, parseGuide, parsePlaybook, parsePage, parseSources, checkPlaybookTemplate, SECTIONS, PLAYBOOK_SECTIONS, HERO_FACT_IDS } from '../src/build/content.js';
import { parseFrontMatter, renderMarkdown, renderInline, plainInline } from '../src/build/markdown.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const content = await loadContent(path.join(root, 'content'));

import { makeContent, FACTS, FACT_MAP, GUIDE, PLAYBOOK } from './fixtures.js';

test('the committed content set loads, validates and exposes the expected shape (empty set allowed)', () => {
  assert.ok(Array.isArray(content.guides) && Array.isArray(content.playbooks) && Array.isArray(content.facts) && Array.isArray(content.glossary));
  assert.ok(Array.isArray(content.calendar.events) && Array.isArray(content.library.courses) && Array.isArray(content.library.books));
  assert.ok(content.pages && typeof content.pages === 'object');
  assert.match(content.reviewed, /^\d{4}-\d{2}-\d{2}$/);
  assert.doesNotThrow(() => validate(content));
  assert.equal(SECTIONS.length, 10);
  assert.equal(PLAYBOOK_SECTIONS.length, 11);
});

test('every committed guide and playbook meets the content rules (word counts, sections, sources)', () => {
  for (const g of content.guides) {
    assert.ok(g.summary.length > 40 && g.summary.length < 400, `${g.slug} summary length`);
    assert.ok(g.headings.filter((h) => h.depth === 2).length >= 3, `${g.slug} sections`);
    assert.ok(g.words >= 850 && g.words <= 2300, `${g.slug}: guides run 850–2,300 words (${g.words})`);
    for (const s of g.sources) assert.match(s.accessed, /^\d{4}-\d{2}-\d{2}$/, `${g.slug}: ${s.title}`);
  }
  for (const p of content.playbooks) {
    assert.deepEqual(checkPlaybookTemplate(p), [], p.slug);
    assert.ok(p.words >= 550 && p.words <= 1400, `${p.slug}: playbooks run 550–1,400 words (${p.words})`);
  }
});

test('the loader reads content/guides, content/playbooks and content/pages only (the _templates skeleton is ignored)', () => {
  assert.ok(!content.playbooks.some((p) => p.slug === 'playbook'), 'content/_templates/playbook.md must not load as a playbook');
  assert.ok(content.pages.about, 'content/pages/about.md loads as c.pages.about');
  assert.equal(content.pages.about.kind, 'page');
  assert.ok(content.pages.about.html.includes('<h2 id="disclaimer">'));
});

test('a guide fixture parses: front matter, sources with accessed dates, fact token first/again, headings', () => {
  const g = parseGuide(GUIDE, 'market-sessions', FACT_MAP, { today: '2026-11-01' });
  assert.equal(g.title, 'Market sessions in IST');
  assert.equal(g.section, 'Foundations');
  assert.equal(g.level, 'beginner');
  assert.equal(g.minutes, 7);
  assert.deepEqual(g.topics, ['sessions', 'pre-open', 'nse']);
  assert.deepEqual(g.tools, []);
  assert.deepEqual(g.sources, [{ title: 'NSE market timings', url: 'https://www.nseindia.com/resources/exchange-communication-holidays', accessed: '2026-11-01' }]);
  assert.deepEqual(g.factRefs, ['chg-stt-options-sell']);
  assert.match(g.html, /<span class="fact" data-fact="chg-stt-options-sell"><span class="fact-value">0\.1%<\/span> <a class="fact-mark" href="#fact-chg-stt-options-sell" title="Finance \(No\. 2\) Act 2024 · since 1 Oct 2024 · verified 1 Nov 2026">✓ 1 Nov 2026<\/a><\/span> of premium/);
  assert.match(g.html, /still <span class="fact fact-again" data-fact="chg-stt-options-sell"><span class="fact-value">0\.1%<\/span><\/span> on the next sale/);
  assert.equal((g.html.match(/fact-mark/g) || []).length, 1, 'one mark per fact per page');
  assert.deepEqual(g.headings.map((h) => h.id), ['pre-open', 'continuous-session', 'closing-session']);
  assert.doesNotThrow(() => validate(makeContent({ guides: [g], facts: FACTS })));
});

test('summaries render tokens in fact-again mode and stay plain for meta and search', () => {
  const raw = GUIDE.replace('summary: What happens', 'summary: STT is {{fact:chg-stt-options-sell}} and this is what happens');
  const g = parseGuide(raw, 'x', FACT_MAP);
  assert.equal(g.summary, 'STT is 0.1% and this is what happens between the open and the close on NSE and BSE, and why the first fifteen minutes behave differently from the rest of the day.');
  assert.match(g.summaryHtml, /^STT is <span class="fact fact-again" data-fact="chg-stt-options-sell"><span class="fact-value">0\.1%<\/span><\/span> and this/);
  assert.ok(!g.summaryHtml.includes('fact-mark'), 'no mark in a summary');
  assert.deepEqual(g.factRefs, ['chg-stt-options-sell'], 'summary ids join factRefs after the body');
  assert.throws(() => validate(makeContent({ guides: [parseGuide(GUIDE.replace('summary: What', 'summary: {{fact:ghost}} What'), 'x', FACT_MAP)], facts: FACTS })), /unknown fact \{\{fact:ghost\}\}/);
  assert.equal(renderInline('a <b> & {{fact:fo-nifty-lot}} {{label:LORE}} {{fact:nope}}', { facts: FACT_MAP }), 'a &lt;b&gt; &amp; <span class="fact fact-again" data-fact="fo-nifty-lot"><span class="fact-value">65</span></span> <span class="tag tag-evidence" data-evidence="LORE">○ Lore</span> <span class="fact fact-missing" data-fact="nope">[fact nope missing]</span>');
  assert.equal(plainInline('lot {{fact:fo-nifty-lot}} {{label:EVIDENCE}} {{fact:nope}}', { facts: FACT_MAP }), 'lot 65 Evidence {{fact:nope}}');
});

test('validation rejects: unknown section, missing accessed date, unknown fact, bad level, unknown related, unknown tool', () => {
  const bad = (raw, re) => assert.throws(() => validate(makeContent({ guides: [parseGuide(raw, 'x', FACT_MAP)], facts: FACTS })), re);
  bad(GUIDE.replace('section: Foundations', 'section: Nowhere'), /unknown section/);
  bad(GUIDE.replace(' | accessed 2026-11-01', ''), /needs "accessed YYYY-MM-DD"/);
  bad(GUIDE.replace(/\{\{fact:chg-stt-options-sell\}\} of premium/, '{{fact:no-such-fact}} of premium'), /unknown fact/);
  bad(GUIDE.replace('level: beginner', 'level: pro'), /level must be one of/);
  bad(GUIDE.replace('related: []', 'related: [ghost]'), /unknown related ghost/);
  bad(GUIDE.replace('related: []', 'related: []\ntools: [no-such-tool]'), /unknown tool "no-such-tool"/);
  assert.doesNotThrow(() => validate(makeContent({ guides: [parseGuide(GUIDE.replace('related: []', 'related: []\ntools: [charges]'), 'x', FACT_MAP)], facts: FACTS }), { tools: [{ id: 'charges', title: 'Charges calculator' }] }));
  assert.throws(() => validate(makeContent({ guides: [parseGuide(GUIDE, 'x', {})] })), /unknown fact/);
});

test('a playbook fixture parses (glance fields, one evidence chip source) and the fixed template order is enforced', () => {
  const p = parsePlaybook(PLAYBOOK, 'orb-15', FACT_MAP);
  assert.equal(p.evidence, 'MECHANISM');
  assert.deepEqual(p.instruments, ['Nifty 50 futures', 'Nifty 50 options']);
  assert.equal(p.window, '09:30–11:00 IST');
  assert.deepEqual(p.glance, { stop: 'Range midpoint (tight) or the opposite side of the range (loose)', target: 'One range width, then trail under 5-minute swings', size: '1% of capital per attempt; two attempts a day' });
  assert.deepEqual(checkPlaybookTemplate(p), []);
  assert.match(p.html, /<span class="tag tag-evidence" data-evidence="EVIDENCE">● Evidence<\/span> A study/);
  assert.doesNotThrow(() => validate(makeContent({ playbooks: [p], facts: FACTS })));
  const swapped = parsePlaybook(PLAYBOOK.replace('## Stop\nOne lot is {{fact:fo-nifty-lot}} units.\n## Target / exit\na\n', '## Target / exit\na\n## Stop\na\n'), 'x', FACT_MAP);
  assert.ok(checkPlaybookTemplate(swapped).some((m) => /h2 #5 must be "Stop" \(found "Target \/ exit"\)/.test(m)), JSON.stringify(checkPlaybookTemplate(swapped)));
  const extra = parsePlaybook(PLAYBOOK + '\n## Variants\nb\n', 'x', FACT_MAP);
  assert.ok(checkPlaybookTemplate(extra).some((m) => /unexpected extra h2 "Variants"/.test(m)));
  const noSvg = parsePlaybook(PLAYBOOK.replace(/<svg[\s\S]*?<\/svg>/, '(diagram)'), 'x', FACT_MAP);
  assert.ok(checkPlaybookTemplate(noSvg).some((m) => /inline <svg>/.test(m)));
  const noCaption = parsePlaybook(PLAYBOOK.replace('Schematic, not real data.', 'a diagram'), 'x', FACT_MAP);
  assert.ok(checkPlaybookTemplate(noCaption).some((m) => /Schematic, not real data/.test(m)), JSON.stringify(checkPlaybookTemplate(noCaption)));
  const noLegend = parsePlaybook(PLAYBOOK.replace('<figcaption class="legend">', '<figcaption>'), 'x', FACT_MAP);
  assert.ok(checkPlaybookTemplate(noLegend).some((m) => /figcaption class="legend"/.test(m)));
  const withText = parsePlaybook(PLAYBOOK.replace('</svg>', '<text x="60" y="270">09:15</text></svg>'), 'x', FACT_MAP);
  assert.ok(checkPlaybookTemplate(withText).some((m) => /must not contain <text>/.test(m)), 'D1: words inside the schematic fail the build');
  assert.throws(() => validate(makeContent({ playbooks: [withText], facts: FACTS })), /must not contain <text>/);
  assert.throws(() => validate(makeContent({ playbooks: [parsePlaybook(PLAYBOOK.replace('evidence: MECHANISM', 'evidence: GUESS'), 'x', FACT_MAP)], facts: FACTS })), /evidence must be one of/);
  assert.throws(() => validate(makeContent({ playbooks: [parsePlaybook(PLAYBOOK.replace(/glance_size: .*\n/, ''), 'x', FACT_MAP)], facts: FACTS })), /glance_size required/);
  assert.throws(() => validate(makeContent({ playbooks: [parsePlaybook(PLAYBOOK.replace('glance_target: One range width, then trail under 5-minute swings', `glance_target: ${'x'.repeat(91)}`), 'x', FACT_MAP)], facts: FACTS })), /glance_target is 91 chars; max 90/);
});

test('content pages (about) parse with title, summary, updated and sources; missing fields fail', () => {
  const page = parsePage('---\ntitle: About\nsummary: What this is.\nupdated: 2026-11-01\nsources:\n  - CC BY 4.0 | https://creativecommons.org/licenses/by/4.0/ | accessed 2026-11-01\n---\n## What\n\nText {{fact:fo-nifty-lot}}.\n', 'about', FACT_MAP);
  assert.equal(page.kind, 'page');
  assert.deepEqual(page.factRefs, ['fo-nifty-lot']);
  assert.doesNotThrow(() => validate(makeContent({ pages: { about: page }, facts: FACTS })));
  assert.throws(() => validate(makeContent({ pages: { about: parsePage('---\ntitle: About\n---\nText', 'about') } })), /page about: title and summary are required/);
  assert.throws(() => validate(makeContent({ pages: { about: parsePage('---\ntitle: About\nsummary: s\nupdated: 2026-11-01\n---\n{{fact:ghost}}', 'about') } })), /page about: unknown fact/);
});

test('facts need id (namespaced), label, value, since, source and verified; library entries need the brief’s fields incl. caveats', () => {
  assert.doesNotThrow(() => validate(makeContent({ facts: FACTS })));
  assert.throws(() => validate(makeContent({ facts: [{ ...FACTS[0], verified: undefined }] })), /verified must be/);
  assert.throws(() => validate(makeContent({ facts: [{ ...FACTS[0], source: 'no url here' }] })), /source must be/);
  assert.throws(() => validate(makeContent({ facts: [FACTS[0], FACTS[0]] })), /duplicate id/);
  assert.throws(() => validate(makeContent({ facts: [{ ...FACTS[0], id: 'stt-options-sell' }] })), /id prefix must be one of/);
  const course = { id: 'varsity', title: 'Zerodha Varsity', by: 'Zerodha', type: 'course', cost: 'free', links: [{ label: 'Varsity', url: 'https://zerodha.com/varsity/' }], year: 2025, level: 'beginner', fits: ['intraday', 'options'], hours: 40, why: 'The standard free Indian-markets curriculum.', caveats: 'Check modules against post-2024 SEBI rules.' };
  assert.doesNotThrow(() => validate(makeContent({ library: { courses: [course], books: [], path: { intro: '', stages: [{ title: 'Month 1', hoursPerWeek: 5, steps: [{ entry: 'varsity', note: 'Modules 1–5' }] }] } } })));
  assert.throws(() => validate(makeContent({ library: { courses: [{ ...course, fits: ['everything'] }], books: [], path: { stages: [] } } })), /fits must be/);
  assert.throws(() => validate(makeContent({ library: { courses: [{ ...course, caveats: '' }], books: [], path: { stages: [] } } })), /caveats \(one line\) required/);
  assert.throws(() => validate(makeContent({ library: { courses: [{ ...course, cost: 'paid', price: { amount: 999, currency: 'INR' } }], books: [], path: { stages: [] } } })), /needs the date it was seen/);
  assert.throws(() => validate(makeContent({ library: { courses: [course], books: [], path: { stages: [{ title: 'M', steps: [{ entry: 'ghost' }] }] } } })), /unknown library entry ghost/);
});

test('the home hero check needs the five SEBI ids with one shared verified date, but only when the register is non-empty', () => {
  assert.equal(HERO_FACT_IDS.length, 5);
  const hero = (verified) => HERO_FACT_IDS.map((id, i) => ({ id, label: `Hero fact ${id}`, value: `${i + 1}0%`, since: '2026-08-20', source: 'SEBI study | https://www.sebi.gov.in/x.pdf', verified: typeof verified === 'function' ? verified(i) : verified }));
  assert.doesNotThrow(() => validate(makeContent({ facts: [] })), 'empty register builds');
  assert.doesNotThrow(() => validate(makeContent({ facts: hero('2026-11-01') }, { hero: false })));
  assert.throws(() => validate(makeContent({ facts: FACTS }, { hero: false })), /home hero: missing facts sebi-loss-2026-share/);
  assert.throws(() => validate(makeContent({ facts: hero((i) => (i === 3 ? '2026-10-31' : '2026-11-01')) }, { hero: false })), /must share one verified date/);
});

test('glossary, calendar (kind ∈ filters), changelog and resources are validated', () => {
  assert.throws(() => validate(makeContent({ glossary: [{ term: 'VWAP', def: 'x' }, { term: 'VWAP', def: 'y' }] })), /duplicate/);
  assert.throws(() => validate(makeContent({ glossary: [{ term: 'Lot', def: 'One lot is {{fact:ghost}}.' }] })), /unknown fact \{\{fact:ghost\}\}/);
  assert.throws(() => validate(makeContent({ changelog: [{ date: '2025-09-01', what: 'Weekly expiry moved', source: 'not-a-url' }] })), /source URL required/);
  assert.throws(() => validate(makeContent({ resources: [{ name: 'NSE', category: 'Data' }] })), /url required/);
  assert.throws(() => validate(makeContent({ calendar: { note: '', filters: [{ id: 'expiry', label: 'Expiry days' }], events: [{ date: '2026-11-03', what: 'Nifty weekly expiry', kind: 'holiday' }] } })), /kind "holiday" is not a filter id/);
  assert.doesNotThrow(() => validate(makeContent({ calendar: { note: '', filters: [{ id: 'expiry', label: 'Expiry days' }], events: [{ date: '2026-11-03', what: 'Nifty weekly expiry', kind: 'expiry' }] } })));
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

test('markdown renders callouts, heading anchors, wrapped tables, safe external links, evidence labels and missing-fact markers', () => {
  const headings = [];
  const factRefs = [];
  const html = renderMarkdown('## Rules\n\n:::warning Careful\nText here\n:::\n\n:::evidence\nStudy {{label:MECHANISM}}\n:::\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n[x](https://ex.com) and [y](../other/) and {{fact:ghost}}', { headings, factRefs });
  assert.match(html, /<h2 id="rules">Rules<a class="anchor"/);
  assert.match(html, /callout callout-warning/);
  assert.match(html, /<p class="callout-title">Careful<\/p>/);
  assert.match(html, /callout-evidence.*<p class="callout-title">Evidence<\/p>/);
  assert.match(html, /<span class="tag tag-evidence" data-evidence="MECHANISM">◐ Mechanism<\/span>/);
  assert.match(html, /<div class="table-wrap"><table>/);
  assert.match(html, /href="https:\/\/ex.com" rel="noopener noreferrer" target="_blank"/);
  assert.match(html, /<a href="..\/other\/">y<\/a>/);
  assert.match(html, /fact-missing/);
  assert.deepEqual(factRefs, ['ghost']);
  assert.deepEqual(headings, [{ depth: 2, id: 'rules', text: 'Rules' }]);
});
