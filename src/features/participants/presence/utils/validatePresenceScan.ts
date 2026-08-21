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
  context: PresenceValidationContext,
): PresenceScanResult {
  const normalizedPayload = payload
    ? {
        ...payload,
        participantName: payload.participantName || 'Participante',
        activityTitle: payload.activityTitle || context.activityTitle,
      }
    : null;

  const { message, monitorGuidance } = getScanStatusMessage(
    status,
    normalizedPayload
      ? {
          participantName: normalizedPayload.participantName,
          activityTitle: normalizedPayload.activityTitle,
        }
      : null,
  );

  return {
    status,
    payload: normalizedPayload,
    participantName: normalizedPayload?.participantName ?? null,
    activityTitle: normalizedPayload?.activityTitle ?? null,
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
    return buildResult('invalid_qr', null, context);
  }

  if (payload.eventId !== context.eventId) {
    return buildResult('wrong_event', payload, context);
  }

  if (payload.activityId !== context.activityId) {
    return buildResult('wrong_activity', payload, context);
  }

  return buildResult('ready', payload, context);
}
