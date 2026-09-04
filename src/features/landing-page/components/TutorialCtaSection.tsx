'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Box, Container, Typography } from '@mui/material';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import { Button } from '@/components/ui';

export function TutorialCtaSection() {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        pt: { xs: 6, md: 12 },
        pb: { xs: 3, sm: 4, md: 5 },
        px: { xs: 1.5, sm: 2 },
      }}
    >
      <Container maxWidth="lg" disableGutters={true} sx={{ px: { xs: 0, sm: 2 } }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: '22px', sm: '28px', md: '36px' },
            background: 'linear-gradient(135deg, #0D1E3B 0%, #13284D 55%, #0F3D30 100%)',
            px: { xs: 2.5, sm: 6, md: 8 },
            py: { xs: 4.5, sm: 6, md: 8 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 3, md: 6 },

            '@keyframes floatImage': {
              '0%, 100%': { transform: 'translateY(0px) rotate(-1deg)' },
              '50%': { transform: 'translateY(-14px) rotate(1deg)' },
            },
          }}
        >
          {/* Decorative blobs */}
          <Box
            sx={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: 320,
              height: 320,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(5,150,105,0.28) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '-90px',
              left: '-60px',
              width: 260,
              height: 260,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(14,165,233,0.16) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Left: copy + CTA */}
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.6,
                px: { xs: 1.75, sm: 2.25 },
                py: { xs: 0.5, sm: 0.7 },
                borderRadius: '999px',
                backgroundColor: 'rgba(110,215,180,0.15)',
                border: '1px solid rgba(110,215,180,0.35)',
                color: '#6ED7B4',
                fontWeight: 700,
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                mb: { xs: 1.75, sm: 2.5 },
              }}
            >
              <PlayCircleRoundedIcon sx={{ fontSize: { xs: 15, sm: 18 } }} />
              Passo a passo guiado
            </Typography>

            <Typography
              sx={{
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.2,
                letterSpacing: { xs: '-0.3px', md: '-1px' },
                mb: { xs: 1.5, sm: 2 },
                fontSize: { xs: 'clamp(1.3rem, 6.5vw, 1.6rem)', sm: '2rem', md: '2.4rem' },
                maxWidth: 520,
              }}
            >
              Ainda com dúvidas? Aprenda a usar o{' '}
              <Box component="span" sx={{ color: '#6ED7B4' }}>
                Assinaê
              </Box>{' '}
              em poucos minutos.
            </Typography>

            <Typography
              sx={{
                color: '#C7D2E0',
                fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1.02rem' },
                lineHeight: 1.65,
                mb: { xs: 2.5, sm: 4 },
                maxWidth: 480,
              }}
            >
              Um tutorial rápido e personalizado para o seu perfil — organizador ou participante —
              mostrando exatamente o que fazer em cada etapa.
            </Typography>

            <Button
              component={Link}
              href="/landing-page/tutorial"
              variant="contained"
              color="secondary"
              sx={{
                borderRadius: '999px',
                fontWeight: 700,
                width: { xs: '100%', sm: 'auto' },
                px: { xs: 3, sm: 3.5, md: 4.5 },
                py: { xs: 1.1, sm: 1.25 },
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' },
                boxShadow: '0 10px 30px rgba(5,150,105,0.4)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 16px 38px rgba(5,150,105,0.5)',
                },
              }}
            >
              Veja o tutorial de uso do sistema
            </Button>
          </Box>

          {/* Right: illustration — desktop only, dropped entirely on mobile */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: { md: 380, lg: 440 },
                height: { md: 380, lg: 440 },
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(110,215,180,0.22) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <Box
              sx={{
                position: 'relative',
                width: { md: 300, lg: 360 },
                height: { md: 300, lg: 360 },
                animation: 'floatImage 5s ease-in-out infinite',
                filter: 'drop-shadow(0 24px 34px rgba(0,0,0,0.32))',
              }}
            >
              <Image
                src="/images/icon_duvida.png"
                alt="Dúvidas sobre como usar o sistema"
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 1200px) 300px, 360px"
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
