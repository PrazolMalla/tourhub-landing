import { SITE_URL } from './constants';

/** Element id of the Trip Checklist section on the homepage — kept in one place. */
export const TRIP_CHECKLIST_SECTION_ID = 'trip-checklist';
/** Query param a shared checklist link carries so the page knows which one to pre-select. */
export const CHECKLIST_QUERY_PARAM = 'checklist';

/**
 * Shareable deep link for a single checklist — scrolls straight to the Trip
 * Checklist section and (via `TripChecklistCta`, which reads the query
 * param) opens the download dialog pre-set to this checklist. Shared on
 * WhatsApp/etc. so a recipient lands exactly on the checklist they were
 * sent, not just the homepage.
 */
export function checklistShareUrl(slug: string): string {
  const url = new URL(SITE_URL);
  url.searchParams.set(CHECKLIST_QUERY_PARAM, slug);
  url.hash = TRIP_CHECKLIST_SECTION_ID;
  return url.toString();
}

/** Opens the WhatsApp share sheet/web composer with the checklist link pre-filled. */
export function whatsappShareHref(checklistType: string, slug: string): string {
  const message = `${checklistType} — Trip Checklist\n${checklistShareUrl(slug)}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
