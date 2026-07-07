export type UserRole = 'participant' | 'monitor' | 'organizer';

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
}
