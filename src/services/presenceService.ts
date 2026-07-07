import {
  loadParticipants,
  isParticipantConfirmed,
  confirmParticipantForActivity,
} from '@/mocks/participants-storage';
import { isParticipantRegistered } from '@/mocks/registrations';
import type { ConfirmPresenceRequest, ConfirmPresenceResponse } from '@/types/presence';

class PresenceService {
  async confirmPresence(request: ConfirmPresenceRequest): Promise<ConfirmPresenceResponse> {
    // TODO: integrar com o back
    return this.confirmPresenceMock(request);
  }

  private async confirmPresenceMock(
    request: ConfirmPresenceRequest,
  ): Promise<ConfirmPresenceResponse> {
    const { participantId, activityId, eventId } = request;
    const participant = loadParticipants().find((item) => item.id === participantId);

    if (!participant) {
      throw new Error('Participante não encontrado');
    }

    if (!isParticipantRegistered(eventId, activityId, participantId)) {
      throw new Error('Participante não inscrito nesta atividade');
    }

    if (isParticipantConfirmed(eventId, activityId, participantId)) {
      throw new Error('Presença já confirmada');
    }

    confirmParticipantForActivity(eventId, activityId, participantId);

    return {
      ok: true,
      participant: {
        id: participant.id,
        name: participant.name,
      },
      eventId,
      activityId,
      confirmedAt: new Date().toISOString(),
    };
  }
}

export const presenceService = new PresenceService();
