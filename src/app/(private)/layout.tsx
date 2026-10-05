'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import {
  AppShellSkeleton,
  AppTopBar,
  MobileBottomNav,
  MOBILE_NAV_HEIGHT,
} from '@/components/navigation';
import { useAuth } from '@/providers/auth-provider';

const PUBLIC_HOME_PATH = '/landing-page';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace(PUBLIC_HOME_PATH);
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(PUBLIC_HOME_PATH);
    }
  }, [isLoading, router, user]);

  if (isLoading) {
    return <AppShellSkeleton />;
  }

  // Sem usuário o efeito acima já está redirecionando (ex.: logo após "Sair");
  // o esqueleto aqui daria a impressão de que algo vai carregar.
  if (!user) {
    return null;
  }

  return (
    <>
      <AppTopBar userName={user.name} onLogout={handleLogout} />
      {/* Rodapés sticky (ex.: certificado) usam a variável para não ficarem atrás da barra inferior. */}
      <Box
        component="main"
        sx={(theme) => ({
          '--app-bottom-nav-height': MOBILE_NAV_HEIGHT,
          pb: 'var(--app-bottom-nav-height)',
          [theme.breakpoints.up('md')]: { '--app-bottom-nav-height': '0px' },
        })}
      >
        {children}
      </Box>
      <MobileBottomNav userName={user.name} onLogout={handleLogout} />
    </>
  );
}
