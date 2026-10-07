import { PageBanner } from '@/components/common/PageBanner';
import { FeaturedHolidayBanner } from '@/components/holiday/FeaturedHolidayBanner';
import { HolidaysListing } from '@/components/sections/HolidaysListing';
import { waLink } from '@/data/site-config';
import { getAllHolidays } from '@/lib/cms';
import { ROUTES, SITE_URL } from '@/lib/constants';
import { featuredHolidays } from '@/lib/holiday';
import { resolveMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';

const B = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DPbgTBNQA8uVZpwmAJg2wq3SQI/';

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    entityType: 'static_page',
    entityId: 'holidays',
    path: '/holidays',
    fallback: {
      title: 'Nepal Holiday & Festival Trekking — Dashain, Tihar, Holi & More',
      description:
        'Trek Nepal around its biggest festivals. Discover Dashain, Tihar, Holi, Buddha Jayanti and seasonal trekking holidays — with countdowns, recommended treks and festival discounts.',
    },
  });
}

export default async function HolidaysPage() {
  const holidays = await getAllHolidays();
  const featured = featuredHolidays(holidays);
  const hero = featured[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Nepal Holiday & Festival Treks',
    itemListElement: holidays.map((h, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/holidays/${h.slug}`,
      name: `${h.name} Trekking in Nepal`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {hero ? (
        <FeaturedHolidayBanner
          holiday={hero}
          crumbs={[{ label: 'Home', href: '/' }, { label: 'Holidays & Festivals' }]}
        />
      ) : (
        <PageBanner
          image={`${B}hf_20260605_182858_a9262295-6618-4e53-90d0-f53abb32ce42.png`}
          crumbs={[{ label: 'Home', href: '/' }, { label: 'Holidays & Festivals' }]}
          title="Trek Nepal around its festivals"
          sub="From Dashain's clear autumn skies to spring's rhododendron bloom — plan your Himalayan adventure around Nepal's holidays and grab festival-season discounts."
          minHeight="clamp(320px,42vh,420px)"
        />
      )}

      <HolidaysListing holidays={holidays} />

      <section className="relative overflow-hidden bg-ink text-white">
        <div className="wrap relative z-2 mx-auto max-w-160 py-[var(--section-py)] text-center text-white">
          <h2 className="mb-3 font-serif text-[clamp(26px,3.6vw,38px)]">
            Not sure which festival to trek?
          </h2>
          <p className="mb-[22px] text-white/85">
            Tell us your dates and our Kathmandu team will match you to the right holiday, route and
            offer — free, no obligation.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a className="btn btn-gold" target="_blank" rel="noopener" href={waLink()}>
              Chat on WhatsApp
            </a>
            <Link className="btn btn-ghost-d" href={ROUTES.contact}>
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
