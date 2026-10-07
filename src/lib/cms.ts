/**
 * CMS data layer — fetches live content from the backend API. All functions
 * are async and meant to be called from Server Components.
 */
import type { Partner } from '@/data/partners';
import { MAPS_URL } from '@/data/site-config';
import { type Testimonial } from '@/data/testimonials';
import type { Vehicle } from '@/data/vehicles';
import type { BlogPost } from '@/types/blog';
import type { Holiday } from '@/types/holiday';
import type { ChromeTop10Item, NavGroup, SiteChrome } from '@/types/site';
import type { Trip, TripWithSlug } from '@/types/trip';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL || 'http://localhost:3000';
// Dev: always fetch fresh so admin changes show instantly on reload.
// Prod: cache for 60s for performance.
const REVALIDATE = process.env.NODE_ENV === 'development' ? 0 : 60;

/** Prefix a relative `/static/..` upload path with the asset host; pass through absolute URLs. */
export function assetUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith('http') ? url : `${ASSET_BASE}${url}`;
}

interface Envelope<T> {
  success: boolean;
  data: T;
  meta?: { total: number };
}

/**
 * GET an envelope from the API; returns `null` on any failure. Exported so
 * other data-layer modules (e.g. `lib/seo.ts`) reuse the same fetch/caching
 * behavior instead of duplicating it.
 */
