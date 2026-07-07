import type { SelectOption } from './inputs';

export interface RegisterGuestModalProps {
  open: boolean;
  onClose: () => void;
  activityTitle: string;
  activityDate: string | Date;
  activityLocation: string;
  roleOptions: ReadonlyArray<SelectOption>;
  onSubmit: (payload: RegisterGuestPayload) => void | Promise<void>;
  isLoading?: boolean;
  initialValues?: RegisterGuestPayload;
}

export interface RegisterGuestPayload {
  fullName: string;
  role: string;
  email: string;
}

export interface FieldErrors {
  fullName?: string;
  role?: string;
  email?: string;
}
