// Load and validate all content: guides and playbooks (Markdown + front matter), facts, glossary, calendar,
// changelog, resources and the learning library. Throws on broken references so the build (and tests) fail loudly.
// Every loader tolerates an empty content set: a missing file or folder is an empty list.
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { parseFrontMatter, renderMarkdown } from './markdown.js';

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
export const LIBRARY_TYPES = ['course', 'book', 'paper', 'video series', 'newsletter'];
export const LIBRARY_FITS = ['intraday', 'options', 'algo', 'India investing', 'US/global investing', 'risk & psychology', 'tax & rules'];

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

function parseArticle(raw, slug, facts) {
  const { data, body } = parseFrontMatter(raw);
  const headings = [];
  const factRefs = [];
  const html = renderMarkdown(body, { headings, facts, factRefs });
  return {
    slug,
    data,
    body,
    html,
    headings: headings.filter((h) => h.depth === 2 || h.depth === 3),
    factRefs,
    minutes: Number(data.reading_time) || readingMinutes(body),
    words: body.split(/\s+/).filter(Boolean).length,
  };
}

export function parseGuide(raw, slug, facts = {}) {
  const a = parseArticle(raw, slug, facts);
  const d = a.data;
  return {
    kind: 'guide',
    slug,
    title: d.title || '',
    section: d.section || '',
    order: Number(d.order || 99),
    summary: d.summary || '',
    updated: String(d.updated || ''),
    level: String(d.level || ''),
    topics: Array.isArray(d.topics) ? d.topics : [],
    related: Array.isArray(d.related) ? d.related : [],
    sources: parseSources(Array.isArray(d.sources) ? d.sources : []),
    headings: a.headings,
    factRefs: a.factRefs,
    html: a.html,
    minutes: a.minutes,
    words: a.words,
  };
}

export function parsePlaybook(raw, slug, facts = {}) {
  const a = parseArticle(raw, slug, facts);
  const d = a.data;
  return {
    kind: 'playbook',
    slug,
    title: d.title || '',
    order: Number(d.order || 99),
    summary: d.summary || '',
    updated: String(d.updated || ''),
    level: String(d.level || ''),
    instruments: Array.isArray(d.instruments) ? d.instruments : d.instruments ? [d.instruments] : [],
    window: String(d.window || ''),
    evidence: String(d.evidence || '').toUpperCase(),
    topics: Array.isArray(d.topics) ? d.topics : [],
    related: Array.isArray(d.related) ? d.related : [],
    sources: parseSources(Array.isArray(d.sources) ? d.sources : []),
    headings: a.headings,
    factRefs: a.factRefs,
    html: a.html,
    minutes: a.minutes,
    words: a.words,
  };
}

