import type { AsyncVoidHandler } from './activity';

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
  emphasisEndText?: string;
  confirmText: string;
  cancelText: string;
  onConfirm: AsyncVoidHandler;
  confirmDisabled?: boolean;
  isLoading?: boolean;
  type?: 'default' | 'error' | 'warning' | 'success';
}
