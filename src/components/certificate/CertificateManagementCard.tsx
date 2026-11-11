import { Box, Card, CardContent, Typography, IconButton, Tooltip, alpha } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { CertificateBadge } from '@/features/certificate/components/certificateBadge';
import { CERTIFICATE_ROLE_COLORS, CERTIFICATE_STATUS_META } from '@/mocks/certificate-management';
import type { CertificateManagementItem } from '@/types/certificate-management';
import { formatBahiaDate } from '@/utils/date';
import { colorTokens } from '@/lib/colors';

interface CertificateManagementCardProps {
  certificate: CertificateManagementItem;
  onView: (certificate: CertificateManagementItem) => void;
  onDownload: (certificate: CertificateManagementItem) => void;
}

const ACTION_BUTTON_SX = {
  border: `1px solid ${alpha(colorTokens.navigation.default, 0.1)}`,
  borderRadius: '11px',
  width: 38,
  height: 38,
  color: colorTokens.text.muted,
  bgcolor: colorTokens.surface.panel,
  transition: 'background-color 0.15s ease, color 0.15s ease, transform 0.15s ease',
  '&:hover': {
    color: colorTokens.brand.secondary,
    bgcolor: colorTokens.surface.mintSubtle,
    transform: 'translateY(-1px)',
  },
};

export function CertificateManagementCard({
  certificate,
  onView,
  onDownload,
}: CertificateManagementCardProps) {
  const roleStyle = CERTIFICATE_ROLE_COLORS[certificate.role];
  const statusStyle = CERTIFICATE_STATUS_META[certificate.status];

  return (
    <Card
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: { xs: 1.1, sm: 1.5 },
        py: { xs: 1.25, sm: 1.5 },
        pl: { xs: 1.5, sm: 1.75 },
        pr: { xs: 1.25, sm: 1.5 },
        borderRadius: { xs: '16px', sm: '18px' },
        border: `1px solid ${alpha(colorTokens.navigation.default, 0.065)}`,
        bgcolor: colorTokens.neutral.white,
        boxShadow: `0 3px 12px ${alpha(colorTokens.shadow.ink, 0.035)}`,
        transition: 'border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
        '&:hover': {
          borderColor: alpha(colorTokens.brand.secondary, 0.24),
          boxShadow: `0 8px 22px ${alpha(colorTokens.shadow.ink, 0.075)}`,
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: { xs: 1.1, sm: 1.5 }, flex: 1, minWidth: 0, alignItems: 'center' }}>
        <Box
          sx={{
            width: { xs: 40, sm: 44 },
            height: { xs: 40, sm: 44 },
            borderRadius: '14px',
            border: `1px solid ${alpha(roleStyle.color, 0.08)}`,
            bgcolor: roleStyle.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: roleStyle.color,
            flexShrink: 0,
            boxShadow: `inset 0 0 0 1px ${alpha(roleStyle.color, 0.12)}`,
          }}
        >
          <WorkspacePremiumOutlinedIcon sx={{ fontSize: { xs: 23, sm: 25 } }} />
        </Box>

        <CardContent sx={{ p: '0 !important', flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 15, fontWeight: 800, color: colorTokens.text.heading, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
              {certificate.participantName}
            </Typography>
            <CertificateBadge label={certificate.role} bgcolor={roleStyle.bg} color={roleStyle.color} />
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, px: 0.9, height: 21, borderRadius: '999px', bgcolor: statusStyle.bg, color: statusStyle.color }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: statusStyle.color }} />
              <Typography sx={{ fontSize: 10, fontWeight: 700, lineHeight: 1 }}>{statusStyle.label}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.55, minWidth: 0 }}>
            <Typography noWrap sx={{ fontSize: 12.5, color: colorTokens.text.heading, fontWeight: 500, minWidth: 0 }}>
              {certificate.title}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.8, sm: 1.5 },
              flexWrap: 'wrap',
              mt: 0.65,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
              <MailOutlineRoundedIcon sx={{ fontSize: 13, color: colorTokens.text.icon, flexShrink: 0 }} />
              <Typography noWrap sx={{ fontSize: 11, color: colorTokens.text.muted }}>
                {certificate.participantEmail}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: colorTokens.text.icon, flexShrink: 0 }} />
              <Typography noWrap sx={{ fontSize: 11, color: colorTokens.text.muted }}>
                {certificate.hours ? `${certificate.hours}h  •  ` : ''}
                Emitido em {formatBahiaDate(certificate.issueDate)}
              </Typography>
            </Box>
          </Box>

        </CardContent>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 0.5,
          flexShrink: 0,
          pt: 0,
          mt: 0,
        }}
      >
        <Tooltip title="Visualizar">
          <IconButton onClick={() => onView(certificate)} size="small" sx={ACTION_BUTTON_SX}>
            <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Baixar">
          <span>
            <IconButton
              onClick={() => onDownload(certificate)}
              size="small"
              sx={ACTION_BUTTON_SX}
            >
              <DownloadOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Card>
  );
}
