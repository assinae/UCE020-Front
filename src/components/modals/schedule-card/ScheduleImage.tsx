import { useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import Image from 'next/image';
import type { ScheduleImageProps } from '@/types/scheduleCard';

export default function ScheduleImage({ title, image }: ScheduleImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: '50%' },
        aspectRatio: { xs: '16/9', sm: '1/1' },
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        borderRadius: { xs: 1, sm: 0 },
      }}
    >
      {image && !hasError ? (
        <Image
          src={image}
          alt={title}
          fill
          sizes="50vw"
          className="object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="pulse"
        />
      )}
    </Box>
  );
}
