'use client';

import { Typography } from '@mui/material';
import { AppPageContainer } from '@/components/layout/AppPageContainer';

export function PresenceContextMissing() {
  return (
    <AppPageContainer
      sx={{
        borderRadius: '28px',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>
        Atividade não especificada
      </Typography>
      <Typography sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
        Acesse o <strong>Evento</strong>, selecione a <strong>Atividade</strong> correspondente
        <br />e clique em <strong>Validar presenças</strong> ou <strong>Listar participantes</strong>
      </Typography>
    </AppPageContainer>
  );
}
