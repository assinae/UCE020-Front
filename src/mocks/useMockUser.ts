import { useSyncExternalStore } from 'react';
import {
  MOCK_USER,
  MOCK_USER_CHANGED_EVENT,
  getCurrentMockUser,
} from './user';
import type { AppUser } from '@/types/user';

function subscribeToMockUserChanges(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  window.addEventListener('storage', onStoreChange);
  window.addEventListener(MOCK_USER_CHANGED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(MOCK_USER_CHANGED_EVENT, onStoreChange);
  };
}

export function useMockUser(): AppUser {
  return useSyncExternalStore(
    subscribeToMockUserChanges,
    getCurrentMockUser,
    () => MOCK_USER,
  );
}
