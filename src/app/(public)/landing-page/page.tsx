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
import { PublicMobileNav } from '@/components/navigation';

const MOBILE_LINKS = [
  { label: 'Como funciona', href: '#how-it-works-section' },
  { label: 'Sobre o Assinaê', href: '#about-section' },
  { label: 'Tutorial', href: '/landing-page/tutorial' },
];

export default function HomePage() {
  return (
    <>
      <Header hideOnMobile />
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <TutorialCtaSection />
      <AboutSection />
      <Footer />
      <PublicMobileNav links={MOBILE_LINKS} />
    </>
  );
}
