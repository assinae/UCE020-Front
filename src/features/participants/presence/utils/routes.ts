export function buildListParticipantsPath(eventId: string, activityId: string): string {
  const params = new URLSearchParams({ eventId, activityId });
  return `/list-participants?${params.toString()}`;
}

export function buildValidatePresencePath(eventId: string, activityId: string): string {
  const params = new URLSearchParams({ eventId, activityId });
  return `/list-participants/validate?${params.toString()}`;
}
