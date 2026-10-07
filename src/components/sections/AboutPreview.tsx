import { ROUTES } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import { ReadingText } from '../common/ReadingText';
import SectionHeader from '../common/SectionHeader';

/** Homepage "who we are" section with parallax B&W background. */
const COMPANY_ABOUT =
  'Nepal Yatra Tours & Travels crafts unforgettable journeys through the Himalayas, ancient temples, historic cities, sacred sites, and vibrant cultures of Nepal. As a local team, we carefully plan every trek, pilgrimage, cultural experience, and city tour around your interests. From routes and accommodation to transportation and logistics, we handle the details so you can focus on experiencing the beauty of Nepal.';
export function AboutPreview() {
  return (
    <section className="section relative overflow-hidden" id="about">
      {/* Parallax B&W background */}
      <div className="absolute inset-0 -z-10 bg-cover bg-center bg-fixed bg-black" />
      {/* Dark overlay so text stays readable */}

      <div className="wrap">
        <SectionHeader eyebrow="Who we are" title="Tour Hub Nepal" onDark={true} align="center" />

        <Image
          src={'/assets/logo.png'}
          alt="Nepal Yatra Tours & Travels logo"
          className="mx-auto mb-6"
          width={200}
          height={200}
        />
        <ReadingText
          text={COMPANY_ABOUT}
          className="mx-auto max-w-[62ch] text-center text-lg leading-relaxed text-white text-xl capitalize"
        />

        <div className="grid items-center max-[900px]:grid-cols-[1fr]">
          <div className="reveal" suppressHydrationWarning>
            <div className="mt-[32px] flex gap-[14px] flex-col md:flex-row justify-center items-center w-full">
              <Link className="btn btn-gold" href={ROUTES.about}>
                More About Us
              </Link>
              <Link className="btn btn-ghost-d" href={ROUTES.contact}>
                Book Your Trip
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
