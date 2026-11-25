import { Box } from '@mui/material';
import { colorTokens } from '@/lib/colors';
import type { EventPhase } from '../utils/eventLandingFormat';

interface EventPhaseBadgeProps {
  phase: EventPhase;
  label: string;
  tone?: 'dark' | 'light';
}

const DOT_COLORS: Record<EventPhase, string> = {
  live: colorTokens.brand.primary,
  upcoming: '#F5C451',
  ended: colorTokens.text.icon,
};

export function EventPhaseBadge({ phase, label, tone = 'light' }: EventPhaseBadgeProps) {
  const isDark = tone === 'dark';

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        px: 1.75,
        py: 0.6,
        borderRadius: 999,
        fontSize: 12.5,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : colorTokens.surface.hover,
        border: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(13,30,59,0.08)',
        color: isDark ? colorTokens.text.inverse : colorTokens.text.heading,
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: DOT_COLORS[phase],
          boxShadow: phase === 'live' ? '0 0 0 3px rgba(118,227,188,0.3)' : 'none',
        }}
      />
      {label}
    </Box>
  );
}
