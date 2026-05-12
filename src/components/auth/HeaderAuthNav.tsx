'use client';

import Link from 'next/link';
import { User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { fetchNotificationUnreadTotal } from '@/services/notifications-client';

const linkClass =
  'hidden rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-primary-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-primary-400 md:inline-flex';

export function HeaderAuthNav() {
  const { user, isInitialized } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnread(0);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const n = await fetchNotificationUnreadTotal();
        if (!cancelled) setUnread(n);
      } catch {
        if (!cancelled) setUnread(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!isInitialized) {
    return (
      <span
        aria-hidden="true"
        className="hidden h-10 w-10 items-center justify-center rounded-lg md:inline-flex"
      >
        <span className="h-4 w-4 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-700" />
      </span>
    );
  }

  if (user) {
    return (
      <Link
        aria-label={`My account — signed in as ${user.firstName}${unread > 0 ? ` — ${unread} unread notifications` : ''}`}
        className={cn(linkClass, 'relative items-center gap-2')}
        href="/account"
      >
        <User aria-hidden="true" className="h-5 w-5 shrink-0" />
        <span className="max-w-[7rem] truncate">{user.firstName}</span>
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 flex min-h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-semibold text-white">
            {unread > 99 ? '99+' : unread}
          </span>
        ) : null}
      </Link>
    );
  }

  return (
    <div className="hidden items-center gap-1 md:flex">
      <Link className={linkClass} href="/login">
        Sign in
      </Link>
      <Link
        className="hidden rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 sm:inline-flex"
        href="/register"
      >
        Register
      </Link>
    </div>
  );
}
