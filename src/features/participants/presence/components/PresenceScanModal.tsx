'use client';

import { Typography, Box } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { Button } from '@/components/ui';
import { ModalContainer, CloseButton, ModalContent, ModalFooter } from '@/components/modals';
import { colorTokens } from '@/lib/colors';
import { getConfirmPresenceMessage } from '@/features/participants/presence/utils/presenceMessages';
import { resolveEventName } from '@/features/participants/presence/utils/resolvePresenceContext';
import type { PresenceScanResult } from '@/types/presence';

interface PresenceScanModalProps {
  open: boolean;
  scanResult: PresenceScanResult | null;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isConfirming?: boolean;
  confirmError?: string | null;
}

type ModalVisualType = 'default' | 'error' | 'warning';

function getModalVisualType(scanResult: PresenceScanResult, confirmError: string | null): ModalVisualType {
  if (confirmError) return 'error';

  switch (scanResult.status) {
    case 'ready':
      return 'default';
    case 'already_confirmed':
      return 'warning';
    default:
      return 'error';
  }
}

function ModalStatusIcon({ type }: { type: ModalVisualType }) {
  switch (type) {
    case 'error':
      return <ErrorRoundedIcon sx={{ fontSize: 48, color: colorTokens.status.error }} />;
    case 'warning':
      return <WarningAmberRoundedIcon sx={{ fontSize: 48, color: colorTokens.status.warning }} />;
    default:
      return <InfoRoundedIcon sx={{ fontSize: 48, color: 'text.secondary' }} />;
  }
}

function ScanPayloadDetails({ scanResult }: { scanResult: PresenceScanResult }) {
  if (!scanResult.payload) return null;

  const { payload } = scanResult;

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1,
        p: 2,
        borderRadius: 2,
        bgcolor: colorTokens.surface.background,
        border: `1px solid ${colorTokens.neutral.border}`,
        mb: 2,
      }}
    >
      <Typography sx={{ fontSize: 13, color: colorTokens.text.secondary }}>
        Participante: <strong>{payload.participantName}</strong>
      </Typography>
      <Typography sx={{ fontSize: 13, color: colorTokens.text.secondary }}>
        Evento: <strong>{resolveEventName(payload.eventId)}</strong>
      </Typography>
      <Typography sx={{ fontSize: 13, color: colorTokens.text.secondary }}>
        Atividade: <strong>{payload.activityTitle}</strong>
      </Typography>
    </Box>
  );
}

export function PresenceScanModal({
  open,
  scanResult,
  onClose,
  onConfirm,
  isConfirming = false,
  confirmError = null,
}: PresenceScanModalProps) {
  if (!open || !scanResult) return null;

  const canConfirm = scanResult.canConfirm && !confirmError;
  const visualType = getModalVisualType(scanResult, confirmError);
  const confirmMessages = getConfirmPresenceMessage(
    scanResult.participantName ?? 'Participante',
    scanResult.activityTitle ?? 'Atividade',
  );

  const title = confirmError ?? scanResult.message;
  const description = canConfirm
    ? confirmMessages.emphasisEndText
    : scanResult.monitorGuidance;

  return (
    <ModalContainer open={open} onClose={onClose}>
      <CloseButton onClick={onClose} />

      <ModalContent paddingX={3} marginBottom={3.5}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5, mt: 1 }}>
          <ModalStatusIcon type={visualType} />
        </Box>

        {canConfirm ? (
          <>
            <Typography
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                mb: 1,
                fontSize: 'clamp(12px, 3vw, 14px)',
              }}
            >
              {confirmMessages.message}
            </Typography>
            <Typography
              sx={{
                textAlign: 'center',
                fontWeight: 700,
                color: 'text.primary',
                fontSize: 'clamp(12px, 3vw, 14px)',
                mb: 2,
              }}
            >
              {description}
            </Typography>
          </>
        ) : (
          <>
            <Typography
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                mb: 1,
                fontSize: 'clamp(12px, 3vw, 14px)',
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                textAlign: 'center',
                fontWeight: 700,
                color: visualType === 'error' ? colorTokens.status.error : 'text.primary',
                fontSize: 'clamp(10px, 3vw, 12px)',
                mb: 2,
              }}
            >
              {description}
            </Typography>
          </>
        )}

        <ScanPayloadDetails scanResult={scanResult} />

        <ModalFooter paddingX={0} marginTop={0}>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
            {canConfirm ? (
              <>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => void onConfirm()}
                  isLoading={isConfirming}
                  disabled={isConfirming}
                  sx={{ flex: 1, maxWidth: 140, height: 36 }}
                >
                  Confirmar
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={onClose}
                  disabled={isConfirming}
                  sx={{ flex: 1, maxWidth: 140, height: 36 }}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={onClose}
                sx={{ flex: 1, maxWidth: 160, height: 36 }}
              >
                Entendi
              </Button>
            )}
          </Box>
        </ModalFooter>
      </ModalContent>
    </ModalContainer>
  );
}
