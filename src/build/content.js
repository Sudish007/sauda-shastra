// Load and validate all content: guides and playbooks (Markdown + front matter), content pages (about), facts,
// glossary, calendar, changelog, resources and the learning library. Throws on broken references so the build (and
// tests) fail loudly. Every loader tolerates an empty content set: a missing file or folder is an empty list.
// Only content/guides, content/playbooks and content/pages are read; content/_templates is the writers' skeleton.
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { parseFrontMatter, renderMarkdown, renderInline, plainInline, factSource } from './markdown.js';
import { TOOLS } from './tools.js';

// Guide sections map to the brief's research clusters (D = playbooks, L = tools, M = utilities, N = library).
export const SECTIONS = [
  'Foundations',             // A
  'Technical analysis',      // B
  'Options',                 // C
  'Macro & events',          // E
  'Fundamentals & news',     // F
  'Algo & systematic',       // G
  'Risk, psychology & tax',  // H
  'Investing: India',        // I
  'Investing: USA & global', // J
  'Edges, habits & traps',   // K
];
// Clusters E, F, G, I, J, K ship in Phase 2; until a section has guides the home page shows its scope line.
export const PHASE2_SECTIONS = ['Macro & events', 'Fundamentals & news', 'Algo & systematic', 'Investing: India', 'Investing: USA & global', 'Edges, habits & traps'];
export const LEVELS = ['beginner', 'intermediate', 'advanced'];
export const EVIDENCE_LABELS = ['EVIDENCE', 'MECHANISM', 'LORE'];
// Fixed playbook template (brief §3), as h2 headings in this order. Sources render from front matter after the body.
export const PLAYBOOK_SECTIONS = [
  'Context & instruments',
  'Time window (IST)',
  'Pre-conditions',
  'Entry',
  'Stop',
  'Target / exit',
  'Position-size rule',
  'When NOT to trade',
  'Known failure modes',
  'Evidence label',
  'Schematic',
];
export const GLANCE_FIELDS = ['glance_stop', 'glance_target', 'glance_size'];
export const GLANCE_MAX = 90;
export const LIBRARY_TYPES = ['course', 'book', 'paper', 'video series', 'newsletter'];
export const LIBRARY_FITS = ['intraday', 'options', 'algo', 'India investing', 'US/global investing', 'risk & psychology', 'tax & rules'];

// The five home-hero facts (design §6.6): all must exist and share one `verified` date whenever the register is non-empty.
export const HERO_FACT_IDS = ['sebi-loss-2026-share', 'sebi-loss-2026-amount', 'sebi-loss-2026-avg', 'sebi-costs-share', 'sebi-loss-2026-five-year-consistent'];
// Register groups by id prefix (design §6.6): every fact id must start with one of these prefixes.
export const FACT_GROUPS = [
  { key: 'sessions', prefixes: ['mkt', 'fo'] },
  { key: 'charges', prefixes: ['chg'] },
  { key: 'options', prefixes: ['opt'] },
  { key: 'sebi', prefixes: ['sebi'] },
  { key: 'tax', prefixes: ['tax'] },
  { key: 'macro', prefixes: ['mac'] },
  { key: 'algo', prefixes: ['algo'] },
  { key: 'india', prefixes: ['inv'] },
  { key: 'abroad', prefixes: ['glb'] },
];
export const factGroup = (id) => FACT_GROUPS.find((g) => g.prefixes.includes(String(id).split('-')[0]))?.key || null;

// Fact values: ≤ 60 chars when a page tokens the id (fatal), ≤ 120 for register-only rows (fatal), warn above 40 when tokened.
export const VALUE_MAX_TOKENED = 60;
export const VALUE_MAX_REGISTER = 120;
export const VALUE_WARN = 40;
// N4: a fact's source TITLE names the enacted instrument or circular, never a Bill clause or a Budget memorandum.
export const BILL_TITLE_RE = /\bFinance(\s*\(No\.\s*\d\))?\s+Bill\b|\bmemorandum\b/i;

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const URL_RE = /^https?:\/\/\S+$/;

async function readJsonOr(file, fallback) {
  if (!existsSync(file)) return fallback;
  return JSON.parse(await readFile(file, 'utf8'));
}

