// Result markup for the tool pages (design §6.9), shared by the build (Example 1 rendered into the page) and the browser
// (site/tool-ui.js re-renders on every input). Pure string building, no DOM. A context carries the per-tool strings `T`,
// the shared tool strings `C`, the page's rate map `rates` ({ id: { value, … } }) and `vars` — the {placeholder} values
// every fact-dependent string uses, each either { fact: id } (rendered as a plain .fact span) or { html, text }.
// Strings are escaped here, at render time; placeholder HTML and computed values are inserted afterwards.
import { fmt } from './format.js';

export function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
/** `{key}` placeholders from an object; unknown keys stay visible so a missing variable is caught in review. */
export function fill(template, vars) {
  return String(template ?? '').replace(/\{(\w+)\}/g, (_, k) => (vars[k] === undefined ? `{${k}}` : String(vars[k])));
}
/** A register value as a plain .fact span (no mark: the "Rates used" block carries the citation). */
export function factSpan(rates, id) {
  const f = rates && rates[id];
  return f ? `<span class="fact fact-again" data-fact="${esc(id)}"><span class="fact-value">${esc(f.value)}</span></span>` : '';
}

/** Build the render context: `html(tpl, extra)` escapes the template then fills HTML vars; `text(tpl, extra)` fills plain values. */
export function makeCtx({ T = {}, C = {}, rates = {}, vars = {} }) {
  const htmlVars = {}, textVars = {};
  for (const [k, v] of Object.entries(vars)) {
    if (v && v.fact) { htmlVars[k] = factSpan(rates, v.fact); textVars[k] = rates[v.fact] ? rates[v.fact].value : ''; }
    else if (v) { htmlVars[k] = v.html ?? esc(v.text ?? ''); textVars[k] = v.text ?? ''; }
  }
  return {
    T, C, rates,
    html: (tpl, extra = {}) => fill(esc(tpl), { ...htmlVars, ...extra }),
    text: (tpl, extra = {}) => fill(tpl, { ...textVars, ...extra }),
    span: (id) => factSpan(rates, id),
  };
}

const valueOf = (x) => `<span data-result="${esc(x.key)}">${esc(fmt(x.value, x.kind))}</span>`;

/** Variables a sub-line template may use, formatted by convention from the line's extras (all HTML-safe). */
function lineVars(l, ctx) {
  const v = {};
  if (l.rateId) v.rate = ctx.span(l.rateId);
  if (l.thresholdId) v.threshold = ctx.span(l.thresholdId);
  if (l.basis !== undefined) v.basis = esc(fmt(l.basis, 'inr'));
  if (l.buy !== undefined) v.buy = esc(fmt(l.buy, 'inr'));
  if (l.sell !== undefined) v.sell = esc(fmt(l.sell, 'inr'));
  if (l.dividends !== undefined) v.dividends = esc(fmt(l.dividends, 'inr'));
  if (l.N !== undefined) v.N = esc(fmt(l.N, 'int'));
  if (l.leverage !== undefined) v.leverage = esc(fmt(l.leverage, 'x'));
  if (l.fx !== undefined) v.fx = esc(fmt(l.fx, 'num2'));
  return v;
}

function subKeyOf(l) {
  if (l.subKey) return l.subKey;
  if (l.key === 'risk' && l.note === 'capped') return 'riskCapped';
  if (l.key === 'rebate' && l.relief) return 'rebateRelief';
  if ((l.key === 'call' || l.key === 'put') && l.given !== undefined) return l.given ? `${l.key}Given` : `${l.key}Parity`;
  return l.key;
}

function lineHtml(l, ctx) {
  const { T } = ctx;
  const vars = lineVars(l, ctx);
  const label = ctx.html(T.lines?.[l.key] ?? l.key, vars);
  const tpl = T.subs?.[subKeyOf(l)];
  const sub = tpl ? `<small>${ctx.html(tpl, vars)}</small>` : '';
  return `<li><span>${label}${sub}</span><span class="num">${valueOf(l)}</span></li>`;
}

function titleOf(ctx, mode) {
  const { T, C } = ctx;
  return mode === 'iv' && T.resultTitleIv ? T.resultTitleIv : T.resultTitle || C.resultTitle;
}

/** The headline block: h2 title, the big figure (with its unit) and the sub-line. */
export function resultHead(result, ctx, { mode } = {}) {
  const { T } = ctx;
  const big = result.big;
  const unit = big.unitKey && T.units?.[big.unitKey] ? ` <small class="unit">${ctx.html(T.units[big.unitKey])}</small>` : '';
  const subs = (result.sub || []).map((s) => {
    const tpl = T.resultSub?.[s.key];
    if (!tpl) return '';
    const value = s.kind === 'text' ? (T.fields?.type?.options?.[s.value] ?? s.value) : fmt(s.value, s.kind);
    return ctx.html(tpl, { value: esc(value) });
  }).filter(Boolean);
  return `<h2 id="res-title">${ctx.html(titleOf(ctx, mode))}</h2><p class="result-big num">${valueOf(big)}${unit}</p>${subs.length ? `<p class="result-sub">${subs.join(' · ')}</p>` : ''}`;
}

/** The body: the lines (with the total row), any lines after the total, the KPI cells and the warnings. */
export function resultBody(result, ctx) {
  const { T, C } = ctx;
  const lines = result.lines.map((l) => lineHtml(l, ctx));
  if (result.total !== null && result.total !== undefined) lines.push(`<li class="total"><span>${ctx.html(T.lines?.total || C.total)}</span><span class="num">${valueOf({ key: 'total', value: result.total, kind: 'inr' })}</span></li>`);
  const after = (result.after || []).map((l) => lineHtml(l, ctx));
  const kpis = result.kpis.map((k) => {
    const unit = k.unitKey && T.units?.[k.unitKey] ? ` <small>${ctx.html(T.units[k.unitKey])}</small>` : '';
    const val = k.delta ? `<span class="delta ${k.delta} num">${valueOf(k)}</span>` : `<span class="num">${valueOf(k)}</span>`;
    return `<div><dt>${ctx.html(T.kpis?.[k.key] ?? k.key)}</dt><dd>${val}${unit}</dd></div>`;
  });
  const warnings = (result.warnings || []).map((w) => {
    const vars = {};
    for (const [k, id] of Object.entries(w.vars || {})) vars[k] = ctx.span(id);
    return `<p class="note small"><span aria-hidden="true">⚠</span> ${ctx.html(T.warnings?.[w.key] ?? C[w.key] ?? w.key, vars)}</p>`;
  });
  return `${lines.length ? `<ul class="lines">${lines.join('')}</ul>` : ''}${after.length ? `<ul class="lines lines-after">${after.join('')}</ul>` : ''}${kpis.length ? `<dl class="kpis">${kpis.join('')}</dl>` : ''}${warnings.join('')}`;
}

/** Text for the visually-hidden status line: "Total charges: ₹82.97". */
export function announce(result, ctx, { mode } = {}) {
  return ctx.text(ctx.C.announce, { label: ctx.text(titleOf(ctx, mode)), value: fmt(result.big.value, result.big.kind) });
}

/** Every rendered result key → formatted text (what the e2e compares against the worked examples). */
export function resultValues(result) {
  const out = {};
  out[result.big.key] = fmt(result.big.value, result.big.kind);
  for (const l of [...result.lines, ...(result.after || [])]) out[l.key] = fmt(l.value, l.kind);
  if (result.total !== null && result.total !== undefined) out.total = fmt(result.total, 'inr');
  for (const k of result.kpis) out[k.key] = fmt(k.value, k.kind);
  return out;
}
