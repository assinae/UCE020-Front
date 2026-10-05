import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { colorTokens } from '@/lib/colors';

export function ListPageLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: colorTokens.surface.app }}>
      <Box
        sx={{
          maxWidth: 920,
          mx: 'auto',
          px: { xs: 1.5, md: 3 },
          pt: { xs: 1.75, md: 3.5 },
          pb: { xs: 4, md: 9 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1.75, md: 2.25 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
