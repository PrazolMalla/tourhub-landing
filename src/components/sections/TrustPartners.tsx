import { getPartners } from '@/lib/cms';
import { TEXT_MUTED } from '@/lib/theme';
import SectionHeader from '../common/SectionHeader';

/** Trusted partners / affiliations — auto-scrolling logo marquee. */
export async function TrustPartners() {
  const PARTNERS = await getPartners();
  // Duplicated so the CSS marquee (translateX -50%) loops seamlessly.
  const loop = [...PARTNERS, ...PARTNERS];

  if (!PARTNERS.length) return null;

  return (
    <div className="bg-paper [padding-block:var(--section-py)] border-none">
      <div className="wrap">
        <SectionHeader eyebrow="Trusted Partners &amp; Affiliations" />
        {/* <div className="text-center mb-[38px] reveal">
          <Eyebrow center>Trusted Partners &amp; Affiliations</Eyebrow>
          <p className={`${TEXT_MUTED} mt-[14px] text-[16px] max-w-[54ch] mx-auto`}>
            Officially registered, licensed and proudly associated with Nepal&apos;s leading tourism
            bodies.
          </p>
        </div> */}
        <div
          className="group overflow-hidden py-[6px] [-webkit-mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] reveal"
          suppressHydrationWarning
        >
          <div className="flex items-stretch gap-[18px] w-max [animation:partnerScroll_34s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:[animation:none]">
            {loop.map((p, i) => (
              <a
                key={`${p.name}-${i}`}
                className={`group/partner flex-[0_0_auto] w-[210px] min-w-[150px] max-w-[220px] flex flex-col items-center gap-[14px] px-[20px] py-[26px] [transition:transform_0.25s_cubic-bezier(0.2,0.7,0.3,1)] hover:-translate-y-[4px] max-[760px]:min-w-[130px] max-[460px]:flex-row max-[460px]:justify-start max-[460px]:gap-[18px]`}
                href={p.href}
                target="_blank"
                rel="noopener"
                aria-hidden={i >= PARTNERS.length || undefined}
                tabIndex={i >= PARTNERS.length ? -1 : undefined}
              >
                <span className="w-[96px] h-[72px] flex items-center justify-center p-[10px] [transition:transform_0.3s] group-hover/partner:scale-[1.04] max-[460px]:w-[56px] max-[460px]:h-[56px]">
                  {p.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="max-w-full max-h-full object-contain block"
                    />
                  )}
                </span>
                <span
                  className={`font-mono text-[11.5px] tracking-[0.06em] uppercase font-bold ${TEXT_MUTED} text-center group-hover/partner:text-ink max-[460px]:text-left`}
                >
                  {p.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
