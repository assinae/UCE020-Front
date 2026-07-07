import { Box, Typography } from '@mui/material';
import ListRoundedIcon from '@mui/icons-material/ListRounded';
import { colorTokens } from '@/lib/colors';
import type { Activity } from '@/types/activity';
import { EventActivityListItem } from './EventActivityListItem';

interface EventActivitiesSectionProps {
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
}

export function EventActivitiesSection({ activities, onSelectActivity }: EventActivitiesSectionProps) {
  return (
    <>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 14,
          color: colorTokens.text.primary,
          display: 'flex',
          alignItems: 'center',
          mt: 5,
          mb: 2,
          gap: 0.5,
        }}
      >
        <ListRoundedIcon sx={{ width: 18, height: 18 }} />
        Atividades do Evento
      </Typography>

      {activities.length === 0 ? (
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: colorTokens.status.error,
            textAlign: 'center',
            py: 2,
            lineHeight: 1.6,
          }}
        >
          Sem atividades
          <br />
          cadastradas no momento
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {activities.map((activity) => (
            <EventActivityListItem
              key={activity.id}
              activity={activity}
              onSelect={onSelectActivity}
            />
          ))}
        </Box>
      )}
    </>
  );
}
