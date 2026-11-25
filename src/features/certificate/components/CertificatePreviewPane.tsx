'use client';

import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';
import { Box, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import { BackButton } from '@/components/ui';
// Mesma pílula branca translúcida da capa do evento, para os dois cabeçalhos
// sobrepostos terem o mesmo peso visual.
import { heroOverlayButtonSx } from '@/features/event/components/EventHero';
import { colorTokens } from '@/lib/colors';
import { CertificatePdfPage } from './CertificatePdfPage';

interface CertificatePreviewPaneProps {
  url?: string;
  blob?: Blob;
  isLoading: boolean;
  error?: string;
  /** Chip de status, sobreposto no canto superior direito da capa. */
  action?: ReactNode;
}

/** A4 deitado: a proporção do PDF, usada enquanto a página não foi lida. */
const SHEET_RATIO = '1.414 / 1';

function openInNewTab(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Capa do certificado, no mesmo molde da capa do evento: fundo escuro de ponta
 * a ponta no mobile, arredondado no desktop, com o botão de voltar e o status
 * sobrepostos — e a folha branca de conteúdo subindo por cima da base.
 *
 * O certificado aparece como uma folha com sombra, desenhada pelo pdf.js. Um
 * toque (ou clique no ícone) abre o PDF completo no leitor do aparelho.
 */
export function CertificatePreviewPane({
  url,
  blob,
  isLoading,
  error,
  action,
}: CertificatePreviewPaneProps) {
  const [renderFailed, setRenderFailed] = useState(false);
  const handleFailure = useCallback(() => setRenderFailed(true), []);

  const status = isLoading ? 'loading' : blob && url ? 'ready' : 'error';

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: 340, sm: 390 },
        borderRadius: { xs: 0, md: '28px' },
        overflow: 'hidden',
        background: colorTokens.navigation.gradient,
        display: 'grid',
        placeItems: 'center',
        px: { xs: 3, md: 5 },
        // Reserva espaço para os botões sobrepostos no topo e, embaixo, para a
        // folha branca de conteúdo, que sobe por cima da capa.
        pt: { xs: 8, md: 10 },
        pb: { xs: 6, md: 14 },
      }}
    >
      <Box aria-hidden sx={{ position: 'absolute', inset: 0 }}>
        <Box
          sx={{
            position: 'absolute',
            top: -70,
            right: -40,
            width: { xs: 260, md: 380 },
            height: { xs: 260, md: 380 },
            borderRadius: '50%',
            bgcolor: 'rgba(118, 227, 188, 0.14)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -90,
            left: -60,
            width: { xs: 220, md: 320 },
            height: { xs: 220, md: 320 },
            borderRadius: '50%',
            bgcolor: 'rgba(118, 227, 188, 0.08)',
          }}
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: { xs: 14, md: 22 },
          left: { xs: 14, md: 22 },
          right: { xs: 14, md: 22 },
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <BackButton
          fallbackHref="/certificate/list"
          iconVariant="compact"
          sx={heroOverlayButtonSx}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {url && (
            <Tooltip title="Abrir PDF em nova aba">
              <IconButton
                aria-label="Abrir PDF em nova aba"
                onClick={() => openInNewTab(url)}
                sx={heroOverlayButtonSx}
              >
                <OpenInNewRoundedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          )}
          {action}
        </Box>
      </Box>

      {status === 'loading' ? (
        <CircularProgress size={28} sx={{ color: colorTokens.brand.primary }} />
      ) : status === 'error' ? (
        <Box
          sx={{
            position: 'relative',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <ErrorOutlineRoundedIcon sx={{ fontSize: 36, color: colorTokens.status.warning }} />
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: colorTokens.neutral.white }}>
            {error ?? 'Não foi possível carregar a pré-visualização'}
          </Typography>
          <Typography sx={{ fontSize: 13 }}>O download continua disponível abaixo.</Typography>
        </Box>
      ) : (
        <Box
          component="button"
          type="button"
          aria-label="Abrir certificado em PDF"
          onClick={() => url && openInNewTab(url)}
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: { xs: 320, md: 700 },
            maxHeight: '100%',
            p: 0,
            border: 0,
            borderRadius: { xs: '14px', md: '16px' },
            overflow: 'hidden',
            bgcolor: colorTokens.neutral.white,
            boxShadow: '0 22px 50px rgba(9, 18, 35, 0.42)',
            cursor: 'pointer',
            lineHeight: 0,
            transition: 'transform 180ms ease, box-shadow 180ms ease',
            '&:hover': {
              transform: { md: 'translateY(-2px)' },
              boxShadow: { md: '0 26px 60px rgba(9, 18, 35, 0.5)' },
            },
            '&:active': { transform: 'scale(0.995)' },
          }}
        >
          {renderFailed ? (
            // O pdf.js não conseguiu desenhar: cai no cartão simples, que ainda
            // abre o arquivo no leitor do navegador.
            <Box
              sx={{
                aspectRatio: SHEET_RATIO,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                px: 3,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: colorTokens.surface.mint,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <PictureAsPdfRoundedIcon
                  sx={{ fontSize: 24, color: colorTokens.brand.secondary }}
                />
              </Box>
              <Typography
                sx={{ fontSize: 15, fontWeight: 800, color: colorTokens.text.heading, mt: 0.5 }}
              >
                Abrir certificado
              </Typography>
              <Typography sx={{ fontSize: 12.5, color: colorTokens.text.label, lineHeight: 1.35 }}>
                Abre o PDF no leitor do seu aparelho
              </Typography>
            </Box>
          ) : (
            <CertificatePdfPage blob={blob} onFailure={handleFailure} />
          )}
        </Box>
      )}
    </Box>
  );
}
