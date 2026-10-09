'use client';

import type { ReactNode } from 'react';
import { Box, ButtonBase, alpha } from '@mui/material';
import { CloseButton, ModalContainer } from '@/components/modals';
import { colorTokens } from '@/lib/colors';
import { PillButton } from './FormControls';

const WHITE = colorTokens.neutral.white;

interface FormSheetProps {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  /** Largura no desktop, onde a folha vira um modal central. */
  desktopMaxWidth?: number;
  footer: ReactNode;
  children: ReactNode;
}

export function FormSheet({
  open,
  onClose,
  eyebrow,
  title,
  desktopMaxWidth = 560,
  footer,
  children,
}: FormSheetProps) {
  return (
    <ModalContainer
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-container': { alignItems: { xs: 'flex-end', md: 'center' } },
        '& .MuiBackdrop-root': {
          bgcolor: alpha(colorTokens.shadow.overlay, 0.5),
          backdropFilter: 'blur(2px)',
        },
      }}
      paperClassName="max-mui:animate-sheet-in mui:animate-card-in motion-reduce:animate-none"
      paperSx={{
        m: { xs: 0, md: 3 },
        maxWidth: { xs: '100%', md: desktopMaxWidth },
        height: { xs: '92dvh', md: 'auto' },
        maxHeight: { xs: '92dvh', md: '90vh' },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: { xs: '28px 28px 0 0', md: '28px' },
        bgcolor: WHITE,
        boxShadow: `0 -14px 44px ${alpha(colorTokens.shadow.overlay, 0.32)}`,
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          p: '14px 18px',
          background: colorTokens.navigation.gradient,
        }}
      >
        <Box
          aria-hidden
          sx={{
            display: { xs: 'block', md: 'none' },
            alignSelf: 'center',
            width: 40,
            height: 4,
            borderRadius: '999px',
            bgcolor: alpha(WHITE, 0.3),
          }}
        />
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}
        >
          <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Box
              component="span"
              sx={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: colorTokens.brand.primary,
              }}
            >
              {eyebrow}
            </Box>
            <Box
              component="h2"
              sx={{ m: 0, fontSize: 19, fontWeight: 800, letterSpacing: '-0.02em', color: WHITE }}
            >
              {title}
            </Box>
          </Box>
          <CloseButton
            onClick={onClose}
            position="relative"
            top={0}
            right={0}
            sx={{
              width: 34,
              height: 34,
              border: `1px solid ${alpha(WHITE, 0.22)}`,
              bgcolor: alpha(WHITE, 0.08),
              color: WHITE,
              '&:hover': { bgcolor: alpha(WHITE, 0.18) },
            }}
          />
        </Box>
      </Box>

      <Box
        className="animate-fade-up motion-reduce:animate-none"
        style={{ animationDelay: '0.12s', animationDuration: '0.4s' }}
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          p: '16px 18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.75,
        }}
      >
        {children}
      </Box>

      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: '12px 18px 18px',
          pb: { xs: 'calc(18px + env(safe-area-inset-bottom))', md: '18px' },
          borderTop: `1px solid ${alpha(colorTokens.navigation.default, 0.08)}`,
          bgcolor: WHITE,
        }}
      >
        {footer}
      </Box>
    </ModalContainer>
  );
}

interface SheetActionsProps {
  submitLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

export function SheetActions({ submitLabel, onSubmit, onCancel, disabled }: SheetActionsProps) {
  return (
    <>
      <PillButton onClick={onSubmit} disabled={disabled} sx={{ width: '100%', minHeight: 50 }}>
        {submitLabel}
      </PillButton>
      <ButtonBase
        onClick={onCancel}
        sx={{
          width: '100%',
          py: '11px',
          borderRadius: '999px',
          fontSize: 13.5,
          fontWeight: 700,
          color: colorTokens.text.muted,
          transition: 'background .18s ease',
          '&:hover': { bgcolor: colorTokens.surface.hover },
        }}
      >
        Cancelar
      </ButtonBase>
    </>
  );
}
