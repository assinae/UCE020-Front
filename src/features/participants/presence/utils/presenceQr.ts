import type { PresenceQrPayload } from '@/types/presence';

const REQUIRED_FIELDS: (keyof PresenceQrPayload)[] = [
  'participantId',
  'participantName',
  'activityId',
  'activityTitle',
  'eventId',
];

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
      if (typeof record[field] !== 'string' || !record[field]) {
        return null;
      }
    }

    return {
      participantId: String(record.participantId),
      participantName: String(record.participantName),
      activityId: String(record.activityId),
      activityTitle: String(record.activityTitle),
      eventId: String(record.eventId),
    };
  } catch {
    return null;
  }
}
