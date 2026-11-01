// Design invariants made mechanical (design.md §11, §15): facts are never typed, one accent and no glow, the M1 mark,
// visitor vocabulary, the N4 citation rule, value lengths, token rendering, the hero check, the rail box, strings coverage.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite } from '../src/build/site.js';
import { SITE } from '../src/build/config.js';
import { STRINGS } from '../src/build/strings.js';
import { validate, parseGuide, parsePlaybook, BILL_TITLE_RE, HERO_FACT_IDS, VALUE_MAX_TOKENED, VALUE_MAX_REGISTER } from '../src/build/content.js';
import { renderMarkdown, renderInline, factHtml } from '../src/build/markdown.js';
import { factsBox, formatDate } from '../src/build/templates.js';
import { homePage, playbookPage, guidePage, factsPage, TOOLS } from '../src/build/pages.js';
import { makeContent, FACTS, FACT_MAP, HERO_FACTS, GUIDE, PLAYBOOK } from './fixtures.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = await mkdtemp(path.join(tmpdir(), `${SITE.slug}-design-`));
const result = await buildSite({ root, outDir: out, basePath: SITE.basePath });
const facts = result.content.facts;

async function walk(dir, acc = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, acc); else acc.push(p);
  }
  return acc;
}
const htmlFiles = (await walk(out)).filter((f) => f.endsWith('.html'));
const pages = await Promise.all(htmlFiles.map(async (f) => ({ file: path.relative(out, f).replace(/\\/g, '/'), html: await readFile(f, 'utf8') })));

/* ---------- tiny HTML → text extractor with subtree exclusion (no DOM library in the build) ---------- */
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');

/** Visible text of `html`, dropping every element for which `skip(tag, classes)` is true (and its subtree). */
export function htmlToText(html, skip = () => false) {
  let text = '';
  let depth = 0; // > 0 while inside a skipped subtree
  for (const m of html.matchAll(/<\/?([a-zA-Z][\w-]*)([^>]*)>|([^<]+)/g)) {
    if (m[3] !== undefined) { if (!depth) text += m[3]; continue; }
    const tag = m[1].toLowerCase();
    const closing = m[0].startsWith('</');
    const selfClosing = /\/\s*>$/.test(m[0]) || VOID.has(tag);
    if (closing) { if (depth) depth--; continue; }
    const classes = (/class="([^"]*)"/.exec(m[2] || '')?.[1] || '').split(/\s+/).filter(Boolean);
    if (depth) { if (!selfClosing) depth++; continue; }
    if (skip(tag, classes, m[2] || '')) { if (!selfClosing) depth = 1; continue; }
    if (['p', 'div', 'li', 'td', 'th', 'tr', 'h1', 'h2', 'h3', 'h4', 'dt', 'dd', 'section', 'article', 'aside', 'figcaption', 'br'].includes(tag)) text += ' ';
  }
  return decode(text).replace(/\s+/g, ' ').trim();
}

/** The §6.6 exclusion list: .fact, .facts-box, .rates, pre.formula, nav, script, style, template, time, .time and .num
 *  (rendered figures — table cells, calculator results, example counters — are data, like dates in <time>). */
const EXCLUDE = (tag, classes) => ['nav', 'script', 'style', 'template', 'time'].includes(tag)
  || classes.some((c) => ['fact', 'facts-box', 'rates', 'time', 'formula', 'num'].includes(c));
const mainText = (html) => htmlToText(/<main id="main">([\s\S]*?)<\/main>/.exec(html)?.[1] || '', EXCLUDE);

const PUNCT = /^[()[\]{}.,;:“”"'…]+|[()[\]{}.,;:“”"'…]+$/g;
export const tokenize = (text) => String(text).split(/\s+/).map((t) => t.replace(PUNCT, '')).filter(Boolean);
const STOP = new Set(['the', 'and', 'for', 'per', 'of', 'on', 'in', 'with', 'from', 'each', 'side', 'its', 'all']);
export const keywords = (label) => new Set(String(label).toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !STOP.has(w)));
const CORE = /^[₹$]?\d[\d,]*(\.\d+)?\s?(%|lakh|crore|cr)?/;

