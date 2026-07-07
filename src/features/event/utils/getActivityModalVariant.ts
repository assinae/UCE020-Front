import type { ActivityModalVariant } from '@/types/activity';
import type { UserRole } from '@/types/user';

export function getActivityModalVariant(role: UserRole, isEnrolled: boolean): ActivityModalVariant {
  if (role === 'organizer') return 'organizer';
  if (role === 'monitor') return 'monitor';
  return isEnrolled ? 'manage' : 'signup';
}
