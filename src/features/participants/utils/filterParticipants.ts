import type { Participant, PresenceFilter } from '@/types/participant';

export function filterParticipants(
  participants: Participant[],
  search: string,
  presenceFilter: PresenceFilter,
): Participant[] {
  const query = search.trim().toLowerCase();

  return participants.filter((participant) => {
    const matchesSearch = !query || participant.name.toLowerCase().includes(query);
    const matchesFilter =
      presenceFilter === 'all' || participant.presenceStatus === presenceFilter;
    return matchesSearch && matchesFilter;
  });
}

export function togglePresenceFilter(
  current: PresenceFilter,
  next: Exclude<PresenceFilter, 'all'>,
): PresenceFilter {
  return current === next ? 'all' : next;
}
