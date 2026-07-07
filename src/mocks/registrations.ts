export const MOCK_REGISTRATIONS: Record<string, Record<string, string[]>> = {
  '1': {
    a1: ['p1', 'p2', 'p3', 'p4'],
    a2: ['p2', 'p5', 'p6'],
    a3: ['p7', 'p8'],
    a4: ['p9', 'p10'],
    a5: ['p11', 'p12'],
    a6: ['p1', 'p5'],
    a7: ['p3', 'p4', 'p6'],
  },
  '2': {
    a1: ['p2', 'p7'],
    a2: ['p5', 'p8'],
  },
};

export function isParticipantRegistered(
  eventId: string,
  activityId: string,
  participantId: string,
): boolean {
  return MOCK_REGISTRATIONS[eventId]?.[activityId]?.includes(participantId) ?? false;
}

export function registerParticipant(
  eventId: string,
  activityId: string,
  participantId: string,
): string[] {
  const eventRegistration = (MOCK_REGISTRATIONS[eventId] ??= {});
  const list = (eventRegistration[activityId] ??= []);

  if (!list.includes(participantId)) {
    list.push(participantId);
  }

  return list;
}

export function unregisterParticipant(
  eventId: string,
  activityId: string,
  participantId: string,
): string[] {
  const list = MOCK_REGISTRATIONS[eventId]?.[activityId];
  if (!list) return [];

  MOCK_REGISTRATIONS[eventId][activityId] = list.filter((id) => id !== participantId);
  return MOCK_REGISTRATIONS[eventId][activityId];
}
