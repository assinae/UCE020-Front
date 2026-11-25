'use client';

import { Box } from '@mui/material';
import { SkeletonBone } from '@/components/ui';
import { EventLandingHeader } from './EventLandingHeader';
import { colorTokens } from '@/lib/colors';

export function EventLandingSkeleton() {
  return (
    <>
      <EventLandingHeader />
      <Box role="status" aria-label="Carregando evento">
        <Box sx={{ background: colorTokens.navigation.gradient }}>
          <Box
            sx={{
              maxWidth: 1180,
              mx: 'auto',
              px: { xs: 2.5, sm: 4 },
              pt: { xs: 5, md: 17 },
              pb: { xs: 5, md: 7 },
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <SkeletonBone dark sx={{ width: 150, height: 30 }} />
            <SkeletonBone
              dark
              sx={{
                width: { xs: '90%', md: 640 },
                height: { xs: 72, md: 110 },
                borderRadius: '18px',
              }}
            />
            <SkeletonBone
              dark
              sx={{ width: { xs: '60%', md: 300 }, height: 22, borderRadius: '10px' }}
            />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mt: 2 }}>
              {Array.from({ length: 4 }, (_, index) => (
                <SkeletonBone
                  key={index}
                  dark
                  sx={{ width: 150, height: 38, borderRadius: '12px' }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1.25, mt: 2.5 }}>
              <SkeletonBone dark sx={{ width: 200, height: 50 }} />
              <SkeletonBone dark sx={{ width: 50, height: 50 }} />
              <SkeletonBone dark sx={{ width: 50, height: 50 }} />
            </Box>
          </Box>
        </Box>

        <Box sx={{ backgroundColor: colorTokens.neutral.white }}>
          <Box
            sx={{
              maxWidth: 820,
              mx: 'auto',
              px: { xs: 2, sm: 4 },
              py: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              gap: 1.25,
            }}
          >
            <SkeletonBone sx={{ width: 200, height: 30, borderRadius: '10px', mb: 1.5 }} />
            {Array.from({ length: 3 }, (_, index) => (
              <SkeletonBone key={index} sx={{ height: 110, borderRadius: '20px' }} />
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}
