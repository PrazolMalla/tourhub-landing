/** Domain types for trips & tours (converted from the legacy CMS `trips-data.js`). */

export type TripCategory =
  | 'trekking'
  | 'adventure'
  | 'religious'
  | 'city'
  | 'student'
  | 'nightstay'
  | 'helicopter'
  | 'tours';

export type TripRegion =
  'everest' | 'annapurna' | 'langtang' | 'manaslu' | 'mustang' | 'central' | 'east' | 'south';

export interface ItineraryDay {
  /** Zero-padded day number, e.g. "01". */
  d: string;
  /** Day title. */
  t: string;
  /** Day body / description. */
  b?: string;
  /** Short meta chips (e.g. "5–6 hrs", "Flight"). */
  meta?: string[];
}

export interface AltitudePoint {
  /** Place label. */
  l: string;
  /** Metres. */
  m: number;
}

export interface Trip {
  title: string;
  /** Lowercase country key, e.g. "nepal" or "malaysia". */
  country: string;
  region: TripRegion | string;
  /** Long region label, e.g. "Everest Region · Khumbu". */
  regionL: string;
  cats: (TripCategory | string)[];
  days: number;
  maxAlt?: string;
  diff?: string;
  season?: string;
  group?: string;
  /** Display price, e.g. "1,390" (no currency symbol). */
  price?: string;
  /** Strike-through previous price. */
  was?: string;
  rating?: string;
  reviews?: string;
  badge?: string;
  img: string;
  sub?: string;
  overview?: string[];
  highlights?: string[];
  /** YouTube/Vimeo link shown in the "About This Journey" section. */
  videoUrl?: string;
  altitude?: AltitudePoint[];
  itin?: ItineraryDay[];
  /** Cost includes. */
  inc?: string[];
  /** Cost excludes. */
  exc?: string[];
  gallery?: string[];
}

/** A trip with its slug attached, ready for cards/listings. */
export interface TripWithSlug extends Trip {
  slug: string;
  /** Backend primary key — present when fetched live, used to key admin-managed SEO records. */
  id?: string;
  /** Backend primary key — present when fetched live, used to key admin-managed SEO records. */
  pdf?: string;
}
