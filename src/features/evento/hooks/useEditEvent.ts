'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService, UpdateEventPayload } from '@/services/eventService';
import { activityService } from '@/services/activityService';
import { extractApiErrorMessage } from '@/utils/apiError';

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

  const mutation = useMutation({
    mutationFn: async (payload: UpdateEventPayload) => {
      // Excluir atividade não passa por aqui: é ação própria, disparada pela
      // lixeira e confirmada no modal. Salvar só grava evento e atividades.
      const { atividades = [], ...eventPayload } = payload;
      const updatedEvent = await eventService.update(eventId!, eventPayload);

      await Promise.all(
        atividades.map(({ id, ...activity }) => {
          const activityPayload = {
            ...activity,
            eventId: eventId!,
          };
          return id != null
            ? activityService.update(id, activityPayload)
            : activityService.create(activityPayload);
        })
      );

      return updatedEvent;
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
      return true;
    } catch {
      return false;
    }
  }

  return {
    event,
    loadingEvent,
    loadError,
    handleUpdate,
    removeActivity,
    loading: mutation.isPending,
    removingActivity: removal.isPending,
    error,
  };
}
