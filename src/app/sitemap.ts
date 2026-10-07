import type { MetadataRoute } from 'next';
import { getTripPath } from '@/lib/trip-route';
import { SITE_URL } from '@/lib/constants';
import { getAllTrips, getAllPosts, getAllHolidays, getVehicles } from '@/lib/cms';
import { getSeoIndexMap } from '@/lib/seo';

/** Static route → the `static_page` SEO entityId that governs its indexability. */
const STATIC_ROUTES: Array<{ path: string; entityId: string }> = [
  { path: '', entityId: 'home' },
  { path: '/explore', entityId: 'tours' },
  { path: '/about', entityId: 'about' },
  { path: '/contact', entityId: 'contact' },
  { path: '/blog', entityId: 'blog' },
  { path: '/holidays', entityId: 'holidays' },
  { path: '/hire-a-vehicle', entityId: 'vehicles' },
  { path: '/privacy', entityId: 'privacy' },
  { path: '/terms', entityId: 'terms' },
];

/** `false` only when an admin explicitly set "No Index" — everything else (including no record) stays included. */
const isIndexable = (map: Map<string, boolean>, entityId: string | undefined): boolean =>
  !entityId || map.get(entityId) !== false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    trips,
    posts,
    holidays,
    vehiclesList,
    staticIndex,
    tripIndex,
    blogIndex,
    holidayIndex,
    vehicleIndex,
  ] = await Promise.all([
    getAllTrips(),
    getAllPosts(),
    getAllHolidays(),
    getVehicles(),
    getSeoIndexMap('static_page'),
    getSeoIndexMap('trip'),
    getSeoIndexMap('blog'),
    getSeoIndexMap('holiday'),
    getSeoIndexMap('vehicle'),
  ]);

  const pages: MetadataRoute.Sitemap = STATIC_ROUTES.filter((r) =>
    isIndexable(staticIndex, r.entityId),
  ).map((r) => ({
    url: `${SITE_URL}${r.path}`,
    changeFrequency: 'weekly',
    priority: r.path === '' ? 1 : 0.8,
  }));

  const tripPages: MetadataRoute.Sitemap = trips
    .filter((t) => isIndexable(tripIndex, t.id))
    .map((t) => ({
      url: `${SITE_URL}${getTripPath(t)}`,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  const articles: MetadataRoute.Sitemap = posts
    .filter((p) => isIndexable(blogIndex, p.id))
    .map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.datePublished || undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  const vehicles: MetadataRoute.Sitemap = vehiclesList
    .filter((v) => isIndexable(vehicleIndex, v.id))
    .map((v) => ({
      url: `${SITE_URL}/hire-a-vehicle/${v.slug}`,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  const holidayPages: MetadataRoute.Sitemap = holidays
    .filter((h) => isIndexable(holidayIndex, h.id))
    .map((h) => ({
      url: `${SITE_URL}/holidays/${h.slug}`,
      lastModified: h.updatedAt || undefined,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  return [...pages, ...tripPages, ...articles, ...vehicles, ...holidayPages];
}
