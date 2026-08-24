'use client';

import { Box } from '@mui/material';
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
  presenceConfirmed,
  onSignup,
  onCancelParticipation,
  onMarkPresence,
  onValidatePresences,
  onListParticipants,
  isLoading,
}: ActivityModalProps) {
  if (!open) return null;

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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.25 }}>
        <CloseButton onClick={onClose} position="relative" top={0} right={0} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: { xs: 0.5, sm: 0.75 } }}>
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
          presenceConfirmed={presenceConfirmed}
          onSignup={onSignup}
          onCancelParticipation={onCancelParticipation}
          onMarkPresence={onMarkPresence}
          onValidatePresences={onValidatePresences}
          onListParticipants={onListParticipants}
          isLoading={isLoading}
        />
      </Box>
    </ModalContainer>
  );
}