'use client';

import { useState, type ReactNode } from 'react';
import { Box, ButtonBase, CircularProgress, Tooltip, alpha } from '@mui/material';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import { CloseButton, ModalContainer } from '@/components/modals';
import { colorTokens } from '@/lib/colors';

// `null` deixa o leitor de PDF ajustar a página à largura do quadro.
const ZOOM_STEPS = [null, 75, 100, 125, 150, 200, 300] as const;

function ToolButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <Tooltip title={label} arrow>
      <span>
        <ButtonBase
          onClick={onClick}
          disabled={disabled}
          aria-label={label}
          sx={{
            width: { xs: 30, sm: 34 },
            height: { xs: 30, sm: 34 },
            borderRadius: '999px',
            color: colorTokens.text.heading,
            transition: 'background .18s ease, color .18s ease, opacity .18s ease',
            '&:hover': { bgcolor: colorTokens.surface.mint, color: colorTokens.brand.secondary },
            '&.Mui-disabled': { opacity: 0.4 },
          }}
        >
          {children}
        </ButtonBase>
      </span>
    </Tooltip>
  );
}

interface CertificatePreviewProps {
  url: string | null;
  loading: boolean;
  error: string;
  canRefresh: boolean;
  onRefresh: () => void;
}

export function CertificatePreview({
  url,
  loading,
  error,
  canRefresh,
  onRefresh,
}: CertificatePreviewProps) {
  const [zoomIndex, setZoomIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const zoom = ZOOM_STEPS[zoomIndex];
  const ready = !!url && !loading;

  // O leitor de PDF do navegador lê o zoom do fragmento da URL do blob.
  const src = url ? `${url}#${zoom ? `zoom=${zoom}` : 'view=FitH'}` : undefined;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.125 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Box
          component="span"
          sx={{
            minWidth: 0,
            fontSize: 12.5,
            fontWeight: 700,
            color: colorTokens.text.primary,
            whiteSpace: 'nowrap',
          }}
        >
          Pré-visualização
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
            p: '3px',
            borderRadius: '999px',
            border: `1px solid ${alpha(colorTokens.navigation.default, 0.1)}`,
            bgcolor: colorTokens.neutral.white,
          }}
        >
          <ToolButton
            label="Diminuir zoom"
            onClick={() => setZoomIndex((index) => Math.max(0, index - 1))}
            disabled={!ready || zoomIndex === 0}
          >
            <RemoveRoundedIcon sx={{ fontSize: 18 }} />
          </ToolButton>
          <ButtonBase
            onClick={() => setZoomIndex(0)}
            disabled={!ready}
            aria-label="Ajustar à largura"
            sx={{
              minWidth: { xs: 50, sm: 58 },
              height: { xs: 30, sm: 34 },
              px: 1,
              borderRadius: '999px',
              fontSize: 12.5,
              fontWeight: 700,
              color: colorTokens.text.muted,
              '&:hover': { bgcolor: colorTokens.surface.hover },
            }}
          >
            {zoom ? `${zoom}%` : 'Ajustar'}
          </ButtonBase>
          <ToolButton
            label="Aumentar zoom"
            onClick={() => setZoomIndex((index) => Math.min(ZOOM_STEPS.length - 1, index + 1))}
            disabled={!ready || zoomIndex === ZOOM_STEPS.length - 1}
          >
            <AddRoundedIcon sx={{ fontSize: 18 }} />
          </ToolButton>
          <Box
            aria-hidden
            sx={{
              width: '1px',
              height: 20,
              mx: { xs: 0.25, sm: 0.5 },
              bgcolor: alpha(colorTokens.navigation.default, 0.1),
            }}
          />
          <ToolButton label="Tela cheia" onClick={() => setFullscreen(true)} disabled={!ready}>
            <OpenInFullRoundedIcon sx={{ fontSize: 17 }} />
          </ToolButton>
          <ToolButton
            label="Atualizar pré-visualização"
            onClick={onRefresh}
            disabled={!canRefresh || loading}
          >
            <RefreshRoundedIcon sx={{ fontSize: 18 }} />
          </ToolButton>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'relative',
          height: { xs: 300, md: 420 },
          borderRadius: '20px',
          overflow: 'hidden',
          border: `2px solid ${colorTokens.brand.mint}`,
          bgcolor: colorTokens.surface.panel,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {loading ? (
          <CircularProgress
            size={28}
            sx={{ color: colorTokens.brand.secondary }}
            aria-label="Gerando pré-visualização"
          />
        ) : src ? (
          <Box
            key={src}
            component="iframe"
            src={src}
            title="Pré-visualização do certificado"
            className="animate-fade-up motion-reduce:animate-none"
            style={{ animationDuration: '0.3s' }}
            sx={{ width: '100%', height: '100%', border: 0, bgcolor: colorTokens.neutral.white }}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              color: colorTokens.text.label,
            }}
          >
            <PictureAsPdfOutlinedIcon sx={{ fontSize: 36 }} />
            <Box component="span" sx={{ fontSize: 12.5 }}>
              Pré-visualização indisponível
            </Box>
          </Box>
        )}
      </Box>
      {error && (
        <Box
          component="span"
          role="alert"
          sx={{ fontSize: 12, fontWeight: 600, color: colorTokens.status.error }}
        >
          {error}
        </Box>
      )}
      <ModalContainer
        open={fullscreen && !!src}
        onClose={() => setFullscreen(false)}
        sx={{ '& .MuiBackdrop-root': { bgcolor: alpha(colorTokens.shadow.overlay, 0.6) } }}
        paperClassName="animate-card-in motion-reduce:animate-none"
        paperSx={{
          m: { xs: 0, md: 3 },
          maxWidth: { xs: '100%', md: 1100 },
          height: { xs: '100dvh', md: 'calc(100dvh - 48px)' },
          maxHeight: 'none',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: { xs: 0, md: '24px' },
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
            p: '12px 12px 12px 20px',
            pt: { xs: 'calc(12px + env(safe-area-inset-top))', md: '12px' },
            background: colorTokens.navigation.gradient,
          }}
        >
          <Box
            component="h2"
            sx={{ m: 0, fontSize: 16, fontWeight: 800, color: colorTokens.neutral.white }}
          >
            Pré-visualização do certificado
          </Box>
          <CloseButton
            onClick={() => setFullscreen(false)}
            position="relative"
            top={0}
            right={0}
            sx={{
              width: 34,
              height: 34,
              color: colorTokens.neutral.white,
              bgcolor: alpha(colorTokens.neutral.white, 0.08),
              '&:hover': { bgcolor: alpha(colorTokens.neutral.white, 0.18) },
            }}
          />
        </Box>
        <Box
          component="iframe"
          src={src}
          title="Pré-visualização do certificado em tela cheia"
          sx={{ flex: 1, width: '100%', border: 0, bgcolor: colorTokens.neutral.white }}
        />
      </ModalContainer>
    </Box>
  );
}
