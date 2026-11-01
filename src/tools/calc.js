// The eight calculators (pack L §7). Pure ESM, no DOM: one implementation shared by `node:test` (the worked examples)
// and the browser (copied to dist/tools/calc.js and driven by site/tool-ui.js). Statutory rates arrive as a rate map
// built from the register by rates.js (`{ id: { num, value } }`), so no changeable number is typed here.
//
// Every function validates its inputs (design §9) and throws a RangeError carrying `field`, `min` and `max` on a bad
// one, then returns { big, lines, total, kpis, warnings, formulaText }:
//   big       { key, value, kind }            the headline figure (.result-big)
//   lines     [{ key, value, kind, rateId?, basis?, note? }]   one row per line; `rateId` names the register value the
//             row used (rendered as a plain .fact span in the sub-line), `basis` the amount it was applied to
//   total     number | null                   the row rendered as .total (sum of the rounded lines)
//   kpis      [{ key, value, kind, delta? }]  the .kpis cells; delta 'up' | 'down' adds the ▲/▼ glyph
//   warnings  [{ key, vars }]                 string keys the view resolves (tools.warnFreeze, …)
//   formulaText                               the arithmetic with the register values and current inputs filled in
// Rounding (pack L §1, binding): every money line is rounded half-up to the paise as it is computed; totals are sums of
// rounded lines; Greeks to four decimals, implied volatility to two decimals in percent.
import { rate, slab } from './rates.js';
import { num as fnum, inr, int } from './format.js';

/* ---------- rounding and validation ---------- */

function roundTo(x, places) {
  const f = 10 ** places;
  const v = Math.sign(x) * Math.round((Math.abs(x) + 1e-9) * f) / f;
  return v === 0 ? 0 : v; // never −0
}
/** Half-up (away from zero) to two decimals: 0.195 → 0.20, 749.125 → 749.13, −1.005 → −1.01. */
export function r2(x) { return roundTo(x, 2); }
/** Half-up to four decimals (Greeks). */
export function r4(x) { return roundTo(x, 4); }

function fail(field, min, max) {
  const e = new RangeError(`${field}: out of range`);
  e.field = field; e.min = min; e.max = max;
  throw e;
}
/** Number() of a form value with bounds; `gt` = strict lower bound; `integer` = whole numbers only. */
function number(v, field, { min = -Infinity, max = Infinity, gt = null, integer = false } = {}) {
  const n = typeof v === 'number' ? v : v === '' || v === null || v === undefined ? NaN : Number(String(v).replace(/,/g, ''));
  if (!Number.isFinite(n) || n < min || n > max || (gt !== null && !(n > gt)) || (integer && !Number.isInteger(n))) fail(field, gt !== null ? gt : min, max);
  return n;
}
function oneOf(v, field, list) { if (!list.includes(v)) fail(field); return v; }
const optional = (v) => v === '' || v === null || v === undefined;

const CRORE = 1e7;
const line = (key, value, kind, extra = {}) => ({ key, value, kind, ...extra });

/* ---------- 7.1 charges — what this trade costs ---------- */

export const SEGMENTS = ['equity-intraday', 'equity-delivery', 'futures', 'options'];
export const BROKERAGE_MODELS = ['pct-cap', 'flat', 'zero', 'custom'];
const STT_ID = { 'equity-intraday': 'chg-stt-equity-intraday', 'equity-delivery': 'chg-stt-equity-delivery', futures: 'chg-stt-futures', options: 'chg-stt-options-sell' };
const TXN_ID = { 'equity-intraday': 'chg-nse-txn-equity', 'equity-delivery': 'chg-nse-txn-equity', futures: 'chg-nse-txn-futures', options: 'chg-nse-txn-options' };
const STAMP_ID = { 'equity-intraday': 'chg-stamp-intraday', 'equity-delivery': 'chg-stamp-delivery', futures: 'chg-stamp-futures', options: 'chg-stamp-options' };

/**
 * inputs: { segment, qty | lots + lotSize, buy, sell, model, customRate (%), customCap (₹), exercised, intrinsic, dp }
 * rates: the register map; broker: { rate (fraction per order), cap (₹), flat (₹) } — the broker-example figures parsed
 * from `chg-brokerage-example-intraday-futures` / `-options` (editable in the UI through the custom model).
 */
