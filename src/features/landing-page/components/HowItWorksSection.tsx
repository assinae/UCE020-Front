'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';

const steps = [
  {
    number: '01',
    icon: EventAvailableRoundedIcon,
    title: 'Crie seu evento',
    description:
      'O organizador cadastra o evento na plataforma em poucos minutos, definindo nome, data, carga horária e participantes esperados.',
    accent: '#059669',
    bg: '#E8FFF6',
    border: 'rgba(5,150,105,0.2)',
  },
  {
    number: '02',
    icon: QrCode2RoundedIcon,
    title: 'Compartilhe o QR Code',
    description:
      'Um QR Code exclusivo é gerado automaticamente para o evento. Basta exibir na entrada — nenhum app extra é necessário.',
    accent: '#0EA5E9',
    bg: '#EFF8FF',
    border: 'rgba(14,165,233,0.2)',
  },
  {
    number: '03',
    icon: HowToRegRoundedIcon,
    title: 'Participantes fazem check-in',
    description:
      'Cada participante escaneia o QR Code com o celular. A presença é confirmada em tempo real, sem filas nem papelada.',
    accent: '#8B5CF6',
    bg: '#F5F3FF',
    border: 'rgba(139,92,246,0.2)',
  },
  {
    number: '04',
    icon: WorkspacePremiumRoundedIcon,
    title: 'Certificados emitidos na hora',
    description:
      'Ao encerrar o evento, os certificados são gerados automaticamente e enviados para cada participante que atingiu a carga horária mínima.',
    accent: '#059669',
    bg: '#E8FFF6',
    border: 'rgba(5,150,105,0.2)',
  },
];

export function HowItWorksSection() {
  return (
    <Box
      id="how-it-works-section"
      sx={{
        width: '100%',
        py: { xs: 8, md: 14 },
        backgroundColor: '#F8FAFC',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background blobs */}
      <Box
        sx={{
          position: 'absolute',
          top: '-140px',
          right: '-180px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5,150,105,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-100px',
          left: '-140px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 7, md: 10 } }}>
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
            Simples do início ao fim
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
            Como funciona?
          </Typography>

          <Typography
            sx={{
              color: '#5B6470',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.7,
              fontSize: { xs: '1rem', md: '1.1rem' },
            }}
          >
            Do cadastro do evento à entrega dos certificados — tudo automatizado em quatro passos.
          </Typography>
        </Box>

        {/* Steps */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr 1fr 1fr',
            },
            gap: { xs: 3, md: 3 },
            position: 'relative',
          }}
        >
          {/* Connecting line (desktop only) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              top: '52px',
              left: 'calc(12.5% + 28px)',
              right: 'calc(12.5% + 28px)',
              height: '1px',
              background:
                'linear-gradient(90deg, #059669 0%, #0EA5E9 33%, #8B5CF6 66%, #059669 100%)',
              opacity: 0.2,
              zIndex: 0,
            }}
          />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Box
                key={step.number}
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  px: { xs: 0, md: 1 },
                }}
              >
                {/* Icon circle */}
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    backgroundColor: step.bg,
                    border: `1.5px solid ${step.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  <Icon sx={{ fontSize: 34, color: step.accent }} />

                  {/* Step number badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: step.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#fff',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        lineHeight: 1,
                      }}
                    >
                      {step.number}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  sx={{
                    fontWeight: 800,
                    color: '#13284D',
                    fontSize: { xs: '1.1rem', md: '1.2rem' },
                    mb: 1,
                    lineHeight: 1.2,
                  }}
                >
                  {step.title}
                </Typography>

                <Typography
                  sx={{
                    color: '#5B6470',
                    fontSize: { xs: '0.92rem', md: '0.95rem' },
                    lineHeight: 1.7,
                  }}
                >
                  {step.description}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}