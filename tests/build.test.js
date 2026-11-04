import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSearchIndex, buildSite } from '../src/build/site.js';
import { SITE } from '../src/build/config.js';
import { STRINGS } from '../src/build/strings.js';
import { parseGuide, parsePlaybook, PHASE2_SECTIONS } from '../src/build/content.js';
import { TOOLS } from '../src/build/tools.js';
import { FACTS, FACT_MAP, GUIDE, PLAYBOOK, makeContent } from './fixtures.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = await mkdtemp(path.join(tmpdir(), `${SITE.slug}-build-`));
const result = await buildSite({ root, outDir: out, basePath: SITE.basePath });

async function walk(dir, acc = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, acc); else acc.push(p);
  }
  return acc;
}
const files = await walk(out);
const relFiles = new Set(files.map((f) => path.relative(out, f).replace(/\\/g, '/')));
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const pages = await Promise.all(htmlFiles.map(async (f) => ({ file: path.relative(out, f).replace(/\\/g, '/'), html: await readFile(f, 'utf8') })));

test('the site identity lives in one constant and package.json agrees with it', async () => {
  const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  assert.equal(pkg.name, SITE.slug);
  assert.equal(SITE.basePath, `/${SITE.slug}/`);
  assert.ok(SITE.liveUrl.endsWith(SITE.basePath), 'liveUrl ends with basePath');
  assert.ok(SITE.repo.endsWith(`/${SITE.owner}/${SITE.slug}`), 'repo URL matches owner/slug');
  assert.match(SITE.storagePrefix, /^[a-z0-9]+$/);
  // No source/script/site file may hard-code the slug, the name or the old site's tokens.
  const code = ['src/build/site.js', 'src/build/pages.js', 'src/build/templates.js', 'src/build/content.js', 'src/build/markdown.js', 'src/build/strings.js', 'src/build/dates.js', 'src/build/tools.js', 'site/app.js', 'site/styles.css', 'scripts/build.mjs', 'scripts/serve.mjs', 'scripts/shots.py', 'scripts/e2e.py', '.github/workflows/pages.yml'];
  for (const f of code) {
    const text = await readFile(path.join(root, f), 'utf8');
    assert.ok(!/vyapaar|shuruaat/i.test(text), `${f} still mentions the reference site`);
    assert.ok(!text.includes(SITE.slug) && !text.includes(SITE.storagePrefix), `${f} hard-codes the slug or storage prefix`);
    if (!f.endsWith('strings.js')) assert.ok(!text.includes(SITE.name), `${f} hard-codes the site name`);
  }
});

test('builds every page and the data artefacts (empty content set allowed)', () => {
  assert.ok(result.pages >= 13, `pages: ${result.pages}`); // 12 index/utility pages (incl. tools/ and facts/) + 404 on the empty set
  for (const must of ['index.html', 'guides/index.html', 'playbooks/index.html', 'tools/index.html', 'learn/index.html', 'glossary/index.html', 'calendar/index.html', 'changelog/index.html', 'resources/index.html', 'facts/index.html', 'about/index.html', 'sources/index.html', '404.html', 'styles.css', 'app.js', 'favicon.svg', 'fonts/fonts.css', 'fonts/inter-normal-latin.woff2', 'fonts/newsreader-normal-latin.woff2', 'data/search.json', 'data/counts.json', 'data/facts.json', 'data/library.csv', 'sitemap.xml', 'robots.txt', '.nojekyll']) {
    assert.ok(relFiles.has(must), `missing ${must}`);
  }
});