export function charges(inputs, rates, broker = { rate: 0, cap: 0, flat: 0 }) {
  const seg = oneOf(inputs.segment, 'segment', SEGMENTS);
  const fo = seg === 'futures' || seg === 'options';
  const delivery = seg === 'equity-delivery';
  let units;
  if (fo) {
    const lots = number(inputs.lots, 'lots', { min: 1, max: 10000, integer: true });
    const lotSize = number(inputs.lotSize, 'lotSize', { min: 1, max: 10000, integer: true });
    units = lots * lotSize;
  } else units = number(inputs.qty, 'qty', { min: 1, max: 1e7, integer: true });
  const buy = number(inputs.buy, 'buy', { gt: 0, max: 1e7 });
  const exercised = seg === 'options' && (inputs.exercised === true || inputs.exercised === 'true' || inputs.exercised === 'on');
  const sell = exercised ? null : number(inputs.sell, 'sell', { gt: 0, max: 1e7 });
  const intrinsic = exercised ? number(inputs.intrinsic, 'intrinsic', { min: 0, max: 1e7 }) : null;
  const model = oneOf(inputs.model, 'model', BROKERAGE_MODELS);
  let bRate = 0, bCap = 0, bFlat = 0;
  if (model === 'pct-cap') { bRate = broker.rate; bCap = broker.cap; }
  else if (model === 'flat') bFlat = broker.flat;
  else if (model === 'custom') { bRate = number(inputs.customRate, 'customRate', { min: 0, max: 1 }) / 100; bCap = number(inputs.customCap, 'customCap', { min: 0, max: 1000 }); }
  const dp = delivery ? (optional(inputs.dp) ? rate(rates, 'chg-dp-example-broker') : number(inputs.dp, 'dp', { min: 0, max: 10000 })) : 0;

  const TB = units * buy;
  const TS = exercised ? intrinsic * units : units * sell;
  const turnover = exercised ? TB : TB + TS; // an exercised option has no sell order: no sell-side turnover charges
  const perOrder = (t) => (model === 'flat' ? bFlat : model === 'zero' ? 0 : bCap > 0 ? Math.min(bRate * t, bCap) : bRate * t);
  const brokerageBuy = r2(perOrder(TB));
  const brokerageSell = exercised ? 0 : r2(perOrder(TS));
  const brokerage = r2(brokerageBuy + brokerageSell);
  const sttId = exercised ? 'chg-stt-options-exercise' : STT_ID[seg];
  const sttBasis = delivery ? TB + TS : TS;
  const stt = r2(rate(rates, sttId) * sttBasis);
  const exchange = r2(rate(rates, TXN_ID[seg]) / CRORE * turnover);
  const sebi = r2(rate(rates, 'chg-sebi-fee') / CRORE * turnover);
  const stamp = r2(rate(rates, STAMP_ID[seg]) * TB);
  const dpLine = delivery ? r2(dp) : 0;
  const gst = r2(rate(rates, 'chg-gst-rate') * (brokerage + exchange + sebi));
  const capped = (model === 'pct-cap' || model === 'custom') && bCap > 0;
  const lines = [
    line('brokerage', brokerage, 'inr', { buy: brokerageBuy, sell: brokerageSell, subKey: exercised ? 'brokerageExercised' : capped ? 'brokerageCapped' : 'brokerage' }),
    line('stt', stt, 'inr', { rateId: sttId, basis: sttBasis, subKey: delivery ? 'sttBoth' : exercised ? 'sttIntrinsic' : 'sttSell' }),
    line('exchange', exchange, 'inr', { rateId: TXN_ID[seg], basis: turnover, subKey: seg === 'options' ? 'exchangeOptions' : 'exchange' }),
    line('sebi', sebi, 'inr', { rateId: 'chg-sebi-fee', basis: turnover }),
    line('stamp', stamp, 'inr', { rateId: STAMP_ID[seg], basis: TB }),
  ];
  if (delivery) lines.push(optional(inputs.dp) ? line('dp', dpLine, 'inr', { rateId: 'chg-dp-example-broker' }) : line('dp', dpLine, 'inr', { subKey: 'dpCustom' }));
  lines.push(line('gst', gst, 'inr', { rateId: 'chg-gst-rate' }));
  const total = r2(lines.reduce((a, l) => a + l.value, 0));
  const gross = r2(TS - TB);
  const net = r2(gross - total);
  const breakEven = r2(total / units);
  const warnings = [];
  if (fo && rates['fo-freeze-qty-nifty'] && units > rate(rates, 'fo-freeze-qty-nifty')) warnings.push({ key: 'warnFreeze', vars: { freeze: 'fo-freeze-qty-nifty' } });
  const V = (id) => rates[id].value;
  const pctText = `${String(Number((bRate * 100).toPrecision(10)))}%`;
  const perOrderText = (t) => (bCap > 0 ? `min(${pctText} × ${t}, ${inr(bCap)})` : `${pctText} × ${t}`);
  const brokerageFormula = model === 'flat' ? `${inr(bFlat)} per executed order × ${exercised ? 1 : 2}`
    : model === 'zero' ? '0'
      : `${perOrderText('TB')}${exercised ? '' : ` + ${perOrderText('TS')}`}`;
  const formulaText = [
    `units     = ${fo ? `lots × lot size = ${int(units)}` : `quantity = ${int(units)}`}`,
    `TB        = units × buy  = ${fnum(TB)}`,
    exercised ? `TS        = units × intrinsic value at expiry = ${fnum(TS)}` : `TS        = units × sell = ${fnum(TS)}`,
    `brokerage = ${brokerageFormula}`,
    `STT       = ${V(sttId)} × ${delivery ? '(TB + TS)' : exercised ? 'TS   (exercised option: on intrinsic value, paid by the buyer)' : 'TS   (sell side only)'}`,
    `exchange  = ${V(TXN_ID[seg])} × ${exercised ? 'TB' : '(TB + TS)'} ÷ 1,00,00,000${seg === 'options' ? '   (premium turnover)' : ''}`,
    `SEBI      = ${V('chg-sebi-fee')} × ${exercised ? 'TB' : '(TB + TS)'} ÷ 1,00,00,000`,
    `stamp     = ${V(STAMP_ID[seg])} × TB   (buyer only)`,
    ...(delivery ? [`DP        = ${inr(dpLine)} per sell order`] : []),
    `GST       = ${V('chg-gst-rate')} × (brokerage + exchange + SEBI)`,
    'total     = Σ lines, each rounded half-up to the paise',
    'net       = (TS − TB) − total;  break-even = total ÷ units',
  ].join('\n');
  return {
    big: { key: 'total', value: total, kind: 'inr' },
    sub: [{ key: 'turnover', value: TB + TS, kind: 'inr' }, ...(gross !== 0 ? [{ key: 'share', value: (total / Math.abs(gross)) * 100, kind: 'pct' }] : [])],
    lines,
    total,
    kpis: [
      { key: 'gross', value: gross, kind: 'inr', delta: gross > 0 ? 'up' : gross < 0 ? 'down' : null },
      { key: 'net', value: net, kind: 'inr', delta: net > 0 ? 'up' : net < 0 ? 'down' : null },
      { key: 'breakEven', value: breakEven, kind: 'inr', unitKey: fo ? 'points' : 'perShare' },
    ],
    warnings,
    formulaText,
  };
}

/* ---------- 7.2 position size and risk ---------- */

export const SIZE_MODES = ['shares', 'lots'];

