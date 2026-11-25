'use client';

import type { ReactNode } from 'react';
import { use, useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import DrawRoundedIcon from '@mui/icons-material/DrawRounded';
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { CertificatePreviewPane } from '@/features/certificate/components/CertificatePreviewPane';
import { useCertificatePdfPreview } from '@/features/certificate/hooks/useCertificatePdfPreview';
import {
  baixarCertificadoPdf,
  nomeArquivoCertificado,
} from '@/features/certificate/utils/certificatePdf';
// Linha com ícone em quadrado menta — a mesma da tela de evento, de propósito.
import { EventInfoRow } from '@/features/event/components/EventInfoRow';
import { colorTokens } from '@/lib/colors';
import { useMockUser } from '@/mocks/useMockUser';
import { certificateService } from '@/services/certificate.service';
import type { CertificateManagementItem } from '@/types/certificate-management';
import { ToastSeverity } from '@/types/toast';
import { extractApiErrorMessage } from '@/utils/apiError';
import { formatBahiaDate } from '@/utils/date';

/**
 * Compartilhar arquivo só existe no Web Share nível 2 (celular, em geral).
 * O resultado é fixo na sessão, então fica em cache: `useSyncExternalStore`
 * chama o snapshot a cada render e montar um File toda vez seria desperdício.
 */
let fileShareSupport: boolean | undefined;

function supportsFileShare(): boolean {
  if (fileShareSupport !== undefined) return fileShareSupport;

  try {
    const probe = new File([], 'certificado.pdf', { type: 'application/pdf' });
    fileShareSupport = Boolean(navigator.canShare?.({ files: [probe] }));
  } catch {
    fileShareSupport = false;
  }

  return fileShareSupport;
}

const subscribeToNothing = () => () => {};

function StatusPill({ isSigned }: { isSigned: boolean }) {
  const icon = isSigned ? (
    <VerifiedRoundedIcon sx={{ fontSize: 15 }} />
  ) : (
    <DrawRoundedIcon sx={{ fontSize: 15 }} />
  );

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1.5,
        py: 0.65,
        borderRadius: 99,
        bgcolor: isSigned ? colorTokens.presence.confirmedBg : colorTokens.progress.liveBg,
        color: isSigned ? colorTokens.text.mint : colorTokens.progress.liveText,
        fontSize: 12,
        fontWeight: 800,
        whiteSpace: 'nowrap',
        boxShadow: '0 6px 18px rgba(13, 30, 59, 0.18)',
      }}
    >
      {icon}
      {isSigned ? 'Assinado' : 'Pendente'}
    </Box>
  );
}

function CenteredState({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        px: 3,
        textAlign: 'center',
      }}
    >
      {children}
    </Box>
  );
}

