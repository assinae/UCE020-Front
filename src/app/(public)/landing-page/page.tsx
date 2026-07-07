'use client';

import { HeroSection, BenefitsSection, AboutSection, HowItWorksSection, Footer } from '@/features/landing-page';
import Header from '@/components/ui/Header';

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <AboutSection />
      <Footer />
    </>
  );
}
