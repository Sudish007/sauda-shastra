// Page renderers. Each returns a full document via layout(). All URLs relative; no UI string literals here.
// Markup follows the approved design mocks (design.md §6); class names come from site/styles.css.
import { escapeHtml as esc, renderInline, factSource } from './markdown.js';
import { SECTIONS, PHASE2_SECTIONS, HERO_FACT_IDS, FACT_GROUPS, factGroup } from './content.js';
import { TOOLS, byTool } from './tools.js';
import { SITE } from './config.js';
import { STRINGS as S, fill } from './strings.js';
import { formatDate, isFuture, todayIST } from './dates.js';
import { layout, rel, timeTag, breadcrumbs, sourcesList, factsBox, disclaimer, levelTag, evidenceTag, ICONS } from './templates.js';

export { TOOLS } from './tools.js';

// The three guides the home page puts before everything else (design §6.5); only those that exist render.
export const START_HERE = ['what-sebi-loss-studies-say', 'trading-day-ist', 'what-a-trade-costs'];
const LOSS_STUDIES_GUIDE = 'what-sebi-loss-studies-say';
const SECTION_CARD_MAX = 6;

const anchor = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const empty = (text) => `<p class="empty">${esc(text)}</p>`;
/** fill() for templates whose placeholders hold HTML: the string is escaped first, then the HTML goes in. */
const fillHtml = (template, vars) => fill(esc(template), vars);

/** Distinct source URLs cited anywhere (guides, playbooks, pages, facts, changelog). */
export function allSources(c) {
  const map = new Map();
  for (const a of [...c.guides, ...c.playbooks, ...Object.values(c.pages || {})]) for (const s of a.sources) if (!map.has(s.url)) map.set(s.url, s.title);
  for (const f of c.facts) { const src = factSource(f); if (!map.has(src.url)) map.set(src.url, src.url === src.title ? f.label : src.title); }
  for (const e of c.changelog) if (!map.has(e.source)) map.set(e.source, e.what);
  return map;
}

export function counts(c) {
  return { guides: c.guides.length, playbooks: c.playbooks.length, tools: TOOLS.length, terms: c.glossary.length, sources: allSources(c).size, courses: c.library.courses.length, books: c.library.books.length, facts: c.facts.length };
}

function articleCard(a, r, href) {
  const tags = `${levelTag(a.level)}${a.kind === 'guide' ? `<span class="tag">${esc(a.section)}</span>` : evidenceTag(a.evidence)}`;
  return `<a class="card card-link" href="${href}"><div class="card-tags">${tags}</div><h3>${esc(a.title)}</h3><p class="muted">${a.summaryHtml}</p><div class="meta"><span><b class="num">${a.minutes}</b> ${esc(S.labels.minRead)}</span><span>${esc(S.labels.reviewed)} ${timeTag(a.updated)}</span><span><b class="num">${a.sources.length}</b> ${esc(S.labels.sources)}</span></div></a>`;
}

/* ---------- Home ---------- */

/** The hero card: five SEBI figures as plain .fact spans with one card-level citation (design §6.6). */
function sebiBox(c, r) {
  const facts = HERO_FACT_IDS.map((id) => c.byFact[id]);
  if (facts.some((f) => !f)) {
    return `<aside class="sebi-box" aria-labelledby="sebi-title"><p class="eyebrow" id="sebi-title">${esc(fill(S.home.sebi.eyebrow, { fy: '' }))}</p><p class="muted">${esc(S.home.sebi.empty)}</p></aside>`;
  }
  const [share, amount, avg, costs, consistent] = facts;
  const span = (f) => `<span class="fact" data-fact="${esc(f.id)}"><span class="fact-value">${esc(f.value)}</span></span>`;
  const fy = /\bFY\d{2}(?:[–-]\d{2})?\b/.exec(share.label)?.[0];
  const sources = [...new Map(facts.map((f) => { const s = factSource(f); return [s.url, s.title]; })).entries()]
    .map(([url, title]) => `<a href="${esc(url)}" rel="noopener noreferrer" target="_blank">${esc(title)}</a>`);
  const cites = sources.length > 1 ? `${sources.slice(0, -1).join(', ')} and ${sources.at(-1)}` : sources[0];
  const link = c.byGuide[LOSS_STUDIES_GUIDE] ? `${r}guides/${LOSS_STUDIES_GUIDE}/` : `${r}facts/`;
  return `<aside class="sebi-box" aria-labelledby="sebi-title">
        <p class="eyebrow" id="sebi-title">${esc(fill(S.home.sebi.eyebrow, { fy: fy ? ` · ${fy}` : '' }))}</p>
        <dl>
          <div><dd class="num">${span(share)}</dd><dt>${esc(S.home.sebi.lost)}</dt></div>
          <div><dd class="num">${span(amount)}</dd><dt>${esc(S.home.sebi.netLoss)}</dt></div>
          <div><dd class="num">${span(avg)}</dd><dt>${esc(S.home.sebi.avgLoss)}</dt></div>
        </dl>
        <p>${esc(S.home.sebi.read)} ${fillHtml(S.home.sebi.costs, { costs: span(costs) })} ${fillHtml(S.home.sebi.consistent, { consistent: span(consistent) })}</p>
        <p class="source">${fillHtml(S.home.sebi.cite, { date: timeTag(share.verified) })} ${cites} · <a href="${link}">${esc(S.home.sebi.link)}</a></p>
      </aside>`;
}

