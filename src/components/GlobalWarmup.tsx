'use client';

import { useEffect } from 'react';

const DEFAULT_API_URL = 'https://assinae.up.railway.app/api/v1';

export function GlobalWarmup() {
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

    fetch(apiUrl, {
      method: 'GET',
      cache: 'no-store',
    }).catch(() => undefined);
  }, []);

  return null;
}
