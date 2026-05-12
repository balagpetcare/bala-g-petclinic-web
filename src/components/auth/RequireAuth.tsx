'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/use-auth';

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * Client gate for authenticated-only UI. Middleware provides a first-line redirect;
 * this ensures expired tokens and deep links still resolve correctly after hydration.
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const { user, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      const callback = encodeURIComponent(pathname || '/account');
      router.replace(`/login?callbackUrl=${callback}`);
    }
  }, [isInitialized, user, router, pathname]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Checking your session…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2">
        <Spinner size="lg" />
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Redirecting to sign in…</p>
      </div>
    );
  }

  return <>{children}</>;
}
