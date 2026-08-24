export interface PresenceQrPayload {
  participantId: string;
  participantName: string;
  activityId: string;
  activityTitle: string;
  eventId: string;
}

export interface PresenceValidationContext {
  eventId: string;
  activityId: string;
  activityTitle: string;
  eventName: string;
}

export type PresenceScanStatus =
  | 'ready'
  | 'invalid_qr'
  | 'wrong_event'
  | 'wrong_activity'
  | 'participant_not_found'
  | 'not_registered'
  | 'already_confirmed';

export interface PresenceScanResult {
  status: PresenceScanStatus;
  payload: PresenceQrPayload | null;
  participantName: string | null;
  activityTitle: string | null;
  message: string;
  monitorGuidance: string;
  canConfirm: boolean;
}

export interface ConfirmPresenceRequest {
  participantId: string;
  eventId: string;
  activityId: string;
}

export interface ConfirmPresenceResponse {
  ok: boolean;
  participant: {
    id: string;
    name: string;
  };
  eventId: string;
  activityId: string;
  confirmedAt: string;
  message?: string;
}