/** Token sequences that count as "typing" the fact: the whole value, its numeric core, times/ranges as a whole. */
export function candidates(value) {
  const v = String(value).trim();
  const seqs = [];
  const add = (s) => { const t = tokenize(s); if (t.length && !seqs.some((x) => x.join(' ') === t.join(' '))) seqs.push(t); };
  if (/[:–]/.test(v)) { add(v); add(v.replace(/\s?IST$/, '')); return seqs; }
  const m = CORE.exec(v);
  if (!m) return seqs; // word-valued facts (Tuesday, Discontinued) stay an editorial check
  const core = m[0].trim();
  add(v); add(core); add(core.replace(/\s+/g, ''));
  if (/\s/.test(core)) add(core.split(/\s+/)[0]); // "₹91,685 crore" → "₹91,685"
  return seqs;
}

/** Hits = a candidate sequence found in `text` with a label keyword within six tokens (or anywhere when window = Infinity). */
export function scanTyped(text, factList, { window = 6 } = {}) {
  const toks = tokenize(text);
  const hits = [];
  for (const f of factList) {
    const kw = keywords(f.label);
    let hit = null;
    for (const seq of candidates(f.value)) {
      for (let i = 0; !hit && i + seq.length <= toks.length; i++) {
        if (seq.some((s, j) => toks[i + j] !== s)) continue;
        if (window === Infinity) { hit = { id: f.id, token: seq.join(' ') }; break; }
        const lo = Math.max(0, i - window); const hi = Math.min(toks.length, i + seq.length + window);
        const near = toks.slice(lo, hi).map((t) => t.toLowerCase()).find((t) => kw.has(t));
        if (near) hit = { id: f.id, token: seq.join(' '), keyword: near, context: toks.slice(lo, hi).join(' ') };
      }
      if (hit) break;
    }
    if (hit) hits.push(hit);
  }
  return hits;
}

/* ---------- D2: facts are never typed ---------- */

const SCANNED = (file) => file === 'index.html' || /^(guides|playbooks|tools|calendar|glossary|about)\//.test(file);

test('the typed-literal scanner catches a typed fact beside its label words, passes the token and passes an unrelated number', () => {
  const lot = { id: 'fo-nifty-lot', label: 'Nifty lot size', value: '65' };
  const holidays = { id: 'mkt-holidays-current-year-count', label: 'NSE weekday trading holidays, incl. one special closure', value: '16' };
  const close = { id: 'mkt-fo-session', label: 'Equity derivatives trading session', value: '09:15–15:40 IST' };
  assert.equal(scanTyped('One lot of 65 costs this much.', [lot]).length, 1, '"One lot of 65" fails');
  assert.equal(scanTyped(mainText(`<main id="main">${renderMarkdown('One lot of {{fact:fo-nifty-lot}} costs this much.', { facts: { 'fo-nifty-lot': FACT_MAP['fo-nifty-lot'] } })}</main>`), [lot]).length, 0, 'the token passes');
  assert.equal(scanTyped('The exchange was shut on 16 Jan 2026.', [holidays]).length, 0, '"16 Jan 2026" with no keyword passes');
  assert.equal(scanTyped('There were 16 trading holidays.', [holidays]).length, 1);
  assert.equal(scanTyped('Derivatives trade 09:15–15:40 IST every session.', [close]).length, 1, 'a range value matches as a whole');
  assert.equal(scanTyped('Derivatives trade 09:15–15:40 every session.', [close]).length, 1, 'a range value without IST still matches');
  assert.equal(scanTyped('Net loss ₹91,685 crore this year.', [{ id: 'x', label: 'Net loss of individual F&O traders', value: '₹91,685 crore' }]).length, 1);
  assert.equal(scanTyped('Net loss ₹91,685 this year.', [{ id: 'x', label: 'Net loss of individual F&O traders', value: '₹91,685 crore' }]).length, 1, 'the numeric part alone counts');
  assert.deepEqual(candidates('Tuesday'), [], 'word-valued facts are not scanned');
});

