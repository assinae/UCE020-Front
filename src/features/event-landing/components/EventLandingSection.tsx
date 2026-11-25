import type { ReactNode } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { colorTokens } from '@/lib/colors';

export const SECTION_TINT = '#F2F6F7';

interface EventLandingSectionProps {
  id: string;
  badge: string;
  title: string;
  description?: string;
  tone?: 'white' | 'tint';
  maxWidth?: 'md' | 'lg';
  children: ReactNode;
}

export function EventLandingSection({
  id,
  badge,
  title,
  description,
  tone = 'white',
  maxWidth = 'lg',
  children,
}: EventLandingSectionProps) {
  return (
    <Box
      component="section"
      id={id}
      aria-labelledby={`${id}-title`}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        py: { xs: 8, md: 12 },
        backgroundColor: tone === 'tint' ? SECTION_TINT : colorTokens.neutral.white,
        scrollMarginTop: { xs: 56, md: 80 },
      }}
    >
      {tone === 'tint' && (
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: -140,
            right: -180,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(5,150,105,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}

      <Container maxWidth={maxWidth} sx={{ position: 'relative' }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 8 } }}>
          <Typography
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 2.5,
              py: 0.8,
              borderRadius: '999px',
              backgroundColor: colorTokens.surface.mint,
              color: colorTokens.text.mint,
              fontWeight: 700,
              fontSize: '0.85rem',
              mb: 2,
            }}
          >
            {badge}
          </Typography>
          <Typography
            id={`${id}-title`}
            component="h2"
            sx={{
              fontWeight: 800,
              color: colorTokens.text.heading,
              lineHeight: 1.1,
              letterSpacing: '-1px',
              mb: description ? 2 : 0,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              sx={{
                color: colorTokens.text.muted,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.7,
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
        {children}
      </Container>
    </Box>
  );
}
