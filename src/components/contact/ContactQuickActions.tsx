import { Mail, MessageCircle, Phone } from 'lucide-react';
import { contactInfo, socialLinks } from '@/config/site';
import { cn, formatContactAddress, toBangladeshWhatsAppHref, toTelHref } from '@/lib/utils';

export interface ContactQuickActionsProps {
  className?: string;
}

/**
 * Tap targets for phone, WhatsApp, and email — shown ahead of the form on small screens.
 */
export function ContactQuickActions({ className }: ContactQuickActionsProps) {
  const whatsapp = socialLinks.find((s) => s.platform === 'whatsapp');
  const waHref = whatsapp?.url ?? toBangladeshWhatsAppHref(contactInfo.phone);
  const primaryTel = toTelHref(contactInfo.phone);
  const secondaryTel = contactInfo.secondaryPhone
    ? toTelHref(contactInfo.secondaryPhone)
    : null;

  return (
    <div className={cn('grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4', className)}>
      <a
        className={cn(
          'focus-ring flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 shadow-soft transition hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:border-primary-600 dark:hover:bg-neutral-800 sm:min-h-[56px] sm:text-base',
          !contactInfo.secondaryPhone && 'sm:col-span-2'
        )}
        href={primaryTel}
      >
        <Phone className="h-5 w-5 shrink-0 text-primary-600" aria-hidden="true" />
        <span className="truncate">Call {contactInfo.phone}</span>
      </a>
      {secondaryTel && contactInfo.secondaryPhone ? (
        <a
          className="focus-ring flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 shadow-soft transition hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:border-primary-600 dark:hover:bg-neutral-800 sm:min-h-[56px] sm:text-base"
          href={secondaryTel}
        >
          <Phone className="h-5 w-5 shrink-0 text-primary-600" aria-hidden="true" />
          <span className="truncate">Call {contactInfo.secondaryPhone}</span>
        </a>
      ) : null}
      <a
        className="focus-ring flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-emerald-600/30 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 shadow-soft transition hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-100 dark:hover:bg-emerald-900/50 sm:min-h-[56px] sm:text-base sm:col-span-2"
        href={waHref}
        rel="noopener noreferrer"
        target="_blank"
      >
        <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="truncate">WhatsApp</span>
      </a>
      <a
        className="focus-ring flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 shadow-soft transition hover:border-primary-300 hover:bg-primary-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:border-primary-600 dark:hover:bg-neutral-800 sm:min-h-[56px] sm:text-base sm:col-span-2"
        href={`mailto:${contactInfo.email}`}
      >
        <Mail className="h-5 w-5 shrink-0 text-primary-600" aria-hidden="true" />
        <span className="truncate break-all text-center">{contactInfo.email}</span>
      </a>
      <p className="text-center text-2xs text-neutral-500 dark:text-neutral-400 sm:col-span-2">
        {formatContactAddress(contactInfo)}
      </p>
    </div>
  );
}
