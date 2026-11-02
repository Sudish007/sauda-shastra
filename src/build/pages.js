// Page renderers. Each returns a full document via layout(). All URLs relative; no UI string literals here.
// Markup follows the approved design mocks (design.md §6); class names come from site/styles.css.
import { escapeHtml as esc, renderInline, plainInline, factSource, factCitation, evidenceTagHtml } from './markdown.js';
import { SECTIONS, PHASE2_SECTIONS, HERO_FACT_IDS, FACT_GROUPS, LIBRARY_FITS, LIBRARY_TYPES, factGroup, calendarTexts } from './content.js';
import { TOOLS, byTool, fieldShown } from './tools.js';
import { SITE } from './config.js';
import { STRINGS as S, fill } from './strings.js';
import { formatDate, isFuture, todayIST } from './dates.js';
import { layout, rel, timeTag, breadcrumbs, sourcesList, factsBox, disclaimer, levelTag, evidenceTag, ICONS } from './templates.js';
import { rateMap, num as rateNum, parts as rateParts } from '../tools/rates.js';
import { run } from '../tools/calc.js';
import { makeCtx, resultHead, resultBody, announce } from '../tools/view.js';

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
  // Minutes are a rendered figure (`.num`, like the article meta and cards), not prose: a bare "8" beside a title with
  // "loss" in it would otherwise read as a typed register value (tax-nonspec-loss-carry-forward) to the never-typed scan.
  return `<div class="card related-card"><h2>${esc(S.labels.related)}</h2><ul>${items.map((x) => `<li><a href="${x.href}">${esc(x.a.title)}</a><small>${esc(x.kind)} · <span class="num">${x.a.minutes}</span> ${esc(S.labels.minRead)}</small></li>`).join('')}</ul></div>`;
}

/** Rail card linking the calculators named in `tools:` front matter (titles from the registry). */
function toolsCard(ids, r) {
  const items = (ids || []).map(byTool).filter(Boolean);
  if (!items.length) return '';
  return `<div class="card tools-card"><h2>${esc(S.labels.toolsHeading)}</h2><ul>${items.map((t) => `<li><a href="${r}tools/${esc(t.id)}/">${esc(t.title)}</a>${t.summary ? `<small>${esc(t.summary)}</small>` : ''}</li>`).join('')}</ul></div>`;
}

/** The article rail. A page with nothing to show there gets a stretched placeholder (as sources/ does) so the third column of the article layout is never an empty cell (M2). */
function rail(...cards) {
  const html = cards.filter(Boolean).join('\n      ');
  return html ? `<aside class="rail">\n      ${html}\n    </aside>` : '<div></div>';
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
    ${rail(toolsCard(g.tools, r), relatedList(g.related, c, r), factsBox(g.factRefs, c.byFact, r))}
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
    ${rail(`<div class="card evidence-card"><h2>${esc(fill(S.playbooks.whyLabel, { label }))}</h2><p class="muted">${esc(S.labels.evidenceExplain[p.evidence] || '')}${evidenceHeading ? ` <a href="#${evidenceHeading.id}">${esc(S.labels.readEvidence)}</a>.` : ''}</p></div>`, toolsCard(p.tools, r), relatedList(p.related, c, r), factsBox(p.factRefs, c.byFact, r))}
  </div>`;
  return layout({ title: p.title, description: p.summary, path: `playbooks/${p.slug}/index.html`, depth: 2, body, current: 'playbooks/', article: { headline: p.title, datePublished: p.updated, dateModified: p.updated, section: S.playbooks.eyebrow } });
}

/* ---------- Tools (design §6.9; registry in tools.js, maths in src/tools/calc.js, markup shared with tool-ui.js via view.js) ---------- */

const TOOLS_LABEL = () => S.nav.find((n) => n.href === 'tools/')?.label || S.tools.eyebrow;

export function toolsIndexPage(c) {
  const r = rel(1);
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: TOOLS_LABEL() }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.tools.eyebrow)}</p><h1>${esc(S.tools.indexTitle)}</h1></div><p class="lede">${esc(S.tools.indexLede)}</p></div>
    ${TOOLS.length ? `<div class="grid grid-fill-4">${TOOLS.map((t) => `<a class="card card-link" href="${r}tools/${esc(t.id)}/"><div class="card-tags"><span class="tag">${esc(S.tools.eyebrow)}</span></div><h3>${esc(t.title)}</h3><p class="muted">${esc(t.summary || '')}</p></a>`).join('')}</div>` : empty(S.tools.empty)}
  </div></section>`;
  return layout({ title: S.tools.indexTitle, description: S.tools.indexLede, path: 'tools/index.html', depth: 1, body, current: 'tools/' });
}

/** The shared tool strings (every scalar under S.tools; the per-tool objects are passed separately). */
const toolCommonStrings = () => Object.fromEntries(Object.entries(S.tools).filter(([, v]) => typeof v === 'string'));

/**
 * The {placeholder} values every fact-dependent tool string may use (design §10): register ids render as plain .fact spans,
 * the rest carry their HTML and plain-text forms. Built once per page from the whole register so copy never types a figure.
 */
