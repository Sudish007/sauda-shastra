/* Tool pages (design §6.9): results recompute on every input (no Calculate button); two worked-example chips load pack L's
   inputs and a manual edit releases them; one "Reset to example n" button; validation marks the field (aria-invalid +
   .hint.error) and the result shows "—" instead of a partial figure or NaN; the only live region is the visually-hidden
   status line, updated 400 ms after the last keystroke. Strings, rates and examples arrive from the page's <template>
   JSON (no literal UI text here); the maths and the result markup are the same modules the build and the tests use. */
import { run } from './tools/calc.js';
import { makeCtx, resultHead, resultBody, announce, fill, esc } from './tools/view.js';

const form = document.querySelector('form.tool-form');
if (form) init(form);

function init(form) {
  const json = (id) => { try { return JSON.parse(document.getElementById(id).content.textContent); } catch { return null; } };
  const strings = json('tool-strings') || { C: {}, T: {}, vars: {} };
  const rates = json('tool-rates') || {};
  const examples = json('tool-examples') || [];
  const C = strings.C || {};
  const T = strings.T || {};
  const ctx = makeCtx({ T, C, rates, vars: strings.vars || {} });
  const toolId = form.dataset.tool;
  const head = document.querySelector('[data-result-head]');
  const body = document.querySelector('[data-result-body]');
  const status = document.getElementById('tool-announce');
  const formula = document.querySelector('pre.formula');
  const chips = [...form.querySelectorAll('.chip[data-example]')];
  const resetBtn = form.querySelector('[data-action="reset-example"]');
  const formStatus = document.getElementById('form-status');
  const fields = [...form.querySelectorAll('[data-field]')];
  const fmtBound = (n) => Number(n).toLocaleString('en-IN', { maximumFractionDigits: 4 });
  const numSpan = (n) => `<span class="num">${Number(n)}</span>`;
  let lastLoaded = Number(form.dataset.example) || 1;
  let statusTimer = 0;

  const controlOf = (el) => el.querySelector('input:not([type=radio]):not([type=checkbox]), select');
  function valueOf(el) {
    if (el.querySelector('input[type=radio]')) { const c = el.querySelector('input[type=radio]:checked'); return c ? c.value : ''; }
    const cb = el.querySelector('input[type=checkbox]');
    if (cb) return cb.checked;
    const ctl = controlOf(el);
    return ctl ? ctl.value : '';
  }
  const values = () => Object.fromEntries(fields.map((el) => [el.dataset.field, valueOf(el)]));
  function isShown(el, v) {
    if (!el.dataset.show) return true;
    let rules; try { rules = JSON.parse(el.dataset.show); } catch { return true; }
    return Object.entries(rules).every(([k, allowed]) => allowed.includes(String(v[k] === undefined || v[k] === '' ? 'false' : v[k])));
  }
  function applyVisibility() {
    const v = values();
    for (const el of fields) el.hidden = !isShown(el, v);
    return v;
  }
  function applySteps(v) {
    const fo = v.segment === 'futures' || v.segment === 'options';
    for (const input of form.querySelectorAll('input[data-step-equity]')) input.step = fo ? input.dataset.stepFo : input.dataset.stepEquity;
  }

  /* ---------- validation (design §8/§9): mark the field, say what is wrong, never render a partial result ---------- */
  function hintOf(el) {
    let hint = el.querySelector('.hint');
    if (!hint) { hint = document.createElement('span'); hint.className = 'hint'; hint.dataset.created = 'true'; hint.hidden = true; el.appendChild(hint); }
    if (hint.dataset.original === undefined) hint.dataset.original = hint.innerHTML;
    return hint;
  }
  function markError(key, message) {
    const el = fields.find((f) => f.dataset.field === key);
    if (!el) return;
    const input = controlOf(el);
    if (input) input.setAttribute('aria-invalid', 'true');
    const hint = hintOf(el);
    hint.hidden = false;
    hint.classList.add('error');
    hint.textContent = message;
  }
  function clearErrors() {
    for (const el of fields) {
      const input = controlOf(el);
      if (input) input.removeAttribute('aria-invalid');
      const hint = el.querySelector('.hint');
      if (hint && hint.classList.contains('error')) { hint.classList.remove('error'); hint.innerHTML = hint.dataset.original || ''; if (hint.dataset.created) hint.hidden = true; }
    }
  }
  function validate() {
    let ok = true;
    for (const el of fields) {
      if (el.hidden) continue;
      const input = controlOf(el);
      if (!input || input.type !== 'number') continue;
      const raw = input.value.trim();
      const optional = input.dataset.optional === 'true';
      if (raw === '') { if (!optional) { markError(el.dataset.field, C.required); ok = false; } continue; }
      const n = Number(raw);
      const min = input.min === '' ? -Infinity : Number(input.min);
      const max = input.max === '' ? Infinity : Number(input.max);
      if (!Number.isFinite(n)) { markError(el.dataset.field, C.required); ok = false; continue; }
      if (n < min || n > max) { markError(el.dataset.field, fill(C.rangeHint, { min: fmtBound(min), max: fmtBound(max) })); ok = false; continue; }
      if (input.step === '1' && !Number.isInteger(n)) { markError(el.dataset.field, C.integerHint); ok = false; }
    }
    return ok;
  }

  /* ---------- render ---------- */
  function setStatus(text) {
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { if (status) status.textContent = text; }, 400);
  }
  function render(result, v) {
    const mode = v.mode;
    if (head) head.innerHTML = resultHead(result, ctx, { mode });
    if (body) body.innerHTML = resultBody(result, ctx);
    if (formula) formula.textContent = result.formulaText || '';
    setStatus(announce(result, ctx, { mode }));
  }
  function showEmpty(message, v) {
    const title = v.mode === 'iv' && T.resultTitleIv ? T.resultTitleIv : T.resultTitle || C.resultTitle;
    if (head) head.innerHTML = `<h2 id="res-title">${ctx.html(title)}</h2><p class="result-big num"><span data-result="empty">—</span></p>`;
    if (body) body.innerHTML = `<p class="note small"><span aria-hidden="true">⚠</span> ${esc(message)}</p>`;
    setStatus(message);
  }
  function compute() {
    const v = applyVisibility();
    applySteps(v);
    clearErrors();
    if (!validate()) { showEmpty(C.fixFields, v); return; }
    const inputs = {};
    for (const el of fields) if (!el.hidden) inputs[el.dataset.field] = v[el.dataset.field];
    try {
      render(run(toolId, inputs, rates), v);
    } catch (e) {
      if (e instanceof RangeError && e.field) {
        const el = fields.find((f) => f.dataset.field === e.field);
        const input = el ? controlOf(el) : null;
        const min = input && input.min !== '' ? Number(input.min) : e.min;
        const max = input && input.max !== '' ? Number(input.max) : e.max;
        markError(e.field, Number.isFinite(min) && Number.isFinite(max) ? fill(C.rangeHint, { min: fmtBound(min), max: fmtBound(max) }) : C.required);
      }
      showEmpty(C.fixFields, v);
    }
  }

  /* ---------- worked examples ---------- */
  function setPressed(n) {
    form.dataset.example = n ? String(n) : '';
    for (const chip of chips) chip.setAttribute('aria-pressed', String(Number(chip.dataset.example) === n));
  }
  function loadExample(n) {
    const ex = examples.find((e) => e.n === n);
    if (!ex) return;
    for (const el of fields) {
      const key = el.dataset.field;
      const val = ex.inputs[key];
      const radios = [...el.querySelectorAll('input[type=radio]')];
      if (radios.length) { for (const r of radios) r.checked = r.value === String(val); continue; }
      const cb = el.querySelector('input[type=checkbox]');
      if (cb) { cb.checked = val === true || val === 'true'; continue; }
      const ctl = controlOf(el);
      if (ctl) ctl.value = val === undefined || val === null ? '' : String(val);
    }
    lastLoaded = n;
    setPressed(n);
    if (resetBtn) resetBtn.innerHTML = fill(esc(C.reset), { n: numSpan(n) });
    if (formStatus) formStatus.innerHTML = fill(esc(C.exampleLoaded), { n: numSpan(n) });
    compute();
  }
  function onEdit() {
    setPressed(0);
    if (formStatus) formStatus.innerHTML = fill(esc(C.edited), { n: numSpan(lastLoaded) });
    compute();
  }

  form.addEventListener('submit', (e) => e.preventDefault());
  form.addEventListener('input', onEdit);
  for (const chip of chips) chip.addEventListener('click', () => loadExample(Number(chip.dataset.example)));
  resetBtn?.addEventListener('click', () => loadExample(lastLoaded));
  if (examples.length) loadExample(lastLoaded); else compute();
}
