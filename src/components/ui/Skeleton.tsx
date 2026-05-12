import { cn } from '@/lib/utils';

export interface SkeletonProps {
  className?: string;
  /** Accessible label for screen readers */
  label?: string;
}

export function Skeleton({ className, label = 'Loading' }: SkeletonProps) {
  return (
    <span
      aria-busy="true"
      aria-label={label}
      className={cn(
        'inline-block animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800',
        className
      )}
      role="status"
    />
  );
}
