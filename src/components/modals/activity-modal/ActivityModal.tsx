'use client';

import { ModalContainer, CloseButton } from '@/components/modals';
import { ScheduleCard } from '@/components';
import type { ActivityModalProps } from '@/types/activity';
import { ActivityModalActions } from './ActivityModalActions';

export default function ActivityModal({
  open,
  onClose,
  title,
  image,
  startDate,
  endDate,
  location,
  hours,
  participantsCount,
  status,
  description,
  variant,
  onSignup,
  onCancelParticipation,
  onMarkPresence,
  onValidatePresences,
  onListParticipants,
}: ActivityModalProps) {
  return (
    <ModalContainer
      open={open}
      onClose={onClose}
      paperSx={{
        width: { xs: 'calc(100vw - 24px)', sm: 520 },
        maxWidth: 'calc(100vw - 24px)',
        maxHeight: 'calc(100dvh - 24px)',
        borderRadius: { xs: '20px', sm: '24px' },
        border: '1px solid',
        borderColor: 'warning.main',
        p: { xs: 2, sm: 3 },
        overflowY: 'auto',
      }}
    >
      <CloseButton onClick={onClose} />

      <ScheduleCard
        title={title}
        image={image}
        startDate={startDate}
        endDate={endDate}
        location={location}
        hours={hours}
        participantsCount={participantsCount}
        status={status}
        description={description}
      />

      <ActivityModalActions
        variant={variant}
        onSignup={onSignup}
        onCancelParticipation={onCancelParticipation}
        onMarkPresence={onMarkPresence}
        onValidatePresences={onValidatePresences}
        onListParticipants={onListParticipants}
      />
    </ModalContainer>
  );
}
