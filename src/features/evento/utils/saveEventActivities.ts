import type { CreateActivityPayload } from '@/services/eventService';
import { activityService } from '@/services/activityService';
import { extractApiErrorMessage } from '@/utils/apiError';

export interface ActivitySaveFailure {
  name: string;
  error: unknown;
}

/**
 * Grava as atividades do formulário uma a uma e devolve as que falharam.
 * `createdIds` guarda o id de cada atividade criada (pela `clientKey`): num
 * novo envio depois de falha parcial, ela é atualizada em vez de criada de novo.
 */
export async function saveEventActivities(
  eventId: number,
  activities: CreateActivityPayload[],
  createdIds: Map<string, number>
): Promise<ActivitySaveFailure[]> {
  const results = await Promise.allSettled(
    activities.map(async ({ id, clientKey, ...activity }) => {
      const payload = { ...activity, eventId };
      const savedId = id ?? (clientKey ? createdIds.get(clientKey) : undefined);

      if (savedId != null) {
        await activityService.update(savedId, payload);
        return;
      }

      const created = await activityService.create(payload);
      if (clientKey) createdIds.set(clientKey, Number(created.id));
    })
  );

  return results.flatMap((result, index) =>
    result.status === 'rejected' ? [{ name: activities[index].name, error: result.reason }] : []
  );
}

export function describeActivityFailures(failures: ActivitySaveFailure[]): string {
  const names = failures.map((failure) => `"${failure.name}"`).join(', ');
  const reason = extractApiErrorMessage(failures[0].error, 'erro inesperado').replace(/\.$/, '');
  const subject =
    failures.length === 1
      ? `a atividade ${names} não foi salva`
      : `as atividades ${names} não foram salvas`;
  return `O evento foi salvo, mas ${subject} (${reason}). Ajuste e salve de novo: só o que faltou será enviado.`;
}

export function forgetCreatedActivity(createdIds: Map<string, number>, activityId: number) {
  for (const [key, id] of createdIds) {
    if (id === activityId) createdIds.delete(key);
  }
}