/** inputs: { mode, capital, riskPct, entry, stop, lotSize (lots), leverage (shares, display only), maxLoss (optional) } */
export function positionSize(inputs, rates) {
  const mode = oneOf(inputs.mode, 'mode', SIZE_MODES);
  const capital = number(inputs.capital, 'capital', { gt: 0, max: 1e12 });
  const riskPct = number(inputs.riskPct, 'riskPct', { min: 0.1, max: 10 });
  const entry = number(inputs.entry, 'entry', { gt: 0, max: 1e7 });
  const stop = number(inputs.stop, 'stop', { min: 0, max: 1e7 });
  if (stop === entry) fail('stop', 0, 1e7);
  const maxLoss = optional(inputs.maxLoss) ? null : number(inputs.maxLoss, 'maxLoss', { gt: 0, max: 1e12 });
  const budget = capital * riskPct / 100;
  const risk = r2(maxLoss !== null ? Math.min(budget, maxLoss) : budget);
  const perUnit = r2(Math.abs(entry - stop));
  const warnings = [];
  const lines = [
    line('risk', risk, 'inr', { note: maxLoss !== null && maxLoss < budget ? 'capped' : null }),
    line('perUnit', perUnit, 'inr'),
  ];
  const formula = [`risk ₹   = capital × risk% = ${inr(capital)} × ${fnum(riskPct)}%${maxLoss !== null ? ` (capped at ${inr(maxLoss)})` : ''} = ${inr(risk)}`, `per unit = |entry − stop| = |${fnum(entry)} − ${fnum(stop)}| = ${inr(perUnit)}`];
  if (mode === 'shares') {
    const leverage = optional(inputs.leverage) ? 1 : number(inputs.leverage, 'leverage', { min: 1, max: 50 });
    const qty = Math.floor(risk / perUnit);
    const notional = r2(qty * entry);
    const margin = r2(notional / leverage);
    const lossAtStop = r2(qty * perUnit);
    if (qty === 0) warnings.push({ key: 'warnZeroQty' });
    lines.push(line('qty', qty, 'int'), line('notional', notional, 'inr'), line('margin', margin, 'inr', { leverage }), line('lossAtStop', lossAtStop, 'inr'));
    formula.push(`quantity = floor(risk ₹ ÷ per unit) = floor(${fnum(risk / perUnit)}) = ${int(qty)}`, `notional = quantity × entry = ${inr(notional)}`, `margin   ≈ notional ÷ ${fnum(leverage, 0)} (broker example, equity intraday only) = ${inr(margin)}`);
    return { big: { key: 'qty', value: qty, kind: 'int', unitKey: 'shares' }, sub: [{ key: 'raw', value: risk / perUnit, kind: 'num2' }], lines, total: null, kpis: [{ key: 'notional', value: notional, kind: 'inr' }, { key: 'margin', value: margin, kind: 'inr' }, { key: 'lossAtStop', value: lossAtStop, kind: 'inr', delta: 'down' }], warnings, formulaText: formula.join('\n') };
  }
  const lotSize = number(inputs.lotSize, 'lotSize', { min: 1, max: 10000, integer: true });
  const perLot = r2(perUnit * lotSize);
  const raw = risk / perLot;
  const lots = Math.floor(raw);
  const units = lots * lotSize;
  const premiumAtRisk = r2(entry * units);
  const lossAtStop = r2(perLot * lots);
  if (lots === 0) warnings.push({ key: 'warnZeroLots' });
  if (rates && rates['fo-freeze-qty-nifty'] && units > rate(rates, 'fo-freeze-qty-nifty')) warnings.push({ key: 'warnFreeze', vars: { freeze: 'fo-freeze-qty-nifty' } });
  lines.push(line('perLot', perLot, 'inr'), line('lots', lots, 'int'), line('premiumAtRisk', premiumAtRisk, 'inr'), line('lossAtStop', lossAtStop, 'inr'));
  formula.push(`per lot  = per unit × lot size = ${inr(perUnit)} × ${int(lotSize)} = ${inr(perLot)}`, `lots     = floor(risk ₹ ÷ per lot) = floor(${fnum(raw)}) = ${int(lots)}`, `premium at risk = entry × lot size × lots = ${inr(premiumAtRisk)}   (a long option can go to zero)`, `loss at stop    = per lot × lots = ${inr(lossAtStop)}`);
  return { big: { key: 'lots', value: lots, kind: 'int', unitKey: lots === 1 ? 'lot' : 'lots' }, sub: [{ key: 'raw', value: raw, kind: 'num2' }, { key: 'units', value: units, kind: 'int' }], lines, total: null, kpis: [{ key: 'units', value: units, kind: 'int' }, { key: 'premiumAtRisk', value: premiumAtRisk, kind: 'inr', delta: 'down' }, { key: 'lossAtStop', value: lossAtStop, kind: 'inr', delta: 'down' }], warnings, formulaText: formula.join('\n') };
}

/* ---------- 7.3 expectancy and Kelly ---------- */

/** inputs: { p (win rate %), W (avg win in R), L (avg loss in R), R (₹ per R, optional), N (trades) } */
export function expectancyKelly(inputs) {
  const pPct = number(inputs.p, 'p', { gt: 0, max: 99.99 });
  const W = number(inputs.W, 'W', { gt: 0, max: 1000 });
  const L = number(inputs.L, 'L', { gt: 0, max: 1000 });
  const R = optional(inputs.R) ? 0 : number(inputs.R, 'R', { min: 0, max: 1e9 });
  const N = optional(inputs.N) ? 100 : number(inputs.N, 'N', { min: 1, max: 100000, integer: true });
  const p = pPct / 100;
  const E = r2(p * W - (1 - p) * L);
  const b = W / L;
  const kellyRaw = p - (1 - p) / b;
  const kelly = Math.max(0, kellyRaw);
  const warnings = [];
  if (kellyRaw <= 0) warnings.push({ key: 'noEdge' });
  const lines = [
    line('expectancy', E, 'R'),
    line('payoff', b, 'x'),
    line('kelly', kelly * 100, 'pct'),
    line('halfKelly', kelly * 50, 'pct'),
  ];
  const expected = R > 0 ? r2(E * N * R) : null;
  if (R > 0) lines.push(line('expectedRupees', expected, 'inr', { N }));
  const formulaText = [
    `E        = p × W − (1 − p) × L = ${fnum(p, 2)} × ${fnum(W)} − ${fnum(1 - p, 2)} × ${fnum(L)} = ${fnum(E)}R per trade`,
    `b        = W ÷ L = ${fnum(b, 4)}`,
    `Kelly f* = p − (1 − p) ÷ b = ${fnum(kellyRaw * 100)}%${kellyRaw <= 0 ? '   (≤ 0: no edge, do not bet)' : ''}`,
    `half-Kelly = f* ÷ 2 = ${fnum(kelly * 50)}%`,
    ...(R > 0 ? [`expected ₹ over ${int(N)} trades = E × N × R = ${fnum(E)} × ${int(N)} × ${inr(R)} = ${inr(expected)}`] : []),
  ].join('\n');
  return { big: { key: 'expectancy', value: E, kind: 'R' }, sub: [{ key: 'kelly', value: kelly * 100, kind: 'pct' }], lines, total: null, kpis: [{ key: 'kelly', value: kelly * 100, kind: 'pct' }, { key: 'halfKelly', value: kelly * 50, kind: 'pct' }, ...(R > 0 ? [{ key: 'expectedRupees', value: expected, kind: 'inr', delta: expected > 0 ? 'up' : expected < 0 ? 'down' : null }] : [])], warnings, formulaText };
}