export default function CertificateViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const mockUser = useMockUser();

  const [cert, setCert] = useState<CertificateManagementItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [toast, setToast] = useState<{ message: string; severity: ToastSeverity } | null>(null);

  const canShareFile = useSyncExternalStore(subscribeToNothing, supportsFileShare, () => false);

  // O PDF é buscado em paralelo com os dados do certificado: o id já veio
  // da rota, então não precisa esperar o GET do certificado terminar.
  const pdf = useCertificatePdfPreview(id);

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

  const handleDownload = useCallback(async () => {
    if (!cert) return;

    setIsDownloading(true);
    try {
      await baixarCertificadoPdf({ ...cert, id });
    } catch (error) {
      setToast({
        message: extractApiErrorMessage(error, 'Não foi possível baixar o certificado.'),
        severity: ToastSeverity.Error,
      });
    } finally {
      setIsDownloading(false);
    }
  }, [cert, id]);

  const handleShare = useCallback(async () => {
    if (!cert) return;

    setIsSharing(true);
    try {
      const blob = await certificateService.getCertificatePdf(id);
      const file = new File([blob], nomeArquivoCertificado(cert), { type: 'application/pdf' });

      await navigator.share({ files: [file], title: cert.title });
    } catch (error) {
      // Fechar a folha de compartilhamento não é erro: o navegador rejeita com AbortError.
      if (error instanceof DOMException && error.name === 'AbortError') return;

      setToast({
        message: extractApiErrorMessage(error, 'Não foi possível compartilhar o certificado.'),
        severity: ToastSeverity.Error,
      });
    } finally {
      setIsSharing(false);
    }
  }, [cert, id]);

  if (isLoading) {
    return (
      <CenteredState>
        <CircularProgress size={28} />
      </CenteredState>
    );
  }

  if (isError || !cert) {
    return (
      <CenteredState>
        <Typography sx={{ fontWeight: 700, color: colorTokens.text.heading }}>
          Certificado não encontrado
        </Typography>
        <Button variant="outlined" onClick={() => router.back()}>
          Voltar
        </Button>
      </CenteredState>
    );
  }

  const isSigned = cert.status === 'Assinado';
  const canSign = mockUser.role === 'organizer' && !isSigned;

  const actions = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      {canSign && (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ borderRadius: '50px', fontWeight: 700, py: 1.1 }}
          leftIcon={<DrawRoundedIcon sx={{ fontSize: 18 }} />}
          onClick={() => router.push(`/certificate/${cert.id}/sign`)}
        >
          Assinar certificado
        </Button>
      )}

      <Button
        variant={canSign ? 'outlined' : 'contained'}
        color={canSign ? 'secondary' : 'primary'}
        fullWidth
        size="large"
        sx={{ borderRadius: '50px', fontWeight: 700, py: 1.1 }}
        leftIcon={<DownloadRoundedIcon sx={{ fontSize: 18 }} />}
        isLoading={isDownloading}
        onClick={handleDownload}
      >
        Baixar PDF
      </Button>

      {canShareFile && (
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          size="large"
          sx={{ borderRadius: '50px', fontWeight: 700, py: 1.1 }}
          leftIcon={<IosShareRoundedIcon sx={{ fontSize: 18 }} />}
          isLoading={isSharing}
          onClick={handleShare}
        >
          Compartilhar
        </Button>
      )}
    </Box>
  );

  return (
    // No mobile o fundo é branco igual à folha de conteúdo, para não sobrar
    // faixa cinza embaixo quando a página é curta.
    <Box
      sx={{
        minHeight: '100dvh',
        bgcolor: { xs: colorTokens.neutral.white, md: colorTokens.surface.app },
      }}
    >
      <Box
        sx={{
          maxWidth: 1180,
          mx: 'auto',
          px: { xs: 0, md: 3 },
          pt: { xs: 0, md: 3 },
          pb: { xs: 0, md: 7 },
        }}
      >
        {/* Mesmo molde da tela de evento nos dois tamanhos: capa em cima e a
            folha branca de conteúdo subindo por cima dela. */}
        <CertificatePreviewPane
          url={pdf.url}
          blob={pdf.blob}
          isLoading={pdf.isLoading}
          error={pdf.error}
          action={<StatusPill isSigned={isSigned} />}
        />

        <Box
          sx={{
            position: 'relative',
            mt: { xs: '-28px', md: '-72px' },
            bgcolor: colorTokens.neutral.white,
            borderRadius: { xs: '28px 28px 0 0', md: '28px' },
            border: { xs: 'none', md: '1px solid rgba(13, 30, 59, 0.06)' },
            boxShadow: {
              xs: '0 -10px 30px rgba(13, 30, 59, 0.08)',
              md: '0 18px 45px rgba(15, 29, 53, 0.08)',
            },
            px: { xs: 2.5, sm: 3.5, md: 4, lg: 5 },
            pt: { xs: 4, md: 4.5 },
            pb: { xs: 4, md: 5 },
            display: 'grid',
            gridTemplateColumns: {
              xs: 'minmax(0, 1fr)',
              md: 'minmax(0, 1fr) 320px',
              lg: 'minmax(0, 1fr) 340px',
            },
            columnGap: { md: 4, lg: 5 },
            alignItems: 'start',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="h1"
              sx={{
                color: colorTokens.text.heading,
                fontSize: { xs: 24, sm: 27, md: 32 },
                fontWeight: 800,
                lineHeight: 1.25,
                mb: { xs: 2.5, md: 3 },
                overflowWrap: 'anywhere',
              }}
            >
              {cert.title}
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'minmax(0, 1fr)',
                  sm: 'repeat(2, minmax(0, 1fr))',
                },
                gap: { xs: 2, sm: 2.5 },
                p: { xs: 0, md: 2.25 },
                borderRadius: { md: '20px' },
                bgcolor: { md: colorTokens.surface.panel },
                border: { md: '1px solid rgba(13, 30, 59, 0.05)' },
              }}
            >
              <EventInfoRow
                icon={<PersonOutlineRoundedIcon sx={{ fontSize: 21 }} />}
                title={cert.participantName}
                subtitle={cert.role}
              />
              <EventInfoRow
                icon={<CalendarTodayRoundedIcon sx={{ fontSize: 20 }} />}
                title={formatBahiaDate(cert.issueDate)}
                subtitle="Data de emissão"
              />
              {typeof cert.hours === 'number' && (
                <EventInfoRow
                  icon={<AccessTimeRoundedIcon sx={{ fontSize: 21 }} />}
                  title={`${cert.hours} horas`}
                  subtitle="Carga horária"
                />
              )}
              {isSigned && cert.assinadoPor && (
                <EventInfoRow
                  icon={<DrawRoundedIcon sx={{ fontSize: 21 }} />}
                  title={cert.assinadoPor}
                  subtitle={
                    cert.assinadoEm
                      ? `Assinado digitalmente em ${formatBahiaDate(cert.assinadoEm)}`
                      : 'Assinado digitalmente'
                  }
                />
              )}
            </Box>
          </Box>

          <Box sx={{ mt: { xs: 3.5, md: 0 }, minWidth: 0 }}>{actions}</Box>
        </Box>
      </Box>

      <Toast
        open={Boolean(toast)}
        message={toast?.message ?? ''}
        severity={toast?.severity ?? ToastSeverity.Error}
        onClose={() => setToast(null)}
      />
    </Box>
  );
}
