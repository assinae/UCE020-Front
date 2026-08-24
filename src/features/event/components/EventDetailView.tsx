'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, IconButton, Typography } from '@mui/material';
import { PageLoader } from '@/components/ui';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { ActivityModal, ConfirmModal } from '@/components/modals';
import { ContentCard } from '@/components/layout/ContentCard';
import { AppPageContainer } from '@/components/layout/AppPageContainer';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { buildListParticipantsPath } from '@/features/participants/presence/utils/routes';
import { useAuth } from '@/providers/auth-provider';
import { eventService, TipoParticipante } from '@/services/eventService';
import { getActivityModalVariant } from '@/features/event/utils/getActivityModalVariant';
import { ParticipantQrCodeModal } from '@/features/participants/presence/components/ParticipantQrCodeModal';
import { colorTokens } from '@/lib/colors';
import { formatActivityDate } from '@/utils/format';
import { EventActivitiesSection } from './EventActivitiesSection';
import { OrganizerEventActions } from './OrganizerEventActions';
import type { Activity } from '@/types/activity';
import type { Event } from '@/types/event';
import { participationService } from '@/services/participationService';
import { EventSubscriptionAction } from './EventSubscriptionAction';
import { ToastSeverity } from '@/types/toast';
import { Toast } from '@/components/ui/Toast';
import { extractApiErrorMessage } from '@/utils/apiError';
import { activityService } from '@/services/activityService';
import { isAxiosError } from 'axios';

interface EventDetailViewProps {
  eventId: string;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pendente: { bg: '#F1F2F6', color: '#667085', label: 'Pendente' },
  iniciada: { bg: '#E6F7F0', color: '#2EC4A0', label: 'Iniciada' },
  andamento: { bg: '#E8EDFB', color: '#253B68', label: 'Andamento' },
  finalizada: { bg: '#EAF7EE', color: '#35A384', label: 'Finalizada' },
};

const TIPO_TO_ROLE: Record<TipoParticipante, 'organizer' | 'monitor' | 'participant'> = {
  organizador: 'organizer',
  monitor: 'monitor',
  participante: 'participant',
};

type ActivityLike = Activity & {
  title?: string;
  name?: string;
  location?: string;
  workload?: string | number;
};

function DetailTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box
      sx={{
        minWidth: 0,
        p: { xs: 1.25, sm: 2 },
        borderRadius: 2,
        bgcolor: '#F8FAFC',
        border: '1px solid rgba(15, 29, 53, 0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1, sm: 1.5 },
      }}
    >
      <Box
        sx={{
          width: { xs: 30, sm: 36 },
          height: { xs: 30, sm: 36 },
          borderRadius: 2,
          display: 'grid',
          placeItems: 'center',
          color: '#2EC4A0',
          bgcolor: '#E6F7F0',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: '#667085',
            fontSize: { xs: 9.5, sm: 11 },
            fontWeight: 700,
            textTransform: 'uppercase',
            lineHeight: 1.2,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            color: '#0F1D35',
            fontSize: { xs: 12.25, sm: 13.5 },
            fontWeight: 700,
            lineHeight: 1.25,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
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
    if (participationError && isAxiosError(participationError) && participationError.response?.status !== 404) {
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

  const isSignupProcessingRef = useRef(false);
  const pendingEnrollmentChecksRef = useRef<Set<string>>(new Set());

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);

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
  const isOrganizer = role === 'organizer';

  const activityModalVariant = getActivityModalVariant(role, isActivityEnrolled);
  const activities = event?.atividades ?? [];
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
        Number(user.id),
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
          'Não foi possível cancelar a inscrição, presença registrada',
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

  function handleBack() {
    router.push('/home');
  }

  function handleEventFinalized() {
    queryClient.setQueryData(['event', numericEventId], (oldData: Event | undefined) => {
      return oldData ? { ...oldData, status: 'finalizada' } : oldData;
    });
    setToast({ open: true, message: 'Evento finalizado com sucesso', severity: ToastSeverity.Success });
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
      setToast({ open: true, message: 'Evento excluído com sucesso!', severity: ToastSeverity.Success });
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

  return (
    <AppPageContainer
      sx={{
        gap: 3,
        '& > .MuiBox-root': {
          maxWidth: 1120,
          p: { xs: 2, md: 3 },
        },
      }}
    >
      <ContentCard
        sx={{
          borderRadius: { xs: '22px', md: '28px' },
          gap: { xs: 2.5, md: 3 },
          p: { xs: 2, md: 3 },
          border: '1px solid rgba(15, 29, 53, 0.06)',
          boxShadow: '0 18px 45px rgba(15, 29, 53, 0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton
            onClick={handleBack}
            aria-label="Voltar"
            sx={{
              color: colorTokens.text.primary,
              bgcolor: '#F8FAFC',
              border: '1px solid rgba(15, 29, 53, 0.06)',
              '&:hover': { bgcolor: '#EEF2F6' },
            }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>
          {isOrganizer && event.status.toLowerCase() === 'pendente' && (
            <IconButton
              size="medium"
              onClick={handleDeleteClick}
              sx={{ color: '#F04438', padding: '8px', bgcolor: '#F044381A', '&:hover': { bgcolor: '#F0443833' } }}
              aria-label="Excluir evento"
            >
              <DeleteOutlineIcon fontSize="medium" />
            </IconButton>
          )}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: event.foto
              ? { xs: '1fr', md: 'minmax(320px, 0.9fr) minmax(0, 1.1fr)' }
              : '1fr',
            gap: { xs: 2.5, md: 3 },
            alignItems: 'stretch',
          }}
        >
          {event.foto && (
            <Box
              sx={{
                minHeight: { xs: 220, md: 360 },
                borderRadius: { xs: '18px', md: '22px' },
                overflow: 'hidden',
                position: 'relative',
                bgcolor: '#F0FAF7',
              }}
            >
              <Box
                component="img"
                src={event.foto}
                alt={event.nome}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </Box>
          )}

          <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2.25 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
              <Box
                component="span"
                sx={{
                  px: 1.5,
                  py: 0.6,
                  borderRadius: 99,
                  bgcolor: STATUS_STYLES[event.status.toLowerCase()]?.bg ?? '#F1F2F6',
                  color: STATUS_STYLES[event.status.toLowerCase()]?.color ?? '#667085',
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {STATUS_STYLES[event.status.toLowerCase()]?.label ?? event.status}
              </Box>
            </Box>

            <Typography
              component="h1"
              sx={{
                color: '#0F1D35',
                fontSize: { xs: 26, md: 36 },
                lineHeight: 1.08,
                fontWeight: 800,
                maxWidth: 620,
              }}
            >
              {event.nome}
            </Typography>

            <Typography
              sx={{
                color: '#475467',
                fontSize: { xs: 14, md: 15 },
                lineHeight: 1.65,
                maxWidth: 660,
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
                  alignSelf: 'flex-start',
                  p: 0,
                  border: 0,
                  bgcolor: 'transparent',
                  color: '#2EC4A0',
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {isDescriptionExpanded ? 'Ler menos' : 'Leia mais'}
              </Typography>
            ) : null}

            <Box
              sx={{
                mt: { xs: 0.5, md: 'auto' },
                p: { xs: 2, md: 2.25 },
                borderRadius: 2,
                bgcolor: '#0F1D35',
                color: '#FFF',
                display: 'flex',
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.68)', fontSize: 12, fontWeight: 700 }}>
                  Código do Evento
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: 25, md: 30 },
                    lineHeight: 1.1,
                    fontWeight: 900,
                    letterSpacing: '0.08em',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {event.codigo || 'Sem código'}
                </Typography>
              </Box>
              <IconButton
                onClick={handleCopyEventCode}
                disabled={!event.codigo}
                aria-label="Copiar código do evento"
                sx={{
                  flexShrink: 0,
                  color: '#FFF',
                  bgcolor: 'rgba(255,255,255,0.12)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  '&.Mui-disabled': { color: 'rgba(255,255,255,0.36)' },
                }}
              >
                <ContentCopyRoundedIcon />
              </IconButton>
            </Box>

            {isCodeCopied ? (
              <Typography sx={{ color: '#2EC4A0', fontSize: 12, fontWeight: 700 }}>
                Código copiado.
              </Typography>
            ) : null}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
            },
            gap: { xs: 1, sm: 1.5 },
          }}
        >
          <DetailTile
            icon={<CalendarTodayRoundedIcon sx={{ fontSize: 20 }} />}
            label="Data"
            value={formatActivityDate(event.dataInicio, event.dataFim)}
          />
          <DetailTile
            icon={<PlaceRoundedIcon sx={{ fontSize: 21 }} />}
            label="Local"
            value={event.localizacao || 'A definir'}
          />
          <DetailTile
            icon={<AccessTimeRoundedIcon sx={{ fontSize: 21 }} />}
            label="Carga horária"
            value={`${event.cargaHoraria} horas`}
          />
          <DetailTile
            icon={<PersonRoundedIcon sx={{ fontSize: 21 }} />}
            label="Inscritos"
            value={`${event.totalInscritos ?? 0} inscritos`}
          />
        </Box>

        {!isOrganizer && !isCheckingSubscription && (
          <EventSubscriptionAction
            isSubscribed={isSubscribed}
            isLoading={isSubscriptionLoading}
            onSubscribe={handleSubscribe}
            onUnsubscribe={handleUnsubscribe}
          />
        )}

        {isOrganizer && (
          <OrganizerEventActions
            eventId={Number(event.id)}
            isFinalized={event.status.toLowerCase() === 'finalizada'}
            onFinalized={handleEventFinalized}
            onFinalizeError={handleFinalizeError}
          />
        )}

        <EventActivitiesSection
          activities={activities}
          onSelectActivity={async (activity) => {
            const activityKey = String(activity.id);
            const normalizedEventId = Number(event?.id ?? eventId);

            setSelectedActivity(activity as ActivityLike);
            setIsActivityEnrolled(activityEnrollmentMap[activityKey] ?? false);
            setIsPresenceConfirmed(activityPresenceMap[activityKey] ?? false);
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

              if (Number.isFinite(normalizedEventId) && Number.isFinite(Number(activity.id)) && user?.id) {
                try {
                  const participants = await participationService.getActivityParticipants(
                    normalizedEventId,
                    Number(activity.id),
                  );
                  const me = participants.find((participant) => participant.id === String(user.id));

                  if (me) {
                    isRegistered = true;
                    presenceConfirmed = me.presenceStatus === 'confirmed';
                  }
                } catch (participantsError) {
                  console.error('[ATIVIDADE] erro ao listar participantes para verificar inscrição/presença:', participantsError);
                }
              }

              setIsActivityEnrolled(isRegistered);
              setIsPresenceConfirmed(presenceConfirmed);
              setActivityEnrollmentMap((prev) => ({
                ...prev,
                [activityKey]: isRegistered,
              }));
              setActivityPresenceMap((prev) => ({
                ...prev,
                [activityKey]: presenceConfirmed,
              }));
            } catch (error) {
              console.error('[ATIVIDADE] erro ao verificar inscrição:', error);
              setIsActivityEnrolled(activityEnrollmentMap[activityKey] ?? false);
              setIsPresenceConfirmed(activityPresenceMap[activityKey] ?? false);
            } finally {
              pendingEnrollmentChecksRef.current.delete(activityKey);
              setIsCheckingActivityEnrollment(false);
            }
          }}
        />
      </ContentCard>

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
        participantsCount={0}
        status={selectedActivity?.status ?? ''}
        description={selectedActivity?.description ?? ''}
        variant={
          isCheckingActivityEnrollment && role === 'participant'
            ? 'signup'
            : activityModalVariant
        }
        presenceConfirmed={isPresenceConfirmed}
        isLoading={isCheckingActivityEnrollment}
        onSignup={handleSignup}
        onCancelParticipation={handleCancelParticipation}
        onMarkPresence={handleMarkPresence}
        onValidatePresences={goToListParticipants}
        onListParticipants={goToListParticipants}
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
    </AppPageContainer>
  );
}