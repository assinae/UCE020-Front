'use client';

import { Box } from '@mui/material';
import { Button } from '@/components/ui';

interface EventSubscriptionActionProps {
  isSubscribed: boolean;
  isLoading: boolean;
  onSubscribe: () => void;
  onUnsubscribe: () => void;
}

const actionButtonSx = {
  height: 36,
  fontSize: 'clamp(10px, 3vw, 12px)',
  fontWeight: 700,
} as const;

export function EventSubscriptionAction({
  isSubscribed,
  isLoading,
  onSubscribe,
  onUnsubscribe,
}: EventSubscriptionActionProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      {isSubscribed ? (
        <Button
          variant="outlined"
          color="secondary"
          onClick={onUnsubscribe}
          disabled={isLoading}
          fullWidth
          sx={{ ...actionButtonSx, maxWidth: 220 }}
        >
          Cancelar inscrição
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={onSubscribe}
          disabled={isLoading}
          fullWidth
          sx={{ ...actionButtonSx, maxWidth: 220 }}
        >
          Inscrever-se no evento
        </Button>
      )}
    </Box>
  );
}