export function toolVars(c, r) {
  const f = (id) => c.byFact[id];
  const vars = {
    lot: { fact: 'fo-nifty-lot' }, sensexLot: { fact: 'fo-sensex-lot' }, freeze: { fact: 'fo-freeze-qty-nifty' }, elm: { fact: 'fo-expiry-day-elm-addon' },
    foTick: { fact: 'opt-tick-size-options' }, dp: { fact: 'chg-dp-example-broker' }, repo: { fact: 'mac-repo-rate' },
    std: { fact: 'tax-std-deduction-new-regime' }, rebate: { fact: 'tax-rebate-156' }, rebateLimit: { fact: 'tax-rebate-156-income-limit' }, cess: { fact: 'tax-cess-rate' },
    specYears: { fact: 'tax-spec-loss-carry-forward' }, nonspecYears: { fact: 'tax-nonspec-loss-carry-forward' },
    threshold: { fact: 'glb-tcs-threshold' }, tcsRate: { fact: 'glb-tcs-rate' }, lrs: { fact: 'glb-lrs-limit' }, voo: { fact: 'glb-voo-expense-ratio' },
    dtaa: { fact: 'glb-us-dividend-withholding-dtaa' }, defaultWh: { fact: 'glb-us-dividend-withholding-default' }, terDirect: { fact: 'inv-nifty50-ter-direct' },
    register: { html: `<a href="${r}facts/">${esc(S.labels.factsRegister)}</a>`, text: S.labels.factsRegister },
    ratesTitle: { text: S.tools.ratesTitle },
    lore: { html: evidenceTagHtml('LORE'), text: S.labels.evidenceLabels.LORE },
    mechanism: { html: evidenceTagHtml('MECHANISM'), text: S.labels.evidenceLabels.MECHANISM },
  };
  if (f('mac-repo-rate')) vars.repoDate = { html: timeTag(f('mac-repo-rate').verified), text: formatDate(f('mac-repo-rate').verified) };
  // Broker-example brokerage figures, as written in the register ("₹20 or 0.03%, whichever is lower" → 0.03% and ₹20; "₹20 per order" → ₹20)
  const pctCap = f('chg-brokerage-example-intraday-futures') ? rateParts(f('chg-brokerage-example-intraday-futures').value) : [];
  const flat = f('chg-brokerage-example-options') ? rateParts(f('chg-brokerage-example-options').value) : [];
  const raw = (p) => ({ html: esc(p ? p.raw : ''), text: p ? p.raw : '' });
  vars.pct = raw(pctCap.find((p) => p.raw.endsWith('%')));
  vars.cap = raw(pctCap.find((p) => p.currency === '₹'));
  vars.flat = raw(flat.find((p) => p.currency === '₹'));
  for (const [k, v] of Object.entries(vars)) if (v.fact && !f(v.fact)) delete vars[k];
  return vars;
}

/** Initial form values for a tool: field defaults (register or literal) overlaid with a worked example's inputs. */
export function toolValues(tool, rates, example) {
  const values = {};
  for (const f of tool.fields) {
    if (f.factDefault && rates[f.factDefault]) values[f.key] = (rates[f.factDefault].num ?? 0) * (f.factScale || 1);
    else if (f.default !== undefined) values[f.key] = f.default;
    else if (f.type === 'segment' || f.type === 'select') values[f.key] = f.options[0];
    else if (f.type === 'check') values[f.key] = false;
    else values[f.key] = '';
  }
  return { ...values, ...(example ? example.inputs : {}) };
}

/** The resolved inputs calc.js receives: the brokerage model + segment keys as-is, numbers as numbers, blanks for optional fields. */
function toolInputs(tool, values) {
  const inputs = {};
  for (const f of tool.fields) {
    if (f.type === 'static') continue;
    if (!fieldShown(f, values)) continue;
    inputs[f.key] = values[f.key];
  }
  return inputs;
}

function fieldHtml(tool, f, values, ctx, foStep) {
  const F = ctx.T.fields?.[f.key] || {};
  const label = ctx.html(F.label || f.key);
  const hintText = F.hint || (f.tick && f.key === 'buy' ? S.tools.tickHint : '');
  const hint = hintText ? `<span class="hint" id="${esc(f.key)}-hint">${ctx.html(hintText)}</span>` : '';
  const shown = fieldShown(f, values);
  const cls = `field${f.span ? ' span-2' : ''}`;
  const show = f.show ? ` data-show="${esc(JSON.stringify(f.show))}"` : '';
  const wrap = (inner, tag = 'div') => `<${tag} class="${cls}" data-field="${esc(f.key)}"${show}${shown ? '' : ' hidden'}>${inner}</${tag}>`;
  const v = values[f.key];
  if (f.type === 'segment') {
    const tiles = f.options.map((o) => `<label class="option"><input type="radio" name="${esc(f.key)}" value="${esc(o)}"${String(v) === o ? ' checked' : ''}> ${ctx.html(F.options?.[o] ?? o)}</label>`).join('');
    return wrap(`<legend class="label">${label}</legend><div class="options seg-${f.options.length}" role="radiogroup">${tiles}</div>${hint}`, 'fieldset');
  }
  if (f.type === 'static') {
    const text = f.key === 'exchange' ? S.tools.exchangeStatic : '';
    const h = f.key === 'exchange' ? `<span class="hint" id="${esc(f.key)}-hint">${ctx.html(S.tools.exchangeHint)}</span>` : hint;
    return wrap(`<span class="label" id="${esc(f.key)}-label">${label}</span><p class="static" aria-labelledby="${esc(f.key)}-label">${esc(text)}</p>${h}`);
  }
  if (f.type === 'select') {
    const opts = f.options.map((o) => {
      const text = F.options?.[o] ?? o;
      // Options whose text carries register figures (the broker-example brokerage models) are marked as fact renderings
      const factId = f.key === 'model' && o === 'pct-cap' ? 'chg-brokerage-example-intraday-futures' : f.key === 'model' && o === 'flat' ? 'chg-brokerage-example-options' : null;
      return `<option value="${esc(o)}"${String(v) === o ? ' selected' : ''}${factId ? ` class="fact" data-fact="${factId}"` : ''}>${ctx.html(text)}</option>`;
    }).join('');
    return wrap(`<label for="${esc(f.key)}">${label}</label><select class="input" id="${esc(f.key)}" name="${esc(f.key)}"${hint ? ` aria-describedby="${esc(f.key)}-hint"` : ''}>${opts}</select>${hint}`);
  }
  if (f.type === 'check') {
    return wrap(`<label class="option"><input type="checkbox" id="${esc(f.key)}" name="${esc(f.key)}"${v === true || v === 'true' ? ' checked' : ''}> ${label}</label>${hint}`);
  }
  // numeric inputs: money (₹ prefix), percent (% suffix), int, number
  const step = f.tick ? (foStep.fo ? foStep.foStep : '0.01') : String(f.step ?? 1);
  const attrs = [
    `id="${esc(f.key)}"`, `name="${esc(f.key)}"`, 'type="number"', `inputmode="${f.type === 'int' ? 'numeric' : 'decimal'}"`,
    f.min !== undefined ? `min="${f.min}"` : '', f.max !== undefined ? `max="${f.max}"` : '', `step="${step}"`,
    `value="${esc(v === undefined || v === null ? '' : v)}"`,
    f.optional ? 'data-optional="true"' : 'required',
    f.tick ? `data-step-equity="0.01" data-step-fo="${esc(foStep.foStep)}"` : '',
    hint ? `aria-describedby="${esc(f.key)}-hint"` : '',
  ].filter(Boolean).join(' ');
  const optionalMark = f.optional ? ` <span class="muted small">(${esc(S.tools.optional)})</span>` : '';
  const control = f.type === 'money'
    ? `<div class="input-prefix"><span>₹</span><input ${attrs}></div>`
    : f.type === 'percent'
      ? `<div class="input-prefix input-suffix"><input ${attrs}><span>%</span></div>`
      : `<input class="input num" ${attrs}>`;
  return wrap(`<label for="${esc(f.key)}">${label}${optionalMark}</label>${control}${hint}`);
}

