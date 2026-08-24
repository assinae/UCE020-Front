import { Box } from '@mui/material';
import { ContentCard } from '@/components/layout/ContentCard';
import { CertificateStatCard } from './CertificateStatCard';
import type { CertificateManagementRole } from '@/types/certificate-management';

interface CertificateStatsRowProps {
  stats: { role: CertificateManagementRole; label: string; value: number }[];
}

export function CertificateStatsRow({ stats }: CertificateStatsRowProps) {
  return (
    <ContentCard sx={{ p: 2, height: '100%', justifyContent: 'center' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
          justifyItems: 'center',
          gap: { xs: 1, sm: 1.25 },
          height: '100%',
          width: '100%',
        }}
      >
        {stats.map((stat) => (
          <CertificateStatCard key={stat.role} {...stat} />
        ))}
      </Box>
    </ContentCard>
  );
}