function sectionCard(x, r) {
  const shown = x.guides.length <= SECTION_CARD_MAX ? x.guides : x.guides.slice(0, SECTION_CARD_MAX - 1);
  const more = x.guides.length - shown.length;
  const body = x.guides.length
    ? `<ul>${shown.map((g) => `<li><a href="${r}guides/${g.slug}/">${esc(g.title)}</a></li>`).join('')}</ul>${more ? `<p class="more"><a href="${r}guides/#${anchor(x.section)}">${esc(fill(S.home.more, { n: more }))}</a></p>` : ''}`
    : `<p class="muted small">${esc(S.home.sectionScope[x.section] || '')}</p>`;
  return `<div class="card section-card"><h3><a href="${r}guides/#${anchor(x.section)}">${esc(x.section)}</a></h3>${body}</div>`;
}

export function homePage(c) {
  const r = rel(0);
  const n = counts(c);
  const bySection = SECTIONS.map((s) => ({ section: s, guides: c.guides.filter((g) => g.section === s) }));
  // NIT 4: Phase-2 sections without guides sit in their own grid so scope cards never share a row with link lists.
  const live = bySection.filter((x) => x.guides.length || !PHASE2_SECTIONS.includes(x.section));
  const upcoming = bySection.filter((x) => !x.guides.length && PHASE2_SECTIONS.includes(x.section));
  const start = START_HERE.map((slug) => c.byGuide[slug]).filter(Boolean);
  const body = `
<section class="hero">
  <div class="container">
    <div class="hero-grid">
      <div class="hero-main">
        <p class="eyebrow">${esc(S.home.eyebrow)}</p>
        <h1>${esc(SITE.tagline)}</h1>
        <p class="lede">${esc(S.home.lede)}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="${r}guides/">${esc(S.home.ctaGuides)}</a>
          <a class="btn btn-secondary" href="${r}playbooks/">${esc(S.home.ctaPlaybooks)}</a>
          <a class="btn btn-secondary" href="${r}learn/">${esc(S.home.ctaLearn)}</a>
        </div>
      </div>
      ${sebiBox(c, r)}
    </div>
    <dl class="counts" aria-label="${esc(S.home.countsAria)}" data-counts>
      <div><dt>${esc(S.home.counts.guides)}</dt><dd class="num" data-count="guides">${n.guides}</dd></div>
      <div><dt>${esc(S.home.counts.playbooks)}</dt><dd class="num" data-count="playbooks">${n.playbooks}</dd></div>
      <div><dt>${esc(S.home.counts.tools)}</dt><dd class="num" data-count="tools">${n.tools}</dd></div>
      <div><dt>${esc(S.home.counts.terms)}</dt><dd class="num" data-count="terms">${n.terms}</dd></div>
      <div><dt>${esc(S.home.counts.sources)}</dt><dd class="num" data-count="sources">${n.sources}</dd></div>
    </dl>
  </div>
</section>
${start.length ? `
<section class="section" id="start">
  <div class="container">
    <div class="section-head"><div><p class="eyebrow">${esc(S.home.startEyebrow)}</p><h2>${esc(S.home.startTitle)}</h2></div><p>${esc(S.home.startLede)}</p></div>
    <div class="grid grid-fill-3">${start.map((g) => articleCard(g, r, `${r}guides/${g.slug}/`)).join('')}</div>
  </div>
</section>` : ''}
<section class="section" id="sections">
  <div class="container">
    <div class="section-head"><div><p class="eyebrow">${esc(S.home.sectionsEyebrow)}</p><h2>${esc(S.home.sectionsTitle)}</h2></div><a class="btn btn-secondary btn-sm" href="${r}guides/">${esc(S.footer.links.start[0].label)}</a></div>
    ${live.length ? `<div class="grid grid-fill-5">${live.map((x) => sectionCard(x, r)).join('')}</div>` : ''}
    ${upcoming.length ? `<p class="eyebrow" style="margin-top:var(--space-6)">${esc(S.home.phase2Eyebrow)}</p><div class="grid grid-fill-3" style="margin-top:var(--space-3)">${upcoming.map((x) => sectionCard(x, r)).join('')}</div>` : ''}
  </div>
</section>

<section class="section" id="playbooks">
  <div class="container">
    <div class="section-head"><div><p class="eyebrow">${esc(S.home.playbooksEyebrow)}</p><h2>${esc(S.home.playbooksTitle)}</h2></div><p>${esc(S.home.playbooksLede)}</p></div>
    ${c.playbooks.length ? `<div class="grid grid-fill-3">${c.playbooks.slice(0, 3).map((p) => articleCard(p, r, `${r}playbooks/${p.slug}/`)).join('')}</div>` : empty(S.playbooks.empty)}
  </div>
</section>

<section class="section" id="learn">
  <div class="container">
    <div class="section-head"><div><p class="eyebrow">${esc(S.home.learnEyebrow)}</p><h2>${esc(S.home.learnTitle)}</h2></div><p>${esc(S.home.learnLede)}</p></div>
    <div class="cluster"><a class="btn btn-primary" href="${r}learn/">${esc(S.home.learnCta)}</a><span class="muted"><b class="num">${n.courses}</b> ${esc(S.learn.courses.toLowerCase())} · <b class="num">${n.books}</b> ${esc(S.learn.books.toLowerCase())}</span></div>
  </div>
</section>

<section class="section" id="honesty">
  <div class="container">
    <div class="section-head"><div><p class="eyebrow">${esc(S.home.honestyEyebrow)}</p><h2>${esc(S.home.honestyTitle)}</h2></div></div>
    <div class="grid grid-4">${S.home.honesty.map((h) => `<div class="card honesty-card"><h3>${esc(h.title)}</h3><p>${fillHtml(h.text, { register: `<a href="${r}facts/">${esc(S.labels.factsRegister)}</a>`, changelog: `<a href="${r}changelog/">${esc(S.changelog.eyebrow)}</a>` })}</p></div>`).join('')}</div>
  </div>
</section>`;
  return layout({ title: '', description: SITE.description, path: 'index.html', depth: 0, body, current: '' });
}

