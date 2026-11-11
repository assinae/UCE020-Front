import { Box, Button, CircularProgress, Typography } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import { colorTokens } from '@/lib/colors';
import type { ActivityModalProps } from '@/types/activity';

type ActivityModalActionsProps = Pick<
  ActivityModalProps,
  | 'variant'
  | 'status'
  | 'presenceConfirmed'
  | 'generateCertificate'
  | 'onSignup'
  | 'onCancelParticipation'
  | 'onMarkPresence'
  | 'onValidatePresences'
  | 'onListParticipants'
  | 'onGenerateCertificates'
  | 'onViewReport'
  | 'isLoading'
  | 'isGeneratingCertificates'
>;

const pillSx = {
  width: '100%',
  minHeight: 50,
  px: 2.5,
  borderRadius: 99,
  fontSize: 14.5,
  fontWeight: 700,
  textTransform: 'none',
  letterSpacing: 0,
  gap: 1,
  '&.Mui-disabled': { opacity: 0.5 },
} as const;

const primarySx = {
  ...pillSx,
  color: '#FFFFFF',
  bgcolor: colorTokens.brand.secondary,
  boxShadow: '0 8px 20px rgba(0, 137, 99, 0.28)',
  // Cor explícita no hover: o tema deixa o texto de botões azul ao passar o mouse.
  '&:hover': {
    color: '#FFFFFF',
    bgcolor: colorTokens.brand.secondaryDark,
    boxShadow: '0 10px 24px rgba(0, 137, 99, 0.34)',
  },
  '&.Mui-disabled': { color: '#FFFFFF', bgcolor: colorTokens.brand.secondary, opacity: 0.45 },
} as const;

const secondarySx = {
  ...pillSx,
  minHeight: 46,
  fontSize: 13.5,
  color: colorTokens.text.heading,
  border: '1.5px solid rgba(13, 30, 59, 0.14)',
  bgcolor: '#FFFFFF',
  '&:hover': { borderColor: colorTokens.brand.secondary, bgcolor: colorTokens.surface.mintSubtle, color: colorTokens.brand.secondary },
} as const;

const dangerGhostSx = {
  ...pillSx,
  minHeight: 42,
  fontSize: 13.5,
  color: colorTokens.status.error,
  '&:hover': { color: colorTokens.status.error, bgcolor: colorTokens.surface.dangerSubtle },
} as const;

export function ActivityModalActions({
  variant,
  status,
  presenceConfirmed,
  generateCertificate,
  onSignup,
  onCancelParticipation,
  onMarkPresence,
  onValidatePresences,
  onListParticipants,
  onGenerateCertificates,
  onViewReport,
  isLoading,
  isGeneratingCertificates,
}: ActivityModalActionsProps) {
  const isFinalized = (status ?? '').trim().toLowerCase() === 'finalizada';
  const canGenerateCertificates = Boolean(generateCertificate) && isFinalized;
  const busy = Boolean(isLoading);
  const spinner = busy ? <CircularProgress size={16} color="inherit" /> : null;

  let content: React.ReactNode = null;

  if (variant === 'manage' && presenceConfirmed) {
    // Participante com presença confirmada: só o status, sem ações.
    content = (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          py: 1.5,
          borderRadius: 99,
          bgcolor: colorTokens.surface.mint,
          color: colorTokens.text.mint,
        }}
      >
        <CheckCircleRoundedIcon sx={{ fontSize: 20 }} />
        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>Presença registrada</Typography>
      </Box>
    );
  } else if (variant === 'signup') {
    content = (
      <Button disableElevation onClick={onSignup} disabled={busy} sx={primarySx}>
        {spinner}
        Inscrever-se na atividade
      </Button>
    );
  } else if (variant === 'manage') {
    content = (
      <>
        <Button disableElevation onClick={onMarkPresence} disabled={busy} sx={primarySx}>
          <QrCode2RoundedIcon sx={{ fontSize: 20 }} />
          Marcar presença
        </Button>
        <Button onClick={onCancelParticipation} disabled={busy} sx={dangerGhostSx}>
          Cancelar participação
        </Button>
      </>
    );
  } else if (variant === 'monitor') {
    // Botão indisponível não aparece (em vez de ficar apagado).
    content = !isFinalized ? (
      <Button disableElevation onClick={onValidatePresences} sx={primarySx}>
        <QrCodeScannerRoundedIcon sx={{ fontSize: 20 }} />
        Validar presenças
      </Button>
    ) : null;
  } else if (variant === 'organizer') {
    // "Validar presenças" e "Participantes" abrem a mesma lista; o organizador
    // vê só "Participantes", que também é por onde ele valida presença.
    const extraActions = [
      canGenerateCertificates ? (
        <Button
          key="certificates"
          onClick={onGenerateCertificates}
          disabled={Boolean(isGeneratingCertificates)}
          sx={secondarySx}
        >
          {isGeneratingCertificates ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <WorkspacePremiumRoundedIcon sx={{ fontSize: 18 }} />
          )}
          {isGeneratingCertificates ? 'Gerando...' : 'Gerar certificados'}
        </Button>
      ) : null,
      isFinalized ? (
        <Button key="report" onClick={onViewReport} sx={secondarySx}>
          <AssessmentRoundedIcon sx={{ fontSize: 18 }} />
          Relatório
        </Button>
      ) : null,
    ].filter(Boolean);

    content = (
      <>
        <Button disableElevation onClick={onListParticipants} sx={primarySx}>
          <FormatListBulletedRoundedIcon sx={{ fontSize: 20 }} />
          Participantes
        </Button>
        {extraActions.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'minmax(0, 1fr)',
                sm: `repeat(${extraActions.length}, minmax(0, 1fr))`,
              },
              gap: 1,
            }}
          >
            {extraActions}
          </Box>
        ) : null}
      </>
    );
  }

  if (!content) return null;

  return (
    <Box
      sx={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        px: { xs: 2.25, sm: 3 },
        pt: 1.75,
        pb: { xs: 2.25, sm: 2.75 },
        borderTop: '1px solid rgba(13, 30, 59, 0.08)',
        bgcolor: '#FFFFFF',
      }}
    >
      {content}
      {isFinalized && variant === 'monitor' ? (
        <Typography sx={{ textAlign: 'center', fontSize: 12, color: colorTokens.text.label }}>
          Atividade finalizada: as presenças não podem mais ser alteradas.
        </Typography>
      ) : null}
    </Box>
  );
}