export async function loadContent(contentDir) {
  const dataDir = path.join(contentDir, 'data');
  const factsList = await readJsonOr(path.join(dataDir, 'facts.json'), []);
  const facts = Object.fromEntries(factsList.map((f) => [f.id, f]));

  const guides = [];
  const guidesDir = path.join(contentDir, 'guides');
  for (const file of await listMarkdown(guidesDir)) {
    guides.push(parseGuide(await readFile(path.join(guidesDir, file), 'utf8'), file.replace(/\.md$/, ''), facts));
  }
  guides.sort((a, b) => SECTIONS.indexOf(a.section) - SECTIONS.indexOf(b.section) || a.order - b.order || a.title.localeCompare(b.title));

  const playbooks = [];
  const playbooksDir = path.join(contentDir, 'playbooks');
  for (const file of await listMarkdown(playbooksDir)) {
    playbooks.push(parsePlaybook(await readFile(path.join(playbooksDir, file), 'utf8'), file.replace(/\.md$/, ''), facts));
  }
  playbooks.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

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
    ...guides.map((g) => g.updated), ...playbooks.map((p) => p.updated),
    ...factsList.map((f) => f.verified), ...changelog.map((e) => e.date),
  ].filter((d) => DATE.test(d)).sort();
  const reviewed = dates.at(-1) || new Date().toISOString().slice(0, 10);

  const content = {
    guides,
    playbooks,
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

/** Validate playbook h2 order against the fixed template. Returns a list of problems (empty = OK). */
export function checkPlaybookTemplate(p) {
  const problems = [];
  const raw = p.headings.filter((h) => h.depth === 2).map((h) => h.text);
  const h2 = raw.map(normHeading);
  const want = PLAYBOOK_SECTIONS.map(normHeading);
  for (let i = 0; i < want.length; i++) {
    if (h2[i] !== want[i]) { problems.push(`h2 #${i + 1} must be "${PLAYBOOK_SECTIONS[i]}"${raw[i] ? ` (found "${raw[i]}")` : ' (missing)'}`); break; }
  }
  if (h2.length > want.length) problems.push(`unexpected extra h2 "${raw[want.length]}": the template is fixed, use h3 inside a section`);
  if (!/<svg[\s>]/.test(p.html)) problems.push('schematic must be an inline <svg>');
  if (!/schematic, not real data/i.test(p.html)) problems.push('schematic caption "schematic, not real data" missing');
  return problems;
}

export function validate(c) {
  const errors = [];
  const slugs = new Set([...c.guides.map((g) => g.slug), ...c.playbooks.map((p) => p.slug)]);

  const checkArticle = (a, what) => {
    if (!a.title || !a.summary) errors.push(`${what} ${a.slug}: title and summary are required`);
    if (!DATE.test(a.updated)) errors.push(`${what} ${a.slug}: updated must be YYYY-MM-DD`);
    if (!LEVELS.includes(a.level)) errors.push(`${what} ${a.slug}: level must be one of ${LEVELS.join('|')}`);
    for (const r of a.related) if (!slugs.has(r)) errors.push(`${what} ${a.slug}: unknown related ${r}`);
    if (!a.sources.length) errors.push(`${what} ${a.slug}: at least one source is required`);
    for (const s of a.sources) {
      if (!s.title || !URL_RE.test(s.url)) errors.push(`${what} ${a.slug}: bad source "${s.title || s.url}" (use "Title | URL | accessed YYYY-MM-DD")`);
      if (!DATE.test(s.accessed)) errors.push(`${what} ${a.slug}: source "${s.title}" needs "accessed YYYY-MM-DD"`);
    }
    for (const id of a.factRefs) if (!c.byFact[id]) errors.push(`${what} ${a.slug}: unknown fact {{fact:${id}}}`);
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
    for (const problem of checkPlaybookTemplate(p)) errors.push(`playbook ${p.slug}: ${problem}`);
  }

  const factIds = new Set();
  for (const f of c.facts) {
    if (!f.id || !/^[a-z0-9][a-z0-9-]*$/.test(f.id)) errors.push(`fact "${f.id}": id must be lowercase-kebab`);
    if (factIds.has(f.id)) errors.push(`fact ${f.id}: duplicate id`);
    factIds.add(f.id);
    if (f.value === undefined || f.value === null || f.value === '') errors.push(`fact ${f.id}: value required`);
    if (!f.label) errors.push(`fact ${f.id}: label required`);
    if (!DATE.test(String(f.since || ''))) errors.push(`fact ${f.id}: since must be YYYY-MM-DD`);
    if (!DATE.test(String(f.verified || ''))) errors.push(`fact ${f.id}: verified must be YYYY-MM-DD`);
    const src = parseSources([f.source || ''])[0];
    if (!URL_RE.test(src.url || src.title)) errors.push(`fact ${f.id}: source must be "Title | URL" or a URL`);
  }

  const terms = new Set();
  for (const g of c.glossary) {
    if (!g.term || !g.def) errors.push(`glossary entry "${g.term}": term and def required`);
    if (terms.has(g.term)) errors.push(`glossary term "${g.term}": duplicate`);
    terms.add(g.term);
  }
  if (!Array.isArray(c.calendar.events)) errors.push('calendar.json: events must be an array');
  else for (const e of c.calendar.events) if (!e.what) errors.push(`calendar event: "what" required (${JSON.stringify(e).slice(0, 60)})`);
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
      if (e.cost === 'paid' && e.price && !e.price.seen) errors.push(`${who}: a price needs the date it was seen`);
    }
  }
  const libraryIds = new Set([...c.library.courses, ...c.library.books].map((e) => e.id));
  for (const stage of c.library.path.stages || []) {
    for (const step of stage.steps || []) if (!libraryIds.has(step.entry)) errors.push(`path stage "${stage.title}": unknown library entry ${step.entry}`);
  }

  if (errors.length) throw new Error('Content validation failed:\n' + errors.join('\n'));
}
