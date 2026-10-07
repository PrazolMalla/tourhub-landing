import { SiteFooter } from '@/components/layouts/SiteFooter';
import { SiteHeader } from '@/components/layouts/SiteHeader';
import { WhatsAppButton } from '@/components/layouts/WhatsAppButton';
import { getSiteChrome } from '@/lib/cms';

/** Shared chrome for every public page: overlay header, footer, WhatsApp FAB.
 *  Header/footer/mega-menu data is resolved from the backend CMS (with a static
 *  fallback), so the nav, contact details and Top-10 panel are admin-managed. */
export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const chrome = await getSiteChrome();
  return (
    <>
      <SiteHeader chrome={chrome} />
      <main className="min-h-[100svh]">{children}</main>
      <SiteFooter chrome={chrome} />
      <WhatsAppButton />
    </>
  );
}
