'use client';

import { Box } from '@mui/material';

interface LabelChipProps {
  status: string;
}

export default function LabelChip({ status }: LabelChipProps) {
  if (!status?.trim()) return null;

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'fit-content',
        px: 'clamp(10px, 2vw, 14px)',
        height: 'clamp(22px, 5vw, 24px)',
        bgcolor: 'rgba(0, 137, 99, 0.12)',
        border: '1px solid',
        borderColor: 'rgba(0, 137, 99, 0.25)',
        borderRadius: '99px',
        color: 'secondary.dark',
        fontSize: 'clamp(9px, 2vw, 11px)',
        fontWeight: 600,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        mt: 0.5,
      }}
    >
      {status}
    </Box>
  );
}
