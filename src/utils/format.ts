import { APP_TIMEZONE, formatBahiaDate, formatBahiaDateTime, formatBahiaTime } from './date';

function parseDateValue(date?: Date | string): Date | null {
  if (!date) return null;

  if (date instanceof Date) {
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const value = date.trim();
  if (!value) return null;

  const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) return null;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDate(date: Date | string): string {
  return formatBahiaDate(date);
}

export function formatDateTime(date: Date | string): string {
  return formatBahiaDateTime(date);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatTime(date: Date | string): string {
  return formatBahiaTime(date);
}

export function formatActivitySchedule(startDate: Date | string, endDate: Date | string) {
  return {
    dayMonth: formatDate(startDate),
    timeRange: `${formatTime(startDate)} - ${formatTime(endDate)}`,
  };
}

export function formatActivityDate(startDate: Date | string, endDate?: Date | string): string {
  const start = parseDateValue(startDate);
  if (!start) return 'Data não informada';

  const startLabel = new Intl.DateTimeFormat('pt-BR', {
    timeZone: APP_TIMEZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(start);
  const end = endDate ? parseDateValue(endDate) : null;
  if (!end) return startLabel;

  const endLabel = new Intl.DateTimeFormat('pt-BR', {
    timeZone: APP_TIMEZONE,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(end);

  return startLabel === endLabel ? startLabel : `${startLabel} a ${endLabel}`;
}
