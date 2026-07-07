'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { ActivityModal } from '@/components/modals';
import { ContentCard } from '@/components/layout/ContentCard';
import { AppPageContainer } from '@/components/layout/AppPageContainer';
import { buildListParticipantsPath } from '@/features/participants/presence/utils/routes';
import { useAuth } from '@/providers/auth-provider';
import { registrationService } from '@/services/registrationService';
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

// Mapeia o tipo retornado pela API (pt-BR) para o "role" usado nos componentes de UI.
// ATENÇÃO: ajuste os valores da direita ('organizer' | 'monitor' | 'participant') se
// getActivityModalVariant / OrganizerEventActions esperarem outros literais.
const TIPO_TO_ROLE: Record<TipoParticipante, 'organizer' | 'monitor' | 'participant'> = {
  organizador: 'organizer',
  monitor: 'monitor',
  participante: 'participant',
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
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [participantType, setParticipantType] = useState<TipoParticipante | null>(null);
  const [isLoadingParticipation, setIsLoadingParticipation] = useState(true);

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [, setRegistrationUpdate] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: ToastSeverity }>({
    open: false,
    message: '',
    severity: ToastSeverity.Error,
  });

  // Busca os dados do evento
  useEffect(() => {
    const numericEventId = Number(eventId);
    let isMounted = true;

    if (!Number.isFinite(numericEventId)) {
      Promise.resolve().then(() => {
        if (isMounted) {
          setSelectedActivity(null);
          setIsQrModalOpen(false);
          setIsDescriptionExpanded(false);
          setEvent(null);
          setLoadError('Evento não encontrado.');
          setIsLoadingEvent(false);
        }
      });
      return;
    }

    Promise.resolve().then(() => {
      if (isMounted) {
        setSelectedActivity(null);
        setIsQrModalOpen(false);
        setIsDescriptionExpanded(false);
        setIsLoadingEvent(true);
        setLoadError('');
      }
    });

    eventService
      .findOne(numericEventId)
      .then((apiEvent) => {
        if (isMounted) {
          setEvent(apiEvent);
        }
      })
      .catch(() => {
        if (isMounted) {
          setEvent(null);
          setLoadError('Não foi possível carregar os dados do evento.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingEvent(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  useEffect(() => {
    const numericEventId = Number(eventId);
    if (!Number.isFinite(numericEventId)) return;

    let isMounted = true;

    eventService
      .findParticipatingEvents()
      .then((events) => {
        if (isMounted) {
          setIsSubscribed(events.some((e) => e.id === numericEventId));
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error('Falha ao verificar inscrição no evento:', error);
          setToast({
            open: true,
            message: 'Não foi possível verificar sua inscrição neste evento',
            severity: ToastSeverity.Warning,
          });
          setIsSubscribed(false);
        }
      })
      .finally(() => {
        if (isMounted) setIsCheckingSubscription(false);
      });

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  function extractErrorMessage(error: unknown, fallback: string): string {
    if (isAxiosError(error) && typeof error.response?.data?.message === 'string') {
      return error.response.data.message;
    }
    return fallback;
  }

  function handleSubscribe() {
    const numericEventId = Number(eventId);
    setIsSubscriptionLoading(true);
    participationService
      .subscribe(numericEventId)
      .then(() => {
        setIsSubscribed(true);
        setToast({ open: true, message: 'Inscrição realizada com sucesso', severity: ToastSeverity.Success });
      })
      .catch((error) => {
        setToast({
          open: true,
          message: extractErrorMessage(error, 'Não foi possível concluir a inscrição'),
          severity: ToastSeverity.Error,
        });
      })
      .finally(() => setIsSubscriptionLoading(false));
  }

  function handleUnsubscribe() {
    const numericEventId = Number(eventId);
    setIsSubscriptionLoading(true);
    participationService
      .unsubscribe(numericEventId)
      .then(() => {
        setIsSubscribed(false);
        router.push('/home');
      })
      .catch((error) => {
        setToast({
          open: true,
          message: extractErrorMessage(error, 'Não foi possível cancelar a inscrição'),
          severity: ToastSeverity.Error,
        });
      })
      .finally(() => setIsSubscriptionLoading(false));
  }

  // Busca o tipo de participação do usuário logado naquele evento
  useEffect(() => {
  const numericEventId = Number(eventId);
  participationService.getTipoParticipante(numericEventId)
    .then((tipo: TipoParticipante) => {
      console.log('[participação] tipo recebido:', tipo); // debug
      setParticipantType(tipo);
    })
    .catch((err) => {
      console.error('[participação] erro ao buscar tipo:', err); // debug
      setParticipantType(null);
    })
    .finally(() => {
      setIsLoadingParticipation(false);
    });
}, [eventId, user?.id]);

  const role = participantType ? TIPO_TO_ROLE[participantType] : 'participant';
  const isOrganizer = role === 'organizer';
  const isActivityEnrolled = selectedActivity
    ? registrationService.isRegistered(eventId, selectedActivity.id, String(user?.id ?? ''))
    : false;

  const activityModalVariant = getActivityModalVariant(role, isActivityEnrolled);
  const activities = event?.atividades ?? [];
  const shouldClampDescription = !!event?.descricao && event.descricao.length > 180;

  function handleSignup() {
    if (!selectedActivity || !user?.id) return;
    registrationService.register(eventId, selectedActivity.id, String(user.id));
    setRegistrationUpdate((prev) => prev + 1);
  }

  function handleCancelParticipation() {
    if (!selectedActivity || !user?.id) return;
    registrationService.unregister(eventId, selectedActivity.id, String(user.id));
    setRegistrationUpdate((prev) => prev + 1);
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

  const isLoading = isLoadingEvent || isLoadingParticipation;

  if (isLoading) {
    return (
      <AppPageContainer
        sx={{
          borderRadius: '28px',
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </AppPageContainer>
    );
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(320px, 0.9fr) minmax(0, 1.1fr)' },
            gap: { xs: 2.5, md: 3 },
            alignItems: 'stretch',
          }}
        >
          <Box
            sx={{
              minHeight: { xs: 220, md: 360 },
              borderRadius: { xs: '18px', md: '22px' },
              overflow: 'hidden',
              position: 'relative',
              bgcolor: '#F0FAF7',
            }}
          >
            {event.foto ? (
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
            ) : (
              <Box
                sx={{
                  height: '100%',
                  minHeight: 'inherit',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#2EC4A0',
                  bgcolor: '#E6F7F0',
                }}
              >
                <EventAvailableRoundedIcon sx={{ fontSize: 76 }} />
              </Box>
            )}
          </Box>

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
            value="0 inscritos"
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

        {isOrganizer && <OrganizerEventActions eventId={Number(event.id)} />}

        <EventActivitiesSection
          activities={activities}
          onSelectActivity={setSelectedActivity}
        />
      </ContentCard>

      <ActivityModal
        open={!!selectedActivity}
        onClose={() => {
          setSelectedActivity(null);
          setIsQrModalOpen(false);
        }}
        title={selectedActivity?.name ?? ''}
        image={event.foto ?? undefined}
        startDate={selectedActivity?.startDate ?? ''}
        endDate={selectedActivity?.endDate ?? ''}
        location={selectedActivity?.location ?? event.localizacao ?? ''}
        hours={Number(selectedActivity?.workload) ?? event.cargaHoraria ?? 0}
        participantsCount={0}
        status={selectedActivity?.status ?? ''}
        description={selectedActivity?.description ?? ''}
        variant={activityModalVariant}
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
            activityTitle: selectedActivity.name,
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
    </AppPageContainer>
  );
}