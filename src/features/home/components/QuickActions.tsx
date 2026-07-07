'use client';

import Link from 'next/link';

import { Box, Typography, alpha } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FactCheckIcon from '@mui/icons-material/FactCheck';

// mobileVariant keeps the original 2x2 checkerboard look (navy/teal/teal/navy).
// desktopVariant makes the single row (4 across) alternate colors (navy/teal/navy/teal).
const QUICK_ACTIONS = [
  { line1: 'Criar Novo', line2: 'Evento', mobileVariant: 'navy', desktopVariant: 'navy', href: '/event/register', icon: AddRoundedIcon },
  { line1: 'Meus', line2: 'Certificados', mobileVariant: 'teal', desktopVariant: 'teal', href: '/certificate/list', icon: WorkspacePremiumIcon },
  { line1: 'Eventos', line2: 'Criados', mobileVariant: 'teal', desktopVariant: 'navy', href: '/event/list', icon: EventNoteIcon },
  { line1: 'Monitoria', line2: 'de Eventos', mobileVariant: 'navy', desktopVariant: 'teal', href: '/monitoring/list', icon: FactCheckIcon },
] as const;

const COLORS = {
  navy: {
    background: 'linear-gradient(135deg, #101828 0%, #1A2744 100%)',
    shadow: alpha('#101828', 0.35),
    iconColor: '#1A2744',
  },

  teal: {
    background: 'linear-gradient(135deg, #6ED7B4 0%, #008963 100%)',
    shadow: alpha('#43C79C', 0.3),
    iconColor: '#2EC4A0',
  },
};

export function QuickActions() {
  return (
    <Box
      sx={{
        width: '100%',

        display: 'grid',

        gridTemplateColumns: {
          xs: 'repeat(2, minmax(140px, 1fr))',
          sm: 'repeat(2, 170px)',
          md: 'repeat(4, minmax(0, 1fr))',
        },

        gap: {
          xs: 1.5,
          sm: 2,
        },

        justifyContent: { xs: 'center', md: 'stretch' },

        px: 2,
        py: 1,
      }}
    >
      {QUICK_ACTIONS.map((action) => {
        const mobileTheme = COLORS[action.mobileVariant];
        const desktopTheme = COLORS[action.desktopVariant];
        const Icon = action.icon;

        return (
          <Box
            key={action.href}
            component={Link}
            href={action.href}
            sx={{
              position: 'relative',

              minHeight: {
                xs: 128,
                sm: 142,
              },

              borderRadius: '22px',

              background: {
                xs: mobileTheme.background,
                md: desktopTheme.background,
              },

              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',

              textDecoration: 'none',

              overflow: 'hidden',

              px: 2.25,
              py: 2.25,

              boxShadow: {
                xs: `0 10px 25px ${mobileTheme.shadow}`,
                md: `0 10px 25px ${desktopTheme.shadow}`,
              },

              transition: 'transform .22s ease, box-shadow .22s ease, filter .22s ease, background .22s ease',

              '&:hover': {
                transform: 'translateY(-4px)',
                filter: 'brightness(1.03)',
              },

              '&:active': {
                transform: 'scale(0.98)',
              },
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '14px',

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                bgcolor: '#fff',
                boxShadow: '0 6px 14px rgba(15, 29, 53, 0.18)',
              }}
            >
              <Icon
                sx={{
                  color: { xs: mobileTheme.iconColor, md: desktopTheme.iconColor },
                  fontSize: 22,
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  color: '#fff',

                  fontSize: {
                    xs: 16,
                    sm: 17,
                  },

                  fontWeight: 800,

                  lineHeight: 1.15,

                  letterSpacing: '-0.02em',
                }}
              >
                {action.line1}
              </Typography>

              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.85)',

                  fontSize: {
                    xs: 14.5,
                    sm: 15.5,
                  },

                  fontWeight: 600,

                  lineHeight: 1.2,

                  mt: 0.2,

                  letterSpacing: '-0.01em',
                }}
              >
                {action.line2}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}