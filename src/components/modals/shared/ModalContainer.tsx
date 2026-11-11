'use client';

import { Dialog, SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';

interface ModalContainerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  sx?: SxProps<Theme>;
  paperSx?: SxProps<Theme>;
  /** Classe do painel, para animações de entrada do Tailwind. */
  paperClassName?: string;
}

export default function ModalContainer({
  open,
  onClose,
  children,
  sx,
  paperSx,
  paperClassName,
}: ModalContainerProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={sx}
      slotProps={{
        paper: {
          className: paperClassName,
          // O MUI foca o próprio painel ao abrir; sem isso o navegador desenha o anel de foco
          // em volta do modal inteiro quando ele é aberto pelo teclado.
          sx: [
            { width: '100%', outline: 'none' },
            ...(Array.isArray(paperSx) ? paperSx : paperSx ? [paperSx] : []),
          ],
        },
      }}
    >
      {children}
    </Dialog>
  );
}
