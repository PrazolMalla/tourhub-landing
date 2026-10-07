/**
 * SEO data layer + reusable fallback engine for the public site.
 *
 * Every page's `generateMetadata` should go through `resolveMetadata()`
 * instead of hand-building a `Metadata` object — this is the single place
 * the "admin SEO → entity fallback → page default → global default" chain
 * lives, per the fallback strategy in the SEO implementation plan.
 *
 * Reuses `apiGet` from `lib/cms.ts` (same fetch/caching/error-swallowing
 * behavior as every other CMS-driven read) rather than a second HTTP client.
 */
import type { Metadata } from 'next';
import { apiGet } from './cms';
import { SITE_NAME, SITE_URL } from './constants';

export type SeoEntityType = 'static_page' | 'trip' | 'blog' | 'holiday' | 'vehicle';

export interface SeoRobots {
  index: boolean;
  follow: boolean;
  noArchive: boolean;
  noImageIndex: boolean;
  noSnippet: boolean;
}

export interface SeoImageRef {
  url: string;
  alt?: string;
}

/** Subset of the backend's `SeoDTO` actually consumed on the public site. */
export interface SeoRecord {
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  canonicalUrl?: string;
  robots: SeoRobots;
  robotsString: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: SeoImageRef;
  twitterCard: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: SeoImageRef;
  structuredDataEnabled: boolean;
  /** Per-page — when true, this page's link in the site navigation opens in a new tab. */
  openInNewTab: boolean;
}

export interface GlobalSeoDefaults {
  siteUrl?: string;
  siteName?: string;
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  defaultKeywords?: string;
  defaultOgImage?: string;
  defaultTwitterImage?: string;
  defaultTwitterCard?: 'summary' | 'summary_large_image';
  defaultRobots?: string;
  organizationSameAs?: string;
}

/** A page's own SEO record — `null` when unset (never throws; callers get a clean fallback chain instead). */
export async function getSeoRecord(
  entityType: SeoEntityType,
  entityId: string,
): Promise<SeoRecord | null> {
  const data = await apiGet<SeoRecord & { id: string }>(
    `/seo/public/${entityType}/${encodeURIComponent(entityId)}`,
  );
  // `id === "default"` is the backend's neutral "nothing configured" shape —
  // treat it the same as "no record" so every field falls through cleanly.
  if (!data || data.id === 'default') return null;
  return data;
}

/** Bulk per-entity-type index status — used by `sitemap.ts` to drop no-index URLs without one request per page. */
export async function getSeoIndexMap(entityType: SeoEntityType): Promise<Map<string, boolean>> {
  const data = await apiGet<Array<{ entityId: string; robots: SeoRobots }>>(
    `/seo/public?entityType=${entityType}`,
  );
  const map = new Map<string, boolean>();
  for (const record of data ?? []) map.set(record.entityId, record.robots.index);
  return map;
}

/**
 * Bulk per-entity-type "open in new tab" map — used by the site navigation
 * (header, mega menus, mobile drawer) to look up each nav link's own,
 * per-page setting in a single request instead of one per link.
 *
 * Deliberately bypasses `apiGet`/the backend's `publicCache` response (which
 * sends `Cache-Control: max-age=60` — appropriate for `resolveMetadata`'s
 * server-side reads, but means a browser would silently reuse a stale
 * response for up to a minute here, across reloads, regardless of what an
 * admin just toggled). `cache: "no-store"` forces every check to hit the
 * network, since this only runs client-side, a handful of times per page
 * load — the cost is negligible and admins expect the toggle to take effect
 * on the very next reload, not "eventually within a minute."
 */
export async function getOpenInNewTabMap(entityType: SeoEntityType): Promise<Map<string, boolean>> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
  const map = new Map<string, boolean>();
  try {
    const res = await fetch(`${API_BASE}/seo/public?entityType=${entityType}`, {
      cache: 'no-store',
    });
    if (!res.ok) return map;
    const json = (await res.json()) as {
      success: boolean;
      data: Array<{ entityId: string; openInNewTab: boolean }>;
    };
    if (!json?.success) return map;
    for (const record of json.data ?? []) map.set(record.entityId, record.openInNewTab);
  } catch {
    // Network hiccup — fall through to the empty (all same-tab) map.
  }
  return map;
}

/** Site-wide SEO fallbacks (admin-managed via the `seo_defaults` site-content section). */
export async function getGlobalSeoDefaults(): Promise<GlobalSeoDefaults> {
  const doc = await apiGet<{ data: GlobalSeoDefaults }>('/site-content/public/seo_defaults');
  return doc?.data ?? {};
}

