import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import {
  DataRow,
  RowActionsMenu,
  RowIdentity,
  StatusPill,
  type GridColumns,
} from '@/components/data-list';
import { colorTokens } from '@/lib/colors';
import type { ManagedUser, StaffRole } from '@/types/management';

const ROLE_STYLES: Record<
  StaffRole,
  { bg: string; color: string; avatarColor: string; badgeBg: string; badgeIcon: ReactNode }
> = {
  Organizador: {
    bg: colorTokens.role.organizerBg,
    color: colorTokens.role.organizerText,
    avatarColor: colorTokens.role.organizerText,
    badgeBg: colorTokens.navigation.default,
    badgeIcon: <StarRoundedIcon />,
  },
  Monitor: {
    bg: colorTokens.presence.confirmedBg,
    color: colorTokens.text.mint,
    avatarColor: colorTokens.brand.secondary,
    badgeBg: colorTokens.brand.secondary,
    badgeIcon: <QrCode2RoundedIcon />,
  },
  Participante: {
    bg: colorTokens.presence.pendingBg,
    color: colorTokens.presence.pendingText,
    avatarColor: colorTokens.text.label,
    badgeBg: colorTokens.presence.pendingBadge,
    badgeIcon: <PersonRoundedIcon />,
  },
};

interface MemberTableRowProps {
  member: ManagedUser;
  gridColumns: GridColumns;
  showActions: boolean;
  /** O próprio usuário não pode alterar o papel nem se remover. */
  canManage: boolean;
  onEditRole: (memberId: string) => void;
  onRemove: (memberId: string) => void;
}

export function MemberTableRow({
  member,
  gridColumns,
  showActions,
  canManage,
  onEditRole,
  onRemove,
}: MemberTableRowProps) {
  const style = ROLE_STYLES[member.role];

  return (
    <DataRow gridColumns={gridColumns}>
      <RowIdentity
        name={member.name}
        email={member.email}
        avatarBg={style.bg}
        avatarColor={style.avatarColor}
        mobileBadge={{ bg: style.badgeBg, icon: style.badgeIcon }}
        mobileStatus={{ label: member.role, color: style.color }}
      />

      <StatusPill label={member.role} bg={style.bg} color={style.color} />

      {showActions &&
        (canManage ? (
          <RowActionsMenu
            ariaLabel={`Ações de ${member.name}`}
            actions={[
              {
                label: 'Alterar papel',
                icon: <EditRoundedIcon />,
                tone: 'primary',
                onClick: () => onEditRole(member.id),
              },
              {
                label: 'Remover do evento',
                icon: <DeleteOutlineRoundedIcon />,
                tone: 'danger',
                onClick: () => onRemove(member.id),
              },
            ]}
          />
        ) : (
          <Box
            component="span"
            sx={{
              justifySelf: 'end',
              fontSize: 12,
              fontWeight: 700,
              color: colorTokens.text.label,
            }}
          >
            Você
          </Box>
        ))}
    </DataRow>
  );
}