async function listMarkdown(dir) {
  if (!existsSync(dir)) return [];
  return (await readdir(dir)).filter((f) => f.endsWith('.md')).sort();
}

/** "Title | URL | accessed YYYY-MM-DD" → { title, url, accessed }. The accessed part is optional in the string but required by validate(). */
export function parseSources(list = []) {
  return list.map((s) => {
    const parts = String(s).split('|').map((x) => x.trim());
    const accessed = (parts[2] || '').replace(/^accessed\s+/i, '');
    return { title: parts[0] || '', url: parts[1] || '', accessed };
  });
}

export function readingMinutes(text) {
  const words = String(text).replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

const normHeading = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '');
const asList = (v) => (Array.isArray(v) ? v : v === undefined || v === '' ? [] : [v]);

/**
 * Shared front-matter + body parsing. The body renders first so the first {{fact:}} in prose carries the mark; the
 * summary then renders in `.fact-again` mode (cards, lede) and its ids join factRefs after the body's.
 */
function parseArticle(raw, slug, facts, today) {
  const { data, body } = parseFrontMatter(raw);
  const headings = [];
  const factRefs = [];
  const html = renderMarkdown(body, { headings, facts, factRefs, today });
  const summaryRaw = String(data.summary ?? '');
  const summaryHtml = renderInline(summaryRaw, { facts, factRefs });
  return {
    slug,
    data,
    body,
    html,
    summaryRaw,
    summary: plainInline(summaryRaw, { facts }),
    summaryHtml,
    headings: headings.filter((h) => h.depth === 2 || h.depth === 3),
    factRefs,
    minutes: Number(data.reading_time) || readingMinutes(body),
    words: body.split(/\s+/).filter(Boolean).length,
  };
}

export function parseGuide(raw, slug, facts = {}, { today } = {}) {
  const a = parseArticle(raw, slug, facts, today);
  const d = a.data;
  return {
    kind: 'guide',
    slug,
    title: d.title || '',
    section: d.section || '',
    order: Number(d.order || 99),
    summary: a.summary,
    summaryHtml: a.summaryHtml,
    updated: String(d.updated || ''),
    level: String(d.level || ''),
    topics: asList(d.topics),
    related: asList(d.related),
    tools: asList(d.tools).map(String),
    sources: parseSources(asList(d.sources)),
    headings: a.headings,
    factRefs: a.factRefs,
    html: a.html,
    minutes: a.minutes,
    words: a.words,
  };
}

export function parsePlaybook(raw, slug, facts = {}, { today } = {}) {
  const a = parseArticle(raw, slug, facts, today);
  const d = a.data;
  return {
    kind: 'playbook',
    slug,
    title: d.title || '',
    order: Number(d.order || 99),
    summary: a.summary,
    summaryHtml: a.summaryHtml,
    updated: String(d.updated || ''),
    level: String(d.level || ''),
    instruments: asList(d.instruments).map(String),
    window: String(d.window || ''),
    glance: Object.fromEntries(GLANCE_FIELDS.map((k) => [k.replace('glance_', ''), d[k] === undefined ? '' : String(d[k])])),
    evidence: String(d.evidence || '').toUpperCase(),
    topics: asList(d.topics),
    related: asList(d.related),
    tools: asList(d.tools).map(String),
    sources: parseSources(asList(d.sources)),
    headings: a.headings,
    factRefs: a.factRefs,
    html: a.html,
    minutes: a.minutes,
    words: a.words,
  };
}

/** content/pages/<slug>.md: front matter title, summary, updated, sources; body Markdown (the About page lives here). */
export function parsePage(raw, slug, facts = {}, { today } = {}) {
  const a = parseArticle(raw, slug, facts, today);
  const d = a.data;
  return {
    kind: 'page',
    slug,
    title: d.title || '',
    summary: a.summary,
    summaryHtml: a.summaryHtml,
    updated: String(d.updated || ''),
    sources: parseSources(asList(d.sources)),
    headings: a.headings,
    factRefs: a.factRefs,
    html: a.html,
    words: a.words,
  };
}

