'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IconButton } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { AppPageContainer } from '@/components/layout/AppPageContainer';
import { useMockUser } from '@/mocks/useMockUser';
import { unconfirmParticipantForActivity } from '@/mocks/participants-storage';
import { requirePresenceContext } from '@/features/participants/presence/utils/resolvePresenceContext';
import { getParticipantsForActivity } from '@/features/participants/presence/utils/getParticipantsForActivity';
import { buildValidatePresencePath } from '@/features/participants/presence/utils/routes';
import { PresenceContextMissing } from '@/features/participants/presence/components/PresenceContextMissing';
import { RemovePresenceModal } from '@/features/participants/presence/components/RemovePresenceModal';
import { ParticipantsListCard } from '@/features/participants/components/ParticipantsListCard';
import { ParticipantPresenceActions } from '@/features/participants/components/ParticipantPresenceActions';
import { ValidatePresencesButton } from '@/features/participants/components/ValidatePresencesButton';
import { filterParticipants, togglePresenceFilter } from '@/features/participants/utils/filterParticipants';
import { colorTokens } from '@/lib/colors';
import type { Participant, PresenceFilter } from '@/types/participant';

export function ListParticipantsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mockUser = useMockUser();
  const context = requirePresenceContext(
    searchParams.get('eventId'),
    searchParams.get('activityId'),
  );

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [search, setSearch] = useState('');
  const [presenceFilter, setPresenceFilter] = useState<PresenceFilter>('all');
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    const eventId = context?.eventId;
    const activityId = context?.activityId;

    if (!eventId || !activityId) return;

    const currentEventId = eventId;
    const currentActivityId = activityId;

    function refreshParticipants() {
      setParticipants(getParticipantsForActivity(currentEventId, currentActivityId));
    }

    refreshParticipants();
    window.addEventListener('pageshow', refreshParticipants);

    return () => {
      window.removeEventListener('pageshow', refreshParticipants);
    };
  }, [context?.eventId, context?.activityId]);

  if (!context) {
    return <PresenceContextMissing />;
  }

  const { eventId, activityId, activityTitle } = context;
  const isMonitor = mockUser.role === 'monitor';
  const canEditPresence = isMonitor || mockUser.role === 'organizer';
  const filteredParticipants = filterParticipants(participants, search, presenceFilter);

  function handleFilterToggle(filter: Exclude<PresenceFilter, 'all'>) {
    setPresenceFilter((current) => togglePresenceFilter(current, filter));
  }

  function goToValidatePresence() {
    router.push(buildValidatePresencePath(eventId, activityId));
  }

  function openRemoveModal(participantId: string) {
    const participant = participants.find((item) => item.id === participantId);
    if (!participant || participant.presenceStatus !== 'confirmed') return;
    setSelectedParticipant(participant);
  }

  function closeRemoveModal() {
    setSelectedParticipant(null);
  }

  function handleRemovePresence() {
    if (!selectedParticipant) return;

    unconfirmParticipantForActivity(eventId, activityId, selectedParticipant.id);
    setParticipants(getParticipantsForActivity(eventId, activityId));
    closeRemoveModal();
  }

  function renderParticipantActions(participant: Participant) {
    return (
      <ParticipantPresenceActions
        participant={participant}
        canValidatePresence={isMonitor}
        canEditPresence={canEditPresence}
        onValidatePresence={goToValidatePresence}
        onRemovePresence={openRemoveModal}
      />
    );
  }

  function handleBack() {
    router.push(`/event/${eventId}`);
  }

  return (
    <AppPageContainer>
      <IconButton
        onClick={handleBack}
        aria-label="Voltar"
        sx={{ alignSelf: 'flex-start', color: colorTokens.text.primary }}
      >
        <ArrowBackRoundedIcon />
      </IconButton>

      {isMonitor && <ValidatePresencesButton onClick={goToValidatePresence} />}

      <ParticipantsListCard
        participants={filteredParticipants}
        search={search}
        presenceFilter={presenceFilter}
        onSearchChange={setSearch}
        onFilterToggle={handleFilterToggle}
        renderParticipantActions={renderParticipantActions}
      />

      <RemovePresenceModal
        open={!!selectedParticipant}
        participantName={selectedParticipant?.name ?? null}
        activityTitle={activityTitle}
        onClose={closeRemoveModal}
        onConfirm={handleRemovePresence}
      />
    </AppPageContainer>
  );
}
