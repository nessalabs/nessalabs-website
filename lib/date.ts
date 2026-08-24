/**
 * Small ISO-date helpers. Everything takes and returns `YYYY-MM-DD` strings and
 * works in UTC, so rendering is pure and never depends on the machine clock —
 * callers pass `today` in explicitly.
 */

export type ISODate = string;

export function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function toISO(d: Date): ISODate {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export function parseISO(iso: ISODate): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
}

export function addDays(iso: ISODate, days: number): ISODate {
  const d = parseISO(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toISO(d);
}

export function addMonths(iso: ISODate, months: number): ISODate {
  const d = parseISO(iso);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const last = daysInMonth(d.getUTCFullYear(), d.getUTCMonth() + 1);
  d.setUTCDate(Math.min(day, last));
  return toISO(d);
}

export function addYears(iso: ISODate, years: number): ISODate {
  const d = parseISO(iso);
  d.setUTCFullYear(d.getUTCFullYear() + years);
  return toISO(d);
}

export function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Monday-first index: Monday is 0, Sunday is 6. */
export function weekdayIndex(iso: ISODate) {
  return (parseISO(iso).getUTCDay() + 6) % 7;
}

export function startOfWeek(iso: ISODate): ISODate {
  return addDays(iso, -weekdayIndex(iso));
}

export function startOfMonth(iso: ISODate): ISODate {
  return `${iso.slice(0, 7)}-01`;
}

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatDay(iso: ISODate) {
  const d = parseISO(iso);
  return `${WEEKDAYS[weekdayIndex(iso)]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

/** Minutes since midnight for an `HH:MM` string. */
export function minutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m ?? 0);
}
