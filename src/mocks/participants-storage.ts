import { MOCK_PARTICIPANTS } from '@/mocks/participants';

const confirmedByActivity: Record<string, string[]> = {};

function buildKey(eventId: string, activityId: string) {
  return `${eventId}:${activityId}`;
}

export function loadParticipants() {
  return MOCK_PARTICIPANTS;
}

export function isParticipantConfirmed(
  eventId: string,
  activityId: string,
  participantId: string,
): boolean {
  return (confirmedByActivity[buildKey(eventId, activityId)] ?? []).includes(participantId);
}

export function confirmParticipantForActivity(
  eventId: string,
  activityId: string,
  participantId: string,
) {
  const key = buildKey(eventId, activityId);
  const list = new Set(confirmedByActivity[key] ?? []);
  list.add(participantId);
  confirmedByActivity[key] = Array.from(list);
}

export function unconfirmParticipantForActivity(
  eventId: string,
  activityId: string,
  participantId: string,
) {
  const key = buildKey(eventId, activityId);
  confirmedByActivity[key] = (confirmedByActivity[key] ?? []).filter((id) => id !== participantId);
}

export function getConfirmedPresencesSnapshot(): Record<string, string[]> {
  return { ...confirmedByActivity };
}
