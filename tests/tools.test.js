// The eight calculators (pack L §7): every worked example against calc.js with pack L's exact figures, the additional
// checks (futures, delivery, exercise toggle, tax additional check, Kelly edge case), boundary RangeErrors, the register
// readers (num / slab) for every fact id the registry lists, the registry's `expect` maps, and the built tool pages.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite } from '../src/build/site.js';
import { SITE } from '../src/build/config.js';
import { STRINGS } from '../src/build/strings.js';
import { TOOLS, byTool, fieldShown } from '../src/build/tools.js';
import { counts, toolValues } from '../src/build/pages.js';
import { num, parse, parts, slab, rateMap } from '../src/tools/rates.js';
import { r2, r4, charges, positionSize, expectancyKelly, expectedMove, blackScholes, impliedVol, normCdf, foTax, slabTax, sip, usVsIndia, run, brokerFrom, slabsFrom, TOOL_IDS } from '../src/tools/calc.js';
import { fmt, inr, usd, pct } from '../src/tools/format.js';
import { resultValues } from '../src/tools/view.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const facts = JSON.parse(await readFile(path.join(root, 'content', 'data', 'facts.json'), 'utf8'));
const R = rateMap(facts);
const broker = brokerFrom(R);
const slabs = slabsFrom(R);
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol + 1e-12, `${msg}: ${a} vs ${b} (±${tol})`);
const val = (res, key) => [...res.lines, ...(res.after || []), ...res.kpis, res.big].find((x) => x.key === key)?.value;

/* ---------- rates.js: the register readers ---------- */

test('num() reads the numeric core of register values: percentages as fractions, lakh/crore multipliers, en-IN and en-US grouping, units', () => {
  assert.equal(num('0.15%'), 0.0015);
  assert.equal(num('5.50%'), 0.055);
  assert.equal(num('₹307 per crore'), 307);
  assert.deepEqual(parse('₹307 per crore'), { num: 307, unit: 'per crore', raw: '₹307', currency: '₹' });
  assert.equal(num('₹10 lakh'), 1000000);
  assert.equal(num('₹1,25,000'), 125000);
  assert.equal(num('65'), 65);
  assert.equal(num('1,800'), 1800);
  assert.equal(num('$250,000'), 250000);
  assert.equal(num('₹2 crore'), 2e7);
  assert.deepEqual(parse('8 tax years'), { num: 8, unit: 'tax years', raw: '8', currency: '' });
  assert.equal(num('₹20 or 0.03%, whichever is lower'), 20);
  assert.deepEqual(parts('₹20 or 0.03%, whichever is lower').map((p) => [p.num, p.raw]), [[20, '₹20'], [0.0003, '0.03%']]);
  assert.equal(num('₹0.05'), 0.05);
  assert.equal(num('Discontinued'), null);
  assert.equal(parse('Tuesday'), null);
});

test('slab() parses the three slab forms and rejects non-slabs', () => {
  assert.deepEqual(slab('up to ₹4,00,000: nil'), { lo: 0, hi: 400000, rate: 0 });
  assert.deepEqual(slab('₹4,00,001–₹8,00,000: 5%'), { lo: 400001, hi: 800000, rate: 0.05 });
  assert.deepEqual(slab('above ₹24,00,000: 30%'), { lo: 2400001, hi: Infinity, rate: 0.3 });
  assert.equal(slab('65'), null);
  assert.equal(slab('09:15–15:30 IST'), null);
});

test('every fact id the registry lists exists in the register and parses to the number the calculators use', () => {
  const expected = {
    'chg-stt-equity-delivery': 0.001, 'chg-stt-equity-intraday': 0.00025, 'chg-stt-futures': 0.0005, 'chg-stt-options-sell': 0.0015, 'chg-stt-options-exercise': 0.0015,
    'chg-nse-txn-equity': 307, 'chg-nse-txn-futures': 183, 'chg-nse-txn-options': 3553, 'chg-ipft-nse': 0.01, 'chg-sebi-fee': 10,
    'chg-stamp-delivery': 0.00015, 'chg-stamp-intraday': 0.00003, 'chg-stamp-futures': 0.00002, 'chg-stamp-options': 0.00003, 'chg-gst-rate': 0.18,
    'chg-dp-example-broker': 15.34, 'chg-brokerage-example-delivery': 0, 'chg-brokerage-example-intraday-futures': 20, 'chg-brokerage-example-options': 20,
    'fo-nifty-lot': 65, 'fo-sensex-lot': 20, 'fo-freeze-qty-nifty': 1800, 'fo-expiry-day-elm-addon': 0.02, 'opt-tick-size-options': 0.05, 'mac-repo-rate': 0.055,
    'tax-std-deduction-new-regime': 75000, 'tax-rebate-156': 60000, 'tax-rebate-156-income-limit': 1200000, 'tax-cess-rate': 0.04, 'tax-spec-loss-carry-forward': 4, 'tax-nonspec-loss-carry-forward': 8,
    'tax-slab-1': 400000, 'tax-slab-2': 400001, 'tax-slab-3': 800001, 'tax-slab-4': 1200001, 'tax-slab-5': 1600001, 'tax-slab-6': 2000001, 'tax-slab-7': 2400000,
    'glb-tcs-threshold': 1000000, 'glb-tcs-rate': 0.2, 'glb-us-dividend-withholding-dtaa': 0.25, 'glb-us-dividend-withholding-default': 0.3, 'glb-lrs-limit': 250000, 'glb-voo-expense-ratio': 0.0003, 'inv-nifty50-ter-direct': 0.0025,
  };
  const listed = new Set(TOOLS.flatMap((t) => t.factIds));
  for (const id of listed) {
    assert.ok(R[id], `${id} is in the register`);
    assert.ok(id in expected, `${id} has an expected numeric reading in this test`);
    near(R[id].num, expected[id], 1e-12, id);
  }
  for (const id of Object.keys(expected)) assert.ok(listed.has(id), `${id} is listed by a tool`);
  assert.deepEqual(slabs.map((s) => [s.lo, s.hi, s.rate]), [[0, 400000, 0], [400001, 800000, 0.05], [800001, 1200000, 0.1], [1200001, 1600000, 0.15], [1600001, 2000000, 0.2], [2000001, 2400000, 0.25], [2400001, Infinity, 0.3]]);
  assert.deepEqual(broker, { rate: 0.0003, cap: 20, flat: 20 });
  assert.throws(() => rateMap(facts, ['no-such-fact']), /not in the register/);
});

