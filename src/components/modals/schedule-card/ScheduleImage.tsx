import { useState } from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';
import type { ScheduleImageProps } from '@/types/scheduleCard';

export default function ScheduleImage({ title, image }: ScheduleImageProps) {
  const [hasError, setHasError] = useState(false);

  // Sem imagem (ou falha ao carregar): não exibe nenhum placeholder.
  if (!image || hasError) return null;

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: '50%' },
        aspectRatio: { xs: '16/9', sm: '1/1' },
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        borderRadius: '14px',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 4px 14px rgba(15, 30, 59, 0.08)',
      }}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="50vw"
        className="object-cover"
        onError={() => setHasError(true)}
      />
    </Box>
  );
}
