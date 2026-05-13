'use client';

import { MessageCircle, Phone } from 'lucide-react';
import { contactInfo, emergencyContact, socialLinks } from '@/config/site';
import { cn, toBangladeshWhatsAppHref, toTelHref } from '@/lib/utils';

/**
 * Sticky bottom actions on small viewports — safe-area aware, does not replace in-content CTAs.
 */
export function StickyMobileCallBar() {
  const telHref = toTelHref(emergencyContact.phone);
  const whatsapp = socialLinks.find((s) => s.platform === 'whatsapp');
  const waHref = whatsapp?.url ?? toBangladeshWhatsAppHref(contactInfo.phone);

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-[60] lg:hidden',
        'border-t border-neutral-200/90 bg-white/95 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/95'
      )}
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <nav
        aria-label="Emergency contact shortcuts"
        className="mx-auto flex max-w-lg items-stretch gap-2 px-3 pt-3 sm:px-4"
      >
        <a
          className="focus-ring relative flex min-h-[52px] min-w-0 flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-error-600 px-3 py-3 text-sm font-bold text-white shadow-md ring-2 ring-error-500/25 transition hover:bg-error-700 active:bg-error-800"
          href={telHref}
        >
          <Phone className="relative z-[1] h-5 w-5 shrink-0 animate-pulse-soft" aria-hidden="true" />
          <span className="relative z-[1] truncate">{emergencyContact.label}</span>
        </a>
        <a
          className="focus-ring flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md transition hover:bg-emerald-700 active:bg-emerald-800"
          aria-label="WhatsApp chat"
          href={waHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        </a>
      </nav>
    </div>
  );
}
