'use client';

import { AboutPlatformSection, ProjectInfoSection } from '@/features/learn-more';
import Header from '@/components/ui/Header';
import { Footer } from '@/features/landing-page';

export default function HomePage() {
  return (
    <>
      <Header />
      <AboutPlatformSection />
      <ProjectInfoSection />
      <Footer />
    </>
  );
}
