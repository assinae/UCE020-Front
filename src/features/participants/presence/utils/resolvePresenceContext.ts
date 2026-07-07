import type { PresenceValidationContext } from '@/types/presence';

// TODO: MOCK_EVENTS foi removido. As funções abaixo estão
// como stub temporário até existir uma fonte real de eventos (API/DB).
// Quando isso estiver pronto, substituir os retornos abaixo pela busca real.

export function resolveEventName(eventId: string): string {
  return eventId;
}

// null se n tiver eventId/activityId ou invalidos
export function requirePresenceContext(
  eventId: string | null,
  activityId: string | null
): PresenceValidationContext | null {
  if (!eventId || !activityId) return null;

  // TODO: stub temporário — troque por dados reais assim que houver uma
  // fonte de eventos/atividades (API/DB) para substituir o MOCK_EVENTS.
  return {
    eventId,
    activityId,
    activityTitle: activityId,
    eventName: resolveEventName(eventId),
  };
}