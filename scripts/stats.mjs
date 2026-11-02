#!/usr/bin/env node
// Computed Nifty statistics for the stats/ page (FEAT-017). Run locally: `node scripts/stats.mjs` — the Pages build has
// no network step, so content/data/stats.json is committed. Node 24, global fetch, no dependency.
// Source: Yahoo Finance chart API, daily ^NSEI (and ^INDIAVIX when served), range 10y. Every figure is historical, not a forecast.
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'content', 'data', 'stats.json');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const RANGE = '10y';
const url = (symbol) => `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${RANGE}&interval=1d`;
const GAP_BUCKETS = [
  { id: 'le-0.25', label: '≤ 0.25 %', lo: 0, hi: 0.25 },
  { id: '0.25-0.5', label: '0.25–0.5 %', lo: 0.25, hi: 0.5 },
  { id: '0.5-1', label: '0.5–1 %', lo: 0.5, hi: 1 },
  { id: '1-2', label: '1–2 %', lo: 1, hi: 2 },
  { id: 'gt-2', label: '> 2 %', lo: 2, hi: Infinity },
];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const istParts = (ts) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(ts * 1000)).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, weekday: p.weekday };
};
const r2 = (x) => Math.round(x * 100) / 100;
const pct = (n, d) => (d ? r2((100 * n) / d) : 0);
/** Linear-interpolated percentile of a sorted copy of `xs` (p in 0–100). */
function percentile(xs, p) {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const pos = ((s.length - 1) * p) / 100;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return r2(s[lo] + (s[hi] - s[lo]) * (pos - lo));
}