/* ---------- 7.4 straddle → expected move ---------- */

export const INDEXES = ['nifty', 'sensex', 'other'];
const LOT_ID = { nifty: 'fo-nifty-lot', sensex: 'fo-sensex-lot' };

/** inputs: { S (spot), straddle (ATM call + put), sigma (IV % p.a.), days, index } */
export function expectedMove(inputs, rates) {
  const S = number(inputs.S, 'S', { gt: 0, max: 1e7 });
  const straddle = number(inputs.straddle, 'straddle', { min: 0, max: 1e7 });
  const sigma = number(inputs.sigma, 'sigma', { min: 0.01, max: 500 });
  const days = number(inputs.days, 'days', { min: 1, max: 3650 });
  const index = optional(inputs.index) ? 'other' : oneOf(inputs.index, 'index', INDEXES);
  const emA = r2(straddle);
  const emB = r2(S * (sigma / 100) * Math.sqrt(days / 365));
  const rule = r2(0.8 * straddle);
  const lines = [
    line('moveA', emA, 'pm'),
    line('pctA', emA / S * 100, 'pmPct'),
    line('rangeA', [r2(S - emA), r2(S + emA)], 'range'),
    line('moveB', emB, 'pm'),
    line('pctB', emB / S * 100, 'pmPct'),
    line('rangeB', [r2(S - emB), r2(S + emB)], 'range'),
    line('rule', rule, 'pm'),
  ];
  const lotId = LOT_ID[index];
  let perLot = null;
  if (lotId && rates && rates[lotId]) { perLot = r2(emA * rate(rates, lotId)); lines.push(line('perLot', perLot, 'inr', { rateId: lotId })); }
  const formulaText = [
    `method A (straddle-implied)  EM = ATM straddle = ${fnum(emA)} points = ${fnum(emA / S * 100)}% of spot;  range = S ± EM = ${fnum(S - emA)} – ${fnum(S + emA)}`,
    `method B (IV, one σ)         EM = S × σ × √(T ÷ 365) = ${fnum(S)} × ${fnum(sigma)}% × √(${int(days)} ÷ 365) = ${fnum(emB)} points;  range = ${fnum(S - emB)} – ${fnum(S + emB)}`,
    `practitioner rule (lore)     0.8 × straddle ≈ one σ = ${fnum(rule)} points`,
    ...(perLot !== null ? [`per lot                      EM × lot size = ${fnum(emA)} × ${rates[lotId].value} = ${inr(perLot)}`] : []),
  ].join('\n');
  return { big: { key: 'moveA', value: emA, kind: 'pm', unitKey: 'points' }, sub: [{ key: 'pct', value: emA / S * 100, kind: 'pmPct' }], lines, total: null, kpis: [{ key: 'moveB', value: emB, kind: 'pm' }, { key: 'rule', value: rule, kind: 'pm' }, ...(perLot !== null ? [{ key: 'perLot', value: perLot, kind: 'inr' }] : [])], warnings: [], formulaText };
}

/* ---------- 7.5 Black-Scholes-Merton with Greeks and an IV solver ---------- */

/** Standard normal CDF — Hart's double-precision rational approximation (W. J. Cody / G. West 2005), |error| < 1e-14. */
export function normCdf(x) {
  const a = Math.abs(x);
  let c;
  if (a > 37) c = 0;
  else {
    const e = Math.exp(-a * a / 2);
    if (a < 7.07106781186547) {
      let b = 3.52624965998911e-2 * a + 0.700383064443688;
      b = b * a + 6.37396220353165; b = b * a + 33.912866078383; b = b * a + 112.079291497871; b = b * a + 221.213596169931; b = b * a + 220.206867912376;
      c = e * b;
      b = 8.83883476483184e-2 * a + 1.75566716318264;
      b = b * a + 16.064177579207; b = b * a + 86.7807322029461; b = b * a + 296.564248779674; b = b * a + 637.333633378831; b = b * a + 793.826512519948; b = b * a + 440.413735824752;
      c /= b;
    } else {
      let b = a + 0.65; b = a + 4 / b; b = a + 3 / b; b = a + 2 / b; b = a + 1 / b;
      c = e / b / 2.506628274631;
    }
  }
  return x > 0 ? 1 - c : c;
}
const normPdf = (x) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);

/** Prices and Greeks for S, K, T (years), r, σ, q as fractions. θ per calendar day; vega and ρ per one percentage point. */
export function bsm(S, K, T, r, sigma, q = 0) {
  const sq = sigma * Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r - q + sigma * sigma / 2) * T) / sq;
  const d2 = d1 - sq;
  const dq = Math.exp(-q * T), dr = Math.exp(-r * T);
  const nd1 = normPdf(d1);
  const call = S * dq * normCdf(d1) - K * dr * normCdf(d2);
  const put = K * dr * normCdf(-d2) - S * dq * normCdf(-d1);
  return {
    call, put,
    deltaCall: dq * normCdf(d1), deltaPut: dq * (normCdf(d1) - 1),
    gamma: dq * nd1 / (S * sq),
    vega: S * dq * nd1 * Math.sqrt(T) / 100,
    thetaCall: (-(S * dq * nd1 * sigma) / (2 * Math.sqrt(T)) - r * K * dr * normCdf(d2) + q * S * dq * normCdf(d1)) / 365,
    thetaPut: (-(S * dq * nd1 * sigma) / (2 * Math.sqrt(T)) + r * K * dr * normCdf(-d2) - q * S * dq * normCdf(-d1)) / 365,
    rhoCall: K * T * dr * normCdf(d2) / 100,
    rhoPut: -K * T * dr * normCdf(-d2) / 100,
    d1, d2,
  };
}