function ratesAside(tool, c, ctx, r, today) {
  const T = ctx.T;
  const facts = tool.factIds.map((id) => c.byFact[id]).filter(Boolean);
  const isBroker = (id) => /-example-/.test(id);
  const items = facts.map((f) => `<li id="rate-${esc(f.id)}"><span>${esc(f.label)}</span><b class="num">${esc(f.value)}</b><span class="fd">${factCitation(f, { today, link: true })}${isBroker(f.id) ? ` · ${esc(S.tools.brokerExample)} · ${esc(S.tools.editable)}` : ''}</span></li>`).join('');
  const notes = (T.notes || []).map((n) => `<p class="small">${ctx.html(n)}</p>`).join('');
  const guide = tool.guide && c.byGuide[tool.guide] ? ` ${ctx.html(S.tools.readMore, { guide: `<a href="${r}guides/${esc(tool.guide)}/">${esc(c.byGuide[tool.guide].title)}</a>` })}` : '';
  return `<aside class="rates" aria-labelledby="rates-title">
        <h2 id="rates-title">${esc(facts.length ? S.tools.ratesTitle : S.tools.notesTitle)}</h2>
        ${facts.length ? `<p class="rates-note">${ctx.html(S.tools.ratesNote)}</p><ul>${items}</ul>` : ''}
        ${notes}
        <hr>
        <p class="small muted">${esc(S.tools.rounding)}${guide}</p>
        ${disclaimer()}
      </aside>`;
}

export function toolPage(tool, c, { today = todayIST() } = {}) {
  const r = rel(2);
  const T = S.tools[tool.id];
  const rates = rateMap(c.byFact, tool.factIds);
  const ctx = makeCtx({ T, C: toolCommonStrings(), rates, vars: toolVars(c, r) });
  const example = tool.examples[0];
  const values = toolValues(tool, rates, example);
  const result = run(tool.id, toolInputs(tool, values), rates);
  const tickFact = c.byFact['opt-tick-size-options'];
  const foStep = { fo: values.segment === 'futures' || values.segment === 'options', foStep: tickFact ? String(rateNum(tickFact.value)) : '0.05' };
  const fields = tool.fields.map((f) => fieldHtml(tool, f, values, ctx, foStep)).join('\n          ');
  // Example counters render inside .num (a rendered numeral, like a date in <time>), so "Example 1" is never read as a typed fact
  const numSpan = (n) => `<span class="num">${n}</span>`;
  const chips = tool.examples.map((e, i) => `<button class="chip" type="button" aria-pressed="${i === 0 ? 'true' : 'false'}" data-example="${i + 1}">${fillHtml(S.tools.exampleN, { n: numSpan(i + 1), label: esc(e.label) })}</button>`).join('');
  const mode = values.mode;
  const body = `<section class="section">
  <div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { href: 'tools/', label: TOOLS_LABEL() }, { label: tool.title }])}
    <div class="section-head">
      <div><p class="eyebrow">${esc(S.tools.eyebrow)}</p><h1>${esc(tool.title)}</h1></div>
      <p class="lede">${ctx.html(tool.factIds.length ? S.tools.lede : S.tools.ledeNoRates)}</p>
    </div>
    <div class="tool-layout">
      <form class="card stack tool-form" aria-labelledby="form-title" data-tool="${esc(tool.id)}" data-example="1" novalidate>
        <h2 class="h3" id="form-title">${ctx.html(T.formTitle || S.tools.formTitle)}</h2>
        <div class="form-grid">
          ${fields}
        </div>
        <div>
          <p class="label small">${esc(S.tools.examples)}</p>
          <div class="examples">${chips}</div>
        </div>
        <div class="cluster">
          <button class="btn btn-secondary" type="button" data-action="reset-example">${fillHtml(S.tools.reset, { n: numSpan(1) })}</button>
          <span class="muted small" id="form-status">${fillHtml(S.tools.exampleLoaded, { n: numSpan(1) })}</span>
        </div>
      </form>
      <div class="stack">
        <section class="result" aria-labelledby="res-title">
          <div class="result-head" data-result-head>${resultHead(result, ctx, { mode })}</div>
          <div class="result-body" data-result-body>${resultBody(result, ctx)}</div>
          <p class="visually-hidden" role="status" id="tool-announce">${esc(announce(result, ctx, { mode }))}</p>
        </section>
        <details class="disclosure" open>
          <summary>${esc(S.tools.formula)}</summary>
          <div class="body">
            <pre class="formula">${esc(result.formulaText)}</pre>
            <p class="small muted">${tool.factIds.length ? `${ctx.html(S.tools.formulaNote)} ` : ''}${esc(S.tools.rounding)}</p>
          </div>
        </details>
      </div>
      ${ratesAside(tool, c, ctx, r, today)}
    </div>
    <template id="tool-strings" data-json>${esc(JSON.stringify({ C: toolCommonStrings(), T, vars: toolVars(c, r) }))}</template>
    <template id="tool-rates" data-json>${esc(JSON.stringify(rates))}</template>
    <template id="tool-examples" data-json>${esc(JSON.stringify(tool.examples.map((e, i) => ({ n: i + 1, label: e.label, inputs: toolValues(tool, rates, e), expect: e.expect }))))}</template>
  </div>
</section>
<script type="module" src="${r}tool-ui.js"></script>`;
  return layout({ title: tool.title, description: tool.summary, path: `tools/${tool.id}/index.html`, depth: 2, body, current: 'tools/', schema: 'WebPage' });
}

