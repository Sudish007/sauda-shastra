// Markdown → HTML for guides, playbooks and content pages. marked with: heading ids + anchors, responsive table
// wrappers, external links opening safely, ::: callout blocks (note | tip | warning | rule | example | evidence),
// the {{fact:id}} inline token that renders a value from content/data/facts.json (design §6.6: the first use on a
// page carries "✓ <verified date>", later uses render the value plain, a future `since` adds "(from <date>)") and the
// {{label:EVIDENCE|MECHANISM|LORE}} shortcode for evidence chips and the {{date:YYYY-MM-DD}} shortcode that renders a date
// as <time> (dates are data: the never-typed scan skips them). renderInline() expands the same tokens inside plain
// strings (summaries, glossary definitions, calendar text) so a changeable number is never typed anywhere.
import { Marked } from 'marked';
import { STRINGS as S, fill } from './strings.js';
import { formatDate, isFuture, todayIST } from './dates.js';

export const FACT_TOKEN = /\{\{fact:([a-z0-9][a-z0-9-]*)\}\}/g;
export const LABEL_TOKEN = /\{\{label:(EVIDENCE|MECHANISM|LORE)\}\}/g;
export const DATE_TOKEN = /\{\{date:(\d{4}-\d{2}-\d{2})\}\}/g;

