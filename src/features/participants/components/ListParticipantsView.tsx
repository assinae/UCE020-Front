'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box } from '@mui/material';
import { AppPageContainer } from '@/components/layout/AppPageContainer';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Toast, PageLoader } from '@/components/ui';
import { useAuth } from '@/providers/auth-provider';
import { participationService, type TipoParticipante } from '@/services/participationService';
import { presenceService } from '@/services/presenceService';
import { ToastSeverity } from '@/types/toast';
import { requirePresenceContext } from '@/features/participants/presence/utils/resolvePresenceContext';
import { buildValidatePresencePath } from '@/features/participants/presence/utils/routes';
import { PresenceContextMissing } from '@/features/participants/presence/components/PresenceContextMissing';
import { RemovePresenceModal } from '@/features/participants/presence/components/RemovePresenceModal';
import { ParticipantsListCard } from '@/features/participants/components/ParticipantsListCard';
import { ParticipantPresenceActions } from '@/features/participants/components/ParticipantPresenceActions';
import { ValidatePresencesButton } from '@/features/participants/components/ValidatePresencesButton';
import {
  filterParticipants,
  togglePresenceFilter,
} from '@/features/participants/utils/filterParticipants';
import type { Participant, PresenceFilter } from '@/types/participant';

const TIPO_TO_ROLE: Record<TipoParticipante, 'organizer' | 'monitor' | 'participant'> = {
  organizador: 'organizer',
  monitor: 'monitor',
  participante: 'participant',
};

export function ListParticipantsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const eventIdParam = searchParams.get('eventId');
  const activityIdParam = searchParams.get('activityId');

  const [context, setContext] = useState(() =>
    requirePresenceContext(eventIdParam, activityIdParam),
  );

  const [search, setSearch] = useState('');
  const [presenceFilter, setPresenceFilter] = useState<PresenceFilter>('all');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: ToastSeverity }>({
    open: false,
    message: '',
    severity: ToastSeverity.Success,
  });

  const queryClient = useQueryClient();
  const numericEventId = Number(context?.eventId);
  const numericActivityId = Number(context?.activityId);
  const hasValidContext = Number.isFinite(numericEventId) && Number.isFinite(numericActivityId);

  useEffect(() => {
    const fallbackContext = requirePresenceContext(eventIdParam, activityIdParam);

    let isMounted = true;

    void import('@/features/participants/presence/utils/resolvePresenceContext').then(({ fetchPresenceContext }) => {
      void fetchPresenceContext(eventIdParam, activityIdParam).then((resolvedContext) => {
        if (isMounted) {
          setContext(resolvedContext ?? fallbackContext);
        }
      });
    });

    return () => {
      isMounted = false;
    };
  }, [eventIdParam, activityIdParam]);

  const {
    data: participantType = null,
    isLoading: isLoadingRole,
  } = useQuery({
    queryKey: ['participant-type', numericEventId, user?.id],
    queryFn: () => participationService.getTipoParticipante(numericEventId),
    enabled: hasValidContext && !!user,
    retry: false,
  });

  const {
    data: participants = [],
    isLoading: isLoadingParticipants,
    isError,
    error: queryError,
  } = useQuery({
    queryKey: ['activity-participants', numericEventId, numericActivityId],
    queryFn: () => participationService.getActivityParticipants(numericEventId, numericActivityId),
    enabled: hasValidContext,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const error = isError ? (queryError instanceof Error ? queryError.message : 'Erro ao carregar participantes') : null;

  const removePresenceMutation = useMutation({
    mutationFn: () => presenceService.removePresence({
      participantId: selectedParticipant!.id,
      eventId: context!.eventId,
      activityId: context!.activityId,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-participants', numericEventId, numericActivityId] });
      setToast({
        open: true,
        message: 'Presença removida com sucesso.',
        severity: ToastSeverity.Success,
      });
      closeRemoveModal();
    },
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover presença';
      setToast({
        open: true,
        message: errorMessage,
        severity: ToastSeverity.Error,
      });
      console.error(errorMessage);
    },
  });

  if (!context) {
    return <PresenceContextMissing />;
  }

  const { eventId, activityId, activityTitle } = context;
  const role = participantType ? TIPO_TO_ROLE[participantType] : 'participant';
  const isMonitor = role === 'monitor';
  const canEditPresence = isMonitor || role === 'organizer';
  const filteredParticipants = filterParticipants(participants, search, presenceFilter);

  function handleFilterToggle(filter: Exclude<PresenceFilter, 'all'>) {
    setPresenceFilter((current) => togglePresenceFilter(current, filter));
  }

  function goToValidatePresence() {
    router.push(buildValidatePresencePath(eventId, activityId));
  }

  function openRemoveModal(participantId: string) {
    const participant = participants.find((item) => item.id === participantId);

    if (!participant || participant.presenceStatus !== 'confirmed') return;

    setSelectedParticipant(participant);
  }

  function closeRemoveModal() {
    setSelectedParticipant(null);
  }



  function handleRemovePresence() {
    if (!selectedParticipant || !context?.eventId || !context?.activityId) return;
    removePresenceMutation.mutate();
  }

  function renderParticipantActions(participant: Participant) {
    return (
      <ParticipantPresenceActions
        participant={participant}
        canValidatePresence={isMonitor}
        canEditPresence={canEditPresence}
        onValidatePresence={goToValidatePresence}
        onRemovePresence={openRemoveModal}
      />
    );
  }

  function handleBack() {
    router.push(`/event/${eventId}`);
  }

  const isLoading = isLoadingParticipants || isLoadingRole;

  return (
    <AppPageContainer maxWidth={760}>
      {isMonitor && <ValidatePresencesButton onClick={goToValidatePresence} />}

      {isLoading ? (
        <PageLoader minHeight="calc(100dvh - 160px)" />
      ) : error ? (
        <Box sx={{ color: 'error.main', textAlign: 'center', py: 2 }}>
          {error}
        </Box>
      ) : (
        <ParticipantsListCard
          participants={filteredParticipants}
          search={search}
          presenceFilter={presenceFilter}
          onSearchChange={setSearch}
          onFilterToggle={handleFilterToggle}
          onBack={handleBack}
          renderParticipantActions={renderParticipantActions}
        />
      )}

      <RemovePresenceModal
        open={!!selectedParticipant}
        participantName={selectedParticipant?.name ?? null}
        activityTitle={activityTitle}
        onClose={closeRemoveModal}
        onConfirm={handleRemovePresence}
      />
    </AppPageContainer>
  );
}