/* ---------- Guides ---------- */

export function guidesIndexPage(c) {
  const r = rel(1);
  const bySection = SECTIONS.map((s) => ({ section: s, guides: c.guides.filter((g) => g.section === s) })).filter((x) => x.guides.length);
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.guides.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.guides.eyebrow)}</p><h1>${esc(fill(S.guides.title, { n: c.guides.length }))}</h1></div><p class="lede">${esc(S.guides.lede)}</p></div>
    ${bySection.length ? bySection.map((x) => `<h2 class="group-title" id="${anchor(x.section)}">${esc(x.section)}</h2><div class="grid grid-fill-4">${x.guides.map((g) => articleCard(g, r, `${r}guides/${g.slug}/`)).join('')}</div>`).join('') : empty(S.guides.empty)}
  </div></section>`;
  return layout({ title: S.guides.eyebrow, description: S.guides.lede, path: 'guides/index.html', depth: 1, body, current: 'guides/' });
}

function relatedList(slugs, c, r) {
  const items = slugs.map((s) => c.byGuide[s] ? { href: `${r}guides/${s}/`, a: c.byGuide[s], kind: S.labels.guide } : c.byPlaybook[s] ? { href: `${r}playbooks/${s}/`, a: c.byPlaybook[s], kind: S.labels.playbook } : null).filter(Boolean);
  if (!items.length) return '';
  return `<div class="card related-card"><h2>${esc(S.labels.related)}</h2><ul>${items.map((x) => `<li><a href="${x.href}">${esc(x.a.title)}</a><small>${esc(x.kind)} · ${x.a.minutes} ${esc(S.labels.minRead)}</small></li>`).join('')}</ul></div>`;
}

/** Rail card linking the calculators named in `tools:` front matter (titles from the registry). */
function toolsCard(ids, r) {
  const items = (ids || []).map(byTool).filter(Boolean);
  if (!items.length) return '';
  return `<div class="card tools-card"><h2>${esc(S.labels.toolsHeading)}</h2><ul>${items.map((t) => `<li><a href="${r}tools/${esc(t.id)}/">${esc(t.title)}</a>${t.summary ? `<small>${esc(t.summary)}</small>` : ''}</li>`).join('')}</ul></div>`;
}

function toc(headings, { sources = false } = {}) {
  const items = [...headings.map((h) => ({ depth: h.depth, id: h.id, text: h.text })), ...(sources ? [{ depth: 2, id: 'sources', text: S.labels.sourcesHeading }] : [])];
  return `<nav class="toc" aria-label="${esc(S.labels.onThisPage)}"><h2>${esc(S.labels.onThisPage)}</h2><ol>${items.map((h) => `<li class="depth-${h.depth}"><a href="#${h.id}">${esc(h.text)}</a></li>`).join('')}</ol></nav>`;
}

export function guidePage(g, c) {
  const r = rel(2);
  const body = `<div class="container article-layout">
    ${toc(g.headings, { sources: g.sources.length > 0 })}
    <article class="article" data-reading="${esc(g.slug)}">
      <header class="article-head">
        ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { href: 'guides/', label: S.guides.eyebrow }, { label: g.section }])}
        <p class="eyebrow">${esc(g.section)}</p>
        <h1>${esc(g.title)}</h1>
        <p class="lede">${g.summaryHtml}</p>
        <div class="meta">${levelTag(g.level)}<span>${esc(S.labels.reviewed)} <b>${timeTag(g.updated)}</b></span><span><b class="num">${g.minutes}</b> ${esc(S.labels.minRead)}</span><span><b class="num">${g.sources.length}</b> ${esc(S.labels.sources)}</span></div>
      </header>
      <div class="prose">${g.html}</div>
      <footer class="article-foot">
        ${sourcesList(g.sources)}
        ${disclaimer()}
      </footer>
    </article>
    <aside class="rail">
      ${toolsCard(g.tools, r)}
      ${relatedList(g.related, c, r)}
      ${factsBox(g.factRefs, c.byFact, r)}
    </aside>
  </div>`;
  return layout({ title: g.title, description: g.summary, path: `guides/${g.slug}/index.html`, depth: 2, body, current: 'guides/', article: { headline: g.title, datePublished: g.updated, dateModified: g.updated, section: g.section } });
}

/* ---------- Playbooks ---------- */

export function playbooksIndexPage(c) {
  const r = rel(1);
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.playbooks.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.playbooks.eyebrow)}</p><h1>${esc(fill(S.playbooks.title, { n: c.playbooks.length }))}</h1></div><p class="lede">${esc(S.playbooks.lede)}</p></div>
    ${c.playbooks.length ? `<div class="grid grid-fill-4">${c.playbooks.map((p) => articleCard(p, r, `${r}playbooks/${p.slug}/`)).join('')}</div>` : empty(S.playbooks.empty)}
  </div></section>`;
  return layout({ title: S.playbooks.eyebrow, description: S.playbooks.lede, path: 'playbooks/index.html', depth: 1, body, current: 'playbooks/' });
}

