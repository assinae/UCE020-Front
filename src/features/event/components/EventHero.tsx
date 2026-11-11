'use client';

import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { BackButton } from '@/components/ui';
import { colorTokens } from '@/lib/colors';

interface EventHeroProps {
  image?: string | null;
  title: string;
  /** Conteúdo sobreposto no canto superior direito (ex.: chip de status). */
  action?: ReactNode;
}

export const heroOverlayButtonSx = {
  width: 42,
  height: 42,
  color: colorTokens.text.heading,
  bgcolor: 'rgba(255, 255, 255, 0.92)',
  backdropFilter: 'blur(6px)',
  boxShadow: '0 6px 18px rgba(13, 30, 59, 0.18)',
  '&:hover': { bgcolor: '#FFFFFF' },
} as const;

/**
 * Capa do evento. No mobile vai de ponta a ponta; no desktop fica na mesma
 * largura do card de conteúdo, arredondada. Nos dois casos o card sobe por cima
 * da parte de baixo dela.
 */
export function EventHero({ image, title, action }: EventHeroProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 260, sm: 340, md: 400, lg: 440 },
        borderRadius: { xs: 0, md: '28px' },
        overflow: 'hidden',
        background: image ? colorTokens.surface.ink : colorTokens.navigation.gradient,
      }}
    >
      {image ? (
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <Box aria-hidden sx={{ position: 'absolute', inset: 0 }}>
          <Box
            sx={{
              position: 'absolute',
              top: -70,
              right: -40,
              width: 260,
              height: 260,
              borderRadius: '50%',
              bgcolor: 'rgba(118, 227, 188, 0.14)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -90,
              left: -60,
              width: 220,
              height: 220,
              borderRadius: '50%',
              bgcolor: 'rgba(118, 227, 188, 0.08)',
            }}
          />
          <Box
            component="img"
            src="/logo_white.svg"
            alt=""
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: { xs: 72, md: 96 },
              height: { xs: 72, md: 96 },
              transform: 'translate(-50%, -60%)',
              opacity: 0.18,
            }}
          />
        </Box>
      )}

      {/* Escurece o topo para os botões sobrepostos lerem bem em qualquer foto. */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(13, 30, 59, 0.38) 0%, rgba(13, 30, 59, 0) 45%)',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: { xs: 14, md: 22 },
          left: { xs: 14, md: 22 },
          right: { xs: 14, md: 22 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <BackButton fallbackHref="/home" iconVariant="compact" sx={heroOverlayButtonSx} />
        {action}
      </Box>
    </Box>
  );
}
