'use client';

import { Box, CircularProgress, type SxProps, type Theme } from '@mui/material';

interface PageLoaderProps {
  /**
   * Altura mínima da área de carregamento. Por padrão ocupa toda a tela
   * visível abaixo do header fixo (64px), garantindo o spinner centralizado.
   */
  minHeight?: number | string;
  size?: number;
  sx?: SxProps<Theme>;
}

export function PageLoader({
  minHeight = 'calc(100dvh - 64px)',
  size = 40,
  sx,
}: PageLoaderProps) {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
    >
      <CircularProgress size={size} sx={{ color: '#2EC4A0' }} />
    </Box>
  );
}
