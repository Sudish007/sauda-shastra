// Page renderers. Each returns a full document via layout(). All URLs relative; no UI string literals here.
import { escapeHtml as esc } from './markdown.js';
import { SECTIONS } from './content.js';
import { SITE } from './config.js';
import { STRINGS as S, fill } from './strings.js';
import { layout, rel, formatDate, breadcrumbs, sourcesList, factsBox, disclaimer, levelTag, evidenceTag } from './templates.js';

// Client-side tools are Phase-1 features; each entry here becomes a card and a search-index row once it exists.
export const TOOLS = [];

/** Distinct source URLs cited anywhere (guides, playbooks, facts, changelog). */
export function allSources(c) {
  const map = new Map();
  for (const a of [...c.guides, ...c.playbooks]) for (const s of a.sources) if (!map.has(s.url)) map.set(s.url, s.title);
  for (const f of c.facts) { const [t, u] = String(f.source).split('|').map((x) => x.trim()); const url = u || t; if (!map.has(url)) map.set(url, u ? t : f.label); }
  for (const e of c.changelog) if (!map.has(e.source)) map.set(e.source, e.what);
  return map;
}

export function counts(c) {
  return { guides: c.guides.length, playbooks: c.playbooks.length, tools: TOOLS.length, terms: c.glossary.length, sources: allSources(c).size, courses: c.library.courses.length, books: c.library.books.length, facts: c.facts.length };
}

function articleCard(a, r, href) {
  return `<a class="card card-link" href="${href}"><div class="card-tags">${levelTag(a.level)}${a.evidence ? evidenceTag(a.evidence) : ''}</div><h3>${esc(a.title)}</h3><p class="muted">${esc(a.summary)}</p><div class="meta"><span><b class="num">${a.minutes}</b> ${esc(S.labels.minRead)}</span><span>${esc(S.labels.reviewed)} ${formatDate(a.updated)}</span><span><b class="num">${a.sources.length}</b> ${esc(S.labels.sources)}</span></div></a>`;
}

const empty = (text) => `<p class="empty">${esc(text)}</p>`;

export function homePage(c) {
  const r = rel(0);
  const n = counts(c);
  const bySection = SECTIONS.map((s) => ({ section: s, guides: c.guides.filter((g) => g.section === s) }));
  const body = `
<section class="hero">
  <div class="container hero-grid">
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
    <dl class="hero-facts" data-counts>
      <div><dt>${esc(S.home.counts.guides)}</dt><dd class="num" data-count="guides">${n.guides}</dd></div>
      <div><dt>${esc(S.home.counts.playbooks)}</dt><dd class="num" data-count="playbooks">${n.playbooks}</dd></div>
      <div><dt>${esc(S.home.counts.tools)}</dt><dd class="num" data-count="tools">${n.tools}</dd></div>
      <div><dt>${esc(S.home.counts.terms)}</dt><dd class="num" data-count="terms">${n.terms}</dd></div>
      <div><dt>${esc(S.home.counts.sources)}</dt><dd class="num" data-count="sources">${n.sources}</dd></div>
    </dl>
  </div>
</section>

<section class="section" id="sections">
  <div class="container">
    <div class="section-head"><div><p class="eyebrow">${esc(S.home.sectionsEyebrow)}</p><h2>${esc(S.home.sectionsTitle)}</h2></div><a class="btn btn-secondary btn-sm" href="${r}guides/">${esc(S.footer.links.start[0].label)}</a></div>
    <div class="grid grid-sections">${bySection.map((x) => `<div class="card section-card"><h3><a href="${r}guides/#${esc(x.section.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}">${esc(x.section)}</a></h3>${x.guides.length ? `<ul class="list-reset stack-sm">${x.guides.slice(0, 6).map((g) => `<li><a href="${r}guides/${g.slug}/">${esc(g.title)}</a></li>`).join('')}</ul>` : `<p class="muted small">${esc(S.guides.empty)}</p>`}</div>`).join('')}</div>
  </div>
</section>

<section class="section" id="playbooks">
  <div class="container">
    <div class="section-head"><div><p class="eyebrow">${esc(S.home.playbooksEyebrow)}</p><h2>${esc(S.home.playbooksTitle)}</h2></div><p>${esc(S.home.playbooksLede)}</p></div>
    ${c.playbooks.length ? `<div class="grid grid-cards">${c.playbooks.slice(0, 8).map((p) => articleCard(p, r, `${r}playbooks/${p.slug}/`)).join('')}</div>` : empty(S.playbooks.empty)}
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
    <div class="grid grid-2">
      <div class="card"><p>${esc(S.home.honestyA)}</p></div>
      <div class="card"><p>${esc(S.home.honestyB)}</p></div>
    </div>
  </div>
</section>`;
  return layout({ title: '', description: SITE.description, path: 'index.html', depth: 0, body, current: '' });
}

