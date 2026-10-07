import { AboutPreview } from '@/components/sections/AboutPreview';
import { BlogPreview } from '@/components/sections/BlogPreview';
import { Categories } from '@/components/sections/Categories';
import { FeaturedTrips } from '@/components/sections/FeaturedTrips';
import { Hero } from '@/components/sections/Hero';
import { Regions } from '@/components/sections/Regions';
import { Testimonials } from '@/components/sections/Testimonials';
import TravelGallery from '@/components/sections/TravelGallery';
import { UpcomingHolidays } from '@/components/sections/UpcomingHolidays';
import { galleryImages } from '@/data/gallery';
import {
  getAllHolidays,
  getCategoriesContent,
  getFeaturedTrips,
  getFeaturedTripsContent,
  getGoogleReview,
  getTestimonials,
} from '@/lib/cms';
import { resolveMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    entityType: 'static_page',
    entityId: 'home',
    path: '/',
    fallback: {
      title: 'Nepal Yatra — Tours & Travels in Nepal',
      titleIsComplete: true,
      description:
        'Nepal Yatra Tours and Travels — trekking, tours and tailor-made Himalayan adventures across Everest, Annapurna, Langtang, Manaslu and Mustang.',
    },
  });
}

export default async function HomePage() {
  const [googleReview, featured, testimonials, holidays, featuredTripsContent, categoriesContent] =
    await Promise.all([
      getGoogleReview(),
      getFeaturedTrips(),
      getTestimonials(),
      getAllHolidays(),
      getFeaturedTripsContent(),
      getCategoriesContent(),
    ]);
  return (
    <>
      <Hero googleReview={googleReview} />
      {/* <PlanBar /> */}
      <FeaturedTrips trips={featured} {...(featuredTripsContent ?? {})} />
      <AboutPreview />
      <Categories {...(categoriesContent ?? {})} />
      <Regions />
      <Testimonials items={testimonials} />
      <UpcomingHolidays holidays={holidays} />
      <BlogPreview />
      <TravelGallery images={galleryImages} eyebrow="Through the Lens" title="Nepal, in motion." />
    </>
  );
}
