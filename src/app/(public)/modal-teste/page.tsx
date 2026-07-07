'use client';

import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { ActivityModal } from '@/components/modals';

export default function ModalTestePage() {
  const [open, setOpen] = useState(true);

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Box sx={{ display: 'grid', gap: 2, justifyItems: 'center', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 800 }}>
          Teste do modal de inscrição
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>
          Abrir modal
        </Button>
      </Box>

      <ActivityModal
        open={open}
        onClose={() => setOpen(false)}
        title="Evento teste"
        image="/logo.svg"
        startDate="2026-12-07T00:00:00.000Z"
        endDate="data-invalida"
        location="uefs"
        hours={9}
        participantsCount={0}
        status="pendente"
        description="esse evento é um teste"
        variant="signup"
        onSignup={() => setOpen(false)}
      />
    </Box>
  );
}