export function guidesIndexPage(c) {
  const r = rel(1);
  const bySection = SECTIONS.map((s) => ({ section: s, guides: c.guides.filter((g) => g.section === s) })).filter((x) => x.guides.length);
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.guides.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.guides.eyebrow)}</p><h1>${esc(fill(S.guides.title, { n: c.guides.length }))}</h1></div><p class="lede">${esc(S.guides.lede)}</p></div>
    ${bySection.length ? bySection.map((x) => `<h2 class="group-title" id="${esc(x.section.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}">${esc(x.section)}</h2><div class="grid grid-cards">${x.guides.map((g) => articleCard(g, r, `${r}guides/${g.slug}/`)).join('')}</div>`).join('') : empty(S.guides.empty)}
  </div></section>`;
  return layout({ title: S.guides.eyebrow, description: S.guides.lede, path: 'guides/index.html', depth: 1, body, current: 'guides/' });
}

function relatedList(slugs, c, r) {
  const items = slugs.map((s) => c.byGuide[s] ? { href: `${r}guides/${s}/`, a: c.byGuide[s], kind: S.labels.guide } : c.byPlaybook[s] ? { href: `${r}playbooks/${s}/`, a: c.byPlaybook[s], kind: S.labels.playbook } : null).filter(Boolean);
  if (!items.length) return '';
  return `<div class="card"><h2>${esc(S.labels.related)}</h2><ul>${items.map((x) => `<li><a href="${x.href}">${esc(x.a.title)}</a><small>${esc(x.kind)} · ${x.a.minutes} ${esc(S.labels.minRead)}</small></li>`).join('')}</ul></div>`;
}

function toc(headings) {
  return `<nav class="toc" aria-label="${esc(S.labels.onThisPage)}"><h2>${esc(S.labels.onThisPage)}</h2><ol>${headings.map((h) => `<li class="depth-${h.depth}"><a href="#${h.id}">${esc(h.text)}</a></li>`).join('')}</ol></nav>`;
}

export function guidePage(g, c) {
  const r = rel(2);
  const body = `<div class="container article-layout">
    ${toc(g.headings)}
    <article class="article" data-reading="${esc(g.slug)}">
      <header class="article-head">
        ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { href: 'guides/', label: S.guides.eyebrow }, { label: g.section }])}
        <p class="eyebrow">${esc(g.section)}</p>
        <h1>${esc(g.title)}</h1>
        <p class="lede">${esc(g.summary)}</p>
        <div class="meta">${levelTag(g.level)}<span>${esc(S.labels.reviewed)} <b>${formatDate(g.updated)}</b></span><span><b class="num">${g.minutes}</b> ${esc(S.labels.minRead)}</span><span><b class="num">${g.sources.length}</b> ${esc(S.labels.sources)}</span></div>
      </header>
      <div class="prose">${g.html}</div>
      <footer class="article-foot">
        ${sourcesList(g.sources)}
        ${disclaimer()}
      </footer>
    </article>
    <aside class="rail">
      ${factsBox(g.factRefs, c.byFact)}
      ${relatedList(g.related, c, r)}
    </aside>
  </div>`;
  return layout({ title: g.title, description: g.summary, path: `guides/${g.slug}/index.html`, depth: 2, body, current: 'guides/', article: { headline: g.title, datePublished: g.updated, dateModified: g.updated, section: g.section } });
}

export function playbooksIndexPage(c) {
  const r = rel(1);
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.playbooks.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.playbooks.eyebrow)}</p><h1>${esc(fill(S.playbooks.title, { n: c.playbooks.length }))}</h1></div><p class="lede">${esc(S.playbooks.lede)}</p></div>
    ${c.playbooks.length ? `<div class="grid grid-cards">${c.playbooks.map((p) => articleCard(p, r, `${r}playbooks/${p.slug}/`)).join('')}</div>` : empty(S.playbooks.empty)}
  </div></section>`;
  return layout({ title: S.playbooks.eyebrow, description: S.playbooks.lede, path: 'playbooks/index.html', depth: 1, body, current: 'playbooks/' });
}

