'use client';

import React, { useRef } from 'react';

import {
  Box,
  Typography,
  Container,
} from '@mui/material';

import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';

const cards = [
  {
    icon: AccessTimeRoundedIcon,
    title: 'Economize Tempo',
    description:
      'Valide presença e emita certificados em poucos cliques.',
    color: '#6ED7B4',
  },
  {
    icon: SchoolRoundedIcon,
    title: 'Eventos Universitários',
    description:
      'Criado especialmente para instituições e projetos acadêmicos.',
    color: '#43A68D',
  },
  {
    icon: CheckCircleRoundedIcon,
    title: 'Fácil e Intuitivo',
    description:
      'Interface simples para organizadores e participantes.',
    color: '#6ED7B4',
  },
  {
    icon: QrCode2RoundedIcon,
    title: 'Check-in com QR Code',
    description:
      'Confirme presença rapidamente utilizando QR Code.',
    color: '#43A68D',
  },
  {
    icon: WorkspacePremiumRoundedIcon,
    title: 'Certificados Automáticos',
    description:
      'Geração automática de certificados ao final do evento.',
    color: '#6ED7B4',
  },
];

export function BenefitsSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDownRef.current = true;

    const el = containerRef.current;

    if (!el) return;

    el.style.cursor = 'grabbing';

    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDownRef.current) return;

    const el = containerRef.current;

    if (!el) return;

    const x = e.pageX - el.offsetLeft;

    const walk = x - startXRef.current;

    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const endDrag = () => {
    isDownRef.current = false;

    const el = containerRef.current;

    if (el) {
      el.style.cursor = 'grab';
    }
  };

  return (
    <Box
      sx={{
        width: '100%',

        py: {
          xs: 8,
          md: 12,
        },

        overflow: 'hidden',

        backgroundColor: '#fff',

        position: 'relative',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            textAlign: 'center',

            mb: {
              xs: 5,
              md: 8,
            },
          }}
        >
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
            Plataforma para eventos universitários da UEFS
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: '2rem',
                md: '3.5rem',
              },

              fontWeight: 800,

              lineHeight: 1.1,

              color: '#13284D',

              mb: 2,
            }}
          >
            Tudo que você precisa
            <br />
            em um só lugar
          </Typography>

          <Typography
            sx={{
              color: '#5B6470',

              maxWidth: '760px',

              mx: 'auto',

              lineHeight: 1.7,

              fontSize: {
                xs: '1rem',
                md: '1.1rem',
              },
            }}
          >
            Controle de presença, emissão automática de certificados e gestão de carga horária em uma única plataforma.
          </Typography>
        </Box>

        <Box
          ref={containerRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          sx={{
            display: 'flex',

            gap: {
              xs: 2,
              md: 3,
            },

            overflowX: 'auto',

            scrollSnapType: 'x mandatory',

            pb: 2,

            px: {
              xs: 1,
              md: 0,
            },

            cursor: 'grab',

            userSelect: 'none',

            msOverflowStyle: 'none',

            scrollbarWidth: 'none',

            WebkitOverflowScrolling: 'touch',

            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Box
                key={card.title}
                sx={{
                  position: 'relative',

                  minWidth: {
                    xs: '240px',
                    sm: '280px',
                    md: '320px',
                  },

                  maxWidth: {
                    xs: '240px',
                    sm: '280px',
                    md: '320px',
                  },

                  flexShrink: 0,

                  scrollSnapAlign: 'start',

                  borderRadius: '32px',

                  overflow: 'hidden',

                  background: `
                    linear-gradient(
                      135deg,
                      ${card.color} 0%,
                      ${
                        card.color === '#35A384'
                          ? '#1F7A61'
                          : '#54C7A1'
                      } 100%
                    )
                  `,

                  p: {
                    xs: 3,
                    md: 4,
                  },

                  display: 'flex',

                  flexDirection: 'column',

                  justifyContent: 'space-between',

                  border:
                    '1px solid rgba(255,255,255,0.18)',

                  cursor: 'default',

                  userSelect: 'none',

                  '&::before': {
                    content: '""',

                    position: 'absolute',

                    top: -60,

                    right: -60,

                    width: 160,

                    height: 160,

                    borderRadius: '50%',

                    background:
                      'rgba(255,255,255,0.12)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: 62,
                      md: 72,
                    },

                    height: {
                      xs: 62,
                      md: 72,
                    },

                    borderRadius: '20px',

                    background:
                      'rgba(255,255,255,0.18)',

                    display: 'flex',

                    alignItems: 'center',

                    justifyContent: 'center',

                    backdropFilter: 'blur(10px)',

                    mb: 4,
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: {
                        xs: 34,
                        md: 42,
                      },

                      color: '#fff',
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      color: '#fff',

                      fontWeight: 800,

                      lineHeight: 1.2,

                      mb: 1.5,

                      fontSize: {
                        xs: '1.25rem',
                        md: '1.6rem',
                      },
                    }}
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    sx={{
                      color:
                        'rgba(255,255,255,0.88)',

                      lineHeight: 1.7,

                      fontSize: {
                        xs: '0.92rem',
                        md: '1rem',
                      },
                    }}
                  >
                    {card.description}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}