/* ---------- rounding and formatting ---------- */

test('r2 rounds half-up (away from zero) to the paise and never yields −0; formatters group en-IN / en-US with a real minus sign', () => {
  assert.equal(r2(0.195), 0.2); assert.equal(r2(749.125), 749.13); assert.equal(r2(14.625), 14.63); assert.equal(r2(4850.625), 4850.63);
  assert.equal(r2(0.00003 * 6500), 0.2); assert.equal(r2(0.0005 * 1498250), 749.13); assert.equal(r2(0.0015 * 150 * 65), 14.63);
  assert.equal(r2(-1.005), -1.01); assert.equal(Object.is(r2(-0.001), -0), false); assert.equal(r4(0.00104013), 0.001);
  assert.equal(inr(125120.35), '₹1,25,120.35'); assert.equal(inr(-1234.5), '−₹1,234.50'); assert.equal(inr(0), '₹0.00');
  assert.equal(usd(1234.5), '$1,234.50'); assert.equal(pct(14.444), '14.44%'); assert.equal(fmt(NaN, 'inr'), '—'); assert.equal(fmt(Infinity, 'num2'), '—');
  assert.equal(fmt([22770, 23230], 'range'), '22,770.00–23,230.00'); assert.equal(fmt(-13.008, 'num2'), '−13.01'); assert.equal(fmt(0.26, 'R'), '0.26R');
});

/* ---------- 7.1 charges ---------- */

test('charges example 1 (equity intraday, 100 × ₹1,000 → ₹1,010, 0.03% capped ₹20): total ₹82.97, net ₹917.03', () => {
  const r = charges({ segment: 'equity-intraday', qty: 100, buy: 1000, sell: 1010, model: 'pct-cap' }, R, broker);
  assert.deepEqual(Object.fromEntries(r.lines.map((l) => [l.key, l.value])), { brokerage: 40, stt: 25.25, exchange: 6.17, sebi: 0.2, stamp: 3, gst: 8.35 });
  assert.equal(r.total, 82.97); assert.equal(val(r, 'gross'), 1000); assert.equal(val(r, 'net'), 917.03); assert.equal(val(r, 'breakEven'), 0.83);
  assert.equal(r.lines[0].buy, 20); assert.equal(r.lines[0].sell, 20);
  assert.match(r.formulaText, /STT {7}= 0\.025% × TS/); assert.match(r.formulaText, /min\(0\.03% × TB, ₹20\.00\)/);
});

test('charges example 2 (Nifty option, 1 lot × 65, ₹100 → ₹120, flat ₹20): total ₹65.11, net ₹1,234.89', () => {
  const r = charges({ segment: 'options', lots: 1, lotSize: 65, buy: 100, sell: 120, model: 'flat' }, R, broker);
  assert.deepEqual(Object.fromEntries(r.lines.map((l) => [l.key, l.value])), { brokerage: 40, stt: 11.7, exchange: 5.08, sebi: 0.01, stamp: 0.2, gst: 8.12 });
  assert.equal(r.total, 65.11); assert.equal(val(r, 'gross'), 1300); assert.equal(val(r, 'net'), 1234.89);
});

