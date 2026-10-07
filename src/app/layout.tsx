import { RevealProvider } from '@/components/common/RevealProvider';
import TransitionProvider from '@/components/transition/TransitionProvider';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import {
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  getGlobalSeoDefaults,
  safeJsonLdString,
} from '@/lib/seo';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Manrope, Space_Mono } from 'next/font/google';
import './globals.css';

export const display = Manrope({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-display',
});

export const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

/**
 * Site-wide defaults. Deliberately hardcoded (not `async` reading the DB)
 * because this is the last-resort fallback used when the admin-managed
 * `seo_defaults` section is unreachable — every leaf page overrides `title`/
 * `description` via its own `generateMetadata` (see `lib/seo.ts`), and
 * `title.template` here is what appends " | {siteName}" to those.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Tour Hub Nepal — Tours & Travels in Nepal',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Tour Hub Nepal — trekking, tours and tailor-made Himalayan adventures across Everest, Annapurna, Langtang, Manaslu and Mustang.',
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const globalDefaults = await getGlobalSeoDefaults();
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [buildOrganizationJsonLd(globalDefaults), buildWebsiteJsonLd(globalDefaults)],
  };

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn('js', display.variable, sans.variable, spaceMono.variable)}
    >
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PDSDZS1EHP" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PDSDZS1EHP');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdString(organizationJsonLd) }}
        />
      </head>
      <body style={{ backgroundColor: '#ffffff' }}>
        <TransitionProvider>
          <RevealProvider />
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}