export async function apiGet<T>(path: string): Promise<T | null> {
  const url = `${API_BASE}${path}`;
  const start = Date.now();
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    if (process.env.NODE_ENV === 'development') {
      console.log(`[cms] GET ${url} -> ${res.status} (${Date.now() - start}ms)`);
    }
    if (!res.ok) return null;
    const json = (await res.json()) as Envelope<T>;
    if (!json?.success) return null;
    return json.data;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[cms] GET ${url} -> FAILED (${Date.now() - start}ms)`, err);
    }
    return null;
  }
}

// ─── Trips ───────────────────────────────────────────────────────────────────

interface ApiTrip extends Partial<Trip> {
  id: string;
  slug: string;
  title: string;
  kind?: 'trek' | 'tour';
  img?: string;
  gallery?: string[];
  isFeatured?: boolean;
  pdf?: string;
}

function mapTrip(t: ApiTrip): TripWithSlug {
  return {
    slug: t.slug,
    id: t.id,
    title: t.title,
    country: t.country ?? 'nepal',
    region: t.region ?? '',
    regionL: t.regionL ?? '',
    cats: t.cats ?? [],
    days: t.days ?? 0,
    maxAlt: t.maxAlt,
    diff: t.diff,
    season: t.season,
    group: t.group,
    price: t.price,
    was: t.was,
    rating: t.rating,
    reviews: t.reviews,
    badge: t.badge,
    img: assetUrl(t.img) ?? '',
    sub: t.sub,
    overview: t.overview,
    highlights: t.highlights,
    videoUrl: t.videoUrl,
    altitude: t.altitude,
    itin: t.itin,
    inc: t.inc,
    exc: t.exc,
    gallery: (t.gallery ?? []).map((g) => assetUrl(g) ?? g),
  };
}

/** Every active trip, in canonical order. */
export async function getAllTrips(): Promise<TripWithSlug[]> {
  const data = await apiGet<ApiTrip[]>('/trips/public?limit=200&sortBy=createdAt&sortOrder=asc');
  if (!data) return [];
  return data.map(mapTrip);
}

/** Featured homepage trips. */
export async function getFeaturedTrips(): Promise<TripWithSlug[]> {
  const all = await apiGet<ApiTrip[]>('/trips/public?limit=200');
  if (!all) return [];
  const featured = all.filter((t) => t.isFeatured);
  return (featured.length ? featured : all.slice(0, 9)).map(mapTrip);
}

/** A single trip by slug. */
export async function getTripBySlug(slug: string): Promise<TripWithSlug | null> {
  const data = await apiGet<ApiTrip>(`/trips/public/slug/${slug}`);
  return data ? mapTrip(data) : null;
}

/** Related trips (same region first), max `limit`. */
export async function getRelatedTrips(slug: string, limit = 3): Promise<TripWithSlug[]> {
  const all = await apiGet<ApiTrip[]>('/trips/public?limit=200');
  if (!all) return [];
  const current = all.find((t) => t.slug === slug);
  if (!current) return [];
  return all
    .filter((t) => t.slug !== slug)
    .sort((a, b) => (a.region === current.region ? 0 : 1) - (b.region === current.region ? 0 : 1))
    .slice(0, limit)
    .map(mapTrip);
}

export interface ExploreRegion {
  key: string;
  label: string;
}

interface ApiRegion {
  key: string;
  name: string;
  type: 'trek-region' | 'tour-category';
  isActive: boolean;
}

/** Active geographic filters, in the order configured by the backend. */
export async function getExploreRegions(): Promise<ExploreRegion[]> {
  const data = await apiGet<ApiRegion[]>(
    '/regions/public?limit=200&sortBy=sortOrder&sortOrder=asc',
  );
  if (!data) return [];

  return data
    .filter((region) => region.isActive && region.type === 'trek-region')
    .map((region) => ({ key: region.key, label: region.name }));
}

// ─── Blog ────────────────────────────────────────────────────────────────────

interface ApiPost extends Partial<BlogPost> {
  slug: string;
  title: string;
  heroImage?: string;
}

function mapPost(p: ApiPost): BlogPost {
  return {
    slug: p.slug,
    id: p.id,
    title: p.title,
    description: p.description ?? '',
    category: p.category ?? '',
    dateLabel: p.dateLabel ?? '',
    datePublished: p.datePublished ?? '',
    readTime: p.readTime ?? '',
    heroImage: assetUrl(p.heroImage) ?? '',
    heroAlt: p.heroAlt ?? '',
    body: p.body ?? '',
    excerpt: p.excerpt ?? '',
    featured: Boolean(p.featured),
    related: p.related ?? [],
    exploreHref: p.exploreHref ?? '',
    exploreText: p.exploreText ?? '',
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const data = await apiGet<ApiPost[]>(
    '/blog/public?limit=200&sortBy=datePublished&sortOrder=desc',
  );
  if (!data) return [];
  return data.map(mapPost);
}

export async function getBlogCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  return Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const data = await apiGet<ApiPost>(`/blog/public/slug/${slug}`);
  return data ? mapPost(data) : null;
}

export async function getLatestPosts(n: number): Promise<BlogPost[]> {
  const posts = await apiGet<ApiPost[]>(
    `/blog/public?limit=${n}&sortBy=datePublished&sortOrder=desc`,
  );
  if (!posts) return [];
  return posts.map(mapPost);
}

// ─── Testimonials ────────────────────────────────────────────────────────────

interface ApiTestimonial {
  id: string;
  name: string;
  quote: string;
  location?: string;
  role?: string;
  tripTitle?: string;
  rating?: number;
  videoUrl?: string;
  isActive?: boolean;
  source?: string;
}

export interface GoogleReview {
  score: number;
  totalReviews: number;
}

export interface ContactDetails {
  title: string;
  description: string;
  email: string;
  phone: string;
  whatsapp: string;
  addressLine1: string;
  addressLine2: string;
  hours: string;
  mapEmbedUrl: string;
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await apiGet<ApiTestimonial[]>('/testimonials/public?limit=50');
  // Fall back only when the API is unreachable — an empty list is a valid
  // admin choice (everything deactivated) and must be respected.
  if (!data) return [];
  return data.map((t) => ({
    id: t.id,
    quote: t.quote,
    highlight: '',
    initials: initialsOf(t.name),
    name: t.name,
    meta: [t.tripTitle, t.location].filter(Boolean).join(' · '),
    rating: t.rating,
    videoUrl: t.videoUrl,
    isActive: t.isActive,
    source: t.source,
  }));
}

// ─── Partners ────────────────────────────────────────────────────────────────

interface ApiPartner {
  name: string;
  url?: string;
  logoUrl?: string;
}

export async function getPartners(): Promise<Partner[]> {
  const data = await apiGet<ApiPartner[]>('/partners/public?limit=50');
  if (!data) return [];
  // A partner with no logo uploaded in the admin panel renders with no logo
  // here too — no bundled-asset stand-in, so the storefront always reflects
  // what's actually configured in the backend.
  return data.map((p) => ({
    name: p.name,
    logo: assetUrl(p.logoUrl) ?? '',
    href: p.url ?? '#',
  }));
}

// ─── Holidays ──────────────────────────────────────────────────────────────

/**
 * Raw shape returned by the backend Holiday CMS (snake_case columns).
 * Admins manage these records; the public site reads active ones.
 */
interface ApiHoliday {
  id: string;
  holiday_name: string;
  slug: string;
  description?: string;
  start_date: string;
  end_date: string;
  banner_image?: string;
  discount_percentage?: number | string;
  is_featured?: boolean;
  is_active?: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string | string[];
  recommended_treks?: string | string[];
  regions?: string | string[];
  body?: string | string[];
  faqs?: { q: string; a: string }[];
  created_at?: string;
  updated_at?: string;
}

/** Coerce a comma-separated string or array into a clean string[]. */
function toList(v: string | string[] | undefined): string[] {
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === 'string')
    return v
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

function mapHoliday(h: ApiHoliday): Holiday {
  return {
    id: h.id,
    name: h.holiday_name,
    slug: h.slug,
    description: h.description ?? '',
    startDate: h.start_date,
    endDate: h.end_date,
    bannerImage: assetUrl(h.banner_image) ?? '',
    discountPercentage: Number(h.discount_percentage ?? 0) || 0,
    isFeatured: Boolean(h.is_featured),
    isActive: h.is_active ?? true,
    seoTitle: h.seo_title ?? h.holiday_name,
    seoDescription: h.seo_description ?? h.description ?? '',
    seoKeywords: toList(h.seo_keywords),
    recommendedTreks: toList(h.recommended_treks),
    regions: toList(h.regions),
    body: toList(h.body),
    faqs: Array.isArray(h.faqs) ? h.faqs : [],
    createdAt: h.created_at ?? '',
    updatedAt: h.updated_at ?? '',
  };
}

/** Every active holiday (admin-managed). */
export async function getAllHolidays(): Promise<Holiday[]> {
  const data = await apiGet<ApiHoliday[]>(
    '/holidays/public?limit=200&sortBy=start_date&sortOrder=asc',
  );
  if (!data) return [];
  return data.map(mapHoliday).filter((h) => h.isActive);
}

/** A single holiday by slug. */
export async function getHolidayBySlug(slug: string): Promise<Holiday | null> {
  const data = await apiGet<ApiHoliday>(`/holidays/public/slug/${slug}`);
  return data ? mapHoliday(data) : null;
}

// ─── Site chrome (header / footer / mega-menus) ───────────────────────────────

interface ApiSiteContent<T> {
  section: string;
  data: T;
}

interface SettingsData {
  phone?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
  social?: { facebook?: string; instagram?: string; tripadvisor?: string; youtube?: string };
}
interface StatsData {
  travellers?: string;
  recommend?: string;
  countries?: string;
  rating?: string;
}
/** Title-case a region/category key, e.g. "far-west" → "Far West". */
const labelFromKey = (key: string): string =>
  key.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Build the Trekking and Tours mega-menus straight from the active trips, so
 * the menus always match the admin Trips list. Groups follow the admin-managed
 * Regions list (trek regions / tour categories, in their sort order); a trip
 * whose region or category isn't in that list still shows under its own group.
 */
async function getTripMenus(): Promise<{
  trekNav: NavGroup[];
  toursNav: NavGroup[];
  tripSlugs: Set<string>;
}> {
  const [trips, regions] = await Promise.all([
    apiGet<ApiTrip[]>('/trips/public?limit=200&sortBy=title&sortOrder=asc'),
    apiGet<ApiRegion[]>('/regions/public?limit=200&sortBy=sortOrder&sortOrder=asc'),
  ]);
  const activeRegions = (regions ?? []).filter((r) => r.isActive);

  const build = (
    list: ApiTrip[],
    type: ApiRegion['type'],
    keysOf: (t: ApiTrip) => string[],
  ): NavGroup[] => {
    const groups = new Map<string, NavGroup>();
    for (const r of activeRegions.filter((r) => r.type === type)) {
      groups.set(r.key, [r.name, r.key, []]);
    }
    for (const t of list) {
      const key = keysOf(t).find((k) => groups.has(k)) ?? keysOf(t)[0];
      if (!key) continue;
      if (!groups.has(key)) groups.set(key, [labelFromKey(key), key, []]);
      // 👇 image slot added here — adjust `t.image` to match ApiTrip's actual field
      groups.get(key)![2].push([t.title, t.slug, t.img ?? '']);
    }
    return [...groups.values()].filter((g) => g[2].length > 0);
  };

  const all = trips ?? [];
  return {
    trekNav: build(
      all.filter((t) => t.kind !== 'tour'),
      'trek-region',
      (t) => (t.region ? [t.region] : []),
    ),
    toursNav: build(
      all.filter((t) => t.kind === 'tour'),
      'tour-category',
      (t) => t.cats ?? [],
    ),
    tripSlugs: new Set(all.map((t) => t.slug)),
  };
}

interface Top10Data {
  items?: Array<{ name: string; days: string; price: string; url: string; img?: string }>;
}

/** Read the inner `data` object of a public site-content section (null on failure). */
async function getSection<T>(name: string): Promise<T | null> {
  const doc = await apiGet<ApiSiteContent<T>>(`/site-content/public/${name}`);
  return doc?.data ?? null;
}

// ─── Homepage content blocks (Featured Trips, Categories) ────────────────────

export interface FeaturedTripsFilter {
  key: string;
  label: string;
}
export interface FeaturedTripsContent {
  eyebrow: string;
  title: string;
  description: string;
  filters: FeaturedTripsFilter[];
}

export interface CategoryCard {
  name: string;
  meta: string;
  img: string;
  tall?: boolean;
}
export interface CategoryDestination {
  word: string;
  description: string;
  cats: CategoryCard[];
}
export interface CategoriesContent {
  eyebrow: string;
  destinations: CategoryDestination[];
}

/** "Top-rated Himalayan treks" homepage header + region tabs. */
export async function getFeaturedTripsContent(): Promise<FeaturedTripsContent | null> {
  const data = await getSection<FeaturedTripsContent>('featured_trips');
  if (!data?.filters?.length) return null;
  return data;
}

/** "Find your way through …" rotating destination/category block. */
export async function getCategoriesContent(): Promise<CategoriesContent | null> {
  const data = await getSection<CategoriesContent>('categories');
  if (!data?.destinations?.length) return null;
  return {
    ...data,
    destinations: data.destinations.map((d) => ({
      ...d,
      cats: d.cats.map((c) => ({ ...c, img: assetUrl(c.img) ?? c.img })),
    })),
  };
}
export async function getGoogleReview(): Promise<GoogleReview | null> {
  const data = await getSection<GoogleReview>('rating');
  return data ?? null;
}

const trekCountOf = (groups: NavGroup[]): number =>
  groups.reduce((n, g) => n + (g[2]?.length ?? 0), 0);

// ─── Vehicles (Hire a Vehicle) ────────────────────────────────────────────────

/** Resolve a vehicle image URL: keep bundled `/assets/*` + absolute URLs as-is,
 *  prefix uploaded `/static/*` paths with the backend asset host. */
function vehicleAsset(u: string): string {
  if (!u) return u;
  if (u.startsWith('http') || u.startsWith('/assets')) return u;
  return `${ASSET_BASE}${u}`;
}

/** Full fleet — admin-managed via the Vehicle CRUD module (`/vehicles/public`). */
export async function getVehicles(): Promise<Vehicle[]> {
  const data = await apiGet<Vehicle[]>('/vehicles/public?limit=100&sortBy=sortOrder&sortOrder=asc');
  if (!data) return [];
  return data.map((v) => ({
    ...v,
    img: vehicleAsset(v.img),
    gallery: (v.gallery ?? []).map(vehicleAsset),
  }));
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const list = await getVehicles();
  return list.find((v) => v.slug === slug) ?? null;
}

export async function getRelatedVehicles(slug: string, limit = 3): Promise<Vehicle[]> {
  const list = await getVehicles();
  return list.filter((v) => v.slug !== slug).slice(0, limit);
}

/**
 * Resolve everything the header/footer/mega-menus need from the backend CMS.
 * Mega-menus are generated from the trips; the rest comes from the `top10`,
 * `site_settings` and `stats` site-content sections.
 */
export async function getSiteChrome(): Promise<SiteChrome> {
  const [settings, stats, menus, top10] = await Promise.all([
    getSection<SettingsData>('site_settings'),
    getSection<StatsData>('stats'),
    getTripMenus(),
    getSection<Top10Data>('top10'),
  ]);

  const phone = settings?.phone ?? '';
  const email = settings?.email ?? '';
  const whatsapp = settings?.whatsapp ?? '';
  const address = settings?.address ?? '';

  const { trekNav, toursNav, tripSlugs } = menus;

  // Top 10 is a hand-picked list — drop entries whose trip no longer exists so
  // the menu never links to a 404.
  const liveTop10 = (top10?.items ?? []).filter((t) => {
    const slug = /^\/trek\/([^/?#]+)/.exec(t.url)?.[1];
    return !slug || tripSlugs.has(slug);
  });
  const top10Items: ChromeTop10Item[] = liveTop10.map((t) => ({
    name: t.name,
    days: t.days,
    price: t.price,
    url: t.url,
    // Top10Menu uses a plain <img>, so a backend "/static/.." path must be
    // absolutised to the asset host (assetUrl); external URLs pass through.
    img: assetUrl(t.img) ?? '',
  }));

  return {
    settings: {
      phone,
      email,
      whatsapp,
      address,
      tel: `tel:+${phone.replace(/[^0-9]/g, '')}`,
      mapsUrl: MAPS_URL,
      social: {
        facebook: settings?.social?.facebook ?? '',
        tripadvisor: settings?.social?.tripadvisor ?? '',
        ...(settings?.social?.instagram ? { instagram: settings.social.instagram } : {}),
        ...(settings?.social?.youtube ? { youtube: settings.social.youtube } : {}),
      },
    },
    stats: {
      travellers: stats?.travellers ?? '',
      recommend: stats?.recommend ?? '',
      countries: stats?.countries ?? '',
      rating: stats?.rating ?? '',
    },
    trekNav,
    toursNav,
    trekCount: trekCountOf(trekNav),
    top10: top10Items,
  };
}

export async function getContactDetails(): Promise<ContactDetails | null> {
  const data = await getSection<ContactDetails>('contact');
  return data ?? null;
}

// ─── Team (About page) ────────────────────────────────────────────────────────

export interface TeamMember {
  name: string;
  role: string;
  location: string;
  body: string;
  image?: string;
}

interface ApiTeamMember {
  name: string;
  role: string;
  location: string;
  description: string;
  profilePhoto?: string;
}

/** About-page "Meet your mountain family" team, admin-managed via the
 *  `/team-members` CRUD module. */
export async function getTeam(): Promise<TeamMember[]> {
  const data = await apiGet<ApiTeamMember[]>('/team-members/public?limit=50');
  if (!data?.length) return [];
  return data.map((m) => ({
    name: m.name,
    role: m.role,
    location: m.location,
    body: m.description,
    image: assetUrl(m.profilePhoto),
  }));
}
