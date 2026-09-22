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
      const { atividades = [], ...eventPayload } = payload;
      const updatedEvent = await eventService.update(eventId!, eventPayload);
      const currentActivityIds = new Set(
        (event?.atividades ?? []).map((activity) => Number(activity.id))
      );
      const submittedActivityIds = new Set(
        atividades
          .map((activity) => activity.id)
          .filter((activityId): activityId is number => activityId != null)
          .map(Number)
      );

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

      await Promise.all(
        [...currentActivityIds]
          .filter((activityId) => !submittedActivityIds.has(activityId))
          .map((activityId) => activityService.remove(activityId))
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

  async function handleUpdate(payload: UpdateEventPayload) {
    if (eventId === null) return;
    setError(null);
    await mutation.mutateAsync(payload);
  }

  return {
    event,
    loadingEvent,
    loadError,
    handleUpdate,
    loading: mutation.isPending,
    error,
  };
}
