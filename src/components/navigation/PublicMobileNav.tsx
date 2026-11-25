'use client';

import { Box } from '@mui/material';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useAuth } from '@/providers/auth-provider';
import { MOBILE_NAV_HEIGHT, MobileBottomNav, type MobileNavLink } from './MobileBottomNav';

interface PublicMobileNavProps {
  links?: MobileNavLink[];
}

export function PublicMobileNav({ links = [] }: PublicMobileNavProps) {
  const { user, isLoading, logout } = useAuth();
  const isReady = useHasMounted() && !isLoading;

  return (
    <>
      <Box aria-hidden sx={{ display: { xs: 'block', md: 'none' }, height: MOBILE_NAV_HEIGHT }} />
      {isReady &&
        (user ? (
          <MobileBottomNav userName={user.name} onLogout={logout} />
        ) : (
          <MobileBottomNav variant="guest" homeHref="/landing-page" guestLinks={links} />
        ))}
    </>
  );
}