test('facts are never typed: no built page types a register value beside its label words (home, guides, playbooks, tools, calendar, glossary, about)', () => {
  const problems = [];
  for (const { file, html } of pages.filter((p) => SCANNED(p.file))) {
    for (const h of scanTyped(mainText(html), facts)) problems.push(`${file}: "${h.token}" (${h.id}) near "${h.keyword}" in “${h.context}”`);
  }
  assert.deepEqual(problems, [], problems.join('\n'));
});

test('strings.js holds no fact value (figures come from the register through placeholders)', async () => {
  const src = await readFile(path.join(root, 'src', 'build', 'strings.js'), 'utf8');
  const hits = scanTyped(src, facts, { window: Infinity });
  assert.deepEqual(hits, [], hits.map((h) => `${h.id}: "${h.token}"`).join('\n'));
});

/* ---------- D1 / template and N2 ---------- */

test('a playbook with <text> inside the schematic fails the build; the page shows exactly one evidence chip outside the evidence callout', () => {
  const c = makeContent({ playbooks: [parsePlaybook(PLAYBOOK, 'orb-15', FACT_MAP)], facts: FACTS });
  const html = playbookPage(c.playbooks[0], c);
  const outsideCallout = html.replace(/<aside class="callout callout-evidence"[\s\S]*?<\/aside>/g, '');
  assert.equal((outsideCallout.match(/class="tag tag-evidence"/g) || []).length, 1, 'N2: one chip, in the meta row');
  assert.match(html, /<div class="card evidence-card"><h2>Why this is labelled Mechanism<\/h2><p class="muted">The mechanism is explained; no public study measures it\. <a href="#evidence-label">Read the evidence section<\/a>\.<\/p><\/div>/);
  assert.match(html, /<dl class="glance" aria-label="At a glance">(<div><dt>[^<]+<\/dt><dd>[^<]*<\/dd><\/div>){5}<\/dl>/, 'five glance cells');
  assert.match(html, /<aside class="rail">\s*<div class="card evidence-card">[\s\S]*<div class="card facts-box">/, 'rail order: explanation, (tools, related,) facts box');
  assert.throws(() => validate(makeContent({ playbooks: [parsePlaybook(PLAYBOOK.replace('</svg>', '<text x="60" y="270">09:15</text></svg>'), 'x', FACT_MAP)], facts: FACTS })), /must not contain <text>/);
});

test('guide rail order is Tools → Related → facts box (tools from the registry named in front matter)', () => {
  const tool = TOOLS.find((t) => t.id === 'charges');
  const other = parseGuide(GUIDE.replace('title: Market sessions in IST', 'title: Other guide'), 'other', FACT_MAP);
  const g = parseGuide(GUIDE.replace('related: []', 'related: [other]\ntools: [charges]'), 'sessions', FACT_MAP);
  const c = makeContent({ guides: [g, other], facts: FACTS });
  validate(c);
  const html = guidePage(g, c);
  const rail = /<aside class="rail">([\s\S]*?)<\/aside>/.exec(html)[1];
  const re = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  assert.match(rail, new RegExp(`^\\s*<div class="card tools-card"><h2>Tools</h2><ul><li><a href="\\.\\./\\.\\./tools/charges/">${re(tool.title)}</a><small>${re(tool.summary.replace(/&/g, '&amp;'))}</small></li></ul></div>\\s*<div class="card related-card">[\\s\\S]*<div class="card facts-box">`));
  assert.match(html, /<p class="lede">What happens between the open and the close/);
  assert.match(factsPage(c), new RegExp(`<tr id="fact-chg-stt-options-sell"[\\s\\S]*?<a href="\\.\\./guides/sessions/">Market sessions in IST</a>, <a href="\\.\\./guides/other/">Other guide</a>, <a href="\\.\\./tools/charges/">${re(tool.title)}</a></td>`), 'Used on lists pages and tools');
});

