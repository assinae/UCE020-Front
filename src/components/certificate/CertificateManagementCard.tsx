import { Box, Card, CardContent, Typography, IconButton, Tooltip } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import { CertificateBadge } from '@/features/certificate/components/certificateBadge';
import { CERTIFICATE_ROLE_COLORS, CERTIFICATE_STATUS_META } from '@/mocks/certificate-management';
import type { CertificateManagementItem } from '@/types/certificate-management';
import { formatBahiaDate } from '@/utils/date';

interface CertificateManagementCardProps {
  certificate: CertificateManagementItem;
  onView: (certificate: CertificateManagementItem) => void;
  onDownload: (certificate: CertificateManagementItem) => void;
}

const ACTION_BUTTON_SX = {
  border: '1px solid #E8EDF2',
  borderRadius: '10px',
  width: 34,
  height: 34,
  color: '#475569',
  bgcolor: '#FFFFFF',
  transition: 'all 0.15s ease',
  '&:hover': {
    borderColor: '#2EC4A0',
    color: '#2EC4A0',
    bgcolor: '#F0FDF9',
  },
};

export function CertificateManagementCard({
  certificate,
  onView,
  onDownload,
}: CertificateManagementCardProps) {
  const roleStyle = CERTIFICATE_ROLE_COLORS[certificate.role];
  const statusStyle = CERTIFICATE_STATUS_META[certificate.status];

  const initials = certificate.participantName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <Card
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: 1.5,
        py: { xs: 1.75, sm: 2 },
        pl: { xs: 1.75, sm: 2.25 },
        pr: { xs: 1.75, sm: 2 },
        borderRadius: '16px',
        border: '1px solid #EEF1F5',
        bgcolor: '#FFFFFF',
        boxShadow: 'none',
        transition: 'border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          bgcolor: '#2EC4A0',
        },
        '&:hover': {
          borderColor: 'rgba(46, 196, 160, 0.45)',
          boxShadow: '0 6px 18px rgba(15, 29, 53, 0.07)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.5, flex: 1, minWidth: 0, alignItems: 'flex-start' }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '14px',
            bgcolor: roleStyle.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
            color: roleStyle.color,
            flexShrink: 0,
          }}
        >
          {initials}
        </Box>

        <CardContent sx={{ p: '0 !important', flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#0F1D35', lineHeight: 1.3 }}>
              {certificate.participantName}
            </Typography>
            <CertificateBadge label={certificate.role} bgcolor={roleStyle.bg} color={roleStyle.color} />
          </Box>

          <Typography noWrap sx={{ fontSize: 12, color: '#475569', mt: 0.5, fontWeight: 500 }}>
            {certificate.title}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.75, sm: 1.5 },
              flexWrap: 'wrap',
              mt: 0.75,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
              <MailOutlineRoundedIcon sx={{ fontSize: 13, color: '#94A3B8', flexShrink: 0 }} />
              <Typography noWrap sx={{ fontSize: 11.5, color: '#64748B' }}>
                {certificate.participantEmail}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: '#94A3B8', flexShrink: 0 }} />
              <Typography sx={{ fontSize: 11.5, color: '#64748B' }}>
                {certificate.hours ? `${certificate.hours}h  •  ` : ''}
                Emitido em {formatBahiaDate(certificate.issueDate)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 1 }}>
            <CertificateBadge label={statusStyle.label} bgcolor={statusStyle.bg} color={statusStyle.color} />
          </Box>
        </CardContent>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: { xs: 'flex-end', sm: 'flex-start' },
          gap: 0.75,
          flexShrink: 0,
          pt: { xs: 1.25, sm: 0 },
          mt: { xs: 0.5, sm: 0 },
          borderTop: { xs: '1px dashed #EEF1F5', sm: 'none' },
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
