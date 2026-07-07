'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { eventService, CreateEventPayload } from '@/services/eventService';

export function useCreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(payload: CreateEventPayload) {
    setLoading(true);
    setError(null);
    try {
      const createdEvent = await eventService.create(payload);
      router.push(`/event/${createdEvent.id}`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string | string[] } } };
      const raw = axiosErr.response?.data?.message;
      const message = Array.isArray(raw)
        ? raw.join(', ')
        : raw ?? (err instanceof Error ? err.message : 'Erro ao criar evento. Tente novamente.');
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return { handleCreate, loading, error };
}
