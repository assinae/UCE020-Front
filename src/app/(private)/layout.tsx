'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import { Sidebar, type NavLink } from '@/components/ui/Sidebar';
import { Home, Article, Event, PostAdd, DocumentScanner } from '@mui/icons-material';
import { useAuth } from '@/providers/auth-provider';

const NAV_LINKS: NavLink[] = [
  { icon: <Home />, label: 'Início', href: '/home' },
  { icon: <PostAdd />, label: 'Criar evento', href: '/event/register' },
  { icon: <Event />, label: 'Eventos Criados', href: '/event/list' },
  { icon: <DocumentScanner />, label: 'Monitoria', href: '/monitoria' },
  { icon: <Article />, label: 'Certificados', href: '/certificate/list' },
];

const PUBLIC_HOME_PATH = '/landing-page';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  if (isLoading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 text-sm font-medium text-[#0F1D35]">
        Carregando...
      </main>
    );
  }

  return (
    <>
      <Header user={user} onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navLinks={NAV_LINKS}
        user={user}
        onLogout={handleLogout}
      />
      <main className="pt-16">{children}</main>
    </>
  );
}
