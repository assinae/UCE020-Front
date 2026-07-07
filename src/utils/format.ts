function parseDateValue(date?: Date | string): Date | null {
  if (!date) return null;

  if (date instanceof Date) {
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const value = date.trim();
  if (!value) return null;

  const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    const parsed = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDate(date: Date | string): string {
  const d = parseDateValue(date);
  if (!d) return 'Data indisponível';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = parseDateValue(date);
  if (!d) return 'Data indisponível';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
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
  const d = parseDateValue(date);
  if (!d) return 'Horário indisponível';

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
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

  const startDay = start.getUTCDate();
  const startMonth = start.getUTCMonth();
  const startYear = start.getUTCFullYear();
  const startMonthLabel = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    timeZone: 'UTC',
  }).format(start);

  const end = parseDateValue(endDate);
  if (!end) return `${startDay} de ${startMonthLabel} de ${startYear}`;

  const endDay = end.getUTCDate();
  const endMonth = end.getUTCMonth();
  const endYear = end.getUTCFullYear();

  if (startDay === endDay && startMonth === endMonth && startYear === endYear) {
    return `${startDay} de ${startMonthLabel} de ${startYear}`;
  }

  if (startMonth === endMonth && startYear === endYear) {
    return `${startDay} a ${endDay} de ${startMonthLabel} de ${startYear}`;
  }

  const endMonthLabel = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    timeZone: 'UTC',
  }).format(end);

  return `${startDay} de ${startMonthLabel} de ${startYear} a ${endDay} de ${endMonthLabel} de ${endYear}`;
}
