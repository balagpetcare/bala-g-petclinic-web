import Link from 'next/link';
import { Heart } from 'lucide-react';
import { siteConfig } from '@/config';
import { cn } from '@/lib/utils';

export interface BrandLogoProps {
  scrolled?: boolean;
  /** Fires after navigation intent (e.g. close mobile drawer). */
  onClick?: () => void;
  className?: string;
}

/**
 * Text-based mark with responsive scaling; optional tagline from `siteConfig.headerTagline` (lg+).
 */
export function BrandLogo({ scrolled, onClick, className }: BrandLogoProps) {
  return (
    <Link
      className={cn(
        'focus-ring group flex min-w-0 max-w-[min(100%,15rem)] items-center gap-2 rounded-xl py-1 sm:max-w-none sm:gap-2.5 sm:pr-2 lg:gap-3',
        className
      )}
      aria-label={`${siteConfig.name} — home`}
      href="/"
      onClick={onClick}
    >
      <span
        className={cn(
          'flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 font-heading font-bold text-white shadow-soft ring-1 ring-primary-500/25 transition duration-300 group-hover:shadow-md',
          scrolled
            ? 'h-10 w-10 text-xs sm:text-sm lg:h-11 lg:w-11'
            : 'h-10 w-10 text-xs sm:h-11 sm:w-11 sm:text-sm lg:h-12 lg:w-12 lg:text-base'
        )}
      >
        <Heart aria-hidden className="h-[44%] w-[44%]" strokeWidth={2.4} />
      </span>
      <span className="min-w-0 leading-tight">
        <span
          className={cn(
            'block truncate font-heading font-bold tracking-tight text-neutral-900 dark:text-white',
            scrolled ? 'text-base sm:text-lg' : 'text-base sm:text-lg lg:text-xl'
          )}
        >
          {siteConfig.shortName}
        </span>
        <span className="block truncate font-heading font-semibold text-[11px] text-neutral-600 dark:text-neutral-400 sm:text-xs lg:text-sm">
          Pet Clinic
        </span>
        <span className="mt-0.5 hidden text-2xs font-semibold uppercase tracking-[0.14em] text-primary-600 dark:text-primary-400 lg:block">
          {siteConfig.headerTagline}
        </span>
      </span>
    </Link>
  );
}