/** At-a-glance grid (design §6.8 M2): Instruments · Window · Stop · Target · Size, 1 / 2 (+span) / 3+2 columns. */
function glance(p) {
  const rows = [
    [S.playbooks.glance.instruments, p.instruments.join(', ')],
    [S.playbooks.glance.window, p.window],
    [S.playbooks.glance.stop, p.glance.stop],
    [S.playbooks.glance.target, p.glance.target],
    [S.playbooks.glance.size, p.glance.size],
  ];
  return `<dl class="glance" aria-label="${esc(S.playbooks.atAGlance)}">${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`;
}

export function playbookPage(p, c) {
  const r = rel(2);
  const evidenceHeading = p.headings.find((h) => h.depth === 2 && /evidence/i.test(h.text));
  const label = S.labels.evidenceLabels[p.evidence] || p.evidence;
  const body = `<div class="container article-layout">
    ${toc(p.headings, { sources: p.sources.length > 0 })}
    <article class="article playbook" data-reading="${esc(p.slug)}">
      <header class="article-head">
        ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { href: 'playbooks/', label: S.playbooks.eyebrow }, { label: p.title }])}
        <p class="eyebrow">${esc(S.labels.playbook)}</p>
        <h1>${esc(p.title)}</h1>
        <p class="lede">${p.summaryHtml}</p>
        <div class="meta">${levelTag(p.level)}${evidenceTag(p.evidence)}<span>${esc(S.labels.reviewed)} <b>${timeTag(p.updated)}</b></span><span><b class="num">${p.minutes}</b> ${esc(S.labels.minRead)}</span><span><b class="num">${p.sources.length}</b> ${esc(S.labels.sources)}</span></div>
      </header>
      <div class="prose">${glance(p)}${p.html}</div>
      <footer class="article-foot">
        ${sourcesList(p.sources)}
        ${disclaimer()}
      </footer>
    </article>
    <aside class="rail">
      <div class="card evidence-card"><h2>${esc(fill(S.playbooks.whyLabel, { label }))}</h2><p class="muted">${esc(S.labels.evidenceExplain[p.evidence] || '')}${evidenceHeading ? ` <a href="#${evidenceHeading.id}">${esc(S.labels.readEvidence)}</a>.` : ''}</p></div>
      ${toolsCard(p.tools, r)}
      ${relatedList(p.related, c, r)}
      ${factsBox(p.factRefs, c.byFact, r)}
    </aside>
  </div>`;
  return layout({ title: p.title, description: p.summary, path: `playbooks/${p.slug}/index.html`, depth: 2, body, current: 'playbooks/', article: { headline: p.title, datePublished: p.updated, dateModified: p.updated, section: S.playbooks.eyebrow } });
}

/* ---------- Tools (index shell; the tools step fills the registry and adds toolPage) ---------- */

