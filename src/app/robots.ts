import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { getGlobalSeoDefaults } from '@/lib/seo';

/**
 * Allow-all by default (there's no `/admin` route inside this app — the
 * admin panel is a separate app on its own port/host). The one admin-managed
 * override is a site-wide "block indexing" switch (global SEO defaults'
 * `defaultRobots` set to a string containing "noindex") so a staging/preview
 * deployment can be locked down from the admin panel without a code change.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const globalDefaults = await getGlobalSeoDefaults();
  const blockAll = (globalDefaults.defaultRobots ?? '').toLowerCase().includes('noindex');

  return {
    rules: { userAgent: '*', ...(blockAll ? { disallow: '/' } : { allow: '/' }) },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
