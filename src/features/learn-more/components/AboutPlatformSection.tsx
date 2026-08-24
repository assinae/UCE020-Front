'use client';

import { Box, Typography, Container, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { useRouter } from 'next/navigation';

const stats = [
  { icon: SchoolRoundedIcon, value: 'UEFS', label: 'Universidade' },
  { icon: CalendarMonthRoundedIcon, value: '2026', label: 'Ano de início' },
];

export function AboutPlatformSection() {
  const router = useRouter();

  return (
    <Box
      sx={{
        width: '100%',
        background: 'linear-gradient(160deg, #0D1E3B 0%, #13284D 100%)',
        pt: 18,
        pb: { xs: 8, md: 12 },
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

      {/* Back button */}
      <Box sx={{ position: 'absolute', top: 90, left: { xs: 16, md: 32 }, zIndex: 10 }}>
        <IconButton
          onClick={() => router.back()}
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

      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Eyebrow */}
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
            Projeto de Extensão · UCE020
          </Typography>

          {/* Headline */}
          <Typography
            sx={{
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              mb: 3,
              maxWidth: '700px',
              fontSize: { xs: '2.0rem', md: '3.8rem' },
            }}
          >
            Uma plataforma feita por estudantes,{' '}
            <Box component="span" sx={{ color: '#6ED7B4' }}>
              para universidades.
            </Box>
          </Typography>

          {/* Stats row */}
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1.5, md: 4 },
              flexWrap: 'nowrap',
              justifyContent: 'center',
              overflowX: { xs: 'auto', md: 'visible' },
              mx: { xs: -1, md: 0 },
              px: { xs: 1, md: 0 },
            }}
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Box
                  key={stat.label}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.75,
                    backgroundColor: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '18px',
                    px: { xs: 2, md: 4 },
                    py: { xs: 1.5, md: 2.5 },
                    minWidth: { xs: '90px', md: '110px' },
                    maxWidth: { xs: '110px', md: 'auto' },
                    backdropFilter: 'blur(10px)',
                    flex: '0 0 auto',
                  }}
                >
                  <Icon sx={{ fontSize: { xs: 18, md: 22 }, color: '#6ED7B4' }} />
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: '#fff',
                      fontSize: { xs: '1rem', md: '1.6rem' },
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.65)',
                      fontSize: { xs: '0.70rem', md: '0.78rem' },
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
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
  );
}