export function toolsIndexPage(c) {
  const r = rel(1);
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.nav.find((n) => n.href === 'tools/')?.label || S.tools.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.tools.eyebrow)}</p><h1>${esc(S.tools.indexTitle)}</h1></div><p class="lede">${esc(S.tools.indexLede)}</p></div>
    ${TOOLS.length ? `<div class="grid grid-fill-4">${TOOLS.map((t) => `<a class="card card-link" href="${r}tools/${esc(t.id)}/"><h3>${esc(t.title)}</h3><p class="muted">${esc(t.summary || '')}</p></a>`).join('')}</div>` : empty(S.tools.empty)}
  </div></section>`;
  return layout({ title: S.tools.indexTitle, description: S.tools.indexLede, path: 'tools/index.html', depth: 1, body, current: 'tools/' });
}

/* ---------- Learn (library; rewritten by the Learn-page step) ---------- */

function libraryRow(e) {
  const price = e.cost === 'free' ? S.labels.free : e.price ? `${esc(S.labels.paid)} · ${esc(e.price.amount)} ${esc(e.price.currency || '')}${e.price.seen ? ` (${esc(e.price.seen)})` : ''}` : `${esc(S.labels.paid)} · varies`;
  return `<tr id="${esc(e.id)}" data-cost="${esc(e.cost)}" data-level="${esc(e.level)}" data-fits="${esc(e.fits.join('|'))}"><td><b>${esc(e.title)}</b><br><span class="muted small">${esc(e.by)} · ${esc(e.type)} · ${esc(e.year)}</span></td><td>${price}</td><td>${esc(S.labels.levels[e.level] || e.level)}</td><td>${e.fits.map((f) => `<span class="tag">${esc(f)}</span>`).join(' ')}</td><td class="num">${esc(e.hours ? `${e.hours} h` : e.pages ? `${e.pages} pp` : '')}</td><td>${esc(e.why)}${e.caveats ? `<br><span class="muted small">${esc(e.caveats)}</span>` : ''}</td><td>${e.links.map((l) => `<a href="${esc(l.url)}" rel="noopener noreferrer" target="_blank">${esc(l.label)}</a>`).join('<br>')}</td></tr>`;
}

function libraryTable(list, id) {
  if (!list.length) return empty(S.learn.empty);
  return `<div class="table-wrap"><table class="library-table" id="${id}"><thead><tr><th>Title</th><th>Cost</th><th>${esc(S.labels.level)}</th><th>${esc(S.learn.filters.fit)}</th><th>Hours / pages</th><th>Why it is here</th><th>Links</th></tr></thead><tbody>${list.map(libraryRow).join('')}</tbody></table></div>`;
}

export function learnPage(c) {
  const r = rel(1);
  const L = c.library;
  const path = L.path.stages?.length ? `<section id="path"><h2>${esc(S.learn.path)}</h2><p class="lede">${esc(S.learn.pathLede)}</p>${L.path.intro ? `<p>${renderInline(L.path.intro, { facts: c.byFact })}</p>` : ''}<div class="grid grid-fill-3">${L.path.stages.map((st) => `<div class="card path-card"><h3>${esc(st.title)}</h3>${st.hoursPerWeek ? `<p class="hours">${esc(st.hoursPerWeek)} h/week</p>` : ''}<ol>${(st.steps || []).map((s) => { const e = [...L.courses, ...L.books].find((x) => x.id === s.entry); return `<li><a href="#${esc(e.id)}">${esc(e.title)}</a>${s.note ? `<small>${renderInline(s.note, { facts: c.byFact })}</small>` : ''}</li>`; }).join('')}</ol></div>`).join('')}</div></section>` : '';
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.learn.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.learn.eyebrow)}</p><h1>${esc(S.learn.title)}</h1></div><p class="lede">${esc(S.learn.lede)}</p></div>
    <div class="cluster library-toolbar"><a class="btn btn-secondary btn-sm" href="${r}data/library.csv" download>${esc(S.learn.csv)}</a><span class="muted"><b class="num">${L.courses.length}</b> ${esc(S.learn.courses.toLowerCase())} · <b class="num">${L.books.length}</b> ${esc(S.learn.books.toLowerCase())}</span></div>
    ${path}
    <h2 id="courses" class="group-title">${esc(S.learn.courses)}</h2>
    ${libraryTable(L.courses, 'courses-table')}
    <h2 id="books" class="group-title">${esc(S.learn.books)}</h2>
    ${libraryTable(L.books, 'books-table')}
  </div></section>`;
  return layout({ title: S.learn.title, description: S.learn.lede, path: 'learn/index.html', depth: 1, body, current: 'learn/' });
}

