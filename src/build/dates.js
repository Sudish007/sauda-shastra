// Dates in the site's time zone. Shared by the Markdown fact token (which must know whether a fact's `since` lies in
// the future) and the templates (which print every date as "1 Nov 2026"). No DOM, no state.
import { SITE } from './config.js';

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Today's calendar date in SITE.timeZone as YYYY-MM-DD (the build date; tests pass their own `today`). */
export function todayIST(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: SITE.timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/** "2026-11-01" → "1 Nov 2026" (D MMM YYYY, en-IN, in the site's time zone). Non-dates pass through unchanged. */
export function formatDate(iso, { withTime = false } = {}) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  const opts = { day: 'numeric', month: 'short', year: 'numeric', timeZone: SITE.timeZone };
  if (withTime) Object.assign(opts, { hour: '2-digit', minute: '2-digit', hour12: false });
  return new Intl.DateTimeFormat('en-IN', opts).format(d).replace(/\u202f|\u00a0/g, ' ') + (withTime ? ' IST' : '');
}

/** True when a fact's `since` (YYYY-MM-DD) is later than `today` (YYYY-MM-DD): the value is announced, not yet in force. */
export function isFuture(since, today = todayIST()) {
  return DATE.test(String(since)) && String(since) > today;
}
