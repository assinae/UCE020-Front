import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import {
  managementListNameSx,
  managementListRowSx,
} from '@/features/management/components/listRowStyles';
import type { Participant } from '@/types/participant';
import { PresenceStatusIcon } from './PresenceStatusIcon';

interface ParticipantRowProps {
  participant: Participant;
  actions?: ReactNode;
}

export function ParticipantRow({ participant, actions }: ParticipantRowProps) {
  return (
    <Box sx={managementListRowSx}>
      <Typography sx={managementListNameSx}>{participant.name}</Typography>
      {actions}
      <PresenceStatusIcon status={participant.presenceStatus} />
    </Box>
  );
}
