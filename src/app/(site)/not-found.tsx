import SectionHeader from '@/components/common/SectionHeader';
import { WhatsAppButton } from '@/components/layouts/WhatsAppButton';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <main>
        <section className="pbanner  min-h-[clamp(520px,100vh,960px)]">
          <div className="pbanner-media bg-black" />
          <div className="pbanner-inner ">
            <div className="wrap">
              <SectionHeader
                eyebrow="Error 404"
                title="This path isn’t on the map."
                align="center"
                onDark={true}
              />
              <div className="flex flex-col items-center justify-center">
                <p className="psub text-center">
                  Looks like this trail has come to an unexpected end. Let’s head back.
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

      <WhatsAppButton />
    </>
  );
}
