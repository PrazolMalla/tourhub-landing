/** Shared API contract types. */

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

/** Lead/enquiry captured from the contact & hire forms. */
export interface EnquiryPayload {
  name?: string;
  email?: string;
  phone?: string;
  people?: string;
  trip?: string;
  date?: string;
  message?: string;
  source: string;
}

export interface AuthUser {
  user: string;
}
