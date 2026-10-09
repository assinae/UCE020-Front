import { Box, alpha } from '@mui/material';
import { SkeletonBone as Bone } from '@/components/ui';
import { colorTokens } from '@/lib/colors';

const INK = colorTokens.navigation.default;

export function EventTicketSkeleton({ variant = 'compact' }: { variant?: 'featured' | 'compact' }) {
  const featured = variant === 'featured';
  const inset = featured ? 18 : 16;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: featured ? '24px' : '22px',
        bgcolor: colorTokens.neutral.white,
        boxShadow: featured
          ? `0 10px 28px ${alpha(colorTokens.shadow.ink, 0.1)}`
          : `0 4px 14px ${alpha(colorTokens.shadow.ink, 0.06)}`,
      }}
    >
      {featured && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            px: 2.25,
            py: 1.5,
            bgcolor: colorTokens.navigation.deep,
          }}
        >
          <Bone dark sx={{ width: 110, height: 12 }} />
          <Bone dark sx={{ width: 70, height: 12 }} />
        </Box>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, p: `16px ${inset}px 14px` }}>
        {!featured && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Bone sx={{ width: 80, height: 11 }} />
            <Bone sx={{ width: 64, height: 20 }} />
          </Box>
        )}
        <Bone sx={{ width: '75%', height: featured ? 22 : 18 }} />
      </Box>
      <Box sx={{ mx: `${inset}px`, borderTop: `2px dashed ${alpha(INK, 0.12)}` }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, p: `13px ${inset}px 15px` }}>
        <Bone sx={{ width: 50, height: 50, borderRadius: '14px', flexShrink: 0 }} />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Bone sx={{ width: '55%', height: 12 }} />
          <Bone sx={{ width: '70%', height: 10 }} />
        </Box>
        <Bone sx={{ width: 38, height: 38, flexShrink: 0 }} />
      </Box>
    </Box>
  );
}
