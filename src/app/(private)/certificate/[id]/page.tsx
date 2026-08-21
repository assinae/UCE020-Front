'use client';

import { use, useEffect, useState } from 'react';
import { Box, Container, Typography, IconButton, CircularProgress } from '@mui/material';
import { CalendarToday, AccessTime, ArrowBack, Draw, Download, PictureAsPdf } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { certificateService } from '@/services/certificate.service';
import { useMockUser } from '@/mocks/useMockUser';
import type { CertificateManagementItem } from '@/types/certificate-management';
import { formatBahiaDate } from '@/utils/date';

export default function CertificateViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const mockUser = useMockUser();

  const [cert, setCert] = useState<CertificateManagementItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    certificateService
      .getCertificateById(id)
      .then((data) => {
        if (!cancelled) setCert(data);
      })
      .catch(() => {
        if (!cancelled) setIsError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDownload = () => {
    if (!cert?.imageUrl) return;
    window.open(cert.imageUrl, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (isError || !cert) {
    return (
      <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, px: 3, textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>Certificado não encontrado</Typography>
        <Button variant="outlined" onClick={() => router.back()}>Voltar</Button>
      </Box>
    );
  }

  const isOrganizer = mockUser.role === 'organizer';

  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 3, md: 4 }, py: { xs: 2, md: 4 }, pb: 6 }}>
        {/* Cabeçalho padronizado (h5 + subtítulo), igual às telas de assinar/editar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 3, md: 4 } }}>
          <IconButton
            onClick={() => router.back()}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1.2,
              }}
            >
              Visualizar Certificado
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {cert.title}
            </Typography>
          </Box>
        </Box>

        {/* Layout responsivo: coluna única no mobile, duas colunas no desktop */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'stretch', md: 'flex-start' },
            gap: { xs: 3, md: 4 },
          }}
        >
          {/* Pré-visualização do certificado */}
          <Box
            sx={{
              flex: { md: '1 1 60%' },
              width: '100%',
              minWidth: 0,
              aspectRatio: '16/10',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
              bgcolor: '#F5F5F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {cert.imageUrl ? (
              <Box
                component="iframe"
                src={cert.imageUrl}
                title={`Certificado - ${cert.title}`}
                sx={{ width: '100%', height: '100%', border: 0 }}
              />
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, color: '#94a3b8' }}>
                <PictureAsPdf sx={{ fontSize: 40 }} />
                <Typography sx={{ fontSize: '0.85rem' }}>PDF ainda não disponível</Typography>
              </Box>
            )}
          </Box>

          {/* Detalhes e ações */}
          <Box
            sx={{
              flex: { md: '1 1 40%' },
              width: '100%',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              position: { md: 'sticky' },
              top: { md: 32 },
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#0f172a',
                mb: 0.5,
              }}
            >
              {cert.title}
            </Typography>

            <Typography sx={{ fontSize: '0.9rem', color: '#64748b', mb: 2 }}>
              {cert.participantName} · {cert.role}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday sx={{ fontSize: 16, color: '#64748b' }} />
                <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.875rem', color: '#0f172a' }}>
                  Emitido em {formatBahiaDate(cert.issueDate)}
                </Typography>
              </Box>

              {typeof cert.hours === 'number' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime sx={{ fontSize: 16, color: '#64748b' }} />
                  <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.875rem', color: '#0f172a' }}>
                    {cert.hours} horas de carga horária
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: { xs: 4, md: 0 } }}>
              {isOrganizer && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ px: 6, borderRadius: '50px', fontWeight: 700 }}
                  leftIcon={<Draw />}
                  onClick={() => router.push(`/certificate/${cert.id}/sign`)}
                >
                  Assinar Certificado
                </Button>
              )}
              <Button
                variant="outlined"
                color="secondary"
                sx={{ px: 6, borderRadius: '50px', fontWeight: 700 }}
                leftIcon={<Download />}
                disabled={!cert.imageUrl}
                onClick={handleDownload}
              >
                Baixar
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}