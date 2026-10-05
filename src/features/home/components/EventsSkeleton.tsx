import { Box, alpha } from '@mui/material';
import { SkeletonBone as Bone } from '@/components/ui';
import { colorTokens } from '@/lib/colors';

const INK = colorTokens.navigation.default;
const WHITE = colorTokens.neutral.white;

function FeaturedSkeleton() {
  return (
    <Box
      sx={{
        borderRadius: '28px',
        overflow: 'hidden',
        bgcolor: WHITE,
        border: `1px solid ${alpha(INK, 0.06)}`,
        boxShadow: `0 10px 28px ${alpha(colorTokens.shadow.ink, 0.09)}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          p: { xs: '20px', md: '22px 24px' },
          background: colorTokens.navigation.gradient,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Bone dark sx={{ width: 64, height: 20 }} />
          <Bone dark sx={{ width: 84, height: 20 }} />
        </Box>
        <Bone dark sx={{ width: { xs: '75%', md: '40%' }, height: 22 }} />
        <Bone dark sx={{ width: { xs: '55%', md: '28%' }, height: 12 }} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: { xs: '18px 20px', md: '18px 24px' },
        }}
      >
        <Bone sx={{ width: 50, height: 50, borderRadius: '14px', flexShrink: 0 }} />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Bone sx={{ width: 110, height: 10 }} />
          <Bone sx={{ width: '60%', height: 14 }} />
        </Box>
      </Box>
    </Box>
  );
}

function EventCardSkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        py: 2,
        px: 2.25,
        borderRadius: '24px',
        bgcolor: WHITE,
        border: `1px solid ${alpha(INK, 0.06)}`,
        boxShadow: `0 4px 14px ${alpha(colorTokens.shadow.ink, 0.05)}`,
      }}
    >
      <Bone
        sx={{
          width: { xs: 64, md: 76 },
          height: { xs: 64, md: 76 },
          borderRadius: '20px',
          flexShrink: 0,
        }}
      />
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.25 }}>
          <Bone sx={{ width: '58%', height: 14 }} />
          <Bone sx={{ width: 60, height: 20 }} />
        </Box>
        <Bone sx={{ width: '70%', height: 10 }} />
        <Bone sx={{ width: '50%', height: 10 }} />
        <Bone sx={{ width: '40%', height: 10 }} />
      </Box>
    </Box>
  );
}

interface EventsSkeletonProps {
  featured: boolean;
  cards: number;
  maxMobile: number;
  maxDesktop: number;
}

export function EventsSkeleton({ featured, cards, maxMobile, maxDesktop }: EventsSkeletonProps) {
  // Sem nenhum formato conhecido, um card basta para sinalizar o carregamento.
  const cardCount = Math.min(cards, maxDesktop) || (featured ? 0 : 1);

  return (
    <Box
      role="status"
      aria-label="Carregando seus eventos"
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      {featured && <FeaturedSkeleton />}
      {cardCount > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(320px, 1fr))' },
            gap: 2,
          }}
        >
          {Array.from({ length: cardCount }, (_, index) => (
            <Box
              key={index}
              sx={{ display: index < maxMobile ? 'block' : { xs: 'none', md: 'block' } }}
            >
              <EventCardSkeleton />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
