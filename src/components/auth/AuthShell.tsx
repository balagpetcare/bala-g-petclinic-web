import type { ReactNode } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config';

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/80 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
      <Container className="flex flex-col items-center py-10 sm:py-14">
        <Link
          className="mb-8 flex items-center gap-2 text-xl font-bold text-primary-600"
          href="/"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-600 font-heading text-base text-white">
            BG
          </span>
          <span className="font-heading">{siteConfig.shortName}</span>
          <span className="hidden text-neutral-900 dark:text-white sm:inline">Pet Clinic</span>
        </Link>

        <div className="w-full max-w-md rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-soft-lg dark:border-neutral-800 dark:bg-neutral-950 sm:p-8">
          <header className="mb-6 text-center">
            <h1 className="font-heading text-2xl font-semibold text-neutral-900 dark:text-white">{title}</h1>
            {subtitle ? (
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{subtitle}</p>
            ) : null}
          </header>
          {children}
        </div>

        <p className="mt-8 max-w-md text-center text-xs text-neutral-500 dark:text-neutral-500">
          Secure sign-in for Bala G Pet Clinic. Your password is never stored on this device except in
          encrypted session tokens issued by our clinic servers.
        </p>
      </Container>
    </div>
  );
}
