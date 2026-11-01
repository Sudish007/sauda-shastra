// Registry of the eight client-side calculators (design §6.9, pack L §6–§7). The build emits tools/index.html and one
// page per entry, validates `tools:` front matter against the ids, lists `factIds` on the facts page ("Used on") and
// indexes each entry for search. Keep this module free of imports from content.js or pages.js (content.js imports it).
//
// Shape per entry:
//   id, title, summary        copy from strings.js (tools.<id>)
//   guide                     slug of the guide that explains the maths; linked from the rates block once it exists
//   factIds                   every register id the tool reads or shows — each gets a row in "Rates used"
//   fields                    the form, in order: { key, type, min, max, step, optional, span, show, factDefault, factScale, options, default }
//                             type ∈ segment | select | static | check | money | percent | int | number; `show` = { field: [values] }
//                             (all must hold for the field to be visible); `factDefault` fills the initial value from the register
//   examples[2]               pack L's worked examples: { label (strings key), inputs, expect: { resultKey: formatted text } } —
//                             `expect` holds pack L's exact figures (unit-tested against calc.js, asserted in the browser by e2e.py)
//   schema                    'WebPage' (design §13)
import { STRINGS as S } from './strings.js';

const T = (id) => S.tools[id];
const money = (key, extra = {}) => ({ key, type: 'money', min: 0.01, max: 1e7, step: 0.01, ...extra });
const percent = (key, min, max, step, extra = {}) => ({ key, type: 'percent', min, max, step, ...extra });
const int = (key, min, max, extra = {}) => ({ key, type: 'int', min, max, step: 1, ...extra });

const ALL_CHG = ['chg-stt-equity-delivery', 'chg-stt-equity-intraday', 'chg-stt-futures', 'chg-stt-options-sell', 'chg-stt-options-exercise', 'chg-nse-txn-equity', 'chg-nse-txn-futures', 'chg-nse-txn-options', 'chg-ipft-nse', 'chg-sebi-fee', 'chg-stamp-delivery', 'chg-stamp-intraday', 'chg-stamp-futures', 'chg-stamp-options', 'chg-gst-rate', 'chg-dp-example-broker', 'chg-brokerage-example-delivery', 'chg-brokerage-example-intraday-futures', 'chg-brokerage-example-options'];

