/** Site configuration types (converted from the legacy `site-config.js` `HM_CFG`). */

/** A nav group: [label, slug, [ [tripTitle, tripSlug], ... ] ]. */
export type TripEntry = [title: string, slug: string, image: string];
export type NavGroup = [name: string, key: string, trips: TripEntry[]];

export interface SiteNav {
  trek: NavGroup[];
  tours: NavGroup[];
}

export interface SiteConfig {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  stat_travellers: string;
  stat_recommend: string;
  stat_countries: string;
  rating: string;
  featured: string[] | null;
  nav: SiteNav;
}

/* ── Dynamic site chrome (header/footer/menus) served by the backend ────────── */

export interface ChromeSettings {
  phone: string;
  email: string;
  /** `tel:` href derived from the phone. */
  tel: string;
  whatsapp: string;
  address: string;
  mapsUrl: string;
  social: {
    facebook: string;
    instagram?: string;
    tripadvisor: string;
    youtube?: string;
  };
}

export interface ChromeStats {
  travellers: string;
  recommend: string;
  countries: string;
  rating: string;
}

export interface ChromeTop10Item {
  name: string;
  days: string;
  price: string;
  img: string;
  url: string;
}

/**
 * Everything the header/footer/mega-menus need, resolved server-side from the
 * backend CMS with a per-field static fallback (so the UI is byte-identical
 * when the API is offline). Managed by admins via the `navigation`, `top10`,
 * `site_settings` and `stats` site-content sections.
 */
export interface SiteChrome {
  settings: ChromeSettings;
  stats: ChromeStats;
  trekNav: NavGroup[];
  toursNav: NavGroup[];
  trekCount: number;
  top10: ChromeTop10Item[];
}
