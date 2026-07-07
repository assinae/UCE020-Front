'use client';

import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface CloseButtonProps {
  onClick: () => void;
  position?: 'absolute' | 'relative';
  top?: number;
  right?: number;
}

export default function CloseButton({ onClick, position = 'absolute', top = 16, right = 16 }: CloseButtonProps) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position,
        top,
        right,
        color: 'text.primary',
        zIndex: 10,
        '&:hover': {
          backgroundColor: 'action.disabled',
        },
      }}
    >
      <CloseIcon sx={{ fontSize: 20 }} />
    </IconButton>
  );
}