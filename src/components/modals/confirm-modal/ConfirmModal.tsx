'use client';

import { useState } from 'react';
import { Typography, Box } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Button } from '@/components/ui';
import { ModalContainer, CloseButton, ModalContent, ModalFooter } from '@/components/modals';
import { colorTokens } from '@/lib/colors';
import type { ConfirmModalProps } from '@/types/confirmModal';

interface ExtendedConfirmModalProps extends ConfirmModalProps {
  type?: 'default' | 'error' | 'warning' | 'success';
}

export default function ConfirmModal({
  open,
  onClose,
  message,
  emphasisEndText,
  confirmText,
  cancelText,
  onConfirm,
  confirmDisabled = false,
  isLoading = false,
  type = 'default',
}: ExtendedConfirmModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (isSubmitting || confirmDisabled) return;
    try {
      setIsSubmitting(true);
      await onConfirm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <ErrorRoundedIcon sx={{ fontSize: 48, color: colorTokens.status.error }} />;
      case 'warning':
        return <WarningAmberRoundedIcon sx={{ fontSize: 48, color: colorTokens.status.warning }} />;
      case 'success':
        return <CheckCircleRoundedIcon sx={{ fontSize: 48, color: colorTokens.status.success }} />;
      default:
        return <WarningAmberRoundedIcon sx={{ fontSize: 32, color: 'text.secondary' }} />;
    }
  };

  return (
    <ModalContainer open={open} onClose={onClose}>
      <CloseButton onClick={onClose} />

      <ModalContent paddingX={3} marginBottom={3.5}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5, mt: 1 }}>
          {getIcon()}
        </Box>

        <Typography
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            mb: 1,
            fontSize: 'clamp(14px, 4vw, 16px)',
            lineHeight: 1.5,
          }}
        >
          {message}
        </Typography>

        <Typography
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            color: type === 'error' ? colorTokens.status.error : 'text.primary',
            fontSize: 'clamp(16px, 5vw, 18px)',
            mb: 3,
          }}
        >
          {emphasisEndText}
        </Typography>

        <ModalFooter paddingX={0} marginTop={0}>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => void handleConfirm()}
              isLoading={isSubmitting || isLoading}
              disabled={confirmDisabled || isSubmitting}
              sx={{
                flex: 1,
                maxWidth: 140,
                fontSize: 'clamp(11px, 3vw, 14px)',
                height: 36,
              }}
            >
              {confirmText}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              disabled={isSubmitting}
              sx={{
                flex: 1,
                maxWidth: 140,
                fontSize: 'clamp(11px, 3vw, 14px)',
                height: 36,
              }}
            >
              {cancelText}
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </ModalContainer>
  );
}
