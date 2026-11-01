// HTML templates. Every URL is relative (the site is served under SITE.basePath on GitHub Pages).
import { escapeHtml as esc, factCitation, evidenceTagHtml } from './markdown.js';
import { SITE } from './config.js';
import { STRINGS as S, fill } from './strings.js';
import { formatDate, todayIST } from './dates.js';

export { formatDate } from './dates.js';

// Theme colours the build and the client must agree on (design §3.1 --bg light / dark).
export const THEME_COLOR = { light: '#f5f6f8', dark: '#121418' };

const ICONS = {
  // M1 brand mark: a non-directional "ledger" glyph (rounded square + two bars) in --accent; the favicon is the same path.
  brand: '<svg class="brand-mark" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="4.5"/><path class="bar" d="M7 9.5h10M7 14.5h6"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  theme: '<svg viewBox="0 0 24 24" aria-hidden="true" class="theme-icon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3"/></svg>',
};

export function rel(depth) {
  return depth ? '../'.repeat(depth) : './';
}

/** `<time datetime="2026-11-01">1 Nov 2026</time>` — dates are data, so the never-typed scan skips them. */
export function timeTag(iso) {
  return iso ? `<time datetime="${esc(iso)}">${esc(formatDate(iso))}</time>` : '';
}

/** Indian figures: ₹1,25,120.35 (en-IN grouping). */
export function inr(n, digits = 0) {
  return '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
/** US figures: $1,250,120.35 (en-US grouping). */
export function usd(n, digits = 0) {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function levelTag(level) {
  return level ? `<span class="tag tag-level" data-level="${esc(level)}">${esc(S.labels.levels[level] || level)}</span>` : '';
}

export function evidenceTag(label) {
  return evidenceTagHtml(label);
}

function seoHead({ fullTitle, description, canonical, type, jsonLd, robots }) {
  return `${robots ? `<meta name="robots" content="${esc(robots)}">\n` : ''}<link rel="canonical" href="${esc(canonical)}">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="${type}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">${jsonLd ? `\n<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : ''}`;
}

/** Primary nav links. `current` (the href of the page's nav entry, '' for none) is the ONLY source of aria-current. */
function navLinks(r, current) {
  return S.nav
    .map((n) => `<a href="${r}${n.href}"${n.prominent ? ' class="nav-learn"' : ''}${current === n.href ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`)
    .join('');
}

/**
 * Shared shell. `path` is the output path (e.g. guides/x/index.html); `depth` the folder depth for relative URLs;
 * `current` the nav href this page belongs to ('' when it has no nav entry, e.g. facts/).
 * `article` (optional) = { headline, datePublished, dateModified, section } for JSON-LD Article.
 * `schema` (optional) = 'WebPage' for tool pages and the facts page (design §13: no inflated schema); default WebSite.
 * `robots` (optional) = e.g. 'noindex' (the 404 page).
 */
export function layout({ title, description, path, depth = 0, body, current = '', extraHead = '', bodyClass = '', article = null, schema = null, robots = '' }) {
  const r = rel(depth);
  const fullTitle = title ? `${title} · ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const desc = description || SITE.description;
  const canonical = SITE.liveUrl + path.replace(/index\.html$/, '');
  const links = navLinks(r, current);
  const org = { '@type': 'Organization', name: SITE.name, url: SITE.liveUrl };
  const jsonLd = article
    ? { '@context': 'https://schema.org', '@type': 'Article', headline: article.headline, description: desc, datePublished: article.datePublished, dateModified: article.dateModified, articleSection: article.section, inLanguage: SITE.lang, isAccessibleForFree: true, license: 'https://creativecommons.org/licenses/by/4.0/', author: org, publisher: org, mainEntityOfPage: canonical }
    : schema === 'WebPage'
      ? { '@context': 'https://schema.org', '@type': 'WebPage', name: fullTitle, description: desc, url: canonical, inLanguage: SITE.lang, isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.liveUrl } }
      : { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.liveUrl, description: SITE.description, inLanguage: SITE.lang };
  const key = `${SITE.storagePrefix}:theme`;
  return `<!doctype html>
<html lang="${SITE.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="${THEME_COLOR.light}">
${seoHead({ fullTitle, description: desc, canonical, type: article ? 'article' : 'website', jsonLd, robots })}
<link rel="icon" href="${r}favicon.svg" type="image/svg+xml">
<link rel="preload" href="${r}fonts/inter-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${r}fonts/newsreader-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${r}styles.css">
<script>(function(){try{var t=JSON.parse(localStorage.getItem(${JSON.stringify(key)}));if(t==='system'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();</script>
${extraHead}
</head>
<body class="${bodyClass}" data-root="${r}" data-path="${esc(path)}" data-store="${SITE.storagePrefix}">
<a class="skip-link" href="#main">${esc(S.header.skip)}</a>
<header class="site-header">
  <div class="container header-row">
    <a class="brand" href="${r}" aria-label="${esc(SITE.name)} ${esc(S.header.homeAria)}">${ICONS.brand}<span class="brand-name">${esc(SITE.name)}</span></a>
    <nav class="site-nav" aria-label="${esc(S.header.primaryNav)}">${links}</nav>
    <div class="header-actions">
      <button class="icon-btn" type="button" data-action="search" aria-label="${esc(S.header.searchAria)}">${ICONS.search}<span class="label">${esc(S.header.search)}</span><kbd aria-hidden="true">/</kbd></button>
      <button class="icon-btn theme-btn" type="button" data-action="theme" data-mode="light" aria-label="${esc(fill(S.client.themeAria, { mode: S.theme.light }))}">${ICONS.theme}<span class="label theme-label">${esc(S.theme.light)}</span></button>
      <button class="icon-btn menu-btn" type="button" data-action="menu" aria-label="${esc(S.header.menuOpen)}" aria-expanded="false" aria-controls="mobile-nav">${ICONS.menu}</button>
    </div>
  </div>
  <nav class="container mobile-nav" id="mobile-nav" aria-label="${esc(S.header.mobileNav)}" data-open="false">${links}</nav>
</header>
<main id="main">
${body}
</main>
${footer(r)}
<dialog class="search" id="search-dialog" aria-label="${esc(S.search.dialogAria)}">
  <form class="search-head" method="dialog" role="search">
    ${ICONS.search}
    <input type="search" id="search-input" placeholder="${esc(S.search.placeholder)}" autocomplete="off" aria-label="${esc(S.header.search)}">
    <button class="icon-btn" type="submit" aria-label="${esc(S.search.closeAria)}">${esc(S.search.close)}</button>
  </form>
  <ul class="search-results" id="search-results" aria-live="polite"></ul>
</dialog>
<template id="ui-strings" data-json>${esc(JSON.stringify({ ...S.client, themeColor: THEME_COLOR }))}</template>
<script src="${r}app.js" defer></script>
</body>
</html>
`;
}

function footer(r) {
  const links = (list) => `<ul>${list.map((l) => `<li><a href="${r}${l.href}">${esc(l.label)}</a></li>`).join('')}</ul>`;
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <h2>${esc(S.footer.aboutTitle)}</h2>
        <p>${esc(fill(S.footer.about, { name: SITE.name, hindi: SITE.hindi, meaning: SITE.meaning }))}</p>
      </div>
      <div>
        <h2>${esc(S.footer.learnTitle)}</h2>
        ${links(S.footer.links.start)}
      </div>
      <div>
        <h2>${esc(S.footer.referenceTitle)}</h2>
        ${links(S.footer.links.reference)}
      </div>
      <div>
        <h2>${esc(S.footer.disclaimerTitle)}</h2>
        <p class="footer-disclaimer">${esc(S.footer.disclaimer)}</p>
      </div>
    </div>
    <div class="footer-note">
      <span>${esc(fill(S.footer.copyright, { year: new Date().getUTCFullYear(), name: SITE.name }))}</span>
      <span><a href="${SITE.repo}" rel="noopener noreferrer" target="_blank">${esc(S.footer.source)}</a></span>
    </div>
  </div>
</footer>`;
}

export function breadcrumbs(r, trail) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${trail
    .map((t, i) => (i === trail.length - 1 ? `<span aria-current="page">${esc(t.label)}</span>` : `<a href="${r}${t.href}">${esc(t.label)}</a><span aria-hidden="true">›</span>`))
    .join('')}</nav>`;
}

export function sourcesList(sources) {
  if (!sources.length) return '';
  return `<div class="sources" id="sources"><h2 class="h3">${esc(S.labels.sourcesHeading)}</h2><ol class="sources-list">${sources
    .map((s) => `<li><a href="${esc(s.url)}" rel="noopener noreferrer" target="_blank">${esc(s.title)}</a>${s.accessed ? ` <span class="muted">(${esc(S.labels.accessed)} ${timeTag(s.accessed)})</span>` : ''}</li>`)
    .join('')}</ol></div>`;
}

/** One rail entry in the N4 format: value · label · <source> · since|from <date> · verified <date>. */
function factItem(f, today) {
  return `<li id="fact-${esc(f.id)}"><span class="fv">${esc(f.value)}</span><span class="fl">${esc(f.label)}</span><span class="fd">${factCitation(f, { today, link: true })}</span></li>`;
}

/**
 * Rail box "Facts on this page, verified": the facts a page renders, in order of first use. The first `open` entries
 * (six, design-review NIT 5) are visible; the rest sit inside <details>; then the link to the register.
 */
export function factsBox(ids, byFact, r = './', { today = todayIST(), open = 6 } = {}) {
  const facts = ids.map((id) => byFact[id]).filter(Boolean);
  if (!facts.length) return '';
  const head = facts.slice(0, open);
  const rest = facts.slice(open);
  return `<div class="card facts-box"><h2>${esc(S.labels.factsVerified)}</h2><ul>${head.map((f) => factItem(f, today)).join('')}</ul>${rest.length
    ? `<details><summary>${esc(fill(S.labels.moreFacts, { n: rest.length }))}</summary><ul>${rest.map((f) => factItem(f, today)).join('')}</ul></details>`
    : ''}<p class="all"><a href="${r}facts/">${esc(S.labels.allFacts)}</a></p></div>`;
}

export function disclaimer() {
  return `<p class="disclaimer">${esc(S.footer.disclaimer)}</p>`;
}

export { ICONS };
