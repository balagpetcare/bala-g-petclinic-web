'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Heart, MessageCircle, Phone, ShoppingBag, X } from 'lucide-react';
import { cn, toBangladeshWhatsAppHref, toTelHref } from '@/lib/utils';
import { headerUtilityNavItems, mainNavItems } from '@/config';
import { contactInfo, emergencyContact, siteConfig, socialLinks } from '@/config/site';
import { useAuth } from '@/hooks/use-auth';
import { useEcommerce } from '@/providers';
import { BrandLogo } from './BrandLogo';
import { ThemeToggle } from './ThemeToggle';

const MOBILE_DRAWER_ID = 'mobile-navigation-drawer';

export interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function pathActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
  const pathname = usePathname() ?? '';
  const { user, isInitialized } = useAuth();
  const { cartItemsCount } = useEcommerce();
  const emergencyTel = toTelHref(emergencyContact.phone);
  const whatsapp = socialLinks.find((s) => s.platform === 'whatsapp');
  const waHref = whatsapp?.url ?? toBangladeshWhatsAppHref(contactInfo.phone);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        className={cn(
          'fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-neutral-950 lg:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!isOpen}
        aria-modal="true"
        id={MOBILE_DRAWER_ID}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
          <BrandLogo onClick={onClose} />
          <button
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            type="button"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X aria-hidden className="h-6 w-6" />
          </button>
        </div>

        <div className="border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
          <a
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-error-600 px-4 py-3 text-sm font-bold text-white shadow-md animate-pulse-soft"
            href={emergencyTel}
            onClick={onClose}
          >
            <Phone aria-hidden className="h-5 w-5" />
            Call emergency · {emergencyContact.phone}
          </a>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <a
              className="focus-ring flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-emerald-600/40 bg-emerald-50 text-sm font-semibold text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
              href={waHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden className="h-4 w-4" />
              WhatsApp
            </a>
            <Link
              className="focus-ring flex min-h-[48px] items-center justify-center rounded-xl bg-primary-600 text-sm font-semibold text-white"
              href="/appointment"
              onClick={onClose}
            >
              Book visit
            </Link>
          </div>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2" aria-label="Mobile">
          <ul className="space-y-0.5">
            {mainNavItems.map((item) =>
              item.children ? (
                <li key={item.href} className="border-b border-neutral-100 dark:border-neutral-800">
                  <details className="group/d">
                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-3.5 text-base font-semibold text-neutral-800 marker:hidden dark:text-neutral-100 [&::-webkit-details-marker]:hidden">
                      <span>{item.label}</span>
                      <ChevronRight
                        aria-hidden
                        className="h-5 w-5 shrink-0 text-neutral-400 transition group-open/d:rotate-90"
                      />
                    </summary>
                    <ul className="space-y-0.5 pb-2 pl-2">
                      <li>
                        <Link
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-950/30"
                          href={item.href}
                          onClick={onClose}
                        >
                          All {item.label.toLowerCase()}
                        </Link>
                      </li>
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            className={cn(
                              'block rounded-lg px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
                              pathActive(pathname, child.href) &&
                                'bg-primary-50 font-medium text-primary-800 dark:bg-primary-950/40'
                            )}
                            href={child.href}
                            onClick={onClose}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={item.href} className="border-b border-neutral-100 dark:border-neutral-800">
                  <Link
                    className={cn(
                      'flex min-h-[48px] items-center rounded-lg px-3 py-3 text-base font-medium text-neutral-800 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800',
                      pathActive(pathname, item.href) &&
                        'bg-primary-50 text-primary-800 dark:bg-primary-950/40'
                    )}
                    href={item.href}
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          <p className="mt-4 px-3 text-2xs font-bold uppercase tracking-wide text-neutral-500">Also visit</p>
          <ul className="mt-1 space-y-0.5">
            {headerUtilityNavItems.map((u) =>
              u.children ? (
                <li key={u.href} className="border-b border-neutral-100 dark:border-neutral-800">
                  <details className="group/d2">
                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-3.5 text-base font-semibold text-neutral-800 marker:hidden dark:text-neutral-100 [&::-webkit-details-marker]:hidden">
                      <span>{u.label}</span>
                      <ChevronRight
                        aria-hidden
                        className="h-5 w-5 text-neutral-400 transition group-open/d2:rotate-90"
                      />
                    </summary>
                    <ul className="space-y-0.5 pb-2 pl-2">
                      {u.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            className="block rounded-lg px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                            href={c.href}
                            onClick={onClose}
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={u.href} className="border-b border-neutral-100 dark:border-neutral-800">
                  <Link
                    className="flex min-h-[48px] items-center rounded-lg px-3 py-3 text-base font-medium text-neutral-800 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
                    href={u.href}
                    onClick={onClose}
                  >
                    {u.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        <div className="border-t border-neutral-200 bg-neutral-50/90 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900/80">
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <Link
                className="focus-ring relative flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                aria-label="Cart"
                href="/cart"
                onClick={onClose}
              >
                <ShoppingBag aria-hidden className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-secondary-500 text-[10px] font-bold text-white">
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              </Link>
              <Link
                className="focus-ring flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                aria-label="Wishlist"
                href="/wishlist"
                onClick={onClose}
              >
                <Heart aria-hidden className="h-5 w-5" />
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="border-t border-neutral-200 px-4 py-4 dark:border-neutral-800">
          <p className="mb-2 text-2xs font-bold uppercase tracking-wide text-neutral-500">Account</p>
          {!isInitialized ? (
            <div className="h-12 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
          ) : user ? (
            <Link
              className="flex min-h-[48px] items-center justify-between rounded-xl bg-white px-3 py-3 text-base font-medium text-neutral-800 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900 dark:text-neutral-100 dark:ring-neutral-700"
              href="/account"
              onClick={onClose}
            >
              My account
              <ChevronRight aria-hidden className="h-5 w-5 text-neutral-400" />
            </Link>
          ) : (
            <div className="grid gap-2">
              <Link
                className="flex min-h-[48px] items-center justify-center rounded-xl border border-neutral-200 bg-white py-3 text-sm font-semibold text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                href="/login"
                onClick={onClose}
              >
                Sign in
              </Link>
              <Link
                className="flex min-h-[48px] items-center justify-center rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white"
                href="/register"
                onClick={onClose}
              >
                Create account
              </Link>
            </div>
          )}
        </div>

        <div className="mt-auto border-t border-neutral-200 p-4 dark:border-neutral-800">
          <Link
            className="btn-base focus-ring w-full rounded-lg bg-primary-600 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
            href="/contact"
            onClick={onClose}
          >
            Contact clinic
          </Link>
          <p className="mt-2 text-center text-2xs text-neutral-500">{siteConfig.name}</p>
        </div>
      </div>
    </>
  );
}
