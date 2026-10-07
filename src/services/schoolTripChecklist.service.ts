import { api } from './api.service';

export interface SchoolTripChecklistOption {
  id: string;
  type: string;
  slug: string;
  pdfUrl?: string;
}

interface Envelope<T> {
  success: boolean;
  data: T;
}

/** Active checklist types for the download dropdown — empty if the API has none/is unreachable. */
export async function listSchoolTripChecklists(): Promise<SchoolTripChecklistOption[]> {
  try {
    const res = await api.get<Envelope<SchoolTripChecklistOption[]>>(
      '/school-trip-checklists/public',
    );
    return res.data.data.filter((c) => c.pdfUrl);
  } catch {
    return [];
  }
}

/**
 * Logs the download attempt (name/phone/IP-derived location/timestamp) on the
 * backend, then hands back the PDF URL to download on success. Throws with a
 * readable message on failure (invalid input, checklist unavailable, etc).
 */
export async function downloadSchoolTripChecklist(
  checklistId: string,
  name: string,
  phone: string,
): Promise<string> {
  const res = await api.post<Envelope<{ pdfUrl: string }>>(
    `/school-trip-checklists/${checklistId}/download`,
    { name, phone },
  );
  return res.data.data.pdfUrl;
}