/**
 * Implied volatility by bisection on σ ∈ [0.01%, 500%], 200 iterations or |Δprice| < 1e-6. Returns the fraction, or
 * null when no solution exists: price below the discounted intrinsic value, or at/above the no-arbitrage upper bound
 * (S·e^−qT for a call, K·e^−rT for a put).
 */
export function impliedVol(price, type, S, K, T, r, q = 0) {
  const dq = Math.exp(-q * T), dr = Math.exp(-r * T);
  const intrinsic = type === 'call' ? Math.max(0, S * dq - K * dr) : Math.max(0, K * dr - S * dq);
  const upper = type === 'call' ? S * dq : K * dr;
  if (!(price > intrinsic - 1e-9) || price >= upper) return null;
  let lo = 0.0001, hi = 5, mid = 0;
  for (let i = 0; i < 200; i++) {
    mid = (lo + hi) / 2;
    const p = bsm(S, K, T, r, mid, q)[type];
    const diff = p - price;
    if (Math.abs(diff) < 1e-6) return mid;
    if (diff > 0) hi = mid; else lo = mid;
  }
  return Math.abs(bsm(S, K, T, r, mid, q)[type] - price) <= 0.01 ? mid : null;
}

export const BS_MODES = ['price', 'iv'];
export const OPTION_TYPES = ['call', 'put'];

/** inputs: { mode, S, K, days, r (%), sigma (%; price mode), q (%), price and type (iv mode) } */
export function blackScholes(inputs) {
  const mode = oneOf(inputs.mode, 'mode', BS_MODES);
  const S = number(inputs.S, 'S', { gt: 0, max: 1e7 });
  const K = number(inputs.K, 'K', { gt: 0, max: 1e7 });
  const days = number(inputs.days, 'days', { min: 1, max: 3650 });
  const rPct = number(inputs.r, 'r', { min: -5, max: 50 });
  const qPct = optional(inputs.q) ? 0 : number(inputs.q, 'q', { min: 0, max: 20 });
  const T = days / 365, r = rPct / 100, q = qPct / 100;
  const greekLines = (g) => [
    line('deltaCall', r4(g.deltaCall), 'num4'), line('deltaPut', r4(g.deltaPut), 'num4'),
    line('gamma', r4(g.gamma), 'num4'), line('vega', r2(g.vega), 'num2'),
    line('thetaCall', r2(g.thetaCall), 'num2'), line('thetaPut', r2(g.thetaPut), 'num2'),
    line('rhoCall', r2(g.rhoCall), 'num2'), line('rhoPut', r2(g.rhoPut), 'num2'),
  ];
  const head = (sigma) => [
    `d1 = [ln(S ÷ K) + (r − q + σ² ÷ 2) × T] ÷ (σ × √T);  d2 = d1 − σ × √T`,
    `S = ${fnum(S)}  K = ${fnum(K)}  T = ${int(days)} ÷ 365 = ${fnum(T, 5)}  r = ${fnum(rPct)}%  q = ${fnum(qPct)}%  σ = ${fnum(sigma * 100)}%`,
    'call = S × e^(−qT) × N(d1) − K × e^(−rT) × N(d2);  put = K × e^(−rT) × N(−d2) − S × e^(−qT) × N(−d1)',
    'Δ = e^(−qT) × N(d1) (call), e^(−qT) × (N(d1) − 1) (put);  Γ = e^(−qT) × n(d1) ÷ (S × σ × √T)',
    'vega per 1% = S × e^(−qT) × n(d1) × √T ÷ 100;  θ per calendar day = θ(annual) ÷ 365;  ρ per 1% = K × T × e^(−rT) × N(±d2) ÷ 100',
  ];
  if (mode === 'price') {
    const sigmaPct = number(inputs.sigma, 'sigma', { min: 0.01, max: 500 });
    const g = bsm(S, K, T, r, sigmaPct / 100, q);
    const lines = [line('call', r2(g.call), 'num2'), line('put', r2(g.put), 'num2'), ...greekLines(g)];
    return { big: { key: 'call', value: r2(g.call), kind: 'num2' }, sub: [{ key: 'put', value: r2(g.put), kind: 'num2' }], lines, total: null, kpis: [{ key: 'put', value: r2(g.put), kind: 'num2' }, { key: 'deltaCall', value: r4(g.deltaCall), kind: 'num4' }, { key: 'thetaCall', value: r2(g.thetaCall), kind: 'num2', delta: 'down' }], warnings: [], formulaText: [...head(sigmaPct / 100), `d1 = ${fnum(g.d1, 4)}  d2 = ${fnum(g.d2, 4)}  N(d1) = ${fnum(normCdf(g.d1), 4)}  N(d2) = ${fnum(normCdf(g.d2), 4)}`].join('\n') };
  }
  const type = oneOf(inputs.type, 'type', OPTION_TYPES);
  const price = number(inputs.price, 'price', { gt: 0, max: 1e7 });
  const sigma = impliedVol(price, type, S, K, T, r, q);
  if (sigma === null) {
    return { big: { key: 'iv', value: null, kind: 'text' }, sub: [], lines: [], total: null, kpis: [], warnings: [{ key: 'noSolution' }], formulaText: [...head(0).slice(0, 1), `${type} price ${fnum(price)} lies outside the no-arbitrage bounds for S = ${fnum(S)}, K = ${fnum(K)}, T = ${int(days)} days: no σ reproduces it`].join('\n') };
  }
  const g = bsm(S, K, T, r, sigma, q);
  const ivPct = r2(sigma * 100);
  const lines = [line('iv', ivPct, 'pct'), line('call', r2(g.call), 'num2', { given: type === 'call' }), line('put', r2(g.put), 'num2', { given: type === 'put' }), ...greekLines(g)];
  return { big: { key: 'iv', value: ivPct, kind: 'pct' }, sub: [{ key: 'type', value: type, kind: 'text' }, { key: 'other', value: type === 'call' ? r2(g.put) : r2(g.call), kind: 'num2' }], lines, total: null, kpis: [{ key: type === 'call' ? 'put' : 'call', value: type === 'call' ? r2(g.put) : r2(g.call), kind: 'num2' }, { key: type === 'call' ? 'deltaCall' : 'deltaPut', value: r4(type === 'call' ? g.deltaCall : g.deltaPut), kind: 'num4' }, { key: type === 'call' ? 'thetaCall' : 'thetaPut', value: r2(type === 'call' ? g.thetaCall : g.thetaPut), kind: 'num2', delta: 'down' }], warnings: [], formulaText: [`σ solved by bisection on [0.01%, 500%] until |model price − ${fnum(price)}| < 0.000001 (max 200 steps): σ = ${fnum(sigma * 100)}%`, ...head(sigma), `the other leg by put–call parity: call − put = S × e^(−qT) − K × e^(−rT) = ${fnum(S * Math.exp(-q * T) - K * Math.exp(-r * T))}`].join('\n') };
}