function splitCsv(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export interface ResolveMetadataInput {
  entityType: SeoEntityType;
  entityId: string;
  /** Path this metadata applies to, e.g. "/trek/everest-base-camp-trek" or "/". */
  path: string;
  fallback: {
    title?: string;
    /**
     * When true, `fallback.title` is already the complete, branded title
     * (e.g. "About Us — Nepal Yatra Tours & Travels") and should be
     * used as-is. When false/omitted, the site name is appended once.
     */
    titleIsComplete?: boolean;
    description?: string;
    /** Absolute image URL — e.g. the entity's own featured/hero image. */
    image?: string;
    ogType?: 'website' | 'article';
  };
}

/**
 * The reusable fallback engine. Priority for every field:
 *   admin SEO override → entity/page fallback → global default → hardcoded default.
 */
export async function resolveMetadata(input: ResolveMetadataInput): Promise<Metadata> {
  const [seo, globalDefaults] = await Promise.all([
    getSeoRecord(input.entityType, input.entityId),
    getGlobalSeoDefaults(),
  ]);

  const canonical = seo?.canonicalUrl || `${SITE_URL}${input.path}`;
  const siteName = globalDefaults.siteName || SITE_NAME;

  // An admin-entered meta title is used verbatim (no auto-suffix — the admin
  // is in full control of it). A page's own fallback title gets the site
  // name appended once, computed here rather than relying on the root
  // layout's `title.template` (which would double up on entity titles that
  // already include the brand, e.g. the homepage/about page defaults).
  const title = seo?.metaTitle
    ? seo.metaTitle
    : input.fallback.title
      ? input.fallback.titleIsComplete
        ? input.fallback.title
        : `${input.fallback.title} | ${siteName}`
      : globalDefaults.defaultMetaTitle || siteName;
  const description =
    seo?.metaDescription ||
    input.fallback.description ||
    globalDefaults.defaultMetaDescription ||
    '';

  const ogTitle = seo?.ogTitle || title;
  const ogDescription = seo?.ogDescription || description;
  const ogImage =
    seo?.ogImage?.url || input.fallback.image || globalDefaults.defaultOgImage || undefined;

  const twitterTitle = seo?.twitterTitle || ogTitle;
  const twitterDescription = seo?.twitterDescription || ogDescription;
  const twitterImage = seo?.twitterImage?.url || ogImage || globalDefaults.defaultTwitterImage;
  const twitterCard =
    seo?.twitterCard || globalDefaults.defaultTwitterCard || 'summary_large_image';

  const robots = seo?.robotsString || globalDefaults.defaultRobots || 'index,follow';

  const keywordList = seo?.keywords.length
    ? seo.keywords
    : splitCsv(globalDefaults.defaultKeywords);

  const metadata: Metadata = {
    // `{ absolute }` deliberately bypasses the root layout's `title.template`
    // — the suffix (if any) was already applied above, exactly once.
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots,
    openGraph: {
      type: input.fallback.ogType ?? 'website',
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: twitterCard,
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };
  if (keywordList.length) metadata.keywords = keywordList;
  return metadata;
}

// ─── Structured data (JSON-LD) ────────────────────────────────────────────
//
// Always computed server-side from typed data — there is no admin-editable
// raw JSON-LD field anywhere in this system (see the SEO plan's security
// section). `structuredDataEnabled` (default true when unset) lets an admin
// turn structured data off for a specific page without touching code.

/**
 * Serializes a JSON-LD object for a `<script type="application/ld+json">`
 * tag, escaping `<` so admin-entered text (titles, descriptions, …) can
 * never break out of the script tag (e.g. a title containing `</script>`).
 */
export function safeJsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function isStructuredDataEnabled(seo: SeoRecord | null): boolean {
  return seo?.structuredDataEnabled ?? true;
}

export function buildOrganizationJsonLd(global: GlobalSeoDefaults) {
  const siteUrl = global.siteUrl || SITE_URL;
  const sameAs = splitCsv(global.organizationSameAs);
  return {
    '@type': 'Organization',
    name: global.siteName || SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/assets/logo-mark.svg`,
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function buildWebsiteJsonLd(global: GlobalSeoDefaults) {
  const siteUrl = global.siteUrl || SITE_URL;
  return {
    '@type': 'WebSite',
    name: global.siteName || SITE_NAME,
    url: siteUrl,
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** Keep this in sync with the *visible* breadcrumb trail on the same page. */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildArticleJsonLd(article: {
  title: string;
  description: string;
  image?: string;
  datePublished?: string;
  url: string;
  siteName?: string;
}) {
  return {
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.datePublished,
    author: { '@type': 'Organization', name: article.siteName || SITE_NAME },
    publisher: {
      '@type': 'Organization',
      name: article.siteName || SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/logo-mark.svg` },
    },
    mainEntityOfPage: article.url,
  };
}

export function buildTouristTripJsonLd(trip: {
  title: string;
  description: string;
  image?: string;
  url: string;
  isTrekking?: boolean;
  price?: string;
  siteName?: string;
}) {
  return {
    '@type': 'TouristTrip',
    name: trip.title,
    description: trip.description,
    image: trip.image,
    url: trip.url,
    touristType: trip.isTrekking ? 'Trekking' : 'Sightseeing tour',
    provider: { '@type': 'TravelAgency', name: trip.siteName || SITE_NAME, url: SITE_URL },
    ...(trip.price
      ? {
          offers: {
            '@type': 'Offer',
            price: String(trip.price).replace(/,/g, ''),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: trip.url,
          },
        }
      : {}),
  };
}

/** Festivals/holidays have real start/end dates — `Event` is the closest matching schema.org type. */
export function buildEventJsonLd(holiday: {
  name: string;
  description: string;
  image?: string;
  url: string;
  startDate: string;
  endDate: string;
  siteName?: string;
}) {
  return {
    '@type': 'Event',
    name: holiday.name,
    description: holiday.description,
    image: holiday.image,
    url: holiday.url,
    startDate: holiday.startDate,
    endDate: holiday.endDate,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'Place', name: 'Nepal', address: 'Nepal' },
    organizer: { '@type': 'Organization', name: holiday.siteName || SITE_NAME, url: SITE_URL },
  };
}

/** A vehicle-hire listing is best modeled as a rental `Service`. */
export function buildServiceJsonLd(vehicle: {
  name: string;
  description: string;
  image?: string;
  url: string;
  siteName?: string;
}) {
  return {
    '@type': 'Service',
    serviceType: 'Vehicle Rental',
    name: vehicle.name,
    description: vehicle.description,
    image: vehicle.image,
    url: vehicle.url,
    provider: { '@type': 'TravelAgency', name: vehicle.siteName || SITE_NAME, url: SITE_URL },
  };
}
