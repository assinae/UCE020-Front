'use client';

import { Box } from '@mui/material';
import type { ReactNode } from 'react';

interface ModalContentProps {
  children: ReactNode;
  paddingX?: number;
  marginBottom?: number;
}

export default function ModalContent({ children, paddingX = 3, marginBottom = 3 }: ModalContentProps) {
  return (
    <Box sx={{ px: paddingX, mb: marginBottom }}>
      {children}
    </Box>
  );
}