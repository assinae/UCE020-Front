import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import {
  DataRow,
  RowActionsMenu,
  RowIdentity,
  StatusPill,
  type GridColumns,
} from '@/components/data-list';
import { colorTokens } from '@/lib/colors';
import type { Participant } from '@/types/participant';

interface ParticipantTableRowProps {
  participant: Participant;
  gridColumns: GridColumns;
  showActions: boolean;
  canMutate: boolean;
  onValidate: () => void;
  onRemove: (participantId: string) => void;
}

export function ParticipantTableRow({
  participant,
  gridColumns,
  showActions,
  canMutate,
  onValidate,
  onRemove,
}: ParticipantTableRowProps) {
  const confirmed = participant.presenceStatus === 'confirmed';

  return (
    <DataRow gridColumns={gridColumns}>
      <RowIdentity
        name={participant.name}
        email={participant.email}
        avatarBg={confirmed ? colorTokens.surface.mint : colorTokens.presence.pendingBg}
        avatarColor={confirmed ? colorTokens.brand.secondary : colorTokens.text.label}
        mobileBadge={{
          bg: confirmed ? colorTokens.brand.secondary : colorTokens.presence.pendingBadge,
          icon: confirmed ? <CheckRoundedIcon /> : <AccessTimeRoundedIcon />,
        }}
        mobileStatus={{
          label: confirmed ? 'Presença confirmada' : 'Não marcou',
          color: confirmed ? colorTokens.brand.secondary : colorTokens.presence.pendingText,
        }}
      />

      <StatusPill
        label={confirmed ? 'Marcou' : 'Não marcou'}
        bg={confirmed ? colorTokens.presence.confirmedBg : colorTokens.presence.pendingBg}
        color={confirmed ? colorTokens.text.mint : colorTokens.presence.pendingText}
      />

      {showActions && (
        <RowActionsMenu
          ariaLabel={`Ações de ${participant.name}`}
          actions={[
            {
              label: 'Validar presença',
              icon: <QrCode2RoundedIcon />,
              tone: 'primary',
              disabled: !canMutate || confirmed,
              onClick: onValidate,
            },
            {
              label: 'Remover presença',
              icon: <DeleteOutlineRoundedIcon />,
              tone: 'danger',
              disabled: !canMutate || !confirmed,
              onClick: () => onRemove(participant.id),
            },
          ]}
        />
      )}
    </DataRow>
  );
}