export function libraryCsv(c) {
  const cols = ['id', 'kind', 'title', 'by', 'type', 'cost', 'price', 'currency', 'price_seen', 'links', 'year', 'level', 'fits', 'hours', 'pages', 'why', 'caveats'];
  const cell = (v) => { const s = v === undefined || v === null ? '' : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const rows = [...c.library.courses.map((e) => ({ ...e, kind: 'course' })), ...c.library.books.map((e) => ({ ...e, kind: 'book' }))].map((e) => [e.id, e.kind, e.title, e.by, e.type, e.cost, e.price?.amount, e.price?.currency, e.price?.seen, e.links.map((l) => l.url).join(' '), e.year, e.level, e.fits.join('; '), e.hours, e.pages, e.why, e.caveats].map(cell).join(','));
  return [cols.join(','), ...rows].join('\n') + '\n';
}

/* ---------- Glossary ---------- */

export const termId = (term) => term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function glossaryPage(c) {
  const r = rel(1);
  const sorted = [...c.glossary].sort((a, b) => a.term.localeCompare(b.term));
  const entry = (g) => `<div><dt id="${esc(termId(g.term))}">${esc(g.term)}</dt><dd>${renderInline(g.def, { facts: c.byFact })}${g.see?.length ? ` <span class="see">${esc(S.labels.see)} ${g.see.map((t) => `<a href="#${esc(termId(t))}">${esc(t)}</a>`).join(', ')}</span>` : ''}</dd></div>`;
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.glossary.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.glossary.eyebrow)}</p><h1>${esc(fill(S.glossary.title, { n: sorted.length }))}</h1></div><p class="lede">${esc(S.glossary.lede)}</p></div>
    ${sorted.length ? `<dl class="glossary">${sorted.map(entry).join('')}</dl>` : empty(S.glossary.empty)}
  </div></section>`;
  return layout({ title: S.glossary.eyebrow, description: S.glossary.lede, path: 'glossary/index.html', depth: 1, body, current: 'glossary/' });
}

/* ---------- Calendar (data + page rewritten by the calendar step; this keeps the route and the hooks) ---------- */

export function calendarPage(c) {
  const r = rel(1);
  const cal = c.calendar;
  const byMonth = new Map();
  for (const e of cal.events) { const k = String(e.date || '').slice(0, 7) || 'recurring'; if (!byMonth.has(k)) byMonth.set(k, []); byMonth.get(k).push(e); }
  const months = [...byMonth.keys()].sort();
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.calendar.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.calendar.eyebrow)}</p><h1>${esc(S.calendar.title)}</h1></div><p class="lede">${esc(cal.note || S.calendar.lede)}</p></div>
    ${cal.filters?.length ? `<div class="card"><p class="label">${esc(S.calendar.filtersTitle)}</p><div class="chip-row" data-cal-filters>${cal.filters.map((f) => `<button type="button" class="chip" data-value="${esc(f.id)}" aria-pressed="true">${esc(f.label)}</button>`).join('')}</div></div>` : ''}
    ${months.length ? `<div class="grid grid-fill-4 month-grid" data-cal-grid>${months.map((m) => `<div class="month" data-month="${esc(m)}"><h2 class="h3">${esc(m === 'recurring' ? S.calendar.recurring : formatDate(m + '-01').replace(/^\d+ /, ''))}</h2><ul>${byMonth.get(m).sort((a, b) => String(a.date).localeCompare(String(b.date))).map((e) => `<li data-kind="${esc(e.kind || '')}"><span class="d">${esc(e.date ? e.date.slice(8) : e.rule || '')}</span><span class="w">${renderInline(e.what, { facts: c.byFact })}</span><span class="m">${e.time_ist ? `<span class="time">${esc(e.time_ist)} IST</span>` : ''}${e.source ? `<a href="${esc(e.source)}" rel="noopener noreferrer" target="_blank">${esc(S.labels.source)}</a>` : ''}</span></li>`).join('')}</ul></div>`).join('')}</div>` : empty(S.calendar.empty)}
    <template id="calendar-data" data-json>${esc(JSON.stringify({ filters: cal.filters || [], events: cal.events }))}</template>
  </div></section>`;
  return layout({ title: S.calendar.title, description: S.calendar.lede, path: 'calendar/index.html', depth: 1, body, current: 'calendar/' });
}

/* ---------- What changed, resources ---------- */

export function changelogPage(c) {
  const r = rel(1);
  const items = [...c.changelog].sort((a, b) => b.date.localeCompare(a.date));
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.changelog.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.changelog.eyebrow)}</p><h1>${esc(S.changelog.title)}</h1></div><p class="lede">${esc(S.changelog.lede)}</p></div>
    ${items.length ? `<ol class="changelog list-reset">${items.map((e) => `<li class="card">${timeTag(e.date)}<div><p><b>${renderInline(e.what, { facts: c.byFact })}</b></p>${e.detail ? `<p class="muted">${renderInline(e.detail, { facts: c.byFact })}</p>` : ''}<p class="small"><a href="${esc(e.source)}" rel="noopener noreferrer" target="_blank">${esc(S.labels.source)}</a>${e.affects?.length ? ` · ${e.affects.map((s) => c.byGuide[s] ? `<a href="${r}guides/${s}/">${esc(c.byGuide[s].title)}</a>` : c.byPlaybook[s] ? `<a href="${r}playbooks/${s}/">${esc(c.byPlaybook[s].title)}</a>` : esc(s)).join(', ')}` : ''}</p></div></li>`).join('')}</ol>` : empty(S.changelog.empty)}
  </div></section>`;
  return layout({ title: S.changelog.title, description: S.changelog.lede, path: 'changelog/index.html', depth: 1, body, current: 'changelog/' });
}

export function resourcesPage(c) {
  const r = rel(1);
  const cats = [...new Set(c.resources.map((x) => x.category))];
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.resources.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.resources.eyebrow)}</p><h1>${esc(S.resources.title)}</h1></div><p class="lede">${esc(S.resources.lede)}</p></div>
    ${cats.length ? cats.map((cat) => `<h2 class="group-title">${esc(cat)}</h2><div class="directory">${c.resources.filter((x) => x.category === cat).map((x) => `<div class="card"><h3><a href="${esc(x.url)}" rel="noopener noreferrer" target="_blank">${esc(x.name)}</a></h3><p>${renderInline(x.what || '', { facts: c.byFact })}</p><span class="small muted">${esc(new URL(x.url).hostname)}</span></div>`).join('')}</div>`).join('') : empty(S.resources.empty)}
  </div></section>`;
  return layout({ title: S.resources.title, description: S.resources.lede, path: 'resources/index.html', depth: 1, body, current: '' });
}

