'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, IconButton, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { tutorialContent, type TutorialRole } from '../data';
import { RoleCard } from './RoleCard';
import { TutorialStepModal } from './TutorialStepModal';

export function TutorialView() {
  const router = useRouter();
  const [openRole, setOpenRole] = useState<TutorialRole | null>(null);
  const openContent = openRole ? tutorialContent[openRole] : null;

  return (
    <>
      <Box
        sx={{
          width: '100%',
          background: 'linear-gradient(160deg, #0D1E3B 0%, #13284D 100%)',
          pt: 18,
          pb: { xs: 8, md: 10 },
          px: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <Box
          sx={{
            position: 'absolute',
            top: '-80px',
            right: '-120px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(110,215,180,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-60px',
            left: '-100px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(5,150,105,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <Box sx={{ position: 'absolute', top: 90, left: { xs: 16, md: 32 }, zIndex: 10 }}>
          <IconButton
            onClick={() => router.back()}
            aria-label="Voltar"
            size="small"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.18)',
                color: '#fff',
              },
            }}
          >
            <ArrowBack fontSize="small" />
          </IconButton>
        </Box>

        <Container maxWidth="md">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Typography
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 2.5,
                py: 0.7,
                borderRadius: '999px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.82rem',
                mb: 3,
              }}
            >
              Tutorial de uso
            </Typography>

            <Typography
              sx={{
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.15,
                letterSpacing: '-1px',
                mb: 2,
                maxWidth: '640px',
                fontSize: { xs: '1.9rem', md: '3rem' },
              }}
            >
              Como você vai usar o{' '}
              <Box component="span" sx={{ color: '#6ED7B4' }}>
                Assinaê
              </Box>
              ?
            </Typography>

            <Typography
              sx={{
                color: '#D7E0EA',
                maxWidth: '520px',
                lineHeight: 1.7,
                fontSize: { xs: '0.95rem', md: '1.05rem' },
              }}
            >
              Escolha o seu perfil e veja um passo a passo rápido de como aproveitar a plataforma.
            </Typography>
          </Box>
        </Container>

        {/* Wave transition to white */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            style={{ display: 'block', width: '100%', height: '60px' }}
          >
            <path fill="#FFFFFF" d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </Box>
      </Box>

      <Box sx={{ width: '100%', backgroundColor: '#FFFFFF', py: { xs: 6, md: 10 }, px: 2 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
            <RoleCard content={tutorialContent.organizer} onSelect={() => setOpenRole('organizer')} />
            <RoleCard content={tutorialContent.participant} onSelect={() => setOpenRole('participant')} />
          </Box>
        </Container>
      </Box>

      <TutorialStepModal open={!!openRole} content={openContent} onClose={() => setOpenRole(null)} />
    </>
  );
}
