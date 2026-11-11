'use client';

import { useEffect, useState } from 'react';

const CLOCK_TICK_MS = 60_000;

export function useNow() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), CLOCK_TICK_MS);
    return () => clearInterval(timer);
  }, []);

  return now;
}
