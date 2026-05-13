import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

export interface MainNavbarProps {
  isScrolled: boolean;
  children: ReactNode;
}

/** Primary toolbar row (logo, desktop nav, actions) below the emergency strip. */
export function MainNavbar({ isScrolled, children }: MainNavbarProps) {
  return (
    <div
      className={cn(
        'border-b border-neutral-200/90 bg-white transition-[box-shadow,backdrop-filter] duration-300 dark:border-neutral-800/90 dark:bg-neutral-950',
        isScrolled ? 'shadow-soft backdrop-blur-sm dark:shadow-none' : ''
      )}
    >
      <Container className="max-w-screen-2xl">
        <div
          className={cn(
            'flex items-center justify-between gap-2 sm:gap-3',
            isScrolled
              ? 'min-h-[3.5rem] py-1.5 lg:min-h-[3.75rem] lg:py-2'
              : 'min-h-[3.75rem] py-2.5 lg:min-h-[5rem] lg:py-3'
          )}
        >
          {children}
        </div>
      </Container>
    </div>
  );
}
