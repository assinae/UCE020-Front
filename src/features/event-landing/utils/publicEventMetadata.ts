const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export interface PublicEventSummary {
  nome?: string;
  descricao?: string | null;
  foto?: string | null;
  localizacao?: string | null;
  dataInicio?: string;
  dataFim?: string;
}

export function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function fetchPublicEventSummary(codigo: string): Promise<PublicEventSummary | null> {
  try {
    const response = await fetch(`${API_URL}/event/codigo/${encodeURIComponent(codigo)}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { data?: PublicEventSummary };
    return body.data ?? null;
  } catch {
    return null;
  }
}
