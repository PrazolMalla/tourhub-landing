import type { Metadata } from 'next';
import { LegalLayout } from '@/components/common/LegalLayout';
import { resolveMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    entityType: 'static_page',
    entityId: 'privacy',
    path: '/privacy',
    fallback: {
      title: 'Privacy Policy',
      description:
        'How Nepal Yatra Tours & Travels collects, uses and protects your personal information.',
    },
  });
}

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lede="Your privacy matters to us. This policy explains what information we collect, how we use it, and your choices."
    >
      <h2>Who we are</h2>
      <p>
        Nepal Yatra Tours &amp; Travels is a trekking and tour operator based in Shorakhutte,
        Kathmandu, Nepal. Reach us at info@nepalyatratours.com.
      </p>
      <h2>Information we collect</h2>
      <p>
        We collect information you give us directly when you enquire or book — your name, email,
        phone, travel dates and any trip preferences or requirements. We may also collect standard
        technical data such as browser type and pages visited to improve the site.
      </p>
      <h2>How we use it</h2>
      <p>
        We use your information to respond to enquiries, prepare quotes, arrange your trek or tour,
        keep you informed about your booking, and meet legal and safety obligations. With your
        consent we may send seasonal guides and offers; you can opt out anytime.
      </p>
      <h2>Sharing</h2>
      <p>
        We share details only as needed to deliver your trip — guides, lodges, transport providers
        and, where required, permit authorities. We never sell your personal information.
      </p>
      <h2>Security &amp; retention</h2>
      <p>
        We take reasonable measures to protect your information and keep it only as long as
        necessary or as required by law.
      </p>
      <h2>Your rights</h2>
      <p>
        You may ask us to access, correct or delete your information, or stop marketing messages, by
        emailing info@nepalyatratours.com.
      </p>
    </LegalLayout>
  );
}
