import type { TripWithSlug } from '@/types/trip';

export type TripRouteKind = 'trek' | 'tours';

/** Trekking packages keep /trek; every other tour package uses /tours. */
export function getTripRouteKind(trip: Pick<TripWithSlug, 'cats'>): TripRouteKind {
  return trip.cats?.includes('trekking') ? 'trek' : 'tours';
}

export function getTripPath(trip: Pick<TripWithSlug, 'slug' | 'cats'>): string {
  return `/${getTripRouteKind(trip)}/${trip.slug}`;
}
