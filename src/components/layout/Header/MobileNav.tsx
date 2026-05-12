'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { mainNavItems, siteConfig } from '@/config';
import { useAuth } from '@/hooks/use-auth';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user, isInitialized } = useAuth();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white px-6 py-6',
          'dark:bg-neutral-950',
          'transform transition-transform duration-300 ease-out lg:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">
            {siteConfig.shortName}
          </span>
          <button
            className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8">
          <ul className="space-y-1">
            {mainNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  className={cn(
                    'flex items-center justify-between rounded-lg px-4 py-3',
                    'text-base font-medium text-neutral-700 dark:text-neutral-300',
                    'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                    'transition-colors'
                  )}
                  href={item.href}
                  onClick={onClose}
                >
                  {item.label}
                  {item.children && (
                    <ChevronRight className="h-5 w-5 text-neutral-400" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Account
          </p>
          {!isInitialized ? (
            <div className="h-12 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
          ) : user ? (
            <Link
              className={cn(
                'flex items-center justify-between rounded-lg px-4 py-3',
                'text-base font-medium text-neutral-700 dark:text-neutral-300',
                'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                'transition-colors'
              )}
              href="/account"
              onClick={onClose}
            >
              My account
              <ChevronRight className="h-5 w-5 text-neutral-400" />
            </Link>
          ) : (
            <ul className="space-y-1">
              <li>
                <Link
                  className={cn(
                    'flex items-center justify-between rounded-lg px-4 py-3',
                    'text-base font-medium text-neutral-700 dark:text-neutral-300',
                    'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                    'transition-colors'
                  )}
                  href="/login"
                  onClick={onClose}
                >
                  Sign in
                  <ChevronRight className="h-5 w-5 text-neutral-400" />
                </Link>
              </li>
              <li>
                <Link
                  className={cn(
                    'flex items-center justify-between rounded-lg px-4 py-3',
                    'text-base font-medium text-primary-600 dark:text-primary-400',
                    'hover:bg-primary-50 dark:hover:bg-primary-950/40',
                    'transition-colors'
                  )}
                  href="/register"
                  onClick={onClose}
                >
                  Create account
                  <ChevronRight className="h-5 w-5 text-neutral-400" />
                </Link>
              </li>
            </ul>
          )}
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-8 dark:border-neutral-800">
          <Button fullWidth onClick={onClose}>
            Book Appointment
          </Button>
        </div>
      </div>
    </>
  );
}
