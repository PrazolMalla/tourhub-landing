/**
 * Pure, framework-free helpers for the Holiday system — date math, sorting,
 * discount calculation and label formatting. Safe to import from both server
 * components and client components.
 */
import type { Holiday, HolidaySort } from '@/types/holiday';

/** Parse a YYYY-MM-DD date as a UTC midnight Date (avoids timezone drift). */
export function parseDate(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

/** Whole days from `now` until `iso` (negative if in the past). */
export function daysUntil(iso: string, now: Date = new Date()): number {
  const ms = parseDate(iso).getTime() - now.getTime();
  return Math.ceil(ms / 86_400_000);
}

/** True if the holiday's end date is today or later (i.e. not finished). */
export function isUpcomingOrActive(h: Holiday, now: Date = new Date()): boolean {
  return parseDate(h.endDate).getTime() >= now.setHours(0, 0, 0, 0);
}

/** True if `now` falls within the holiday's date range (festival is happening). */
export function isHappeningNow(h: Holiday, now: Date = new Date()): boolean {
  const t = now.getTime();
  return t >= parseDate(h.startDate).getTime() && t <= parseDate(h.endDate).getTime() + 86_400_000;
}

/**
 * Upcoming holidays (end date today or later), soonest first.
 * `limit` caps the result; omit for all.
 */
export function upcomingHolidays(
  holidays: Holiday[],
  limit?: number,
  now: Date = new Date(),
): Holiday[] {
  const list = holidays
    .filter((h) => h.isActive && isUpcomingOrActive(h, new Date(now)))
    .sort((a, b) => parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime());
  return typeof limit === 'number' ? list.slice(0, limit) : list;
}

/** Featured + active holidays, soonest first. */
export function featuredHolidays(holidays: Holiday[], now: Date = new Date()): Holiday[] {
  return upcomingHolidays(holidays, undefined, now).filter((h) => h.isFeatured);
}

/** Sort a holiday list by the given UI sort key (returns a new array). */
export function sortHolidays(holidays: Holiday[], sort: HolidaySort): Holiday[] {
  const list = [...holidays];
  switch (sort) {
    case 'date-asc':
      return list.sort(
        (a, b) => parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime(),
      );
    case 'date-desc':
      return list.sort(
        (a, b) => parseDate(b.startDate).getTime() - parseDate(a.startDate).getTime(),
      );
    case 'name-asc':
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case 'discount-desc':
      return list.sort((a, b) => b.discountPercentage - a.discountPercentage);
    default:
      return list;
  }
}

/** Apply a holiday discount to a numeric price string like "1,390" → "1,182". */
export function discountedPrice(price: string | undefined, pct: number): string | null {
  if (!price) return null;
  const n = Number(String(price).replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(n) || n <= 0 || pct <= 0) return null;
  const out = Math.round(n * (1 - pct / 100));
  return out.toLocaleString('en-US');
}

/**
 * Build a clean page headline from a holiday name, avoiding the doubled-up
 * "Trekking" you'd get from naive `${name} Trekking in Nepal` on seasonal
 * entries — e.g. "Autumn Trekking Season" → "Autumn Trekking Season in Nepal",
 * while "Dashain" → "Dashain Trekking in Nepal".
 */
export function holidayHeadline(name: string): string {
  return /trek/i.test(name) ? `${name} in Nepal` : `${name} Trekking in Nepal`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Format a single ISO date as "11 Oct 2026". */
export function formatDate(iso: string): string {
  const d = parseDate(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Format a start–end range, collapsing same-day and same-month ranges. */
export function formatDateRange(start: string, end: string): string {
  if (start === end) return formatDate(start);
  const s = parseDate(start);
  const e = parseDate(end);
  if (s.getUTCFullYear() === e.getUTCFullYear() && s.getUTCMonth() === e.getUTCMonth()) {
    return `${s.getUTCDate()}–${e.getUTCDate()} ${MONTHS[s.getUTCMonth()]} ${s.getUTCFullYear()}`;
  }
  if (s.getUTCFullYear() === e.getUTCFullYear()) {
    return `${s.getUTCDate()} ${MONTHS[s.getUTCMonth()]} – ${e.getUTCDate()} ${MONTHS[e.getUTCMonth()]} ${s.getUTCFullYear()}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}
