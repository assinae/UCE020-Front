import type { ReactNode } from 'react';
import type { Participant, PresenceFilter } from '@/types/participant';
import { ManagementListCard } from '@/features/management/components/ManagementListCard';
import { ParticipantsSearchBar } from './ParticipantsSearchBar';
import { ParticipantRow } from './ParticipantRow';
import { PresenceSummary } from './PresenceSummary';

interface ParticipantsListCardProps {
  participants: Participant[];
  search: string;
  presenceFilter: PresenceFilter;
  onSearchChange: (value: string) => void;
  onFilterToggle: (filter: Exclude<PresenceFilter, 'all'>) => void;
  onBack?: () => void;
  renderParticipantActions?: (participant: Participant) => ReactNode;
  confirmedCount?: number;
  pendingCount?: number;
}

export function ParticipantsListCard({
  participants,
  search,
  presenceFilter,
  onSearchChange,
  onFilterToggle,
  onBack,
  renderParticipantActions,
  confirmedCount,
  pendingCount,
}: ParticipantsListCardProps) {
  return (
    <ManagementListCard
      title="Participantes"
      subtitle={
        confirmedCount !== undefined && pendingCount !== undefined ? (
          <PresenceSummary confirmed={confirmedCount} pending={pendingCount} />
        ) : undefined
      }
      onBack={onBack}
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
