import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { colorTokens } from '@/lib/colors';

interface EventInfoRowProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}

/** Linha de informação com ícone em quadrado menta: valor em destaque e legenda abaixo. */
export function EventInfoRow({ icon, title, subtitle }: EventInfoRowProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
      <Box
        sx={{
          width: 44,
          height: 44,
          flexShrink: 0,
          borderRadius: '14px',
          display: 'grid',
          placeItems: 'center',
          bgcolor: colorTokens.surface.mint,
          color: colorTokens.brand.secondary,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            color: colorTokens.text.heading,
            fontSize: 14.5,
            fontWeight: 700,
            lineHeight: 1.3,
            overflowWrap: 'anywhere',
          }}
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography sx={{ color: colorTokens.text.label, fontSize: 12.5, fontWeight: 500, mt: 0.25 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}
