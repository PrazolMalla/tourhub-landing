import type { Trip } from '@/types/trip';

/** Short region label, e.g. "Everest Region". */
export function regionShort(trip: Trip): string {
  if (trip.regionL) return trip.regionL.split('·')[0].trim();
  const r = trip.region || '';
  return r ? `${r.charAt(0).toUpperCase()}${r.slice(1)} Region` : '';
}
