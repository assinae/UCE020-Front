'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { ModalContainer, CloseButton } from '@/components/modals';
import { Button } from '@/components/ui';
import { StepImageFrame } from './StepImageFrame';
import type { TutorialRoleContent } from '../data';

interface TutorialStepModalProps {
  open: boolean;
  content: TutorialRoleContent | null;
  onClose: () => void;
}

export function TutorialStepModal({ open, content, onClose }: TutorialStepModalProps) {
  const [pageIndex, setPageIndex] = useState(0);

  // Always reopen at the first page for a fresh role.
  useEffect(() => {
    if (open) setPageIndex(0);
  }, [open, content?.role]);

  if (!content) return null;

  const totalSteps = content.steps.length;
  const step = content.steps[pageIndex];
  const StepIcon = step.icon;
  const isFirst = pageIndex === 0;
  const isLast = pageIndex === totalSteps - 1;

  function goPrev() {
    setPageIndex((current) => Math.max(0, current - 1));
  }

  function goNext() {
    setPageIndex((current) => Math.min(totalSteps - 1, current + 1));
  }

  return (
    <ModalContainer
      open={open}
      onClose={onClose}
      paperSx={{
        maxWidth: 880,
        width: '100%',
        borderRadius: { xs: '18px', md: '28px' },
        overflow: 'hidden',
        m: { xs: 1, sm: 2, md: 3 },
        maxHeight: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 32px)' },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 20,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <CloseButton onClick={onClose} position="relative" top={0} right={0} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            minHeight: { md: 460 },
            maxHeight: { xs: '100%', md: 'none' },
            overflowY: { xs: 'auto', md: 'visible' },
          }}
        >
          {/* Left page: explanation (shown second on mobile, first on desktop) */}
          <Box
            sx={{
              order: { xs: 2, md: 1 },
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: content.accentBg,
              px: { xs: 2.5, sm: 3, md: 5 },
              py: { xs: 2.5, sm: 4, md: 5 },
              gap: { xs: 2, md: 3 },
            }}
          >
            <Box>
              <Typography
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: { xs: 1.5, sm: 1.75 },
                  py: { xs: 0.4, sm: 0.5 },
                  borderRadius: '999px',
                  backgroundColor: '#fff',
                  border: `1px solid ${content.accentBorder}`,
                  color: content.accent,
                  fontWeight: 700,
                  fontSize: { xs: '0.68rem', sm: '0.75rem' },
                  mb: { xs: 1.75, md: 2.5 },
                  maxWidth: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Passo {pageIndex + 1} de {totalSteps} · {content.label}
              </Typography>

              <Box
                sx={{
                  width: { xs: 44, sm: 52 },
                  height: { xs: 44, sm: 52 },
                  borderRadius: { xs: '14px', sm: '16px' },
                  backgroundColor: '#fff',
                  border: `1px solid ${content.accentBorder}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: { xs: 1.75, md: 2.5 },
                }}
              >
                <StepIcon sx={{ fontSize: { xs: 22, sm: 26 }, color: content.accent }} />
              </Box>

              <Typography
                sx={{
                  fontWeight: 800,
                  color: '#13284D',
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.45rem' },
                  lineHeight: 1.25,
                  mb: { xs: 1, md: 1.5 },
                }}
              >
                {step.title}
              </Typography>

              <Typography
                sx={{
                  color: '#4B5768',
                  fontSize: { xs: '0.86rem', sm: '0.92rem', md: '0.98rem' },
                  lineHeight: 1.6,
                }}
              >
                {step.description}
              </Typography>
            </Box>

            {/* Bottom: page dots + navigation */}
            <Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: { xs: 1.75, md: 2.5 } }}>
                {content.steps.map((s, index) => (
                  <Box
                    key={s.title}
                    onClick={() => setPageIndex(index)}
                    sx={{
                      width: index === pageIndex ? 22 : 8,
                      height: 8,
                      borderRadius: '999px',
                      backgroundColor: index === pageIndex ? content.accent : `${content.accent}33`,
                      cursor: 'pointer',
                      transition: 'width 0.25s ease, background-color 0.25s ease',
                    }}
                  />
                ))}
              </Box>

              {isLast ? (
                <Button
                  component={Link}
                  href={content.ctaHref}
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{
                    borderRadius: '999px',
                    fontWeight: 700,
                    py: { xs: 1, sm: 1.2 },
                    fontSize: { xs: '0.82rem', sm: '0.9rem' },
                  }}
                >
                  {content.ctaLabel}
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.25 } }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={goPrev}
                    disabled={isFirst}
                    sx={{ borderRadius: '999px', fontWeight: 700, minWidth: 0, px: { xs: 1.5, sm: 2 }, flexShrink: 0 }}
                    aria-label="Passo anterior"
                  >
                    <ArrowBackRoundedIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={goNext}
                    fullWidth
                    sx={{ borderRadius: '999px', fontWeight: 700, fontSize: { xs: '0.82rem', sm: '0.9rem' } }}
                    rightIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
                  >
                    Próximo passo
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          {/* Spine */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              order: { md: 2 },
              width: '10px',
              background:
                'linear-gradient(90deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.02) 35%, rgba(0,0,0,0.02) 65%, rgba(0,0,0,0.08) 100%)',
              flexShrink: 0,
            }}
          />

          {/* Right page: image — shown first on mobile, like a preview of the screen being described */}
          <Box
            sx={{
              order: { xs: 1, md: 3 },
              flex: { xs: '0 0 auto', md: 1 },
              backgroundColor: { xs: '#F4F6F9', md: '#fff' },
              p: { xs: 2, sm: 2.5, md: 3.5 },
              display: 'flex',
              // Explicit `height` (not `minHeight`) so the percentage-height
              // image frame inside has a definite size to resolve against —
              // otherwise it collapses to 0px and nothing is visible.
              height: { xs: 300, sm: 340, md: 'auto' },
              flexShrink: 0,
            }}
          >
            <StepImageFrame
              src={step.image}
              hint={step.imageHint}
              alt={step.title}
              accent={content.accent}
            />
          </Box>
        </Box>
      </Box>
    </ModalContainer>
  );
}
