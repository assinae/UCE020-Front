'use client';

import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { Button } from '@/components/ui';

const actionButtonSx = {
  height: 36,
  fontSize: 'clamp(10px, 3vw, 12px)',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  flex: 1
} as const;

export function OrganizerEventActions({ eventId }: { eventId: number }) {
  const router = useRouter();

  function onManageMembers() {
    router.push(`/event/${eventId}/manage-users`);
  }

  function onEditEvent() {
    router.push(`/event/${eventId}/edit`);
  }

  function onFinalizeEvent() {
    console.log('Finalizar evento');
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 2 }}>
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={onManageMembers}
        sx={{ ...actionButtonSx }}
      >
        Gerenciar Membros
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        onClick={onEditEvent}
        sx={{ ...actionButtonSx }}
      >
        Editar
      </Button>
      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={onFinalizeEvent}
        sx={{ ...actionButtonSx }}
      >
        Finalizar
      </Button>
    </Box>
  );
}
