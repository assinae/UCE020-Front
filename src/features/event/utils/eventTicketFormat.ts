import type { TicketActivity, TicketProgress } from '@/components/event';
import type { Activity } from '@/types/activity';
import type { Event } from '@/types/event';
import type { EventProgress } from '@/types/participant';
import { APP_TIMEZONE, formatBahiaDate, getBahiaDateKey, getBahiaTimeInput } from '@/utils/date';

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const DAY_MS = 24 * 60 * 60 * 1000;

const WEEKDAY_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  timeZone: APP_TIMEZONE,
  weekday: 'short',
});

function dateParts(value: string) {
  const [day = '', month = ''] = formatBahiaDate(value).split('/');
  return { day, month, monthLabel: MONTHS[Number(month) - 1] ?? '' };
}

export function ticketDate(event: Event) {
  const { day, monthLabel } = dateParts(event.dataInicio);
  return { day, month: monthLabel };
}

export function ticketMeta(event: Event): string {
  const start = dateParts(event.dataInicio);
  const end = dateParts(event.dataFim);
  const hours = `${event.cargaHoraria}h de carga horária`;
  const sameDay = start.day === end.day && start.month === end.month;
  return sameDay ? hours : `até ${end.day}/${end.month} · ${hours}`;
}

function formatHour(value: string): string {
  const [hour, minute] = getBahiaTimeInput(value).split(':');
  return minute === '00' ? `${hour}h` : `${hour}h${minute}`;
}

function dayLabel(value: string, now: number, isLive: boolean): string {
  if (isLive) return 'agora';
  const key = getBahiaDateKey(value);
  if (key === getBahiaDateKey(new Date(now))) return 'hoje';
  if (key === getBahiaDateKey(new Date(now + DAY_MS))) return 'amanhã';
  if (new Date(value).getTime() - now < 6 * DAY_MS) {
    return WEEKDAY_FORMAT.format(new Date(value)).replace('.', '');
  }
  return formatBahiaDate(value).slice(0, 5);
}

export function toTicketProgress(progress: EventProgress | undefined): TicketProgress | null {
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

export function toTicketActivity(activity: Activity, isLive: boolean, now: number): TicketActivity {
  return {
    kicker: isLive ? 'Acontecendo agora' : 'Próxima atividade',
    name: activity.name,
    location: activity.location,
    time: formatHour(activity.startDate),
    day: dayLabel(activity.startDate, now, isLive),
  };
}
