import { useState } from 'react';
import { Box } from '@mui/material';
import { CertificateStatCard } from './CertificateStatCard';
import type { CertificateManagementRole } from '@/types/certificate-management';
import type { CertificateRoleTab } from '../utils/certificateFilters';

interface CertificateStatsRowProps {
  stats: { role: CertificateManagementRole; label: string; value: number }[];
  total: number;
  activeTab: CertificateRoleTab;
  onSelect: (tab: CertificateRoleTab) => void;
}

const ROLE_TABS: Record<CertificateManagementRole, CertificateRoleTab> = {
  Ouvinte: 'Ouvintes',
  Monitor: 'Monitores',
  Organizador: 'Organizadores',
  Palestrante: 'Palestrantes',
  Ministrante: 'Ministrantes',
  Moderador: 'Moderadores',
};

export function CertificateStatsRow({ stats, total, activeTab, onSelect }: CertificateStatsRowProps) {
  const [smallTabs, setSmallTabs] = useState<CertificateRoleTab[]>(() =>
    stats.map((stat) => ROLE_TABS[stat.role]),
  );
  const options = [
    { label: 'Todos', value: total, tab: 'Todos' as CertificateRoleTab },
    ...stats.map((stat) => ({
      label: stat.label,
      value: stat.value,
      tab: ROLE_TABS[stat.role],
    })),
  ];
  const activeOption = options.find((option) => option.tab === activeTab) ?? options[0];
  const optionsByTab = new Map(options.map((option) => [option.tab, option]));
  const smallOptions = smallTabs.flatMap((tab) => {
    const option = optionsByTab.get(tab);
    return option ? [option] : [];
  });

  const handleSelect = (tab: CertificateRoleTab) => {
    if (tab === activeTab) return;
    setSmallTabs((current) => current.map((currentTab) => currentTab === tab ? activeTab : currentTab));
    onSelect(tab);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 3fr) minmax(0, 1fr)' },
        gap: { xs: 0.85, sm: 1 },
        width: '100%',
      }}
    >
      <CertificateStatCard
        key={activeOption.tab}
        label={activeOption.label}
        value={activeOption.value}
        isTotal
        selected
        onClick={() => onSelect(activeOption.tab)}
      />
      <Box
        sx={{
          gridColumn: { xs: '1', md: '1' },
          gridRow: { xs: '2', md: '1' },
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(3, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
          gridTemplateRows: { md: 'repeat(2, 48px)' },
          gap: { xs: 0.85, sm: 1 },
        }}
      >
        {smallOptions.map((option) => (
          <CertificateStatCard
            key={option.tab}
            label={option.label}
            value={option.value}
            onClick={() => handleSelect(option.tab)}
          />
        ))}
      </Box>
    </Box>
  );
}
