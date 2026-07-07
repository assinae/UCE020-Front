'use client';

import { Box } from '@mui/material';

interface LabelChipProps {
  status: string;
}

export default function LabelChip({ status }: LabelChipProps) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'fit-content',
        px: 'clamp(8px, 2vw, 12px)',
        height: 'clamp(20px, 5vw, 22px)',
        bgcolor: 'grey.500',
        borderRadius: '99px',
        color: 'info.contrastText',
        fontSize: 'clamp(8px, 2vw, 11px)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        mt: 0.5
      }}
    >
      {status}
    </Box>
  );
}