export function playbookPage(p, c) {
  const r = rel(2);
  const body = `<div class="container article-layout">
    ${toc(p.headings)}
    <article class="article playbook" data-reading="${esc(p.slug)}">
      <header class="article-head">
        ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { href: 'playbooks/', label: S.playbooks.eyebrow }, { label: p.title }])}
        <p class="eyebrow">${esc(S.labels.playbook)}</p>
        <h1>${esc(p.title)}</h1>
        <p class="lede">${esc(p.summary)}</p>
        <div class="meta">${levelTag(p.level)}${evidenceTag(p.evidence)}<span>${esc(S.labels.instruments)}: <b>${esc(p.instruments.join(', '))}</b></span><span>${esc(S.labels.window)}: <b>${esc(p.window)}</b></span><span>${esc(S.labels.reviewed)} <b>${formatDate(p.updated)}</b></span><span><b class="num">${p.minutes}</b> ${esc(S.labels.minRead)}</span></div>
      </header>
      <div class="prose">${p.html}</div>
      <footer class="article-foot">
        ${sourcesList(p.sources)}
        ${disclaimer()}
      </footer>
    </article>
    <aside class="rail">
      <div class="card evidence-card"><h2>${esc(S.labels.evidence)}</h2><p>${evidenceTag(p.evidence)} <span class="muted">${esc(S.labels.evidenceExplain[p.evidence] || '')}</span></p></div>
      ${factsBox(p.factRefs, c.byFact)}
      ${relatedList(p.related, c, r)}
    </aside>
  </div>`;
  return layout({ title: p.title, description: p.summary, path: `playbooks/${p.slug}/index.html`, depth: 2, body, current: 'playbooks/', article: { headline: p.title, datePublished: p.updated, dateModified: p.updated, section: S.playbooks.eyebrow } });
}

function libraryRow(e) {
  const price = e.cost === 'free' ? S.labels.free : e.price ? `${esc(S.labels.paid)} · ${esc(e.price.amount)} ${esc(e.price.currency || '')}${e.price.seen ? ` (${esc(e.price.seen)})` : ''}` : `${esc(S.labels.paid)} · varies`;
  return `<tr data-cost="${esc(e.cost)}" data-level="${esc(e.level)}" data-fits="${esc(e.fits.join('|'))}"><td><b>${esc(e.title)}</b><br><span class="muted small">${esc(e.by)} · ${esc(e.type)} · ${esc(e.year)}</span></td><td>${price}</td><td>${esc(S.labels.levels[e.level] || e.level)}</td><td>${e.fits.map((f) => `<span class="tag">${esc(f)}</span>`).join(' ')}</td><td class="num">${esc(e.hours ? `${e.hours} h` : e.pages ? `${e.pages} pp` : '')}</td><td>${esc(e.why)}${e.caveats ? `<br><span class="muted small">${esc(e.caveats)}</span>` : ''}</td><td>${e.links.map((l) => `<a href="${esc(l.url)}" rel="noopener noreferrer" target="_blank">${esc(l.label)}</a>`).join('<br>')}</td></tr>`;
}

function libraryTable(list, id) {
  if (!list.length) return empty(S.learn.empty);
  return `<div class="table-wrap"><table class="library-table" id="${id}"><thead><tr><th>Title</th><th>Cost</th><th>${esc(S.labels.level)}</th><th>${esc(S.learn.filters.fit)}</th><th>Hours / pages</th><th>Why it is here</th><th>Links</th></tr></thead><tbody>${list.map(libraryRow).join('')}</tbody></table></div>`;
}

