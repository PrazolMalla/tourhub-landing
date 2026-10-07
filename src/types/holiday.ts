/**
 * Domain types for the Nepal Holiday Trekking Management System.
 *
 * Holidays / festivals are managed by admins via the backend CMS (CRUD,
 * active/inactive, featured, discounts, SEO). The frontend consumes them
 * through `@/lib/cms` with a bundled static fallback in `@/data/holidays`.
 *
 * Field names mirror the backend table (snake_case columns) but are camelCased
 * here to match the rest of the app's domain types.
 */

/** A single FAQ entry rendered on a holiday landing page (FAQ structured data). */
export interface HolidayFaq {
  q: string;
  a: string;
}

export interface Holiday {
  /** Backend primary key (string id). */
  id: string;
  /** Display name, e.g. "Dashain". */
  name: string;
  /** URL slug, e.g. "dashain-trekking-nepal". */
  slug: string;
  /** Short marketing description (used on cards + meta fallback). */
  description: string;
  /** ISO date (YYYY-MM-DD) the festival/holiday begins — drives the countdown. */
  startDate: string;
  /** ISO date (YYYY-MM-DD) the festival/holiday ends. */
  endDate: string;
  /** Banner / hero image URL (absolute, or `/static/..` resolved against the asset host). */
  bannerImage: string;
  /** Festival-season discount applied to associated treks (0–100). */
  discountPercentage: number;
  /** Featured on the homepage banner + highlighted in listings. */
  isFeatured: boolean;
  /** Inactive holidays are hidden from the public site. */
  isActive: boolean;

  /* ── SEO / AEO / GEO ─────────────────────────────────────────────── */
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];

  /* ── Trekking associations & landing-page content ────────────────── */
  /** Slugs of recommended treks for this holiday (link to `/trek/[slug]`). */
  recommendedTreks: string[];
  /** Trekking regions associated with the holiday (used by the region filter). */
  regions: string[];
  /** Longer body paragraphs for the landing page. */
  body: string[];
  /** FAQs rendered on the landing page + emitted as FAQPage structured data. */
  faqs: HolidayFaq[];

  /** ISO timestamps (backend-managed). */
  createdAt: string;
  updatedAt: string;
}

/** Sort options exposed in the holidays listing UI. */
export type HolidaySort = 'date-asc' | 'date-desc' | 'name-asc' | 'discount-desc';
