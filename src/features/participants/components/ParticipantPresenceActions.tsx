import { IconButton } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import { colorTokens } from '@/lib/colors';
import { managementIconButtonSx } from '@/features/management/components/listRowStyles';
import type { Participant } from '@/types/participant';

interface ParticipantPresenceActionsProps {
  participant: Participant;
  canValidatePresence: boolean;
  canEditPresence: boolean;
  onValidatePresence: () => void;
  onRemovePresence: (participantId: string) => void;
}

export function ParticipantPresenceActions({
  participant,
  canValidatePresence,
  canEditPresence,
  onValidatePresence,
  onRemovePresence,
}: ParticipantPresenceActionsProps) {
  const isConfirmed = participant.presenceStatus === 'confirmed';
  const isPending = participant.presenceStatus === 'pending';

  return (
    <>
      {canValidatePresence && isPending && (
        <IconButton
          onClick={onValidatePresence}
          aria-label={`Validar presença de ${participant.name}`}
          sx={managementIconButtonSx}
        >
          <QrCode2RoundedIcon sx={{ fontSize: 20, color: colorTokens.navigation.default }} />
        </IconButton>
      )}

      {canEditPresence && isConfirmed && (
        <IconButton
          onClick={() => onRemovePresence(participant.id)}
          aria-label={`Remover presença de ${participant.name}`}
          sx={managementIconButtonSx}
        >
          <EditOutlinedIcon sx={{ fontSize: 20, color: colorTokens.navigation.default }} />
        </IconButton>
      )}
    </>
  );
}
