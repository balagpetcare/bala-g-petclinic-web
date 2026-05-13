'use client';

import Link from 'next/link';
import {
  Heart,
  Menu,
  Phone,
  Search,
  ShoppingBag,
} from 'lucide-react';
import { cn, toTelHref } from '@/lib/utils';
import { emergencyContact } from '@/config/site';
import { useEcommerce } from '@/providers';
import { ThemeToggle } from './ThemeToggle';
import { HeaderAuthNav } from '@/components/auth/HeaderAuthNav';

export interface HeaderActionsProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  onOpenMobileMenu: () => void;
}

export function HeaderActions({
  isScrolled,
  isMobileMenuOpen,
  onOpenMobileMenu,
}: HeaderActionsProps) {
  const { cartItemsCount, wishlistItemsCount } = useEcommerce();
  const emergencyTel = toTelHref(emergencyContact.phone);

  return (
    <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 md:gap-2">
      <button
        className="focus-ring hidden h-10 w-10 items-center justify-center rounded-xl text-neutral-600 transition hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-300 dark:hover:bg-neutral-800 md:inline-flex"
        aria-label="Search"
        type="button"
      >
        <Search aria-hidden className="h-5 w-5" />
      </button>

      <a
        className={cn(
          'focus-ring inline-flex h-11 min-w-[2.75rem] items-center justify-center rounded-xl border-2 border-error-200 bg-white px-2 text-xs font-bold text-error-700 shadow-sm transition hover:border-error-400 hover:bg-error-50 dark:border-error-800 dark:bg-neutral-900 dark:text-error-300 dark:hover:border-error-600',
          'animate-pulse-soft md:h-10 md:min-w-[2.5rem] lg:px-3'
        )}
        href={emergencyTel}
        title="Emergency call"
      >
        <Phone aria-hidden className="h-5 w-5 md:h-4 md:w-4" />
        <span className="sr-only">Emergency call {emergencyContact.phone}</span>
        <span className="hidden pl-1.5 text-xs font-bold lg:inline">Emergency</span>
      </a>

      <Link
        className={cn(
          'focus-ring hidden items-center justify-center rounded-xl bg-primary-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-700 lg:inline-flex lg:px-4 lg:text-sm',
          isScrolled && 'lg:py-1.5'
        )}
        href="/appointment"
      >
        Book<span className="hidden xl:inline">&nbsp;appointment</span>
      </Link>

      <HeaderAuthNav />

      <Link
        className="focus-ring hidden h-10 w-10 items-center justify-center rounded-xl text-neutral-600 transition hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-300 dark:hover:bg-neutral-800 md:inline-flex"
        aria-label="Wishlist"
        href="/wishlist"
      >
        <Heart aria-hidden className="h-5 w-5" />
        <span className="sr-only">Wishlist items: {wishlistItemsCount}</span>
      </Link>

      <Link
        className="focus-ring relative hidden h-10 w-10 items-center justify-center rounded-xl text-neutral-600 transition hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-300 dark:hover:bg-neutral-800 md:inline-flex"
        aria-label="Shopping cart"
        href="/cart"
      >
        <ShoppingBag aria-hidden className="h-5 w-5" />
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-secondary-500 px-0.5 text-[10px] font-bold leading-none text-white">
          {cartItemsCount > 99 ? '99+' : cartItemsCount}
        </span>
      </Link>

      <div className="hidden md:block">
        <ThemeToggle />
      </div>

      <button
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-navigation-drawer"
        className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800 lg:hidden"
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        type="button"
        onClick={onOpenMobileMenu}
      >
        <Menu aria-hidden className="h-6 w-6" />
      </button>
    </div>
  );
}