/* ---------- Learn (library, design §6.10) ---------- */

/** Default order of a library table: forthcoming titles last, then free before paid, then title (design §6.10). */
export function libraryOrder(list) {
  return [...list].sort((a, b) => (a.forthcoming ? 1 : 0) - (b.forthcoming ? 1 : 0) || (a.cost === 'paid' ? 1 : 0) - (b.cost === 'paid' ? 1 : 0) || a.title.localeCompare(b.title));
}

/** Rows the Learn page filters: both lists; `free` and per-fit counts drive the toolbar chips (N3: counts from data). */
export function libraryCounts(c) {
  const all = [...c.library.courses, ...c.library.books];
  const fits = Object.fromEntries(LIBRARY_FITS.map((f) => [f, all.filter((e) => e.fits.includes(f)).length]));
  return { all: all.length, free: all.filter((e) => e.cost === 'free').length, paid: all.filter((e) => e.cost === 'paid').length, fits };
}

const showingHtml = (x, y) => fillHtml(S.client.showing, { x: `<b class="num">${x}</b>`, y: `<b class="num">${y}</b>` });

function libraryRow(e, figureLabel) {
  const type = S.learn.types[e.type] || e.type;
  const first = e.links[0];
  const cost = e.cost === 'free'
    ? `<span class="tag tag-free">${esc(S.labels.free)}</span>`
    : `<span class="tag tag-paid">${esc(S.labels.paid)}</span> ${e.price ? `<span class="price">${esc(e.price.amount)}</span> <span class="muted small seen">${fillHtml(S.learn.seen, { date: timeTag(e.price.seen) })}</span>` : `<span class="muted">${esc(S.learn.varies)}</span>`}`;
  const figure = e.hours ?? e.pages;
  const figureCaption = e.hours ? S.learn.columns.hours : e.pages ? S.learn.columns.pages : figureLabel;
  const figureCell = figure !== undefined ? esc(String(figure)) : `<span class="effort">${esc(e.effort || '')}</span>`;
  const rank = e.rank ? Object.entries(e.rank).map(([f, n]) => `${f}:${n}`).join('|') : '';
  return `<tr id="${esc(e.id)}" data-cost="${esc(e.cost)}" data-level="${esc(e.level)}" data-type="${esc(e.type)}" data-fits="${esc(e.fits.join('|'))}" data-rank="${esc(rank)}"${e.forthcoming ? ' data-forthcoming="true"' : ''}>`
    + `<td class="c-title"><span class="title"><a href="${esc(first.url)}" rel="noopener noreferrer" target="_blank">${esc(e.title)}</a></span>${e.forthcoming ? ` <span class="tag">${esc(S.learn.forthcoming)}</span>` : ''}<span class="by">${esc(e.by)} · ${esc(type)} · ${esc(e.year)}</span></td>`
    + `<td class="c-type" data-label="${esc(S.learn.columns.type)}">${esc(type)}</td>`
    + `<td class="c-cost" data-label="${esc(S.learn.columns.cost)}">${cost}</td>`
    + `<td class="c-level" data-label="${esc(S.learn.columns.level)}">${esc(S.labels.levels[e.level] || e.level)}</td>`
    + `<td class="c-fits" data-label="${esc(S.learn.columns.fit)}"><div class="fits">${e.fits.map((f) => `<span class="tag">${esc(S.learn.fits[f] || f)}</span>`).join('')}</div></td>`
    + `<td class="num c-hours" data-label="${esc(figureCaption)}">${figureCell}</td>`
    + `<td class="c-why" data-label="${esc(S.learn.columns.why)}"><span class="why">${esc(e.why)}</span>${e.caveats ? `<span class="caveat">${esc(e.caveats)}</span>` : ''}</td>`
    + `<td class="links c-links" data-label="${esc(S.learn.columns.links)}">${e.links.map((l) => `<a href="${esc(l.url)}" rel="noopener noreferrer" target="_blank">${esc(l.label)}</a>`).join('')}</td>`
    + '</tr>';
}

