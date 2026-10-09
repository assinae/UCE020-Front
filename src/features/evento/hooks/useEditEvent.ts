'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService, UpdateEventPayload } from '@/services/eventService';
import { activityService } from '@/services/activityService';
import { extractApiErrorMessage } from '@/utils/apiError';
import {
  describeActivityFailures,
  forgetCreatedActivity,
  saveEventActivities,
} from '../utils/saveEventActivities';

export function useEditEvent(eventId: number | null) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: event = null,
    isLoading: loadingEvent,
    isError,
  } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventService.findOne(eventId!),
    enabled: eventId !== null,
  });

  const loadError = isError ? 'Não foi possível carregar os dados do evento.' : null;

  const [error, setError] = useState<string | null>(null);

  // Atividade nova criada num envio que falhou em outra continua sem id no
  // formulário; este mapa faz o próximo envio atualizá-la em vez de duplicar.
  const createdActivityIds = useRef(new Map<string, number>());

  const mutation = useMutation({
    mutationFn: async (payload: UpdateEventPayload) => {
      // Excluir atividade não passa por aqui: é ação própria, disparada pela
      // lixeira e confirmada no modal. Salvar só grava evento e atividades.
      const { atividades = [], ...eventPayload } = payload;
      await eventService.update(eventId!, eventPayload);

      const failures = await saveEventActivities(eventId!, atividades, createdActivityIds.current);
      if (failures.length > 0) throw new Error(describeActivityFailures(failures));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events-created'] });
      queryClient.invalidateQueries({ queryKey: ['home-events'] });
      queryClient.invalidateQueries({ queryKey: ['events-monitoring'] });
      router.push(`/event/${eventId}`);
    },
    onError: (err: unknown) => {
      setError(extractApiErrorMessage(err, 'Erro ao atualizar evento. Tente novamente.'));
    },
  });

  const removal = useMutation({
    mutationFn: (activityId: number) => activityService.remove(activityId),
    onSuccess: () => {
      // De propósito sem invalidar ['event', eventId]: o formulário se
      // reconstrói a partir dessa query, e refazê-la aqui apagaria o que a
      // pessoa já tiver digitado e ainda não salvou.
      queryClient.invalidateQueries({ queryKey: ['events-created'] });
      queryClient.invalidateQueries({ queryKey: ['home-events'] });
      queryClient.invalidateQueries({ queryKey: ['events-monitoring'] });
    },
    onError: (err: unknown) => {
      setError(extractApiErrorMessage(err, 'Não foi possível excluir a atividade.'));
    },
  });

  async function handleUpdate(payload: UpdateEventPayload) {
    if (eventId === null) return;
    setError(null);
    await mutation.mutateAsync(payload);
  }

  /** Devolve se a exclusão passou, para a tela só tirar da lista quando passou. */
  async function removeActivity(activityId: number) {
    setError(null);
    try {
      await removal.mutateAsync(activityId);
      forgetCreatedActivity(createdActivityIds.current, activityId);
      return true;
    } catch {
      return false;
    }
  }

  /** Id da atividade nova do formulário que já foi gravada num envio anterior. */
  function savedActivityId(clientKey: string) {
    return createdActivityIds.current.get(clientKey);
  }

  return {
    event,
    savedActivityId,
    loadingEvent,
    loadError,
    handleUpdate,
    removeActivity,
    loading: mutation.isPending,
    removingActivity: removal.isPending,
    error,
  };
}
