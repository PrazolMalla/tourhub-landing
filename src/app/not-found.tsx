import SectionHeader from '@/components/common/SectionHeader';
import { SiteFooter } from '@/components/layouts/SiteFooter';
import { SiteHeader } from '@/components/layouts/SiteHeader';
import { WhatsAppButton } from '@/components/layouts/WhatsAppButton';
import { getSiteChrome } from '@/lib/cms';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';

export default async function NotFound() {
  const chrome = await getSiteChrome();
  return (
    <>
      <SiteHeader chrome={chrome} />
      <main>
        <section className="pbanner  min-h-[clamp(620px,100vh,960px)]">
          <div className="pbanner-media bg-black" />
          <div className="pbanner-inner ">
            <div className="wrap">
              <SectionHeader
                eyebrow="Error 404"
                title="This Page doesn't Exist."
                align="center"
                onDark={true}
              />
              <div className="flex flex-col items-center justify-center">
                <p className="psub text-center">
                  This route doesn’t seem to exist. Let’s point you back in the right direction.
                </p>
                <div className="cta-actions" style={{ marginTop: 28 }}>
                  <Link className="btn btn-gold" href={ROUTES.home}>
                    Back to home
                  </Link>
                  <Link className="btn btn-ghost-d" href={ROUTES.tours}>
                    Browse treks &amp; tours
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
