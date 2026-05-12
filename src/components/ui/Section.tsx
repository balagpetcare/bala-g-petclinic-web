import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SectionPadding = 'none' | 'sm' | 'md' | 'lg';

const paddingSizes: Record<SectionPadding, string> = {
  none: '',
  sm: 'py-8 sm:py-12',
  md: 'py-12 sm:py-16 lg:py-20',
  lg: 'py-16 sm:py-20 lg:py-24',
};

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  padding?: SectionPadding;
  background?: 'default' | 'muted' | 'primary' | 'gradient';
}

export function Section({
  children,
  padding = 'md',
  background = 'default',
  className,
  ...props
}: SectionProps) {
  const bgClasses = {
    default: '',
    muted: 'bg-neutral-50 dark:bg-neutral-900',
    primary: 'bg-primary-50 dark:bg-primary-950',
    gradient: 'gradient-hero',
  };

  return (
    <section
      className={cn(paddingSizes[padding], bgClasses[background], className)}
      {...props}
    >
      {children}
    </section>
  );
}
