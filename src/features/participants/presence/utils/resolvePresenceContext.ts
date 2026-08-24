import { api } from '@/services/api';
import type { PresenceValidationContext } from '@/types/presence';

interface PresenceContextApiResponse {
  statusCode?: number;
  message?: string;
  data?: {
    eventId?: string | number;
    activityId?: string | number;
    eventName?: string;
    activityTitle?: string;
  };
}

export function resolveEventName(eventId: string): string {
  return eventId;
}

export function requirePresenceContext(
  eventId: string | null,
  activityId: string | null,
): PresenceValidationContext | null {
  if (!eventId || !activityId) return null;

  return {
    eventId,
    activityId,
    activityTitle: activityId,
    eventName: resolveEventName(eventId),
  };
}

export async function fetchPresenceContext(
  eventId: string | null,
  activityId: string | null,
): Promise<PresenceValidationContext | null> {
  if (!eventId || !activityId) return null;

  const numericEventId = Number(eventId);
  const numericActivityId = Number(activityId);

  if (!Number.isFinite(numericEventId) || !Number.isFinite(numericActivityId)) {
    return null;
  }

  try {
    const { data } = await api.get<PresenceContextApiResponse>(
      `/event/${numericEventId}/subscription/activity/${numericActivityId}/context`,
    );

    const contextData = data?.data;

    if (!contextData) return null;

    return {
      eventId: String(contextData.eventId ?? eventId),
      activityId: String(contextData.activityId ?? activityId),
      activityTitle: contextData.activityTitle ?? activityId,
      eventName: contextData.eventName ?? resolveEventName(eventId),
    };
  } catch {
    return null;
  }
}