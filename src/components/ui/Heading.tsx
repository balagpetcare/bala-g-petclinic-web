import type { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const headingVariants = cva('font-heading font-bold tracking-tight text-balance', {
  variants: {
    level: {
      h1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
      h2: 'text-2xl sm:text-3xl md:text-4xl',
      h3: 'text-xl sm:text-2xl md:text-3xl',
      h4: 'text-lg sm:text-xl md:text-2xl',
      h5: 'text-base sm:text-lg md:text-xl',
      h6: 'text-sm sm:text-base md:text-lg',
    },
    color: {
      default: 'text-neutral-900 dark:text-white',
      muted: 'text-neutral-600 dark:text-neutral-400',
      primary: 'text-primary-600 dark:text-primary-400',
      white: 'text-white',
    },
  },
  defaultVariants: {
    level: 'h2',
    color: 'default',
  },
});

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof headingVariants> {
  children: ReactNode;
  as?: HeadingLevel;
}

export function Heading({
  children,
  level = 'h2',
  as,
  color,
  className,
  ...props
}: HeadingProps) {
  const Component = as || level || 'h2';

  return (
    <Component
      className={cn(headingVariants({ level, color, className }))}
      {...props}
    >
      {children}
    </Component>
  );
}