test('charges additional checks: futures, delivery with DP, the exercise toggle, the freeze warning', () => {
  const fut = charges({ segment: 'futures', lots: 1, lotSize: 65, buy: 23000, sell: 23050, model: 'pct-cap' }, R, broker);
  assert.deepEqual(Object.fromEntries(fut.lines.map((l) => [l.key, l.value])), { brokerage: 40, stt: 749.13, exchange: 54.78, sebi: 2.99, stamp: 29.9, gst: 17.6 });
  assert.equal(fut.total, 894.4); assert.equal(val(fut, 'net'), 2355.6); assert.equal(val(fut, 'breakEven'), 13.76);
  const del = charges({ segment: 'equity-delivery', qty: 50, buy: 2000, sell: 2200, model: 'zero' }, R, broker);
  assert.deepEqual(Object.fromEntries(del.lines.map((l) => [l.key, l.value])), { brokerage: 0, stt: 210, exchange: 6.45, sebi: 0.21, stamp: 15, dp: 15.34, gst: 1.2 });
  assert.equal(del.total, 248.2);
  const ex = charges({ segment: 'options', lots: 1, lotSize: 65, buy: 100, exercised: true, intrinsic: 150, model: 'flat' }, R, broker);
  assert.equal(val(ex, 'stt'), 14.63, 'STT on intrinsic value 0.15% × 150 × 65');
  assert.equal(ex.lines.find((l) => l.key === 'stt').rateId, 'chg-stt-options-exercise');
  assert.equal(ex.lines[0].sell, 0, 'no sell order at exercise');
  const big = charges({ segment: 'options', lots: 28, lotSize: 65, buy: 100, sell: 120, model: 'flat' }, R, broker);
  assert.deepEqual(big.warnings.map((w) => w.key), ['warnFreeze']);
  const custom = charges({ segment: 'equity-intraday', qty: 100, buy: 1000, sell: 1010, model: 'custom', customRate: 0.01, customCap: 0 }, R, broker);
  assert.equal(val(custom, 'brokerage'), 20.1, 'custom 0.01% with no cap: 10 + 10.10');
});

test('charges rejects out-of-range input with a RangeError naming the field', () => {
  const base = { segment: 'equity-intraday', qty: 100, buy: 1000, sell: 1010, model: 'pct-cap' };
  for (const [patch, field] of [[{ qty: 0 }, 'qty'], [{ qty: 1.5 }, 'qty'], [{ qty: 1e7 + 1 }, 'qty'], [{ buy: 0 }, 'buy'], [{ sell: '' }, 'sell'], [{ sell: 'abc' }, 'sell'], [{ segment: 'bse' }, 'segment'], [{ model: 'free' }, 'model'], [{ model: 'custom', customRate: 2, customCap: 20 }, 'customRate']]) {
    assert.throws(() => charges({ ...base, ...patch }, R, broker), (e) => e instanceof RangeError && e.field === field, `${JSON.stringify(patch)} → ${field}`);
  }
  assert.throws(() => charges({ segment: 'options', lots: 0, lotSize: 65, buy: 100, sell: 120, model: 'flat' }, R, broker), (e) => e.field === 'lots');
  assert.throws(() => charges({ segment: 'options', lots: 1, lotSize: 65, buy: 100, exercised: true, intrinsic: '', model: 'flat' }, R, broker), (e) => e.field === 'intrinsic');
});

/* ---------- 7.2 position size ---------- */

test('position-size example 1 (₹5,00,000, 1%, ₹1,000 → ₹990): 500 shares, notional ₹5,00,000, 5× margin ₹1,00,000', () => {
  const r = positionSize({ mode: 'shares', capital: 500000, riskPct: 1, entry: 1000, stop: 990, leverage: 5 }, R);
  assert.equal(val(r, 'risk'), 5000); assert.equal(val(r, 'perUnit'), 10); assert.equal(val(r, 'qty'), 500); assert.equal(val(r, 'notional'), 500000); assert.equal(val(r, 'margin'), 100000);
  assert.deepEqual(r.warnings, []);
});

test('position-size example 2 (₹3,00,000, 1%, option ₹120 → stop ₹90, lot 65): 1 lot, premium at risk ₹7,800, loss at stop ₹1,950', () => {
  const r = positionSize({ mode: 'lots', capital: 300000, riskPct: 1, entry: 120, stop: 90, lotSize: 65 }, R);
  assert.equal(val(r, 'risk'), 3000); assert.equal(val(r, 'perLot'), 1950); assert.equal(val(r, 'lots'), 1); assert.equal(val(r, 'premiumAtRisk'), 7800); assert.equal(val(r, 'lossAtStop'), 1950);
  near(r.sub.find((s) => s.key === 'raw').value, 1.5385, 0.0001, 'raw lots before flooring');
  const zero = positionSize({ mode: 'lots', capital: 100000, riskPct: 1, entry: 120, stop: 90, lotSize: 65 }, R);
  assert.equal(val(zero, 'lots'), 0); assert.deepEqual(zero.warnings.map((w) => w.key), ['warnZeroLots']);
  const freeze = positionSize({ mode: 'lots', capital: 1e8, riskPct: 10, entry: 120, stop: 90, lotSize: 65 }, R);
  assert.ok(freeze.warnings.some((w) => w.key === 'warnFreeze'), 'units above the Nifty freeze quantity warn');
  const capped = positionSize({ mode: 'shares', capital: 500000, riskPct: 1, entry: 1000, stop: 990, leverage: 5, maxLoss: 2000 }, R);
  assert.equal(val(capped, 'risk'), 2000); assert.equal(val(capped, 'qty'), 200);
  assert.throws(() => positionSize({ mode: 'shares', capital: 500000, riskPct: 1, entry: 1000, stop: 1000, leverage: 5 }, R), (e) => e.field === 'stop');
  assert.throws(() => positionSize({ mode: 'shares', capital: 500000, riskPct: 11, entry: 1000, stop: 990 }, R), (e) => e.field === 'riskPct');
  assert.throws(() => positionSize({ mode: 'shares', capital: 0, riskPct: 1, entry: 1000, stop: 990 }, R), (e) => e.field === 'capital');
});

/* ---------- 7.3 expectancy and Kelly ---------- */

