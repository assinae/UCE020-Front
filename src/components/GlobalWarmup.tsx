'use client';

import { useEffect } from 'react';

const DEFAULT_API_URL = 'https://assinae.up.railway.app/api/v1';

export function GlobalWarmup() {
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

    const warmupApi = () => {
      fetch(apiUrl, {
        method: 'GET',
        cache: 'no-store',
      }).catch(() => undefined);
    };

    warmupApi();

    const handleFocus = () => {
      warmupApi();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return null;
}
