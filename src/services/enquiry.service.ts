import { api } from './api.service';
import type { EnquiryPayload } from '@/types/api';

/**
 * Submit a lead/enquiry to the backend lead endpoint (`POST /api/v1/enquiries`).
 * Best-effort: callers treat failure as non-fatal (WhatsApp is the primary
 * channel), so errors are swallowed and reported via the boolean result.
 */
export async function submitEnquiry(payload: EnquiryPayload): Promise<boolean> {
  try {
    await api.post('/enquiries', payload);
    return true;
  } catch {
    return false;
  }
}
