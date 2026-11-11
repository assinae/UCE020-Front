'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { activityService } from '@/services/activityService';
import { eventService, CreateEventPayload } from '@/services/eventService';
import { extractApiErrorMessage } from '@/utils/apiError';
import {
  describeActivityFailures,
  forgetCreatedActivity,
  saveEventActivities,
} from '../utils/saveEventActivities';

export function useCreateEvent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Se alguma atividade falhar, o evento já existe: o próximo envio atualiza
  // esse evento e só cria as atividades que faltaram, em vez de duplicar tudo.
  const createdEventId = useRef<number | null>(null);
  const createdActivityIds = useRef(new Map<string, number>());

  async function handleCreate(payload: CreateEventPayload) {
    setLoading(true);
    setError(null);
    try {
      const { atividades = [], ...eventPayload } = payload;
      const event =
        createdEventId.current !== null
          ? await eventService.update(createdEventId.current, eventPayload)
          : await eventService.create(eventPayload);
      createdEventId.current = Number(event.id);

      queryClient.invalidateQueries({ queryKey: ['events-created'] });
      queryClient.invalidateQueries({ queryKey: ['home-events'] });

      const failures = await saveEventActivities(
        createdEventId.current,
        atividades,
        createdActivityIds.current
      );
      if (failures.length > 0) {
        setError(describeActivityFailures(failures));
        return;
      }

      router.push(`/event/${createdEventId.current}`);
    } catch (err: unknown) {
      setError(extractApiErrorMessage(err, 'Erro ao criar evento. Tente novamente.'));
    } finally {
      setLoading(false);
    }
  }

  /** Id da atividade do formulário que já foi gravada num envio anterior. */
  function savedActivityId(clientKey: string) {
    return createdActivityIds.current.get(clientKey);
  }

  /** Devolve se a exclusão passou, para a tela só tirar da lista quando passou. */
  async function removeActivity(activityId: number) {
    setError(null);
    try {
      await activityService.remove(activityId);
      forgetCreatedActivity(createdActivityIds.current, activityId);
      return true;
    } catch (err: unknown) {
      setError(extractApiErrorMessage(err, 'Não foi possível excluir a atividade.'));
      return false;
    }
  }

  return { handleCreate, savedActivityId, removeActivity, loading, error };
}
