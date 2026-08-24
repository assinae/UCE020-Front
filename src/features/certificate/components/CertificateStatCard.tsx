import { Box, Typography } from '@mui/material';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import type { CertificateManagementRole } from '@/types/certificate-management';

const ROLE_ICONS: Record<CertificateManagementRole, React.ReactNode> = {
  Ouvinte: <PeopleOutlineIcon sx={{ fontSize: 20, color: '#2EC4A0' }} />,
  Monitor: <SupervisorAccountOutlinedIcon sx={{ fontSize: 20, color: '#2EC4A0' }} />,
  Organizador: <BadgeOutlinedIcon sx={{ fontSize: 20, color: '#2EC4A0' }} />,
  Palestrante: <RecordVoiceOverOutlinedIcon sx={{ fontSize: 20, color: '#2EC4A0' }} />,
  Ministrante: <RecordVoiceOverOutlinedIcon sx={{ fontSize: 20, color: '#2EC4A0' }} />,
  Moderador: <RecordVoiceOverOutlinedIcon sx={{ fontSize: 20, color: '#2EC4A0' }} />,
};

interface CertificateStatCardProps {
  role: CertificateManagementRole;
  label: string;
  value: number;
}

export function CertificateStatCard({ role, label, value }: CertificateStatCardProps) {
  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        maxWidth: { xs: 'none', sm: 160 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.75,
        py: 2,
        px: { xs: 0.5, sm: 1 },
        borderRadius: '16px',
        bgcolor: '#F8FAFC',
        border: '1px solid #EEF1F5',
        transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: 'rgba(46, 196, 160, 0.4)',
          boxShadow: '0 6px 16px rgba(15, 29, 53, 0.06)',
        },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '14px',
          bgcolor: '#E8F5F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {ROLE_ICONS[role]}
      </Box>
      <Typography
        sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 800, color: '#0F1D35', lineHeight: 1 }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: 10.5, sm: 11.5 },
          color: '#64748B',
          textAlign: 'center',
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
