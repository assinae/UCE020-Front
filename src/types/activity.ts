export type ActivityModalVariant = 'signup' | 'manage' | 'monitor' | 'organizer';
export type DateLike = string | Date;
export type AsyncVoidHandler = () => void | Promise<void>;

export interface ActivityModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  image?: string;
  startDate: DateLike;
  endDate?: DateLike;
  location: string;
  hours: number;
  participantsCount: number;
  status: string;
  description: string;
  variant: ActivityModalVariant;
  onSignup?: AsyncVoidHandler;
  onCancelParticipation?: AsyncVoidHandler;
  onMarkPresence?: AsyncVoidHandler;
  onValidatePresences?: AsyncVoidHandler;
  onListParticipants?: AsyncVoidHandler;
  isLoading?: boolean;
}

export interface ActivityDetailProps {
  title: string;
  location: string;
  date: DateLike;
}

export type Activity = {
  id: string;
  name: string;
  category: string;
  location: string;
  workload: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: string;
  guests?: ActivityGuest[];
  createdAt?: string;
  updatedAt?: string;
}

export type ActivityGuest = {
  name: string;
  email: string;
  role: string;
};