/** `<time datetime="2026-11-01">1 Nov 2026</time>` for the {{date:…}} token. */
export function dateHtml(iso) {
  return `<time datetime="${escapeHtml(iso)}">${escapeHtml(formatDate(iso))}</time>`;
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Undo marked's inline escaping so heading text/ids compare as written ("Context & instruments"). */
export function decodeEntities(s) {
  return String(s).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

/** "Title | URL" (or a bare URL) → { title, url } for a fact's source. */
export function factSource(f) {
  const [title, url] = String(f.source || '').split('|').map((x) => x.trim());
  return url ? { title, url } : { title: title, url: title };
}

/** "<title> · since|from D MMM YYYY · verified D MMM YYYY" — the N4 citation line used by marks, the rail and the register. */
export function factCitation(f, { today = todayIST(), link = false } = {}) {
  const src = factSource(f);
  const when = `${isFuture(f.since, today) ? S.labels.from : S.labels.since} ${formatDate(f.since)} · ${S.labels.verified} ${formatDate(f.verified)}`;
  const title = link ? `<a href="${escapeHtml(src.url)}" rel="noopener noreferrer" target="_blank">${escapeHtml(src.title)}</a>` : escapeHtml(src.title);
  return `${title} · ${escapeHtml(when)}`;
}

/** The evidence chip: `<span class="tag tag-evidence" data-evidence="LORE">○ Lore</span>` (glyph + label as text). */
export function evidenceTagHtml(label) {
  const key = String(label || '').toUpperCase();
  if (!S.labels.evidenceLabels[key]) return '';
  return `<span class="tag tag-evidence" data-evidence="${key}">${S.labels.evidenceGlyphs[key]} ${escapeHtml(S.labels.evidenceLabels[key])}</span>`;
}

/**
 * One fact token. `again` = the id was already shown on this page (value only). The first occurrence carries the
 * mark "✓ <verified>" linking to the rail entry (#fact-ID) with the citation as its title; a future `since` adds
 * "(from D MMM YYYY)" between value and mark. Unknown id → a visible marker (validate() fails the build).
 */
export function factHtml(id, f, { again = false, today = todayIST() } = {}) {
  if (!f) return `<span class="fact fact-missing" data-fact="${escapeHtml(id)}">[${escapeHtml(fill(S.labels.factMissing, { id }))}]</span>`;
  const value = `<span class="fact-value">${escapeHtml(f.value)}</span>`;
  if (again) return `<span class="fact fact-again" data-fact="${escapeHtml(id)}">${value}</span>`;
  const from = isFuture(f.since, today) ? ` <span class="fact-from">(${escapeHtml(S.labels.from)} ${escapeHtml(formatDate(f.since))})</span>` : '';
  const mark = `<a class="fact-mark" href="#fact-${escapeHtml(id)}" title="${factCitation(f, { today })}">${escapeHtml(fill(S.labels.verifiedMark, { date: formatDate(f.verified) }))}</a>`;
  return `<span class="fact" data-fact="${escapeHtml(id)}">${value}${from} ${mark}</span>`;
}

const callout = {
  name: 'callout',
  level: 'block',
  start(src) { return src.match(/^:::/m)?.index; },
  tokenizer(src) {
    const m = /^:::(note|tip|warning|rule|example|evidence)(?:[ \t]+([^\n]*))?\n([\s\S]*?)\n:::(?:\n|$)/.exec(src);
    if (!m) return undefined;
    return { type: 'callout', raw: m[0], kind: m[1], title: (m[2] || '').trim(), tokens: this.lexer.blockTokens(m[3]) };
  },
  renderer(token) {
    const labels = { note: 'Note', tip: 'Tip', warning: 'Watch out', rule: 'The rule', example: 'Worked example', evidence: 'Evidence' };
    const title = token.title || labels[token.kind];
    return `<aside class="callout callout-${token.kind}" role="note"><p class="callout-title">${escapeHtml(title)}</p>${this.parser.parse(token.tokens)}</aside>\n`;
  },
};

/** `{{fact:id}}` inline extension. factRefs records ids in order of first use and decides first vs again. */
function factShortcode({ facts = {}, factRefs, today } = {}) {
  return {
    name: 'fact',
    level: 'inline',
    start(src) { return src.indexOf('{{fact:'); },
    tokenizer(src) {
      const m = /^\{\{fact:([a-z0-9][a-z0-9-]*)\}\}/.exec(src);
      if (!m) return undefined;
      return { type: 'fact', raw: m[0], id: m[1] };
    },
    renderer(token) {
      const again = factRefs.includes(token.id);
      if (!again) factRefs.push(token.id);
      return factHtml(token.id, facts[token.id], { again, today });
    },
  };
}

/** `{{label:EVIDENCE|MECHANISM|LORE}}` inline extension → the evidence chip. */
const labelShortcode = {
  name: 'label',
  level: 'inline',
  start(src) { return src.indexOf('{{label:'); },
  tokenizer(src) {
    const m = /^\{\{label:(EVIDENCE|MECHANISM|LORE)\}\}/.exec(src);
    if (!m) return undefined;
    return { type: 'label', raw: m[0], label: m[1] };
  },
  renderer(token) { return evidenceTagHtml(token.label); },
};

/** `{{date:YYYY-MM-DD}}` inline extension → `<time>` (a dated statement such as "as of 1 Nov 2026" stays data). */
const dateShortcode = {
  name: 'date',
  level: 'inline',
  start(src) { return src.indexOf('{{date:'); },
  tokenizer(src) {
    const m = /^\{\{date:(\d{4}-\d{2}-\d{2})\}\}/.exec(src);
    if (!m) return undefined;
    return { type: 'date', raw: m[0], iso: m[1] };
  },
  renderer(token) { return dateHtml(token.iso); },
};

export function createMarkdown({ headings, facts, factRefs = [], today } = {}) {
  const marked = new Marked({ gfm: true, breaks: false });
  marked.use({ extensions: [callout, factShortcode({ facts, factRefs, today }), labelShortcode, dateShortcode] });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const plain = decodeEntities(text.replace(/<[^>]+>/g, ''));
        let id = slugify(plain) || `h-${depth}`;
        if (headings) {
          const seen = headings.filter((h) => h.id === id || h.id.startsWith(id + '-')).length;
          if (seen) id = `${id}-${seen + 1}`;
          headings.push({ depth, id, text: plain });
        }
        return `<h${depth} id="${id}">${text}<a class="anchor" href="#${id}" aria-label="Link to this section">#</a></h${depth}>\n`;
      },
      table(token) {
        const header = token.header.map((c) => `<th${c.align ? ` style="text-align:${c.align}"` : ''}>${this.parser.parseInline(c.tokens)}</th>`).join('');
        const rows = token.rows
          .map((row) => `<tr>${row.map((c, i) => `<td${token.header[i]?.align ? ` style="text-align:${token.header[i].align}"` : ''}>${this.parser.parseInline(c.tokens)}</td>`).join('')}</tr>`)
          .join('');
        return `<div class="table-wrap"><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//i.test(href);
        const t = title ? ` title="${escapeHtml(title)}"` : '';
        return external
          ? `<a href="${escapeHtml(href)}"${t} rel="noopener noreferrer" target="_blank">${text}</a>`
          : `<a href="${escapeHtml(href)}"${t}>${text}</a>`;
      },
    },
  });
  return marked;
}

/** Full Markdown document → HTML. `factRefs` (array) collects fact ids in order of first use; `today` = YYYY-MM-DD for tests. */
export function renderMarkdown(src, { headings, facts, factRefs, today } = {}) {
  return createMarkdown({ headings, facts, factRefs: factRefs || [], today }).parse(src);
}

/**
 * Plain string (front-matter summary, glossary definition, calendar text, path note) → HTML with every
 * {{fact:id}} rendered as a plain `.fact-again` value (no mark: the rail or the register carries the citation),
 * every {{label:X}} as a chip and every {{date:YYYY-MM-DD}} as <time>; everything else HTML-escaped. Unknown ids
 * render the marker and are recorded.
 */
export function renderInline(text, { facts = {}, factRefs } = {}) {
  const parts = [];
  let last = 0;
  const re = /\{\{(fact|label|date):([A-Za-z0-9-]+)\}\}/g;
  for (const m of String(text ?? '').matchAll(re)) {
    parts.push(escapeHtml(text.slice(last, m.index)));
    if (m[1] === 'fact') {
      const id = m[2];
      if (/^[a-z0-9][a-z0-9-]*$/.test(id)) {
        if (factRefs && !factRefs.includes(id)) factRefs.push(id);
        parts.push(factHtml(id, facts[id], { again: true }));
      } else parts.push(escapeHtml(m[0]));
    } else if (m[1] === 'date') parts.push(/^\d{4}-\d{2}-\d{2}$/.test(m[2]) ? dateHtml(m[2]) : escapeHtml(m[0]));
    else parts.push(evidenceTagHtml(m[2]) || escapeHtml(m[0]));
    last = m.index + m[0].length;
  }
  parts.push(escapeHtml(String(text ?? '').slice(last)));
  return parts.join('');
}

/** Plain string with tokens reduced to their value (for meta descriptions, search text, titles). Unknown ids keep the token. */
export function plainInline(text, { facts = {} } = {}) {
  return String(text ?? '')
    .replace(FACT_TOKEN, (m, id) => (facts[id] ? String(facts[id].value) : m))
    .replace(LABEL_TOKEN, (_, l) => S.labels.evidenceLabels[l] || l)
    .replace(DATE_TOKEN, (_, iso) => formatDate(iso));
}

/** Tiny front-matter parser: `key: value`, `key: [a, b]`, and `key:` followed by `- item` lines. */
export function parseFrontMatter(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!m) return { data: {}, body: raw };
  const data = {};
  const lines = m[1].split(/\r?\n/);
  let listKey = null;
  for (const line of lines) {
    if (!line.trim()) continue;
    const item = /^\s*-\s+(.*)$/.exec(line);
    if (item && listKey) { data[listKey].push(coerce(item[1])); continue; }
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    const [, key, value] = kv;
    if (value === '') { data[key] = []; listKey = key; continue; }
    listKey = null;
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value.slice(1, -1).split(',').map((v) => coerce(v.trim())).filter((v) => v !== '');
    } else data[key] = coerce(value);
  }
  return { data, body: m[2] };
}

function coerce(v) {
  const s = String(v).trim().replace(/^["']|["']$/g, '');
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return s;
}