export function learnPage(c) {
  const r = rel(1);
  const L = c.library;
  const path = L.path.stages?.length ? `<section id="path"><h2>${esc(S.learn.path)}</h2><p class="lede">${esc(S.learn.pathLede)}</p>${L.path.intro ? `<p>${esc(L.path.intro)}</p>` : ''}${L.path.stages.map((st) => `<div class="card"><h3>${esc(st.title)}</h3>${st.hoursPerWeek ? `<p class="muted small">${esc(st.hoursPerWeek)} h/week</p>` : ''}<ol>${(st.steps || []).map((s) => { const e = [...L.courses, ...L.books].find((x) => x.id === s.entry); return `<li><a href="${e.links[0].url}" rel="noopener noreferrer" target="_blank">${esc(e.title)}</a>${s.note ? ` — ${esc(s.note)}` : ''}</li>`; }).join('')}</ol></div>`).join('')}</section>` : '';
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

export const termId = (term) => term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function glossaryPage(c) {
  const r = rel(1);
  const sorted = [...c.glossary].sort((a, b) => a.term.localeCompare(b.term));
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.glossary.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.glossary.eyebrow)}</p><h1>${esc(fill(S.glossary.title, { n: sorted.length }))}</h1></div><p class="lede">${esc(S.glossary.lede)}</p></div>
    ${sorted.length ? `<dl class="glossary">${sorted.map((g) => `<dt id="${esc(termId(g.term))}">${esc(g.term)}</dt><dd>${esc(g.def)}${g.see?.length ? ` <span class="muted small">See: ${g.see.map((t) => `<a href="#${esc(termId(t))}">${esc(t)}</a>`).join(', ')}</span>` : ''}</dd>`).join('')}</dl>` : empty(S.glossary.empty)}
  </div></section>`;
  return layout({ title: S.glossary.eyebrow, description: S.glossary.lede, path: 'glossary/index.html', depth: 1, body, current: 'glossary/' });
}

export function calendarPage(c) {
  const r = rel(1);
  const cal = c.calendar;
  const byMonth = new Map();
  for (const e of cal.events) { const k = String(e.date || '').slice(0, 7) || 'recurring'; if (!byMonth.has(k)) byMonth.set(k, []); byMonth.get(k).push(e); }
  const months = [...byMonth.keys()].sort();
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.calendar.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.calendar.eyebrow)}</p><h1>${esc(S.calendar.title)}</h1></div><p class="lede">${esc(cal.note || S.calendar.lede)}</p></div>
    ${cal.filters?.length ? `<div class="card"><p class="label">${esc(S.calendar.filtersTitle)}</p><div class="chip-row" data-cal-filters>${cal.filters.map((f) => `<button type="button" class="chip" data-value="${esc(f.id)}" aria-pressed="false">${esc(f.label)}</button>`).join('')}</div></div>` : ''}
    ${months.length ? `<div class="month-grid" data-cal-grid>${months.map((m) => `<div class="month" data-month="${esc(m)}"><h2 class="h3">${esc(m === 'recurring' ? 'Recurring' : formatDate(m + '-01').replace(/^\d+ /, ''))}</h2><ul>${byMonth.get(m).sort((a, b) => String(a.date).localeCompare(String(b.date))).map((e) => `<li data-kind="${esc(e.kind || '')}"><b class="num">${esc(e.date ? e.date.slice(8) : e.rule || '')}</b> ${esc(e.what)}${e.time_ist ? ` <span class="muted">${esc(e.time_ist)} IST</span>` : ''}${e.source ? ` <a class="small" href="${esc(e.source)}" rel="noopener noreferrer" target="_blank">source</a>` : ''}</li>`).join('')}</ul></div>`).join('')}</div>` : empty(S.calendar.empty)}
    <template id="calendar-data" data-json>${esc(JSON.stringify({ filters: cal.filters || [], events: cal.events }))}</template>
  </div></section>`;
  return layout({ title: S.calendar.title, description: S.calendar.lede, path: 'calendar/index.html', depth: 1, body, current: 'calendar/' });
}

