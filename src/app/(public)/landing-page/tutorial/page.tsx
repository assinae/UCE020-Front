'use client';

import { TutorialView } from '@/features/tutorial';
import Header from '@/components/ui/Header';
import { Footer } from '@/features/landing-page';

export default function TutorialPage() {
  return (
    <>
      <Header />
      <TutorialView />
      <Footer />
    </>
  );
}
