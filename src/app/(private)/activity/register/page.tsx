'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ActivyForm from '@/features/activities/components/ActivityForm';
import { activityService } from '@/services/activityService';
import type { ActivityFormState } from '@/features/activities/components/ActivityForm';
import { extractApiErrorMessage } from '@/utils/apiError';

export default function CadastrarEventoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  async function handleSubmit(data: ActivityFormState) {
    const eventId = Number(searchParams.get('eventId'));
    if (!Number.isFinite(eventId)) {
      setError('Informe o evento para cadastrar a atividade.');
      return;
    }

    try {
      const created = await activityService.create({
        name: data.name,
        category: data.category,
        location: data.location,
        workload: Number(data.workload),
        description: data.description,
        startDate: `${data.startDate}T${data.startTime}:00-03:00`,
        endDate: `${data.endDate}T${data.endTime}:00-03:00`,
        eventId,
        generateCertificate: data.generateCertificate,
        guests: data.guests,
      });
      router.push(`/event/${created.eventoId || eventId}`);
    } catch (submitError) {
      setError(extractApiErrorMessage(submitError, 'Não foi possível cadastrar a atividade.'));
    }
  }

  return error ? <p>{error}</p> : <ActivyForm mode="create" onSubmit={handleSubmit} />;
}
