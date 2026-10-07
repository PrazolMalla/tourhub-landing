import type { Metadata } from 'next';
import { LegalLayout } from '@/components/common/LegalLayout';
import { resolveMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return resolveMetadata({
    entityType: 'static_page',
    entityId: 'terms',
    path: '/terms',
    fallback: {
      title: 'Terms & Conditions',
      description:
        'Booking terms and conditions for treks and tours operated by Nepal Yatra Tours & Travels in Nepal.',
    },
  });
}

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      lede="These terms apply to bookings made with Nepal Yatra Tours & Travels. Please read them before confirming your trip."
    >
      <h2>Bookings &amp; payment</h2>
      <p>
        A booking is confirmed once we have agreed your itinerary and received any deposit we
        request. The balance is due as set out in your confirmation. Prices are quoted per person
        and confirmed in writing before you pay.
      </p>
      <h2>What is included</h2>
      <p>
        Your confirmation lists exactly what is included and excluded — typically permits, a
        licensed guide, porter support, accommodation and most meals on the trail. International
        flights, insurance, personal expenses and tips are normally excluded unless stated.
      </p>
      <h2>Cancellations &amp; changes</h2>
      <p>
        If you need to cancel or change, contact us as soon as possible. Terms depend on how close
        to departure you cancel and on costs already committed on your behalf (flights, permits). We
        always try to be fair and flexible.
      </p>
      <h2>Travel insurance</h2>
      <p>
        Comprehensive travel insurance is mandatory. Your policy must cover high-altitude trekking
        to your route&rsquo;s maximum elevation and emergency helicopter evacuation in Nepal.
      </p>
      <h2>Safety &amp; itinerary changes</h2>
      <p>
        Mountain travel carries inherent risks. For your safety, your guide may alter the route or
        itinerary due to weather, trail conditions, altitude or other circumstances beyond our
        control. We act in your best interests at all times.
      </p>
      <h2>Your responsibilities</h2>
      <p>
        You are responsible for being fit for your chosen trip, holding a valid passport and visa,
        arranging insurance, and following your guide&rsquo;s reasonable instructions on the trail.
      </p>
    </LegalLayout>
  );
}
