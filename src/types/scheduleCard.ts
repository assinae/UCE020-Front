import type { ActivityGuest, DateLike } from './activity';

export interface ScheduleCardProps {
  title: string;
  image?: string;
  startDate: DateLike;
  endDate?: DateLike;
  location: string;
  hours: number;
  participantsCount: number;
  status: string;
  description: string;
  /** Convidados da atividade (palestrante/ministrante/moderador). */
  guests?: ActivityGuest[];
}

export interface ScheduleImageProps {
  title: string;
  image?: string;
}

export interface ScheduleDetailsProps {
  startDate: DateLike;
  endDate?: DateLike;
  location: string;
  hours: number;
  participantsCount: number;
  status: string;
  /** Quando não há imagem, os detalhes ocupam a largura total. */
  fullWidth?: boolean;
}

export interface ScheduleDescriptionProps {
  description: string;
}

export interface ScheduleGuestsProps {
  guests?: ActivityGuest[];
}