function libraryTable(list, id, title, figureLabel) {
  const head = `<h2 id="${id}" class="group-title">${esc(title)} <span class="group-note" data-lib-group-count>${showingHtml(list.length, list.length)}</span></h2>`;
  if (!list.length) return `${head}${empty(S.learn.empty)}`;
  const cols = S.learn.columns;
  return `${head}<div class="table-wrap" data-lib-table="${id}"><table class="lib-table" id="${id}-table"><thead><tr><th class="c-title">${esc(cols.title)}</th><th class="c-type">${esc(cols.type)}</th><th class="c-cost">${esc(cols.cost)}</th><th class="c-level">${esc(cols.level)}</th><th class="c-fits">${esc(cols.fit)}</th><th class="num c-hours">${esc(figureLabel)}</th><th class="c-why">${esc(cols.why)}</th><th class="c-links">${esc(cols.links)}</th></tr></thead><tbody>${libraryOrder(list).map((e) => libraryRow(e, figureLabel)).join('')}</tbody></table></div><p class="empty" data-lib-none hidden>${esc(S.client.libNone)}</p>`;
}

/** Hero card (M5): courses · books and papers · free · dead links of N checked (from health.json; "not yet" without it). */
function librarySummary(c, r, n) {
  const h = c.library.health;
  const dead = h
    ? `<div><dd class="num" data-summary="dead">${h.dead.length}</dd><dt>${fillHtml(S.learn.summary.dead, { n: `<span class="num">${h.urls}</span>` })}</dt></div>`
    : `<div><dd class="num" data-summary="dead">—</dd><dt>${esc(S.learn.summary.notChecked)}</dt></div>`;
  return `<aside class="lib-summary" aria-labelledby="lib-summary-title" data-lib-summary>
        <p class="eyebrow" id="lib-summary-title">${h ? fillHtml(S.learn.summaryEyebrow, { date: timeTag(h.checked) }) : esc(S.learn.summaryUnchecked)}</p>
        <dl>
          <div><dd class="num" data-summary="courses">${c.library.courses.length}</dd><dt>${esc(S.learn.summary.courses)}</dt></div>
          <div><dd class="num" data-summary="books">${c.library.books.length}</dd><dt>${esc(S.learn.summary.books)}</dt></div>
          <div><dd class="num" data-summary="free">${n.free}</dd><dt>${esc(S.learn.summary.free)}</dt></div>
          ${dead}
        </dl>
        <p class="source">${fillHtml(S.learn.summaryNote, { path: `<a href="#path">${esc(S.learn.pathLink)}</a>`, csv: `<a href="${r}data/library.csv" download>${esc(S.learn.csvLink)}</a>` })}</p>
      </aside>`;
}

/** Toolbar (N3): Cost chips (All pressed), seven Fit chips (none pressed), Level and Type selects, text filter, count line, CSV. */
function libraryToolbar(r, n) {
  const F = S.learn.filters;
  const chip = (group, value, label, count, pressed) => `<button class="chip" type="button" data-${group}="${esc(value)}" aria-pressed="${pressed}">${esc(label)} <span class="count num">${count}</span></button>`;
  const option = (value, label) => `<option value="${esc(value)}">${esc(label)}</option>`;
  return `<div class="toolbar" role="region" aria-label="${esc(S.learn.filtersAria)}" data-library>
      <div class="toolbar-row">
        <span class="label">${esc(F.cost)}</span>
        <div class="chip-row" data-lib-cost>${chip('cost', 'all', F.all, n.all, 'true')}${chip('cost', 'free', F.free, n.free, 'false')}${chip('cost', 'paid', F.paid, n.paid, 'false')}</div>
        <span class="spacer"></span>
        <label class="search-field">${ICONS.search}<input class="input" type="search" id="lib-filter" maxlength="80" placeholder="${esc(S.learn.filterPlaceholder)}" aria-label="${esc(S.learn.filterAria)}" autocomplete="off"></label>
      </div>
      <div class="toolbar-row">
        <span class="label">${esc(F.fit)}</span>
        <div class="chip-row" data-lib-fit>${LIBRARY_FITS.map((f) => chip('fit', f, S.learn.fits[f] || f, n.fits[f], 'false')).join('')}</div>
      </div>
      <div class="toolbar-row">
        <span class="label">${esc(F.level)}</span>
        <select class="input" aria-label="${esc(F.level)}" data-lib-level>${option('', F.anyLevel)}${Object.entries(S.labels.levels).map(([v, l]) => option(v, l)).join('')}</select>
        <span class="label">${esc(F.type)}</span>
        <select class="input" aria-label="${esc(F.type)}" data-lib-type>${option('', F.anyType)}${LIBRARY_TYPES.map((t) => option(t, S.learn.types[t] || t)).join('')}</select>
        <span class="spacer"></span>
        <span class="lib-count" data-lib-count>${showingHtml(n.all, n.all)} · <span data-lib-sort>${esc(S.client.libSortDefault)}</span></span>
        <a class="btn btn-secondary btn-sm" href="${r}data/library.csv" download>${ICONS.download}${esc(S.learn.csv)}</a>
      </div>
    </div>`;
}

