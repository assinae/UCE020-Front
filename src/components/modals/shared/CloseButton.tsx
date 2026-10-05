'use client';

import { IconButton, type SxProps, type Theme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CloseButtonProps {
  onClick: () => void;
  position?: 'absolute' | 'relative';
  top?: number;
  right?: number;
  /** Ajustes visuais (ex.: cor clara em modal de fundo escuro). */
  sx?: SxProps<Theme>;
}

export default function CloseButton({
  onClick,
  position = 'absolute',
  top = 16,
  right = 16,
  sx,
}: CloseButtonProps) {
  return (
    <IconButton
      onClick={onClick}
      aria-label="Fechar"
      sx={[
        {
          position,
          top,
          right,
          color: 'text.primary',
          zIndex: 10,
          '&:hover': {
            backgroundColor: 'action.disabled',
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <CloseIcon sx={{ fontSize: 20 }} />
    </IconButton>
  );
}
