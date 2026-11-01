// Build the static site into an output directory.
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadContent } from './content.js';
import { SITE } from './config.js';
import { STRINGS as S } from './strings.js';
import { plainInline } from './markdown.js';
import * as pages from './pages.js';

async function write(outDir, relPath, body) {
  const file = path.join(outDir, relPath);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, body);
}

/** Search index: Guide, Section, Playbook, Tool, Term, Course, Book, Page, Fact (facts/#fact-ID). Utility pages come first. */
export function buildSearchIndex(c) {
  const docs = [];
  const plain = (t) => plainInline(t, { facts: c.byFact });
  for (const g of c.guides) {
    docs.push({ kind: S.labels.guide, title: g.title, url: `guides/${g.slug}/`, text: g.summary, keywords: [g.section, g.level, ...g.topics].join(' ') });
    for (const h of g.headings.filter((x) => x.depth === 2)) docs.push({ kind: S.labels.section, title: `${g.title} › ${h.text}`, url: `guides/${g.slug}/#${h.id}`, text: '', keywords: g.section });
  }
  for (const p of c.playbooks) {
    docs.push({ kind: S.labels.playbook, title: p.title, url: `playbooks/${p.slug}/`, text: p.summary, keywords: [p.evidence, p.level, ...p.instruments, ...p.topics].join(' ') });
  }
  for (const t of pages.TOOLS) docs.push({ kind: S.labels.tool, title: t.title, url: `tools/${t.id}/`, text: t.summary || '', keywords: 'calculator tool' });
  docs.push({ kind: S.labels.page, title: S.tools.indexTitle, url: 'tools/', text: S.tools.indexLede, keywords: 'calculators tools charges position size' });
  docs.push({ kind: S.labels.page, title: S.learn.title, url: 'learn/', text: S.learn.lede, keywords: 'courses books library learn' });
  docs.push({ kind: S.labels.page, title: `${S.calendar.eyebrow} — ${S.calendar.title}`, url: 'calendar/', text: S.calendar.lede, keywords: 'expiry holiday rbi fomc calendar' });
  docs.push({ kind: S.labels.page, title: S.changelog.title, url: 'changelog/', text: S.changelog.lede, keywords: 'changes rules sebi circular' });
  docs.push({ kind: S.labels.page, title: S.resources.title, url: 'resources/', text: S.resources.lede, keywords: 'data api broker community' });
  docs.push({ kind: S.labels.page, title: S.facts.eyebrow, url: 'facts/', text: S.facts.lede, keywords: 'facts register rates verified' });
  docs.push({ kind: S.labels.page, title: c.pages?.about?.title || S.about.eyebrow, url: 'about/', text: S.footer.disclaimer, keywords: 'about disclaimer licence' });
  for (const t of c.glossary) docs.push({ kind: S.labels.term, title: t.term, url: `glossary/#${pages.termId(t.term)}`, text: plain(t.def).slice(0, 160), keywords: '' });
  for (const e of c.library.courses) docs.push({ kind: S.labels.course, title: e.title, url: `learn/#${e.id}`, text: `${e.by} · ${e.cost}`, keywords: e.fits.join(' ') });
  for (const e of c.library.books) docs.push({ kind: S.labels.book, title: e.title, url: `learn/#${e.id}`, text: `${e.by} · ${e.cost}`, keywords: e.fits.join(' ') });
  for (const f of c.facts) docs.push({ kind: S.labels.fact, title: f.label, url: `facts/#fact-${f.id}`, text: `${f.value} · ${f.label}`, keywords: f.id.replace(/-/g, ' ') });
  return docs;
}

export async function buildSite({ root, outDir, basePath = SITE.basePath }) {
  const contentDir = path.join(root, 'content');
  const siteDir = path.join(root, 'site');
  const c = await loadContent(contentDir);

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await cp(siteDir, outDir, { recursive: true });
  await mkdir(path.join(outDir, 'data'), { recursive: true });

  const written = [];
  const emit = async (relPath, html) => { await write(outDir, relPath, html); written.push(relPath); };

  await emit('index.html', pages.homePage(c));
  await emit('guides/index.html', pages.guidesIndexPage(c));
  for (const g of c.guides) await emit(`guides/${g.slug}/index.html`, pages.guidePage(g, c));
  await emit('playbooks/index.html', pages.playbooksIndexPage(c));
  for (const p of c.playbooks) await emit(`playbooks/${p.slug}/index.html`, pages.playbookPage(p, c));
  await emit('tools/index.html', pages.toolsIndexPage(c));
  await emit('learn/index.html', pages.learnPage(c));
  await emit('glossary/index.html', pages.glossaryPage(c));
  await emit('calendar/index.html', pages.calendarPage(c));
  await emit('changelog/index.html', pages.changelogPage(c));
  await emit('resources/index.html', pages.resourcesPage(c));
  await emit('facts/index.html', pages.factsPage(c));
  await emit('about/index.html', pages.aboutPage(c));
  await emit('sources/index.html', pages.sourcesPage(c));
  // 404 pages are served for any missing path, so relative URLs would break: pin the base.
  await emit('404.html', pages.notFoundPage().replace('<head>', `<head>\n<base href="${basePath}">`));

  await write(outDir, 'data/search.json', JSON.stringify(buildSearchIndex(c)));
  await write(outDir, 'data/counts.json', JSON.stringify({ ...pages.counts(c), reviewed: c.reviewed, builtAt: new Date().toISOString() }, null, 2));
  await write(outDir, 'data/facts.json', JSON.stringify(c.facts, null, 2));
  await write(outDir, 'data/library.csv', pages.libraryCsv(c));
  await write(outDir, '.nojekyll', '');
  const origin = new URL(SITE.liveUrl).origin;
  await write(outDir, 'robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}${basePath}sitemap.xml\n`);
  const lastmod = (w) => {
    const m = /^(guides|playbooks)\/([^/]+)\//.exec(w);
    const a = m ? (m[1] === 'guides' ? c.byGuide[m[2]] : c.byPlaybook[m[2]]) : null;
    return a?.updated || c.reviewed;
  };
  const urls = written.filter((w) => w !== '404.html').map((w) => ({ loc: `${origin}${basePath}${w.replace(/index\.html$/, '')}`, lastmod: lastmod(w) }));
  await write(outDir, 'sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`);

  return { pages: written.length, ...pages.counts(c), content: c };
}
