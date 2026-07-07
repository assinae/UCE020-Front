'use client';

import { Box, Typography } from '@mui/material';
import CloseButton from './CloseButton';
import type { ReactNode } from 'react';

interface ModalHeaderProps {
  title: ReactNode;
  onClose: () => void;
}

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <Box sx={{ position: 'relative', px: 3, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: 'text.primary',
            fontSize: 'clamp(16px, 5vw, 20px)',
            pr: 2,
            flex: 1,
          }}
        >
          {title}
        </Typography>
        <CloseButton onClick={onClose} position="relative" top={0} right={0} />
      </Box>
    </Box>
  );
}