export async function loadContent(contentDir, { today } = {}) {
  const dataDir = path.join(contentDir, 'data');
  const factsList = await readJsonOr(path.join(dataDir, 'facts.json'), []);
  const facts = Object.fromEntries(factsList.map((f) => [f.id, f]));

  const guides = [];
  const guidesDir = path.join(contentDir, 'guides');
  for (const file of await listMarkdown(guidesDir)) {
    guides.push(parseGuide(await readFile(path.join(guidesDir, file), 'utf8'), file.replace(/\.md$/, ''), facts, { today }));
  }
  guides.sort((a, b) => SECTIONS.indexOf(a.section) - SECTIONS.indexOf(b.section) || a.order - b.order || a.title.localeCompare(b.title));

  const playbooks = [];
  const playbooksDir = path.join(contentDir, 'playbooks');
  for (const file of await listMarkdown(playbooksDir)) {
    playbooks.push(parsePlaybook(await readFile(path.join(playbooksDir, file), 'utf8'), file.replace(/\.md$/, ''), facts, { today }));
  }
  playbooks.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

  const pages = {};
  const pagesDir = path.join(contentDir, 'pages');
  for (const file of await listMarkdown(pagesDir)) {
    const slug = file.replace(/\.md$/, '');
    pages[slug] = parsePage(await readFile(path.join(pagesDir, file), 'utf8'), slug, facts, { today });
  }

  const glossary = await readJsonOr(path.join(dataDir, 'glossary.json'), []);
  const calendar = await readJsonOr(path.join(dataDir, 'calendar.json'), { note: '', filters: [], events: [] });
  const changelog = await readJsonOr(path.join(dataDir, 'changelog.json'), []);
  const resources = await readJsonOr(path.join(dataDir, 'resources.json'), []);
  const library = {
    courses: await readJsonOr(path.join(dataDir, 'library', 'courses.json'), []),
    books: await readJsonOr(path.join(dataDir, 'library', 'books.json'), []),
    path: await readJsonOr(path.join(dataDir, 'library', 'path.json'), { intro: '', stages: [] }),
  };

  const dates = [
    ...guides.map((g) => g.updated), ...playbooks.map((p) => p.updated), ...Object.values(pages).map((p) => p.updated),
    ...factsList.map((f) => f.verified), ...changelog.map((e) => e.date),
  ].filter((d) => DATE.test(d)).sort();
  const reviewed = dates.at(-1) || new Date().toISOString().slice(0, 10);

  const content = {
    guides,
    playbooks,
    pages,
    facts: factsList,
    byFact: facts,
    glossary,
    calendar,
    changelog,
    resources,
    library,
    reviewed,
    byGuide: Object.fromEntries(guides.map((g) => [g.slug, g])),
    byPlaybook: Object.fromEntries(playbooks.map((p) => [p.slug, p])),
  };
  validate(content);
  return content;
}

/** The `<figure class="schematic">…</figure>` block (or the figure around `svg.schematic`), '' when absent. */
function schematicBlock(html) {
  const i = html.search(/<(figure|svg)[^>]*class="[^"]*\bschematic\b[^"]*"/);
  if (i < 0) return '';
  const start = html.lastIndexOf('<figure', i) >= 0 ? html.lastIndexOf('<figure', i) : i;
  const end = html.indexOf('</figure>', i);
  return end < 0 ? html.slice(start) : html.slice(start, end + 9);
}

/**
 * Validate playbook h2 order against the fixed template, plus the schematic rules (design §6.8, D1): an inline
 * <svg> inside `.schematic`, no <text> in it (words live in the HTML legend) and a `<figcaption class="legend">`
 * ending with "Schematic, not real data." Returns a list of problems (empty = OK).
 */
