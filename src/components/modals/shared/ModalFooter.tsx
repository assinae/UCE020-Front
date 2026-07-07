'use client';

import { Box } from '@mui/material';
import type { ReactNode } from 'react';

interface ModalFooterProps {
  children: ReactNode;
  paddingX?: number;
  marginTop?: number;
}

export default function ModalFooter({ children, paddingX = 3, marginTop = 2 }: ModalFooterProps) {
  return (
    <Box sx={{ px: paddingX, mt: marginTop }}>
      {children}
    </Box>
  );
}