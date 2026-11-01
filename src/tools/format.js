// Number formatting shared by the build, the tests and the browser (copied to dist/tools/format.js). Indian figures use
// en-IN grouping with ₹ (₹1,25,120.35), US figures en-US with $ (brief §1); negatives carry a real minus sign so the
// sign is a visible signal, never colour alone (brief §4). Pure, no DOM.

export const MINUS = '−';

function grouped(n, dp, locale) {
  const v = Number(n);
  if (!Number.isFinite(v)) return '—';
  const abs = Math.abs(v).toLocaleString(locale, { minimumFractionDigits: dp, maximumFractionDigits: dp });
  return (v < 0 && abs !== (0).toFixed(dp) ? MINUS : '') + abs;
}

/** 1234567.891 → "12,34,567.89" (en-IN, `dp` decimals, default 2). */
export function num(n, dp = 2) { return grouped(n, dp, 'en-IN'); }
/** Whole number with en-IN grouping: 1800 → "1,800". */
export function int(n) { return grouped(n, 0, 'en-IN'); }
/** ₹ with two decimals: 917.03 → "₹917.03", −1234.5 → "−₹1,234.50". */
export function inr(n, dp = 2) { const s = grouped(n, dp, 'en-IN'); return s.startsWith(MINUS) ? `${MINUS}₹${s.slice(1)}` : `₹${s}`; }
/** $ with two decimals, en-US grouping: 1234.5 → "$1,234.50". */
export function usd(n, dp = 2) { const s = grouped(n, dp, 'en-US'); return s.startsWith(MINUS) ? `${MINUS}$${s.slice(1)}` : `$${s}`; }
/** A percentage already expressed in percent units: 14.444 → "14.44%" (register style: no space before %). */
export function pct(n, dp = 2) { return `${grouped(n, dp, 'en-IN')}%`; }

/**
 * Format a result value by kind: inr | usd | num2 | num4 | int | pct | pm (±points) | pmPct | range ([lo, hi]) |
 * R (R-multiples) | x (multiple) | text. Non-finite numbers render "—" so NaN/Infinity never reach the page (design §8).
 */
export function fmt(value, kind = 'num2') {
  if (kind === 'text') return value == null ? '—' : String(value);
  if (kind === 'range') return Array.isArray(value) && value.every(Number.isFinite) ? `${num(value[0])}–${num(value[1])}` : '—';
  if (!Number.isFinite(value)) return '—';
  switch (kind) {
    case 'inr': return inr(value);
    case 'inr0': return inr(value, 0);
    case 'usd': return usd(value);
    case 'int': return int(value);
    case 'num4': return num(value, 4);
    case 'pct': return pct(value);
    case 'pm': return `±${num(value)}`;
    case 'pmPct': return `±${num(value)}%`;
    case 'R': return `${num(value)}R`;
    case 'x': return `${num(value)}×`;
    default: return num(value);
  }
}