/** Recommended path: intro from path.json (starts "Our editorial judgement, not advice", M4), three stage cards, steps linking rows. */
function libraryPath(c) {
  const L = c.library;
  if (!L.path.stages?.length) return '';
  const byId = Object.fromEntries([...L.courses, ...L.books].map((e) => [e.id, e]));
  const card = (st) => `<div class="card path-card"><h3>${esc(st.title)}</h3>${st.hoursPerWeek ? `<p class="hours"><b class="num">${esc(String(st.hoursPerWeek))}</b> ${esc(S.learn.hoursPerWeek)}</p>` : ''}<ol>${(st.steps || []).map((s) => { const e = byId[s.entry]; return `<li><a href="#${esc(e.id)}">${esc(e.title)}</a>${s.note ? `<small>${renderInline(s.note, { facts: c.byFact })}</small>` : ''}</li>`; }).join('')}</ol></div>`;
  return `<section id="path" aria-labelledby="path-title">
      <div class="section-head"><div><p class="eyebrow">${esc(S.learn.path)}</p><h2 id="path-title">${esc(S.learn.pathTitle)}</h2></div><p>${L.path.intro ? renderInline(L.path.intro, { facts: c.byFact }) : esc(S.learn.pathLede)}</p></div>
      <div class="path-grid">${L.path.stages.map(card).join('')}</div>
    </section>`;
}

export function learnPage(c) {
  const r = rel(1);
  const L = c.library;
  const n = libraryCounts(c);
  const h = L.health;
  const rules = esc(S.learn.checkedRules);
  const checked = h
    ? fillHtml(S.learn.checked, { date: timeTag(h.checked), dead: `<span class="num">${h.dead.length}</span>`, n: `<span class="num">${h.urls}</span>`, rules })
    : fillHtml(S.learn.notChecked, { rules });
  const body = `<section class="section"><div class="container">
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.learn.eyebrow }])}
    <div class="learn-hero">
      <div><p class="eyebrow">${esc(S.learn.eyebrow)}</p><h1>${esc(S.learn.title)}</h1><p class="lede">${esc(S.learn.lede)}</p></div>
      ${librarySummary(c, r, n)}
    </div>
    ${libraryToolbar(r, n)}
    ${libraryPath(c)}
    ${libraryTable(L.courses, 'courses', S.learn.courses, S.learn.columns.hours)}
    ${libraryTable(L.books, 'books', S.learn.books, S.learn.columns.pages)}
    <p class="small muted lib-checked">${checked}</p>
  </div></section>`;
  return layout({ title: S.learn.title, description: S.learn.description, path: 'learn/index.html', depth: 1, body, current: 'learn/' });
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

/* ---------- Calendar (design §6.11) ---------- */

/** "Rules in force, verified" box (design §6.11): expiry-day ELM, Bank Nifty weekly status, one weekly per exchange, holiday count. */
export const CALENDAR_FACT_IDS = ['fo-expiry-day-elm-addon', 'fo-banknifty-weekly-status', 'opt-weekly-expiries-per-exchange', 'mkt-holidays-current-year-count'];
/** Chips released on load (design §6.11): the two noisiest kinds. Nothing is persisted. */
export const CALENDAR_DEFAULT_OFF = ['results', 'us-holiday'];
const UPNEXT_COUNT = 4;

const istParts = (iso, opts) => Object.fromEntries(new Intl.DateTimeFormat('en-IN', { ...opts, timeZone: SITE.timeZone }).formatToParts(new Date(iso)).map((p) => [p.type, p.value]));
const monthTitle = (ym) => { const p = istParts(`${ym}-01`, { month: 'long', year: 'numeric' }); return `${p.month} ${p.year}`; };
/** "Fri 6 Nov" — the up-next card date; app.js builds the same string from the same Intl parts. */
const upWhen = (iso) => { const p = istParts(iso, { weekday: 'short', day: 'numeric', month: 'short' }); return `${p.weekday} ${p.day} ${p.month}`; };
const eventCount = (n) => fill(n === 1 ? S.client.event : S.client.events, { n });

export function calendarPage(c, { today = todayIST() } = {}) {
  const r = rel(1);
  const cal = c.calendar;
  const filters = cal.filters || [];
  const kindLabel = Object.fromEntries(filters.map((f) => [f.id, f.label]));
  const rules = (cal.events || []).filter((e) => e.rule);
  const dated = (cal.events || []).filter((e) => e.date).slice().sort((a, b) => a.date.localeCompare(b.date));
  const host = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; } };
  const source = (e) => `<a href="${esc(e.source)}" rel="noopener noreferrer" target="_blank">${esc(S.labels.source)}</a>`;
  const timeSpan = (e) => (e.time_ist ? `<span class="time">${esc(e.time_ist)}</span>` : '');
  // Spaces between the inline children keep the text readable when the markup is read as text (copy, screen readers, the scan).
  const meta = (e) => `<span class="m"><span class="tag">${esc(kindLabel[e.kind] || e.kind)}</span> ${timeSpan(e)} ${source(e)}</span>`;

  // Up next: the first four dated events on or after the build date (no-JS fallback; app.js recomputes from the template).
  const upcoming = dated.filter((e) => e.date >= today).slice(0, UPNEXT_COUNT);
  const upCard = (e) => `<div class="card"><span class="when num">${esc(upWhen(e.date))}${e.time_ist ? ` · ${esc(e.time_ist)}` : ''}</span> <span class="what">${renderInline(e.what, { facts: c.byFact })}</span> <span class="kind">${esc(kindLabel[e.kind] || e.kind)} · ${esc(host(e.source))}</span></div>`;
  const upNext = `<section class="upnext" aria-label="${esc(S.calendar.upNext)}" data-cal-upnext>${upcoming.length ? upcoming.map(upCard).join('') : `<p class="empty">${esc(S.client.noUpcoming)}</p>`}</section>`;

  // Rules box: recurring rules left, the verified facts the page relies on right (the four design ids first, then every other tokened id).
  const tokened = [];
  for (const t of calendarTexts(cal)) renderInline(t, { facts: c.byFact, factRefs: tokened });
  const boxIds = [...CALENDAR_FACT_IDS, ...tokened.filter((id) => !CALENDAR_FACT_IDS.includes(id))];
  const rulesList = rules.length
    ? `<ul class="rules-list">${rules.map((e) => `<li data-kind="${esc(e.kind)}"><b>${renderInline(e.rule, { facts: c.byFact })}</b> <span>${renderInline(e.what, { facts: c.byFact })}${e.time_ist ? ` · ${timeSpan(e)}` : ''} · ${source(e)}</span></li>`).join('')}</ul>`
    : `<p class="muted">${esc(S.calendar.empty)}</p>`;
  const rulesBox = `<div class="rules-box"><div class="card"><h2>${esc(S.calendar.rulesTitle)}</h2>${rulesList}</div>${factsBox(boxIds, c.byFact, r, { today, open: CALENDAR_FACT_IDS.length, title: S.calendar.factsTitle })}</div>`;

  // Filters: one chip per kind with its count; Results windows and US holidays start released; the past switch starts off.
  const counts = Object.fromEntries(filters.map((f) => [f.id, (cal.events || []).filter((e) => e.kind === f.id).length]));
  const chip = (f) => `<button type="button" class="chip" data-value="${esc(f.id)}" aria-pressed="${CALENDAR_DEFAULT_OFF.includes(f.id) ? 'false' : 'true'}">${esc(f.label)} <span class="count num">${counts[f.id]}</span></button>`;
  const toolbar = `<div class="toolbar" role="region" aria-label="${esc(S.calendar.filtersAria)}" data-cal-toolbar><div class="toolbar-row"><span class="label">${esc(S.calendar.filtersTitle)}</span><div class="chip-row" data-cal-filters>${filters.map(chip).join('')}</div><span class="spacer"></span><button type="button" class="switch" aria-pressed="false" data-cal-past><span class="knob" aria-hidden="true"></span>${esc(S.calendar.showPast)}</button></div></div>`;

  // Month cards: every dated event, oldest month first; app.js hides past rows, released kinds and empty months, and marks the current month.
  const byMonth = new Map();
  for (const e of dated) { const k = e.date.slice(0, 7); if (!byMonth.has(k)) byMonth.set(k, []); byMonth.get(k).push(e); }
  const row = (e) => `<li data-kind="${esc(e.kind)}" data-date="${esc(e.date)}"><span class="d"><time datetime="${esc(e.date)}">${esc(e.date.slice(8))}</time> <small>${esc(istParts(e.date, { weekday: 'short' }).weekday)}</small></span> <span class="w">${renderInline(e.what, { facts: c.byFact })}</span> ${meta(e)}</li>`;
  const month = (ym, list) => `<div class="month" data-month="${esc(ym)}"><h2 class="h3">${esc(monthTitle(ym))} <small><span class="num" data-cal-count>${esc(eventCount(list.length))}</span><span class="now" data-cal-now hidden> ${esc(S.client.thisMonth)}</span></small></h2><ul>${list.map(row).join('')}</ul></div>`;
  const months = byMonth.size
    ? `<div class="grid grid-fill-4 month-grid" data-cal-grid>${[...byMonth.entries()].map(([ym, list]) => month(ym, list)).join('')}</div><p class="empty" data-cal-none hidden>${esc(S.calendar.none)}</p>`
    : empty(S.calendar.empty);

  const data = { tz: SITE.timeZone, today, filters, defaultOff: CALENDAR_DEFAULT_OFF, events: dated.map((e) => ({ date: e.date, kind: e.kind, time: e.time_ist || '', what: renderInline(e.what, { facts: c.byFact }), source: e.source })) };
  const body = `<section class="section"><div class="container" data-calendar>
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.calendar.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.calendar.eyebrow)}</p><h1>${esc(S.calendar.title)}</h1></div><p class="lede">${cal.note ? renderInline(cal.note, { facts: c.byFact }) : esc(S.calendar.lede)}</p></div>
    ${upNext}
    ${rulesBox}
    ${toolbar}
    ${months}
    <p class="small muted" style="margin-top:var(--space-5)">${esc(S.calendar.pastNote)}</p>
    <template id="calendar-data" data-json>${esc(JSON.stringify(data))}</template>
  </div></section>`;
  return layout({ title: S.calendar.title, description: cal.note ? plainInline(cal.note, { facts: c.byFact }) : S.calendar.lede, path: 'calendar/index.html', depth: 1, body, current: 'calendar/' });
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
    ${rail(factsBox(pg.factRefs, c.byFact, r))}
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
  for (const t of calendarTexts(c.calendar)) renderInline(t, { facts: c.byFact, factRefs: refs.calendar });
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
  return layout({ title: S.facts.eyebrow, description: S.facts.lede, path: 'facts/index.html', depth: 1, body, current: '', schema: 'WebPage' });
}

