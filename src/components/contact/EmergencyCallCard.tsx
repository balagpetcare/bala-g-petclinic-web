import { Phone } from 'lucide-react';
import { cn, toTelHref } from '@/lib/utils';
import type { EmergencyContact } from '@/types';

export interface EmergencyCallCardProps {
  emergency: EmergencyContact;
  className?: string;
}

/**
 * Prominent emergency call surface — veterinary-focused hierarchy and tap target.
 */
export function EmergencyCallCard({ emergency, className }: EmergencyCallCardProps) {
  const telHref = toTelHref(emergency.phone);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-error-200/80 bg-gradient-to-br from-error-50 via-white to-error-50/40 p-5 shadow-soft-lg dark:border-error-900/60 dark:from-error-950/40 dark:via-neutral-900 dark:to-error-950/30 sm:p-6',
        className
      )}
      role="region"
      aria-labelledby="emergency-call-title"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-error-500/10 blur-2xl animate-pulse-soft"
        aria-hidden="true"
      />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-error-700 dark:text-error-400">
        {emergency.available} · {emergency.headline}
      </p>
      <h2
        id="emergency-call-title"
        className="mt-2 text-balance font-heading text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl dark:text-white"
      >
        {emergency.label}
      </h2>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        Tap to call immediately — {emergency.phone}
      </p>
      <a
        className={cn(
          'focus-ring mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-error-600 px-4 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-error-700 active:bg-error-800 sm:min-h-[56px] sm:text-lg',
          'ring-2 ring-error-500/30 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900'
        )}
        href={telHref}
      >
        <Phone className="h-6 w-6 shrink-0 animate-pulse-soft" aria-hidden="true" />
        <span>Call {emergency.phone}</span>
      </a>
    </div>
  );
}
