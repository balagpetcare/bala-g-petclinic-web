'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Heart,
  Menu,
  Phone,
  Search,
  ShoppingBag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { mainNavItems, emergencyContact, siteConfig } from '@/config';
import { useEcommerce } from '@/providers';
import { ThemeToggle } from './ThemeToggle';
import { MobileNav } from './MobileNav';
import { HeaderAuthNav } from '@/components/auth/HeaderAuthNav';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItemsCount, wishlistItemsCount } = useEcommerce();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

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
      <div className="hidden bg-primary-600 py-2 text-white lg:block">
        <Container>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <a
                className="flex items-center gap-1.5 hover:text-primary-100 transition-colors"
                href={`tel:${emergencyContact.phone}`}
              >
                <Phone className="h-4 w-4" />
                <span>{emergencyContact.label}: {emergencyContact.phone}</span>
              </a>
            </div>
            <div className="flex items-center gap-4 text-primary-50">
              <span>{emergencyContact.available} emergency service</span>
              <Link className="font-semibold text-white underline-offset-4 hover:underline" href="/shop">
                Clinic shop now
              </Link>
            </div>
          </div>
        </Container>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          isScrolled
            ? 'bg-white/95 shadow-soft backdrop-blur-sm dark:bg-neutral-950/95'
            : 'bg-white dark:bg-neutral-950'
        )}
      >
        <Container>
          <nav className="flex h-16 items-center justify-between lg:h-20" aria-label="Primary navigation">
            <Link
              className="flex items-center gap-2 text-xl font-bold text-primary-600"
              href="/"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 font-heading text-base text-white">
                BG
              </span>
              <span className="font-heading">{siteConfig.shortName}</span>
              <span className="hidden text-neutral-900 dark:text-white sm:inline">
                Pet Clinic
              </span>
            </Link>

            <div className="hidden items-center gap-1 lg:flex">
              {mainNavItems.map((item) => (
                <div key={item.href} className="group relative">
                  <Link
                    className={cn(
                      'flex items-center gap-1 px-4 py-2 text-sm font-medium text-neutral-700',
                      'hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400',
                      'transition-colors'
                    )}
                    href={item.href}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                    )}
                  </Link>

                  {item.children && (
                    <div
                      className={cn(
                        'invisible absolute left-0 top-full z-50 min-w-[220px] pt-2',
                        'opacity-0 transition-all duration-200',
                        'group-hover:visible group-hover:opacity-100'
                      )}
                    >
                      <div className="rounded-lg bg-white p-2 shadow-soft-lg ring-1 ring-neutral-100 dark:bg-neutral-900 dark:ring-neutral-800">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            className={cn(
                              'block rounded-md px-4 py-2.5',
                              'text-sm text-neutral-700 dark:text-neutral-300',
                              'hover:bg-primary-50 hover:text-primary-600',
                              'dark:hover:bg-primary-950 dark:hover:text-primary-400',
                              'transition-colors'
                            )}
                            href={child.href}
                          >
                            <span className="font-medium">{child.label}</span>
                            {child.description && (
                              <span className="mt-0.5 block text-xs text-neutral-500">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                className="hidden rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-300 dark:hover:bg-neutral-800 md:inline-flex"
                aria-label="Search"
                type="button"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </button>
              <HeaderAuthNav />
              <Link
                className="hidden rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-300 dark:hover:bg-neutral-800 md:inline-flex"
                aria-label="Wishlist"
                href="/wishlist"
              >
                <Heart className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Wishlist items: {wishlistItemsCount}</span>
              </Link>
              <Link
                className="relative rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
                aria-label="Cart"
                href="/cart"
              >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-secondary-500 px-1 text-2xs font-bold text-white">
                  {cartItemsCount}
                </span>
              </Link>
              <ThemeToggle />
              <Link
                className="hidden h-9 items-center justify-center rounded-lg bg-primary-600 px-4 text-sm font-medium text-white transition-colors hover:bg-primary-700 sm:inline-flex"
                href="/contact"
              >
                Book Appointment
              </Link>
              <button
                className="p-2 lg:hidden"
                aria-label="Toggle menu"
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
              </button>
            </div>
          </nav>
        </Container>
      </header>

      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
