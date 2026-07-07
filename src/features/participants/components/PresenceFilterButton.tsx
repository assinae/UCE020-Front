import type { ReactNode } from 'react';
import { IconButton, type IconButtonProps } from '@mui/material';
import { colorTokens } from '@/lib/colors';

interface PresenceFilterButtonProps extends Omit<IconButtonProps, 'sx'> {
  isActive: boolean;
  children: ReactNode;
}

export function PresenceFilterButton({ isActive, children, ...props }: PresenceFilterButtonProps) {
  return (
    <IconButton
      size="small"
      {...props}
      sx={{
        color: isActive ? colorTokens.navigation.default : colorTokens.neutral.gray500,
        bgcolor: isActive ? 'rgba(37, 72, 120, 0.10)' : 'transparent',
        border: isActive ? '1px solid rgba(37, 72, 120, 0.25)' : '1px solid transparent',
        '&:hover': {
          bgcolor: isActive ? 'rgba(37, 72, 120, 0.14)' : 'rgba(0,0,0,0.04)',
        },
      }}
    >
      {children}
    </IconButton>
  );
}