test('expectancy-kelly examples: E 0.26R / Kelly 14.44% / ₹1,30,000; E 0.12R / Kelly 12.00% / ₹60,000; p = 50% with 1:1 is no edge', () => {
  const a = expectancyKelly({ p: 45, W: 1.8, L: 1, R: 5000, N: 100 });
  assert.equal(val(a, 'expectancy'), 0.26); near(val(a, 'payoff'), 1.8, 1e-9, 'b'); near(val(a, 'kelly'), 14.44, 0.005, 'Kelly %'); near(val(a, 'halfKelly'), 7.22, 0.005, 'half'); assert.equal(val(a, 'expectedRupees'), 130000);
  const b = expectancyKelly({ p: 60, W: 1, L: 1.2, R: 5000, N: 100 });
  assert.equal(val(b, 'expectancy'), 0.12); near(val(b, 'payoff'), 0.8333, 0.0001, 'b'); near(val(b, 'kelly'), 12, 0.005, 'Kelly %'); near(val(b, 'halfKelly'), 6, 0.005, 'half'); assert.equal(val(b, 'expectedRupees'), 60000);
  const edge = expectancyKelly({ p: 50, W: 1, L: 1 });
  assert.equal(val(edge, 'expectancy'), 0); assert.equal(val(edge, 'kelly'), 0); assert.deepEqual(edge.warnings.map((w) => w.key), ['noEdge']);
  assert.equal(edge.lines.some((l) => l.key === 'expectedRupees'), false, 'no ₹ line without R');
  for (const [patch, field] of [[{ p: 0 }, 'p'], [{ p: 100 }, 'p'], [{ W: 0 }, 'W'], [{ L: -1 }, 'L'], [{ N: 0 }, 'N'], [{ N: 2.5 }, 'N']]) assert.throws(() => expectancyKelly({ p: 45, W: 1.8, L: 1, N: 100, ...patch }), (e) => e.field === field, field);
});

/* ---------- 7.4 expected move ---------- */

test('expected-move examples: Nifty ±230 (±1.00%) / IV ±382.22; Sensex ±600 (±0.81%) / IV ±428.95; 0.8× rule; per-lot line from the register', () => {
  const a = expectedMove({ S: 23000, straddle: 230, sigma: 12, days: 7, index: 'nifty' }, R);
  assert.equal(val(a, 'moveA'), 230); near(val(a, 'pctA'), 1, 0.005, 'pctA'); assert.deepEqual(val(a, 'rangeA'), [22770, 23230]);
  assert.equal(val(a, 'moveB'), 382.22); near(val(a, 'pctB'), 1.66, 0.005, 'pctB'); assert.deepEqual(val(a, 'rangeB'), [22617.78, 23382.22]); assert.equal(val(a, 'rule'), 184); assert.equal(val(a, 'perLot'), 14950);
  const b = expectedMove({ S: 74500, straddle: 600, sigma: 11, days: 1, index: 'sensex' }, R);
  assert.equal(val(b, 'moveA'), 600); near(val(b, 'pctA'), 0.81, 0.005, 'pctA'); assert.deepEqual(val(b, 'rangeA'), [73900, 75100]);
  assert.equal(val(b, 'moveB'), 428.95); near(val(b, 'pctB'), 0.58, 0.005, 'pctB'); assert.deepEqual(val(b, 'rangeB'), [74071.05, 74928.95]); assert.equal(val(b, 'rule'), 480); assert.equal(val(b, 'perLot'), 12000);
  assert.equal(expectedMove({ S: 23000, straddle: 230, sigma: 12, days: 7, index: 'other' }, R).lines.some((l) => l.key === 'perLot'), false);
  for (const [patch, field] of [[{ S: 0 }, 'S'], [{ straddle: -1 }, 'straddle'], [{ sigma: 0 }, 'sigma'], [{ sigma: 501 }, 'sigma'], [{ days: 0 }, 'days'], [{ days: 3651 }, 'days'], [{ index: 'dow' }, 'index']]) assert.throws(() => expectedMove({ S: 23000, straddle: 230, sigma: 12, days: 7, index: 'nifty', ...patch }, R), (e) => e.field === field, field);
});

/* ---------- 7.5 Black-Scholes ---------- */

test('black-scholes example 1 (ATM 23,000, 7 days, r 6.5%, σ 12%): call 167.14, put 138.49, Greeks per pack L (±0.0001 / ±0.005 for ₹ Greeks)', () => {
  const r = blackScholes({ mode: 'price', S: 23000, K: 23000, days: 7, r: 6.5, sigma: 12, q: 0 });
  near(val(r, 'call'), 167.14, 0.01, 'call'); near(val(r, 'put'), 138.49, 0.01, 'put');
  near(val(r, 'deltaCall'), 0.5332, 0.0001, 'Δ call'); near(val(r, 'deltaPut'), -0.4668, 0.0001, 'Δ put'); near(val(r, 'gamma'), 0.00104, 0.0001, 'Γ');
  near(val(r, 'vega'), 12.66, 0.005, 'vega per 1%'); near(val(r, 'thetaCall'), -13.01, 0.005, 'θ call/day'); near(val(r, 'thetaPut'), -8.92, 0.005, 'θ put/day');
  near(val(r, 'rhoCall'), 2.32, 0.005, 'ρ call'); near(val(r, 'rhoPut'), -2.09, 0.005, 'ρ put');
  near(normCdf(0), 0.5, 1e-12, 'N(0)'); near(normCdf(1.959964), 0.975, 1e-6, 'N(1.96)'); near(normCdf(-8), 6.22e-16, 1e-16, 'tail');
});

