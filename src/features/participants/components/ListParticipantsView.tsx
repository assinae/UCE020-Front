'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Toast, PageLoader } from '@/components/ui';
import { useAuth } from '@/providers/auth-provider';
import { activityService } from '@/services/activityService';
import { participationService, type TipoParticipante } from '@/services/participationService';
import { presenceService } from '@/services/presenceService';
import { ToastSeverity } from '@/types/toast';
import { requirePresenceContext } from '@/features/participants/presence/utils/resolvePresenceContext';
import { buildValidatePresencePath } from '@/features/participants/presence/utils/routes';
import { PresenceContextMissing } from '@/features/participants/presence/components/PresenceContextMissing';
import { RemovePresenceModal } from '@/features/participants/presence/components/RemovePresenceModal';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import {
  ListPageHeader,
  ListPageLayout,
  ListToolbar,
  PaginatedTable,
} from '@/components/data-list';
import { ParticipantTableRow } from '@/features/participants/components/ParticipantTableRow';
import {
  countByPresenceStatus,
  filterParticipants,
} from '@/features/participants/utils/filterParticipants';
import { APP_TIMEZONE, getBahiaTimeInput } from '@/utils/date';
import { sortByName, type SortDirection } from '@/utils/sortByName';
import type { Participant, PresenceFilter } from '@/types/participant';

const TIPO_TO_ROLE: Record<TipoParticipante, 'organizer' | 'monitor' | 'participant'> = {
  organizador: 'organizer',
  monitor: 'monitor',
  participante: 'participant',
};

const FILTER_OPTIONS: { value: PresenceFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'confirmed', label: 'Marcaram presença' },
  { value: 'pending', label: 'Não marcaram' },
];

const DAY_MONTH_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  timeZone: APP_TIMEZONE,
  day: 'numeric',
  month: 'long',
});

function formatSchedule(startDate: string | undefined): string | null {
  if (!startDate || Number.isNaN(new Date(startDate).getTime())) return null;
  const time = getBahiaTimeInput(startDate).replace(':', 'h');
  return `${DAY_MONTH_FORMAT.format(new Date(startDate))} · ${time}`;
}

export function ListParticipantsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const eventIdParam = searchParams.get('eventId');
  const activityIdParam = searchParams.get('activityId');

  const [context, setContext] = useState(() =>
    requirePresenceContext(eventIdParam, activityIdParam)
  );

  const [search, setSearch] = useState('');
  const [presenceFilter, setPresenceFilter] = useState<PresenceFilter>('all');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(1);
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

    void import('@/features/participants/presence/utils/resolvePresenceContext').then(
      ({ fetchPresenceContext }) => {
        void fetchPresenceContext(eventIdParam, activityIdParam).then((resolvedContext) => {
          if (isMounted) {
            setContext(resolvedContext ?? fallbackContext);
          }
        });
      }
    );

    return () => {
      isMounted = false;
    };
  }, [eventIdParam, activityIdParam]);

  const { data: participantType = null, isLoading: isLoadingRole } = useQuery({
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

  const { data: activityDetails } = useQuery({
    queryKey: ['activity-details', numericActivityId],
    queryFn: () => activityService.findOne(numericActivityId),
    enabled: hasValidContext,
  });

  const error = isError
    ? queryError instanceof Error
      ? queryError.message
      : 'Erro ao carregar participantes'
    : null;

  const removePresenceMutation = useMutation({
    mutationFn: () =>
      presenceService.removePresence({
        participantId: selectedParticipant!.id,
        eventId: context!.eventId,
        activityId: context!.activityId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['activity-participants', numericEventId, numericActivityId],
      });
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

  const filteredParticipants = useMemo(
    () => sortByName(filterParticipants(participants, search, presenceFilter), sortDirection),
    [participants, search, presenceFilter, sortDirection]
  );

  if (!context) {
    return <PresenceContextMissing />;
  }

  const { eventId, activityId, activityTitle } = context;
  const role = participantType ? TIPO_TO_ROLE[participantType] : 'participant';
  // Organizador é administrador do evento e acumula os poderes de monitor.
  const canEditPresence = role === 'monitor' || role === 'organizer';
  const isActivityFinalized = context.activityStatus?.trim().toLowerCase() === 'finalizada';
  const canMutatePresence =
    canEditPresence && context.activityStatus !== undefined && !isActivityFinalized;
  const { confirmed: confirmedCount, pending: pendingCount } = countByPresenceStatus(participants);

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

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function changeFilter(filter: PresenceFilter) {
    setPresenceFilter(filter);
    setPage(1);
  }

  const isLoading = isLoadingParticipants || isLoadingRole;

  const total = confirmedCount + pendingCount;
  const scheduleLabel = formatSchedule(activityDetails?.dataInicio);
  const gridColumns = canEditPresence
    ? { xs: 'minmax(0, 1fr) 44px', md: '1fr 158px 60px' }
    : { xs: 'minmax(0, 1fr)', md: '1fr 158px' };

  return (
    <>
      <ListPageLayout>
        <ListPageHeader
          title="Participantes"
          subtitle={activityTitle}
          pill={scheduleLabel ? { icon: <AccessTimeRoundedIcon />, label: scheduleLabel } : null}
          stats={[
            { value: total, label: total === 1 ? 'inscrito' : 'inscritos' },
            { value: confirmedCount, label: 'marcaram', highlighted: true },
          ]}
          backHref={`/event/${eventId}`}
          action={
            canEditPresence
              ? {
                  label: 'Validar presenças',
                  icon: <QrCode2RoundedIcon />,
                  onClick: goToValidatePresence,
                  disabled: context.activityStatus === undefined || isActivityFinalized,
                }
              : null
          }
        />

        <ListToolbar
          search={search}
          onSearchChange={changeSearch}
          searchPlaceholder="Buscar participante"
          sortDirection={sortDirection}
          onSortChange={setSortDirection}
          filter={{
            label: 'Mostrar',
            value: presenceFilter,
            options: FILTER_OPTIONS,
            onChange: changeFilter,
          }}
        />

        {isLoading ? (
          <PageLoader minHeight="40dvh" />
        ) : error ? (
          <Box sx={{ color: 'error.main', textAlign: 'center', py: 2 }}>{error}</Box>
        ) : (
          <PaginatedTable
            items={filteredParticipants}
            getKey={(participant) => participant.id}
            columns={[
              { label: 'Participante' },
              { label: 'Presença' },
              ...(canEditPresence ? [{ label: 'Ações', alignRight: true }] : []),
            ]}
            gridColumns={gridColumns}
            page={page}
            onPageChange={setPage}
            paginationLabel="Paginação dos participantes"
            emptyTitle="Nenhum participante encontrado"
            emptyDescription="Ajuste a busca ou o filtro para ver outros nomes."
            renderRow={(participant) => (
              <ParticipantTableRow
                participant={participant}
                gridColumns={gridColumns}
                showActions={canEditPresence}
                canMutate={canMutatePresence}
                onValidate={goToValidatePresence}
                onRemove={openRemoveModal}
              />
            )}
          />
        )}
      </ListPageLayout>

      <RemovePresenceModal
        open={!!selectedParticipant}
        participantName={selectedParticipant?.name ?? null}
        activityTitle={activityTitle}
        onClose={closeRemoveModal}
        onConfirm={handleRemovePresence}
      />

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
}
