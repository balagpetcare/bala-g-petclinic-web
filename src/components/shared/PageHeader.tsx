import { Container, Heading, Text } from '@/components/ui';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  centered?: boolean;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  centered = true,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        'bg-gradient-to-b from-primary-50/60 to-white py-14 dark:from-neutral-950 dark:to-neutral-950 sm:py-20',
        className
      )}
    >
      <Container>
        <div className={cn('max-w-3xl', centered && 'mx-auto text-center')}>
          {eyebrow && (
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 dark:text-primary-400">
              {eyebrow}
            </span>
          )}
          <Heading className="mt-3" level="h1">
            {title}
          </Heading>
          {description && (
            <Text className="mt-4" color="muted" size="lg">
              {description}
            </Text>
          )}
          {children}
        </div>
      </Container>
    </section>
  );
}