test('black-scholes example 2 (IV solver: call 150, S 74,500, K 75,000, 2 days): IV 15.17%, Δ 0.2883, Γ 0.0004, vega 18.82, θ −75.18, put by parity 623.29; no-solution bounds', () => {
  const r = blackScholes({ mode: 'iv', type: 'call', price: 150, S: 74500, K: 75000, days: 2, r: 6.5, q: 0 });
  near(val(r, 'iv'), 15.17, 0.005, 'IV %'); assert.equal(fmt(val(r, 'iv'), 'pct'), '15.17%');
  near(val(r, 'deltaCall'), 0.2883, 0.0001, 'Δ'); near(val(r, 'gamma'), 0.000408, 0.0001, 'Γ'); near(val(r, 'vega'), 18.82, 0.005, 'vega'); near(val(r, 'thetaCall'), -75.18, 0.005, 'θ'); near(val(r, 'put'), 623.29, 0.01, 'put (parity)');
  near(val(r, 'call'), 150, 0.01, 'the given price reproduces');
  const sigma = impliedVol(150, 'call', 74500, 75000, 2 / 365, 0.065, 0);
  near(sigma * 100, 15.17, 0.005, 'impliedVol()');
  assert.equal(impliedVol(10, 'call', 23000, 22000, 7 / 365, 0.065, 0), null, 'below intrinsic: no solution');
  assert.equal(impliedVol(23000, 'call', 23000, 23000, 7 / 365, 0.065, 0), null, 'at or above the spot bound: no solution');
  const none = blackScholes({ mode: 'iv', type: 'call', price: 10, S: 23000, K: 22000, days: 7, r: 6.5, q: 0 });
  assert.deepEqual(none.warnings.map((w) => w.key), ['noSolution']); assert.equal(none.big.value, null); assert.equal(fmt(none.big.value, none.big.kind), '—');
  const putIv = blackScholes({ mode: 'iv', type: 'put', price: 623.29, S: 74500, K: 75000, days: 2, r: 6.5, q: 0 });
  near(val(putIv, 'iv'), 15.17, 0.01, 'put IV reproduces the same σ');
  for (const [patch, field] of [[{ S: 0 }, 'S'], [{ K: -1 }, 'K'], [{ days: 0 }, 'days'], [{ r: -6 }, 'r'], [{ r: 51 }, 'r'], [{ q: 21 }, 'q'], [{ sigma: 0 }, 'sigma'], [{ mode: 'x' }, 'mode']]) assert.throws(() => blackScholes({ mode: 'price', S: 23000, K: 23000, days: 7, r: 6.5, sigma: 12, q: 0, ...patch }), (e) => e.field === field, field);
  assert.throws(() => blackScholes({ mode: 'iv', type: 'call', price: 0, S: 23000, K: 23000, days: 7, r: 6.5 }), (e) => e.field === 'price');
  assert.throws(() => blackScholes({ mode: 'iv', type: 'straddle', price: 10, S: 23000, K: 23000, days: 7, r: 6.5 }), (e) => e.field === 'type');
});

/* ---------- 7.6 F&O tax ---------- */

test('fo-tax example 1 (salary ₹12,00,000, F&O +₹3,00,000): total income ₹14,25,000, slab tax ₹93,750, cess ₹3,750, total ₹97,500', () => {
  const r = foTax({ salary: 1200000, fo: 300000, intraday: 0, other: 0 }, R, slabs);
  assert.equal(val(r, 'salaryTaxable'), 1125000); assert.equal(val(r, 'totalIncome'), 1425000); assert.equal(val(r, 'slabTax'), 93750); assert.equal(val(r, 'rebate'), 0); assert.equal(val(r, 'cess'), 3750); assert.equal(r.total, 97500);
  assert.deepEqual(slabTax(1425000, slabs).bands.filter((b) => b.tax > 0).map((b) => b.tax), [20000, 40000, 33750]);
});

test('fo-tax example 2 (salary ₹9,00,000, F&O −₹1,50,000): rebate wipes ₹22,500, total ₹0, ₹1,50,000 carried forward (non-speculative, 8 years)', () => {
  const r = foTax({ salary: 900000, fo: -150000, intraday: 0, other: 0 }, R, slabs);
  assert.equal(val(r, 'salaryTaxable'), 825000); assert.equal(val(r, 'totalIncome'), 825000); assert.equal(val(r, 'slabTax'), 22500); assert.equal(val(r, 'rebate'), 22500); assert.equal(r.total, 0);
  assert.equal(val(r, 'carryNonSpec'), 150000); assert.equal(r.lines.find((l) => l.key === 'carryNonSpec').rateId, 'tax-nonspec-loss-carry-forward');
  assert.ok(r.warnings.some((w) => w.key === 'carryNote'));
});

