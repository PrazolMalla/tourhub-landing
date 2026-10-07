import Link from 'next/link';
import { TEXT } from '@/lib/theme';

const HERO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_3DPbgTBNQA8uVZpwmAJg2wq3SQI/hf_20260605_181903_13ec6e10-19ac-4f0b-9ef5-cb2f708fc50d.png';

/** Shared shell for legal pages (privacy, terms): small banner + prose body. */
export function LegalLayout({
  title,
  lede,
  children,
}: {
  title: string;
  lede: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="relative flex items-end min-h-[clamp(300px,40vh,430px)] overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 z-0 after:content-[''] after:absolute after:inset-0 after:[background:linear-gradient(180deg,rgba(10,11,12,0.5)_0%,rgba(10,11,12,0.25)_35%,rgba(10,11,12,0.78)_100%)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO}
            alt="Himalayan landscape"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className="wrap relative z-2 w-full pb-[clamp(30px,4vw,52px)] pt-32.5">
          <nav className="flex flex-wrap items-center gap-2 text-[13px] text-white/80 mb-3.5">
            <Link href="/" className="text-white/80 hover:text-white">
              Home
            </Link>
            <span className="text-white/50">/</span>
            <span className="text-white/50">{title}</span>
          </nav>
          <h1 className="text-[clamp(40px,6.2vw,84px)] max-w-[18ch] tracking-[-0.022em]">
            {title}
          </h1>
        </div>
      </section>
      <section className="section">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div className="art-body">
            <p className={`font-serif text-[clamp(19px,2.4vw,23px)] leading-normal ${TEXT} mb-6.5`}>
              {lede}
            </p>
            {children}
            <p style={{ marginTop: 30, color: 'var(--muted)', fontSize: 14 }}>
              Last updated: June 2026. Questions?{' '}
              <Link href="/contact" style={{ color: 'var(--gold-deep)' }}>
                Contact us
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