export function checkPlaybookTemplate(p) {
  const problems = [];
  const raw = p.headings.filter((h) => h.depth === 2).map((h) => h.text);
  const h2 = raw.map(normHeading);
  const want = PLAYBOOK_SECTIONS.map(normHeading);
  for (let i = 0; i < want.length; i++) {
    if (h2[i] !== want[i]) { problems.push(`h2 #${i + 1} must be "${PLAYBOOK_SECTIONS[i]}"${raw[i] ? ` (found "${raw[i]}")` : ' (missing)'}`); break; }
  }
  if (h2.length > want.length) problems.push(`unexpected extra h2 "${raw[want.length]}": the template is fixed, use h3 inside a section`);
  const fig = schematicBlock(p.html);
  if (!/<svg[\s>]/.test(p.html)) problems.push('schematic must be an inline <svg>');
  if (!fig) problems.push('schematic must be a <figure class="schematic"> holding the <svg> and a <figcaption class="legend">');
  else {
    if (/<text[\s>]/i.test(fig)) problems.push('schematic <svg> must not contain <text>: put every word in the <figcaption class="legend">');
    const cap = /<figcaption[^>]*class="[^"]*\blegend\b[^"]*"[^>]*>([\s\S]*?)<\/figcaption>/i.exec(fig);
    if (!cap) problems.push('schematic needs a <figcaption class="legend">');
    else if (!/schematic, not real data\./i.test(cap[1])) problems.push('schematic legend must end with "Schematic, not real data."');
  }
  return problems;
}

/** Every calendar string a visitor reads and that may carry tokens: the note, each event's `what` and a rule event's `rule`. */
export function calendarTexts(cal) {
  return [cal?.note || '', ...(Array.isArray(cal?.events) ? cal.events.flatMap((e) => [e.what, e.rule].filter(Boolean)) : [])];
}

/** Ids tokened anywhere a visitor reads them: article bodies and summaries, content pages, glossary, calendar, library notes. */
export function tokenedFactIds(c) {
  const ids = new Set();
  for (const a of [...c.guides, ...c.playbooks, ...Object.values(c.pages || {})]) for (const id of a.factRefs) ids.add(id);
  const refs = [];
  for (const g of c.glossary) renderInline(g.def, { facts: c.byFact, factRefs: refs });
  for (const t of calendarTexts(c.calendar)) renderInline(t, { facts: c.byFact, factRefs: refs });
  if (c.library?.path) {
    renderInline(c.library.path.intro, { facts: c.byFact, factRefs: refs });
    for (const st of c.library.path.stages || []) for (const s of st.steps || []) renderInline(s.note, { facts: c.byFact, factRefs: refs });
  }
  for (const id of refs) ids.add(id);
  return ids;
}