test('fo-tax additional check (₹15,00,000 + F&O ₹8,00,000 − intraday ₹50,000): ₹22,25,000, slab ₹2,56,250, total ₹2,66,500, ₹50,000 speculation loss carried 4 years; set-off and marginal relief', () => {
  const r = foTax({ salary: 1500000, fo: 800000, intraday: -50000, other: 0 }, R, slabs);
  assert.equal(val(r, 'totalIncome'), 2225000); assert.equal(val(r, 'slabTax'), 256250); assert.equal(val(r, 'cess'), 10250); assert.equal(r.total, 266500); assert.equal(val(r, 'carrySpec'), 50000);
  assert.equal(r.lines.find((l) => l.key === 'carrySpec').rateId, 'tax-spec-loss-carry-forward');
  // s. 109: an F&O loss is set off against other income (never salary); s. 113: a speculation loss stays ring-fenced
  const setoff = foTax({ salary: 1200000, fo: -300000, intraday: 50000, other: 40000 }, R, slabs);
  assert.equal(val(setoff, 'totalIncome'), 1125000); assert.equal(val(setoff, 'carryNonSpec'), 210000, 'F&O loss offsets the intraday profit and the interest; ₹2,10,000 is carried forward');
  const spec = foTax({ salary: 0, fo: 200000, intraday: -80000, other: 0 }, R, slabs);
  assert.equal(val(spec, 'totalIncome'), 200000); assert.equal(val(spec, 'carrySpec'), 80000, 'speculation loss cannot touch the F&O profit');
  const relief = foTax({ salary: 1285000, fo: 0, intraday: 0, other: 0 }, R, slabs); // total income ₹12,10,000
  assert.equal(val(relief, 'totalIncome'), 1210000); assert.equal(val(relief, 'slabTax'), 61500); assert.equal(val(relief, 'rebate'), 51500, 'marginal relief: tax capped at the ₹10,000 above the limit'); assert.equal(r2(val(relief, 'slabTax') - val(relief, 'rebate')), 10000);
  const bf = foTax({ salary: 0, fo: 500000, intraday: 0, other: 0, bfNonSpec: 200000 }, R, slabs);
  assert.equal(val(bf, 'totalIncome'), 300000, 'brought-forward business loss set off against F&O profit');
  for (const [patch, field] of [[{ salary: -1 }, 'salary'], [{ fo: 1e10 + 1 }, 'fo'], [{ intraday: 'x' }, 'intraday'], [{ other: -5 }, 'other']]) assert.throws(() => foTax({ salary: 1, fo: 0, intraday: 0, other: 0, ...patch }, R, slabs), (e) => e.field === field, field);
});

/* ---------- 7.7 SIP and lumpsum ---------- */

test('sip example 1 (₹10,000/month, 12%, 20 years, 6% inflation): FV ₹99,91,479.19, invested ₹24,00,000, real ₹31,15,390.44 (±₹1)', () => {
  const r = sip({ mode: 'sip', amount: 10000, rate: 12, years: 20, inflation: 6 });
  near(val(r, 'fv'), 9991479.19, 1, 'FV'); assert.equal(val(r, 'invested'), 2400000); near(val(r, 'gains'), 7591479.19, 1, 'gains'); near(val(r, 'realValue'), 3115390.44, 1, 'real'); near(val(r, 'realCagr'), 5.66, 0.005, 'real CAGR');
});

test('sip example 2 (lumpsum ₹5,00,000, 10%, 15 years, 5% inflation): FV ₹20,88,624.08, real ₹10,04,663.90, real CAGR 4.76%', () => {
  const r = sip({ mode: 'lumpsum', amount: 500000, rate: 10, years: 15, inflation: 5 });
  near(val(r, 'fv'), 2088624.08, 1, 'FV'); near(val(r, 'realValue'), 1004663.9, 1, 'real'); near(val(r, 'realCagr'), 4.76, 0.005, 'real CAGR');
  assert.equal(val(sip({ mode: 'sip', amount: 1000, rate: 0, years: 2 }), 'fv'), 24000, 'zero return: FV = contributions');
  for (const [patch, field] of [[{ amount: 0 }, 'amount'], [{ rate: 51 }, 'rate'], [{ years: 0 }, 'years'], [{ years: 61 }, 'years'], [{ years: 2.5 }, 'years'], [{ inflation: 31 }, 'inflation'], [{ mode: 'x' }, 'mode']]) assert.throws(() => sip({ mode: 'sip', amount: 10000, rate: 12, years: 20, inflation: 6, ...patch }), (e) => e.field === field, field);
});

/* ---------- 7.8 US vs India ---------- */

test('us-vs-india example 1 (₹15,00,000, 0.5% spread): TCS ₹1,00,000, invested ₹14,92,500, withholding ₹4,850.63, US frictions ₹12,798.38, India TER ₹3,000', () => {
  const r = usVsIndia({ amount: 1500000, spread: 0.5, fee: 0, already: 0, terUs: 0.03, yieldPct: 1.3, withholding: 25, terIn: 0.2 }, R);
  assert.equal(val(r, 'fxCost'), 7500); assert.equal(val(r, 'tcs'), 100000); assert.equal(val(r, 'invested'), 1492500); assert.equal(val(r, 'terUs'), 447.75); assert.equal(val(r, 'dividends'), 19402.5); assert.equal(val(r, 'withholding'), 4850.63);
  assert.equal(r.total, 12798.38); assert.equal(val(r, 'indiaTer'), 3000); assert.equal(val(r, 'difference'), 9798.38); assert.ok(r.warnings.some((w) => w.key === 'tcsNote'));
});