export const TOOLS = [
  {
    id: 'charges',
    title: T('charges').title,
    summary: T('charges').summary,
    guide: 'what-a-trade-costs',
    schema: 'WebPage',
    factIds: [...ALL_CHG, 'fo-nifty-lot', 'fo-freeze-qty-nifty', 'opt-tick-size-options'],
    fields: [
      { key: 'segment', type: 'segment', options: ['equity-intraday', 'equity-delivery', 'futures', 'options'], span: true },
      int('qty', 1, 1e7, { show: { segment: ['equity-intraday', 'equity-delivery'] } }),
      int('lots', 1, 10000, { show: { segment: ['futures', 'options'] } }),
      int('lotSize', 1, 10000, { show: { segment: ['futures', 'options'] }, factDefault: 'fo-nifty-lot' }),
      { key: 'exchange', type: 'static' },
      money('buy', { tick: true }),
      money('sell', { tick: true, show: { exercised: ['false'] } }),
      { key: 'exercised', type: 'check', show: { segment: ['options'] } },
      money('intrinsic', { min: 0, tick: true, show: { segment: ['options'], exercised: ['true'] } }),
      money('dp', { min: 0, max: 10000, optional: true, show: { segment: ['equity-delivery'] }, factDefault: 'chg-dp-example-broker' }),
      { key: 'model', type: 'select', options: ['pct-cap', 'flat', 'zero', 'custom'], span: true },
      percent('customRate', 0, 1, 0.001, { show: { model: ['custom'] } }),
      money('customCap', { min: 0, max: 1000, step: 1, optional: true, show: { model: ['custom'] } }),
    ],
    examples: [
      {
        label: T('charges').examples[0],
        inputs: { segment: 'equity-intraday', qty: 100, buy: 1000, sell: 1010, model: 'pct-cap', exercised: false },
        expect: { total: '₹82.97', brokerage: '₹40.00', stt: '₹25.25', exchange: '₹6.17', sebi: '₹0.20', stamp: '₹3.00', gst: '₹8.35', gross: '₹1,000.00', net: '₹917.03', breakEven: '₹0.83' },
      },
      {
        // pack L §7.1 example 2 is frozen at the Nifty lot of 65 units; the live form default comes from the register
        label: T('charges').examples[1],
        inputs: { segment: 'options', lots: 1, lotSize: 65, buy: 100, sell: 120, model: 'flat', exercised: false },
        expect: { total: '₹65.11', brokerage: '₹40.00', stt: '₹11.70', exchange: '₹5.08', sebi: '₹0.01', stamp: '₹0.20', gst: '₹8.12', gross: '₹1,300.00', net: '₹1,234.89', breakEven: '₹1.00' },
      },
    ],
  },
  {
    id: 'position-size',
    title: T('position-size').title,
    summary: T('position-size').summary,
    guide: 'position-sizing-and-loss-limits',
    schema: 'WebPage',
    factIds: ['fo-nifty-lot', 'fo-sensex-lot', 'fo-freeze-qty-nifty', 'fo-expiry-day-elm-addon'],
    fields: [
      { key: 'mode', type: 'segment', options: ['shares', 'lots'], span: true },
      money('capital', { max: 1e12, step: 1 }),
      percent('riskPct', 0.1, 10, 0.1),
      money('entry', { tick: true }),
      money('stop', { min: 0, tick: true }),
      int('lotSize', 1, 10000, { show: { mode: ['lots'] }, factDefault: 'fo-nifty-lot' }),
      { key: 'leverage', type: 'number', min: 1, max: 50, step: 1, default: 5, show: { mode: ['shares'] } },
      money('maxLoss', { min: 1, max: 1e12, step: 1, optional: true }),
    ],
    examples: [
      {
        label: T('position-size').examples[0],
        inputs: { mode: 'shares', capital: 500000, riskPct: 1, entry: 1000, stop: 990, leverage: 5, maxLoss: '' },
        expect: { qty: '500', risk: '₹5,000.00', perUnit: '₹10.00', notional: '₹5,00,000.00', margin: '₹1,00,000.00', lossAtStop: '₹5,000.00' },
      },
      {
        label: T('position-size').examples[1],
        inputs: { mode: 'lots', capital: 300000, riskPct: 1, entry: 120, stop: 90, lotSize: 65, maxLoss: '' },
        expect: { lots: '1', risk: '₹3,000.00', perUnit: '₹30.00', perLot: '₹1,950.00', premiumAtRisk: '₹7,800.00', lossAtStop: '₹1,950.00', units: '65' },
      },
    ],
  },
  {
    id: 'expectancy-kelly',
    title: T('expectancy-kelly').title,
    summary: T('expectancy-kelly').summary,
    guide: 'expectancy-and-drawdown-maths',
    schema: 'WebPage',
    factIds: [],
    fields: [
      percent('p', 0.01, 99.99, 0.1),
      { key: 'W', type: 'number', min: 0.01, max: 1000, step: 0.1 },
      { key: 'L', type: 'number', min: 0.01, max: 1000, step: 0.1 },
      money('R', { min: 0, max: 1e9, step: 1, optional: true }),
      int('N', 1, 100000),
    ],
    examples: [
      { label: T('expectancy-kelly').examples[0], inputs: { p: 45, W: 1.8, L: 1, R: 5000, N: 100 }, expect: { expectancy: '0.26R', payoff: '1.80×', kelly: '14.44%', halfKelly: '7.22%', expectedRupees: '₹1,30,000.00' } },
      { label: T('expectancy-kelly').examples[1], inputs: { p: 60, W: 1, L: 1.2, R: 5000, N: 100 }, expect: { expectancy: '0.12R', payoff: '0.83×', kelly: '12.00%', halfKelly: '6.00%', expectedRupees: '₹60,000.00' } },
    ],
  },
  {
    id: 'expected-move',
    title: T('expected-move').title,
    summary: T('expected-move').summary,
    guide: 'iv-expected-move-and-crush',
    schema: 'WebPage',
    factIds: ['fo-nifty-lot', 'fo-sensex-lot'],
    fields: [
      { key: 'S', type: 'number', min: 0.05, max: 1e7, step: 0.05 },
      { key: 'straddle', type: 'number', min: 0, max: 1e7, step: 0.05 },
      percent('sigma', 0.01, 500, 0.1),
      int('days', 1, 3650),
      { key: 'index', type: 'select', options: ['nifty', 'sensex', 'other'] },
    ],
    examples: [
      { label: T('expected-move').examples[0], inputs: { S: 23000, straddle: 230, sigma: 12, days: 7, index: 'nifty' }, expect: { moveA: '±230.00', pctA: '±1.00%', rangeA: '22,770.00–23,230.00', moveB: '±382.22', pctB: '±1.66%', rangeB: '22,617.78–23,382.22', rule: '±184.00', perLot: '₹14,950.00' } },
      { label: T('expected-move').examples[1], inputs: { S: 74500, straddle: 600, sigma: 11, days: 1, index: 'sensex' }, expect: { moveA: '±600.00', pctA: '±0.81%', rangeA: '73,900.00–75,100.00', moveB: '±428.95', pctB: '±0.58%', rangeB: '74,071.05–74,928.95', rule: '±480.00', perLot: '₹12,000.00' } },
    ],
  },
  {
    id: 'black-scholes-greeks',
    title: T('black-scholes-greeks').title,
    summary: T('black-scholes-greeks').summary,
    guide: 'greeks-for-a-day-trader',
    schema: 'WebPage',
    factIds: ['mac-repo-rate'],
    fields: [
      { key: 'mode', type: 'segment', options: ['price', 'iv'], span: true },
      { key: 'S', type: 'number', min: 0.05, max: 1e7, step: 0.05 },
      { key: 'K', type: 'number', min: 0.05, max: 1e7, step: 0.05 },
      int('days', 1, 3650),
      percent('r', -5, 50, 0.05, { factDefault: 'mac-repo-rate', factScale: 100 }),
      percent('sigma', 0.01, 500, 0.1, { show: { mode: ['price'] } }),
      percent('q', 0, 20, 0.1, { optional: true, default: 0 }),
      { key: 'type', type: 'segment', options: ['call', 'put'], show: { mode: ['iv'] } },
      { key: 'price', type: 'number', min: 0.05, max: 1e7, step: 0.05, show: { mode: ['iv'] } },
    ],
    examples: [
      {
        label: T('black-scholes-greeks').examples[0],
        inputs: { mode: 'price', S: 23000, K: 23000, days: 7, r: 6.5, sigma: 12, q: 0, type: 'call', price: 150 },
        expect: { call: '167.14', put: '138.49', deltaCall: '0.5332', deltaPut: '−0.4668', gamma: '0.0010', vega: '12.66', thetaCall: '−13.01', thetaPut: '−8.92', rhoCall: '2.32', rhoPut: '−2.09' },
      },
      {
        label: T('black-scholes-greeks').examples[1],
        inputs: { mode: 'iv', type: 'call', price: 150, S: 74500, K: 75000, days: 2, r: 6.5, q: 0, sigma: 12 },
        expect: { iv: '15.17%', call: '150.00', put: '623.29', deltaCall: '0.2883', deltaPut: '−0.7117', gamma: '0.0004', vega: '18.82', thetaCall: '−75.18', thetaPut: '−61.83', rhoCall: '1.17', rhoPut: '−2.94' },
      },
    ],
  },
  {
    id: 'fo-tax-estimator',
    title: T('fo-tax-estimator').title,
    summary: T('fo-tax-estimator').summary,
    guide: 'tax-for-traders-it-act-2025',
    schema: 'WebPage',
    factIds: ['tax-std-deduction-new-regime', 'tax-slab-1', 'tax-slab-2', 'tax-slab-3', 'tax-slab-4', 'tax-slab-5', 'tax-slab-6', 'tax-slab-7', 'tax-rebate-156', 'tax-rebate-156-income-limit', 'tax-cess-rate', 'tax-spec-loss-carry-forward', 'tax-nonspec-loss-carry-forward'],
    fields: [
      money('salary', { min: 0, max: 1e10, step: 1 }),
      { key: 'fo', type: 'money', min: -1e10, max: 1e10, step: 1, signed: true },
      { key: 'intraday', type: 'money', min: -1e10, max: 1e10, step: 1, signed: true },
      money('other', { min: 0, max: 1e10, step: 1, optional: true, default: 0 }),
      money('bfNonSpec', { min: 0, max: 1e10, step: 1, optional: true }),
      money('bfSpec', { min: 0, max: 1e10, step: 1, optional: true }),
    ],
    examples: [
      {
        label: T('fo-tax-estimator').examples[0],
        inputs: { salary: 1200000, fo: 300000, intraday: 0, other: 0, bfNonSpec: '', bfSpec: '' },
        expect: { totalTax: '₹97,500.00', total: '₹97,500.00', salaryTaxable: '₹11,25,000.00', businessIncome: '₹3,00,000.00', totalIncome: '₹14,25,000.00', slabTax: '₹93,750.00', rebate: '₹0.00', cess: '₹3,750.00', effective: '6.84%' },
      },
      {
        label: T('fo-tax-estimator').examples[1],
        inputs: { salary: 900000, fo: -150000, intraday: 0, other: 0, bfNonSpec: '', bfSpec: '' },
        expect: { totalTax: '₹0.00', total: '₹0.00', salaryTaxable: '₹8,25,000.00', businessIncome: '₹0.00', totalIncome: '₹8,25,000.00', slabTax: '₹22,500.00', rebate: '₹22,500.00', cess: '₹0.00', carryNonSpec: '₹1,50,000.00', effective: '0.00%' },
      },
    ],
  },
  {
    id: 'sip-compounding',
    title: T('sip-compounding').title,
    summary: T('sip-compounding').summary,
    guide: 'sip-maths-and-sequencing',
    schema: 'WebPage',
    factIds: [],
    fields: [
      { key: 'mode', type: 'segment', options: ['sip', 'lumpsum'], span: true },
      money('amount', { min: 1, max: 1e9, step: 1 }),
      percent('rate', -50, 50, 0.1),
      int('years', 1, 60),
      percent('inflation', 0, 30, 0.1, { optional: true, default: 0 }),
    ],
    examples: [
      { label: T('sip-compounding').examples[0], inputs: { mode: 'sip', amount: 10000, rate: 12, years: 20, inflation: 6 }, expect: { fv: '₹99,91,479.19', invested: '₹24,00,000.00', gains: '₹75,91,479.19', realValue: '₹31,15,390.44', realCagr: '5.66%', multiple: '4.16×' } },
      { label: T('sip-compounding').examples[1], inputs: { mode: 'lumpsum', amount: 500000, rate: 10, years: 15, inflation: 5 }, expect: { fv: '₹20,88,624.08', invested: '₹5,00,000.00', gains: '₹15,88,624.08', realValue: '₹10,04,663.90', realCagr: '4.76%', multiple: '4.18×' } },
    ],
  },
  {
    id: 'us-vs-india-investing-cost',
    title: T('us-vs-india-investing-cost').title,
    summary: T('us-vs-india-investing-cost').summary,
    guide: 'investing-abroad-from-india',
    schema: 'WebPage',
    factIds: ['glb-tcs-threshold', 'glb-tcs-rate', 'glb-us-dividend-withholding-dtaa', 'glb-us-dividend-withholding-default', 'glb-lrs-limit', 'glb-voo-expense-ratio', 'inv-nifty50-ter-direct'],
    fields: [
      money('amount', { min: 1, max: 1e10, step: 1 }),
      percent('spread', 0, 10, 0.01),
      money('fee', { min: 0, max: 1e10, step: 1, optional: true, default: 0 }),
      money('already', { min: 0, max: 1e10, step: 1, optional: true, default: 0 }),
      percent('terUs', 0, 10, 0.01),
      percent('yieldPct', 0, 20, 0.1),
      percent('withholding', 0, 100, 1, { factDefault: 'glb-us-dividend-withholding-dtaa', factScale: 100 }),
      percent('terIn', 0, 10, 0.01),
      { key: 'fx', type: 'number', min: 0.01, max: 1000, step: 0.01, optional: true },
    ],
    examples: [
      {
        label: T('us-vs-india-investing-cost').examples[0],
        inputs: { amount: 1500000, spread: 0.5, fee: 0, already: 0, terUs: 0.03, yieldPct: 1.3, withholding: 25, terIn: 0.2, fx: '' },
        expect: { usFrictions: '₹12,798.38', total: '₹12,798.38', fxCost: '₹7,500.00', fee: '₹0.00', terUs: '₹447.75', withholding: '₹4,850.63', tcs: '₹1,00,000.00', invested: '₹14,92,500.00', dividends: '₹19,402.50', indiaTer: '₹3,000.00', difference: '₹9,798.38' },
      },
      {
        label: T('us-vs-india-investing-cost').examples[1],
        inputs: { amount: 800000, spread: 1, fee: 500, already: 0, terUs: 0.03, yieldPct: 1.3, withholding: 25, terIn: 0.2, fx: '' },
        expect: { usFrictions: '₹11,309.83', total: '₹11,309.83', fxCost: '₹8,000.00', fee: '₹500.00', terUs: '₹237.45', withholding: '₹2,572.38', tcs: '₹0.00', invested: '₹7,91,500.00', dividends: '₹10,289.50', indiaTer: '₹1,600.00', difference: '₹9,709.83' },
      },
    ],
  },
];

export const byTool = (id) => TOOLS.find((t) => t.id === id);

/** True when the field is visible for the given input values (every `show` rule must hold). */
export function fieldShown(field, values) {
  if (!field.show) return true;
  return Object.entries(field.show).every(([k, allowed]) => allowed.includes(String(values[k] === undefined || values[k] === '' ? 'false' : values[k])));
}
