'use client';

import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import { Button } from '@/components/ui';
import type { TutorialRoleContent } from '../data';

interface TutorialStepsProps {
  content: TutorialRoleContent;
}

export function TutorialSteps({ content }: TutorialStepsProps) {
  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {content.steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === content.steps.length - 1;

          return (
            <Box key={step.title} sx={{ display: 'flex', gap: { xs: 2, md: 3 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <Box
                  sx={{
                    width: { xs: 48, md: 56 },
                    height: { xs: 48, md: 56 },
                    borderRadius: '50%',
                    backgroundColor: content.accentBg,
                    border: `1.5px solid ${content.accentBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    position: 'relative',
                  }}
                >
                  <Icon sx={{ fontSize: { xs: 22, md: 26 }, color: content.accent }} />

                  <Box
                    sx={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: content.accent,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography sx={{ color: '#fff', fontSize: '0.62rem', fontWeight: 800, lineHeight: 1 }}>
                      {index + 1}
                    </Typography>
                  </Box>
                </Box>

                {!isLast && (
                  <Box
                    sx={{
                      width: '2px',
                      flex: 1,
                      minHeight: 28,
                      background: `linear-gradient(180deg, ${content.accent} 0%, rgba(91,100,112,0.15) 100%)`,
                      opacity: 0.3,
                      my: 0.5,
                    }}
                  />
                )}
              </Box>

              <Box sx={{ pb: isLast ? 0 : 4, pt: 1 }}>
                <Typography sx={{ fontWeight: 800, color: '#13284D', fontSize: { xs: '1.02rem', md: '1.1rem' }, mb: 0.5 }}>
                  {step.title}
                </Typography>
                <Typography sx={{ color: '#5B6470', fontSize: { xs: '0.88rem', md: '0.95rem' }, lineHeight: 1.7 }}>
                  {step.description}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          component={Link}
          href={content.ctaHref}
          variant="contained"
          color="secondary"
          sx={{
            borderRadius: '999px',
            fontWeight: 700,
            px: 4.5,
            py: 1.3,
            fontSize: '1rem',
            boxShadow: '0 8px 28px rgba(5,150,105,0.3)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 14px 34px rgba(5,150,105,0.4)',
            },
          }}
        >
          {content.ctaLabel}
        </Button>
      </Box>
    </Box>
  );
}
