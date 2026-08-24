import type { ReactNode } from 'react';
import { Box, type BoxProps } from '@mui/material';
import { colorTokens } from '@/lib/colors';

interface ContentCardProps extends BoxProps {
  children: ReactNode;
}

export function ContentCard({ children, sx, ...props }: ContentCardProps) {
  return (
    <Box
      sx={{
        bgcolor: colorTokens.neutral.white,
        borderRadius: '20px',
        border: '1px solid rgba(15, 29, 53, 0.06)',
        boxShadow: '0 1px 2px rgba(15, 29, 53, 0.04)',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
