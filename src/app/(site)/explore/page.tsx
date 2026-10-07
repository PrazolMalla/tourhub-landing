import { SinglePageHero } from '@/components/common/SinglePageHero';
import { ToursListing } from '@/components/sections/ToursListing';
import { getAllTrips, getExploreRegions } from '@/lib/cms';
import { resolveMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

const B = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DPbgTBNQA8uVZpwmAJg2wq3SQI/';

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    entityType: 'static_page',
    entityId: 'tours',
    path: '/explore',
    fallback: {
      title: 'Explore Treks & Tours in Nepal',
      description:
        'Explore all Nepal Yatra treks and tours — filter by region, activity and duration. From Everest Base Camp to Mustang, Ilam and beyond.',
    },
  });
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; country?: string; region?: string }>;
}) {
  const { cat, country, region } = await searchParams;
  const [trips, regions] = await Promise.all([getAllTrips(), getExploreRegions()]);
  console.log(trips);
  const countryOptions = Array.from(
    new Map(
      trips.map((trip) => [
        trip.country,
        trip.country.replace(/(^|[-\s])\p{L}/gu, (letter) => letter.toUpperCase()),
      ]),
    ),
    ([key, label]) => ({ key, label }),
  );
  return (
    <>
      <SinglePageHero
        media={{
          type: 'image',
          src: 'https://images.pexels.com/photos/18651260/pexels-photo-18651260.jpeg',
        }}
        title="Find Your Adventure"
        sub="Explore treks, tours and experiences across the Himalayas, from iconic trails to hidden gems."
        leftImage="https://images.pexels.com/photos/17390683/pexels-photo-17390683.jpeg"
        rightImage="https://images.pexels.com/photos/30400181/pexels-photo-30400181.jpeg"
      />

      <ToursListing
        key={`${cat ?? 'all'}:${country ?? 'all'}:${region ?? 'all'}`}
        trips={trips}
        countryOptions={countryOptions}
        regionOptions={regions}
        initialCat={cat}
        initialCountry={country}
        initialRegion={region}
      />
    </>
  );
}
