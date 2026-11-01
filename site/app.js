/* Client: three-state theme, menu, search, TOC scrollspy, reading progress, facts-register filter. No frameworks, no UI
   text literals (strings come from <template id="ui-strings">), no identity literals (storage prefix from body[data-store]).
   The current nav item is marked at build time (aria-current from the page's layout call), never inferred here. */
(() => {
  'use strict';
  const root = document.body.dataset.root || './';
  const prefix = document.body.dataset.store || 'site';
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const T = (() => { try { return JSON.parse($('#ui-strings').content.textContent); } catch { return {}; } })();
  const fill = (tpl, vars) => String(tpl || '').replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  const store = {
    get(k, d) { try { const v = localStorage.getItem(prefix + ':' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(prefix + ':' + k, JSON.stringify(v)); } catch { /* private mode */ } },
  };

  /* ---------- Theme: light (default) → dark → system → light ---------- */
  const themeBtn = $('[data-action="theme"]');
  const MODES = ['light', 'dark', 'system'];
  const ICON = {
    light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4"/>',
    dark: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    system: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  };
  const THEME_COLOR = T.themeColor || { light: '#f5f6f8', dark: '#121418' };
  const osDark = window.matchMedia('(prefers-color-scheme: dark)');
  function applyTheme(mode) {
    if (!MODES.includes(mode)) mode = 'light';
    const dark = mode === 'dark' || (mode === 'system' && osDark.matches);
    if (dark) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
    if (themeBtn) {
      const label = (T.theme || {})[mode] || mode;
      themeBtn.dataset.mode = mode;
      themeBtn.setAttribute('aria-label', fill(T.themeAria, { mode: label }));
      const span = $('.theme-label', themeBtn); if (span) span.textContent = label;
      const icon = $('.theme-icon', themeBtn); if (icon) icon.innerHTML = ICON[mode];
    }
    const meta = $('meta[name="theme-color"]'); if (meta) meta.content = dark ? THEME_COLOR.dark : THEME_COLOR.light;
  }
  applyTheme(store.get('theme', 'light'));
  themeBtn?.addEventListener('click', () => { const next = MODES[(MODES.indexOf(themeBtn.dataset.mode) + 1) % MODES.length]; store.set('theme', next); applyTheme(next); });
  osDark.addEventListener?.('change', () => { if (store.get('theme', 'light') === 'system') applyTheme('system'); });

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('[data-action="menu"]'); const mobileNav = $('#mobile-nav');
  menuBtn?.addEventListener('click', () => { const open = mobileNav.dataset.open !== 'true'; mobileNav.dataset.open = String(open); menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.setAttribute('aria-label', open ? T.menuClose : T.menuOpen); });

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) { let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); } t.textContent = msg; clearTimeout(toastTimer); toastTimer = setTimeout(() => t.remove(), 2600); }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="copy"]'); if (!btn) return;
    const text = btn.dataset.copy || $(btn.dataset.copyFrom || '')?.textContent || '';
    navigator.clipboard?.writeText(text).then(() => toast(T.copied), () => toast(T.copyFailed));
  });

  /* ---------- Search ---------- */
  const dialog = $('#search-dialog'); const searchInput = $('#search-input'); const results = $('#search-results');
  let index = null;
  async function loadIndex() {
    if (index) return index;
    try { const res = await fetch(root + 'data/search.json'); if (!res.ok) throw new Error(res.status); index = await res.json(); } catch { index = null; }
    return index;
  }
  function score(doc, q) {
    const t = doc.title.toLowerCase(); const words = q.split(/\s+/).filter(Boolean);
    let s = 0;
    for (const w of words) {
      if (t.startsWith(w)) s += 8; else if (t.includes(w)) s += 5;
      if ((doc.text || '').toLowerCase().includes(w)) s += 2;
      if ((doc.keywords || '').toLowerCase().includes(w)) s += 2;
    }
    if (words.length > 1 && t.includes(q)) s += 6;
    if (s && (doc.kind === 'Guide' || doc.kind === 'Playbook' || doc.kind === 'Page')) s += 4; // destinations outrank the facts that mention them
    return s;
  }
  /* Top 12 hits by score, then grouped under a small heading per kind; groups follow the rank of their best hit, so the
     best match overall is always the first link (↑ ↓ walk the links only, the headings are not focusable). */
  function renderResults(q) {
    const query = q.trim().toLowerCase();
    if (!index) { results.innerHTML = `<li class="muted small hint">${esc(T.searchUnavailable)}</li>`; return; }
    if (!query) { results.innerHTML = `<li class="muted small hint">${esc(T.searchHint)}</li>`; return; }
    const hits = index.map((d) => ({ d, s: score(d, query) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 12);
    if (!hits.length) { results.innerHTML = `<li class="muted small hint">${esc(T.searchNone)}</li>`; return; }
    const groups = new Map();
    for (const { d } of hits) { if (!groups.has(d.kind)) groups.set(d.kind, []); groups.get(d.kind).push(d); }
    const item = (d) => `<li><a href="${d.external ? esc(d.url) : root + esc(d.url)}"${d.external ? ' rel="noopener noreferrer" target="_blank"' : ''}><b>${esc(d.title)}</b>${d.text ? `<span>${esc(d.text)}</span>` : ''}</a></li>`;
    results.innerHTML = [...groups].map(([kind, docs]) => `<li class="search-group" role="presentation"><span class="kind">${esc(kind)}</span></li>${docs.map(item).join('')}`).join('');
  }
  async function openSearch() { if (!dialog) return; await loadIndex(); renderResults(searchInput.value); dialog.showModal(); searchInput.focus(); searchInput.select(); }
  $$('[data-action="search"]').forEach((b) => b.addEventListener('click', openSearch));
  searchInput?.addEventListener('input', () => renderResults(searchInput.value));
  dialog?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); dialog.close(); return; } // one Esc closes (search inputs otherwise swallow the first to clear)
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && document.activeElement === searchInput) { e.preventDefault(); return; } // the shortcut key is not a query character
    const links = $$('a', results); const i = links.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); (links[i + 1] || links[0])?.focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); if (i <= 0) searchInput.focus(); else links[i - 1].focus(); }
    if (e.key === 'Enter' && document.activeElement === searchInput && links[0]) { e.preventDefault(); links[0].click(); }
  });
  dialog?.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  document.addEventListener('keydown', (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '');
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !typing) { e.preventDefault(); openSearch(); }
  });

  /* ---------- TOC scrollspy ---------- */
  const tocLinks = $$('.toc a[href^="#"]');
  if (tocLinks.length) {
    const targets = tocLinks.map((a) => document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)))).filter(Boolean);
    const update = () => { const line = window.innerHeight * 0.3; let best = targets[0]; for (const t of targets) { if (t.getBoundingClientRect().top <= line) best = t; } tocLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + best?.id)); };
    let raf = 0;
    window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); }, { passive: true });
    update();
  }

  /* ---------- Reading progress (per article, saved locally) ---------- */
  const article = $('[data-reading]');
  if (article) {
    const key = article.dataset.reading; const progress = store.get('progress', {});
    let raf = 0;
    const save = () => { raf = 0; const h = document.documentElement; const max = h.scrollHeight - h.clientHeight; const pct = max > 0 ? Math.round((h.scrollTop / max) * 100) : 100; if (pct > (progress[key] || 0)) { progress[key] = pct; store.set('progress', progress); } };
    window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(save); }, { passive: true });
  }
  $$('[data-progress-for]').forEach((el) => { const pct = (store.get('progress', {}))[el.dataset.progressFor]; if (pct) el.textContent = `${T.progressRead} ${pct}%`; });

  /* ---------- Facts register: one group chip at a time + text filter on label / id / value ---------- */
  const factsBar = $('[data-facts-filter]');
  if (factsBar) {
    const chips = $$('.chip[data-group]', factsBar); const input = $('#facts-filter'); const count = $('[data-facts-count]');
    const rows = $$('table.facts-table tbody tr[data-group]');
    let group = 'all';
    const apply = () => {
      const q = (input?.value || '').trim().toLowerCase();
      let shown = 0;
      for (const tr of rows) { const ok = (group === 'all' || tr.dataset.group === group) && (!q || (tr.dataset.text || '').includes(q)); tr.hidden = !ok; if (ok) shown++; }
      if (count) count.textContent = fill(T.showing, { x: shown, y: rows.length });
    };
    chips.forEach((ch) => ch.addEventListener('click', () => { group = ch.dataset.group; chips.forEach((x) => x.setAttribute('aria-pressed', String(x === ch))); apply(); }));
    input?.addEventListener('input', apply);
  }
})();
