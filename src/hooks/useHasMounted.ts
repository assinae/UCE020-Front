'use client';

import { useSyncExternalStore } from 'react';

const subscribeNoop = () => () => {};

export function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
}
