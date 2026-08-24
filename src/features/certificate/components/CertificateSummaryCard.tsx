import { Box, Typography } from '@mui/material';
import { ContentCard } from '@/components/layout/ContentCard';
import { CERTIFICATE_STATUS_META } from '@/mocks/certificate-management';

interface CertificateSummaryCardProps {
  totalIssued: number;
  statusTotals: { pendente: number; assinado: number };
}

export function CertificateSummaryCard({ totalIssued, statusTotals }: CertificateSummaryCardProps) {
  const badges = [
    { key: 'Pendentes', value: statusTotals.pendente, ...CERTIFICATE_STATUS_META.Pendente },
    { key: 'Assinados', value: statusTotals.assinado, ...CERTIFICATE_STATUS_META.Assinado },
  ];

  return (
    <ContentCard sx={{ py: 2.5, height: '100%', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
      <Typography
        sx={{
          fontSize: 11,
          color: '#64748B',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontWeight: 600,
        }}
      >
        Total de certificados gerados
      </Typography>
      <Typography sx={{ fontSize: 48, fontWeight: 800, color: '#2EC4A0', lineHeight: 1 }}>
        {totalIssued}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
        {badges.map((badge) => (
          <Box
            key={badge.key}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              bgcolor: badge.bg,
              px: 1.5,
              py: 0.65,
              borderRadius: '999px',
            }}
          >
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: badge.color }} />
            <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: badge.color }}>
              {badge.value}
            </Typography>
            <Typography sx={{ fontSize: 11.5, fontWeight: 500, color: badge.color, opacity: 0.85 }}>
              {badge.key}
            </Typography>
          </Box>
        ))}
      </Box>
    </ContentCard>
  );
}
