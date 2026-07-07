import { Box, Typography } from '@mui/material';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { colorTokens } from '@/lib/colors';
import { formatActivitySchedule } from '@/utils/format';
import type { Activity } from '@/types/activity';

interface EventActivityListItemProps {
  activity: Activity;
  onSelect: (activity: Activity) => void;
}

export function EventActivityListItem({ activity, onSelect }: EventActivityListItemProps) {
  const { dayMonth, timeRange } = formatActivitySchedule(
    activity.startDate ?? '',
    activity.endDate ?? activity.startDate ?? '',
  );

  return (
    <Box
      component="button"
      type="button"
      onClick={() => onSelect(activity)}
      sx={{
        background: colorTokens.neutral.white,
        borderRadius: '14px',
        p: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        border: `1.5px solid ${colorTokens.neutral.border}`,
        width: '100%',
        textAlign: 'left',
        '&:hover': {
          transform: 'translateY(-3px)',
        },
        '&:active': { transform: 'translateY(1)' },
      }}
    >
      <EventAvailableRoundedIcon sx={{ width: 30, height: 30, color: colorTokens.text.primary }} />
      <Box
        sx={{
          minWidth: 60,
          textAlign: 'center',
          color: colorTokens.text.primary,
          fontWeight: 500,
          fontSize: 10,
          flexShrink: 0,
        }}
      >
        {dayMonth}
        <br />
        {timeRange}
      </Box>
      <Typography
        sx={{
          flex: 1,
          fontWeight: 500,
          fontSize: 14,
          color: colorTokens.text.primary,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {activity.name}
      </Typography>
      <ArrowForwardIosRoundedIcon sx={{ width: 22, height: 22, color: colorTokens.text.primary }} />
    </Box>
  );
}
