/**
 * Client-side (browser) fetcher for the /explore listing page — talks to the
 * public trips API directly so every filter change (category, region,
 * duration, price) hits live backend data instead of filtering a pre-fetched
 * array in the browser. Kept separate from `cms.ts` (the Server Component
 * data layer) so this stays a small, client-bundle-safe module.
 */
import type { Trip, TripWithSlug } from '@/types/trip';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';
const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL || 'http://localhost:3000';

function assetUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  return url.startsWith('http') ? url : `${ASSET_BASE}${url}`;
}

interface ApiTrip extends Partial<Trip> {
  id: string;
  slug: string;
  title: string;
  img?: string;
  gallery?: string[];
}

function mapTrip(t: ApiTrip): TripWithSlug {
  return {
    slug: t.slug,
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

export interface TripFacets {
  regions: Record<string, number>;
  durations: Record<string, number>;
}

export interface ToursQuery {
  /** Category key, or 'all'/undefined for no category filter. */
  cat?: string;
  country?: string;
  regions?: string[];
  /** Duration bucket keys ("d1"|"d2"|"d3"), OR semantics. */
  durations?: string[];
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface ToursResult {
  trips: TripWithSlug[];
  total: number;
  facets: TripFacets;
}

/** Fetch the tours listing filtered server-side; throws on network/API failure. */
export async function fetchTours(query: ToursQuery, signal?: AbortSignal): Promise<ToursResult> {
  const params = new URLSearchParams({ limit: '200', sortBy: 'createdAt', sortOrder: 'asc' });
  // "tours" is a frontend aggregate for every non-trekking category. The API
  // stores those packages under their specific categories (city, religious,
  // adventure, etc.), so request all and exclude trekking below.
  if (query.cat && query.cat !== 'all' && query.cat !== 'tours') params.set('cat', query.cat);
  if (query.country) params.set('country', query.country);
  if (query.regions?.length) params.set('regions', query.regions.join(','));
  if (query.durations?.length) params.set('durations', query.durations.join(','));
  if (query.minPrice !== undefined) params.set('minPrice', String(query.minPrice));
  if (query.maxPrice !== undefined) params.set('maxPrice', String(query.maxPrice));

  const res = await fetch(`${API_BASE}/trips/public?${params.toString()}`, { signal });
  if (!res.ok) throw new Error(`Tours request failed: ${res.status}`);
  const json = await res.json();
  if (!json?.success) throw new Error('Tours API returned an unsuccessful response');

  const mappedTrips = (json.data as ApiTrip[]).map(mapTrip);
  const trips =
    query.cat === 'tours'
      ? mappedTrips.filter((trip) => !trip.cats?.includes('trekking'))
      : mappedTrips;
  return {
    trips,
    total: query.cat === 'tours' ? trips.length : (json.meta?.total ?? trips.length),
    facets: json.meta?.facets ?? { regions: {}, durations: {} },
  };
}
