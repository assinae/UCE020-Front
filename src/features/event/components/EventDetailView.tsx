'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { PageLoader } from '@/components/ui';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { ActivityModal, ConfirmModal } from '@/components/modals';
import { AppPageContainer } from '@/components/layout/AppPageContainer';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { buildListParticipantsPath } from '@/features/participants/presence/utils/routes';
import { useAuth } from '@/providers/auth-provider';
import { eventService, TipoParticipante } from '@/services/eventService';
import { getActivityModalVariant } from '@/features/event/utils/getActivityModalVariant';
import { ParticipantQrCodeModal } from '@/features/participants/presence/components/ParticipantQrCodeModal';
import { colorTokens } from '@/lib/colors';
import { EventActivitiesSection } from './EventActivitiesSection';
import { OrganizerEventActions } from './OrganizerEventActions';
import { EventHero } from './EventHero';
import { EventInfoRow } from './EventInfoRow';
import { EventCodeCard } from './EventCodeCard';
import { EventAttendeesSummary } from './EventAttendeesSummary';
import type { Activity, ActivityGuest } from '@/types/activity';
import type { Event } from '@/types/event';
import { participationService } from '@/services/participationService';
import { EventSubscriptionAction } from './EventSubscriptionAction';
import { ToastSeverity } from '@/types/toast';
import { Toast } from '@/components/ui/Toast';
import { extractApiErrorMessage } from '@/utils/apiError';
import { activityService } from '@/services/activityService';
import { certificateService } from '@/services/certificate.service';
import { isAxiosError } from 'axios';
import type { ActivityFormState } from '@/features/activities/utils/activityFormRules';
import { ActivitySheet } from './event-form/ActivitySheet';
import { APP_TIMEZONE, getBahiaDateInput, getBahiaTimeInput, toBahiaIso } from '@/utils/date';

interface EventDetailViewProps {
  eventId: string;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pendente: { bg: '#F1F2F6', color: '#667085', label: 'Pendente' },
  iniciada: { bg: colorTokens.surface.mint, color: colorTokens.text.mint, label: 'Iniciado' },
  andamento: { bg: colorTokens.role.organizerBg, color: colorTokens.role.organizerText, label: 'Em andamento' },
  finalizada: { bg: colorTokens.surface.hover, color: colorTokens.text.muted, label: 'Finalizado' },
};

const TIPO_TO_ROLE: Record<TipoParticipante, 'organizer' | 'monitor' | 'participant'> = {
  organizador: 'organizer',
  monitor: 'monitor',
  participante: 'participant',
};

// Contornado em vez de preenchido para não competir com o chip de status, que
// fica ao lado.
const PARTICIPATION_CHIP: Record<TipoParticipante, { label: string; color: string }> = {
  organizador: { label: 'Organizador', color: colorTokens.navigation.default },
  monitor: { label: 'Monitor', color: colorTokens.brand.secondary },
  participante: { label: 'Participante', color: colorTokens.neutral.gray700 },
};

type ActivityLike = Activity & {
  title?: string;
  name?: string;
  location?: string;
  workload?: string | number;
};

