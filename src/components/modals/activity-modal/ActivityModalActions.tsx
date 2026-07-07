import { Box } from '@mui/material';
import { Button } from '@/components/ui';
import type { ActivityModalProps } from '@/types/activity';

type ActivityModalActionsProps = Pick<
  ActivityModalProps,
  | 'variant'
  | 'onSignup'
  | 'onCancelParticipation'
  | 'onMarkPresence'
  | 'onValidatePresences'
  | 'onListParticipants'
>;

const actionButtonSx = {
  height: 36,
  fontSize: 'clamp(10px, 3vw, 12px)',
} as const;

export function ActivityModalActions({
  variant,
  onSignup,
  onCancelParticipation,
  onMarkPresence,
  onValidatePresences,
  onListParticipants,
}: ActivityModalActionsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'center',
        gap: 1,
        width: '100%',
        mt: 'auto',
      }}
    >
      {variant === 'signup' && (
        <Button
          variant="contained"
          color="secondary"
          onClick={onSignup}
          fullWidth
          sx={{ ...actionButtonSx, maxWidth: { xs: '100%', sm: 160 }, alignSelf: 'center' }}
        >
          Inscrever-se
        </Button>
      )}

      {variant === 'manage' && (
        <>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onCancelParticipation}
            sx={{ ...actionButtonSx, flex: 1 }}
          >
            Cancelar participação
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={onMarkPresence}
            sx={{ ...actionButtonSx, flex: 1 }}
          >
            Marcar Presença
          </Button>
        </>
      )}

      {variant === 'monitor' && (
        <Button
          variant="contained"
          color="secondary"
          onClick={onValidatePresences}
          fullWidth
          sx={actionButtonSx}
        >
          Validar Presenças
        </Button>
      )}

      {variant === 'organizer' && (
        <Button
          variant="contained"
          color="secondary"
          onClick={onListParticipants}
          fullWidth
          sx={actionButtonSx}
        >
          Participantes
        </Button>
      )}
    </Box>
  );
}
