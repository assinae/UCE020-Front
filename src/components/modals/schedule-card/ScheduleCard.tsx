'use client';

import { Typography, Box } from '@mui/material';
import {
  ScheduleImage,
  ScheduleDetails,
  ScheduleDescription,
} from '@/components/modals/schedule-card';
import type { ScheduleCardProps } from '@/types/scheduleCard';

export default function ScheduleCard({
  title,
  image,
  startDate,
  endDate,
  location,
  hours,
  participantsCount,
  status,
  description,
}: ScheduleCardProps) {
  return (
    <>
      <Typography
        variant="h3"
        sx={{
          fontSize: 'clamp(16px, 5vw, 20px)',
          color: 'primary.contrastText',
          textAlign: 'center',
          mt: { xs: 1, sm: 2 },
          mb: { xs: 2, sm: 3 },
          px: { xs: 4, sm: 5 },
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          height: 'auto',
          alignItems: 'flex-start',
          gap: { xs: 2, sm: 0 },
        }}
      >
        <ScheduleImage title={title} image={image} />
        <ScheduleDetails
          startDate={startDate}
          endDate={endDate}
          location={location}
          hours={hours}
          participantsCount={participantsCount}
          status={status}
        />
      </Box>

      <ScheduleDescription description={description} />
    </>
  );
}
