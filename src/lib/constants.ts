/** Primary route paths. */
export const ROUTES = {
  home: '/',
  explore: '/explore',
  /** @deprecated Use `explore`; retained as an alias for existing callers. */
  tours: '/explore',
  about: '/about',
  contact: '/contact',
  blog: '/blog',
  vehicle: '/hire-a-vehicle',
  holidays: '/holidays',
} as const;

const B = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DPbgTBNQA8uVZpwmAJg2wq3SQI/';

/** Hero cinematic montage slides (homepage). */
export const HERO_SLIDES: string[] = [
  `${B}hf_20260605_181836_f85fe75a-8623-48da-bb2a-afe59d622a14.png`,
  `${B}hf_20260605_181903_13ec6e10-19ac-4f0b-9ef5-cb2f708fc50d.png`,
  `${B}hf_20260605_181847_8b012740-f4e1-4e67-97cf-205c2d9a3c0a.png`,
  `${B}hf_20260605_181844_798264f2-bdd1-47fa-8ae4-eab144b47840.jpeg`,
  `${B}hf_20260605_181840_186dc474-7703-4494-8476-d355dbdba999.png`,
];

/** Canonical production site URL (for SEO/metadata). */
export const SITE_URL = 'https://nepalyatratours.com';
export const SITE_NAME = 'Nepal Yatra Tours & Travels';
