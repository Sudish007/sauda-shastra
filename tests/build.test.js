import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite } from '../src/build/site.js';
import { SITE } from '../src/build/config.js';
import { STRINGS } from '../src/build/strings.js';

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
  const code = ['src/build/site.js', 'src/build/pages.js', 'src/build/templates.js', 'src/build/content.js', 'src/build/markdown.js', 'src/build/strings.js', 'site/app.js', 'site/styles.css', 'scripts/build.mjs', 'scripts/serve.mjs', 'scripts/shots.py', 'scripts/e2e.py', '.github/workflows/pages.yml'];
  for (const f of code) {
    const text = await readFile(path.join(root, f), 'utf8');
    assert.ok(!/vyapaar|shuruaat/i.test(text), `${f} still mentions the reference site`);
    assert.ok(!text.includes(SITE.slug) && !text.includes(SITE.storagePrefix), `${f} hard-codes the slug or storage prefix`);
    if (!f.endsWith('strings.js')) assert.ok(!text.includes(SITE.name), `${f} hard-codes the site name`);
  }
});

test('builds every page and the data artefacts (empty content set allowed)', () => {
  assert.ok(result.pages >= 11, `pages: ${result.pages}`); // 10 index/utility pages + 404 on the empty set
  for (const must of ['index.html', 'guides/index.html', 'playbooks/index.html', 'learn/index.html', 'glossary/index.html', 'calendar/index.html', 'changelog/index.html', 'resources/index.html', 'about/index.html', 'sources/index.html', '404.html', 'styles.css', 'app.js', 'favicon.svg', 'fonts/fonts.css', 'fonts/inter-normal-latin.woff2', 'fonts/newsreader-normal-latin.woff2', 'data/search.json', 'data/counts.json', 'data/facts.json', 'data/library.csv', 'sitemap.xml', 'robots.txt', '.nojekyll']) {
    assert.ok(relFiles.has(must), `missing ${must}`);
  }
});

test('every page has exactly one h1, a title, a description, SEO meta, the shared shell and the binding footer disclaimer', () => {
  for (const { file, html } of pages) {
    const h1s = html.match(/<h1[\s>]/g) || [];
    assert.equal(h1s.length, 1, `${file}: ${h1s.length} h1`);
    assert.match(html, /<title>[^<]{5,}<\/title>/, file);
    assert.match(html, /<meta name="description" content="[^"]{20,}"/, file);
    assert.match(html, new RegExp(`<link rel="canonical" href="${SITE.liveUrl.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}`), file);
    assert.match(html, /<meta property="og:title"/, file);
    assert.match(html, /<meta name="twitter:card"/, file);
    assert.match(html, /<script type="application\/ld\+json">/, file);
    assert.match(html, /<nav class="site-nav"/, file);
    assert.match(html, /app\.js" defer>/, file);
    assert.match(html, new RegExp(`<html lang="${SITE.lang}">`), file);
    assert.ok(html.includes(STRINGS.footer.disclaimer.replace(/'/g, '&#39;')) || html.includes(STRINGS.footer.disclaimer), `${file}: footer disclaimer`);
    assert.match(html, /data-action="theme" data-mode="light"/, `${file}: theme control state`);
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

test('404 page pins its base path so relative URLs survive any missing path', () => {
  const p = pages.find((x) => x.file === '404.html');
  assert.match(p.html, new RegExp(`<base href="${SITE.basePath}">`));
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
  for (const u of ['learn/', 'calendar/', 'changelog/', 'resources/', 'about/']) assert.ok(urls.has(u), u);
});

test('sitemap lists the public pages with https URLs and dated lastmod; robots points at it', async () => {
  const xml = await readFile(path.join(out, 'sitemap.xml'), 'utf8');
  const locs = xml.match(/<loc>[^<]+<\/loc>/g) || [];
  assert.equal(locs.length, result.pages - 1);
  for (const l of locs) assert.ok(l.includes(`<loc>${SITE.liveUrl}`), l);
  assert.ok(!xml.includes('404.html'));
  assert.match(xml, /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
  const robots = await readFile(path.join(out, 'robots.txt'), 'utf8');
  assert.ok(robots.includes(`Sitemap: ${SITE.liveUrl}sitemap.xml`));
});

test('library CSV has the header row with every brief field', async () => {
  const csv = await readFile(path.join(out, 'data', 'library.csv'), 'utf8');
  assert.equal(csv.split('\n')[0], 'id,kind,title,by,type,cost,price,currency,price_seen,links,year,level,fits,hours,pages,why,caveats');
});

test.after(async () => { await rm(out, { recursive: true, force: true }); });
