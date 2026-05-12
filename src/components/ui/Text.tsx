import type { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    color: {
      default: 'text-neutral-700 dark:text-neutral-300',
      muted: 'text-neutral-500 dark:text-neutral-400',
      primary: 'text-primary-600 dark:text-primary-400',
      error: 'text-error-500',
      success: 'text-success-500',
      white: 'text-white',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    leading: {
      tight: 'leading-tight',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
    },
  },
  defaultVariants: {
    size: 'base',
    color: 'default',
    weight: 'normal',
    leading: 'normal',
  },
});

interface TextProps
  extends Omit<HTMLAttributes<HTMLParagraphElement>, 'color'>,
    VariantProps<typeof textVariants> {
  children: ReactNode;
  as?: 'p' | 'span' | 'div';
}

export function Text({
  children,
  size,
  color,
  weight,
  leading,
  as: Component = 'p',
  className,
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(textVariants({ size, color, weight, leading, className }))}
      {...props}
    >
      {children}
    </Component>
  );
}
