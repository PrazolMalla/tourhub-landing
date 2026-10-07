import SectionHeader from '@/components/common/SectionHeader';
import { SinglePageHero } from '@/components/common/SinglePageHero';
import { TripCard } from '@/components/common/TripCard';
import { ArrowRightIcon, CheckIcon } from '@/components/icons';
import { EMAIL, PHONE, TEL, waLink } from '@/data/site-config';
import { getAllHolidays, getAllTrips, getHolidayBySlug } from '@/lib/cms';
import { ROUTES, SITE_NAME, SITE_URL } from '@/lib/constants';
import { formatDateRange, holidayHeadline, upcomingHolidays } from '@/lib/holiday';
import {
  getSeoRecord,
  isStructuredDataEnabled,
  resolveMetadata,
  safeJsonLdString,
} from '@/lib/seo';
import { BORDER, RADIUS, RADIUS_FULL, TEXT, TEXT_ACCENT, TEXT_MUTED } from '@/lib/theme';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamicParams = true;

export async function generateStaticParams() {
  const holidays = await getAllHolidays();
  return holidays.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const holiday = await getHolidayBySlug(slug);
  if (!holiday) return {};
  // Fallback chain: admin SEO record → this holiday's own seoTitle/seoDescription
  // (legacy per-record fields already on the Holiday model) → global default.
  return resolveMetadata({
    entityType: 'holiday',
    entityId: holiday.id,
    path: `/holidays/${slug}`,
    fallback: {
      title: holiday.seoTitle || holiday.name,
      description: holiday.seoDescription || holiday.description,
      image: holiday.bannerImage || undefined,
    },
  });
}

