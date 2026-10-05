import Link from 'next/link';
import { Box, alpha } from '@mui/material';
import { colorTokens } from '@/lib/colors';
import type { QuickAction, QuickActionTone } from './quickActions';

const WHITE = colorTokens.neutral.white;

const TONES: Record<
  QuickActionTone,
  {
    background: string;
    border: string;
    shadow: string;
    iconBg: string;
    icon: string;
    text: string;
    orb: string;
  }
> = {
  mint: {
    background: `linear-gradient(135deg, ${colorTokens.brand.mint} 0%, ${colorTokens.brand.mintDeep} 100%)`,
    border: alpha(WHITE, 0.18),
    shadow: alpha(colorTokens.shadow.mint, 0.28),
    iconBg: alpha(WHITE, 0.22),
    icon: WHITE,
    text: WHITE,
    orb: alpha(WHITE, 0.14),
  },
  navy: {
    background: `linear-gradient(135deg, ${colorTokens.navigation.deep} 0%, ${colorTokens.navigation.default} 100%)`,
    border: alpha(WHITE, 0.1),
    shadow: alpha(colorTokens.shadow.navy, 0.28),
    iconBg: alpha(WHITE, 0.14),
    icon: colorTokens.brand.mint,
    text: WHITE,
    orb: alpha(colorTokens.brand.mint, 0.14),
  },
  forest: {
    background: `linear-gradient(135deg, ${colorTokens.brand.forest} 0%, ${colorTokens.brand.forestDeep} 100%)`,
    border: alpha(WHITE, 0.18),
    shadow: alpha(colorTokens.brand.forestDeep, 0.26),
    iconBg: alpha(WHITE, 0.2),
    icon: WHITE,
    text: WHITE,
    orb: alpha(WHITE, 0.12),
  },
  light: {
    background: WHITE,
    border: alpha(colorTokens.navigation.default, 0.07),
    shadow: alpha(colorTokens.shadow.ink, 0.07),
    iconBg: colorTokens.surface.mintStrong,
    icon: colorTokens.brand.secondary,
    text: colorTokens.text.heading,
    orb: colorTokens.surface.mintSubtle,
  },
};

const SIZES = {
  lg: {
    radius: '32px',
    padding: '26px',
    minHeight: 178,
    iconBox: 60,
    iconRadius: '20px',
    iconSize: 28,
    label: 21,
  },
  sm: {
    radius: '24px',
    padding: '16px',
    minHeight: 118,
    iconBox: 44,
    iconRadius: '15px',
    iconSize: 22,
    label: 15,
  },
};

interface QuickActionCardProps {
  action: QuickAction;
  size?: keyof typeof SIZES;
  onClick?: () => void;
}

export function QuickActionCard({ action, size = 'lg', onClick }: QuickActionCardProps) {
  const tone = TONES[action.tone];
  const dims = SIZES[size];
  const Icon = action.icon;

  return (
    <Box
      component={Link}
      href={action.href}
      onClick={onClick}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '14px',
        minHeight: dims.minHeight,
        p: dims.padding,
        borderRadius: dims.radius,
        border: `1px solid ${tone.border}`,
        background: tone.background,
        boxShadow: size === 'lg' ? `0 12px 28px ${tone.shadow}` : `0 8px 20px ${tone.shadow}`,
        textDecoration: 'none',
        transition: 'transform .28s cubic-bezier(.34,1.2,.64,1), box-shadow .28s ease',
        '&:hover': { transform: 'translateY(-4px)' },
        '&:active': { transform: 'scale(0.98)' },
      }}
    >
      {size === 'lg' && (
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 160,
            height: 160,
            borderRadius: '999px',
            bgcolor: tone.orb,
          }}
        />
      )}
      <Box
        sx={{
          position: 'relative',
          width: dims.iconBox,
          height: dims.iconBox,
          borderRadius: dims.iconRadius,
          bgcolor: tone.iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon sx={{ color: tone.icon, fontSize: dims.iconSize }} />
      </Box>
      <Box
        component="span"
        sx={{
          position: 'relative',
          display: 'block',
          fontSize: dims.label,
          fontWeight: 800,
          lineHeight: size === 'lg' ? 1.15 : 1.2,
          letterSpacing: size === 'lg' ? '-0.02em' : 0,
          color: tone.text,
        }}
      >
        {action.label}
      </Box>
    </Box>
  );
}
