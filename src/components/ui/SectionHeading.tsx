import type { ReactNode } from 'react';
import { Box, alpha } from '@mui/material';
import { colorTokens } from '@/lib/colors';

interface SectionHeadingProps {
  title: string;
  count?: number;
  size?: 'md' | 'sm';
  icon?: ReactNode;
  action?: ReactNode;
}

export function SectionHeading({ title, count, size = 'md', icon, action }: SectionHeadingProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
      <Box
        sx={{
          width: 5,
          height: size === 'md' ? 20 : 18,
          borderRadius: '999px',
          bgcolor: colorTokens.brand.secondary,
        }}
      />
      <Box
        component="h2"
        sx={{
          m: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: size === 'md' ? 15 : 13,
          fontWeight: 800,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: colorTokens.text.heading,
        }}
      >
        {icon}
        {title}
      </Box>
      {count !== undefined && (
        <Box
          component="span"
          sx={{
            px: '11px',
            py: '3px',
            borderRadius: '999px',
            bgcolor: colorTokens.surface.mint,
            color: colorTokens.text.mint,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {count}
        </Box>
      )}
      <Box
        sx={{
          flex: 1,
          minWidth: 20,
          height: '1px',
          bgcolor: alpha(colorTokens.navigation.default, 0.08),
        }}
      />
      {action}
    </Box>
  );
}
