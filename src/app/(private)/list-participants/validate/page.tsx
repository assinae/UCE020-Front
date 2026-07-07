import { Suspense } from 'react';
import { ValidatePresenceView } from '@/features/participants/presence/components/ValidatePresenceView';

export default function ValidatePresencePage() {
  return (
    <Suspense fallback={null}>
      <ValidatePresenceView />
    </Suspense>
  );
}