/* ---------- 7.6 F&O tax estimator (new regime, Income-tax Act 2025) ---------- */

/** Slab tax on `income` over bands parsed from the register ({ lo, hi, rate }); each band's tax rounded to the paise. */
export function slabTax(income, slabs) {
  let tax = 0;
  const bands = [];
  for (const s of slabs) {
    const lower = s.lo === 0 ? 0 : s.lo - 1;
    const portion = Math.max(0, Math.min(income, s.hi) - lower);
    const t = r2(portion * s.rate);
    bands.push({ lower, upper: s.hi, portion, rate: s.rate, tax: t });
    tax += t;
  }
  return { tax: r2(tax), bands };
}

const MAX_MONEY = 1e10; // ₹1,000 crore

/**
 * inputs: { salary, fo (F&O net P&L, any sign), intraday (speculative P&L, any sign), other, bfNonSpec, bfSpec (optional) }
 * rates: tax-std-deduction-new-regime, tax-slab-1…7 (parsed with rates.slab), tax-rebate-156, tax-rebate-156-income-limit,
 * tax-cess-rate, tax-spec-loss-carry-forward, tax-nonspec-loss-carry-forward (display). Set-off follows ss. 109/113:
 * a business (F&O) loss is set off in-year against any head except salary; a speculation loss only against speculation profit.
 */
export function foTax(inputs, rates, slabs) {
  const salary = number(inputs.salary, 'salary', { min: 0, max: MAX_MONEY });
  const fo = number(inputs.fo, 'fo', { min: -MAX_MONEY, max: MAX_MONEY });
  const intraday = number(inputs.intraday, 'intraday', { min: -MAX_MONEY, max: MAX_MONEY });
  const other = optional(inputs.other) ? 0 : number(inputs.other, 'other', { min: 0, max: MAX_MONEY });
  const bfNonSpec = optional(inputs.bfNonSpec) ? 0 : number(inputs.bfNonSpec, 'bfNonSpec', { min: 0, max: MAX_MONEY });
  const bfSpec = optional(inputs.bfSpec) ? 0 : number(inputs.bfSpec, 'bfSpec', { min: 0, max: MAX_MONEY });
  const std = rate(rates, 'tax-std-deduction-new-regime');
  const salaryTaxable = r2(Math.max(0, salary - Math.min(salary, std)));
  let specProfit = Math.max(intraday, 0);
  const specLoss = Math.max(-intraday, 0);
  let foProfit = Math.max(fo, 0);
  const foLoss = Math.max(-fo, 0);
  let otherLeft = other;
  // brought-forward speculation loss: against speculation profit only (s. 113)
  const bfSpecUsed = Math.min(bfSpec, specProfit); specProfit -= bfSpecUsed;
  // brought-forward business loss: against business profits (s. 112), F&O first, then speculation profit
  let bfNonSpecLeft = bfNonSpec;
  const useFo = Math.min(bfNonSpecLeft, foProfit); foProfit -= useFo; bfNonSpecLeft -= useFo;
  const useSpec = Math.min(bfNonSpecLeft, specProfit); specProfit -= useSpec; bfNonSpecLeft -= useSpec;
  // current-year F&O loss: any head except salary (s. 109) — speculation profit, then other income
  let foLossLeft = foLoss;
  const vsSpec = Math.min(foLossLeft, specProfit); specProfit -= vsSpec; foLossLeft -= vsSpec;
  const vsOther = Math.min(foLossLeft, otherLeft); otherLeft -= vsOther; foLossLeft -= vsOther;
  const businessIncome = r2(foProfit + specProfit);
  const totalIncome = r2(salaryTaxable + businessIncome + otherLeft);
  const { tax, bands } = slabTax(totalIncome, slabs);
  const limit = rate(rates, 'tax-rebate-156-income-limit');
  const maxRebate = rate(rates, 'tax-rebate-156');
  const rebate = r2(totalIncome <= limit ? Math.min(tax, maxRebate) : Math.max(0, tax - (totalIncome - limit)));
  const taxAfter = r2(tax - rebate);
  const cess = r2(taxAfter * rate(rates, 'tax-cess-rate'));
  const totalTax = r2(taxAfter + cess);
  const carryNonSpec = r2(foLossLeft + bfNonSpecLeft);
  const carrySpec = r2(specLoss + (bfSpec - bfSpecUsed));
  const lines = [
    line('salaryTaxable', salaryTaxable, 'inr', { rateId: 'tax-std-deduction-new-regime' }),
    line('businessIncome', businessIncome, 'inr'),
    line('totalIncome', totalIncome, 'inr'),
    line('slabTax', tax, 'inr'),
    line('rebate', rebate, 'inr', { rateId: 'tax-rebate-156', relief: totalIncome > limit && rebate > 0 }),
    line('cess', cess, 'inr', { rateId: 'tax-cess-rate' }),
  ];
  if (carryNonSpec > 0) lines.push(line('carryNonSpec', carryNonSpec, 'inr', { rateId: 'tax-nonspec-loss-carry-forward' }));
  if (carrySpec > 0) lines.push(line('carrySpec', carrySpec, 'inr', { rateId: 'tax-spec-loss-carry-forward' }));
  const V = (id) => rates[id].value;
  const formulaText = [
    `salary taxable  = salary − standard deduction (${V('tax-std-deduction-new-regime')}) = ${inr(salaryTaxable)}`,
    `business income = F&O profit + speculation profit, after set-off = ${inr(businessIncome)}   (F&O loss: against any head except salary; speculation loss: against speculation profit only)`,
    `total income    = ${inr(salaryTaxable)} + ${inr(businessIncome)} + ${inr(otherLeft)} = ${inr(totalIncome)}`,
    ...bands.filter((b) => b.portion > 0).map((b) => `slab ${b.upper === Infinity ? `above ${inr(b.lower, 0)}` : `${inr(b.lower, 0)}–${inr(b.upper, 0)}`}: ${inr(b.portion)} × ${fnum(b.rate * 100, 0)}% = ${inr(b.tax)}`),
    `slab tax        = ${inr(tax)}`,
    `rebate (s. 156) = ${totalIncome <= limit ? `min(tax, ${V('tax-rebate-156')}) as total income ≤ ${V('tax-rebate-156-income-limit')}` : `marginal relief: tax may not exceed total income − ${V('tax-rebate-156-income-limit')}`} = ${inr(rebate)}`,
    `cess            = ${V('tax-cess-rate')} × (slab tax − rebate) = ${inr(cess)}`,
    `total tax       = ${inr(taxAfter)} + ${inr(cess)} = ${inr(totalTax)}`,
    ...(carryNonSpec > 0 ? [`carry forward   = F&O loss not set off ${inr(carryNonSpec)} for ${V('tax-nonspec-loss-carry-forward')}`] : []),
    ...(carrySpec > 0 ? [`carry forward   = speculation loss ${inr(carrySpec)} for ${V('tax-spec-loss-carry-forward')}, against speculation profit only`] : []),
  ].join('\n');
  const warnings = [{ key: 'surchargeNote' }];
  if (carryNonSpec > 0 || carrySpec > 0) warnings.push({ key: 'carryNote' });
  return { big: { key: 'totalTax', value: totalTax, kind: 'inr' }, sub: totalIncome > 0 ? [{ key: 'effective', value: totalTax / totalIncome * 100, kind: 'pct' }] : [], lines, total: totalTax, kpis: [{ key: 'totalIncome', value: totalIncome, kind: 'inr' }, { key: 'effective', value: totalIncome > 0 ? totalTax / totalIncome * 100 : 0, kind: 'pct' }, ...(carryNonSpec > 0 ? [{ key: 'carryNonSpec', value: carryNonSpec, kind: 'inr' }] : []), ...(carrySpec > 0 ? [{ key: 'carrySpec', value: carrySpec, kind: 'inr' }] : [])], warnings, formulaText };
}

