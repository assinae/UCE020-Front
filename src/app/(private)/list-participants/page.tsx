import { Suspense } from 'react';
import { ListParticipantsView } from '@/features/participants/components/ListParticipantsView';

export default function ListParticipantsPage() {
  return (
    <Suspense fallback={null}>
      <ListParticipantsView />
    </Suspense>
  );
}
