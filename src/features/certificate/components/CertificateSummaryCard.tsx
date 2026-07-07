import { Box, Typography } from '@mui/material';
import { ContentCard } from '@/components/layout/ContentCard';
import { CERTIFICATE_STATUS_META } from '@/mocks/certificate-management';

interface CertificateSummaryCardProps {
  totalIssued: number;
  statusTotals: { pendente: number; assinado: number; encaminhado: number };
}

export function CertificateSummaryCard({ totalIssued, statusTotals }: CertificateSummaryCardProps) {
  const badges = [
    { key: 'Pendentes', value: statusTotals.pendente, ...CERTIFICATE_STATUS_META.Pendente },
    { key: 'Assinados', value: statusTotals.assinado, ...CERTIFICATE_STATUS_META.Assinado },
    {
      key: 'Encaminhados',
      value: statusTotals.encaminhado,
      ...CERTIFICATE_STATUS_META.Encaminhado,
    },
  ];

  return (
    <ContentCard sx={{ py: 2, alignItems: 'center' }}>
      <Typography sx={{ fontSize: 12, color: '#64748B', textAlign: 'center' }}>
        Total de certificados gerados
      </Typography>
      <Typography sx={{ fontSize: 36, fontWeight: 700, color: '#2EC4A0', lineHeight: 1.2 }}>
        {totalIssued}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
        {badges.map((badge) => (
          <Box
            key={badge.key}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: badge.bg,
              px: 1.5,
              py: 0.5,
              borderRadius: '20px',
            }}
          >
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: badge.color }} />
            <Typography sx={{ fontSize: 10, fontWeight: 600, color: badge.color }}>
              {badge.value} {badge.key}
            </Typography>
          </Box>
        ))}
      </Box>
    </ContentCard>
  );
}