export function validate(c, { tools = TOOLS, warn = (m) => console.warn(m) } = {}) {
  const errors = [];
  const slugs = new Set([...c.guides.map((g) => g.slug), ...c.playbooks.map((p) => p.slug)]);
  const toolIds = new Set(tools.map((t) => t.id));
  c.pages ??= {};

  const checkSources = (a, what) => {
    for (const s of a.sources) {
      if (!s.title || !URL_RE.test(s.url)) errors.push(`${what} ${a.slug}: bad source "${s.title || s.url}" (use "Title | URL | accessed YYYY-MM-DD")`);
      if (!DATE.test(s.accessed)) errors.push(`${what} ${a.slug}: source "${s.title}" needs "accessed YYYY-MM-DD"`);
    }
    for (const id of a.factRefs) if (!c.byFact[id]) errors.push(`${what} ${a.slug}: unknown fact {{fact:${id}}}`);
  };
  const checkArticle = (a, what) => {
    if (!a.title || !a.summary) errors.push(`${what} ${a.slug}: title and summary are required`);
    if (!DATE.test(a.updated)) errors.push(`${what} ${a.slug}: updated must be YYYY-MM-DD`);
    if (!LEVELS.includes(a.level)) errors.push(`${what} ${a.slug}: level must be one of ${LEVELS.join('|')}`);
    for (const r of a.related) if (!slugs.has(r)) errors.push(`${what} ${a.slug}: unknown related ${r}`);
    for (const t of a.tools || []) if (!toolIds.has(t)) errors.push(`${what} ${a.slug}: unknown tool "${t}" in tools: (registry ids: ${[...toolIds].join(', ') || 'none yet'})`);
    if (!a.sources.length) errors.push(`${what} ${a.slug}: at least one source is required`);
    checkSources(a, what);
  };
  for (const g of c.guides) {
    checkArticle(g, 'guide');
    if (!SECTIONS.includes(g.section)) errors.push(`guide ${g.slug}: unknown section "${g.section}"`);
  }
  for (const p of c.playbooks) {
    checkArticle(p, 'playbook');
    if (!EVIDENCE_LABELS.includes(p.evidence)) errors.push(`playbook ${p.slug}: evidence must be one of ${EVIDENCE_LABELS.join('|')}`);
    if (!p.instruments.length) errors.push(`playbook ${p.slug}: instruments required`);
    if (!p.window) errors.push(`playbook ${p.slug}: window (IST) required`);
    for (const k of GLANCE_FIELDS) {
      const v = p.glance?.[k.replace('glance_', '')] || '';
      if (!v) errors.push(`playbook ${p.slug}: ${k} required (at-a-glance grid)`);
      else if (v.length > GLANCE_MAX) errors.push(`playbook ${p.slug}: ${k} is ${v.length} chars; max ${GLANCE_MAX}`);
    }
    for (const problem of checkPlaybookTemplate(p)) errors.push(`playbook ${p.slug}: ${problem}`);
  }
  for (const pg of Object.values(c.pages)) {
    if (!pg.title || !pg.summary) errors.push(`page ${pg.slug}: title and summary are required`);
    if (!DATE.test(pg.updated)) errors.push(`page ${pg.slug}: updated must be YYYY-MM-DD`);
    checkSources(pg, 'page');
  }

  const tokened = tokenedFactIds(c);
  const factIds = new Set();
  for (const f of c.facts) {
    if (!f.id || !/^[a-z0-9][a-z0-9-]*$/.test(f.id)) errors.push(`fact "${f.id}": id must be lowercase-kebab`);
    else if (!factGroup(f.id)) errors.push(`fact ${f.id}: id prefix must be one of ${FACT_GROUPS.flatMap((g) => g.prefixes).join('|')}`);
    if (factIds.has(f.id)) errors.push(`fact ${f.id}: duplicate id`);
    factIds.add(f.id);
    const value = f.value === undefined || f.value === null ? '' : String(f.value);
    if (!value) errors.push(`fact ${f.id}: value required`);
    else if (tokened.has(f.id) && value.length > VALUE_MAX_TOKENED) errors.push(`fact ${f.id}: value is ${value.length} chars; a tokened fact's value must be ≤ ${VALUE_MAX_TOKENED} (move qualifiers to the label)`);
    else if (value.length > VALUE_MAX_REGISTER) errors.push(`fact ${f.id}: value is ${value.length} chars; max ${VALUE_MAX_REGISTER}`);
    else if (tokened.has(f.id) && value.length > VALUE_WARN) warn(`warning: fact ${f.id}: value is ${value.length} chars (${VALUE_WARN} is the comfortable limit for an inline token)`);
    if (!f.label) errors.push(`fact ${f.id}: label required`);
    if (!DATE.test(String(f.since || ''))) errors.push(`fact ${f.id}: since must be YYYY-MM-DD`);
    if (!DATE.test(String(f.verified || ''))) errors.push(`fact ${f.id}: verified must be YYYY-MM-DD`);
    const src = factSource(f);
    if (!URL_RE.test(src.url)) errors.push(`fact ${f.id}: source must be "Title | URL" or a URL`);
    if (BILL_TITLE_RE.test(src.title)) errors.push(`fact ${f.id}: source title "${src.title}" cites a Bill clause or a Budget memorandum; cite the enacted Act section or circular`);
  }
  if (c.facts.length) {
    const missing = HERO_FACT_IDS.filter((id) => !c.byFact[id]);
    if (missing.length) errors.push(`home hero: missing facts ${missing.join(', ')}`);
    else {
      const dates = new Set(HERO_FACT_IDS.map((id) => c.byFact[id].verified));
      if (dates.size > 1) errors.push(`home hero: the five figures must share one verified date (${HERO_FACT_IDS.map((id) => `${id}=${c.byFact[id].verified}`).join(', ')})`);
    }
  }

  const terms = new Set();
  for (const g of c.glossary) {
    if (!g.term || !g.def) errors.push(`glossary entry "${g.term}": term and def required`);
    if (terms.has(g.term)) errors.push(`glossary term "${g.term}": duplicate`);
    terms.add(g.term);
  }
  // Every "See:" target is an existing term (the page links it as #<termId>; a missing target is a dead anchor).
  for (const g of c.glossary) {
    if (g.see !== undefined && !Array.isArray(g.see)) errors.push(`glossary term "${g.term}": see must be an array of terms`);
    for (const t of Array.isArray(g.see) ? g.see : []) if (!terms.has(t)) errors.push(`glossary term "${g.term}": see target "${t}" is not a glossary term`);
  }
  const kinds = new Set((c.calendar.filters || []).map((f) => f.id));
  for (const f of c.calendar.filters || []) if (!f.id || !f.label) errors.push(`calendar.json: every filter needs id and label (${JSON.stringify(f)})`);
  if (!Array.isArray(c.calendar.events)) errors.push('calendar.json: events must be an array');
  else for (const e of c.calendar.events) {
    const who = `calendar event "${String(e.what || '').slice(0, 60)}"`;
    if (!e.what) errors.push(`calendar event: "what" required (${JSON.stringify(e).slice(0, 60)})`);
    if (!kinds.has(e.kind)) errors.push(`${who}: kind "${e.kind}" is not a filter id (${[...kinds].join(', ') || 'no filters defined'})`);
    if (e.date === undefined && !e.rule) errors.push(`${who}: a "date" (YYYY-MM-DD) or a "rule" is required`);
    if (e.date !== undefined && !DATE.test(String(e.date))) errors.push(`${who}: date must be YYYY-MM-DD`);
    if (e.date !== undefined && e.rule) errors.push(`${who}: give either a date or a rule, not both`);
    if (!/^https:\/\/\S+$/.test(String(e.source || ''))) errors.push(`${who}: source must be an https URL`);
  }
  const strayRefs = [];
  for (const g of c.glossary) renderInline(g.def, { facts: c.byFact, factRefs: strayRefs });
  for (const t of calendarTexts(c.calendar)) renderInline(t, { facts: c.byFact, factRefs: strayRefs });
  for (const id of strayRefs) if (!c.byFact[id]) errors.push(`glossary/calendar: unknown fact {{fact:${id}}}`);
  for (const e of c.changelog) {
    if (!DATE.test(String(e.date || ''))) errors.push(`changelog entry "${e.what}": date must be YYYY-MM-DD`);
    if (!e.what || !URL_RE.test(String(e.source || ''))) errors.push(`changelog entry "${e.what}": what and source URL required`);
  }
  for (const r of c.resources) if (!r.name || !r.category || !URL_RE.test(String(r.url || ''))) errors.push(`resource "${r.name}": name, category and url required`);

  for (const [kind, list] of [['course', c.library.courses], ['book', c.library.books]]) {
    const ids = new Set();
    for (const e of list) {
      const who = `${kind} "${e.title}"`;
      if (!e.id || ids.has(e.id)) errors.push(`${who}: unique id required`);
      ids.add(e.id);
      if (!e.title || !e.by) errors.push(`${who}: title and by (author/provider) required`);
      if (!LIBRARY_TYPES.includes(e.type)) errors.push(`${who}: type must be one of ${LIBRARY_TYPES.join('|')}`);
      if (!['free', 'paid'].includes(e.cost)) errors.push(`${who}: cost must be free|paid`);
      if (!Array.isArray(e.links) || !e.links.length || e.links.some((l) => !URL_RE.test(l.url || '') || !l.label)) errors.push(`${who}: links [{label, url}] required`);
      if (!LEVELS.includes(e.level)) errors.push(`${who}: level must be one of ${LEVELS.join('|')}`);
      if (!Array.isArray(e.fits) || !e.fits.length || e.fits.some((f) => !LIBRARY_FITS.includes(f))) errors.push(`${who}: fits must be a non-empty subset of ${LIBRARY_FITS.join(' | ')}`);
      if (!e.year) errors.push(`${who}: year (edition / last updated) required`);
      if (!e.why) errors.push(`${who}: why (one line) required`);
      if (!e.caveats) errors.push(`${who}: caveats (one line) required`);
      if (e.cost === 'paid' && e.price && !e.price.seen) errors.push(`${who}: a price needs the date it was seen`);
    }
  }
  const libraryIds = new Set([...c.library.courses, ...c.library.books].map((e) => e.id));
  for (const stage of c.library.path.stages || []) {
    for (const step of stage.steps || []) if (!libraryIds.has(step.entry)) errors.push(`path stage "${stage.title}": unknown library entry ${step.entry}`);
  }

  if (errors.length) throw new Error('Content validation failed:\n' + errors.join('\n'));
}
