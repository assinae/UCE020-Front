'use client';

import { Box, Button, CircularProgress } from '@mui/material';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { colorTokens } from '@/lib/colors';

interface EventSubscriptionActionProps {
  isSubscribed: boolean;
  isLoading: boolean;
  isFinalized?: boolean;
  onSubscribe: () => void;
  onUnsubscribe: () => void;
}

export const primaryPillSx = {
  width: '100%',
  minHeight: 52,
  px: 3,
  borderRadius: 99,
  fontSize: 15,
  fontWeight: 700,
  textTransform: 'none',
  letterSpacing: 0,
  gap: 1,
} as const;

export function EventSubscriptionAction({
  isSubscribed,
  isLoading,
  isFinalized = false,
  onSubscribe,
  onUnsubscribe,
}: EventSubscriptionActionProps) {
  // Evento finalizado: não há mais inscrição nem cancelamento. Mostra o aviso
  // em vez de um botão desativado.
  if (isFinalized) {
    return (
      <Box
        role="status"
        sx={{
          ...primaryPillSx,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: colorTokens.surface.hover,
          color: colorTokens.text.muted,
          fontSize: 14,
        }}
      >
        <LockRoundedIcon sx={{ fontSize: 18 }} />
        Inscrições encerradas
      </Box>
    );
  }

  if (isSubscribed) {
    return (
      <Button
        variant="outlined"
        onClick={onUnsubscribe}
        disabled={isLoading}
        sx={{
          ...primaryPillSx,
          color: colorTokens.status.error,
          borderColor: 'rgba(178, 44, 41, 0.35)',
          borderWidth: 1.5,
          bgcolor: '#FFFFFF',
          '&:hover': {
            color: colorTokens.status.error,
            borderColor: colorTokens.status.error,
            bgcolor: colorTokens.surface.dangerSubtle,
          },
        }}
      >
        {isLoading ? <CircularProgress size={18} color="inherit" /> : null}
        Cancelar inscrição
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      disableElevation
      onClick={onSubscribe}
      disabled={isLoading}
      sx={{
        ...primaryPillSx,
        color: '#FFFFFF',
        background: `linear-gradient(135deg, ${colorTokens.brand.secondaryLight} 0%, ${colorTokens.brand.secondary} 100%)`,
        boxShadow: '0 8px 20px rgba(0, 137, 99, 0.28)',
        '&:hover': {
          color: '#FFFFFF',
          background: colorTokens.brand.secondaryDark,
          boxShadow: '0 10px 26px rgba(0, 137, 99, 0.34)',
        },
        '&.Mui-disabled': { color: '#FFFFFF', opacity: 0.6 },
      }}
    >
      {isLoading ? <CircularProgress size={18} color="inherit" /> : null}
      Inscrever-se no evento
    </Button>
  );
}
