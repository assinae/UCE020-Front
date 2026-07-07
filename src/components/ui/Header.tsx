'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AppBar, Box, Toolbar } from '@mui/material';
import { Button } from '@/components/ui';

interface User {
  name: string;
}

interface HeaderProps {
  user?: User | null;
  onMenuClick?: () => void;
}

function HamburgerIcon({ color }: { color: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function Header({ user = null, onMenuClick }: HeaderProps) {
  const isLoggedIn = !!user;
  const pathname = usePathname();
  const isPageLearnMore = pathname.includes('/landing-page/learn-more');

  if (isLoggedIn) {
    return (
      <header className="fixed top-0 left-0 right-0 z-30 w-full bg-[#101828] px-4 sm:px-6">
        <div className="mx-auto max-w-7xl flex items-center h-16 relative">
          <button
            onClick={onMenuClick}
            aria-label="Abrir menu"
            className="text-white hover:opacity-70 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EC4A0] rounded"
          >
            <HamburgerIcon color="white" />
          </button>
        </div>
      </header>
    );
  }

  if (isPageLearnMore) {
    return (
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          color: '#111',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Toolbar
          sx={{
            width: '100%',
            maxWidth: '1500px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: { xs: 2, sm: 3, md: 4 },
            py: 1.5,
            gap: 2,
            minHeight: '80px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Image src="/images/logos/logo1.png" alt="Logo" width={40} height={40} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1, md: 2 }, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Button
              component={Link}
              href="/login"
              variant="contained"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }, minWidth: 'auto', px: { xs: 1.5, sm: 2, md: 3 } }}
            >
              Entrar
            </Button>
            <Button
              component={Link}
              href="/register"
              variant="outlined"
              sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }, minWidth: 'auto', px: { xs: 1.5, sm: 2, md: 3 } }}
            >
              Criar Conta
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'white',
        color: '#111',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <Toolbar
        sx={{
          width: '100%',
          maxWidth: '1500px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, sm: 3, md: 4 },
          py: 1.5,
          gap: 2,
          minHeight: '80px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Image src="/images/logos/logo1.png" alt="Logo" width={40} height={40} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1, md: 2 }, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Button
            component={Link}
            href="#hero-section"
            variant="text"
            sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }, minWidth: 'auto', px: { xs: 1, sm: 1.5, md: 2 } }}
          >
            Início
          </Button>
          <Button
            component={Link}
            href="#about-section"
            variant="text"
            sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }, minWidth: 'auto', px: { xs: 1, sm: 1.5, md: 2 } }}
          >
            Sobre
          </Button>
          <Button
            component={Link}
            href="/login"
            variant="contained"
            sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }, minWidth: 'auto', px: { xs: 1.5, sm: 2, md: 3 } }}
          >
            Entrar
          </Button>
          <Button
            component={Link}
            href="/register"
            variant="outlined"
            sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }, minWidth: 'auto', px: { xs: 1.5, sm: 2, md: 3 } }}
          >
            Criar Conta
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
