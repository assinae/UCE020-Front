'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import {
  EventTicket,
  PARTICIPATION_LABELS,
  getEventStatusStyle,
  type TicketAction,
} from '@/components/event';
import { ParticipantQrCodeModal } from '@/features/participants/presence';
import { buildListParticipantsPath } from '@/features/participants/presence/utils/routes';
import { useAuth } from '@/providers/auth-provider';
import type { Event } from '@/types/event';
import { useEventHighlight } from '../hooks/useEventHighlight';
import {
  ticketDate,
  ticketMeta,
  toTicketActivity,
  toTicketProgress,
} from '../utils/eventTicketFormat';

interface EventTicketCardProps {
  event: Event;
  variant?: 'featured' | 'compact';
  defaultExpanded?: boolean;
}

export function EventTicketCard({
  event,
  variant = 'compact',
  defaultExpanded = false,
}: EventTicketCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const featured = variant === 'featured';

  // O destaque já chega carregado; os demais só buscam detalhes ao abrir.
  const highlight = useEventHighlight(event, featured || expanded);
  const { activity, isActivityLive, isEventLive, progress, now } = highlight;

  const tipo = progress?.tipo ?? event.tipoParticipacao;
  const eventId = String(event.id);
  const openEvent = () => router.push(`/event/${eventId}`);

  let action: TicketAction = {
    label: 'Ver evento',
    icon: <CalendarMonthRoundedIcon />,
    onClick: openEvent,
  };
  if (activity && isActivityLive && tipo === 'participante') {
    action = {
      label: 'Marcar presença',
      icon: <QrCode2RoundedIcon />,
      onClick: () => setIsQrOpen(true),
    };
  } else if (activity && isActivityLive && (tipo === 'monitor' || tipo === 'organizador')) {
    action = {
      label: 'Validar presenças',
      icon: <QrCode2RoundedIcon />,
      onClick: () => router.push(buildListParticipantsPath(eventId, String(activity.id))),
    };
  } else if (activity) {
    action = {
      label: 'Ver atividade',
      icon: <ScheduleRoundedIcon />,
      onClick: () => router.push(`/event/${eventId}?atividade=${activity.id}`),
    };
  }

  // O status gravado só muda ao finalizar; no destaque, o andamento vem das datas.
  const status = featured
    ? { ...getEventStatusStyle(event.status), label: isEventLive ? 'Em andamento' : 'Em breve' }
    : getEventStatusStyle(event.status);

  return (
    <>
      <EventTicket
        variant={variant}
        title={event.nome}
        roleLabel={tipo ? PARTICIPATION_LABELS[tipo] : 'Evento'}
        status={status}
        isLive={isEventLive}
        date={ticketDate(event)}
        place={event.localizacao || 'Local a definir'}
        meta={ticketMeta(event)}
        code={event.codigo || undefined}
        expanded={expanded}
        onToggle={() => setExpanded((open) => !open)}
        onOpen={openEvent}
        loading={highlight.isLoading}
        progress={toTicketProgress(progress)}
        activity={activity ? toTicketActivity(activity, isActivityLive, now) : null}
        action={action}
      />

      {activity && user && (
        <ParticipantQrCodeModal
          open={isQrOpen}
          onClose={() => setIsQrOpen(false)}
          payload={{
            participantId: String(user.id),
            participantName: user.name,
            activityId: String(activity.id),
            activityTitle: activity.name,
            eventId,
          }}
        />
      )}
    </>
  );
}
