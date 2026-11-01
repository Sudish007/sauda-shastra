// Numeric readers for register values (content/data/facts.json). Pure ESM, no DOM, no Node APIs: shared by the build,
// `node:test` and the browser (copied to dist/tools/rates.js). The register stores values as display strings
// ("0.15%", "₹307 per crore", "₹10 lakh", "₹1,25,000", "65", "5.50%", "$250,000", "8 tax years"); the calculators
// need numbers, and parsing the one string keeps a single source of truth (no second numeric field to drift).

// First figure in a value: optional currency sign, en-IN or en-US grouped digits, optional decimals.
const FIGURE = /([₹$]?)\s*(-?\d[\d,]*(?:\.\d+)?)/g;
const MULTIPLIER = { lakh: 1e5, crore: 1e7, cr: 1e7 };

/**
 * Parse one figure starting at a regex match. `%` turns the figure into a fraction (0.15% → 0.0015); a directly
 * following "lakh"/"crore" multiplies (₹10 lakh → 1000000); any other trailing words (up to a comma, semicolon or
 * " or ") are returned as `unit` ("per crore", "tax years", "per order"). `raw` is the figure as written ("₹20", "0.03%").
 */
function figureAt(value, m) {
  const text = String(value);
  const after = text.slice(m.index + m[0].length);
  let n = Number(m[2].replace(/,/g, ''));
  let unit = '';
  let raw = m[0].trim();
  const pct = /^\s*%/.exec(after);
  const mult = /^\s*(lakh|crore|cr)\b/i.exec(after);
  if (pct) { n /= 100; raw += '%'; }
  else if (mult) { n *= MULTIPLIER[mult[1].toLowerCase()]; raw += ' ' + mult[1]; }
  else unit = after.split(/,|;|\s+or\s+/)[0].trim(); // "per crore", "tax years", "per order"; '' before an alternative
  return { num: n, unit, raw, currency: m[1] || '' };
}

/** Every figure in a value, in order: "₹20 or 0.03%, whichever is lower" → [{num: 20, raw: '₹20'}, {num: 0.0003, raw: '0.03%'}]. */
export function parts(value) {
  const out = [];
  const text = String(value ?? '');
  for (const m of text.matchAll(FIGURE)) {
    const f = figureAt(text, m);
    out.push({ num: f.num, unit: f.unit, raw: f.raw, currency: f.currency });
  }
  return out;
}

/** The first figure with its unit, or null for word-valued facts ("Tuesday", "Discontinued"). */
export function parse(value) {
  const p = parts(value);
  return p.length ? { num: p[0].num, unit: p[0].unit, raw: p[0].raw, currency: p[0].currency } : null;
}

/** The numeric core of a register value: "0.15%" → 0.0015, "₹307 per crore" → 307, "₹10 lakh" → 1000000, "65" → 65; null when the value holds no figure. */
export function num(value) {
  const p = parse(value);
  return p ? p.num : null;
}

/**
 * A new-regime slab row → { lo, hi, rate }: "up to ₹4,00,000: nil" → { lo: 0, hi: 400000, rate: 0 };
 * "₹4,00,001–₹8,00,000: 5%" → { lo: 400001, hi: 800000, rate: 0.05 }; "above ₹24,00,000: 30%" → { lo: 2400001, hi: Infinity, rate: 0.3 }.
 * Returns null when the string is not a slab.
 */
export function slab(value) {
  const text = String(value ?? '');
  const i = text.lastIndexOf(':');
  if (i < 0) return null;
  const range = text.slice(0, i).trim();
  const rateText = text.slice(i + 1).trim();
  if (!/^(nil|\d[\d,]*(?:\.\d+)?\s*%)$/i.test(rateText)) return null; // the rate is "nil" or a percentage, never a time or a count
  const rate = /^nil$/i.test(rateText) ? 0 : num(rateText);
  const figures = parts(range).filter((p) => p.currency === '₹').map((p) => p.num);
  if (rate === null || !figures.length) return null;
  if (/^up to\b/i.test(range)) return { lo: 0, hi: figures[0], rate };
  if (/^above\b/i.test(range)) return { lo: figures[0] + 1, hi: Infinity, rate };
  if (figures.length >= 2) return { lo: figures[0], hi: figures[1], rate };
  return null;
}

/**
 * Register rows → the rate map the calculators read: { id: { num, value, label, parts } }. Accepts the facts array or
 * the id → fact object; `ids` limits the map to the facts a tool lists (every id must exist).
 */
export function rateMap(facts, ids) {
  const byId = Array.isArray(facts) ? Object.fromEntries(facts.map((f) => [f.id, f])) : facts;
  const map = {};
  for (const id of ids || Object.keys(byId)) {
    const f = byId[id];
    if (!f) throw new Error(`rateMap: fact ${id} is not in the register`);
    map[id] = { num: num(f.value), value: String(f.value), label: f.label, parts: parts(f.value) };
  }
  return map;
}

/** The number behind a rate-map entry; throws when the calculator asks for an id the page did not ship. */
export function rate(rates, id) {
  const r = rates && rates[id];
  if (!r || r.num === null || r.num === undefined || Number.isNaN(r.num)) throw new Error(`rate ${id} missing`);
  return r.num;
}