/* ---------- About (content/pages/about.md) and sources ---------- */

export function aboutPage(c) {
  const r = rel(1);
  const pg = c.pages?.about;
  const title = pg?.title || fill(S.about.title, { name: SITE.name });
  const description = pg?.summary || fill(S.about.lede, { name: SITE.name });
  const body = pg
    ? `<div class="container article-layout">
    ${toc(pg.headings, { sources: pg.sources.length > 0 })}
    <article class="article" data-reading="page-${esc(pg.slug)}">
      <header class="article-head">
        ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.about.eyebrow }])}
        <p class="eyebrow">${esc(S.about.eyebrow)}</p>
        <h1>${esc(pg.title)}</h1>
        <p class="lede">${pg.summaryHtml}</p>
        <div class="meta"><span>${esc(S.labels.reviewed)} <b>${timeTag(pg.updated)}</b></span>${pg.sources.length ? `<span><b class="num">${pg.sources.length}</b> ${esc(S.labels.sources)}</span>` : ''}</div>
      </header>
      <div class="prose">${pg.html}</div>
      <footer class="article-foot">
        ${sourcesList(pg.sources)}
        ${disclaimer()}
      </footer>
    </article>
    <aside class="rail">
      ${factsBox(pg.factRefs, c.byFact, r)}
    </aside>
  </div>`
    : `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.about.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.about.eyebrow)}</p><h1>${esc(title)}</h1></div><p class="lede">${esc(description)}</p></div>
    ${disclaimer()}
  </div></section>`;
  return layout({ title: S.about.eyebrow, description, path: 'about/index.html', depth: 1, body, current: '' });
}

