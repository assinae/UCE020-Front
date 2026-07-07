import { ConfirmModal } from '@/components/modals/confirm-modal';
import { getRemovePresenceMessage } from '@/features/participants/presence/utils/presenceMessages';

interface RemovePresenceModalProps {
  open: boolean;
  participantName: string | null;
  activityTitle: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
}

export function RemovePresenceModal({
  open,
  participantName,
  activityTitle,
  onClose,
  onConfirm,
}: RemovePresenceModalProps) {
  if (!participantName) return null;

  const messages = getRemovePresenceMessage(participantName, activityTitle);

  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      message={messages.message}
      emphasisEndText={messages.emphasisEndText}
      confirmText="Confirmar"
      cancelText="Cancelar"
      onConfirm={onConfirm}
      type="warning"
    />
  );
}
