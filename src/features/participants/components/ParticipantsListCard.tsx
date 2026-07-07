import type { ReactNode } from 'react';
import type { Participant, PresenceFilter } from '@/types/participant';
import { ManagementListCard } from '@/features/management/components/ManagementListCard';
import { ParticipantsSearchBar } from './ParticipantsSearchBar';
import { ParticipantRow } from './ParticipantRow';

interface ParticipantsListCardProps {
  participants: Participant[];
  search: string;
  presenceFilter: PresenceFilter;
  onSearchChange: (value: string) => void;
  onFilterToggle: (filter: Exclude<PresenceFilter, 'all'>) => void;
  renderParticipantActions?: (participant: Participant) => ReactNode;
}

export function ParticipantsListCard({
  participants,
  search,
  presenceFilter,
  onSearchChange,
  onFilterToggle,
  renderParticipantActions,
}: ParticipantsListCardProps) {
  return (
    <ManagementListCard
      title="Participantes"
      searchRow={
        <ParticipantsSearchBar
          search={search}
          presenceFilter={presenceFilter}
          onSearchChange={onSearchChange}
          onFilterToggle={onFilterToggle}
        />
      }
      isEmpty={participants.length === 0}
      emptyMessage="Nenhum participante encontrado"
    >
      {participants.map((participant) => (
        <ParticipantRow
          key={participant.id}
          participant={participant}
          actions={renderParticipantActions?.(participant)}
        />
      ))}
    </ManagementListCard>
  );
}