// Versão curta da data para caber numa linha ao lado de local e carga horária
// (ex.: "11 a 15 de nov. de 2026"); a longa quebrava em três linhas no desktop.
function formatEventDateShort(start?: string, end?: string): string {
  const parse = (value?: string) => {
    const date = value ? new Date(value) : null;
    return date && !Number.isNaN(date.getTime()) ? date : null;
  };
  const startDate = parse(start);
  if (!startDate) return 'Data não informada';
  const endDate = parse(end);

  const parts = (date: Date) =>
    Object.fromEntries(
      new Intl.DateTimeFormat('pt-BR', {
        timeZone: APP_TIMEZONE,
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
        .formatToParts(date)
        .map(({ type, value }) => [type, value])
    ) as Record<'day' | 'month' | 'year', string>;

  const a = parts(startDate);
  if (!endDate) return `${a.day} de ${a.month} de ${a.year}`;
  const b = parts(endDate);

  if (a.year === b.year && a.month === b.month) {
    return a.day === b.day
      ? `${a.day} de ${a.month} de ${a.year}`
      : `${a.day} a ${b.day} de ${a.month} de ${a.year}`;
  }
  if (a.year === b.year) return `${a.day} de ${a.month} a ${b.day} de ${b.month} de ${b.year}`;
  return `${a.day} de ${a.month} de ${a.year} a ${b.day} de ${b.month} de ${b.year}`;
}

export function EventDetailView({ eventId }: EventDetailViewProps) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();
  const numericEventId = Number(eventId);
  const hasValidEventId = Number.isFinite(numericEventId);

  const {
    data: event = null,
    isLoading: isLoadingEventData,
    isError: isEventError,
  } = useQuery({
    queryKey: ['event', numericEventId],
    queryFn: () => eventService.findOne(numericEventId),
    enabled: hasValidEventId,
  });

  const loadError = !hasValidEventId
    ? 'Evento não encontrado.'
    : isEventError
      ? 'Não foi possível carregar os dados do evento.'
      : '';

  const {
    data: participantType = null,
    isLoading: isLoadingParticipation,
    error: participationError,
  } = useQuery({
    queryKey: ['participant-type', numericEventId, user?.id],
    queryFn: () => participationService.getTipoParticipante(numericEventId),
    enabled: hasValidEventId && !!user && !isAuthLoading,
    retry: false,
  });

  const isSubscribed = !!participantType;
  const isCheckingSubscription = isLoadingParticipation;

  const [toast, setToast] = useState<{ open: boolean; message: string; severity: ToastSeverity }>({
    open: false,
    message: '',
    severity: ToastSeverity.Error,
  });

  useEffect(() => {
    if (
      participationError &&
      isAxiosError(participationError) &&
      participationError.response?.status !== 404
    ) {
      const timer = setTimeout(() => {
        setToast({
          open: true,
          message: 'Não foi possível verificar sua inscrição neste evento',
          severity: ToastSeverity.Warning,
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [participationError]);

  const [selectedActivity, setSelectedActivity] = useState<ActivityLike | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [, setRegistrationUpdate] = useState(0);

  const [isActivityEnrolled, setIsActivityEnrolled] = useState(false);
  const [activityEnrollmentMap, setActivityEnrollmentMap] = useState<Record<string, boolean>>({});
  const [isCheckingActivityEnrollment, setIsCheckingActivityEnrollment] = useState(false);

  const [isPresenceConfirmed, setIsPresenceConfirmed] = useState(false);
  const [activityPresenceMap, setActivityPresenceMap] = useState<Record<string, boolean>>({});

  const [isActivityCertificateEnabled, setIsActivityCertificateEnabled] = useState(false);
  const [activityCertificateFlagMap, setActivityCertificateFlagMap] = useState<
    Record<string, boolean>
  >({});
  const [isGeneratingActivityCertificates, setIsGeneratingActivityCertificates] = useState(false);

  // GET /event/:id retorna as atividades num formato sem `status`/`gerarCertificado` —
  // por isso a fonte confiável pra esses dois campos é sempre GET /activity/:id
  // (activityService.findOne), nunca `event.atividades` direto.
  const [activityAuthoritativeStatus, setActivityAuthoritativeStatus] = useState('');
  const [activityStatusMap, setActivityStatusMap] = useState<Record<string, string>>({});

  const [selectedActivityGuests, setSelectedActivityGuests] = useState<ActivityGuest[]>([]);
  const [activityGuestsMap, setActivityGuestsMap] = useState<Record<string, ActivityGuest[]>>({});

  const isSignupProcessingRef = useRef(false);
  const openedActivityFromLinkRef = useRef(false);
  const activityIdFromLink = useSearchParams().get('atividade');
  const pendingEnrollmentChecksRef = useRef<Set<string>>(new Set());

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);
  // Muda a cada abertura para a folha começar com o formulário limpo.
  const [activitySheetSession, setActivitySheetSession] = useState(0);
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);

  const isLoadingEvent = isLoadingEventData || isAuthLoading;

  const subscribeMutation = useMutation({
    mutationFn: () => participationService.subscribe(numericEventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participating-events'] });
      queryClient.invalidateQueries({ queryKey: ['participant-type', numericEventId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ['home-events'] });
      setToast({
        open: true,
        message: 'Inscrição realizada com sucesso',
        severity: ToastSeverity.Success,
      });
    },
    onError: (error) => {
      setToast({
        open: true,
        message: extractApiErrorMessage(error, 'Não foi possível concluir a inscrição'),
        severity: ToastSeverity.Error,
      });
    },
  });

  const unsubscribeMutation = useMutation({
    mutationFn: () => participationService.unsubscribe(numericEventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participating-events'] });
      queryClient.invalidateQueries({ queryKey: ['participant-type', numericEventId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ['home-events'] });
      router.push('/home');
    },
    onError: (error) => {
      setToast({
        open: true,
        message: extractApiErrorMessage(error, 'Não foi possível cancelar a inscrição'),
        severity: ToastSeverity.Error,
      });
    },
  });

  const isSubscriptionLoading = subscribeMutation.isPending || unsubscribeMutation.isPending;

  function handleSubscribe() {
    subscribeMutation.mutate();
  }

  function handleUnsubscribe() {
    unsubscribeMutation.mutate();
  }
  const role = participantType ? TIPO_TO_ROLE[participantType] : 'participant';
  // Só quem tem participação tem papel: sem isso, visitante veria "Participante".
  const participationChip = participantType ? PARTICIPATION_CHIP[participantType] : null;
  const isOrganizer = role === 'organizer';

  const activityModalVariant = getActivityModalVariant(role, isActivityEnrolled);
  // A API devolve na ordem de cadastro, o que embaralha a programação: um dia
  // pela manhã aparecia antes da tarde de um dia anterior.
  const activities = useMemo(
    () =>
      [...(event?.atividades ?? [])].sort(
        (a, b) => new Date(a.startDate ?? 0).getTime() - new Date(b.startDate ?? 0).getTime()
      ),
    [event?.atividades]
  );
  const shouldClampDescription = !!event?.descricao && event.descricao.length > 180;

  async function handleSignup() {
    if (!selectedActivity || !user?.id) return;

    // prevent duplicate subscribe requests
    if (isSignupProcessingRef.current) return;
    isSignupProcessingRef.current = true;

    try {
      await participationService.subscribeToActivity(Number(selectedActivity.id), Number(user.id));
      queryClient.invalidateQueries({ queryKey: ['activity-participants'] });

      const activityKey = String(selectedActivity.id);

      setIsActivityEnrolled(true);
      setActivityEnrollmentMap((prev) => ({
        ...prev,
        [activityKey]: true,
      }));
      setRegistrationUpdate((prev) => prev + 1);
      setToast({
        open: true,
        message: 'Inscrição realizada com sucesso',
        severity: ToastSeverity.Success,
      });
    } catch (error) {
      const message = extractApiErrorMessage(error, 'Não foi possível concluir a inscrição');

      if (message.toLowerCase().includes('já inscrito')) {
        const activityKey = String(selectedActivity.id);
        setIsActivityEnrolled(true);
        setActivityEnrollmentMap((prev) => ({
          ...prev,
          [activityKey]: true,
        }));
      }

      setToast({
        open: true,
        message,
        severity: ToastSeverity.Error,
      });
    } finally {
      isSignupProcessingRef.current = false;
    }
  }

  async function handleCancelParticipation() {
    if (!selectedActivity || !user?.id || isSignupProcessingRef.current) return;

    isSignupProcessingRef.current = true;

    try {
      await participationService.unsubscribeFromActivity(
        Number(selectedActivity.id),
        Number(user.id)
      );
      queryClient.invalidateQueries({ queryKey: ['activity-participants'] });

      const activityKey = String(selectedActivity.id);
      setIsActivityEnrolled(false);
      setActivityEnrollmentMap((prev) => ({
        ...prev,
        [activityKey]: false,
      }));
      setRegistrationUpdate((prev) => prev + 1);
      setToast({
        open: true,
        message: 'Inscrição cancelada com sucesso',
        severity: ToastSeverity.Success,
      });
      setSelectedActivity(null);
      setIsQrModalOpen(false);
    } catch (error) {
      setToast({
        open: true,
        message: extractApiErrorMessage(
          error,
          'Não foi possível cancelar a inscrição, presença registrada'
        ),
        severity: ToastSeverity.Error,
      });
    } finally {
      isSignupProcessingRef.current = false;
    }
  }

  function handleMarkPresence() {
    if (!selectedActivity) return;
    setIsQrModalOpen(true);
  }

  function goToListParticipants() {
    if (!selectedActivity) return;
    setSelectedActivity(null);
    setIsQrModalOpen(false);
    router.push(buildListParticipantsPath(eventId, selectedActivity.id));
  }

  async function handleGenerateActivityCertificates() {
    if (!selectedActivity) return;

    setIsGeneratingActivityCertificates(true);
    try {
      const result = await certificateService.generateActivityCertificates(selectedActivity.id);
      const alreadyIssuedSuffix =
        result.alreadyIssued > 0 ? ` (${result.alreadyIssued} já emitido(s) anteriormente)` : '';

      setToast({
        open: true,
        message: `${result.issued} certificado(s) de atividade emitido(s)${alreadyIssuedSuffix}.`,
        severity: ToastSeverity.Success,
      });
    } catch (error) {
      setToast({
        open: true,
        message: extractApiErrorMessage(
          error,
          'Não foi possível gerar os certificados da atividade'
        ),
        severity: ToastSeverity.Error,
      });
    } finally {
      setIsGeneratingActivityCertificates(false);
    }
  }

  async function handleCreateActivity(data: ActivityFormState) {
    if (!event || !Number.isFinite(numericEventId) || isCreatingActivity) return;

    setIsCreatingActivity(true);
    try {
      await activityService.create({
        name: data.name,
        category: data.category,
        location: data.location,
        workload: Number(data.workload),
        description: data.description,
        startDate: toBahiaIso(data.startDate, data.startTime),
        endDate: toBahiaIso(data.endDate, data.endTime),
        eventId: Number(event.id),
        generateCertificate: data.generateCertificate,
        guests: data.guests.map((guest) => ({
          name: guest.name,
          email: guest.email,
          role: guest.role,
        })),
      });

      queryClient.invalidateQueries({ queryKey: ['event', numericEventId] });
      queryClient.invalidateQueries({ queryKey: ['home-events'] });
      queryClient.invalidateQueries({ queryKey: ['events-created'] });

      setIsActivityDrawerOpen(false);
      setToast({
        open: true,
        message: 'Atividade cadastrada com sucesso',
        severity: ToastSeverity.Success,
      });
    } catch (error) {
      setToast({
        open: true,
        message: extractApiErrorMessage(error, 'Não foi possível cadastrar a atividade'),
        severity: ToastSeverity.Error,
      });
    } finally {
      setIsCreatingActivity(false);
    }
  }

  function handleEventFinalized() {
    queryClient.setQueryData(['event', numericEventId], (oldData: Event | undefined) => {
      return oldData
        ? {
            ...oldData,
            status: 'finalizada',
            atividades: oldData.atividades?.map((activity) => ({
              ...activity,
              status: 'finalizada',
            })),
          }
        : oldData;
    });
    setToast({
      open: true,
      message: 'Evento finalizado com sucesso',
      severity: ToastSeverity.Success,
    });
  }

  function handleFinalizeError(message: string) {
    setToast({ open: true, message, severity: ToastSeverity.Error });
  }

  async function handleCopyEventCode() {
    if (!event?.codigo) return;

    try {
      await navigator.clipboard.writeText(event.codigo);
      setIsCodeCopied(true);
      window.setTimeout(() => setIsCodeCopied(false), 1600);
    } catch {
      setIsCodeCopied(false);
    }
  }

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteEvent = async () => {
    if (!event) return;
    setIsDeletingEvent(true);
    try {
      await eventService.deleteEvent(Number(event.id));
      queryClient.invalidateQueries({ queryKey: ['home-events'] });
      queryClient.invalidateQueries({ queryKey: ['events-created'] });
      setToast({
        open: true,
        message: 'Evento excluído com sucesso!',
        severity: ToastSeverity.Success,
      });
      setIsDeleteModalOpen(false);
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      setToast({ open: true, message: 'Erro ao excluir o evento.', severity: ToastSeverity.Error });
      setIsDeletingEvent(false);
      setIsDeleteModalOpen(false);
    }
  };

  const isLoading = isLoadingEvent || isLoadingParticipation;

  async function handleSelectActivity(activity: Activity) {
    const activityKey = String(activity.id);
    const normalizedEventId = Number(event?.id ?? eventId);

    setSelectedActivity(activity as ActivityLike);
    setIsActivityEnrolled(activityEnrollmentMap[activityKey] ?? false);
    setIsPresenceConfirmed(activityPresenceMap[activityKey] ?? false);
    setIsActivityCertificateEnabled(activityCertificateFlagMap[activityKey] ?? false);
    setActivityAuthoritativeStatus(activityStatusMap[activityKey] ?? '');
    setSelectedActivityGuests(activity.guests ?? activityGuestsMap[activityKey] ?? []);
    setIsQrModalOpen(false);

    if (pendingEnrollmentChecksRef.current.has(activityKey)) {
      return;
    }

    pendingEnrollmentChecksRef.current.add(activityKey);
    setIsCheckingActivityEnrollment(true);

    try {
      const activityDetails = await activityService.findOne(activity.id);
      let isRegistered = Boolean(activityDetails?.isRegistered ?? false);
      let presenceConfirmed = false;
      const certificateEnabled = Boolean(activityDetails?.gerarCertificado ?? false);
      const authoritativeStatus = activityDetails?.status ?? '';
      const activityGuests: ActivityGuest[] = (activityDetails?.guests ?? []).map((guest) => ({
        name: guest.name,
        email: guest.email,
        role: guest.role,
      }));

      if (Number.isFinite(normalizedEventId) && Number.isFinite(Number(activity.id)) && user?.id) {
        try {
          const participants = await participationService.getActivityParticipants(
            normalizedEventId,
            Number(activity.id)
          );
          const me = participants.find((participant) => participant.id === String(user.id));

          if (me) {
            isRegistered = true;
            presenceConfirmed = me.presenceStatus === 'confirmed';
          }
        } catch (participantsError) {
          console.error(
            '[ATIVIDADE] erro ao listar participantes para verificar inscrição/presença:',
            participantsError
          );
        }
      }

      setIsActivityEnrolled(isRegistered);
      setIsPresenceConfirmed(presenceConfirmed);
      setIsActivityCertificateEnabled(certificateEnabled);
      setActivityAuthoritativeStatus(authoritativeStatus);
      setActivityEnrollmentMap((prev) => ({
        ...prev,
        [activityKey]: isRegistered,
      }));
      setActivityPresenceMap((prev) => ({
        ...prev,
        [activityKey]: presenceConfirmed,
      }));
      setActivityCertificateFlagMap((prev) => ({
        ...prev,
        [activityKey]: certificateEnabled,
      }));
      setActivityStatusMap((prev) => ({
        ...prev,
        [activityKey]: authoritativeStatus,
      }));
      setSelectedActivityGuests(activityGuests);
      setActivityGuestsMap((prev) => ({
        ...prev,
        [activityKey]: activityGuests,
      }));
    } catch (error) {
      console.error('[ATIVIDADE] erro ao verificar inscrição:', error);
      setIsActivityEnrolled(activityEnrollmentMap[activityKey] ?? false);
      setIsPresenceConfirmed(activityPresenceMap[activityKey] ?? false);
      setIsActivityCertificateEnabled(activityCertificateFlagMap[activityKey] ?? false);
      setActivityAuthoritativeStatus(activityStatusMap[activityKey] ?? '');
      setSelectedActivityGuests(activity.guests ?? activityGuestsMap[activityKey] ?? []);
    } finally {
      pendingEnrollmentChecksRef.current.delete(activityKey);
      setIsCheckingActivityEnrollment(false);
    }
  }

  // A home linka para cá com ?atividade=<id> no botão "Ver atividade".
  useEffect(() => {
    if (!activityIdFromLink || openedActivityFromLinkRef.current) return;
    const activity = activities.find((item) => String(item.id) === activityIdFromLink);
    if (!activity) return;
    const timer = setTimeout(() => {
      openedActivityFromLinkRef.current = true;
      void handleSelectActivity(activity);
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities, activityIdFromLink]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!event) {
    return (
      <AppPageContainer
        sx={{
          borderRadius: '28px',
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography sx={{ color: colorTokens.text.primary, fontWeight: 600 }}>
          {loadError || 'Evento não encontrado.'}
        </Typography>
      </AppPageContainer>
    );
  }

  const statusKey = event.status.toLowerCase();
  const statusStyle = STATUS_STYLES[statusKey];
  const isFinalized = statusKey === 'finalizada';
  const totalInscritos = event.totalInscritos ?? 0;

  // Mesma ação principal no rodapé fixo (mobile) e na coluna lateral (desktop).
  const renderOrganizerActions = (trigger: 'button' | 'icon') => (
    <OrganizerEventActions
      eventId={Number(event.id)}
      activities={activities}
      isFinalized={isFinalized}
      canDelete={statusKey === 'pendente'}
      onAddActivity={() => {
        setActivitySheetSession((prev) => prev + 1);
        setIsActivityDrawerOpen(true);
      }}
      onDelete={handleDeleteClick}
      onFinalized={handleEventFinalized}
      onFinalizeError={handleFinalizeError}
      trigger={trigger}
    />
  );

  // No mobile o organizador usa o botão de ícone ao lado do título; a barra fixa
  // do rodapé fica só para inscrição.
  const primaryAction = isCheckingSubscription ? null : isOrganizer ? (
    renderOrganizerActions('button')
  ) : (
    <EventSubscriptionAction
      isSubscribed={isSubscribed}
      isLoading={isSubscriptionLoading}
      isFinalized={isFinalized}
      onSubscribe={handleSubscribe}
      onUnsubscribe={handleUnsubscribe}
    />
  );

  const summaryBlocks = (
    <>
      <EventCodeCard code={event.codigo} copied={isCodeCopied} onCopy={handleCopyEventCode} />
      <EventAttendeesSummary total={totalInscritos} />
    </>
  );

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: colorTokens.surface.app }}>
      <Box
        sx={{
          maxWidth: 1180,
          mx: 'auto',
          px: { xs: 0, md: 3 },
          pt: { xs: 0, md: 3 },
          pb: { xs: 0, md: 7 },
        }}
      >
        {/* Mobile: capa de ponta a ponta. Desktop: mesma largura do card abaixo. */}
        <EventHero
          image={event.foto}
          title={event.nome}
          action={
            <Box
              component="span"
              sx={{
                px: 1.75,
                py: 0.75,
                borderRadius: 99,
                bgcolor: statusStyle?.bg ?? '#F1F2F6',
                color: statusStyle?.color ?? '#667085',
                fontSize: 12,
                fontWeight: 800,
                boxShadow: '0 6px 18px rgba(13, 30, 59, 0.18)',
                whiteSpace: 'nowrap',
              }}
            >
              {statusStyle?.label ?? event.status}
            </Box>
          }
        />

        <Box
          sx={{
            position: 'relative',
            mt: { xs: '-28px', md: '-72px' },
            bgcolor: '#FFFFFF',
            borderRadius: { xs: '28px 28px 0 0', md: '28px' },
            border: { xs: 'none', md: '1px solid rgba(13, 30, 59, 0.06)' },
            boxShadow: {
              xs: '0 -10px 30px rgba(13, 30, 59, 0.08)',
              md: '0 18px 45px rgba(15, 29, 53, 0.08)',
            },
            px: { xs: 2.5, sm: 3.5, md: 4, lg: 5 },
            pt: { xs: 3, md: 4.5 },
            pb: { xs: 4, md: 5 },
            display: 'grid',
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) 320px', lg: 'minmax(0, 1fr) 340px' },
            columnGap: { md: 4, lg: 5 },
            alignItems: 'start',
          }}
        >
          <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 3.5 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {participationChip && (
                <Box
                  component="span"
                  sx={{
                    alignSelf: 'flex-start',
                    px: 1.5,
                    py: 0.4,
                    borderRadius: 99,
                    border: '1.5px solid',
                    borderColor: participationChip.color,
                    color: participationChip.color,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {participationChip.label}
                </Box>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography
                  component="h1"
                  sx={{
                    color: colorTokens.text.heading,
                    fontSize: { xs: 25, sm: 30, md: 34 },
                    lineHeight: 1.12,
                    fontWeight: 800,
                    letterSpacing: '-0.035em',
                    overflowWrap: 'anywhere',
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {event.nome}
                </Typography>
                {isOrganizer && !isCheckingSubscription ? (
                  <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    {renderOrganizerActions('icon')}
                  </Box>
                ) : null}
              </Box>
              {role === 'monitor' && (
                <Typography
                  sx={{
                    mt: 0.5,
                    px: 1.75,
                    py: 1.25,
                    borderRadius: '16px',
                    bgcolor: colorTokens.surface.mint,
                    color: colorTokens.text.mint,
                    fontSize: 13,
                    fontWeight: 600,
                    lineHeight: 1.5,
                  }}
                >
                  Como monitor, você valida as presenças abrindo uma atividade da programação abaixo.
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'minmax(0, 1fr)',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(3, minmax(0, 1fr))',
                },
                gap: { xs: 2, sm: 2.5 },
                p: { xs: 0, md: 2.25 },
                borderRadius: { md: '20px' },
                bgcolor: { md: colorTokens.surface.panel },
                border: { md: '1px solid rgba(13, 30, 59, 0.05)' },
              }}
            >
              <EventInfoRow
                icon={<CalendarTodayRoundedIcon sx={{ fontSize: 20 }} />}
                title={formatEventDateShort(event.dataInicio, event.dataFim)}
                subtitle="Data do evento"
              />
              <EventInfoRow
                icon={<PlaceRoundedIcon sx={{ fontSize: 21 }} />}
                title={event.localizacao || 'A definir'}
                subtitle="Local"
              />
              <EventInfoRow
                icon={<AccessTimeRoundedIcon sx={{ fontSize: 21 }} />}
                title={`${event.cargaHoraria} horas`}
                subtitle="Carga horária"
              />
            </Box>

            {/* No mobile o código e os inscritos ficam no fluxo; no desktop vão para a coluna lateral. */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 1.5 }}>
              {summaryBlocks}
            </Box>

            {event.descricao ? (
              <Box component="section">
                <Typography
                  component="h2"
                  sx={{ color: colorTokens.text.heading, fontSize: 17, fontWeight: 800, mb: 1 }}
                >
                  Sobre o evento
                </Typography>
                <Typography
                  sx={{
                    color: colorTokens.text.muted,
                    fontSize: { xs: 14, md: 15 },
                    lineHeight: 1.7,
                    whiteSpace: 'pre-line',
                    display: '-webkit-box',
                    WebkitLineClamp: shouldClampDescription && !isDescriptionExpanded ? 4 : 'unset',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {event.descricao}
                </Typography>
                {shouldClampDescription ? (
                  <Typography
                    component="button"
                    type="button"
                    onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                    sx={{
                      mt: 0.75,
                      p: 0,
                      border: 0,
                      bgcolor: 'transparent',
                      color: colorTokens.brand.secondary,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      '&:hover': { color: colorTokens.brand.secondaryDark, textDecoration: 'underline' },
                    }}
                  >
                    {isDescriptionExpanded ? 'Ler menos' : 'Leia mais'}
                  </Typography>
                ) : null}
              </Box>
            ) : null}

            <Accordion
              disableGutters
              elevation={0}
              sx={{
                borderRadius: '20px !important',
                bgcolor: colorTokens.surface.panel,
                border: '1px solid rgba(13, 30, 59, 0.05)',
                overflow: 'hidden',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreRoundedIcon sx={{ color: colorTokens.text.heading }} />}
                sx={{ px: 2, minHeight: 52 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      flexShrink: 0,
                      borderRadius: '10px',
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: colorTokens.surface.mint,
                      color: colorTokens.brand.secondary,
                    }}
                  >
                    <InfoOutlinedIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: colorTokens.text.heading }}>
                    Sobre o funcionamento do evento
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
                <Typography
                  component="ul"
                  sx={{ m: 0, pl: 2.5, fontSize: 13.5, lineHeight: 1.7, color: colorTokens.text.muted }}
                >
                  <li>Inscrições e presenças seguem o período e as regras de cada atividade.</li>
                  <li>Monitores e organizadores registram presenças durante a atividade.</li>
                  <li>
                    Ao finalizar, o evento e todas as atividades em aberto são encerrados; inscrições,
                    participantes e presenças deixam de poder ser alterados.
                  </li>
                  <li>
                    Depois do encerramento, o organizador pode consultar os relatórios e certificados
                    disponíveis.
                  </li>
                </Typography>
              </AccordionDetails>
            </Accordion>

            <EventActivitiesSection activities={activities} onSelectActivity={handleSelectActivity} />

            {/* Mobile: inscrição no fim do conteúdo do evento, sem acompanhar a rolagem. */}
            {primaryAction && !isOrganizer ? (
              <Box sx={{ display: { xs: 'block', md: 'none' } }}>{primaryAction}</Box>
            ) : null}
          </Box>

          <Box
            component="aside"
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              gap: 1.5,
              position: 'sticky',
              top: 104,
            }}
          >
            {summaryBlocks}
            {primaryAction ? <Box sx={{ mt: 1 }}>{primaryAction}</Box> : null}
          </Box>
        </Box>

      </Box>

      <ActivityModal
        open={!!selectedActivity}
        onClose={() => {
          setSelectedActivity(null);
          setIsQrModalOpen(false);
        }}
        title={selectedActivity?.name ?? selectedActivity?.title ?? ''}
        image={event.foto ?? undefined}
        startDate={selectedActivity?.startDate ?? ''}
        endDate={selectedActivity?.endDate ?? ''}
        location={selectedActivity?.location ?? event.localizacao ?? ''}
        hours={Number(selectedActivity?.workload ?? 0) || event.cargaHoraria || 0}
        participantsCount={selectedActivity?.totalInscritos ?? 0}
        status={activityAuthoritativeStatus || selectedActivity?.status || ''}
        description={selectedActivity?.description ?? ''}
        guests={selectedActivityGuests}
        variant={
          isCheckingActivityEnrollment && role === 'participant' ? 'signup' : activityModalVariant
        }
        presenceConfirmed={isPresenceConfirmed}
        generateCertificate={isActivityCertificateEnabled}
        isLoading={isCheckingActivityEnrollment}
        isGeneratingCertificates={isGeneratingActivityCertificates}
        onSignup={handleSignup}
        onCancelParticipation={handleCancelParticipation}
        onMarkPresence={handleMarkPresence}
        onValidatePresences={goToListParticipants}
        onListParticipants={goToListParticipants}
        onGenerateCertificates={handleGenerateActivityCertificates}
        onViewReport={() => {
          if (selectedActivity) {
            router.push(`/event/${eventId}/report/attendance?activityId=${selectedActivity.id}`);
          }
        }}
      />

      {selectedActivity && user && (
        <ParticipantQrCodeModal
          open={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          payload={{
            participantId: String(user?.id ?? ''),
            participantName: user.name,
            activityId: selectedActivity.id,
            activityTitle: selectedActivity.name ?? selectedActivity.title ?? '',
            eventId,
          }}
        />
      )}

      {/* Mesma folha de atividade da tela de cadastrar evento. */}
      <ActivitySheet
        key={activitySheetSession}
        open={isActivityDrawerOpen}
        editing={false}
        eventDateRange={
          event.dataInicio && event.dataFim
            ? {
                start: `${getBahiaDateInput(event.dataInicio)}T${getBahiaTimeInput(event.dataInicio)}`,
                end: `${getBahiaDateInput(event.dataFim)}T${getBahiaTimeInput(event.dataFim)}`,
              }
            : undefined
        }
        maxWorkload={event.cargaHoraria ? Number(event.cargaHoraria) : undefined}
        eventLocation={event.localizacao || ''}
        onSubmit={handleCreateActivity}
        onClose={() => setIsActivityDrawerOpen(false)}
      />

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />

      <ConfirmModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        message="Tem certeza que deseja excluir este evento?"
        emphasisEndText="Esta ação não poderá ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={confirmDeleteEvent}
        isLoading={isDeletingEvent}
        type="error"
      />
    </Box>
  );
}
