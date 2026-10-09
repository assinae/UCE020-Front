/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react';
import { Box, ButtonBase, alpha } from '@mui/material';
import type { EventCardProps } from '@/types/event';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { colorTokens } from '@/lib/colors';
import { formatBahiaDate } from '@/utils/date';
import { PARTICIPATION_LABELS, getEventStatusStyle } from './eventLabels';

function formatDateRange(start: string, end: string): string {
  return `${formatBahiaDate(start)} a ${formatBahiaDate(end)}`;
}

const INK = colorTokens.navigation.default;
const SHADOW = colorTokens.shadow.ink;

function MetaLine({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
      {icon}
      <Box
        component="span"
        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {children}
      </Box>
    </Box>
  );
}

const iconSx = { fontSize: 15, color: colorTokens.text.icon, flexShrink: 0 };

export function EventCard({ event, onClick }: EventCardProps) {
  const initial = (event.nome || '?').trim().charAt(0).toUpperCase();
  const statusStyle = getEventStatusStyle(event.status);
  const participationLabel = event.tipoParticipacao
    ? PARTICIPATION_LABELS[event.tipoParticipacao]
    : null;

  return (
    <ButtonBase
      onClick={() => onClick?.(event)}
      sx={{
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        gap: { xs: 1.5, sm: 2 },
        textAlign: 'left',
        bgcolor: colorTokens.neutral.white,
        border: `1px solid ${alpha(INK, 0.06)}`,
        borderRadius: '24px',
        p: { xs: '14px', sm: '16px 18px' },
        boxShadow: `0 4px 14px ${alpha(SHADOW, 0.05)}`,
        transition: 'transform .28s cubic-bezier(.34,1.2,.64,1), box-shadow .28s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 14px 30px ${alpha(SHADOW, 0.1)}`,
        },
      }}
    >
      <Box
        sx={{
          width: { xs: 64, sm: 76 },
          height: { xs: 64, sm: 76 },
          flexShrink: 0,
          borderRadius: '20px',
          overflow: 'hidden',
          bgcolor: colorTokens.surface.mint,
          color: colorTokens.brand.secondary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: { xs: 26, sm: 30 },
          fontWeight: 800,
          userSelect: 'none',
        }}
      >
        {event.foto ? (
          <img src={event.foto} alt={event.nome} className="h-full w-full object-cover" />
        ) : (
          initial
        )}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1.25,
          }}
        >
          <Box
            component="h3"
            sx={{
              m: 0,
              minWidth: 0,
              fontSize: { xs: 14.5, sm: 15.5 },
              fontWeight: 700,
              lineHeight: 1.3,
              color: colorTokens.text.heading,
              wordBreak: 'break-word',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.nome}
          </Box>
          <Box
            component="span"
            sx={{
              flexShrink: 0,
              px: '11px',
              py: '4px',
              borderRadius: '999px',
              fontSize: 11.5,
              fontWeight: 700,
              whiteSpace: 'nowrap',
              bgcolor: statusStyle.bg,
              color: statusStyle.color,
            }}
          >
            {statusStyle.label}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            fontSize: 12.5,
            color: colorTokens.text.muted,
            minWidth: 0,
          }}
        >
          <MetaLine icon={<CalendarMonthOutlinedIcon sx={iconSx} />}>
            {formatDateRange(event.dataInicio, event.dataFim)}
          </MetaLine>
          <MetaLine icon={<LocationOnOutlinedIcon sx={iconSx} />}>
            {event.localizacao || 'A definir'}
          </MetaLine>
          <MetaLine icon={<AccessTimeOutlinedIcon sx={iconSx} />}>
            {participationLabel
              ? `${event.cargaHoraria}h · ${participationLabel}`
              : `${event.cargaHoraria}h`}
          </MetaLine>
        </Box>
      </Box>
    </ButtonBase>
  );
}
