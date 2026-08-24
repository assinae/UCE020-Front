import { Box, Typography } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Button } from '@/components/ui';
import type { ActivityModalProps } from '@/types/activity';

type ActivityModalActionsProps = Pick<
  ActivityModalProps,
  | 'variant'
  | 'presenceConfirmed'
  | 'onSignup'
  | 'onCancelParticipation'
  | 'onMarkPresence'
  | 'onValidatePresences'
  | 'onListParticipants'
  | 'isLoading'
>;

const actionButtonSx = {
  height: 44,
  fontSize: 'clamp(12px, 3vw, 14px)',
  width: { xs: '100%', sm: 'auto' },
  minWidth: { xs: 0, sm: 160 },
} as const;

export function ActivityModalActions({
  variant,
  presenceConfirmed,
  onSignup,
  onCancelParticipation,
  onMarkPresence,
  onValidatePresences,
  onListParticipants,
  isLoading,
}: ActivityModalActionsProps) {
  // Participante inscrito com presença já confirmada: nenhuma ação disponível,
  // apenas o status "Presença registrada".
  if (variant === 'manage' && presenceConfirmed) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          mt: 3,
          width: '100%',
          py: 1.5,
          borderRadius: '12px',
          bgcolor: 'rgba(16, 185, 129, 0.12)',
          color: 'success.main',
        }}
      >
        <CheckCircleRoundedIcon sx={{ fontSize: 22 }} />
        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Presença registrada</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1.5,
        flexWrap: 'wrap',
        mt: 3,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {variant === 'signup' && (
        <Button sx={actionButtonSx} onClick={onSignup} disabled={Boolean(isLoading)}>
          Inscrever-se
        </Button>
      )}

      {variant === 'manage' && (
        <>
          <Button
            sx={actionButtonSx}
            variant="outlined"
            onClick={onCancelParticipation}
            disabled={Boolean(isLoading)}
          >
            Cancelar participação
          </Button>

          <Button sx={actionButtonSx} onClick={onMarkPresence} disabled={Boolean(isLoading)}>
            Marcar Presença
          </Button>
        </>
      )}

      {variant === 'monitor' && (
        <Button sx={actionButtonSx} onClick={onValidatePresences}>
          Validar Presenças
        </Button>
      )}

      {variant === 'organizer' && (
        <Button sx={actionButtonSx} onClick={onListParticipants}>
          Participantes
        </Button>
      )}
    </Box>
  );
}