import { Box, alpha, type SxProps, type Theme } from '@mui/material';
import type { ReactNode } from 'react';
import { colorTokens } from '@/lib/colors';

export const profileDivider = `1px solid ${alpha(colorTokens.navigation.default, 0.08)}`;

interface ProfileCardProps {
  children: ReactNode;
  /** Atraso da entrada, em segundos, para escalonar com os blocos vizinhos. */
  delay?: number;
  sx?: SxProps<Theme>;
}

export function ProfileCard({ children, delay = 0.06, sx }: ProfileCardProps) {
  return (
    <Box
      component="section"
      className="animate-fade-up motion-reduce:animate-none"
      style={{ animationDelay: `${delay}s` }}
      sx={[
        {
          overflow: 'hidden',
          bgcolor: colorTokens.neutral.white,
          border: `1px solid ${alpha(colorTokens.navigation.default, 0.06)}`,
          borderRadius: '28px',
          boxShadow: `0 8px 24px ${alpha(colorTokens.shadow.ink, 0.07)}`,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}

interface ProfileCardHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

export function ProfileCardHeader({ icon, title, subtitle }: ProfileCardHeaderProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, p: '24px 24px 20px' }}>
      <Box
        aria-hidden
        sx={{
          width: 44,
          height: 44,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${colorTokens.navigation.deep} 0%, ${colorTokens.navigation.default} 100%)`,
          color: colorTokens.brand.mint,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        <Box
          component="h2"
          sx={{
            m: 0,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: colorTokens.text.heading,
          }}
        >
          {title}
        </Box>
        <Box
          component="span"
          sx={{ fontSize: 12.5, fontWeight: 500, color: colorTokens.text.muted }}
        >
          {subtitle}
        </Box>
      </Box>
    </Box>
  );
}

export const fieldLabelSx = {
  fontSize: 11.5,
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: colorTokens.text.icon,
} as const;
