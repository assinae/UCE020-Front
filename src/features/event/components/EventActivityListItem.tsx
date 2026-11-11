import { Box, Typography } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { colorTokens } from '@/lib/colors';
import { APP_TIMEZONE, formatBahiaTime } from '@/utils/date';
import type { Activity } from '@/types/activity';

export type ActivityTimeState = 'live' | 'next' | 'upcoming' | 'ended';

interface EventActivityListItemProps {
  activity: Activity;
  timeState: ActivityTimeState;
  onSelect: (activity: Activity) => void;
}

function getDayMonth(value?: string) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return { day: '--', month: '' };

  const day = new Intl.DateTimeFormat('pt-BR', { timeZone: APP_TIMEZONE, day: '2-digit' }).format(date);
  const month = new Intl.DateTimeFormat('pt-BR', { timeZone: APP_TIMEZONE, month: 'short' })
    .format(date)
    .replace('.', '');
  return { day, month };
}

function getTimeRange(start?: string, end?: string) {
  if (!start) return '';
  return end ? `${formatBahiaTime(start)} — ${formatBahiaTime(end)}` : formatBahiaTime(start);
}

const pillBaseSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.75,
  alignSelf: 'flex-start',
  px: 1.25,
  py: 0.4,
  borderRadius: 99,
  fontSize: 11.5,
  fontWeight: 800,
  letterSpacing: '0.02em',
  lineHeight: 1.4,
} as const;

function StatePill({ state }: { state: ActivityTimeState }) {
  if (state === 'live') {
    return (
      <Box component="span" sx={{ ...pillBaseSx, bgcolor: colorTokens.brand.secondary, color: '#FFFFFF' }}>
        <Box
          component="span"
          sx={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            bgcolor: colorTokens.brand.primary,
            boxShadow: '0 0 0 3px rgba(118, 227, 188, 0.35)',
          }}
        />
        Acontecendo agora
      </Box>
    );
  }

  if (state === 'next') {
    return (
      <Box component="span" sx={{ ...pillBaseSx, bgcolor: '#E3EAFB', color: colorTokens.role.organizerText }}>
        <ArrowForwardRoundedIcon sx={{ fontSize: 13 }} />
        Próxima
      </Box>
    );
  }

  if (state === 'ended') {
    return (
      <Box component="span" sx={{ ...pillBaseSx, bgcolor: colorTokens.surface.hover, color: colorTokens.text.label }}>
        Encerrada
      </Box>
    );
  }

  return null;
}

export function EventActivityListItem({ activity, timeState, onSelect }: EventActivityListItemProps) {
  const { day, month } = getDayMonth(activity.startDate);
  const timeRange = getTimeRange(activity.startDate, activity.endDate);
  const isLive = timeState === 'live';
  const isEnded = timeState === 'ended';

  return (
    <Box
      component="button"
      type="button"
      onClick={() => onSelect(activity)}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 1.5, sm: 2 },
        p: { xs: 1.5, sm: 2 },
        textAlign: 'left',
        font: 'inherit',
        cursor: 'pointer',
        borderRadius: { xs: '20px', sm: '22px' },
        border: '1.5px solid',
        borderColor: isLive ? colorTokens.brand.secondary : 'rgba(13, 30, 59, 0.08)',
        bgcolor: isLive ? colorTokens.surface.mintSubtle : '#FFFFFF',
        transition: 'transform .2s ease, border-color .18s ease, background-color .18s ease',
        '&:hover': {
          borderColor: colorTokens.brand.secondary,
          bgcolor: colorTokens.surface.rowHover,
          transform: 'translateY(-2px)',
        },
        '&:active': { transform: 'translateY(0)' },
        '&:focus-visible': { outline: `2px solid ${colorTokens.brand.secondary}`, outlineOffset: 2 },
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: 52, sm: 60 },
          py: 1,
          borderRadius: '16px',
          textAlign: 'center',
          bgcolor: isLive ? '#FFFFFF' : colorTokens.surface.hover,
          opacity: isEnded ? 0.7 : 1,
        }}
      >
        <Typography sx={{ fontSize: { xs: 17, sm: 18 }, fontWeight: 800, lineHeight: 1, color: colorTokens.text.heading }}>
          {day}
        </Typography>
        <Typography
          sx={{
            mt: 0.25,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: colorTokens.text.label,
          }}
        >
          {month}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography
          sx={{
            fontSize: { xs: 14.5, sm: 15 },
            fontWeight: 700,
            lineHeight: 1.35,
            color: isEnded ? colorTokens.text.muted : colorTokens.text.heading,
            overflowWrap: 'anywhere',
          }}
        >
          {activity.name}
        </Typography>
        <StatePill state={timeState} />
        <Typography sx={{ fontSize: 12.5, color: colorTokens.text.muted, mt: 0.25, overflowWrap: 'anywhere' }}>
          {[timeRange, activity.location].filter(Boolean).join(' · ')}
        </Typography>
      </Box>

      <ChevronRightRoundedIcon sx={{ flexShrink: 0, fontSize: 22, color: colorTokens.text.icon }} />
    </Box>
  );
}
