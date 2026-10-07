import { AboutReadMore } from '@/components/about/AboutReadMore';
import { Team } from '@/components/about/TeamCarousel';
import { TextMasking } from '@/components/about/TextMasking';
import SectionHeader from '@/components/common/SectionHeader';
import { SinglePageHero } from '@/components/common/SinglePageHero';
import { getTeam, type TeamMember } from '@/lib/cms';
import { ROUTES } from '@/lib/constants';
import { resolveMetadata } from '@/lib/seo';
import {
  Handshake,
  Heart,
  Medal,
  Mountains,
  PersonSimpleHike,
  PhoneCall,
  ShieldCheck,
  UsersThree,
} from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Fact } from '../trek/[slug]/page';

const B = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DPbgTBNQA8uVZpwmAJg2wq3SQI/';

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    entityType: 'static_page',
    entityId: 'about',
    path: '/about',
    fallback: {
      title: 'About Us — Nepal Yatra Tours & Travels',
      titleIsComplete: true,
      description:
        'A local team born in the shadow of the Himalaya. Meet Nepal Yatra Tours & Travels — our story, our values and the guides who lead the way.',
    },
  });
}

const STATS: [string, string][] = [
  ['5+', 'Years Guiding'],
  ['1,200+', 'Happy Travellers'],
  ['14', 'Trek Routes'],
  ['40+', 'Countries Served'],
];

const VALUES = [
  {
    Icon: ShieldCheck,
    title: 'Safety First',
    body: 'We follow careful safety planning to make every journey secure and comfortable.',
  },
  {
    Icon: Handshake,
    title: 'Authentic Experiences',
    body: 'We create real local experiences beyond the typical tourist trail.',
  },
  {
    Icon: Heart,
    title: 'Personalized Care',
    body: 'Every trip is planned with care, tailored to your needs and expectations.',
  },
  {
    Icon: Mountains,
    title: 'Expert Team',
    body: 'Our guides and staff are experienced, licensed, and truly passionate.',
  },
  {
    Icon: PhoneCall,
    title: '24/7 Support',
    body: 'From your first enquiry until you arrive home, our team is only a message or phone call away.',
  },
];

// The real TeamMember backend model has no icon concept — cycle the same
// four Phosphor icons by index so the decorative badge keeps rendering.

/** Backend team members (admin-managed) map to the card shape this page
 *  renders — icons cycle by index, `role`/`location` rejoin into a single
 *  "Role · Location" subheading. */
const TEAM_ICONS = ['mountains', 'hiker', 'chat', 'headset'] as const;

function resolveTeam(remote: TeamMember[]) {
  return remote.map((m, i) => ({
    icon: TEAM_ICONS[i % TEAM_ICONS.length] ?? 'mountains',
    name: m.name,
    role: [m.role, m.location].filter(Boolean).join(' · '),
    image: m.image ?? '',
    body: m.body,
  }));
}

// function MountainAvatar() {
//   return (
//     <div
//       className={`w-full aspect-square rounded-(--r-lg) mb-4 flex items-center justify-center ${TEXT_ACCENT} bg-[linear-gradient(160deg,#fff_0%,var(--paper-2)_100%)] border border-line`}
//     >
//       {/* <svg viewBox="0 0 64 40" fill="none" className="w-[46%] h-auto">
//         <path d="M2 38 L22 10 L31 23 L40 6 L62 38 Z" fill="currentColor" />
//         <path d="M22 10 L27 17 L24 21 L19 15 Z" fill="#fff" opacity=".85" />
//         <path d="M40 6 L45 14 L42 18 L37 11 Z" fill="#fff" opacity=".85" />
//       </svg> */}
//       <Image src="https://images.pexels.com/photos/18874178/pexels-photo-18874178.jpeg" alt="Mountain Guide" width={100} height={100} />
//     </div>
//   );
// }
const ABOUT_STATS = [
  {
    Icon: PersonSimpleHike,
    number: '05',
    label: 'Years of Experience',
  },
  {
    Icon: UsersThree,
    number: '1200+',
    label: 'Happy Travelers',
  },
  {
    Icon: Mountains,
    number: '14',
    label: 'Treks & Tours',
  },
  {
    Icon: Medal,
    number: '98%',
    label: 'Client Satisfaction',
  },
];