/* ---------- Computed statistics (route stats/, FEAT-017; emitted only when content/data/stats.json exists) ---------- */

const statNum = (x, digits = 2) => (typeof x === 'number' && Number.isFinite(x) ? x.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits }) : '—');
const statInt = (x) => statNum(x, 0);
const statPct = (x) => (typeof x === 'number' && Number.isFinite(x) ? `${statNum(x)} %` : '—');

/** One statistics table: heading with the "Historical, not a forecast" label, a one-paragraph note, the table (every figure in td.num). */
function statsTable(id, title, note, columns, rows, foot = '') {
  return `<h2 class="group-title" id="${esc(id)}">${esc(title)} <span class="group-note">${esc(S.stats.historical)}</span></h2>
    <p class="stats-note">${esc(note)}</p>
    <div class="table-wrap"><table class="stats-table" aria-describedby="${esc(id)}"><thead><tr>${columns.map((c, i) => `<th${i ? ' class="num"' : ''}>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map((cells) => `<tr>${cells.map((v, i) => (i ? `<td class="num">${esc(v)}</td>` : `<th scope="row">${esc(v)}</th>`)).join('')}</tr>`).join('')}</tbody>${foot ? `<tfoot><tr>${foot.map((v, i) => `<td${i ? ' class="num"' : ''}>${esc(v)}</td>`).join('')}</tr></tfoot>` : ''}</table></div>`;
}

export function statsPage(c) {
  const r = rel(1);
  const st = c.stats;
  const ext = (href, text) => `<a href="${esc(href)}" rel="noopener noreferrer" target="_blank">${esc(text)}</a>`;
  const gc = S.stats.gapsColumns;
  const gaps = statsTable('gaps', S.stats.gapsTitle, S.stats.gapsNote, [gc.bucket, gc.sessions, gc.share, gc.filled, gc.filledShare],
    st.gaps.buckets.map((b) => [b.label, statInt(b.sessions), statPct(b.share), statInt(b.filled), statPct(b.filledShare)]),
    [S.stats.gapsAll, statInt(st.gaps.sessions), statPct(100), statInt(st.gaps.buckets.reduce((n, b) => n + b.filled, 0)), statPct(st.gaps.filledShare)]);
  const dc = S.stats.dirColumns;
  const dir = st.gaps.direction
    ? statsTable('gap-direction', S.stats.dirTitle, S.stats.dirNote, [dc.direction, dc.sessions, dc.share, dc.median, dc.filledShare],
      [['up', S.stats.up], ['down', S.stats.down]].map(([k, label]) => { const d = st.gaps.direction[k]; return [label, statInt(d.sessions), statPct(d.share), statPct(d.medianSize), statPct(d.filledShare)]; }))
    : '';
  const rc = S.stats.rangesColumns;
  const ranges = statsTable('ranges', S.stats.rangesTitle, S.stats.rangesNote, [rc.weekday, rc.sessions, rc.p25, rc.p50, rc.p75, rc.p90],
    st.ranges.weekdays.map((w) => [w.weekday, statInt(w.sessions), statPct(w.p25), statPct(w.p50), statPct(w.p75), statPct(w.p90)]),
    [S.stats.rangesAll, statInt(st.ranges.all.sessions), statPct(st.ranges.all.p25), statPct(st.ranges.all.p50), statPct(st.ranges.all.p75), statPct(st.ranges.all.p90)]);
  const vc = S.stats.vixColumns;
  const vix = st.vix
    ? statsTable('vix', S.stats.vixTitle, S.stats.vixNote, [vc.band, vc.from, vc.to, vc.sessions, vc.p50, vc.p75, vc.p90],
      st.vix.bands.map((b) => [b.label, b.vixFrom === null ? S.stats.vixAny : statNum(b.vixFrom), b.vixTo === null ? S.stats.vixAny : statNum(b.vixTo), statInt(b.sessions), statPct(b.nextRangeP50), statPct(b.nextRangeP75), statPct(b.nextRangeP90)]))
    : `<h2 class="group-title" id="vix">${esc(S.stats.vixTitle)} <span class="group-note">${esc(S.stats.historical)}</span></h2><p class="stats-note muted">${esc(S.stats.vixMissing)}</p>`;
  const sourceLine = fillHtml(S.stats.sourceLine, {
    nifty: ext(st.sourceUrl, S.stats.sourceNifty),
    vix: st.vix && st.vixSourceUrl ? `${esc(S.stats.and)}${ext(st.vixSourceUrl, S.stats.sourceVix)}` : '',
    fetched: timeTag(st.fetched),
  });
  const lede = fillHtml(S.stats.lede, { source: ext(st.sourceUrl, st.source), from: timeTag(st.from), to: timeTag(st.to), n: `<span class="num">${statInt(st.sessions)}</span>`, fetched: timeTag(st.fetched) });
  const body = `<section class="section"><div class="container" data-stats>
    ${breadcrumbs(r, [{ href: '', label: S.labels.home }, { label: S.stats.eyebrow }])}
    <div class="section-head"><div><p class="eyebrow">${esc(S.stats.eyebrow)}</p><h1>${esc(S.stats.title)}</h1></div><p class="lede">${lede}</p></div>
    ${gaps}
    ${dir}
    ${ranges}
    ${vix}
    <div class="prose stats-method">
      <h2 id="method">${esc(S.stats.methodTitle)}</h2>
      ${st.method.split(/(?<=\.)\s+(?=[A-Z])/).reduce((acc, s) => { const last = acc[acc.length - 1]; if (last && last.length + s.length < 420) acc[acc.length - 1] = `${last} ${s}`; else acc.push(s); return acc; }, []).map((p) => `<p>${esc(p)}</p>`).join('')}
      <h2 id="data">${esc(S.stats.sourceTitle)}</h2>
      <p>${sourceLine}</p>
      <h2 id="reading">${esc(S.stats.readTitle)}</h2>
      <p>${esc(S.stats.readText)}</p>
      ${disclaimer()}
    </div>
  </div></section>`;
  return layout({ title: S.stats.title, description: S.stats.description, path: 'stats/index.html', depth: 1, body, current: '', schema: 'WebPage' });
}

export function notFoundPage() {
  const r = rel(0);
  const body = `<section class="section"><div class="container not-found"><p class="eyebrow">${esc(S.notFound.eyebrow)}</p><h1>${esc(S.notFound.title)}</h1><p class="lede">${esc(S.notFound.lede)}</p><div class="cluster"><a class="btn btn-primary" href="${r}">${esc(S.notFound.home)}</a><a class="btn btn-secondary" href="${r}guides/">${esc(S.notFound.guides)}</a></div></div></section>`;
  return layout({ title: S.notFound.title, description: fill(S.notFound.description, { name: SITE.name }), path: '404.html', depth: 0, body, current: '', robots: 'noindex' });
}
