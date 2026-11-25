import {
  CATEGORY_OPTIONS,
  GUEST_ROLE_OPTIONS,
} from '@/features/activities/utils/activityFormRules';
import type { PublicEventActivity, PublicEventGuest } from '@/types/event';
import { APP_TIMEZONE, formatBahiaTime, getBahiaDateKey } from '@/utils/date';

export type ActivityTiming = 'now' | 'next' | 'past' | 'upcoming';

export interface ScheduleDay {
  key: string;
  weekday: string;
  day: string;
  month: string;
  label: string;
  activities: PublicEventActivity[];
}

function formatInBahia(value: string, options: Intl.DateTimeFormatOptions): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR', { timeZone: APP_TIMEZONE, ...options }).format(date);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function stripDot(value: string) {
  return value.replace('.', '');
}

export function formatEventPeriod(start: string, end: string): string {
  const startKey = getBahiaDateKey(start);
  const endKey = getBahiaDateKey(end);
  const longDate: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

  if (!end || startKey === endKey) return formatInBahia(start, longDate);

  const sameYear = startKey.slice(0, 4) === endKey.slice(0, 4);
  const sameMonth = sameYear && startKey.slice(0, 7) === endKey.slice(0, 7);

  if (sameMonth) {
    return `${formatInBahia(start, { day: 'numeric' })} a ${formatInBahia(end, longDate)}`;
  }
  if (sameYear) {
    return `${formatInBahia(start, { day: 'numeric', month: 'long' })} a ${formatInBahia(end, longDate)}`;
  }
  return `${formatInBahia(start, longDate)} a ${formatInBahia(end, longDate)}`;
}

export function formatTimeRange(start: string, end: string): string {
  const startTime = formatBahiaTime(start);
  if (!end) return startTime;
  return `${startTime} – ${formatBahiaTime(end)}`;
}

export function getCategoryLabel(category: string): string {
  return CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? 'Atividade';
}

export function getGuestRoleLabel(role: string): string {
  return GUEST_ROLE_OPTIONS.find((option) => option.value === role)?.label ?? '';
}

export function formatGuests(guests: PublicEventGuest[] = []): string {
  return guests
    .map((guest) => {
      const role = getGuestRoleLabel(guest.role);
      return role ? `${guest.name} (${role})` : guest.name;
    })
    .join(', ');
}

export function formatHours(hours: number | null | undefined): string | null {
  if (!hours) return null;
  return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
}

export function groupActivitiesByDay(activities: PublicEventActivity[]): ScheduleDay[] {
  const days = new Map<string, ScheduleDay>();

  const sorted = [...activities].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  for (const activity of sorted) {
    const key = getBahiaDateKey(activity.startDate);
    const existing = days.get(key);
    if (existing) {
      existing.activities.push(activity);
      continue;
    }

    days.set(key, {
      key,
      weekday: stripDot(formatInBahia(activity.startDate, { weekday: 'short' })),
      day: formatInBahia(activity.startDate, { day: '2-digit' }),
      month: stripDot(formatInBahia(activity.startDate, { month: 'short' })),
      label: capitalize(
        formatInBahia(activity.startDate, { weekday: 'long', day: 'numeric', month: 'long' })
      ),
      activities: [activity],
    });
  }

  return [...days.values()];
}

export function getActivityTimings(
  activities: PublicEventActivity[],
  now: number
): Map<number, ActivityTiming> {
  const timings = new Map<number, ActivityTiming>();
  let nextAssigned = false;

  const sorted = [...activities].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  for (const activity of sorted) {
    const start = new Date(activity.startDate).getTime();
    const end = new Date(activity.endDate || activity.startDate).getTime();

    if (start <= now && now <= end) {
      timings.set(activity.id, 'now');
    } else if (end < now) {
      timings.set(activity.id, 'past');
    } else if (!nextAssigned) {
      timings.set(activity.id, 'next');
      nextAssigned = true;
    } else {
      timings.set(activity.id, 'upcoming');
    }
  }

  return timings;
}

export type EventPhase = 'upcoming' | 'live' | 'ended';

const DAY_MS = 24 * 60 * 60 * 1000;

export function getEventPhase(status: string, start: string, end: string, now: number): EventPhase {
  if (status === 'finalizada') return 'ended';
  const startMs = new Date(start).getTime();
  const endMs = new Date(end || start).getTime();
  if (now > endMs) return 'ended';
  if (now >= startMs || status === 'andamento' || status === 'iniciada') return 'live';
  return 'upcoming';
}

export function describeEventPhase(phase: EventPhase, start: string, now: number): string {
  if (phase === 'live') return 'Acontecendo agora';
  if (phase === 'ended') return 'Evento encerrado';

  const startKey = getBahiaDateKey(start);
  const todayKey = getBahiaDateKey(new Date(now));
  const days = Math.round(
    (new Date(`${startKey}T12:00:00-03:00`).getTime() -
      new Date(`${todayKey}T12:00:00-03:00`).getTime()) /
      DAY_MS
  );

  if (days <= 0) return 'Começa hoje';
  if (days === 1) return 'Começa amanhã';
  return `Começa em ${days} dias`;
}

function toIcsDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new RangeError('Data inválida para o calendário.');
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

function escapeIcs(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/([,;])/g, '\\$1');
}

export function buildCalendarFile(event: {
  codigo: string | null;
  nome: string;
  descricao: string | null;
  localizacao: string | null;
  dataInicio: string;
  dataFim: string;
  url: string;
}): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Assinae//Evento//PT-BR',
    'BEGIN:VEVENT',
    `UID:${escapeIcs(event.codigo ?? event.nome)}@assinae`,
    `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
    `DTSTART:${toIcsDate(event.dataInicio)}`,
    `DTEND:${toIcsDate(event.dataFim || event.dataInicio)}`,
    `SUMMARY:${escapeIcs(event.nome)}`,
    event.localizacao ? `LOCATION:${escapeIcs(event.localizacao)}` : '',
    `DESCRIPTION:${escapeIcs(`${event.descricao ?? ''}\n\n${event.url}`.trim())}`,
    `URL:${event.url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.filter(Boolean).join('\r\n');
}