export default async function HolidayLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const holiday = await getHolidayBySlug(slug);
  if (!holiday) notFound();

  const [allTrips, allHolidays] = await Promise.all([getAllTrips(), getAllHolidays()]);
  const tripBySlug = new Map(allTrips.map((t) => [t.slug, t]));
  const treks = holiday.recommendedTreks
    .map((s) => tripBySlug.get(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  // Other upcoming holidays for internal linking (exclude the current one).
  const otherHolidays = upcomingHolidays(allHolidays)
    .filter((h) => h.slug !== holiday.slug)
    .slice(0, 4);

  const url = `${SITE_URL}/holidays/${slug}`;
  const dateRange = formatDateRange(holiday.startDate, holiday.endDate);
  const seo = await getSeoRecord('holiday', holiday.id);

  const jsonLd = !isStructuredDataEnabled(seo)
    ? null
    : {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Event',
            name: holidayHeadline(holiday.name),
            description: holiday.seoDescription || holiday.description,
            startDate: holiday.startDate,
            endDate: holiday.endDate,
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            image: holiday.bannerImage ? [holiday.bannerImage] : undefined,
            location: {
              '@type': 'Place',
              name: 'Nepal',
              address: { '@type': 'PostalAddress', addressCountry: 'NP' },
            },
            organizer: { '@type': 'TravelAgency', name: SITE_NAME, url: SITE_URL },
            ...(holiday.discountPercentage > 0
              ? {
                  offers: {
                    '@type': 'Offer',
                    name: `${holiday.name} festival discount — ${holiday.discountPercentage}% off`,
                    availability: 'https://schema.org/InStock',
                    url,
                    priceCurrency: 'USD',
                  },
                }
              : {}),
          },
          ...(holiday.faqs.length
            ? [
                {
                  '@type': 'FAQPage',
                  mainEntity: holiday.faqs.map((f) => ({
                    '@type': 'Question',
                    name: f.q,
                    acceptedAnswer: { '@type': 'Answer', text: f.a },
                  })),
                },
              ]
            : []),
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'Holidays', item: `${SITE_URL}/holidays` },
              { '@type': 'ListItem', position: 3, name: holiday.name, item: url },
            ],
          },
        ],
      };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdString(jsonLd) }}
        />
      )}

      {/* Hero */}

      <SinglePageHero
        media={{
          type: 'image',
          src: holiday.bannerImage,
        }}
        title={holidayHeadline(holiday.name)}
        sub={holiday.description}
        leftImage="https://images.pexels.com/photos/14663618/pexels-photo-14663618.jpeg"
        rightImage="https://images.unsplash.com/photo-1726802016078-5cfbf05b249d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />

      {/* Body + offer */}
      <section className="bg-paper py-[var(--section-py)]">
        <div className="wrap">
          <div className="grid grid-cols-[1fr_360px] items-start gap-[clamp(34px,4vw,64px)] max-[980px]:grid-cols-[1fr]">
            <div>
              <SectionHeader
                eyebrow="About this holiday"
                title={`Why trek Nepal during ${holiday.name}`}
                align="left"
              />

              {holiday.body.map((p, i) => (
                <p key={i} className={`mb-4 text-[16.5px] leading-[1.7] ${TEXT_MUTED}`}>
                  {p}
                </p>
              ))}
            </div>

            {/* Offer / quick-facts card */}
            <aside
              className={`sticky top-[100px] ${RADIUS} ${BORDER} bg-white p-7 max-[980px]:static`}
            >
              {holiday.discountPercentage > 0 ? (
                <div className={`mb-5 ${RADIUS} bg-[var(--gold-soft)] p-5 text-center`}>
                  <div className="font-serif text-[44px] leading-none text-gold-deep">
                    {holiday.discountPercentage}%
                  </div>
                  <div
                    className={`mt-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] ${TEXT_ACCENT}`}
                  >
                    Festival-season discount
                  </div>
                </div>
              ) : null}
              <dl className="flex flex-col gap-3.5 text-[14.5px]">
                <div className="flex items-center justify-between gap-4">
                  <dt className={TEXT_MUTED}>Dates</dt>
                  <dd className={`font-semibold ${TEXT}`}>{dateRange}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className={TEXT_MUTED}>Recommended treks</dt>
                  <dd className={`font-semibold ${TEXT}`}>{treks.length}</dd>
                </div>
                {holiday.regions.length ? (
                  <div className="flex items-center justify-between gap-4">
                    <dt className={TEXT_MUTED}>Regions</dt>
                    <dd className={`text-right font-semibold capitalize ${TEXT}`}>
                      {holiday.regions.join(', ')}
                    </dd>
                  </div>
                ) : null}
              </dl>
              <a
                className="btn btn-gold mt-6 w-full"
                target="_blank"
                rel="noopener"
                href={waLink(
                  `Hi! I'd like to book a ${holiday.name} trek${
                    holiday.discountPercentage > 0
                      ? ` with the ${holiday.discountPercentage}% festival offer`
                      : ''
                  }.`,
                )}
              >
                Book on WhatsApp
              </a>
              <a className="btn btn-ghost mt-2.5 w-full" href={TEL}>
                Call {PHONE}
              </a>
            </aside>
          </div>
        </div>
      </section>

      {/* Recommended treks */}
      {treks.length ? (
        <section className="section trips bg-paper-2">
          <div className="wrap">
            <SectionHeader
              eyebrow={`Best treks for ${holiday.name}`}
              title={`Recommended ${holiday.name} treks.`}
            />

            <div className="trip-grid">
              {treks.map((t, i) => (
                <TripCard key={t.slug} trip={t} index={i} showFav={false} />
              ))}
            </div>
            {holiday.discountPercentage > 0 ? (
              <p
                className="reveal mt-6 mb-6
               text-center text-[14px] text-black/70"
                suppressHydrationWarning
              >
                {holiday.discountPercentage}% {holiday.name} discount applied at booking on the
                treks above — message us to confirm your dates.
              </p>
            ) : null}
          </div>
          <div className="flex items-center justify-center w-full">
            <Link className="btn btn-ghost" href={`${ROUTES.tours}?cat=trekking`}>
              View all treks
            </Link>
          </div>
        </section>
      ) : null}

      {/* FAQs */}
      {holiday.faqs.length ? (
        <section className="section bg-paper">
          <div className="wrap max-w-190">
            <SectionHeader eyebrow="Good to Know" title={`${holiday.name} trekking FAQs`} />

            <div className="mt-2 flex flex-col gap-3">
              {holiday.faqs.map((f, i) => (
                <details
                  key={i}
                  className={`group bg-white ${RADIUS} ${BORDER} px-5 py-4.5 [&_summary]:cursor-pointer [&_summary]:list-none`}
                >
                  <summary
                    className={`flex items-center justify-between gap-4 font-sans text-[16.5px] font-bold ${TEXT}`}
                  >
                    {f.q}
                    <span
                      className={`flex h-7 w-7 flex-none items-center justify-center ${RADIUS_FULL} bg-paper ${TEXT_ACCENT} transition-transform group-open:rotate-45`}
                    >
                      +
                    </span>
                  </summary>
                  <p className={`mt-3 text-[15.5px] leading-[1.65] ${TEXT_MUTED}`}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Internal linking — other holidays */}
      {otherHolidays.length ? (
        <section className="section bg-paper-2 border-t border-(--line)">
          <div className="wrap">
            <SectionHeader eyebrow="Plane ahead" title="Other Nepal holidays to trek" />

            <div className="grid grid-cols-2 gap-4 max-[620px]:grid-cols-1">
              {otherHolidays.map((h) => (
                <Link
                  key={h.id}
                  href={`/holidays/${h.slug}`}
                  className={`group flex items-center justify-between gap-4 bg-white ${RADIUS} ${BORDER} px-6 py-5 [transition:transform_0.2s,box-shadow_0.2s] hover:-translate-y-0.5 hover:shadow-(--shadow)`}
                >
                  <div>
                    <div className={`font-serif text-[20px] ${TEXT} group-hover:text-gold-deep`}>
                      {holidayHeadline(h.name)}
                    </div>
                    <div
                      className={`mt-1 font-mono text-[11px] uppercase tracking-[0.08em] ${TEXT_MUTED}`}
                    >
                      {formatDateRange(h.startDate, h.endDate)}
                      {h.discountPercentage > 0 ? ` · Save ${h.discountPercentage}%` : ''}
                    </div>
                  </div>
                  <span
                    className={`flex h-10 w-10 flex-none items-center justify-center ${RADIUS_FULL} bg-paper ${TEXT} group-hover:bg-green-btn group-hover:text-white [transition:background_0.2s]`}
                  >
                    <ArrowRightIcon className="h-4.5 w-4.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="wrap relative z-2 mx-auto max-w-160 py-[var(--section-py)] text-center text-white">
          <SectionHeader
            eyebrow="Limited festival dates"
            title={`Secure your ${holiday.name} trek before it's gone`}
            onDark
          />
          <p className="mb-[22px] text-white/85">
            Festival-season slots, flights and lodges book out fast. Reserve now to lock in your
            dates
            {holiday.discountPercentage > 0
              ? ` and the ${holiday.discountPercentage}% discount`
              : ''}
            .
          </p>
          <ul className="mb-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[14px] text-white/80">
            {[
              'Free cancellation up to 30 days',
              'Licensed local guides',
              'Reply within 1–2 hours',
            ].map((x) => (
              <li key={x} className="inline-flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-gold" /> {x}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              className="btn btn-gold"
              target="_blank"
              rel="noopener"
              href={waLink(`Hi! I'd like to plan a ${holiday.name} trek.`)}
            >
              Book on WhatsApp
            </a>
            <a className="btn btn-ghost-d" href={`mailto:${EMAIL}`}>
              Email us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
