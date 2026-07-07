import { Box, Card, CardContent, Typography, IconButton, Tooltip } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { CertificateBadge } from '@/features/certificate/components/certificateBadge';
import { CERTIFICATE_ROLE_COLORS, CERTIFICATE_STATUS_META } from '@/mocks/certificate-management';
import type { CertificateManagementItem } from '@/types/certificate-management';

interface CertificateManagementCardProps {
  certificate: CertificateManagementItem;
  onView: (certificate: CertificateManagementItem) => void;
  onEdit: (certificate: CertificateManagementItem) => void;
  onDownload: (certificate: CertificateManagementItem) => void;
  onDelete: (certificate: CertificateManagementItem) => void;
}

const ACTION_BUTTON_SX = {
  border: '1.5px solid #E2E8F0',
  borderRadius: '8px',
  width: 32,
  height: 32,
  color: '#0F1D35',
};

export function CertificateManagementCard({
  certificate,
  onView,
  onEdit,
  onDownload,
  onDelete,
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
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'flex-start' },
        gap: 1.5,
        py: 1.5,
        px: 0,
        boxShadow: 'none',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.5, flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            bgcolor: '#E8F5F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            color: '#0F1D35',
            flexShrink: 0,
          }}
        >
          {initials}
        </Box>

        <CardContent sx={{ p: '0 !important', flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#0F1D35' }}>
              {certificate.participantName}
            </Typography>
            <CertificateBadge label={certificate.role} bgcolor={roleStyle.bg} color={roleStyle.color} />
          </Box>

          <Typography sx={{ fontSize: 11, color: '#64748B', wordBreak: 'break-word' }}>
            {certificate.participantEmail}
          </Typography>

          <Typography noWrap sx={{ fontSize: 11, color: '#64748B', mt: 0.25 }}>
            {certificate.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
            <AccessTimeOutlinedIcon sx={{ fontSize: 11, color: '#64748B' }} />
            <Typography sx={{ fontSize: 11, color: '#64748B' }}>
              {certificate.hours ? `Carga horária: ${certificate.hours}h  •  ` : ''}
              Emitido em {new Date(certificate.issueDate).toLocaleDateString('pt-BR')}
            </Typography>
          </Box>

          <Box sx={{ mt: 0.75 }}>
            <CertificateBadge label={statusStyle.label} bgcolor={statusStyle.bg} color={statusStyle.color} />
          </Box>
        </CardContent>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'row', sm: 'column' },
          justifyContent: { xs: 'flex-end', sm: 'flex-start' },
          gap: 0.5,
          flexShrink: 0,
          pt: { xs: 1, sm: 0 },
          borderTop: { xs: '1px dashed #E2E8F0', sm: 'none' },
        }}
      >
        <Tooltip title="Visualizar">
          <IconButton onClick={() => onView(certificate)} size="small" sx={ACTION_BUTTON_SX}>
            <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar">
          <IconButton onClick={() => onEdit(certificate)} size="small" sx={ACTION_BUTTON_SX}>
            <EditOutlinedIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Baixar">
          <IconButton onClick={() => onDownload(certificate)} size="small" sx={ACTION_BUTTON_SX}>
            <DownloadOutlinedIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Excluir">
          <IconButton
            onClick={() => onDelete(certificate)}
            size="small"
            sx={{ ...ACTION_BUTTON_SX, border: '1.5px solid #FECACA', color: '#EF4444' }}
          >
            <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
}