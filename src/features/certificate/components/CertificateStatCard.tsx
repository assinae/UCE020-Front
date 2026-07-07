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
};

interface CertificateStatCardProps {
  role: CertificateManagementRole;
  label: string;
  value: number;
  isLast?: boolean;
}

export function CertificateStatCard({ role, label, value, isLast }: CertificateStatCardProps) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: { xs: '70px', sm: 'auto' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
        px: 0.5,
        py: 1.5,
        position: 'relative',
        '&::after': isLast
          ? undefined
          : {
              content: '""',
              position: 'absolute',
              right: 0,
              top: '20%',
              height: '60%',
              width: '1px',
              bgcolor: '#E5E7EB',
              display: { xs: 'none', sm: 'block' },
            },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: '#E8F5F2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 0.5,
        }}
      >
        {ROLE_ICONS[role]}
      </Box>
      <Typography sx={{ fontSize: { xs: 10, sm: 11 }, color: '#64748B', textAlign: 'center' }}>
        {label}
      </Typography>
      <Typography
        sx={{ fontSize: { xs: 16, sm: 20 }, fontWeight: 700, color: '#0F1D35', lineHeight: 1 }}
      >
        {value}
      </Typography>
      <Box sx={{ width: 32, height: 2.5, bgcolor: '#2EC4A0', borderRadius: 2, mt: 0.5 }} />
    </Box>
  );
}
