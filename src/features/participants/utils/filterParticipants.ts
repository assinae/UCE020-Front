import type { Participant, PresenceFilter } from '@/types/participant';

export function sortByPendingFirst(participants: Participant[]): Participant[] {
  return [...participants].sort((a, b) => {
    if (a.presenceStatus === b.presenceStatus) return 0;
    return a.presenceStatus === 'pending' ? -1 : 1;
  });
}

export function filterParticipants(
  participants: unknown,
  search: string,
  presenceFilter: PresenceFilter,
): Participant[] {
  const safeParticipants = Array.isArray(participants) ? participants : [];
  const query = search.trim().toLowerCase();

  const filtered = safeParticipants.filter((participant) => {
    const matchesSearch =
      !query || participant.name.toLowerCase().includes(query);

    const matchesFilter =
      presenceFilter === 'all' || participant.presenceStatus === presenceFilter;

    return matchesSearch && matchesFilter;
  });

  return sortByPendingFirst(filtered);
}

export function countByPresenceStatus(participants: unknown): {
  confirmed: number;
  pending: number;
  total: number;
} {
  const safeParticipants = Array.isArray(participants) ? (participants as Participant[]) : [];
  const confirmed = safeParticipants.filter((participant) => participant.presenceStatus === 'confirmed').length;
  const total = safeParticipants.length;

  return { confirmed, pending: total - confirmed, total };
}

export function togglePresenceFilter(
  currentFilter: PresenceFilter,
  nextFilter: Exclude<PresenceFilter, 'all'>,
): PresenceFilter {
  return currentFilter === nextFilter ? 'all' : nextFilter;
}