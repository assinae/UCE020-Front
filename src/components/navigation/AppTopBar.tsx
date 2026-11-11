'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Box, ButtonBase, Menu, MenuItem, alpha } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { colorTokens } from '@/lib/colors';
import { UserAvatar } from './UserAvatar';

const WHITE = colorTokens.neutral.white;
const ACTIVE_BG = alpha(colorTokens.brand.mint, 0.2);

interface AppTopBarProps {
  userName: string;
  onLogout: () => void;
}

export function AppTopBar({ userName, onLogout }: AppTopBarProps) {
  const pathname = usePathname();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const firstName = userName.split(' ')[0] || userName;
  const isHome = pathname === '/home';

  return (
    <Box
      component="header"
      sx={{
        display: { xs: 'none', md: 'block' },
        position: 'sticky',
        top: 0,
        zIndex: 'appBar',
        background: colorTokens.navigation.gradient,
      }}
    >
      <Box
        sx={{
          maxWidth: 1180,
          mx: 'auto',
          px: 3,
          py: 1.5,
          minHeight: 72,
          display: 'flex',
          alignItems: 'center',
          gap: 2.5,
        }}
      >
        <Box
          component={Link}
          href="/home"
          sx={{ display: 'flex', alignItems: 'center', gap: 1.25, textDecoration: 'none' }}
        >
          <Image src="/logo_white.svg" alt="" width={34} height={34} />
          <Box
            component="span"
            sx={{ color: WHITE, fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}
          >
            Assinaê
          </Box>
        </Box>

        <Box component="nav" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
          <Box
            component={Link}
            href="/home"
            aria-current={isHome ? 'page' : undefined}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              px: '15px',
              py: '9px',
              borderRadius: '999px',
              color: WHITE,
              fontSize: 13.5,
              fontWeight: 600,
              textDecoration: 'none',
              bgcolor: isHome ? ACTIVE_BG : 'transparent',
              transition: 'background .18s ease',
              '&:hover': { bgcolor: alpha(WHITE, 0.14) },
            }}
          >
            <HomeOutlinedIcon sx={{ fontSize: 18 }} />
            Início
          </Box>
        </Box>

        <ButtonBase
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          aria-haspopup="menu"
          aria-expanded={Boolean(menuAnchor)}
          aria-label="Abrir menu do usuário"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            py: '6px',
            pl: '6px',
            pr: '14px',
            borderRadius: '999px',
            border: `1px solid ${alpha(WHITE, 0.18)}`,
            bgcolor: alpha(WHITE, 0.08),
            transition: 'background .18s ease',
            '&:hover': { bgcolor: alpha(WHITE, 0.16) },
          }}
        >
          <UserAvatar name={userName} size={32} />
          <Box component="span" sx={{ color: WHITE, fontSize: 13, fontWeight: 600 }}>
            {firstName}
          </Box>
        </ButtonBase>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: '18px',
                boxShadow: `0 18px 44px ${alpha(colorTokens.navigation.default, 0.18)}`,
                '& .MuiMenuItem-root': {
                  gap: 1.25,
                  fontSize: 14,
                  fontWeight: 600,
                  color: colorTokens.text.heading,
                  py: 1.25,
                },
              },
            },
          }}
        >
          <MenuItem component={Link} href="/user-profile" onClick={() => setMenuAnchor(null)}>
            <PersonOutlineRoundedIcon sx={{ fontSize: 20, color: colorTokens.text.muted }} />
            Ver meu perfil
          </MenuItem>
          <MenuItem
            onClick={() => {
              setMenuAnchor(null);
              onLogout();
            }}
          >
            <LogoutRoundedIcon sx={{ fontSize: 20, color: colorTokens.text.muted }} />
            Sair
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
