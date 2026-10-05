import Image from 'next/image';
import { Box, alpha } from '@mui/material';
import { SkeletonBone } from '@/components/ui';
import { colorTokens } from '@/lib/colors';

const INK = colorTokens.navigation.default;
const WHITE = colorTokens.neutral.white;

const cardSx = {
  bgcolor: WHITE,
  border: `1px solid ${alpha(INK, 0.06)}`,
  boxShadow: `0 4px 14px ${alpha(colorTokens.shadow.ink, 0.05)}`,
};

function CardBone() {
  return (
    <Box
      sx={{
        ...cardSx,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        py: 2,
        px: 2.25,
        borderRadius: '24px',
      }}
    >
      <SkeletonBone
        sx={{
          width: { xs: 64, md: 76 },
          height: { xs: 64, md: 76 },
          borderRadius: '20px',
          flexShrink: 0,
        }}
      />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.1 }}>
        <SkeletonBone sx={{ width: '58%', height: 14 }} />
        <SkeletonBone sx={{ width: '70%', height: 10 }} />
        <SkeletonBone sx={{ width: '45%', height: 10 }} />
      </Box>
    </Box>
  );
}

/** Ocupa a tela enquanto a sessão é validada, no mesmo formato do app logado. */
export function AppShellSkeleton() {
  return (
    <Box
      role="status"
      aria-label="Carregando"
      sx={{ minHeight: '100dvh', bgcolor: colorTokens.surface.app }}
    >
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          background: colorTokens.navigation.gradient,
        }}
      >
        <Box
          sx={{
            maxWidth: 1180,
            mx: 'auto',
            px: 3,
            py: 1.5,
            minHeight: 72,
            display: 'flex',
            alignItems: 'center',
            gap: 2.5,
          }}
        >
          <Image src="/logo_white.svg" alt="" width={34} height={34} />
          <SkeletonBone dark sx={{ width: 70, height: 16 }} />
          <SkeletonBone dark sx={{ width: 74, height: 32 }} />
          <Box sx={{ flex: 1 }} />
          <SkeletonBone dark sx={{ width: 120, height: 40 }} />
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: 1180,
          mx: 'auto',
          px: { xs: 2.5, md: 3 },
          pt: { xs: 3.5, md: 4.5 },
          pb: { xs: 12, md: 9 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 4, md: 5 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, minWidth: 260, flex: 1 }}>
            <SkeletonBone sx={{ width: 160, height: 26 }} />
            <SkeletonBone
              sx={{
                width: { xs: '85%', md: 420 },
                height: { xs: 34, md: 42 },
                borderRadius: '14px',
              }}
            />
          </Box>
          <SkeletonBone sx={{ width: { xs: '100%', md: 420 }, height: 52 }} />
        </Box>

        <Box
          sx={{
            display: { xs: 'none', md: 'grid' },
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '18px',
          }}
        >
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonBone key={index} sx={{ height: 178, borderRadius: '32px' }} />
          ))}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <SkeletonBone sx={{ width: 220, height: 18 }} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(320px, 1fr))' },
              gap: 2,
            }}
          >
            {Array.from({ length: 2 }, (_, index) => (
              <CardBone key={index} />
            ))}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'space-between',
          px: '18px',
          pt: '10px',
          pb: 'calc(10px + env(safe-area-inset-bottom))',
          background: colorTokens.navigation.gradient,
          borderRadius: '26px 26px 0 0',
          boxShadow: `0 -8px 28px ${alpha(colorTokens.shadow.overlay, 0.26)}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '9px', minHeight: 48, pl: 1 }}>
          <Image src="/logo_white.svg" alt="" width={30} height={30} />
          <SkeletonBone dark sx={{ width: 46, height: 14 }} />
        </Box>
        <SkeletonBone dark sx={{ width: 72, height: 44 }} />
      </Box>
    </Box>
  );
}
