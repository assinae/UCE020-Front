import { parsePresenceQrPayload } from '@/features/participants/presence/utils/presenceQr';
import { getScanStatusMessage } from '@/features/participants/presence/utils/presenceFeedback';
import type {
  PresenceScanResult,
  PresenceScanStatus,
  PresenceValidationContext,
} from '@/types/presence';

function buildResult(
  status: PresenceScanStatus,
  payload: PresenceScanResult['payload'],
): PresenceScanResult {
  const { message, monitorGuidance } = getScanStatusMessage(
    status,
    payload
      ? { participantName: payload.participantName, activityTitle: payload.activityTitle }
      : null,
  );

  return {
    status,
    payload,
    participantName: payload?.participantName ?? null,
    activityTitle: payload?.activityTitle ?? null,
    message,
    monitorGuidance,
    canConfirm: status === 'ready',
  };
}

export function validatePresenceScan(
  rawQrValue: string,
  context: PresenceValidationContext,
): PresenceScanResult {
  const payload = parsePresenceQrPayload(rawQrValue);

  if (!payload) {
    return buildResult('invalid_qr', null);
  }

  if (payload.eventId !== context.eventId) {
    return buildResult('wrong_event', payload);
  }

  if (payload.activityId !== context.activityId) {
    return buildResult('wrong_activity', payload);
  }

  return buildResult('ready', payload);
}
