'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import type { NavItem } from '@/types';
import { cn } from '@/lib/utils';
import { headerUtilityNavItems, mainNavItems } from '@/config';

function pathActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

const linkBase =
  'rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-primary-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-primary-400';

function DesktopNavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = pathActive(pathname, item.href);
  return (
    <Link
      className={cn(
        linkBase,
        active &&
          'bg-primary-50 text-primary-800 ring-1 ring-primary-200/60 dark:bg-primary-950/50 dark:text-primary-200 dark:ring-primary-800/60'
      )}
      href={item.href}
    >
      {item.label}
    </Link>
  );
}

function DesktopNavFlyout({ item, pathname }: { item: NavItem; pathname: string }) {
  const childActive = item.children?.some((c) => pathActive(pathname, c.href));
  const selfActive = pathActive(pathname, item.href);
  const active = Boolean(selfActive || childActive);

  return (
    <div className="group relative">
      <Link
        className={cn(
          linkBase,
          'inline-flex items-center gap-1',
          active &&
            'bg-primary-50 text-primary-800 ring-1 ring-primary-200/60 dark:bg-primary-950/50 dark:text-primary-200 dark:ring-primary-800/60'
        )}
        href={item.href}
      >
        {item.label}
        <ChevronDown
          aria-hidden
          className="h-4 w-4 shrink-0 opacity-70 transition-transform duration-200 group-hover:rotate-180"
        />
      </Link>
      <div
        className={cn(
          'invisible absolute left-0 top-full z-[60] min-w-[240px] pt-1.5 opacity-0 transition-all duration-200',
          'group-hover:visible group-hover:opacity-100',
          'group-focus-within:visible group-focus-within:opacity-100'
        )}
      >
        <div className="rounded-xl bg-white p-2 shadow-soft-lg ring-1 ring-neutral-100 dark:bg-neutral-900 dark:ring-neutral-800">
          {item.children?.map((child) => (
            <Link
              key={child.href}
              className={cn(
                'block rounded-lg px-3 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-primary-50 hover:text-primary-800 dark:text-neutral-300 dark:hover:bg-primary-950/40 dark:hover:text-primary-300',
                pathActive(pathname, child.href) && 'bg-primary-50/80 font-semibold text-primary-800 dark:bg-primary-950/60 dark:text-primary-200'
              )}
              href={child.href}
            >
              <span className="font-medium">{child.label}</span>
              {child.description ? (
                <span className="mt-0.5 block text-xs font-normal text-neutral-500 dark:text-neutral-400">
                  {child.description}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function DesktopMoreMenu({ pathname }: { pathname: string }) {
  return (
    <div className="group relative">
      <button
        className={cn(linkBase, 'inline-flex items-center gap-1')}
        type="button"
        aria-expanded="false"
        aria-haspopup="true"
      >
        More
        <ChevronDown
          aria-hidden
          className="h-4 w-4 shrink-0 opacity-70 transition-transform duration-200 group-hover:rotate-180"
        />
      </button>
      <div
        className={cn(
          'invisible absolute right-0 top-full z-[60] min-w-[260px] pt-1.5 opacity-0 transition-all duration-200',
          'group-hover:visible group-hover:opacity-100',
          'group-focus-within:visible group-focus-within:opacity-100'
        )}
      >
        <div className="rounded-xl bg-white p-3 shadow-soft-lg ring-1 ring-neutral-100 dark:bg-neutral-900 dark:ring-neutral-800">
          {headerUtilityNavItems.map((u) =>
            u.children ? (
              <div
                key={u.href}
                className="mb-2 border-b border-neutral-100 pb-2 last:mb-0 last:border-0 last:pb-0 dark:border-neutral-800"
              >
                <p className="px-2 py-1 text-2xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {u.label}
                </p>
                <ul className="space-y-0.5">
                  {u.children.map((c) => (
                    <li key={c.href}>
                      <Link
                        className={cn(
                          'block rounded-lg px-2 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-800 dark:text-neutral-300 dark:hover:bg-primary-950/40',
                          pathActive(pathname, c.href) && 'bg-primary-50/80 font-medium text-primary-800 dark:bg-primary-950/50'
                        )}
                        href={c.href}
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Link
                key={u.href}
                className={cn(
                  'mb-1 block rounded-lg px-2 py-2 text-sm font-medium text-neutral-800 hover:bg-primary-50 hover:text-primary-800 dark:text-neutral-200 dark:hover:bg-primary-950/40',
                  pathActive(pathname, u.href) && 'bg-primary-50/80 text-primary-800 dark:bg-primary-950/50'
                )}
                href={u.href}
              >
                {u.label}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export function HeaderDesktopNav() {
  const pathname = usePathname() ?? '';

  return (
    <nav aria-label="Main" className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 px-4 lg:flex xl:gap-1">
      {mainNavItems.map((item) =>
        item.children ? (
          <DesktopNavFlyout key={item.href} item={item} pathname={pathname} />
        ) : (
          <DesktopNavLink key={item.href} item={item} pathname={pathname} />
        )
      )}
      <DesktopMoreMenu pathname={pathname} />
    </nav>
  );
}
