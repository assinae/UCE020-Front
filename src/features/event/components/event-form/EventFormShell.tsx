'use client';

import type { ReactNode } from 'react';
import { Box, ButtonBase, alpha } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { SkeletonBone } from '@/components/ui';
import { colorTokens } from '@/lib/colors';
import { SectionTitle } from './FormControls';

export function BackPill({ onClick }: { onClick: () => void }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        alignSelf: 'flex-start',
        gap: 1,
        p: '9px 18px 9px 14px',
        border: `1px solid ${alpha(colorTokens.navigation.default, 0.1)}`,
        borderRadius: '999px',
        bgcolor: colorTokens.neutral.white,
        color: colorTokens.text.heading,
        fontSize: 13.5,
        fontWeight: 600,
        transition: 'background .18s ease, border-color .18s ease',
        '&:hover': {
          bgcolor: colorTokens.surface.mintSubtle,
          borderColor: colorTokens.brand.secondary,
        },
      }}
    >
      <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
      Voltar
    </ButtonBase>
  );
}

export function EventFormShell({ back, children }: { back: ReactNode; children: ReactNode }) {
  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: colorTokens.surface.app }}>
      <Box
        component="main"
        sx={{
          maxWidth: 1000,
          mx: 'auto',
          p: { xs: '14px 12px 32px', md: '28px 24px 72px' },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1.75, md: 3 },
        }}
      >
        {back}
        <Box
          className="animate-fade-up motion-reduce:animate-none"
          style={{ animationDelay: '0.06s' }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2.75, md: 3.75 },
            p: { xs: '20px 16px', md: 4 },
            borderRadius: { xs: '24px', md: '32px' },
            bgcolor: colorTokens.neutral.white,
            border: `1px solid ${alpha(colorTokens.navigation.default, 0.06)}`,
            boxShadow: `0 18px 45px ${alpha(colorTokens.shadow.ink, 0.08)}`,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export function EventFormSkeleton({ back }: { back: ReactNode }) {
  const field = (wide?: boolean) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        gridColumn: wide ? '1 / -1' : undefined,
      }}
    >
      <SkeletonBone sx={{ width: 110, height: 12 }} />
      <SkeletonBone sx={{ height: 50, borderRadius: '16px' }} />
    </Box>
  );

  return (
    <EventFormShell back={back}>
      <Box
        role="status"
        aria-label="Carregando evento"
        sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.75, md: 3.75 } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <SkeletonBone sx={{ width: { xs: 200, md: 260 }, height: { xs: 30, md: 38 } }} />
          <SkeletonBone sx={{ width: '70%', maxWidth: 480, height: 14 }} />
        </Box>
        <SectionTitle>Dados do evento</SectionTitle>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.25 }}>
          {field(true)}
          {field()}
          {field()}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, gridColumn: '1 / -1' }}>
            <SkeletonBone sx={{ width: 110, height: 12 }} />
            <SkeletonBone sx={{ height: 110, borderRadius: '16px' }} />
          </Box>
          {field(true)}
          {field()}
          {field()}
        </Box>
        <SectionTitle>Atividades</SectionTitle>
        <SkeletonBone sx={{ height: 96, borderRadius: '24px' }} />
      </Box>
    </EventFormShell>
  );
}
