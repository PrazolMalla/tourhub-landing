import Link from 'next/link';
import { Fragment } from 'react';
import { HeroHeading } from './HeroHeading';
import { ImageSlot } from './ImageSlot';

export interface Crumb {
  label: string;
  href?: string;
}

interface PageBannerProps {
  image: string;
  crumbs: Crumb[];
  title: string;
  sub?: string;
  /** Optional tag chips above the title. */
  tags?: React.ReactNode;
  /** Min-height override for the banner. */
  minHeight?: string;
}

/** Dark page banner with a Ken-Burns image and breadcrumb (subpage hero). */
export function PageBanner({ image, crumbs, title, sub, tags, minHeight }: PageBannerProps) {
  return (
    <section
      className="relative flex items-center min-h-[clamp(360px,52vh,520px)] overflow-hidden bg-ink text-white"
      style={minHeight ? { minHeight } : undefined}
    >
      <div className="absolute inset-0 z-0 after:content-[''] after:absolute after:inset-0 after:[background:linear-gradient(180deg,rgba(10,11,12,0.5)_0%,rgba(10,11,12,0.25)_35%,rgba(10,11,12,0.78)_100%)]">
        <ImageSlot
          src={image}
          alt={title}
          priority
          sizes="100vw"
          className="motion-safe:animate-[kenburns_28s_ease-in-out_infinite_alternate] motion-safe:origin-[60%_40%]"
        />
      </div>
      <div className="relative z-2 w-full pt-28">
        <div className="wrap">
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-[12px] tracking-[0.08em] uppercase text-white/72 mb-4.5">
            {crumbs.map((c, i) => (
              <Fragment key={c.label}>
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span>{c.label}</span>
                )}
                {i < crumbs.length - 1 ? <span className="opacity-50">/</span> : null}
              </Fragment>
            ))}
          </div>
          {tags ? <div className="flex flex-wrap gap-2.5 mb-5">{tags}</div> : null}
          <HeroHeading title={title} subtitle={sub} />
        </div>
      </div>
    </section>
  );
}
