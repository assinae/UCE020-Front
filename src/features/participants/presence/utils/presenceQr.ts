import type { PresenceQrPayload } from '@/types/presence';

const REQUIRED_FIELDS: (keyof PresenceQrPayload)[] = ['participantId', 'activityId', 'eventId'];

export function buildPresenceQrPayload(payload: PresenceQrPayload): string {
  return JSON.stringify(payload);
}

export function parsePresenceQrPayload(rawValue: string): PresenceQrPayload | null {
  try {
    const parsed: unknown = JSON.parse(rawValue.trim());

    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const record = parsed as Record<string, unknown>;

    for (const field of REQUIRED_FIELDS) {
      const value = record[field];
      if (value === undefined || value === null) return null;
      const t = typeof value;
      if (t !== 'string' && t !== 'number') return null;
      if (String(value).trim() === '') return null;
    }

    return {
      participantId: String(record.participantId),
      participantName: typeof record.participantName === 'string' ? record.participantName : '',
      activityId: String(record.activityId),
      activityTitle: typeof record.activityTitle === 'string' ? record.activityTitle : '',
      eventId: String(record.eventId),
    };
  } catch {
    return null;
  }
}
