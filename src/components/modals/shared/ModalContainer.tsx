'use client';

import { Dialog, SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';

interface ModalContainerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  sx?: SxProps<Theme>;
  paperSx?: SxProps<Theme>;
}

export default function ModalContainer({
  open,
  onClose,
  children,
  sx,
  paperSx,
}: ModalContainerProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={sx}
      slotProps={{
        paper: {
          sx: [
            { width: '100%' },
            ...(Array.isArray(paperSx) ? paperSx : paperSx ? [paperSx] : []),
          ],
        },
      }}
    >
      {children}
    </Dialog>
  );
}
