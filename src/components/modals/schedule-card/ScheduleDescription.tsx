'use client';

import { Typography, Box, Divider } from '@mui/material';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import { useState } from 'react';

interface ScheduleDescriptionProps {
  description?: string;
}

export default function ScheduleDescription({
  description = '',
}: ScheduleDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  const safeDescription = description ?? '';

  if (!safeDescription.trim()) return null;

  const shouldTruncate = safeDescription.length > 278;

  const displayedDescription =
    expanded || !shouldTruncate
      ? safeDescription
      : `${safeDescription.slice(0, 278)}...`;

  function toggleExpand() {
    setExpanded((prev) => !prev);
  }

  return (
    <Box sx={{ mt: { xs: 2.5, sm: 3.5 }, mb: { xs: 1, sm: 1.5 } }}>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
        <NotesRoundedIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 700,
            color: 'text.primary',
            letterSpacing: '0.01em',
          }}
        >
          Descrição
        </Typography>
      </Box>

      <Typography
        sx={{
          color: 'text.primary',
          fontSize: { xs: 12.5, sm: 12.5 },
          textAlign: 'justify',
          lineHeight: 1.7,
          opacity: 0.85,
        }}
      >
        {displayedDescription}
      </Typography>

      {shouldTruncate && (
        <Typography
          component="button"
          type="button"
          onClick={toggleExpand}
          sx={{
            mt: 1,
            p: 0,
            border: 0,
            background: 'transparent',
            color: 'primary.main',
            fontSize: { xs: 12, sm: 12 },
            fontWeight: 700,
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {expanded ? 'Ver menos' : 'Ver mais'}
        </Typography>
      )}
    </Box>
  );
}