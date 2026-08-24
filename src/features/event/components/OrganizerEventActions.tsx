'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { Box } from '@mui/material';
import { Button } from '@/components/ui';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { eventService } from '@/services/eventService';
import { certificateService } from '@/services/certificate.service';

const actionButtonSx = {
  height: 36,
  fontSize: 'clamp(10px, 3vw, 12px)',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  flex: 1,
} as const;

interface OrganizerEventActionsProps {
  eventId: number;
  isFinalized?: boolean;
  onFinalized?: () => void;
  onFinalizeError?: (message: string) => void;
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error) && typeof error.response?.data?.message === 'string') {
    return error.response.data.message;
  }
  return fallback;
}

export function OrganizerEventActions({ eventId, isFinalized = false, onFinalized, onFinalizeError }: OrganizerEventActionsProps) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  function onManageMembers() {
    router.push(`/event/${eventId}/manage-users`);
  }

  function onEditEvent() {
    router.push(`/event/${eventId}/edit`);
  }

  function onViewCertificates() {
    router.push(`/certificate/generated/${eventId}`);
  }

  async function onFinalizeEvent() {
    setIsFinalizing(true);
    try {
      await eventService.finalize(eventId);

      // Gera os certificados na sequência. Cada chamada é best-effort — um
      // evento/atividade sem ninguém a certificar (ex: atividade sem convidado)
      // não deve impedir a navegação para a tela de certificados gerados.
      const evento = await eventService.findOne(eventId).catch(() => null);
      const activityIds = evento?.atividades?.map((activity) => activity.id) ?? [];

      await Promise.allSettled([
        certificateService.generateParticipantCertificates(eventId),
        ...activityIds.map((activityId) => certificateService.generateGuestCertificates(activityId)),
      ]);

      onFinalized?.();
      router.push(`/certificate/generated/${eventId}`);
    } catch (error) {
      onFinalizeError?.(extractErrorMessage(error, 'Não foi possível finalizar o evento'));
    } finally {
      setIsFinalizing(false);
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1.5,
        flexWrap: 'wrap',
        px: { xs: 2, sm: 3 },
        py: 2,
        justifyContent: 'flex-start',
        alignItems: { xs: 'stretch', sm: 'center' },
      }}
    >
      <Button
        onClick={onManageMembers}
        variant="contained"
        color="secondary"
        sx={{ ...actionButtonSx, minWidth: 160, textTransform: 'none', borderRadius: '10px' }}
      >
        Gerenciar usuários
      </Button>
      {!isFinalized && (
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={onEditEvent}
          sx={{ ...actionButtonSx }}
        >
          Editar
        </Button>
      )}
      {isFinalized && (
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={onViewCertificates}
          sx={{ ...actionButtonSx }}
        >
          Certificados Gerados
        </Button>
      )}
      {!isFinalized && (
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={() => setIsConfirmOpen(true)}
          sx={{ ...actionButtonSx }}
        >
          Finalizar
        </Button>
      )}

      <ConfirmModal
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        message="Tem certeza que deseja finalizar este evento?"
        emphasisEndText="Essa ação não pode ser desfeita."
        confirmText="Finalizar"
        cancelText="Cancelar"
        isLoading={isFinalizing}
        onConfirm={onFinalizeEvent}
        type="warning"
      />
    </Box>
  );
}