test('us-vs-india example 2 (₹8,00,000, 1% spread, ₹500 fee): TCS ₹0, invested ₹7,91,500, US frictions ₹11,309.83, India TER ₹1,600; $ view and TCS with earlier remittances', () => {
  const r = usVsIndia({ amount: 800000, spread: 1, fee: 500, already: 0, terUs: 0.03, yieldPct: 1.3, withholding: 25, terIn: 0.2 }, R);
  assert.equal(val(r, 'fxCost'), 8000); assert.equal(val(r, 'tcs'), 0); assert.equal(val(r, 'invested'), 791500); assert.equal(val(r, 'terUs'), 237.45); assert.equal(val(r, 'dividends'), 10289.5); assert.equal(val(r, 'withholding'), 2572.38);
  assert.equal(r.total, 11309.83); assert.equal(val(r, 'indiaTer'), 1600);
  const fx = usVsIndia({ amount: 800000, spread: 1, fee: 500, already: 500000, terUs: 0.03, yieldPct: 1.3, withholding: 25, terIn: 0.2, fx: 83.5 }, R);
  assert.equal(val(fx, 'tcs'), 60000, 'TCS on the ₹3,00,000 above the threshold once earlier remittances count'); near(val(fx, 'investedUsd'), 791500 / 83.5, 0.01, '$ view');
  for (const [patch, field] of [[{ amount: 0 }, 'amount'], [{ spread: 11 }, 'spread'], [{ terUs: -1 }, 'terUs'], [{ withholding: 101 }, 'withholding'], [{ fx: 0 }, 'fx'], [{ yieldPct: 21 }, 'yieldPct']]) assert.throws(() => usVsIndia({ amount: 800000, spread: 1, fee: 500, terUs: 0.03, yieldPct: 1.3, withholding: 25, terIn: 0.2, ...patch }, R), (e) => e.field === field, field);
});

/* ---------- registry and dispatcher ---------- */

test('the registry holds the eight tools in pack L order, each with two worked examples whose expect map equals calc.js output key for key', () => {
  assert.deepEqual(TOOLS.map((t) => t.id), TOOL_IDS);
  assert.deepEqual(TOOL_IDS, ['charges', 'position-size', 'expectancy-kelly', 'expected-move', 'black-scholes-greeks', 'fo-tax-estimator', 'sip-compounding', 'us-vs-india-investing-cost']);
  for (const t of TOOLS) {
    assert.equal(t.schema, 'WebPage', t.id);
    assert.ok(t.title && t.summary, `${t.id} title and summary`);
    assert.equal(t.examples.length, 2, `${t.id} has two worked examples`);
    const rates = rateMap(facts, t.factIds);
    for (const [i, ex] of t.examples.entries()) {
      assert.ok(ex.label, `${t.id} example ${i + 1} label`);
      const values = toolValues(t, rates, ex);
      const inputs = {};
      for (const f of t.fields) if (f.type !== 'static' && fieldShown(f, values)) inputs[f.key] = values[f.key];
      const rendered = resultValues(run(t.id, inputs, rates));
      assert.deepEqual(rendered, ex.expect, `${t.id} example ${i + 1}: rendered keys/values equal the expect map`);
    }
    const T = STRINGS.tools[t.id];
    assert.ok(T, `strings for ${t.id}`);
    for (const f of t.fields) assert.ok(T.fields[f.key]?.label || f.type === 'static', `${t.id}: label for field ${f.key}`);
    for (const f of t.fields.filter((x) => x.type === 'segment' || x.type === 'select')) for (const o of f.options) assert.ok(T.fields[f.key].options?.[o], `${t.id}: option text ${f.key}=${o}`);
    assert.equal(T.examples.length, 2, `${t.id}: two example labels`);
  }
  assert.equal(counts({ guides: [], playbooks: [], glossary: [], facts, changelog: [], pages: {}, library: { courses: [], books: [] } }).tools, 8);
  assert.throws(() => run('no-such-tool', {}, R), /unknown tool/);
  assert.equal(byTool('charges').guide, 'what-a-trade-costs');
});

/* ---------- built pages ---------- */

const out = await mkdtemp(path.join(tmpdir(), `${SITE.slug}-tools-`));
await buildSite({ root, outDir: out, basePath: SITE.basePath });
const read = (p) => readFile(path.join(out, p), 'utf8');

