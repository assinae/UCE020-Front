'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import { ParticipantQrCodeModal } from '@/features/participants/presence';
import { buildListParticipantsPath } from '@/features/participants/presence/utils/routes';
import { useAuth } from '@/providers/auth-provider';
import type { Activity } from '@/types/activity';
import type { EventProgress } from '@/types/participant';
import { APP_TIMEZONE, formatBahiaDate, getBahiaDateKey, getBahiaTimeInput } from '@/utils/date';
import type { useFeaturedEvent } from '../hooks/useFeaturedEvent';
import {
  FeaturedEventCard,
  type FeaturedAction,
  type FeaturedActivity,
  type FeaturedProgress,
} from './FeaturedEventCard';

const ROLE_LABELS: Record<EventProgress['tipo'], string> = {
  participante: 'Participante',
  monitor: 'Monitor',
  organizador: 'Organizador',
};

const DAY_MS = 24 * 60 * 60 * 1000;

function shortDate(value: string): string {
  return formatBahiaDate(value).slice(0, 5);
}

function formatHour(value: string): string {
  const [hour, minute] = getBahiaTimeInput(value).split(':');
  return minute === '00' ? `${hour}h` : `${hour}h${minute}`;
}

const WEEKDAY_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  timeZone: APP_TIMEZONE,
  weekday: 'short',
});

function dayLabel(value: string, now: number, isLive: boolean): string {
  if (isLive) return 'agora';
  const key = getBahiaDateKey(value);
  if (key === getBahiaDateKey(new Date(now))) return 'hoje';
  if (key === getBahiaDateKey(new Date(now + DAY_MS))) return 'amanhã';
  if (new Date(value).getTime() - now < 6 * DAY_MS) {
    return WEEKDAY_FORMAT.format(new Date(value)).replace('.', '');
  }
  return shortDate(value);
}

function toProgress(progress: EventProgress | undefined): FeaturedProgress | null {
  if (!progress) return null;

  if (progress.tipo === 'organizador') {
    if (progress.totalAtividades === 0) return null;
    return {
      label: 'Atividades concluídas',
      value: String(progress.atividadesConcluidas),
      total: `de ${progress.totalAtividades} ${progress.totalAtividades === 1 ? 'atividade' : 'atividades'}`,
      percent: Math.round((progress.atividadesConcluidas / progress.totalAtividades) * 100),
    };
  }

  if (progress.cargaHorariaTotal === 0) return null;
  return {
    label: 'Carga horária',
    value: `${progress.cargaHorariaCumprida}h`,
    total: `de ${progress.cargaHorariaTotal}h`,
    percent: Math.min(
      100,
      Math.round((progress.cargaHorariaCumprida / progress.cargaHorariaTotal) * 100)
    ),
  };
}

function toActivity(activity: Activity, isLive: boolean, now: number): FeaturedActivity {
  return {
    kicker: isLive ? 'Acontecendo agora' : 'Próxima atividade',
    name: activity.name,
    location: activity.location,
    time: formatHour(activity.startDate),
    day: dayLabel(activity.startDate, now, isLive),
  };
}

interface FeaturedEventProps {
  featured: ReturnType<typeof useFeaturedEvent>;
  defaultOpen: boolean;
}

export function FeaturedEvent({ featured, defaultOpen }: FeaturedEventProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isQrOpen, setIsQrOpen] = useState(false);
  const { event, isEventLive, activity, isActivityLive, progress, now } = featured;

  if (!event) return null;

  const tipo = progress?.tipo ?? event.tipoParticipacao;
  const eventId = String(event.id);

  // O detalhe do evento só exige login, então todo membro listado na home pode abri-lo.
  const viewEvent: FeaturedAction = {
    label: 'Ver evento',
    icon: <CalendarMonthRoundedIcon />,
    onClick: () => router.push(`/event/${eventId}`),
  };
  let action = viewEvent;

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

  return (
    <>
      <FeaturedEventCard
        key={event.id}
        title={event.nome}
        subtitle={[
          `${shortDate(event.dataInicio)} a ${shortDate(event.dataFim)}`,
          event.localizacao,
        ]
          .filter(Boolean)
          .join(' · ')}
        statusLabel={isEventLive ? 'Iniciado' : 'Em breve'}
        isLive={isEventLive}
        roleLabel={tipo ? ROLE_LABELS[tipo] : null}
        progress={toProgress(progress)}
        activity={activity ? toActivity(activity, isActivityLive, now) : null}
        action={action}
        secondaryAction={action === viewEvent ? undefined : viewEvent}
        defaultOpen={defaultOpen}
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
