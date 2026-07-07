import type { DateLike } from './activity';

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
}

export interface ScheduleDescriptionProps {
  description: string;
}