async function fetchDaily(symbol) {
  const res = await fetch(url(symbol), { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${symbol}: HTTP ${res.status}`);
  const j = await res.json();
  const result = j?.chart?.result?.[0];
  if (!result?.timestamp?.length) throw new Error(`${symbol}: empty chart result`);
  const q = result.indicators.quote[0];
  const rows = [];
  result.timestamp.forEach((ts, i) => {
    const row = { ...istParts(ts), open: q.open[i], high: q.high[i], low: q.low[i], close: q.close[i] };
    // Yahoo pads some sessions with nulls or zeros; a row needs all four prices to be usable.
    if ([row.open, row.high, row.low, row.close].every((v) => typeof v === 'number' && v > 0)) rows.push(row);
  });
  // One row per IST date, oldest first (the API occasionally repeats the live session).
  const byDate = new Map();
  for (const row of rows) byDate.set(row.date, row);
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function computeGaps(sessions) {
  const gaps = [];
  for (let i = 1; i < sessions.length; i++) {
    const prev = sessions[i - 1].close;
    const s = sessions[i];
    const gapPct = ((s.open - prev) / prev) * 100;
    const up = gapPct > 0;
    const filled = gapPct === 0 ? true : up ? s.low <= prev : s.high >= prev;
    gaps.push({ abs: Math.abs(gapPct), up, filled });
  }
  const bucket = (b) => {
    const rows = gaps.filter((g) => g.abs > b.lo && g.abs <= b.hi || (b.lo === 0 && g.abs === 0));
    const filled = rows.filter((g) => g.filled).length;
    return { id: b.id, label: b.label, sessions: rows.length, share: pct(rows.length, gaps.length), filled, filledShare: pct(filled, rows.length) };
  };
  const dir = (up) => {
    const rows = gaps.filter((g) => g.up === up && g.abs > 0);
    return { sessions: rows.length, share: pct(rows.length, gaps.length), filledShare: pct(rows.filter((g) => g.filled).length, rows.length), medianSize: percentile(rows.map((g) => g.abs), 50) };
  };
  return {
    sessions: gaps.length,
    medianAbs: percentile(gaps.map((g) => g.abs), 50),
    filledShare: pct(gaps.filter((g) => g.filled).length, gaps.length),
    buckets: GAP_BUCKETS.map(bucket),
    direction: { up: dir(true), down: dir(false) },
  };
}

function computeRanges(sessions) {
  const rows = [];
  for (let i = 1; i < sessions.length; i++) {
    const prev = sessions[i - 1].close;
    const s = sessions[i];
    rows.push({ date: s.date, weekday: s.weekday, range: ((s.high - s.low) / prev) * 100 });
  }
  const dist = (xs) => ({ sessions: xs.length, p25: percentile(xs, 25), p50: percentile(xs, 50), p75: percentile(xs, 75), p90: percentile(xs, 90) });
  const all = rows.map((x) => x.range);
  return {
    sessions: rows.length,
    all: dist(all),
    weekdays: WEEKDAYS.map((w) => ({ weekday: w, ...dist(rows.filter((x) => x.weekday === w).map((x) => x.range)) })),
    rows, // used for the VIX join; stripped before writing
  };
}

function computeVix(sessions, vix, rangeRows) {
  if (!vix?.length) return null;
  const vixByDate = new Map(vix.map((v) => [v.date, v.close]));
  const nextRange = new Map();
  for (let i = 0; i < rangeRows.length - 1; i++) nextRange.set(rangeRows[i].date, rangeRows[i + 1].range);
  const pairs = [];
  for (const s of sessions) {
    const v = vixByDate.get(s.date);
    const nr = nextRange.get(s.date);
    if (typeof v === 'number' && typeof nr === 'number') pairs.push({ vix: v, nextRange: nr });
  }
  if (pairs.length < 100) return null;
  const closes = pairs.map((p) => p.vix);
  const q = [percentile(closes, 25), percentile(closes, 50), percentile(closes, 75)];
  const bands = [
    { id: 'q1', label: 'Lowest quarter', lo: -Infinity, hi: q[0], from: null, to: q[0] },
    { id: 'q2', label: 'Second quarter', lo: q[0], hi: q[1], from: q[0], to: q[1] },
    { id: 'q3', label: 'Third quarter', lo: q[1], hi: q[2], from: q[1], to: q[2] },
    { id: 'q4', label: 'Highest quarter', lo: q[2], hi: Infinity, from: q[2], to: null },
  ].map((b) => {
    const rows = pairs.filter((p) => p.vix > b.lo && p.vix <= b.hi);
    const nr = rows.map((p) => p.nextRange);
    return { id: b.id, label: b.label, vixFrom: b.from, vixTo: b.to, sessions: rows.length, nextRangeP50: percentile(nr, 50), nextRangeP75: percentile(nr, 75), nextRangeP90: percentile(nr, 90) };
  });
  return { source: 'Yahoo Finance chart API ^INDIAVIX', sessions: pairs.length, from: vix[0].date, to: vix[vix.length - 1].date, medianClose: q[1], bands };
}

function printTables(stats) {
  const line = (cells) => console.log(cells.map((c) => String(c ?? '—').padStart(14)).join(''));
  console.log(`\n${stats.source} · ${stats.from} → ${stats.to} · ${stats.sessions} sessions · fetched ${stats.fetched}\n`);
  console.log('Opening gaps (|open − previous close| as % of previous close)');
  line(['bucket', 'sessions', 'share %', 'filled', 'filled %']);
  for (const b of stats.gaps.buckets) line([b.label, b.sessions, b.share, b.filled, b.filledShare]);
  line(['all', stats.gaps.sessions, 100, '', stats.gaps.filledShare]);
  console.log('\nDaily range (high − low as % of previous close)');
  line(['weekday', 'sessions', 'p25', 'p50', 'p75', 'p90']);
  for (const w of stats.ranges.weekdays) line([w.weekday, w.sessions, w.p25, w.p50, w.p75, w.p90]);
  line(['all', stats.ranges.all.sessions, stats.ranges.all.p25, stats.ranges.all.p50, stats.ranges.all.p75, stats.ranges.all.p90]);
  if (stats.vix) {
    console.log('\nIndia VIX close vs next-day Nifty range');
    line(['band', 'VIX from', 'VIX to', 'sessions', 'next p50', 'next p75', 'next p90']);
    for (const b of stats.vix.bands) line([b.label, b.vixFrom, b.vixTo, b.sessions, b.nextRangeP50, b.nextRangeP75, b.nextRangeP90]);
  } else console.log('\nIndia VIX: not available from the endpoint — table omitted');
}

async function main() {
  const nifty = await fetchDaily('^NSEI');
  let vix = null;
  try { vix = await fetchDaily('^INDIAVIX'); } catch (e) { console.warn(`warning: ^INDIAVIX not fetched (${e.message}); the VIX table is omitted`); }
  const ranges = computeRanges(nifty);
  const vixStats = computeVix(nifty, vix, ranges.rows);
  const { rows: _rows, ...rangesOut } = ranges;
  const fetched = istParts(Math.floor(Date.now() / 1000)).date;
  const stats = {
    source: 'Yahoo Finance chart API ^NSEI',
    sourceUrl: url('^NSEI'),
    vixSourceUrl: vixStats ? url('^INDIAVIX') : null,
    fetched,
    from: nifty[0].date,
    to: nifty[nifty.length - 1].date,
    sessions: nifty.length,
    method: [
      `Daily open, high, low and close of ^NSEI were downloaded from the Yahoo Finance chart API (range ${RANGE}, interval 1d) and dated in IST; sessions missing any of the four prices were dropped, leaving ${nifty.length} sessions from ${nifty[0].date} to ${nifty[nifty.length - 1].date}.`,
      'Gap = (open − previous close) ÷ previous close, in per cent, bucketed by its absolute size. A gap counts as filled when the same session traded back to the previous close: for a gap up, the low reached or crossed the previous close; for a gap down, the high did. Shares are per bucket, so a bucket with few sessions is a noisy estimate.',
      'Daily range = (high − low) ÷ previous close, in per cent, summarised as the 25th, 50th, 75th and 90th percentiles (linear interpolation) for all sessions and for each weekday.',
      vixStats
        ? 'India VIX: the ^INDIAVIX close of each session was joined to the next session\'s Nifty range; the closes were split into quarters (quartiles of the sample), and each band reports the median and the 75th and 90th percentiles of the following day\'s range. VIX is an annualised implied-volatility index; the bands are the sample\'s own quartiles, not an exchange definition.'
        : 'India VIX: the ^INDIAVIX series was not available at fetch time; no regime table was computed.',
      'Caveats: Yahoo opens for the index are the first disseminated value after 09:15 and are not audited against NSE; the window includes the 2020 crash; nothing here adjusts for holidays, expiry days or events. Historical, not a forecast.',
    ].join(' '),
    gaps: computeGaps(nifty),
    ranges: rangesOut,
    vix: vixStats,
  };
  await writeFile(OUT, `${JSON.stringify(stats, null, 2)}\n`, 'utf8');
  printTables(stats);
  console.log(`\nwrote ${path.relative(ROOT, OUT)}`);
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
