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
          fontSize: 'clamp(17px, 5vw, 21px)',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: 'text.primary',
          textAlign: 'center',
          mt: { xs: 0.5, sm: 1 },
          mb: { xs: 2.5, sm: 3 },
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
        {image && <ScheduleImage title={title} image={image} />}
        <ScheduleDetails
          startDate={startDate}
          endDate={endDate}
          location={location}
          hours={hours}
          participantsCount={participantsCount}
          status={status}
          fullWidth={!image}
        />
      </Box>

      <ScheduleDescription description={description} />
    </>
  );
}
