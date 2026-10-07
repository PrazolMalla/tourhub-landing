import TripDetailPage from '../../trek/[slug]/page';
import { getAllTrips, getTripBySlug } from '@/lib/cms';
import { getTripRouteKind } from '@/lib/trip-route';
import { resolveMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const dynamicParams = true;

export async function generateStaticParams() {
  const trips = await getAllTrips();
  return trips
    .filter((trip) => getTripRouteKind(trip) === 'tours')
    .map((trip) => ({ slug: trip.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return {};
  const canonicalKind = getTripRouteKind(trip);
  const desc = String(trip.sub || trip.overview?.[0] || `${trip.title} in Nepal.`)
    .replace(/<[^>]*>/g, '')
    .slice(0, 300);
  return resolveMetadata({
    entityType: 'trip',
    entityId: trip.id ?? '',
    path: `/${canonicalKind}/${slug}`,
    fallback: {
      title: `${trip.title} — ${trip.days} Day${trip.days > 1 ? 's' : ''}`,
      description: desc,
      image: trip.img || undefined,
      ogType: 'article',
    },
  });
}

export default function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return <TripDetailPage params={params} routeKind="tours" />;
}
