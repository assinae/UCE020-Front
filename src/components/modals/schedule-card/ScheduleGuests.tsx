'use client';

import { Avatar, Box, Chip, Divider, Typography } from '@mui/material';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import type { ScheduleGuestsProps } from '@/types/scheduleCard';

const GUEST_ROLE_LABELS: Record<string, string> = {
  palestrante: 'Palestrante',
  ministrante: 'Ministrante',
  moderador: 'Moderador',
};

function getRoleLabel(role: string): string {
  const normalized = role?.trim().toLowerCase() ?? '';

  return (
    GUEST_ROLE_LABELS[normalized] ??
    (normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : 'Convidado')
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return '?';

  const [first] = parts;
  const last = parts.length > 1 ? parts[parts.length - 1] : '';

  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

export default function ScheduleGuests({ guests = [] }: ScheduleGuestsProps) {
  const visibleGuests = guests.filter((guest) => guest?.name?.trim());

  if (visibleGuests.length === 0) return null;

  return (
    <Box sx={{ mt: { xs: 2, sm: 2.5 }, mb: { xs: 1, sm: 1.5 } }}>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <GroupsRoundedIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: 'text.primary',
            letterSpacing: '0.01em',
          }}
        >
          Convidados
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {visibleGuests.map((guest, index) => (
          <Box
            key={`${guest.email || guest.name}-${index}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, flex: 1 }}
            >
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  fontSize: 12,
                  fontWeight: 700,
                  bgcolor: 'secondary.light',
                  color: 'secondary.contrastText',
                }}
              >
                {getInitials(guest.name)}
              </Avatar>

              <Typography
                title={guest.name}
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'text.primary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {guest.name}
              </Typography>
            </Box>

            <Chip
              label={getRoleLabel(guest.role)}
              size="small"
              variant="outlined"
              color="secondary"
              sx={{ fontSize: 11, fontWeight: 600, flexShrink: 0 }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
