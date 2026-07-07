import { MOCK_REGISTRATIONS, registerParticipant as registerParticipantInMock, unregisterParticipant as unregisterParticipantInMock } from '@/mocks/registrations';

// TODO: integrar com o back
class RegistrationService {
  isRegistered(eventId: string, activityId: string, participantId: string): boolean {
    const eventReg = MOCK_REGISTRATIONS[eventId];
    if (!eventReg) return false;

    const activityReg = eventReg[activityId];
    if (!activityReg) return false;

    return activityReg.includes(participantId);
  }

  register(eventId: string, activityId: string, participantId: string): string[] {
    return registerParticipantInMock(eventId, activityId, participantId);
  }

  unregister(eventId: string, activityId: string, participantId: string): string[] {
    return unregisterParticipantInMock(eventId, activityId, participantId);
  }

  getRegisteredParticipants(eventId: string, activityId: string): string[] {
    const eventReg = MOCK_REGISTRATIONS[eventId];
    if (!eventReg) return [];

    return eventReg[activityId] ?? [];
  }

  getRegistrationCount(eventId: string, activityId: string): number {
    return this.getRegisteredParticipants(eventId, activityId).length;
  }

  canRegister(eventId: string, activityId: string, participantId: string): boolean {
    // permite qnd n ta inscrito
    return !this.isRegistered(eventId, activityId, participantId);
  }

  canUnregister(eventId: string, activityId: string, participantId: string): boolean {
    // permite qnd ta inscrito
    return this.isRegistered(eventId, activityId, participantId);
  }
}

export const registrationService = new RegistrationService();
