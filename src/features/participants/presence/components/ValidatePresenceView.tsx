'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { AppPageContainer } from '@/components/layout/AppPageContainer';
import { ContentCard } from '@/components/layout/ContentCard';
import { presenceService } from '@/services/presenceService';
import { colorTokens } from '@/lib/colors';
import { validatePresenceScan } from '@/features/participants/presence/utils/validatePresenceScan';
import { requirePresenceContext } from '@/features/participants/presence/utils/resolvePresenceContext';
import { buildListParticipantsPath } from '@/features/participants/presence/utils/routes';
import { PresenceContextMissing } from './PresenceContextMissing';
import { QrCodeScanner } from './QrCodeScanner';
import { PresenceScanModal } from './PresenceScanModal';
import type { PresenceScanResult } from '@/types/presence';

interface ScanState {
  modalOpen: boolean;
  result: PresenceScanResult | null;
  isConfirming: boolean;
  error: string | null;
}

const INITIAL_STATE: ScanState = {
  modalOpen: false,
  result: null,
  isConfirming: false,
  error: null,
};

function PresenceValidationHeader({
  eventName,
  activityTitle,
}: {
  eventName: string;
  activityTitle: string;
}) {
  return (
    <Box sx={{ display: 'grid', gap: 0.75 }}>
      <Typography
        component="h1"
        sx={{
          fontWeight: 600,
          fontSize: 20,
          color: colorTokens.text.primary,
        }}
      >
        Validação de presença
      </Typography>

      <Typography
        sx={{
          fontSize: 'clamp(12px, 3vw, 14px)',
          color: colorTokens.text.secondary,
        }}
      >
        Evento: <strong>{eventName}</strong>
      </Typography>

      <Typography
        sx={{
          fontSize: 'clamp(12px, 3vw, 14px)',
          color: colorTokens.text.secondary,
        }}
      >
        Atividade: <strong>{activityTitle}</strong>
      </Typography>
    </Box>
  );
}

function PresenceScannerPanel({
  paused,
  scanKey,
  onScan,
}: {
  paused: boolean;
  scanKey: number;
  onScan: (qrCode: string) => void;
}) {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        pt: 1,
      }}
    >
      <QrCodeScanner onResult={onScan} paused={paused} scanKey={scanKey} />
    </Box>
  );
}

export function ValidatePresenceView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const context = requirePresenceContext(
    searchParams.get('eventId'),
    searchParams.get('activityId'),
  );

  const [state, setState] = useState<ScanState>(INITIAL_STATE);
  const [scanKey, setScanKey] = useState(0);

  function handleScan(qrCode: string) {
    if (!context || state.modalOpen) return;

    setState({
      modalOpen: true,
      result: validatePresenceScan(qrCode, context),
      isConfirming: false,
      error: null,
    });
  }

  function closeModal() {
    setState(INITIAL_STATE);
    setScanKey((prev) => prev + 1);
  }

  async function handleConfirmPresence() {
    const payload = state.result?.payload;
    if (!payload || !state.result?.canConfirm) return;

    setState((prev) => ({ ...prev, isConfirming: true, error: null }));

    try {
      await presenceService.confirmPresence({
        participantId: payload.participantId,
        eventId: payload.eventId,
        activityId: payload.activityId,
      });
      closeModal();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao confirmar presença';
      setState((prev) => ({ ...prev, error: message, isConfirming: false }));
    }
  }

  if (!context) {
    return <PresenceContextMissing />;
  }

  const { eventId, activityId, eventName, activityTitle } = context;

  function handleBack() {
    router.push(buildListParticipantsPath(eventId, activityId));
  }

  return (
    <AppPageContainer>
      <IconButton
        onClick={handleBack}
        aria-label="Voltar"
        sx={{ alignSelf: 'flex-start', color: colorTokens.text.primary }}
      >
        <ArrowBackRoundedIcon />
      </IconButton>

      <ContentCard sx={{ gap: 3 }}>
        <PresenceValidationHeader
          eventName={eventName}
          activityTitle={activityTitle}
        />
        <PresenceScannerPanel
          paused={state.modalOpen}
          scanKey={scanKey}
          onScan={handleScan}
        />
      </ContentCard>

      <PresenceScanModal
        open={state.modalOpen}
        scanResult={state.result}
        onClose={closeModal}
        onConfirm={handleConfirmPresence}
        isConfirming={state.isConfirming}
        confirmError={state.error}
      />
    </AppPageContainer>
  );
}
