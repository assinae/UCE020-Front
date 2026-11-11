import type { ReactNode } from 'react';
import { Box, ButtonBase, Typography, alpha } from '@mui/material';
import { CERTIFICATE_STATUS_META } from '@/mocks/certificate-management';
import { colorTokens } from '@/lib/colors';

interface CertificateSummaryCardProps {
  groupLabel: string;
  totalIssued: number;
  statusTotals: { pendente: number; assinado: number };
  action: { label: string; icon: ReactNode; onClick: () => void; disabled?: boolean };
}

export function CertificateSummaryCard({ groupLabel, totalIssued, statusTotals, action }: CertificateSummaryCardProps) {
  const badges = [
    { key: 'Pendentes', value: statusTotals.pendente, ...CERTIFICATE_STATUS_META.Pendente },
    { key: 'Assinados', value: statusTotals.assinado, ...CERTIFICATE_STATUS_META.Assinado },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        position: 'relative',
        overflow: 'hidden',
        px: { xs: 2.25, sm: 3.5 },
        py: { xs: 2.5, sm: 3 },
        borderRadius: '28px',
        background: `linear-gradient(118deg, ${colorTokens.navigation.deep} 0%, ${colorTokens.navigation.default} 68%, ${colorTokens.brand.secondary} 140%)`,
        color: colorTokens.neutral.white,
        border: `1px solid ${alpha(colorTokens.navigation.default, 0.08)}`,
        boxShadow: `0 16px 34px ${alpha(colorTokens.navigation.default, 0.18)}`,
        '&:after': {
          content: '""', position: 'absolute', width: 210, height: 210, borderRadius: '50%',
          border: `1px solid ${alpha(colorTokens.neutral.white, 0.08)}`, right: -70, top: -125,
          boxShadow: `0 0 0 28px ${alpha(colorTokens.neutral.white, 0.025)}, 0 0 0 58px ${alpha(colorTokens.neutral.white, 0.02)}`,
          pointerEvents: 'none',
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Typography sx={{ fontSize: { xs: 42, sm: 50 }, fontWeight: 800, color: colorTokens.neutral.white, lineHeight: 1, letterSpacing: '-0.045em' }}>
            {totalIssued}
          </Typography>
          <Box>
            <Typography sx={{ fontSize: 15, color: colorTokens.neutral.white, fontWeight: 800 }}>
              {groupLabel}
            </Typography>
            <Typography sx={{ mt: 0.25, fontSize: 12.5, color: alpha(colorTokens.neutral.white, 0.68), fontWeight: 600 }}>
              Total emitido
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {badges.map((badge) => (
          <Box
            key={badge.key}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              bgcolor: alpha(colorTokens.neutral.white, 0.1),
              px: 1.5,
              py: 0.65,
              borderRadius: '999px',
              border: '1px solid transparent',
            }}
          >
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: badge.key === 'Assinados' ? colorTokens.brand.primary : '#F6C66A' }} />
            <Typography sx={{ fontSize: 11.5, fontWeight: 800, color: colorTokens.neutral.white }}>
              {badge.value}
            </Typography>
            <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: alpha(colorTokens.neutral.white, 0.76) }}>
              {badge.key}
            </Typography>
          </Box>
        ))}
        </Box>
      </Box>
      <ButtonBase
        onClick={action.onClick}
        disabled={action.disabled}
        sx={{
          position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
          width: { xs: '100%', sm: 'auto' }, px: 2.5, py: 1.35, borderRadius: '999px',
          bgcolor: colorTokens.neutral.white, color: colorTokens.navigation.deep,
          fontSize: 13.5, fontWeight: 800, whiteSpace: 'nowrap',
          boxShadow: `0 8px 20px ${alpha(colorTokens.shadow.ink, 0.18)}`,
          '& svg': { fontSize: 18, color: colorTokens.brand.secondary },
          '&:hover': { bgcolor: colorTokens.surface.mintSubtle, transform: 'translateY(-1px)' },
          '&.Mui-disabled': { opacity: 0.55 },
        }}
      >
        {action.icon}{action.label}
      </ButtonBase>
    </Box>
  );
}
