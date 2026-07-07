import { Box } from '@mui/material';
import { ROLE_TAB_OPTIONS, type CertificateRoleTab } from '../utils/certificateFilters';

interface CertificateFilterTabsProps {
  activeTab: CertificateRoleTab;
  onChange: (tab: CertificateRoleTab) => void;
}

export function CertificateFilterTabs({ activeTab, onChange }: CertificateFilterTabsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        overflowX: 'auto',
        pb: 0.5,
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {ROLE_TAB_OPTIONS.map((tab) => (
        <Box
          key={tab}
          onClick={() => onChange(tab)}
          sx={{
            px: 1.5,
            py: 0.75,
            borderRadius: '20px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontSize: 12,
            fontWeight: activeTab === tab ? 600 : 500,
            bgcolor: activeTab === tab ? '#0F1D35' : 'transparent',
            color: activeTab === tab ? '#fff' : '#64748B',
            transition: 'all 0.15s',
          }}
        >
          {tab}
        </Box>
      ))}
    </Box>
  );
}
