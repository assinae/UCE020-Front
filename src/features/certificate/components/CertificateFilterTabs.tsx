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
        gap: 0.5,
        overflowX: 'auto',
        p: 0.5,
        bgcolor: '#F1F5F9',
        borderRadius: '14px',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {ROLE_TAB_OPTIONS.map((tab) => (
        <Box
          key={tab}
          onClick={() => onChange(tab)}
          sx={{
            flex: { xs: '0 0 auto', lg: 1 },
            textAlign: 'center',
            px: { xs: 1.75, lg: 2 },
            py: 0.85,
            borderRadius: '10px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontSize: 12,
            fontWeight: activeTab === tab ? 700 : 500,
            bgcolor: activeTab === tab ? '#FFFFFF' : 'transparent',
            color: activeTab === tab ? '#0F1D35' : '#64748B',
            boxShadow: activeTab === tab ? '0 1px 3px rgba(15, 29, 53, 0.10)' : 'none',
            transition: 'all 0.15s ease',
            '&:hover': {
              color: activeTab === tab ? '#0F1D35' : '#0F1D35',
            },
          }}
        >
          {tab}
        </Box>
      ))}
    </Box>
  );
}