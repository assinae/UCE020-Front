import type { Participant, PresenceFilter } from '@/types/participant';

export function filterParticipants(
  participants: unknown,
  search: string,
  presenceFilter: PresenceFilter,
): Participant[] {
  const safeParticipants = Array.isArray(participants) ? participants : [];
  const query = search.trim().toLowerCase();

  return safeParticipants.filter((participant) => {
    const matchesSearch =
      !query || participant.name.toLowerCase().includes(query);

    const matchesFilter =
      presenceFilter === 'all' || participant.presenceStatus === presenceFilter;

    return matchesSearch && matchesFilter;
  });
}

export function togglePresenceFilter(
  currentFilter: PresenceFilter,
  nextFilter: Exclude<PresenceFilter, 'all'>,
): PresenceFilter {
  return currentFilter === nextFilter ? 'all' : nextFilter;
}