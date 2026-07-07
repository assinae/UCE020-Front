'use client';

import { Snackbar, Alert } from '@mui/material';
import { ToastProps, ToastSeverity } from '@/types/toast';

export function Toast({ open, message, severity = ToastSeverity.Error, duration = 3500, onClose }: ToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%', borderRadius: 3 }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
