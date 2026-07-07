import { MOCK_PARTICIPANTS } from '@/mocks/participants';
import { MOCK_REGISTRATIONS } from '@/mocks/registrations';
import { isParticipantConfirmed } from '@/mocks/participants-storage';
import type { Participant } from '@/types/participant';

export function getParticipantsForActivity(
  eventId: string,
  activityId: string,
): Participant[] {
  const registeredIds = MOCK_REGISTRATIONS[eventId]?.[activityId] ?? [];

  return registeredIds
    .map((id) => {
      const participant = MOCK_PARTICIPANTS.find((item) => item.id === id);
      if (!participant) return null;

      return {
        ...participant,
        presenceStatus: isParticipantConfirmed(eventId, activityId, id)
          ? ('confirmed' as const)
          : ('pending' as const),
      };
    })
    .filter((participant): participant is Participant => participant !== null);
}
