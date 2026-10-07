import { SinglePageHero } from '@/components/common/SinglePageHero';
import { BlogIndex } from '@/components/sections/BlogIndex';
import { waLink } from '@/data/site-config';
import { getAllPosts, getBlogCategories } from '@/lib/cms';
import { ROUTES } from '@/lib/constants';
import { resolveMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';

const HERO = 'https://images.pexels.com/photos/15917025/pexels-photo-15917025.jpeg';

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    entityType: 'static_page',
    entityId: 'blog',
    path: '/blog',
    fallback: {
      title: 'Nepal Trekking Blog & Travel Guides',
      description:
        'Expert trekking guides, planning tips and travel stories for Nepal — Everest, Annapurna, Manaslu, Langtang, Upper Mustang and more, from a local Kathmandu operator.',
    },
  });
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getAllPosts(), getBlogCategories()]);
  return (
    <>
      <SinglePageHero
        media={{ type: 'video', src: 'assets/videos/blog.mp4' }}
        title="The Mountain Journal"
        sub="Stories, insights, and guides to help you travel deeper into the Himalayas"
        leftImage="https://images.pexels.com/photos/14663618/pexels-photo-14663618.jpeg"
        rightImage="https://images.unsplash.com/photo-1726802016078-5cfbf05b249d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />

      <BlogIndex posts={posts} categories={categories} />
      <section className="relative text-white overflow-hidden bg-ink">
        <div className="wrap relative z-2 text-center py-[var(--section-py)] max-w-160 mx-auto text-white">
          <h2 className="font-serif text-[clamp(26px,3.6vw,38px)] mb-3">
            Got a question we haven&apos;t answered?
          </h2>
          <p className="text-white/85 mb-[22px]">
            Our Kathmandu team is happy to help you plan — no obligation, no pushy sales.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
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
