import { TextMasking } from '@/components/about/TextMasking';
import { BlogCard } from '@/components/common/BlogCard';
import ReadingProgress from '@/components/common/ReadingProgress';
import SectionHeader from '@/components/common/SectionHeader';
import { SinglePageHero } from '@/components/common/SinglePageHero';
import TableOfContents from '@/components/common/TableOfContent';
import CopyLinkButton from '@/components/ui/CopyLinkButton';
import { getAllPosts, getPostBySlug } from '@/lib/cms';
import { ROUTES, SITE_URL } from '@/lib/constants';
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  getSeoRecord,
  isStructuredDataEnabled,
  resolveMetadata,
  safeJsonLdString,
} from '@/lib/seo';
import { TEXT_ACCENT, TEXT_MUTED } from '@/lib/theme';
import { extractHeadings } from '@/lib/utils';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamicParams = true;

// Move to '@/lib/constants' so the number lives in one place.
const WHATSAPP_URL = 'https://wa.me/9779841906050';

const chip =
  'inline-flex h-10 items-center rounded-full border border-(--line) px-4 text-[14px] font-semibold transition-colors hover:bg-paper-2 focus-visible:outline-2 focus-visible:outline-offset-2';

function readingMinutes(html: string) {
  const words = html
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function formatDate(value?: string) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return resolveMetadata({
    entityType: 'blog',
    entityId: post.id ?? '',
    path: `/blog/${slug}`,
    fallback: {
      title: post.title,
      description: post.description,
      image: post.heroImage || undefined,
      ogType: 'article',
    },
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // Fetch in parallel: these don't depend on each other.
  const [allPosts, seo] = await Promise.all([getAllPosts(), getSeoRecord('blog', post.id ?? '')]);
  const postBySlug = new Map(allPosts.map((p) => [p.slug, p]));

  const url = `${SITE_URL}/blog/${slug}`;
  const encoded = encodeURIComponent(url);
  const headings = extractHeadings(post.body);
  const minutes = readingMinutes(post.body);
  const published = formatDate(post.datePublished);

  const jsonLd = isStructuredDataEnabled(seo)
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          buildArticleJsonLd({
            title: post.title,
            description: post.description,
            image: post.heroImage,
            datePublished: post.datePublished,
            url,
          }),
          buildBreadcrumbJsonLd([
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'Blog', url: `${SITE_URL}/blog` },
            { name: post.title, url },
          ]),
        ],
      }
    : null;

  const share = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${encoded}`, icon: '/assets/whatsapp.png' },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      icon: '/assets/facebook.png',
    },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${encoded}`, icon: '/assets/x.png' },
  ];

  const exploreHref =
    post.exploreHref &&
    (/^https?:\/\//i.test(post.exploreHref) || post.exploreHref.startsWith('/')
      ? post.exploreHref
      : `/${post.exploreHref}`);

  return (
    <article className="bg-white pb-24 lg:pb-0">
      <ReadingProgress targetId="article-body" />

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdString(jsonLd) }}
        />
      )}

      {/* Header: title first, because the title is the promise the reader clicked on */}

      <SinglePageHero
        media={{
          type: 'image',
          src: post.heroImage,
        }}
        title={post.title}
        sub={post.description}
      />

      {/* Reading layout: share rail | article | contents */}
      <div className="wrap">
        <div
          className="
            grid grid-cols-1 gap-10 py-12
            md:py-16
            lg:grid-cols-[minmax(0,720px)_220px] lg:justify-center lg:gap-16
            xl:grid-cols-[56px_minmax(0,720px)_240px] xl:gap-14
          "
        >
          {/* Share rail (desktop only; mobile gets the footer row) */}
          <div className="hidden xl:block">
            <div className="sticky top-28 flex flex-col gap-2" aria-label="Share">
              {share.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share on ${s.label}`}
                  className="grid size-12 place-items-center rounded-full border border-(--line) text-[13px] font-semibold transition-colors bg-black  hover:bg-gold"
                >
                  <Image src={s.icon} width={25} height={25} alt={s.label} className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Article */}
          <main id="article-body" className="min-w-0">
            <h1
              className="font-serif
              text-3xl
              font-bold
              leading-[1.05]
              tracking-[-0.02em]
              mb-4"
            >
              {post.title}
            </h1>
            <div className="art-body" dangerouslySetInnerHTML={{ __html: post.body }} />

            {/* End-of-article CTA: reader just finished, intent is at its peak */}
            <section className="mt-14 rounded-2xl bg-neutral-900 p-7 text-white md:p-10">
              <h2 className="text-balance text-2xl font-semibold md:text-3xl">
                Want this trip planned for you?
              </h2>
              <p className="mt-3 max-w-xl text-white/70">
                Message us on WhatsApp with your dates and we will reply with a route and a price.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  className="btn btn-gold"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={WHATSAPP_URL}
                >
                  Plan your adventure
                </a>
                {exploreHref && post.exploreText && (
                  <Link className="btn text-white border border-white" href={exploreHref}>
                    {post.exploreText}
                  </Link>
                )}
              </div>
            </section>

            {/* Share (visible on every breakpoint, the rail is a desktop bonus) */}
            <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-(--line) pt-6">
              <span className={`mr-2 text-[14px] ${TEXT_MUTED}`}>Share this guide</span>
              {share.map((s) => (
                <a
                  key={s.label}
                  className={`${chip} ${TEXT_ACCENT}`}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              ))}
              <CopyLinkButton url={url} className={chip} />
            </div>
          </main>

          {/* Contents: on mobile it sits above the article, on desktop it sticks */}
          <aside className="order-first lg:order-none">
            <div className="lg:sticky lg:top-28">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>
      </div>

      <TextMasking
        src="/assets/videos/mountain.mp4"
        masking="Plan Your Adventure"
        href={post.exploreHref || ROUTES.contact}
        ctaLabel={post.exploreText || 'Plan Your Adventure'}
        quote={post.description}
      />

      {/* Related */}
      {post.related.length > 0 && (
        <section className="section border-t border-(--line) bg-white">
          <div className="wrap">
            <SectionHeader eyebrow="Keep Exploring" title="More Stories" align="center" />
            <div className="grid grid-cols-1 gap-5.5 md:grid-cols-2 lg:grid-cols-3">
              {post.related.map((r, i) => {
                const rp = postBySlug.get(r.slug);
                return rp ? <BlogCard key={r.slug} p={rp} index={i} /> : null;
              })}
            </div>
          </div>
        </section>
      )}

      {/* Mobile action bar: lives in the thumb zone, so the next step is always one tap away */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-(--line) bg-white/95 p-3 backdrop-blur lg:hidden">
        <a
          className="btn btn-gold w-full justify-center"
          target="_blank"
          rel="noopener noreferrer"
          href={WHATSAPP_URL}
        >
          Plan your adventure
        </a>
      </div>
    </article>
  );
}
