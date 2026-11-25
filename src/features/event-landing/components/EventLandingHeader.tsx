'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { Button } from '@/components/ui';
import { UserAvatar } from '@/components/navigation';
import { colorTokens } from '@/lib/colors';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useAuth } from '@/providers/auth-provider';
import { primaryCtaSx } from './ctaStyles';
import { EventLandingSectionLinks, type SectionLink } from './EventLandingSectionLinks';

interface EventLandingHeaderProps {
  sections?: SectionLink[];
  activeSectionId?: string;
  cta?: { href: string; label: string };
  showCta?: boolean;
}

const smallButtonSx = {
  fontSize: '0.9rem',
  minWidth: 'auto',
  px: 3,
  whiteSpace: 'nowrap',
} as const;

export function EventLandingHeader({
  sections = [],
  activeSectionId = '',
  cta,
  showCta = false,
}: EventLandingHeaderProps) {
  const { user, isLoading } = useAuth();
  const isReady = useHasMounted() && !isLoading;
  const ctaVisible = Boolean(cta && showCta);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        display: { xs: 'none', md: 'flex' },
        backgroundColor: 'white',
        color: colorTokens.text.heading,
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <Toolbar
        sx={{
          width: '100%',
          maxWidth: '1500px',
          mx: 'auto',
          px: 4,
          minHeight: '80px !important',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'stretch',
          gap: 2,
        }}
      >
        <Box
          component={Link}
          href={user ? '/home' : '/landing-page'}
          aria-label="Ir para o Assinaê"
          sx={{ display: 'flex', alignItems: 'center', justifySelf: 'start' }}
        >
          <Image src="/images/logos/logo1.png" alt="Assinaê" width={40} height={40} priority />
        </Box>

        <Box component="nav" aria-label="Seções do evento" sx={{ display: 'flex' }}>
          {sections.length > 0 && (
            <EventLandingSectionLinks
              sections={sections}
              activeId={activeSectionId}
              size="header"
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
          {isReady &&
            (ctaVisible && cta ? (
              <Box
                component={Link}
                href={cta.href}
                className="animate-fade-up motion-reduce:animate-none"
                sx={{ ...primaryCtaSx, py: 1, px: 2.75, fontSize: 14 }}
              >
                {cta.label}
              </Box>
            ) : user ? (
              <Button component={Link} href="/home" variant="contained" sx={smallButtonSx}>
                Ir para o Assinaê
              </Button>
            ) : (
              <Button component={Link} href="/login" variant="contained" sx={smallButtonSx}>
                Entrar
              </Button>
            ))}

          {isReady &&
            (user ? (
              <Box
                component={Link}
                href="/user-profile"
                aria-label={`Perfil de ${user.name}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1,
                  py: 0.5,
                  borderRadius: 999,
                  color: colorTokens.text.heading,
                  textDecoration: 'none',
                  transition: 'background-color .18s ease',
                  '&:hover': { backgroundColor: colorTokens.surface.hover },
                }}
              >
                <UserAvatar name={user.name} size={36} />
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    maxWidth: 140,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user.name.split(' ')[0]}
                </Typography>
              </Box>
            ) : (
              <Button component={Link} href="/register" variant="outlined" sx={smallButtonSx}>
                Criar conta
              </Button>
            ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
