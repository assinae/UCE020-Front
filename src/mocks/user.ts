import type { AppUser } from '@/types/user';

export const MOCK_USERS_AVAILABLE = {
  participant: {
    id: 'p1',
    name: 'Tiago Abreu Participante',
    role: 'participant',
  },
  monitor: {
    id: 'monitor-001',
    name: 'Joãozinho Monitor',
    role: 'monitor',
  },
  organizer: {
    id: 'organizer-001',
    name: 'Mariazinha Organizadora',
    role: 'organizer',
  },
} satisfies Record<string, AppUser>;

export type MockUserKey = keyof typeof MOCK_USERS_AVAILABLE;

export const MOCK_USER_STORAGE_KEY = 'mock-current-user';
export const MOCK_USER_CHANGED_EVENT = 'mock-current-user-change';
export const DEFAULT_MOCK_USER_KEY: MockUserKey = 'participant';
export const MOCK_USER: AppUser = MOCK_USERS_AVAILABLE[DEFAULT_MOCK_USER_KEY];

export function isMockUserKey(value: string | null): value is MockUserKey {
  return !!value && value in MOCK_USERS_AVAILABLE;
}

export function getCurrentMockUserKey(): MockUserKey {
  if (typeof window === 'undefined') {
    return DEFAULT_MOCK_USER_KEY;
  }

  try {
    const userKey = localStorage.getItem(MOCK_USER_STORAGE_KEY);
    return isMockUserKey(userKey) ? userKey : DEFAULT_MOCK_USER_KEY;
  } catch {
    return DEFAULT_MOCK_USER_KEY;
  }
}

export function getCurrentMockUser(): AppUser {
  return MOCK_USERS_AVAILABLE[getCurrentMockUserKey()];
}

export function setCurrentMockUser(userKey: MockUserKey) {
  if (typeof window === 'undefined') return;

  localStorage.setItem(MOCK_USER_STORAGE_KEY, userKey);
  window.dispatchEvent(new Event(MOCK_USER_CHANGED_EVENT));
}
