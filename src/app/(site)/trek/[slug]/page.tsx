import SectionHeader from '@/components/common/SectionHeader';

import { SinglePageNav } from '@/components/common/SinglePageNav';
import { SingleTrekPageHero } from '@/components/common/SingleTrekPageHero';
import { TripCard } from '@/components/common/TripCard';
import { TrendIcon } from '@/components/icons';
import TravelGallery from '@/components/sections/TravelGallery';
import { AltitudeChart } from '@/components/trip/AltitudeChart';
import { BookingForm } from '@/components/trip/BookingForm';
import { InclusionsTabs } from '@/components/trip/InclusionsTab';
import { ItineraryAccordion } from '@/components/trip/ItineraryAccordion';
import { MobileBookBar } from '@/components/trip/MobileBookBar';
import { getAllTrips, getRelatedTrips, getTripBySlug } from '@/lib/cms';
import { ROUTES, SITE_URL } from '@/lib/constants';
import {
  buildBreadcrumbJsonLd,
  buildTouristTripJsonLd,
  getSeoRecord,
  isStructuredDataEnabled,
  resolveMetadata,
  safeJsonLdString,
} from '@/lib/seo';
import { RADIUS, RADIUS_FULL } from '@/lib/theme';
import { getTripRouteKind, type TripRouteKind } from '@/lib/trip-route';
import { toVideoEmbedUrl } from '@/lib/video';
import { BoltIcon, ClockIcon, MapPin, Mountain, SunIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/dist/client/link';
import { notFound, redirect } from 'next/navigation';

export const dynamicParams = true;

export async function generateStaticParams() {
  const trips = await getAllTrips();
  return trips
    .filter((trip) => getTripRouteKind(trip) === 'trek')
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

export function Fact({
  icon,
  label,
  value,
  sub,
  accentSub = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accentSub?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-[10px] ${RADIUS} border border-[var(--line-dark)] bg-[rgba(255,255,255,0.025)] px-[16px] py-[26px] text-center [transition:border-color_0.25s,transform_0.25s] hover:-translate-y-0.5 hover:border-gold/40`}
    >
      <div
        className={`flex h-[48px] w-[48px] flex-none items-center justify-center ${RADIUS_FULL} border border-gold/30 bg-gold/10 text-gold [&_svg]:h-[22px] [&_svg]:w-[22px]`}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-[4px]">
        <div className={`text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted-d`}>
          {label}
        </div>
        <div className="text-[16px] font-bold leading-tight text-white!">{value}</div>
        {sub && (
          <div className={`text-[12px] ${accentSub ? 'font-semibold text-gold' : 'text-muted-d'}`}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

async function TripDetailPage({
  params,
  routeKind = 'trek',
}: {
  params: Promise<{ slug: string }>;
  routeKind?: TripRouteKind;
}) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) notFound();

  const canonicalKind = getTripRouteKind(trip);
  if (canonicalKind !== routeKind) redirect(`/${canonicalKind}/${slug}`);

  const related = await getRelatedTrips(slug, 4);
  const pcat = trip.cats?.[0] || 'tours';
  const gallery = (trip.gallery?.length ? trip.gallery : [trip.img]).map((src) => ({
    src,
    alt: trip.title,
  }));
  const availableSections = [
    'overview',
    trip.highlights?.length ? 'highlights' : null,
    trip.itin?.length ? 'itinerary' : null,
    trip.altitude && trip.altitude.length > 1 ? 'altitude' : null,
    trip.inc?.length || trip.exc?.length ? 'inclusions' : null,
    'gallery',
  ].filter(Boolean) as string[];
  const videoEmbedUrl =
    toVideoEmbedUrl(trip.videoUrl) ?? 'https://www.youtube.com/embed/zX3pg-LfBMc';
  const url = `${SITE_URL}/${canonicalKind}/${slug}`;
  const seo = await getSeoRecord('trip', trip.id ?? '');
  const jsonLd = isStructuredDataEnabled(seo)
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          buildTouristTripJsonLd({
            title: trip.title,
            description: (trip.sub || trip.overview?.[0] || '').slice(0, 300),
            image: trip.img,
            url,
            isTrekking: trip.cats?.includes('trekking'),
            price: trip.price,
          }),
          buildBreadcrumbJsonLd([
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'Explore Treks & Tours', url: `${SITE_URL}${ROUTES.explore}` },
            { name: trip.title, url },
          ]),
        ],
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdString(jsonLd) }}
        />
      )}

      {/* Banner */}
      <div id="trip-hero">
        <SingleTrekPageHero trip={trip} pcat={pcat} />
      </div>

      <SinglePageNav
        available={availableSections}
        title={trip.title}
        price={trip.price}
        priceWas={trip.was}
      />
      {/* Detail */}
      <section className=" py-[var(--section-py)] ">
        <div>
          <div>
            <div
              className="text-center mb-[52px]  items-center max-w-[1200px] mx-auto wrap"
              id="overview"
            >
              <SectionHeader eyebrow="Trip Overview" title="About This Journey." align="center" />

              <div
                className="reveal  last:mb-0 [&_p]:mb-[16px] [&_p]:text-[16.5px] [&_p]:text-muted [&_p:last-child]:mb-0"
                suppressHydrationWarning
              >
                {(trip.overview || []).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="mx-auto w-full max-w-[1000px] overflow-hidden rounded-[8px]">
                <div className="aspect-video w-full">
                  <iframe
                    className="h-full w-full"
                    src={videoEmbedUrl}
                    title="Trip Overview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {trip.itin?.length ? (
              <div
                className="reveal mb-[52px]  [&_p]:mb-[16px] [&_p]:text-[16.5px] [&_p]:text-muted [&_p:last-child]:mb-0  max-w-[1200px] mx-auto wrap"
                id="itinerary"
                suppressHydrationWarning
              >
                <SectionHeader eyebrow="Day by day" title="Trip Itinerary" align="center" />
                <ItineraryAccordion days={trip.itin} />
              </div>
            ) : null}

            <div className="bg-black">
              <SectionHeader
                eyebrow="Technical breakdown"
                title="Expedition Specifications"
                onDark={true}
                align="center"
              />
              <div className="max-w-[1200px] mx-auto py-8 wrap grid grid-cols-[minmax(0,1fr)_420px] items-center gap-[40px] max-[1100px]:grid-cols-1 max-[1100px]:gap-[20px] max-[1100px]:items-start">
                {/* Left: heading + facts */}

                <div>
                  <div className="py-8 grid grid-cols-3 gap-[16px] max-[620px]:grid-cols-2 max-[420px]:grid-cols-1">
                    <Fact
                      icon={<MapPin />}
                      label="Location"
                      value={trip.regionL}
                      sub={trip.country}
                    />
                    <Fact
                      icon={<ClockIcon />}
                      label="Duration"
                      value={`${trip.days} Day${trip.days > 1 ? 's' : ''}`}
                    />
                    <Fact icon={<TrendIcon />} label="Grade" value={trip.diff || '—'} />
                    <Fact icon={<Mountain />} label="Max Altitude" value={trip.maxAlt || '—'} />
                    <Fact icon={<BoltIcon />} label="Peak Activity" value={trip.cats?.[0] || '—'} />
                    <Fact
                      icon={<SunIcon />}
                      label="Best Season"
                      value={trip.season || 'Year-round'}
                    />
                  </div>
                </div>

                {/* Right: booking card, stays in view while the left column is read */}
                <div className="">
                  <BookingForm price={trip.price} pdfHref={trip.pdf} />
                </div>
              </div>
            </div>

            {trip.altitude && trip.altitude.length > 1 ? (
              <div
                className="wrap max-w-[1200px] mx-auto reveal mb-[52px] last:mb-0 [&_p]:mb-[16px] [&_p]:text-[16.5px] [&_p]:text-muted [&_p:last-child]:mb-0"
                id="altitude"
                suppressHydrationWarning
              >
                <SectionHeader
                  eyebrow="Altitude profile"
                  title="How high you'll climb"
                  align="center"
                />
                <AltitudeChart points={trip.altitude} />
              </div>
            ) : null}

            {trip.inc?.length || trip.exc?.length ? (
              <div className="reveal mb-[52px]" id="inclusions" suppressHydrationWarning>
                <SectionHeader
                  eyebrow="Cost includes &amp; excludes"
                  title="What's covered"
                  align="center"
                />
                <InclusionsTabs inc={trip.inc} exc={trip.exc} />
              </div>
            ) : null}

            {/* <BookingSidebar title={trip.title} days={trip.days} price={trip.price} was={trip.was} /> */}
          </div>
        </div>
        <div
          className="reveal mb-[52px] last:mb-0  [&_p]:mb-[16px] [&_p]:text-[16.5px] [&_p]:text-muted [&_p:last-child]:mb-0"
          id="gallery"
          suppressHydrationWarning
        >
          <TravelGallery
            images={gallery}
            eyebrow="Through the Lens"
            title="A Glimpse Of Our Trek."
            align="center"
          />
        </div>
      </section>

      {/* Related */}
      <section className="section trips bg-white" id="related-trips">
        <div className="wrap">
          <SectionHeader
            eyebrow="You may also like"
            title="More Himalayan journeys."
            align="center"
          />

          <div className="trip-grid">
            {related.map((t, i) => (
              <TripCard key={t.slug} trip={t} index={i} showFav={false} />
            ))}
          </div>
          <div className="col-span-full flex justify-center mt-6">
            <Link
              className="btn bg-transparent border border-gold text-gold-deep"
              href={ROUTES.tours}
            >
              View all trips
            </Link>
          </div>
        </div>
      </section>

      <MobileBookBar title={trip.title} days={trip.days} price={trip.price} />
    </>
  );
}

export default TripDetailPage;