export function changelogPage(c) {
  const r = rel(1);
  const items = [...c.changelog].sort((a, b) => b.date.localeCompare(a.date));
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.changelog.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.changelog.eyebrow)}</p><h1>${esc(S.changelog.title)}</h1></div><p class="lede">${esc(S.changelog.lede)}</p></div>
    ${items.length ? `<ol class="changelog list-reset">${items.map((e) => `<li class="card"><time datetime="${esc(e.date)}">${formatDate(e.date)}</time><div><p><b>${esc(e.what)}</b></p>${e.detail ? `<p class="muted">${esc(e.detail)}</p>` : ''}<p class="small"><a href="${esc(e.source)}" rel="noopener noreferrer" target="_blank">Source</a>${e.affects?.length ? ` · ${e.affects.map((s) => c.byGuide[s] ? `<a href="${r}guides/${s}/">${esc(c.byGuide[s].title)}</a>` : c.byPlaybook[s] ? `<a href="${r}playbooks/${s}/">${esc(c.byPlaybook[s].title)}</a>` : esc(s)).join(', ')}` : ''}</p></div></li>`).join('')}</ol>` : empty(S.changelog.empty)}
  </div></section>`;
  return layout({ title: S.changelog.title, description: S.changelog.lede, path: 'changelog/index.html', depth: 1, body, current: 'changelog/' });
}

export function resourcesPage(c) {
  const r = rel(1);
  const cats = [...new Set(c.resources.map((x) => x.category))];
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.resources.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.resources.eyebrow)}</p><h1>${esc(S.resources.title)}</h1></div><p class="lede">${esc(S.resources.lede)}</p></div>
    ${cats.length ? cats.map((cat) => `<h2 class="group-title">${esc(cat)}</h2><div class="directory">${c.resources.filter((x) => x.category === cat).map((x) => `<div class="card"><h3><a href="${esc(x.url)}" rel="noopener noreferrer" target="_blank">${esc(x.name)}</a></h3><p>${esc(x.what || '')}</p><span class="small muted">${esc(new URL(x.url).hostname)}</span></div>`).join('')}</div>`).join('') : empty(S.resources.empty)}
  </div></section>`;
  return layout({ title: S.resources.title, description: S.resources.lede, path: 'resources/index.html', depth: 1, body, current: '' });
}

export function aboutPage(c) {
  const r = rel(1);
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.about.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.about.eyebrow)}</p><h1>${esc(fill(S.about.title, { name: SITE.name }))}</h1></div><p class="lede">${esc(fill(S.about.lede, { name: SITE.name }))}</p></div>
    <div class="article-layout"><div></div><div class="prose">
      <h2 id="what">What this site is</h2>
      <p>${esc(SITE.name)} (${esc(SITE.hindi)}, “${esc(SITE.meaning)}”) is a free, independent knowledge site. It explains how Indian and global markets work for intraday traders, options traders and long-term investors, and it keeps a researched library of courses and books. Content was last reviewed on ${formatDate(c.reviewed)}.</p>
      <h2 id="disclaimer">Disclaimer</h2>
      <p>${esc(S.footer.disclaimer)}</p>
      <p>Nothing on this site is a recommendation to buy or sell any security, derivative or fund, and no page names a live instrument, target or stop. Figures are illustrative worked examples with their sources and the date each was verified.</p>
      <h2 id="licence">Licence</h2>
      <p>Text is licensed <a href="https://creativecommons.org/licenses/by/4.0/" rel="noopener noreferrer" target="_blank">CC BY 4.0</a>; the code that builds the site is MIT. Both licences are in the <a href="${SITE.repo}" rel="noopener noreferrer" target="_blank">repository</a>.</p>
    </div><div></div></div>
  </div></section>`;
  return layout({ title: S.about.eyebrow, description: fill(S.about.lede, { name: SITE.name }), path: 'about/index.html', depth: 1, body, current: '' });
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

export function notFoundPage() {
  const r = rel(0);
  const body = `<section class="section"><div class="container not-found"><p class="eyebrow">${esc(S.notFound.eyebrow)}</p><h1>${esc(S.notFound.title)}</h1><p class="lede">${esc(S.notFound.lede)}</p><div class="cluster"><a class="btn btn-primary" href="${r}">${esc(S.notFound.home)}</a><a class="btn btn-secondary" href="${r}guides/">${esc(S.notFound.guides)}</a></div></div></section>`;
  return layout({ title: S.notFound.title, description: fill(S.notFound.description, { name: SITE.name }), path: '404.html', depth: 0, body, current: '' });
}
