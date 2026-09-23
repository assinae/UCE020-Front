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
  onFilterChange: (filter: PresenceFilter) => void;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (direction: 'asc' | 'desc') => void;
  backFallbackHref?: string;
  renderParticipantActions?: (participant: Participant) => ReactNode;
  confirmedCount?: number;
  pendingCount?: number;
}

export function ParticipantsListCard({
  participants,
  search,
  presenceFilter,
  onSearchChange,
  onFilterChange,
  sortDirection,
  onSortChange,
  backFallbackHref,
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
      backFallbackHref={backFallbackHref}
      sortDirection={sortDirection}
      onSortChange={onSortChange}
      filterGroup={{
        label: 'Mostrar',
        value: presenceFilter,
        options: [
          { value: 'all', label: 'Todos' },
          { value: 'confirmed', label: 'Marcaram presença' },
          { value: 'pending', label: 'Não marcaram' },
        ],
        onChange: (value) => onFilterChange(value as PresenceFilter),
      }}
      searchRow={
        <ParticipantsSearchBar search={search} onSearchChange={onSearchChange} />
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
