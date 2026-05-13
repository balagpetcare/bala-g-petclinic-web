import Link from 'next/link';
import { MessageCircle, Phone } from 'lucide-react';
import { emergencyContact, socialLinks, contactInfo } from '@/config/site';
import { cn, toBangladeshWhatsAppHref, toTelHref } from '@/lib/utils';
import { Container } from '@/components/ui/Container';

export function TopEmergencyBar() {
  const tel = toTelHref(emergencyContact.phone);
  const whatsapp = socialLinks.find((s) => s.platform === 'whatsapp');
  const waHref = whatsapp?.url ?? toBangladeshWhatsAppHref(contactInfo.phone);

  return (
    <div
      className={cn(
        'border-b border-primary-700/25 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 text-white',
        'shadow-sm'
      )}
    >
      <Container className="max-w-screen-2xl">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 py-2 text-[11px] font-medium sm:gap-x-4 sm:py-2.5 sm:text-xs md:text-sm">
          <a
            className="focus-ring inline-flex min-h-[36px] min-w-0 items-center gap-1.5 rounded-lg px-1.5 py-1 text-white/95 transition hover:bg-white/10 hover:text-white sm:gap-2 sm:px-2"
            href={tel}
          >
            <Phone aria-hidden className="h-3.5 w-3.5 shrink-0 text-primary-100 sm:h-4 sm:w-4" />
            <span className="truncate">
              <span className="hidden font-normal text-primary-100/90 sm:inline">Emergency · </span>
              <span className="font-semibold tabular-nums">{emergencyContact.phone}</span>
            </span>
          </a>

          <p className="order-3 hidden w-full text-center text-[11px] font-normal text-primary-50/95 sm:order-none sm:block sm:w-auto sm:text-xs md:text-sm">
            24/7 veterinary emergency support
          </p>

          <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-2">
            <Link
              className="focus-ring inline-flex min-h-9 items-center rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-bold text-primary-700 shadow-sm transition hover:bg-primary-50 sm:hidden"
              href="/appointment"
            >
              Book
            </Link>
            <a
              aria-label="WhatsApp"
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 sm:h-9 sm:w-9"
              href={waHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden className="h-4 w-4" />
            </a>
            <Link
              className="focus-ring hidden min-h-9 items-center rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-primary-700 shadow-sm transition hover:bg-primary-50 sm:inline-flex md:px-4 md:text-sm"
              href="/appointment"
            >
              Book appointment
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