const ABOUT_US = [
  'Tour Hub Nepal crafts meaningful journeys through the Himalayas, ancient temples, historic cities, sacred sites, and vibrant cultures of Nepal. We believe that travelling through Nepal is about more than simply visiting beautiful places—it is about meeting the people, discovering the stories, experiencing local traditions, and creating memories that stay with you long after the journey ends.',
  'As a locally based team, we bring firsthand knowledge of Nepal’s destinations, landscapes, communities, and travel routes to every journey we plan. Whether you are looking for an unforgettable Himalayan trek, a peaceful pilgrimage, an immersive cultural experience, or a relaxed city tour, we take the time to understand your interests and shape the journey around you.',
  'With local expertise and a genuine passion for our country, we are here to help you discover Nepal beyond the usual paths—one destination, one experience, and one unforgettable journey at a time.',
];

export default async function AboutPage() {
  const team = resolveTeam(await getTeam());
  return (
    // Front page
    <>
      <SinglePageHero
        media={{ type: 'video', src: '/assets/videos/about.mp4' }}
        title="About Tour Hub Nepal."
        sub="Authentic journeys, local expertise, and unforgettable adventures across Nepal."
        leftImage="/assets/trekking.webp"
        rightImage="/assets/lakhey.webp"
      />

      <section className="section relative overflow-hidden" id="about">
        {/* Parallax B&W background */}
        <div className="absolute inset-0 -z-10 bg-cover bg-center bg-fixed bg-white" />
        {/* Dark overlay so text stays readable */}

        <div className="wrap">
          <SectionHeader eyebrow="Who we are" title="Tour Hub Nepal" align="center" />

          <Image
            src={'/assets/logo-black.png'}
            alt="Tour Hub Nepal"
            className="mx-auto mb-6"
            width={200}
            height={200}
          />
          <AboutReadMore
            paragraphs={ABOUT_US}
            className="text-center text-xl leading-relaxed text-gold "
          />
        </div>
      </section>

      {/* 6 features  */}

      <section className="section bg-black">
        <div className="wrap">
          <SectionHeader
            eyebrow="Our Values"
            title="What We Believe In"
            align="center"
            onDark={true}
          />

          <div className="grid grid-cols-5 gap-4 max-[1000px]:grid-cols-2 max-[520px]:grid-cols-1">
            {VALUES.map(({ Icon, title, body }, index) => (
              <Fact key={title} icon={<Icon />} label={title} value={body} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Members */}

      <TextMasking
        src="/assets/videos/hero.mp4"
        masking="Into the Heart of the Himalaya"
        href={ROUTES.contact}
        ctaLabel="Plan Your Adventure"
        quote="The mountains don't ask who you are. They only ask that you arrive."
      />

      <div className="bg-black text-white py-4">
        <div className="wrap">
          {/* Intro */}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4">
            {ABOUT_STATS.map(({ Icon, number, label }, index) => (
              <div
                key={label}
                className="group relative flex min-h-[190px] flex-col justify-between border-b border-white/10 px-6 py-7 transition-colors duration-300 hover:bg-white/[0.035] md:min-h-[220px] md:border-b-0 md:border-l md:px-7"
              >
                {/* Number */}
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] tracking-[0.12em] text-white/25">
                    0{index + 1}
                  </span>

                  <Icon
                    size={20}
                    weight="regular"
                    className="text-gold/70 transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110"
                  />
                </div>

                {/* Value */}
                <div>
                  <div className="font-serif text-[clamp(42px,4vw,64px)] leading-none tracking-[-0.04em] text-gold">
                    {number}
                  </div>

                  <div className="mt-3 max-w-[120px] font-mono text-[9.5px] uppercase leading-4 tracking-[0.14em] text-white/40">
                    {label}
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Team items={team}></Team>

      {/* the himalaya is calling section */}
    </>
  );
}