/* ---------- CSS, favicon, vocabulary ---------- */

test('styles.css: no gradients; blur only on the sticky header; box-shadow only on the toast, the search dialog and the Learn pill outline', async () => {
  const raw = await readFile(path.join(root, 'site', 'styles.css'), 'utf8');
  const css = raw.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.ok(!/gradient\(/.test(css), 'gradient(');
  assert.ok(!raw.includes('PLACEHOLDER PALETTE'));
  assert.ok(!/data-palette/.test(css), 'palette 2 does not ship');
  assert.ok(!/@font-face/.test(css), '@font-face lives in fonts/fonts.css');
  assert.match(css, /@import url\("fonts\/fonts\.css"\)/);
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = m[1].trim().replace(/^[\s\S]*\}\s*/, '');
    const body = m[2];
    if (/blur\(/.test(body)) assert.ok(sel.includes('.site-header'), `blur( outside .site-header: ${sel}`);
    if (/box-shadow/.test(body)) assert.ok(/^\.toast$|^dialog\.search$|\.site-nav a\.nav-learn/.test(sel), `box-shadow outside the allowed selectors: ${sel}`);
  }
  assert.match(css, /:root\s*\{[^}]*color-scheme:\s*light/);
  assert.match(css, /html\[data-theme="dark"\]\s*\{[^}]*color-scheme:\s*dark/);
  assert.match(css, /--accent:\s*#2b4a9b/);
  assert.match(css, /--accent:\s*#9db5f5/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /@media print/);
  assert.match(css, /\.site-nav a\.nav-learn\[aria-current="page"\]\s*\{[^}]*background:\s*var\(--accent\)/, 'N1: filled pill when current');
  assert.match(css, /\.site-nav a\.nav-learn\s*\{[^}]*box-shadow:\s*inset 0 0 0 1\.5px var\(--accent\)/, 'N1: outline pill otherwise');
  // NIT 3: fill grids 5 → four columns from 1440, five from 1920; fill grids 3 → four columns at ≥ 2400
  assert.match(css, /@media \(min-width: 1440px\)[^\n]*\.grid-fill-5 > \*, \.grid-sections > \* \{ flex-basis: calc\(\(100% - 3 \* var\(--g\)\) \/ 4 - 1px\); \}/);
  assert.match(css, /@media \(min-width: 1920px\) \{ \.grid-fill-5 > \*, \.grid-sections > \* \{ flex-basis: calc\(\(100% - 4 \* var\(--g\)\) \/ 5 - 1px\); \} \}/);
  assert.match(css, /@media \(min-width: 2400px\) \{ \.grid-fill-3 > \*, \.grid-fill-4 > \*[^\n]*\/ 4 - 1px\)/);
  for (const alias of ['.grid-cards', '.grid-sections', '.directory', '.empty', '.glossary', '.changelog', '.not-found', '.anchor']) assert.ok(css.includes(alias), `alias ${alias}`);
});

test('favicon is the M1 ledger mark: no triangle or closed path, accent #2b4a9b, dark-scheme #9db5f5', async () => {
  const svg = await readFile(path.join(root, 'site', 'favicon.svg'), 'utf8');
  assert.ok(!/<polygon/.test(svg));
  for (const m of svg.matchAll(/\sd="([^"]+)"/g)) assert.ok(!/[Zz]/.test(m[1]) && !/[Ll]/.test(m[1]), `closed/triangle path: ${m[1]}`);
  assert.match(svg, /stroke:\s*#2b4a9b/);
  assert.match(svg, /@media \(prefers-color-scheme: dark\)[^}]*stroke:\s*#9db5f5/);
  assert.match(svg, /fill:\s*none/);
  assert.match(svg, /<rect [^>]*rx="4\.5"/);
});

test('visitor vocabulary: no built page or UI string names the project’s internals (agents, facts.json, run dir, FEAT)', () => {
  const RE = /agents|facts\.json|run dir|FEAT/;
  for (const { file, html } of pages) {
    const text = htmlToText(/<body[^>]*>([\s\S]*)<\/body>/.exec(html)[1], (tag) => ['script', 'style', 'template'].includes(tag));
    const m = RE.exec(text);
    assert.ok(!m, `${file}: "${m?.[0]}" in visible text`);
  }
  assert.ok(!RE.test(JSON.stringify(STRINGS)), 'strings.js');
});

/* ---------- N4 citation rule, value lengths ---------- */

test('the source-title rule fails Bill clauses and memoranda and passes enacted sections and SEBI annexure references', () => {
  assert.match('Finance Bill 2026 cl.143', BILL_TITLE_RE);
  assert.match('Memorandum to the Finance Bill 2026', BILL_TITLE_RE);
  assert.match('Finance (No. 2) Bill 2024 cl.10', BILL_TITLE_RE);
  assert.doesNotMatch('SEBI 2025/79 Annexure clause 1.3.4.3', BILL_TITLE_RE);
  assert.doesNotMatch('Finance Act 2026, s. 159', BILL_TITLE_RE);
  assert.doesNotMatch('Finance (No. 2) Act 2024', BILL_TITLE_RE);
  assert.throws(() => validate(makeContent({ facts: [{ ...FACTS[0], source: 'Finance Bill 2026 cl.143 | https://www.indiabudget.gov.in/doc/finance_bill.pdf' }] })), /cites a Bill clause or a Budget memorandum/);
  for (const f of facts) assert.doesNotMatch(f.source.split('|')[0], BILL_TITLE_RE, f.id);
});

test('fact values: ≤ 60 chars when tokened (fatal), ≤ 120 otherwise (fatal), a warning above 40 when tokened; ids sit in the nine groups', () => {
  const long = (n) => 'x'.repeat(n);
  const tokened = (value) => makeContent({ guides: [parseGuide(GUIDE, 'g', { 'chg-stt-options-sell': { ...FACTS[0], value } })], facts: [{ ...FACTS[0], value }] });
  const warnings = [];
  validate(tokened(long(45)), { warn: (m) => warnings.push(m) });
  assert.equal(warnings.length, 1, 'a 45-char tokened value warns');
  assert.match(warnings[0], /chg-stt-options-sell: value is 45 chars/);
  assert.doesNotThrow(() => validate(tokened(long(60))));
  assert.throws(() => validate(tokened(long(61))), /value is 61 chars; a tokened fact's value must be ≤ 60/);
  assert.doesNotThrow(() => validate(makeContent({ facts: [{ ...FACTS[0], value: long(120) }] })), 'register-only rows may run to 120');
  assert.throws(() => validate(makeContent({ facts: [{ ...FACTS[0], value: long(121) }] })), /value is 121 chars; max 120/);
  assert.throws(() => validate(makeContent({ facts: [{ ...FACTS[0], id: 'misc-thing' }] })), /id prefix must be one of/);
  assert.equal(VALUE_MAX_TOKENED, 60); assert.equal(VALUE_MAX_REGISTER, 120);
  for (const f of facts) assert.ok(String(f.value).length <= VALUE_MAX_REGISTER, f.id);
});

/* ---------- Token rendering with a fixed today ---------- */

test('fact token: first use carries the mark with the N4 title, later uses render plain, a future since says "from"', () => {
  const f = { id: 'fo-freeze-qty-nifty', label: 'Quantity freeze per order, Nifty 50 derivatives', value: '1,800', since: '2026-12-07', source: 'NSE circular FAOP/77189 | https://example.org/faop77189.pdf', verified: '2026-11-01' };
  const refs = [];
  const html = renderMarkdown('Freeze {{fact:fo-freeze-qty-nifty}} and again {{fact:fo-freeze-qty-nifty}}.', { facts: { [f.id]: f }, factRefs: refs, today: '2026-11-01' });
  assert.match(html, /<span class="fact" data-fact="fo-freeze-qty-nifty"><span class="fact-value">1,800<\/span> <span class="fact-from">\(from 7 Dec 2026\)<\/span> <a class="fact-mark" href="#fact-fo-freeze-qty-nifty" title="NSE circular FAOP\/77189 · from 7 Dec 2026 · verified 1 Nov 2026">✓ 1 Nov 2026<\/a><\/span> and again <span class="fact fact-again" data-fact="fo-freeze-qty-nifty"><span class="fact-value">1,800<\/span><\/span>\./);
  assert.deepEqual(refs, ['fo-freeze-qty-nifty'], 'one factRefs entry per id');
  const later = renderMarkdown('Freeze {{fact:fo-freeze-qty-nifty}}.', { facts: { [f.id]: f }, today: '2026-12-07' });
  assert.ok(!later.includes('fact-from'), 'no "(from …)" once the date has passed');
  assert.match(later, /title="NSE circular FAOP\/77189 · since 7 Dec 2026 · verified 1 Nov 2026"/);
  assert.equal(factHtml('ghost', undefined), '<span class="fact fact-missing" data-fact="ghost">[fact ghost missing]</span>');
  assert.equal(renderInline('x {{fact:fo-freeze-qty-nifty}}', { facts: { [f.id]: f } }), 'x <span class="fact fact-again" data-fact="fo-freeze-qty-nifty"><span class="fact-value">1,800</span></span>');
  assert.equal(formatDate('2026-11-01'), '1 Nov 2026');
});

/* ---------- Hero check and rail box ---------- */

test('the home page builds with the five hero facts and still builds on an empty register', () => {
  const full = homePage(makeContent({ facts: HERO_FACTS }, { hero: false }));
  for (const id of HERO_FACT_IDS) assert.ok(full.includes(`data-fact="${id}"`), id);
  assert.match(full, /What SEBI’s own study found · FY26/);
  assert.match(full, /All five figures verified <time datetime="2026-11-01">1 Nov 2026<\/time> against/);
  const empty = homePage(makeContent({ facts: [] }));
  assert.match(empty, /<aside class="sebi-box"[^>]*>[\s\S]*?The headline figures from SEBI’s loss studies appear here/);
  assert.ok(!empty.includes('data-fact='), 'no fact spans without a register');
  assert.match(empty, /Coming in Phase 2/);
  const allGuides = makeContent({ guides: ['Macro & events', 'Fundamentals & news', 'Algo & systematic', 'Investing: India', 'Investing: USA & global', 'Edges, habits & traps'].map((s, i) => parseGuide(GUIDE.replace('section: Foundations', `section: ${s}`), `g${i}`, FACT_MAP)), facts: FACTS });
  assert.ok(!homePage(allGuides).includes('Coming in Phase 2'), 'NIT 4: the extra grid disappears when every Phase-2 section has guides');
});

test('factsBox keeps the order of first use, opens six entries, folds the rest into <details> and links the register', () => {
  const list = Array.from({ length: 8 }, (_, i) => ({ id: `chg-f${i}`, label: `Fact ${i}`, value: `${i}0%`, since: '2026-04-01', source: `Finance Act 2026, s. ${150 + i} | https://example.org/${i}`, verified: '2026-11-01' }));
  const byFact = Object.fromEntries(list.map((f) => [f.id, f]));
  const ids = ['chg-f3', 'chg-f0', 'chg-f7', 'chg-f1', 'chg-f2', 'chg-f4', 'chg-f5', 'chg-f6'];
  const html = factsBox(ids, byFact, '../../', { today: '2026-11-01' });
  assert.deepEqual([...html.matchAll(/<li id="fact-([a-z0-9-]+)"/g)].map((m) => m[1]), ids, 'order of first use');
  const open = /<ul>([\s\S]*?)<\/ul>/.exec(html)[1];
  assert.equal((open.match(/<li /g) || []).length, 6);
  assert.match(html, /<details><summary>2 more facts on this page<\/summary><ul>(<li [\s\S]*?<\/li>){2}<\/ul><\/details>/);
  assert.match(html, /<li id="fact-chg-f3"><span class="fv">30%<\/span><span class="fl">Fact 3<\/span><span class="fd"><a href="https:\/\/example\.org\/3" rel="noopener noreferrer" target="_blank">Finance Act 2026, s\. 153<\/a> · since 1 Apr 2026 · verified 1 Nov 2026<\/span><\/li>/, 'N4 format');
  assert.match(html, /<p class="all"><a href="\.\.\/\.\.\/facts\/">All facts on this site →<\/a><\/p>/);
  assert.ok(!factsBox(ids.slice(0, 6), byFact, './').includes('<details'), 'six or fewer: no details');
  assert.equal(factsBox([], byFact), '');
  const future = factsBox(['chg-f0'], { 'chg-f0': { ...list[0], since: '2026-12-07' } }, './', { today: '2026-11-01' });
  assert.match(future, /· from 7 Dec 2026 · verified 1 Nov 2026/);
});

/* ---------- Strings coverage ---------- */

test('every S.x.y referenced in src/ and every T.x in app.js exists in strings.js', async () => {
  const resolve = (obj, dotted) => dotted.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  const srcDir = path.join(root, 'src', 'build');
  const missing = [];
  for (const f of (await readdir(srcDir)).filter((x) => x.endsWith('.js') && x !== 'strings.js')) {
    const src = await readFile(path.join(srcDir, f), 'utf8');
    for (const m of src.matchAll(/\bS\.([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)/g)) if (resolve(STRINGS, m[1]) === undefined) missing.push(`${f}: S.${m[1]}`);
  }
  const app = await readFile(path.join(root, 'site', 'app.js'), 'utf8');
  const client = { ...STRINGS.client, themeColor: true };
  for (const m of app.matchAll(/\bT\.([A-Za-z_]\w*)/g)) if (client[m[1]] === undefined) missing.push(`app.js: T.${m[1]}`);
  assert.deepEqual(missing, []);
  for (const key of ['nav', 'labels.factsRegister', 'labels.allFacts', 'labels.from', 'labels.verifiedMark', 'labels.moreFacts', 'labels.toolsHeading', 'home.sebi.eyebrow', 'home.sebi.lost', 'home.sebi.netLoss', 'home.sebi.avgLoss', 'home.sebi.costs', 'home.sebi.consistent', 'home.sebi.cite', 'home.sebi.link', 'home.honesty', 'home.startEyebrow', 'home.startTitle', 'home.startLede', 'home.counts.tools', 'home.phase2Eyebrow', 'home.sectionScope', 'facts.eyebrow', 'facts.title', 'facts.lede', 'facts.groups', 'facts.download', 'facts.usedOn', 'facts.filter', 'facts.future', 'facts.none', 'playbooks.glance.instruments', 'playbooks.glance.window', 'playbooks.glance.stop', 'playbooks.glance.target', 'playbooks.glance.size', 'playbooks.whyLabel', 'playbooks.legendNote', 'tools.eyebrow', 'tools.indexTitle', 'tools.indexLede', 'tools.empty', 'client.showing', 'client.thisMonth']) {
    assert.notEqual(resolve(STRINGS, key), undefined, key);
  }
  assert.equal(STRINGS.home.honesty.length, 4);
  assert.equal(Object.keys(STRINGS.home.sectionScope).length, 10);
  assert.equal(Object.keys(STRINGS.facts.groups).length, 9);
  assert.equal(STRINGS.home.counts.tools, 'calculators');
  assert.ok(STRINGS.nav.some((n) => n.href === 'tools/' && n.label === 'Tools'));
  assert.ok(STRINGS.footer.links.reference.some((l) => l.href === 'facts/'));
});

test.after(async () => { await rm(out, { recursive: true, force: true }); });
