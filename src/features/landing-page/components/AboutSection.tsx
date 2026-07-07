'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Box, Typography, Container } from '@mui/material';

import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import EmojiObjectsRoundedIcon from '@mui/icons-material/EmojiObjectsRounded';

import { Button } from '@/components/ui';

const highlights = [
  {
    icon: SchoolRoundedIcon,
    label: 'Projeto de extensão',
    detail: 'Engenharia de Computação — UEFS',
  },
  {
    icon: GroupsRoundedIcon,
    label: 'Feito por estudantes',
    detail: 'Para a comunidade universitária',
  },
  {
    icon: EmojiObjectsRoundedIcon,
    label: 'Código aberto',
    detail: 'Transparente e em constante evolução',
  },
];

export function AboutSection() {
  return (
    <Box
      id="about-section"
      sx={{
        width: '100%',
        py: { xs: 8, md: 14 },
        backgroundColor: 'white',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <Typography
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 2.5,
              py: 0.8,
              borderRadius: '999px',
              backgroundColor: '#E8FFF6',
              color: '#1C8C6C',
              fontWeight: 700,
              fontSize: '0.85rem',
              mb: 2,
            }}
          >
            Nossa história
          </Typography>

          <Typography
            sx={{
              fontWeight: 800,
              color: '#13284D',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              mb: 2,
              fontSize: { xs: '2rem', md: '3.5rem' },
            }}
          >
            Sobre o Assinaê
          </Typography>

          <Typography
            sx={{
              color: '#5B6470',
              maxWidth: '580px',
              mx: 'auto',
              lineHeight: 1.7,
              fontSize: { xs: '1rem', md: '1.08rem' },
            }}
          >
            Entenda como o Assinaê nasceu, quem o criou e qual problema ele resolve.
          </Typography>
        </Box>

        {/* Main content: image + text side by side */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: { xs: 6, md: 10 },
          }}
        >
          {/* Image */}
          <Box
            sx={{
              flexShrink: 0,
              position: 'relative',
              width: { xs: '260px', sm: '320px', md: '380px' },
              height: { xs: '320px', sm: '400px', md: '480px' },
              borderRadius: { xs: '32px', md: '44px' },
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(15, 23, 42, 0.14)',
              mx: { xs: 'auto', md: 0 },
            }}
          >
            <Image
              src="/images/aboutImage.jpg"
              alt="Evento universitário"
              fill
              priority
              sizes="(max-width:600px) 260px, (max-width:900px) 320px, 380px"
              style={{ objectFit: 'cover' }}
            />

            {/* Floating badge over image */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                right: 20,
                backgroundColor: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(12px)',
                borderRadius: '18px',
                px: 2.5,
                py: 1.8,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  backgroundColor: '#E8FFF6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <SchoolRoundedIcon sx={{ fontSize: 22, color: '#059669' }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, color: '#13284D', fontSize: '0.9rem', lineHeight: 1.2 }}>
                  Projeto acadêmico
                </Typography>
                <Typography sx={{ color: '#5B6470', fontSize: '0.78rem' }}>
                  UEFS · Engenharia de Computação
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Text content */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Typography
              sx={{
                color: '#1F2937',
                lineHeight: 1.75,
                fontWeight: 400,
                fontSize: { xs: '1.05rem', md: '1.2rem' },
                mb: 3,
              }}
            >
              O{' '}
              <Box component="span" sx={{ fontWeight: 800, color: '#13284D' }}>
                Assinaê
              </Box>{' '}
              nasceu de uma necessidade real: organizar eventos universitários sem perder horas em
              planilhas, listas impressas ou e-mails manuais.
            </Typography>

            {/* Highlights */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 2,
                mb: 5,
                width: '100%',
              }}
            >
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <Box
                    key={item.label}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '14px',
                        backgroundColor: '#E8FFF6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon sx={{ fontSize: 22, color: '#059669' }} />
                    </Box>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography sx={{ fontWeight: 700, color: '#13284D', fontSize: '0.95rem', lineHeight: 1.2 }}>
                        {item.label}
                      </Typography>
                      <Typography sx={{ color: '#5B6470', fontSize: '0.85rem' }}>
                        {item.detail}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            <Button
              variant="contained"
              component={Link}
              href="/landing-page/learn-more"
              endIcon={<ArrowOutwardRoundedIcon />}
              sx={{
                alignSelf: { xs: 'center', md: 'flex-start' },
                backgroundColor: '#059669',
                color: '#fff',
                borderRadius: '999px',
                px: { xs: 4, md: 5 },
                py: 1.3,
                fontWeight: 700,
                fontSize: { xs: '1rem', md: '1.05rem' },
                textTransform: 'none',
                boxShadow: '0 10px 25px rgba(5,150,105,0.22)',
                transition: '0.25s ease',
                '&:hover': {
                  backgroundColor: '#047857',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Saiba Mais
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}