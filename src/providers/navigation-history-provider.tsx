'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationHistoryValue {
  canGoBack: boolean;
  previousPath: string | null;
}

const NavigationHistoryContext = createContext<NavigationHistoryValue>({
  canGoBack: false,
  previousPath: null,
});

export function NavigationHistoryProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [history, setHistory] = useState<NavigationHistoryValue>({
    canGoBack: false,
    previousPath: null,
  });
  const currentPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (currentPathRef.current === pathname) return;

    const previousPath = currentPathRef.current;
    currentPathRef.current = pathname;

    if (previousPath === null) return;

    setHistory({ canGoBack: true, previousPath });
  }, [pathname]);

  return (
    <NavigationHistoryContext.Provider value={history}>
      {children}
    </NavigationHistoryContext.Provider>
  );
}

export function useNavigationHistory(): NavigationHistoryValue {
  return useContext(NavigationHistoryContext);
}
