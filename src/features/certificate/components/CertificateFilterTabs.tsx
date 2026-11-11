import { Box, ButtonBase, alpha } from '@mui/material';
import { ROLE_TAB_OPTIONS, type CertificateRoleTab } from '../utils/certificateFilters';
import { colorTokens } from '@/lib/colors';

interface CertificateFilterTabsProps {
  activeTab: CertificateRoleTab;
  onChange: (tab: CertificateRoleTab) => void;
}

export function CertificateFilterTabs({ activeTab, onChange }: CertificateFilterTabsProps) {
  return (
    <Box
      role="tablist"
      aria-label="Filtrar certificados por perfil"
      sx={{
        display: 'flex',
        gap: 0.75,
        overflowX: 'auto',
        p: 0.65,
        bgcolor: colorTokens.surface.muted,
        borderRadius: '999px',
        border: `1px solid ${alpha(colorTokens.navigation.default, 0.06)}`,
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {ROLE_TAB_OPTIONS.map((tab) => (
        <ButtonBase
          key={tab}
          role="tab"
          aria-selected={activeTab === tab}
          onClick={() => onChange(tab)}
          sx={{
            flex: { xs: '0 0 auto', lg: 1 },
            textAlign: 'center',
            justifyContent: 'center',
            px: { xs: 1.8, lg: 1.25 },
            py: 1,
            borderRadius: '999px',
            whiteSpace: 'nowrap',
            fontSize: 12.5,
            fontWeight: activeTab === tab ? 800 : 600,
            bgcolor: activeTab === tab ? colorTokens.neutral.white : 'transparent',
            color: activeTab === tab ? colorTokens.text.heading : colorTokens.text.muted,
            boxShadow: activeTab === tab ? `0 3px 10px ${alpha(colorTokens.shadow.ink, 0.08)}` : 'none',
            transition: 'background-color .18s ease, color .18s ease, box-shadow .18s ease',
            '&:hover': {
              color: colorTokens.text.heading,
            },
          }}
        >
          {tab}
        </ButtonBase>
      ))}
    </Box>
  );
}
