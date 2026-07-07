'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Box, Container, Typography } from '@mui/material';
import { Button } from '@/components/ui';

export function HeroSection() {
  return (
    <Box
      id="hero-section"
      sx={{
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        background: 'linear-gradient(135deg, var(--color-navbar) 0%, #13284D 100%)',

        /* Floating orb keyframes */
        '@keyframes floatOrb': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-24px) scale(1.04)' },
        },
        '@keyframes floatOrbSlow': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(18px) scale(0.97)' },
        },
        '@keyframes floatImage': {
          '0%, 100%': { transform: 'translateY(0px) rotate(-1deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1deg)' },
        },
        '@keyframes fadeSlideUp': {
          '0%': { opacity: 0, transform: 'translateY(28px)' },
          '100%': { opacity: 1, transform: 'translateY(0px)' },
        },
        '@keyframes fadeSlideRight': {
          '0%': { opacity: 0, transform: 'translateX(32px)' },
          '100%': { opacity: 1, transform: 'translateX(0px)' },
        },
        '@keyframes shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        '@keyframes pulseDot': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(0.85)' },
        },
      }}
    >
      {/* ── Decorative orbs ── */}
      <Box sx={{
        position: 'absolute', top: '8%', left: '4%',
        width: { xs: '180px', md: '340px' }, height: { xs: '180px', md: '340px' },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(5,150,105,0.18) 0%, transparent 70%)',
        animation: 'floatOrb 7s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <Box sx={{
        position: 'absolute', bottom: '15%', left: '18%',
        width: { xs: '100px', md: '200px' }, height: { xs: '100px', md: '200px' },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(110,215,180,0.10) 0%, transparent 70%)',
        animation: 'floatOrbSlow 9s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <Box sx={{
        position: 'absolute', top: '20%', right: '6%',
        width: { xs: '120px', md: '260px' }, height: { xs: '120px', md: '260px' },
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(5,150,105,0.12) 0%, transparent 70%)',
        animation: 'floatOrb 11s ease-in-out infinite 1.5s',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Subtle grid texture overlay ── */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <Container
        maxWidth="xl"
        sx={{
          minHeight: { xs: 'auto', md: '100vh' },
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 1, sm: 3, md: 6 },
          pt: { xs: 12, md: 0 },
          pb: { xs: 4, md: 0 },
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {/* ── Left: text content ── */}
        <Box
          sx={{
            flex: { xs: 1.5, md: 1 },
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            textAlign: 'left',
            pl: { xs: 2, md: 12 },
            zIndex: 2,
          }}
        >
  
          {/* Headline */}
          <Typography
            sx={{
              color: 'var(--color-white)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: { xs: 0, md: '-1.5px' },
              maxWidth: '650px',
              fontSize: { xs: '1.16rem', sm: '2.8rem', md: '4.3rem' },
              animation: 'fadeSlideUp 0.7s ease 0.1s both',
            }}
          >
            Da presença ao certificado em{' '}
            <Box
              component="span"
              sx={{
                /* Shimmer effect on accent word */
                background: 'linear-gradient(90deg, #6ED7B4 0%, #059669 40%, #6ED7B4 60%, #43A68D 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'shimmer 3.5s linear infinite',
                display: 'inline',
              }}
            >
              segundos!
            </Box>
          </Typography>

          {/* Subheadline */}
          <Typography
            sx={{
              color: '#D7E0EA',
              mt: 2.5,
              maxWidth: '480px',
              lineHeight: { xs: '0.8rem', sm: '1.4rem', md: '1.6rem' },
              fontWeight: 400,
              fontSize: { xs: '0.7rem', sm: '0.95rem', md: '1.05rem' },
              animation: 'fadeSlideUp 0.7s ease 0.2s both',
            }}
          >
            O{' '}
            <Box component="span" sx={{ color: '#6ED7B4', fontWeight: 700 }}>
              Assinaê
            </Box>{' '}
            é uma plataforma completa para gestão de carga horária e emissão de certificados
            para eventos universitários da
            {' '}
            <Box component="span" sx={{ color: '#6ED7B4', fontWeight: 700 }}>
              UEFS.
            </Box>{' '}
          </Typography>

          {/* CTA */}
          <Box sx={{ animation: 'fadeSlideUp 0.7s ease 0.35s both', mt: 4 }}>
            <Button
              component={Link}
              href="/login"
              variant="contained"
              color="secondary"
              sx={{
                fontSize: { xs: '0.68rem', md: '1rem' },
                minWidth: 'auto',
                px: { xs: 3, sm: 4, md: 5 },
                py: { xs: 1, md: 1.2 },
                borderRadius: '999px',
                fontWeight: 700,
                boxShadow: '0 8px 28px rgba(5,150,105,0.35)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 14px 36px rgba(5,150,105,0.45)',
                },
              }}
            >
              Começar Agora
            </Button>
          </Box>
        </Box>

        {/* ── Right: floating image ── */}
        <Box
          sx={{
            flex: { xs: 2, md: 1 },
            minWidth: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            animation: 'fadeSlideRight 0.9s ease 0.2s both',
          }}
        >
          {/* Glow halo behind image */}
          <Box sx={{
            position: 'absolute',
            width: { xs: '200px', sm: '320px', md: '520px' },
            height: { xs: '200px', sm: '320px', md: '520px' },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(5,150,105,0.22) 0%, transparent 68%)',
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          {/* Image with float animation */}
          <Box
            sx={{
              position: 'relative',
              width: { xs: '300px', sm: '450px', md: '720px' },
              height: { xs: '280px', sm: '400px', md: '600px' },
              animation: 'floatImage 5s ease-in-out infinite',
              zIndex: 1,
              filter: 'drop-shadow(0 32px 48px rgba(0,0,0,0.28))',
            }}
          >
            <Image
              src="/images/certificadoVariacao2.png"
              alt="Certificado"
              fill
              priority
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 600px) 300px, (max-width: 900px) 450px, 720px"
            />
          </Box>
        </Box>
      </Container>

      {/* ── Wave transition ── */}
      <Box
        sx={{
          width: '100%',
          lineHeight: 0,
          overflow: 'hidden',
          marginTop: { xs: '-40px', md: '-80px' },
          marginBottom: '-5px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '100%', height: '120px' }}
        >
          <path
            fill="#FFFFFF"
            d="
              M0,224
              C120,180 240,180 360,208
              C480,236 600,292 720,282
              C840,272 960,196 1080,186
              C1200,176 1320,224 1440,250
              L1440,320
              L0,320
              Z
            "
          />
        </svg>
      </Box>
    </Box>
  );
}