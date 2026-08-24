'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService, UpdateEventPayload } from '@/services/eventService';

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
    mutationFn: (payload: UpdateEventPayload) => eventService.update(eventId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events-created'] });
      queryClient.invalidateQueries({ queryKey: ['home-events'] });
      queryClient.invalidateQueries({ queryKey: ['events-monitoring'] });
      router.push(`/event/${eventId}`);
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { message?: string | string[] } } };
      const raw = axiosErr.response?.data?.message;
      const message = Array.isArray(raw)
        ? raw.join(', ')
        : raw ?? (err instanceof Error ? err.message : 'Erro ao atualizar evento. Tente novamente.');
      setError(message);
    },
  });

  async function handleUpdate(payload: UpdateEventPayload) {
    if (eventId === null) return;
    setError(null);
    mutation.mutate(payload);
  }

  return { 
    event, 
    loadingEvent, 
    loadError, 
    handleUpdate, 
    loading: mutation.isPending, 
    error 
  };
}
