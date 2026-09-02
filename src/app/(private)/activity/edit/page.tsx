'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ActivyForm from '@/features/activities/components/ActivityForm';
import type { ActivityFormState } from '@/features/activities/components/ActivityForm';
import { activityService } from '@/services/activityService';
import { extractApiErrorMessage } from '@/utils/apiError';
import { getBahiaDateInput, getBahiaTimeInput } from '@/utils/date';

export default function CadastrarEventoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activityId = searchParams.get('id');
  const [initialValues, setInitialValues] = useState<Partial<ActivityFormState>>();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!activityId) return;

    activityService
      .findOne(activityId)
      .then((activity) => {
        const start = new Date(activity.dataInicio);
        const end = new Date(activity.dataFim);
        setInitialValues({
          name: activity.nome,
          category: activity.categoria,
          location: activity.localizacao,
          workload: String(activity.cargaHoraria),
          description: activity.descricao,
          startDate: getBahiaDateInput(start),
          endDate: getBahiaDateInput(end),
          startTime: getBahiaTimeInput(start),
          endTime: getBahiaTimeInput(end),
          generateCertificate: activity.gerarCertificado,
        });
      })
      .catch((loadError) => {
        setError(extractApiErrorMessage(loadError, 'Não foi possível carregar a atividade.'));
      });
  }, [activityId]);

  async function handleSubmit(data: ActivityFormState) {
    if (!activityId) return;
    try {
      const updated = await activityService.update(activityId, {
        name: data.name,
        category: data.category,
        location: data.location,
        workload: Number(data.workload),
        description: data.description,
        startDate: `${data.startDate}T${data.startTime}:00-03:00`,
        endDate: `${data.endDate}T${data.endTime}:00-03:00`,
        generateCertificate: data.generateCertificate,
        guests: data.guests,
      });
      router.push(`/event/${updated.eventoId}`);
    } catch (submitError) {
      setError(extractApiErrorMessage(submitError, 'Não foi possível editar a atividade.'));
    }
  }

  if (!activityId || error) return <p>{error || 'Informe a atividade para editar.'}</p>;
  return <ActivyForm mode="edit" initialValues={initialValues} onSubmit={handleSubmit} />;
}