/* ---------- 7.7 SIP and lumpsum with inflation ---------- */

export const SIP_MODES = ['sip', 'lumpsum'];

/** inputs: { mode, amount (₹ per month | ₹ once), rate (% p.a.), years, inflation (% p.a.) } */
export function sip(inputs) {
  const mode = oneOf(inputs.mode, 'mode', SIP_MODES);
  const amount = number(inputs.amount, 'amount', { gt: 0, max: 1e9 });
  const ratePct = number(inputs.rate, 'rate', { min: -50, max: 50 });
  const years = number(inputs.years, 'years', { min: 1, max: 60, integer: true });
  const inflPct = optional(inputs.inflation) ? 0 : number(inputs.inflation, 'inflation', { min: 0, max: 30 });
  const r = ratePct / 100, infl = inflPct / 100;
  let fv, invested, formula;
  if (mode === 'sip') {
    const i = r / 12, n = 12 * years;
    fv = i === 0 ? amount * n : amount * ((1 + i) ** n - 1) / i * (1 + i);
    invested = amount * n;
    formula = [`FV = P × [((1 + i)^n − 1) ÷ i] × (1 + i),  i = ${fnum(ratePct)}% ÷ 12 = ${fnum(i * 100, 4)}%,  n = 12 × ${int(years)} = ${int(n)}   (contributions at the start of each month)`, `FV = ${inr(amount)} × ${fnum(fv / amount, 4)} = ${inr(fv)}`, `invested = P × n = ${inr(invested)}`];
  } else {
    fv = amount * (1 + r) ** years;
    invested = amount;
    formula = [`FV = PV × (1 + r)^years = ${inr(amount)} × (1 + ${fnum(ratePct)}%)^${int(years)} = ${inr(fv)}`];
  }
  const real = r2(fv / (1 + infl) ** years); // from the unrounded FV (pack L's worked figures)
  fv = r2(fv); invested = r2(invested);
  const gains = r2(fv - invested);
  const realCagr = ((1 + r) / (1 + infl) - 1) * 100;
  formula.push(`gains = FV − invested = ${inr(gains)}`, `real value = FV ÷ (1 + inflation)^years = ${inr(fv)} ÷ (1 + ${fnum(inflPct)}%)^${int(years)} = ${inr(real)}`, `real CAGR = (1 + r) ÷ (1 + inflation) − 1 = ${fnum(realCagr)}%`);
  const lines = [line('fv', fv, 'inr'), line('invested', invested, 'inr'), line('gains', gains, 'inr'), line('realValue', real, 'inr'), line('realCagr', realCagr, 'pct')];
  return { big: { key: 'fv', value: fv, kind: 'inr' }, sub: [{ key: 'real', value: real, kind: 'inr' }], lines, total: null, kpis: [{ key: 'invested', value: invested, kind: 'inr' }, { key: 'realValue', value: real, kind: 'inr' }, { key: 'multiple', value: invested > 0 ? fv / invested : 0, kind: 'x' }], warnings: [], formulaText: formula.join('\n') };
}

/* ---------- 7.8 US vs India: cost of investing, year one ---------- */

/**
 * inputs: { amount (₹), spread (FX %), fee (₹), already (₹ remitted this FY), terUs (%), yieldPct (%), withholding (%),
 * terIn (%), fx (₹ per $, optional) }; rates: glb-tcs-threshold, glb-tcs-rate (+ glb-us-dividend-withholding-dtaa, glb-lrs-limit for display).
 */
