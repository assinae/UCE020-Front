'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Box, ButtonBase, alpha } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { colorTokens } from '@/lib/colors';
import { QuickActionCard } from './QuickActionCard';
import { QUICK_ACTIONS } from './quickActions';
import { UserAvatar } from './UserAvatar';

const WHITE = colorTokens.neutral.white;
const INK = colorTokens.navigation.default;
const OVERLAY = colorTokens.shadow.overlay;

export const MOBILE_NAV_HEIGHT = 'calc(68px + env(safe-area-inset-bottom))';

interface MobileBottomNavProps {
  userName: string;
  onLogout: () => void;
}

export function MobileBottomNav({ userName, onLogout }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  return (
    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
      {open && (
        <Box
          aria-hidden
          onClick={close}
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 'drawer',
            bgcolor: alpha(OVERLAY, 0.44),
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <Box
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'none',
        }}
      >
        {open && (
          <Box
            id="mobile-nav-sheet"
            role="dialog"
            aria-label="Menu"
            className="animate-sheet-up motion-reduce:animate-none"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              mx: '10px',
              mb: 1,
              p: '18px 18px 22px',
              maxHeight: `calc(100dvh - ${MOBILE_NAV_HEIGHT} - 24px)`,
              overflowY: 'auto',
              bgcolor: WHITE,
              border: `1px solid ${alpha(INK, 0.07)}`,
              borderRadius: '30px',
              boxShadow: `0 -10px 40px ${alpha(OVERLAY, 0.22)}`,
              pointerEvents: 'auto',
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 4,
                borderRadius: '999px',
                bgcolor: alpha(INK, 0.14),
                alignSelf: 'center',
              }}
            />

            <Box
              component={Link}
              href="/user-profile"
              onClick={close}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.75,
                p: '14px 16px',
                borderRadius: '22px',
                border: `1px solid ${alpha(INK, 0.07)}`,
                bgcolor: colorTokens.surface.muted,
                textDecoration: 'none',
                transition: 'background .18s ease, border-color .18s ease',
                '&:hover': {
                  bgcolor: colorTokens.surface.mintSubtle,
                  borderColor: colorTokens.brand.secondary,
                },
              }}
            >
              <UserAvatar name={userName} size={46} />
              <Box
                sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: colorTokens.text.heading,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {userName}
                </Box>
                <Box
                  component="span"
                  sx={{ fontSize: 12.5, fontWeight: 500, color: colorTokens.text.muted }}
                >
                  Ver meu perfil
                </Box>
              </Box>
              <ChevronRightRoundedIcon sx={{ fontSize: 20, color: colorTokens.text.muted }} />
            </Box>

            <SectionHeading title="Ações rápidas" size="sm" />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {QUICK_ACTIONS.map((action) => (
                <QuickActionCard key={action.href} action={action} size="sm" onClick={close} />
              ))}
            </Box>

            <ButtonBase
              onClick={() => {
                close();
                onLogout();
              }}
              sx={{
                gap: 1,
                minHeight: 48,
                borderRadius: '999px',
                border: `1.5px solid ${alpha(INK, 0.12)}`,
                color: colorTokens.text.heading,
                fontSize: 14,
                fontWeight: 700,
                '&:hover': { bgcolor: colorTokens.surface.muted },
              }}
            >
              <LogoutRoundedIcon sx={{ fontSize: 19 }} />
              Sair
            </ButtonBase>
          </Box>
        )}

        <Box
          component="nav"
          aria-label="Navegação principal"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
            px: '18px',
            pt: '10px',
            pb: 'calc(10px + env(safe-area-inset-bottom))',
            background: colorTokens.navigation.gradient,
            borderRadius: '26px 26px 0 0',
            boxShadow: `0 -8px 28px ${alpha(OVERLAY, 0.26)}`,
            pointerEvents: 'auto',
          }}
        >
          <Box
            component={Link}
            href="/home"
            onClick={close}
            aria-current={pathname === '/home' ? 'page' : undefined}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              minHeight: 48,
              py: 1,
              pl: 1,
              pr: 2,
              borderRadius: '999px',
              textDecoration: 'none',
              bgcolor: pathname === '/home' ? alpha(colorTokens.brand.mint, 0.2) : 'transparent',
              transition: 'background .18s ease',
            }}
          >
            <Image src="/logo_white.svg" alt="" width={30} height={30} />
            <Box
              component="span"
              sx={{ color: WHITE, fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}
            >
              Início
            </Box>
          </Box>

          <ButtonBase
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="mobile-nav-sheet"
            sx={{
              gap: 1.25,
              minHeight: 48,
              py: '6px',
              pl: '6px',
              pr: 2,
              borderRadius: '999px',
              border: `1px solid ${alpha(WHITE, 0.18)}`,
              bgcolor: open ? alpha(colorTokens.brand.mint, 0.22) : alpha(WHITE, 0.08),
              transition: 'background .18s ease',
            }}
          >
            <UserAvatar name={userName} size={36} />
            <ExpandMoreRoundedIcon
              sx={{
                fontSize: 20,
                color: WHITE,
                transform: open ? 'rotate(180deg)' : 'none',
                transition: 'transform .22s ease',
              }}
            />
          </ButtonBase>
        </Box>
      </Box>
    </Box>
  );
}