export function sourcesPage(c) {
  const r = rel(1);
  const all = allSources(c);
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.sources.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.sources.eyebrow)}</p><h1>${esc(S.sources.title)}</h1></div><p class="lede">${esc(S.sources.lede)}</p></div>
    <div class="article-layout"><div></div><div class="prose">
      <h2 id="bibliography">${esc(fill(S.sources.bibliography, { n: all.size }))}</h2>
      ${all.size ? `<ol class="sources-list">${[...all.entries()].map(([url, title]) => `<li><a href="${esc(url)}" rel="noopener noreferrer" target="_blank">${esc(title)}</a></li>`).join('')}</ol>` : empty(S.guides.empty)}
      <h2 id="corrections">${esc(S.sources.corrections)}</h2>
      <p>${esc(S.sources.correctionsText)} <a href="${SITE.repo}" rel="noopener noreferrer" target="_blank">${esc(S.footer.source)}</a>.</p>
    </div><div></div></div>
  </div></section>`;
  return layout({ title: S.sources.eyebrow, description: S.sources.lede, path: 'sources/index.html', depth: 1, body, current: '' });
}

/* ---------- Facts register (route facts/, design §6.6) ---------- */

/** id → [{ title, href }] of every page that renders the fact (articles, pages, home hero, glossary, calendar, tools). */
export function factUsage(c, r = './') {
  const map = new Map();
  const add = (id, title, href) => { if (!map.has(id)) map.set(id, []); const list = map.get(id); if (!list.some((x) => x.href === href)) list.push({ title, href }); };
  for (const g of c.guides) for (const id of g.factRefs) add(id, g.title, `${r}guides/${g.slug}/`);
  for (const p of c.playbooks) for (const id of p.factRefs) add(id, p.title, `${r}playbooks/${p.slug}/`);
  for (const pg of Object.values(c.pages || {})) for (const id of pg.factRefs) add(id, pg.title, `${r}${pg.slug}/`);
  if (HERO_FACT_IDS.every((id) => c.byFact[id])) for (const id of HERO_FACT_IDS) add(id, S.labels.home, r);
  const refs = { glossary: [], calendar: [], changelog: [] };
  for (const g of c.glossary) renderInline(g.def, { facts: c.byFact, factRefs: refs.glossary });
  for (const e of c.calendar.events || []) renderInline(e.what, { facts: c.byFact, factRefs: refs.calendar });
  for (const e of c.changelog) { renderInline(e.what, { facts: c.byFact, factRefs: refs.changelog }); renderInline(e.detail || '', { facts: c.byFact, factRefs: refs.changelog }); }
  for (const id of refs.glossary) add(id, S.glossary.eyebrow, `${r}glossary/`);
  for (const id of refs.calendar) add(id, S.calendar.eyebrow, `${r}calendar/`);
  for (const id of refs.changelog) add(id, S.changelog.eyebrow, `${r}changelog/`);
  for (const t of TOOLS) for (const id of t.factIds || []) add(id, t.title, `${r}tools/${t.id}/`);
  return map;
}

export function factsPage(c, { today = todayIST() } = {}) {
  const r = rel(1);
  const usage = factUsage(c, r);
  const groupCount = (key) => c.facts.filter((f) => factGroup(f.id) === key).length;
  const chip = (key, label, n, pressed) => `<button class="chip" type="button" data-group="${esc(key)}" aria-pressed="${pressed}">${esc(label)} <span class="count">${n}</span></button>`;
  const row = (f) => {
    const src = factSource(f);
    const used = usage.get(f.id) || [];
    const future = isFuture(f.since, today);
    return `<tr id="fact-${esc(f.id)}" data-group="${esc(factGroup(f.id) || '')}" data-text="${esc(`${f.label} ${f.id} ${f.value}`.toLowerCase())}"><td><b>${esc(f.label)}</b><br><code>${esc(f.id)}</code></td><td class="val">${esc(f.value)}</td><td><a href="${esc(src.url)}" rel="noopener noreferrer" target="_blank">${esc(src.title)}</a></td><td class="num">${future ? `<span class="muted">${esc(S.labels.from)}</span> ` : ''}${timeTag(f.since)}</td><td class="num">${timeTag(f.verified)}</td><td>${used.length ? used.map((u) => `<a href="${u.href}">${esc(u.title)}</a>`).join(', ') : `<span class="muted">${esc(S.facts.none)}</span>`}</td></tr>`;
  };
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.facts.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.facts.eyebrow)}</p><h1>${esc(S.facts.title)}</h1></div><p class="lede">${esc(S.facts.lede)}</p></div>
    ${c.facts.length ? `<div class="toolbar" role="region" aria-label="${esc(S.facts.filtersAria)}" data-facts-filter>
      <div class="toolbar-row">
        <span class="label">${esc(S.facts.group)}</span>
        <div class="chip-row">${chip('all', S.facts.all, c.facts.length, 'true')}${FACT_GROUPS.map((g) => chip(g.key, S.facts.groups[g.key], groupCount(g.key), 'false')).join('')}</div>
        <span class="spacer"></span>
        <label class="search-field">${ICONS.search}<input class="input" type="search" id="facts-filter" placeholder="${esc(S.facts.filter)}" aria-label="${esc(S.facts.filterAria)}" autocomplete="off"></label>
        <a class="btn btn-secondary btn-sm" href="${r}data/facts.json" download>${ICONS.download}${esc(S.facts.download)}</a>
      </div>
      <p class="lib-count" data-facts-count>${esc(fill(S.client.showing, { x: c.facts.length, y: c.facts.length }))}</p>
    </div>
    <div class="table-wrap"><table class="facts-table"><thead><tr><th>${esc(S.facts.columns.fact)}</th><th>${esc(S.facts.columns.value)}</th><th>${esc(S.facts.columns.source)}</th><th class="num">${esc(S.facts.columns.since)}</th><th class="num">${esc(S.facts.columns.verified)}</th><th>${esc(S.facts.columns.usedOn)}</th></tr></thead><tbody>${c.facts.map(row).join('')}</tbody></table></div>
    <p class="small muted" style="margin-top:var(--space-5)">${esc(S.facts.future)} ${esc(S.facts.corrections)}</p>` : empty(S.facts.empty)}
  </div></section>`;
  return layout({ title: S.facts.eyebrow, description: S.facts.lede, path: 'facts/index.html', depth: 1, body, current: '' });
}

export function notFoundPage() {
  const r = rel(0);
  const body = `<section class="section"><div class="container not-found"><p class="eyebrow">${esc(S.notFound.eyebrow)}</p><h1>${esc(S.notFound.title)}</h1><p class="lede">${esc(S.notFound.lede)}</p><div class="cluster"><a class="btn btn-primary" href="${r}">${esc(S.notFound.home)}</a><a class="btn btn-secondary" href="${r}guides/">${esc(S.notFound.guides)}</a></div></div></section>`;
  return layout({ title: S.notFound.title, description: fill(S.notFound.description, { name: SITE.name }), path: '404.html', depth: 0, body, current: '' });
}
