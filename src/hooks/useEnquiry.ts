'use client';

import { useState } from 'react';
import { submitEnquiry } from '@/services/enquiry.service';
import type { EnquiryPayload } from '@/types/api';

type Status = 'idle' | 'submitting' | 'done' | 'error';

/** Drives the contact/hire forms: POST to the enquiry API and track status for the UI. */
export function useEnquiry() {
  const [status, setStatus] = useState<Status>('idle');

  async function submit(payload: EnquiryPayload) {
    setStatus('submitting');
    const ok = await submitEnquiry(payload);
    setStatus(ok ? 'done' : 'error');
    return ok;
  }

  function reset() {
    setStatus('idle');
  }

  return { status, submit, reset };
}