test('tools/index.html lists the eight calculators; each tool page exists with one h1, the rates block for every factId, no submit button, ≤ 44-char brokerage options, the module script and the templates', async () => {
  const index = await read('tools/index.html');
  assert.equal((index.match(/class="card card-link"/g) || []).length, 8);
  for (const t of TOOLS) assert.ok(index.includes(`href="../tools/${t.id}/"`), `index links ${t.id}`);
  for (const t of TOOLS) {
    const html = await read(`tools/${t.id}/index.html`);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${t.id}: one h1`);
    assert.ok(html.includes(`<h1>${t.title.replace(/&/g, '&amp;')}</h1>`), `${t.id}: h1 is the title`);
    for (const id of t.factIds) assert.ok(html.includes(`<li id="rate-${id}">`), `${t.id}: rates block lists ${id}`);
    assert.ok(!/<button[^>]*type="submit"/.test(html.replace(/<dialog[\s\S]*?<\/dialog>/, '')), `${t.id}: no submit button on the page`);
    assert.ok(!/<input[^>]*type="submit"/.test(html), `${t.id}: no submit input`);
    assert.match(html, /<script type="module" src="\.\.\/\.\.\/tool-ui\.js"><\/script>/, `${t.id}: tool-ui module`);
    for (const id of ['tool-strings', 'tool-rates', 'tool-examples']) assert.match(html, new RegExp(`<template id="${id}" data-json>`), `${t.id}: ${id} template`);
    assert.match(html, /<form class="card stack tool-form" aria-labelledby="form-title" data-tool="[a-z-]+" data-example="1" novalidate>/, `${t.id}: form`);
    assert.equal((html.match(/class="chip" type="button" aria-pressed="true" data-example="1"/g) || []).length, 1, `${t.id}: example 1 pressed`);
    assert.equal((html.match(/aria-pressed="false" data-example="2"/g) || []).length, 1, `${t.id}: example 2 not pressed`);
    assert.match(html, /<p class="visually-hidden" role="status" id="tool-announce">[^<]+<\/p>/, `${t.id}: one visually-hidden status line`);
    assert.equal((html.match(/role="status"/g) || []).length, 1, `${t.id}: the status line is the only live region`);
    assert.ok(!/aria-live/.test(html.replace(/<ul class="search-results"[^>]*>/, '')), `${t.id}: no other aria-live region`);
    assert.match(html, /<pre class="formula">[^<]{40,}<\/pre>/, `${t.id}: generated formula`);
    assert.match(html, /<a href="\.\.\/\.\.\/facts\/">verified facts register<\/a>/, `${t.id}: register link`);
    assert.match(html, /<p class="disclaimer">/, `${t.id}: disclaimer`);
    assert.match(/<nav class="site-nav"[^>]*>([\s\S]*?)<\/nav>/.exec(html)[1], /href="\.\.\/\.\.\/tools\/" aria-current="page"/, `${t.id}: Tools nav item current`);
    assert.match(html, /"@type":"WebPage"/, `${t.id}: JSON-LD WebPage`);
    // Example 1 is rendered into the page: every expected figure is present under its data-result key
    for (const [key, text] of Object.entries(t.examples[0].expect)) {
      const re = new RegExp(`data-result="${key}">${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<`);
      assert.match(html, re, `${t.id}: data-result ${key} = ${text}`);
    }
    assert.ok(!/NaN|Infinity/.test(/<main id="main">([\s\S]*?)<\/main>/.exec(html)[1].replace(/<template[\s\S]*?<\/template>/g, '')), `${t.id}: no NaN/Infinity`);
  }
  const charges = await read('tools/charges/index.html');
  const options = /<select class="input" id="model"[^>]*>([\s\S]*?)<\/select>/.exec(charges)[1].match(/<option[^>]*>([^<]*)<\/option>/g).map((o) => o.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&'));
  assert.equal(options.length, 4);
  for (const o of options) assert.ok(o.length <= 44, `brokerage option "${o}" is ${o.length} chars`);
  assert.deepEqual(options, ['0.03%/order, cap ₹20 (discount broker)', 'Flat ₹20 per order', 'Zero brokerage', 'Custom percentage…']);
  assert.match(charges, /<p class="static" aria-labelledby="exchange-label">NSE<\/p>/, 'Exchange is static text');
  assert.match(charges, /id="buy"[^>]*step="0\.01"[^>]*data-step-equity="0\.01" data-step-fo="0\.05"/, 'price step 0.01 for equity with the F&O tick on the input');
  assert.match(charges, /<div class="options seg-4" role="radiogroup">(<label class="option"><input type="radio" name="segment"[^>]*> [^<]+<\/label>){4}<\/div>/, 'four segment tiles');
  const bs = await read('tools/black-scholes-greeks/index.html');
  assert.match(bs, /id="r"[^>]*value="6\.5"/, 'example 1 sets r = 6.5%');
  assert.match(bs, /RBI repo rate <span class="fact fact-again" data-fact="mac-repo-rate"><span class="fact-value">5\.50%<\/span><\/span>, verified <time datetime="2026-11-01">1 Nov 2026<\/time>/, 'r hint names the register rate and its verified date');
  const em = await read('tools/expected-move/index.html');
  assert.match(em, /data-evidence="LORE"/, 'the 0.8× rule carries the Lore label');
  const files = ['tools/calc.js', 'tools/rates.js', 'tools/format.js', 'tools/view.js', 'tool-ui.js'];
  for (const f of files) assert.ok((await read(f)).length > 100, `${f} shipped`);
  const facts = JSON.parse(await read('facts/index.html').then(() => read('data/facts.json')));
  assert.ok(facts.some((f) => f.id === 'tax-rebate-156-income-limit'), 'the rebate income limit is a register row');
  const factsPage = await read('facts/index.html');
  assert.match(factsPage, /<tr id="fact-chg-stt-equity-intraday"[\s\S]*?<a href="\.\.\/tools\/charges\/">What this trade costs<\/a>/, 'facts/ "Used on" lists the tool');
});

test.after(async () => { await rm(out, { recursive: true, force: true }); });
