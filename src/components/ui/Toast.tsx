'use client';

import { Snackbar, Alert } from '@mui/material';
import { ToastProps, ToastSeverity } from '@/types/toast';

export function Toast({
  open,
  message,
  severity = ToastSeverity.Error,
  duration = 3500,
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
  onClose,
}: ToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      // Nas telas logadas a barra inferior do celular cobriria o aviso; a variável vale 0 fora delas.
      sx={
        anchorOrigin.vertical === 'bottom'
          ? {
              bottom: {
                xs: 'calc(var(--app-bottom-nav-height, 0px) + 8px)',
                sm: 'calc(var(--app-bottom-nav-height, 0px) + 24px)',
              },
            }
          : undefined
      }
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%', borderRadius: 3 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