test('every page marks exactly one current nav item where it has a nav entry, and none elsewhere (built, never inferred client-side)', async () => {
  const navHref = (file) => {
    const top = file.split('/')[0];
    return ['guides', 'playbooks', 'tools', 'learn', 'glossary', 'calendar', 'changelog'].includes(top) ? `${top}/` : '';
  };
  for (const { file, html } of pages) {
    const nav = /<nav class="site-nav"[^>]*>([\s\S]*?)<\/nav>/.exec(html)[1];
    const current = [...nav.matchAll(/<a href="([^"]+)"[^>]*aria-current="page"/g)].map((m) => m[1].replace(/^(\.\.\/)+|^\.\//, ''));
    const want = navHref(file);
    assert.deepEqual(current, want ? [want] : [], `${file}: aria-current ${JSON.stringify(current)}`);
    assert.match(nav, /<a href="[^"]*learn\/" class="nav-learn"/, `${file}: Learn pill class`);
    assert.equal((nav.match(/<a /g) || []).length, STRINGS.nav.length, `${file}: nav entries`);
  }
  const app = await readFile(path.join(root, 'site', 'app.js'), 'utf8');
  assert.ok(!/markNav|setAttribute\(['"]aria-current|aria-current['"]\s*,/.test(app), 'app.js must not set nav state');
});

test('every page has exactly one h1, a title, a description, SEO meta, the shared shell and the binding footer disclaimer', () => {
  for (const { file, html } of pages) {
    const h1s = html.match(/<h1[\s>]/g) || [];
    assert.equal(h1s.length, 1, `${file}: ${h1s.length} h1`);
    assert.match(html, /<title>[^<]{5,}<\/title>/, file);
    assert.match(html, /<meta name="description" content="[^"]{20,}"/, file);
    const canonicals = html.match(/<link rel="canonical" href="([^"]+)"/g) || [];
    assert.equal(canonicals.length, 1, `${file}: ${canonicals.length} canonical links`);
    const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)[1];
    assert.ok(canonical.startsWith(SITE.liveUrl) && !canonical.includes('index.html'), `${file}: canonical ${canonical}`);
    for (const p of ['site_name', 'title', 'description', 'type', 'url', 'locale']) assert.match(html, new RegExp(`<meta property="og:${p}" content="[^"]+"`), `${file}: og:${p}`);
    assert.match(html, /<meta property="og:locale" content="en_IN">/, file);
    assert.match(html, new RegExp(`<meta property="og:url" content="${canonical.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}">`), `${file}: og:url = canonical`);
    assert.match(html, /<meta name="twitter:card" content="summary">/, file);
    const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    assert.equal(ld.length, 1, `${file}: ${ld.length} JSON-LD scripts`);
    const kind = /^(guides|playbooks)\/[^/]+\/index\.html$/.test(file) ? 'Article' : /^(tools\/[^/]+|facts|stats)\/index\.html$/.test(file) ? 'WebPage' : 'WebSite';
    assert.equal(ld[0]['@type'], kind, `${file}: JSON-LD @type`);
    assert.equal(ld[0]['@context'], 'https://schema.org', file);
    if (kind === 'Article') {
      for (const k of ['headline', 'description', 'datePublished', 'dateModified', 'articleSection', 'inLanguage', 'isAccessibleForFree', 'license', 'author', 'publisher', 'mainEntityOfPage']) assert.ok(k in ld[0], `${file}: Article.${k}`);
      assert.equal(ld[0].license, 'https://creativecommons.org/licenses/by/4.0/', file);
      assert.equal(ld[0].mainEntityOfPage, canonical, file);
      assert.equal(ld[0].author['@type'], 'Organization', file);
      assert.equal(ld[0].publisher['@type'], 'Organization', file);
    }
    if (file === '404.html') assert.match(html, /<meta name="robots" content="noindex">/, file);
    else assert.ok(!/<meta name="robots"/.test(html), `${file}: unexpected robots meta`);
    assert.match(html, /<nav class="site-nav"/, file);
    assert.match(html, /app\.js" defer>/, file);
    assert.match(html, new RegExp(`<html lang="${SITE.lang}">`), file);
    assert.ok(html.includes(STRINGS.footer.disclaimer.replace(/'/g, '&#39;')) || html.includes(STRINGS.footer.disclaimer), `${file}: footer disclaimer`);
    assert.match(html, /data-action="theme" data-mode="light"/, `${file}: theme control state`);
    assert.match(html, /<span class="label theme-label">Light<\/span>/, `${file}: theme label`);
    assert.match(html, /<meta name="theme-color" content="#f5f6f8">/, `${file}: light theme-color`);
    assert.match(html, /<svg class="brand-mark"[^>]*><rect [^>]*rx="4\.5"[^>]*\/><path class="bar" d="M7 9\.5h10M7 14\.5h6"\/><\/svg>/, `${file}: M1 brand mark`);
    assert.ok(!/<span class="brand-mark"/.test(html), `${file}: old brand mark`);
    assert.match(html, new RegExp(`data-store="${SITE.storagePrefix}"`), file);
    assert.ok(html.includes(`localStorage.getItem("${SITE.storagePrefix}:theme")`), `${file}: first-paint theme script`);
    assert.match(html, /<template id="ui-strings" data-json>/, file);
    assert.ok(!/vyapaar|shuruaat/i.test(html), `${file}: reference-site token`);
  }
});

test('guide and playbook pages carry JSON-LD Article when present', () => {
  for (const { file, html } of pages.filter((p) => /^(guides|playbooks)\/[^/]+\/index\.html$/.test(p.file))) {
    assert.match(html, /"@type":"Article"/, file);
    assert.match(html, /<ol class="sources-list">/, file);
    assert.match(html, /class="disclaimer"/, file);
  }
});

test('all internal links are relative and resolve to built files; no absolute root links', () => {
  let checked = 0;
  for (const { file, html } of pages) {
    if (file === '404.html') continue;
    const dir = path.posix.dirname(file);
    for (const m of html.matchAll(/(?:href|src)="([^"#]+)(#[^"]*)?"/g)) {
      const href = m[1];
      if (/^(https?:|mailto:|data:)/.test(href)) continue;
      assert.ok(!href.startsWith('/'), `${file}: absolute link ${href}`);
      const target = path.posix.normalize(path.posix.join(dir, href.split('?')[0]));
      const candidates = [target, path.posix.join(target, 'index.html'), target.replace(/\/$/, '') + '/index.html'];
      assert.ok(candidates.some((c) => relFiles.has(c)), `${file}: broken link ${href}`);
      checked++;
    }
  }
  assert.ok(checked > 100, `checked ${checked} links`);
});

test('404 page pins its base path so relative URLs survive any missing path, is noindex and offers Home/Guides', () => {
  const p = pages.find((x) => x.file === '404.html');
  assert.match(p.html, new RegExp(`<head>\\s*<base href="${SITE.basePath}">`), 'base right after <head>');
  assert.match(p.html, /<meta name="robots" content="noindex">/);
  assert.match(p.html, /<h1>That page is not here<\/h1>/);
  assert.match(p.html, /<a class="btn btn-primary" href="\.\/">Home<\/a><a class="btn btn-secondary" href="\.\/guides\/">Guides<\/a>/);
});

test('home shows the computed counts and they match data/counts.json', async () => {
  const home = pages.find((x) => x.file === 'index.html').html;
  const counts = JSON.parse(await readFile(path.join(out, 'data', 'counts.json'), 'utf8'));
  for (const k of ['guides', 'playbooks', 'tools', 'terms', 'sources']) {
    const m = new RegExp(`data-count="${k}">(\\d+)<`).exec(home);
    assert.ok(m, `home count ${k}`);
    assert.equal(Number(m[1]), counts[k], k);
  }
  assert.equal(counts.guides, result.guides);
  assert.equal(counts.playbooks, result.playbooks);
});

test('search index entries are well-formed and relative; utility pages are always present', async () => {
  const idx = JSON.parse(await readFile(path.join(out, 'data', 'search.json'), 'utf8'));
  for (const d of idx) assert.ok(d.kind && d.title && d.url && !d.url.startsWith('/'), JSON.stringify(d));
  const urls = new Set(idx.map((d) => d.url));
  for (const u of ['tools/', 'learn/', 'calendar/', 'changelog/', 'resources/', 'facts/', 'about/']) assert.ok(urls.has(u), u);
  const facts = idx.filter((d) => d.kind === STRINGS.labels.fact);
  assert.equal(facts.length, result.facts, 'one Fact entry per register row');
  for (const d of facts) {
    assert.match(d.url, /^facts\/#fact-[a-z0-9][a-z0-9-]*$/, d.url);
    assert.ok(d.text.includes(' · '), `${d.url}: text = value · label`);
  }
  for (const d of idx.filter((x) => x.kind === STRINGS.labels.course || x.kind === STRINGS.labels.book)) assert.match(d.url, /^learn\/#[^#]+$/, d.url);
});

test('search index: every kind (Guide, Section, Playbook, Tool, Term, Course, Book, Fact, Page) has its URL shape and every url is relative', () => {
  const L = STRINGS.labels;
  const entry = (id, title) => ({ id, title, by: 'Someone', type: 'course', cost: 'free', links: [{ url: 'https://example.org/' }], year: '2026', level: 'beginner', fits: ['options'], why: 'w', caveats: '' });
  const c = makeContent({
    guides: [parseGuide(GUIDE, 'sessions', FACT_MAP)],
    playbooks: [parsePlaybook(PLAYBOOK, 'orb-15', FACT_MAP)],
    glossary: [{ term: 'Open interest (OI)', def: 'Contracts outstanding.' }],
    library: { courses: [entry('varsity-options', 'Varsity options module')], books: [entry('natenberg', 'Option Volatility and Pricing')], path: { intro: '', stages: [] } },
    facts: FACTS,
  });
  const idx = buildSearchIndex(c);
  const shape = {
    [L.guide]: /^guides\/[a-z0-9-]+\/$/,
    [L.section]: /^guides\/[a-z0-9-]+\/#[a-z0-9-]+$/,
    [L.playbook]: /^playbooks\/[a-z0-9-]+\/$/,
    [L.tool]: /^tools\/[a-z0-9-]+\/$/,
    [L.term]: /^glossary\/#[a-z0-9-]+$/,
    [L.course]: /^learn\/#[^#\s]+$/,
    [L.book]: /^learn\/#[^#\s]+$/,
    [L.fact]: /^facts\/#fact-[a-z0-9][a-z0-9-]*$/,
    [L.page]: /^[a-z]+\/$/,
  };
  for (const kind of Object.keys(shape)) assert.ok(idx.some((d) => d.kind === kind), `index has a ${kind} entry`);
  for (const d of idx) {
    assert.ok(shape[d.kind], `unknown kind ${d.kind}`);
    assert.match(d.url, shape[d.kind], `${d.kind}: ${d.url}`);
    assert.ok(!/^(\/|[a-z]+:)/i.test(d.url), `${d.url} is relative`);
    assert.ok(d.title && typeof d.text === 'string' && typeof d.keywords === 'string', JSON.stringify(d));
  }
  assert.deepEqual(idx.filter((d) => d.kind === L.tool).map((d) => d.url), TOOLS.map((t) => `tools/${t.id}/`), 'one Tool entry per registry entry, in registry order');
  assert.equal(idx.find((d) => d.kind === L.term).url, 'glossary/#open-interest-oi');
  assert.equal(idx.find((d) => d.kind === L.fact && d.url.endsWith('fo-nifty-lot')).text, '65 · Nifty 50 lot size');
  assert.deepEqual(idx.filter((d) => d.kind === L.course || d.kind === L.book).map((d) => d.url), ['learn/#varsity-options', 'learn/#natenberg']);
});

test('the facts register page lists every fact with id anchor, group, N4 source title, since/verified dates and usage', async () => {
  const html = pages.find((x) => x.file === 'facts/index.html').html;
  const factsJson = JSON.parse(await readFile(path.join(out, 'data', 'facts.json'), 'utf8'));
  const rows = [...html.matchAll(/<tr id="fact-([a-z0-9-]+)" data-group="([a-z]+)"/g)];
  assert.equal(rows.length, factsJson.length);
  assert.ok(rows.every((m) => ['sessions', 'charges', 'options', 'sebi', 'tax', 'macro', 'algo', 'india', 'abroad'].includes(m[2])), 'every row sits in one of the nine groups');
  assert.match(html, /<button class="chip" type="button" data-group="all" aria-pressed="true">All <span class="count">\d+<\/span><\/button>/);
  assert.equal((html.match(/class="chip"/g) || []).length, factsJson.length ? 10 : 0, 'All + nine group chips');
  assert.match(html, /href="\.\.\/data\/facts\.json" download/);
  if (factsJson.length) {
    const hero = /<tr id="fact-sebi-loss-2026-share"[\s\S]*?<\/tr>/.exec(html)[0];
    assert.match(hero, /<td class="val">87\.7%<\/td>/);
    assert.match(hero, /<td class="num"><time datetime="2026-08-20">20 Aug 2026<\/time><\/td><td class="num"><time datetime="2026-11-01">1 Nov 2026<\/time><\/td>/);
    assert.match(hero, /<a href="\.\.\/">Home<\/a>/, 'hero facts are used on the home page');
  }
  assert.ok(!/<a [^>]*aria-current="page"/.test(/<nav class="site-nav"[^>]*>([\s\S]*?)<\/nav>/.exec(html)[1]), 'facts/ has no nav entry');
});

test('the home page renders the SEBI hero card from the five register facts with one card-level citation', () => {
  const home = pages.find((x) => x.file === 'index.html').html;
  if (!result.facts) { assert.match(home, /<aside class="sebi-box"/); return; }
  for (const id of ['sebi-loss-2026-share', 'sebi-loss-2026-amount', 'sebi-loss-2026-avg', 'sebi-costs-share', 'sebi-loss-2026-five-year-consistent']) {
    assert.equal((home.match(new RegExp(`<span class="fact" data-fact="${id}"><span class="fact-value">`, 'g')) || []).length, 1, id);
  }
  assert.ok(!/<aside class="sebi-box"[\s\S]*?fact-mark[\s\S]*?<\/aside>/.test(home), 'hero figures carry no per-figure mark');
  assert.match(home, /<p class="source">All five figures verified <time datetime="2026-11-01">1 Nov 2026<\/time> against <a href="https:\/\/www\.sebi\.gov\.in\/[^"]+"/);
  assert.match(home, /<dl class="counts"/);
  assert.match(home, /<div class="grid grid-4">(<div class="card honesty-card">[\s\S]*?<\/div>){4}<\/div>/, 'four honesty cards');
  assert.match(home, /<a href="\.\/facts\/">verified facts register<\/a>/);
  const remainingPhase2 = PHASE2_SECTIONS.filter((section) => !result.content.guides.some((g) => g.section === section));
  if (remainingPhase2.length) assert.match(home, /<p class="eyebrow"[^>]*>Coming in Phase 2<\/p><div class="grid grid-fill-3"/);
  else assert.doesNotMatch(home, /Coming in Phase 2/, 'the Phase-2 grid disappears after every section has content');
});

test('sitemap lists the public pages with https URLs and dated lastmod; robots points at it', async () => {
  const xml = await readFile(path.join(out, 'sitemap.xml'), 'utf8');
  const locs = xml.match(/<loc>[^<]+<\/loc>/g) || [];
  assert.equal(locs.length, result.pages - 1); // every emitted HTML file except 404.html
  assert.equal(locs.length, pages.length - 1);
  for (const l of locs) {
    assert.ok(l.includes(`<loc>${SITE.liveUrl}`), l);
    assert.ok(!l.includes('index.html'), l);
  }
  assert.ok(!xml.includes('404.html'));
  const entries = xml.match(/<url><loc>[^<]+<\/loc><lastmod>\d{4}-\d{2}-\d{2}<\/lastmod><\/url>/g) || [];
  assert.equal(entries.length, locs.length, 'every <url> has a dated lastmod');
  // every emitted page (except 404) is listed under its canonical URL
  for (const { file } of pages) if (file !== '404.html') assert.ok(xml.includes(`<loc>${SITE.liveUrl}${file.replace(/index\.html$/, '')}</loc>`), `sitemap misses ${file}`);
  const robots = await readFile(path.join(out, 'robots.txt'), 'utf8');
  assert.ok(robots.includes(`Sitemap: ${SITE.liveUrl}sitemap.xml`));
});

test('library CSV has the header row with every brief field and one row per entry', async () => {
  const csv = await readFile(path.join(out, 'data', 'library.csv'), 'utf8');
  assert.equal(csv.split('\n')[0], 'id,kind,title,by,type,cost,price,currency,price_seen,links,year,level,fits,hours,pages,why,caveats');
  const counts = JSON.parse(await readFile(path.join(out, 'data', 'counts.json'), 'utf8'));
  // Data rows = lines that start a record (a quoted field may span lines, so count the leading "<id>,course|book," markers).
  const records = (csv.match(/^[a-z0-9-]+,(course|book),/gm) || []).length;
  assert.equal(records, counts.courses + counts.books);
});

test('learn/ renders the design §6.10 page: hero card figures (M5), toolbar defaults (N3), ranked rows with filter data, path anchors, link-health footer', async () => {
  const html = pages.find((x) => x.file === 'learn/index.html').html;
  const counts = JSON.parse(await readFile(path.join(out, 'data', 'counts.json'), 'utf8'));
  const figure = (k) => new RegExp(`<dd class="num" data-summary="${k}">([^<]*)</dd>`).exec(html)?.[1];
  const rows = [...html.matchAll(/<tr id="([^"]+)" data-cost="(free|paid)" data-level="(beginner|intermediate|advanced)" data-type="([^"]+)" data-fits="([^"]*)" data-rank="([^"]*)"( data-forthcoming="true")?>([\s\S]*?)<\/tr>/g)];
  const free = rows.filter((m) => m[2] === 'free').length;
  assert.equal(rows.length, counts.courses + counts.books, 'one row per library entry');
  assert.equal(figure('courses'), String(counts.courses));
  assert.equal(figure('books'), String(counts.books));
  assert.equal(figure('free'), String(free));
  assert.match(html, /<div class="learn-hero">\s*<div><p class="eyebrow">[^<]*<\/p><h1>/, 'two-column hero: text left');
  assert.match(html, /<aside class="lib-summary" aria-labelledby="lib-summary-title" data-lib-summary>/, 'summary card right');
  // Link health: the committed report drives the fourth figure and the footer; without it the page says so and the test warns.
  const healthFile = path.join(root, 'content', 'data', 'library', 'health.json');
  if (existsSync(healthFile)) {
    const health = JSON.parse(await readFile(healthFile, 'utf8'));
    assert.equal(figure('dead'), String(health.dead.length));
    assert.ok(html.includes(`dead links of <span class="num">${health.urls}</span> checked`), 'checked count beside the dead figure');
    assert.match(html, new RegExp(`<p class="small muted lib-checked">How we checked: every link was fetched on <time datetime="${health.checked}">`));
    assert.equal(health.dead.length, 0, 'the committed link-health report has no dead link');
  } else {
    console.warn('warning: content/data/library/health.json missing — learn/ shows "links checked: not yet"; run scripts/linkcheck.py');
    assert.equal(figure('dead'), '—');
    assert.ok(html.includes('links checked: not yet'));
  }
  if (!rows.length) return; // the empty content set renders the empty strings
  // Every row links out, carries its type in the by-line, its fit tags and a rank per fit (forthcoming rows have none and sit last).
  const fits = new Set(['intraday', 'options', 'algo', 'India investing', 'US/global investing', 'risk & psychology', 'tax & rules']);
  for (const m of rows) {
    assert.ok(/<a href="https?:\/\/[^"]+" rel="noopener noreferrer" target="_blank">/.test(m[8]), `${m[1]}: row without a link`);
    assert.ok(m[5].split('|').every((f) => fits.has(f.replace(/&amp;/g, '&'))), `${m[1]}: fits ${m[5]}`);
    if (m[7]) assert.equal(m[6], '', `${m[1]}: forthcoming rows carry no rank`);
    else assert.deepEqual(m[6].split('|').map((p) => p.slice(0, p.lastIndexOf(':'))).sort(), m[5].split('|').sort(), `${m[1]}: one rank per fit`);
    assert.ok(/<td class="c-title">/.test(m[8]) && /<td class="c-type" data-label="Type">/.test(m[8]) && /<td class="c-cost" data-label="Cost">/.test(m[8]) && /<td class="num c-hours" data-label="(Hours|Pages)">/.test(m[8]) && /<td class="c-why" data-label="Why it is here">/.test(m[8]) && /<td class="links c-links" data-label="Links">/.test(m[8]), `${m[1]}: card captions`);
  }
  for (const table of ['courses', 'books']) {
    const body = new RegExp(`<table class="lib-table" id="${table}-table">[\\s\\S]*?</table>`).exec(html)[0];
    const flags = [...body.matchAll(/<tr id="[^"]+"[^>]*?( data-forthcoming="true")?>/g)].map((m) => Boolean(m[1]));
    assert.deepEqual(flags, [...flags].sort(), `${table}: forthcoming rows sort last`);
    const costs = [...body.matchAll(/<tr id="[^"]+" data-cost="(free|paid)"[^>]*?>/g)].filter((m) => !m[0].includes('data-forthcoming')).map((m) => m[1]);
    assert.deepEqual(costs, [...costs].sort((a, b) => (a === 'paid') - (b === 'paid')), `${table}: free rows before paid rows`);
  }
  // Toolbar: Cost chips All ✓ / Free / Paid with counts, seven Fit chips none pressed, Level and Type selects, text filter, CSV.
  assert.match(html, new RegExp(`<button class="chip" type="button" data-cost="all" aria-pressed="true">All <span class="count num">${rows.length}</span></button><button class="chip" type="button" data-cost="free" aria-pressed="false">Free <span class="count num">${free}</span></button><button class="chip" type="button" data-cost="paid" aria-pressed="false">Paid <span class="count num">${rows.length - free}</span></button>`));
  const fitChips = [...html.matchAll(/<button class="chip" type="button" data-fit="([^"]+)" aria-pressed="(true|false)">[^<]*<span class="count num">(\d+)<\/span>/g)];
  assert.equal(fitChips.length, 7);
  for (const m of fitChips) {
    assert.equal(m[2], 'false', `${m[1]} pressed on load`);
    assert.equal(Number(m[3]), rows.filter((r) => r[5].split('|').includes(m[1])).length, `${m[1]} count`);
  }
  assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1, 'only All is pressed');
  assert.match(html, /<select class="input" aria-label="Level" data-lib-level><option value="">Any level<\/option>/);
  assert.match(html, /<select class="input" aria-label="Type" data-lib-type><option value="">Any type<\/option>/);
  assert.match(html, /<input class="input" type="search" id="lib-filter" maxlength="80"/);
  assert.match(html, new RegExp(`<span class="lib-count" data-lib-count>Showing <b class="num">${rows.length}</b> of <b class="num">${rows.length}</b> · <span data-lib-sort>free first, then title`));
  assert.equal((html.match(/href="\.\.\/data\/library\.csv" download/g) || []).length, 2, 'CSV linked from the hero card and the toolbar');
  // Path: intro from path.json (M4), three cards with hours per week, every step anchor resolves to a row id.
  const pathHtml = /<section id="path"[\s\S]*?<\/section>/.exec(html)[0];
  assert.match(pathHtml, /<h2 id="path-title">[^<]+<\/h2><\/div><p>Our editorial judgement, not advice/);
  assert.equal((pathHtml.match(/<div class="card path-card">/g) || []).length, 3);
  assert.equal((pathHtml.match(/<p class="hours"><b class="num">\d+<\/b> h\/week<\/p>/g) || []).length, 3);
  const ids = new Set(rows.map((m) => m[1]));
  const anchors = [...pathHtml.matchAll(/<li><a href="#([^"]+)">/g)].map((m) => m[1]);
  assert.ok(anchors.length >= 20 && anchors.every((a) => ids.has(a)), `unresolved path anchors: ${anchors.filter((a) => !ids.has(a)).join(', ')}`);
  // Prices render as shown with the date seen; no currency code appended (FEAT-015 finding 1).
  assert.match(html, /<span class="tag tag-paid">Paid<\/span> <span class="price">₹1,500 \+ taxes<\/span> <span class="muted small seen">seen <time datetime="2026-11-01">1 Nov 2026<\/time><\/span>/);
  assert.ok(!/<span class="price">[^<]*<\/span> INR/.test(html));
  assert.ok(!/library-table/.test(html), 'the stylesheet class is lib-table');
  assert.match(/<nav class="site-nav"[^>]*>([\s\S]*?)<\/nav>/.exec(html)[1], /learn\/" class="nav-learn" aria-current="page"/);
});

test('stats/ (FEAT-017) builds from content/data/stats.json only: dated lede, ≥ 2 tables with every figure in td.num, the historical label on each, no NaN, a search entry', async () => {
  const hasData = existsSync(path.join(root, 'content', 'data', 'stats.json'));
  assert.equal(relFiles.has('stats/index.html'), hasData, 'the page exists exactly when stats.json does');
  const search = JSON.parse(await readFile(path.join(out, 'data', 'search.json'), 'utf8'));
  assert.equal(search.some((d) => d.url === 'stats/'), hasData);
  assert.ok(!/stats\//.test(await readFile(path.join(out, 'sitemap.xml'), 'utf8')) === !hasData);
  if (!hasData) return;
  const st = JSON.parse(await readFile(path.join(root, 'content', 'data', 'stats.json'), 'utf8'));
  const html = pages.find((p) => p.file === 'stats/index.html').html;
  const main = /<main id="main">([\s\S]*?)<\/main>/.exec(html)[1];
  const tables = main.match(/<table class="stats-table"/g) || [];
  assert.ok(tables.length >= 2, `tables: ${tables.length}`);
  assert.equal((main.match(/<span class="group-note">Historical, not a forecast<\/span>/g) || []).length, tables.length + (st.vix ? 0 : 1), 'one label per table');
  assert.ok(!/NaN|undefined|null|Infinity/.test(main), 'no NaN/undefined/null/Infinity in the page');
  assert.ok(!/<td>/.test(main.replace(/<tfoot>[\s\S]*?<\/tfoot>/g, '')), 'every body figure sits in td.num');
  assert.match(main, new RegExp(`<time datetime="${st.fetched}">`), 'the fetch date is shown');
  assert.match(main, new RegExp(`<time datetime="${st.from}">[\\s\\S]*<time datetime="${st.to}">`), 'the data window is shown');
  assert.match(main, /href="https:\/\/query1\.finance\.yahoo\.com\/v8\/finance\/chart\/%5ENSEI\?range=10y&amp;interval=1d"/, 'links the Yahoo endpoint');
  assert.match(main, /<h2 id="method">How this was computed<\/h2>/);
  assert.match(main, /<p class="disclaimer">/);
  assert.match(html, /"@type":"WebPage"/);
  assert.equal(st.gaps.buckets.length, 5);
  assert.equal(st.ranges.weekdays.length, 5);
  for (const w of st.ranges.weekdays) assert.ok(w.p25 <= w.p50 && w.p50 <= w.p75 && w.p75 <= w.p90, `${w.weekday} percentiles are ordered`);
});

test.after(async () => { await rm(out, { recursive: true, force: true }); });
