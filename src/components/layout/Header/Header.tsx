'use client';

import { useEffect, useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { TopEmergencyBar } from './TopEmergencyBar';
import { HeaderDesktopNav } from './HeaderDesktopNav';
import { HeaderActions } from './HeaderActions';
import { MainNavbar } from './MainNavbar';
import { MobileMenuDrawer } from './MobileMenuDrawer';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 print:static">
        <TopEmergencyBar />
        <MainNavbar isScrolled={isScrolled}>
          <BrandLogo scrolled={isScrolled} />
          <HeaderDesktopNav />
          <HeaderActions
            isMobileMenuOpen={isMobileMenuOpen}
            isScrolled={isScrolled}
            onOpenMobileMenu={() => setIsMobileMenuOpen((open) => !open)}
          />
        </MainNavbar>
      </header>

      <MobileMenuDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}
