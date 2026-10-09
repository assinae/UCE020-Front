import { colorTokens } from '@/lib/colors';
import type { Event } from '@/types/event';

export interface EventStatusStyle {
  bg: string;
  color: string;
  label: string;
}

const STATUS_STYLES: Record<string, EventStatusStyle> = {
  pendente: {
    bg: colorTokens.presence.pendingBg,
    color: colorTokens.presence.pendingText,
    label: 'Pendente',
  },
  iniciada: {
    bg: colorTokens.presence.confirmedBg,
    color: colorTokens.text.mint,
    label: 'Iniciado',
  },
  andamento: {
    bg: colorTokens.role.organizerBg,
    color: colorTokens.role.organizerText,
    label: 'Andamento',
  },
  finalizada: { bg: '#EAF7EE', color: '#35A384', label: 'Finalizado' },
};

export function getEventStatusStyle(status: string | undefined): EventStatusStyle {
  const key = (status || '').toLowerCase();
  return (
    STATUS_STYLES[key] ?? {
      bg: colorTokens.presence.pendingBg,
      color: colorTokens.presence.pendingText,
      label: status ?? '',
    }
  );
}

export const PARTICIPATION_LABELS: Record<NonNullable<Event['tipoParticipacao']>, string> = {
  participante: 'Participante',
  monitor: 'Monitor',
  organizador: 'Organizador',
};
