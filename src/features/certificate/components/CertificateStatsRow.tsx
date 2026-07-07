import { Box } from '@mui/material';
import { ContentCard } from '@/components/layout/ContentCard';
import { CertificateStatCard } from './CertificateStatCard';
import type { CertificateManagementRole } from '@/types/certificate-management';

interface CertificateStatsRowProps {
  stats: { role: CertificateManagementRole; label: string; value: number }[];
}

export function CertificateStatsRow({ stats }: CertificateStatsRowProps) {
  return (
    <ContentCard sx={{ p: 1.5, overflowX: 'auto' }}>
      <Box
        sx={{ display: 'flex', gap: { xs: 1, sm: 0 }, minWidth: { xs: 'max-content', sm: '100%' } }}
      >
        {stats.map((stat, index) => (
          <CertificateStatCard key={stat.role} {...stat} isLast={index === stats.length - 1} />
        ))}
      </Box>
    </ContentCard>
  );
}