export function usVsIndia(inputs, rates) {
  const amount = number(inputs.amount, 'amount', { gt: 0, max: 1e10 });
  const spread = number(inputs.spread, 'spread', { min: 0, max: 10 });
  const fee = optional(inputs.fee) ? 0 : r2(number(inputs.fee, 'fee', { min: 0, max: amount }));
  const already = optional(inputs.already) ? 0 : number(inputs.already, 'already', { min: 0, max: 1e10 });
  const terUs = number(inputs.terUs, 'terUs', { min: 0, max: 10 });
  const yieldPct = number(inputs.yieldPct, 'yieldPct', { min: 0, max: 20 });
  const withholding = number(inputs.withholding, 'withholding', { min: 0, max: 100 });
  const terIn = number(inputs.terIn, 'terIn', { min: 0, max: 10 });
  const fx = optional(inputs.fx) ? null : number(inputs.fx, 'fx', { gt: 0, max: 1000 });
  const threshold = rate(rates, 'glb-tcs-threshold');
  const tcsRate = rate(rates, 'glb-tcs-rate');
  const fxCost = r2(amount * spread / 100);
  const tcsBase = Math.max(0, amount + already - threshold);
  const tcs = r2(tcsBase * tcsRate);
  const invested = r2(amount - fxCost - fee);
  const terUsCost = r2(invested * terUs / 100);
  const dividends = r2(invested * yieldPct / 100);
  const withheld = r2(dividends * withholding / 100);
  const usFrictions = r2(fxCost + fee + terUsCost + withheld);
  const indiaTer = r2(amount * terIn / 100);
  const difference = r2(usFrictions - indiaTer);
  const lines = [
    line('fxCost', fxCost, 'inr'),
    line('fee', fee, 'inr'),
    line('terUs', terUsCost, 'inr'),
    line('withholding', withheld, 'inr', { dividends }),
  ];
  const after = [line('tcs', tcs, 'inr', { rateId: 'glb-tcs-rate', basis: tcsBase, thresholdId: 'glb-tcs-threshold' }), line('invested', invested, 'inr'), line('dividends', dividends, 'inr'), line('indiaTer', indiaTer, 'inr'), line('difference', difference, 'inr')];
  if (fx !== null) after.push(line('investedUsd', invested / fx, 'usd', { fx }));
  const V = (id) => rates[id].value;
  const formulaText = [
    `FX cost        = amount × spread = ${inr(amount)} × ${fnum(spread)}% = ${inr(fxCost)}`,
    `TCS            = max(0, amount + already remitted − ${V('glb-tcs-threshold')}) × ${V('glb-tcs-rate')} = ${inr(tcsBase)} × ${V('glb-tcs-rate')} = ${inr(tcs)}   (cash flow, credited against the year's tax)`,
    `invested       = amount − FX cost − fee = ${inr(invested)}`,
    `US fund cost   = invested × TER = ${inr(invested)} × ${fnum(terUs)}% = ${inr(terUsCost)}`,
    `dividends      = invested × yield = ${inr(dividends)};  withholding = dividends × ${fnum(withholding)}% = ${inr(withheld)}`,
    `US frictions   = FX cost + fee + US fund cost + withholding = ${inr(usFrictions)}   (TCS listed separately)`,
    `India fund cost = amount × TER = ${inr(amount)} × ${fnum(terIn)}% = ${inr(indiaTer)}`,
    `difference     = US frictions − India fund cost = ${inr(difference)}`,
    ...(fx !== null ? [`$ view         = invested ÷ ${fnum(fx)} ₹/$ = $${fnum(invested / fx)}`] : []),
  ].join('\n');
  const warnings = [];
  if (tcs > 0) warnings.push({ key: 'tcsNote' });
  return { big: { key: 'usFrictions', value: usFrictions, kind: 'inr' }, sub: [{ key: 'indiaTer', value: indiaTer, kind: 'inr' }, ...(tcs > 0 ? [{ key: 'tcs', value: tcs, kind: 'inr' }] : [])], lines, total: usFrictions, after, kpis: [{ key: 'tcs', value: tcs, kind: 'inr' }, { key: 'indiaTer', value: indiaTer, kind: 'inr' }, { key: 'difference', value: difference, kind: 'inr', delta: difference > 0 ? 'down' : difference < 0 ? 'up' : null }], warnings, formulaText };
}

/* ---------- dispatcher (one entry point for the build, the tests and tool-ui.js) ---------- */

/** Broker-example brokerage figures from the register rows: { rate (fraction per order), cap (₹), flat (₹) }. */
export function brokerFrom(rates) {
  const pctCap = rates['chg-brokerage-example-intraday-futures']?.parts || [];
  const flat = rates['chg-brokerage-example-options']?.parts || [];
  return {
    rate: pctCap.find((p) => p.raw.endsWith('%'))?.num ?? 0,
    cap: pctCap.find((p) => p.currency === '₹')?.num ?? 0,
    flat: flat.find((p) => p.currency === '₹')?.num ?? 0,
  };
}

/** The seven new-regime slab rows (tax-slab-1 … tax-slab-7) parsed into bands, in order. */
export function slabsFrom(rates) {
  const rows = Object.keys(rates).filter((id) => /^tax-slab-\d+$/.test(id)).sort((a, b) => Number(a.split('-')[2]) - Number(b.split('-')[2]));
  const bands = rows.map((id) => slab(rates[id].value));
  if (!bands.length || bands.some((b) => !b)) throw new Error('slabsFrom: tax-slab-n rows missing or unparsable');
  return bands;
}

export const TOOL_IDS = ['charges', 'position-size', 'expectancy-kelly', 'expected-move', 'black-scholes-greeks', 'fo-tax-estimator', 'sip-compounding', 'us-vs-india-investing-cost'];

/** Run the calculator `id` on form inputs with the page's rate map. */
export function run(id, inputs, rates = {}) {
  switch (id) {
    case 'charges': return charges(inputs, rates, brokerFrom(rates));
    case 'position-size': return positionSize(inputs, rates);
    case 'expectancy-kelly': return expectancyKelly(inputs);
    case 'expected-move': return expectedMove(inputs, rates);
    case 'black-scholes-greeks': return blackScholes(inputs);
    case 'fo-tax-estimator': return foTax(inputs, rates, slabsFrom(rates));
    case 'sip-compounding': return sip(inputs);
    case 'us-vs-india-investing-cost': return usVsIndia(inputs, rates);
    default: throw new Error(`unknown tool ${id}`);
  }
}
