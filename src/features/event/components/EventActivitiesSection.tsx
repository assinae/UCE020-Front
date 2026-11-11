'use client';

import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';
import { colorTokens } from '@/lib/colors';
import { useNow } from '@/hooks/useNow';
import { isHappening, toTime } from '@/features/event/hooks/useEventHighlight';
import type { Activity } from '@/types/activity';
import { EventActivityListItem, type ActivityTimeState } from './EventActivityListItem';

interface EventActivitiesSectionProps {
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
}

export function EventActivitiesSection({ activities, onSelectActivity }: EventActivitiesSectionProps) {
  const now = useNow();

  // "Próxima" só marca a primeira atividade futura, e só quando nada está acontecendo.
  const timeStates = useMemo(() => {
    const states = new Map<string, ActivityTimeState>();
    const hasLive = activities.some((activity) => isHappening(activity.startDate, activity.endDate, now));
    let nextMarked = hasLive;

    for (const activity of activities) {
      if (isHappening(activity.startDate, activity.endDate, now)) {
        states.set(activity.id, 'live');
      } else if (toTime(activity.endDate) < now) {
        states.set(activity.id, 'ended');
      } else if (!nextMarked && toTime(activity.startDate) > now) {
        states.set(activity.id, 'next');
        nextMarked = true;
      } else {
        states.set(activity.id, 'upcoming');
      }
    }
    return states;
  }, [activities, now]);

  const countLabel = activities.length === 1 ? '1 atividade' : `${activities.length} atividades`;

  return (
    <Box component="section" aria-labelledby="event-programacao">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
        <Box sx={{ width: 5, height: 20, borderRadius: 99, bgcolor: colorTokens.brand.secondary }} />
        <Typography
          id="event-programacao"
          component="h2"
          sx={{
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: colorTokens.text.heading,
          }}
        >
          Programação
        </Typography>
        <Box
          component="span"
          sx={{
            px: 1.4,
            py: 0.4,
            borderRadius: 99,
            bgcolor: colorTokens.surface.mint,
            color: colorTokens.text.mint,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {countLabel}
        </Box>
        <Box sx={{ flex: 1, minWidth: 20, height: '1px', bgcolor: 'rgba(13, 30, 59, 0.08)' }} />
      </Box>

      {activities.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            py: 4,
            px: 2,
            borderRadius: '22px',
            border: '1.5px dashed rgba(13, 30, 59, 0.12)',
            textAlign: 'center',
          }}
        >
          <EventBusyRoundedIcon sx={{ fontSize: 30, color: colorTokens.text.icon }} />
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: colorTokens.text.muted }}>
            Nenhuma atividade cadastrada no momento
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          {activities.map((activity) => (
            <EventActivityListItem
              key={activity.id}
              activity={activity}
              timeState={timeStates.get(activity.id) ?? 'upcoming'}
              onSelect={onSelectActivity}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
