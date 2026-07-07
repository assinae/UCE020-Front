'use client';

import { Box, Typography } from '@mui/material';
import QRCode from 'react-qr-code';
import { ModalContainer, CloseButton } from '@/components/modals';
import { buildPresenceQrPayload } from '@/features/participants/presence/utils/presenceQr';
import type { PresenceQrPayload } from '@/types/presence';

interface ParticipantQrCodeModalProps {
  open: boolean;
  onClose: () => void;
  payload: PresenceQrPayload;
}

export function ParticipantQrCodeModal({
  open,
  onClose,
  payload,
}: ParticipantQrCodeModalProps) {
  const qrPayload = buildPresenceQrPayload(payload);

  return (
    <ModalContainer open={open} onClose={onClose}>
      <CloseButton onClick={onClose} />

      <Box sx={{ px: 3, pb: 3 }}>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: 'clamp(14px, 4vw, 16px)',
            mb: 1,
            textAlign: 'center',
          }}
        >
          Mostre este QR Code ao monitor para confirmar sua presença em
        </Typography>
        <Typography
          sx={{
            color: 'text.primary',
            fontWeight: 700,
            fontSize: 'clamp(18px, 5vw, 22px)',
            mb: 3,
            textAlign: 'center',
          }}
        >
          {payload.activityTitle}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <QRCode value={qrPayload} size={260} level="H" style={{ borderRadius: '12px' }} />
        </Box>
      </Box>
    </ModalContainer>
  );
}
