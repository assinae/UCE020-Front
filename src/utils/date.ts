export const APP_TIMEZONE = 'America/Bahia';

type DatePart = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';

function getDateParts(value: Date | string): Partial<Record<DatePart, string>> {
  const date = value instanceof Date ? value : parseDate(value);
  if (Number.isNaN(date.getTime())) return {};

  return Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: APP_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(date)
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value: partValue }) => [type, partValue]),
  ) as Partial<Record<DatePart, string>>;
}

function parseDate(value: string): Date {
  return /^\d{4}-\d{2}-\d{2}$/.test(value.trim())
    ? new Date(`${value}T12:00:00-03:00`)
    : new Date(value);
}

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : parseDate(value);
}

export function formatBahiaDateTime(value: Date | string): string {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return 'Data indisponível';

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: APP_TIMEZONE,
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

export function formatBahiaDate(value: Date | string): string {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return 'Data indisponível';

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: APP_TIMEZONE,
    dateStyle: 'short',
  }).format(date);
}

export function formatBahiaTime(value: Date | string): string {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return 'Horário indisponível';

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: APP_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatBahiaYear(value: Date | string | Date = new Date()): string {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: APP_TIMEZONE,
    year: 'numeric',
  }).format(date);
}

export function getBahiaDateInput(value: Date | string): string {
  const parts = getDateParts(value);
  if (!parts.year || !parts.month || !parts.day) return '';
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function getBahiaTimeInput(value: Date | string): string {
  const parts = getDateParts(value);
  if (!parts.hour || !parts.minute) return '';
  return `${parts.hour}:${parts.minute}`;
}

export function toBahiaIso(date: string, time: string): string {
  if (!date || !time) return '';

  const isValidDateTime = !Number.isNaN(new Date(`${date}T${time}:00-03:00`).getTime());
  return isValidDateTime ? `${date}T${time}:00-03:00` : '';
}

export function getBahiaDateKey(value: Date | string = new Date()): string {
  return getBahiaDateInput(value);
}
