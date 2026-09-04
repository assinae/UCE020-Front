'use client';

import {
  HeroSection,
  BenefitsSection,
  AboutSection,
  HowItWorksSection,
  TutorialCtaSection,
  Footer,
} from '@/features/landing-page';
import Header from '@/components/ui/Header';

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <TutorialCtaSection />
      <AboutSection />
      <Footer />
    </>
  );
}
