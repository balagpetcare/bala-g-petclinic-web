import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Card } from '@/components/ui';
import { businessHours, contactInfo, emergencyContact } from '@/config/site';
import { localSeoEntity } from '@/config/seo-entity';
import { cn, formatContactAddress, toTelHref } from '@/lib/utils';

export interface ContactDetailsPanelProps {
  className?: string;
}

export function ContactDetailsPanel({ className }: ContactDetailsPanelProps) {
  const primaryTel = toTelHref(contactInfo.phone);
  const secondaryTel = contactInfo.secondaryPhone
    ? toTelHref(contactInfo.secondaryPhone)
    : null;
  const emergencyTel = toTelHref(emergencyContact.phone);

  return (
    <div className={cn('flex min-w-0 flex-col gap-4 sm:gap-5', className)}>
      <Card className="min-w-0 shadow-soft-lg" padding="lg">
        <div className="flex items-start gap-3 text-primary-600">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <h3 className="font-heading text-base font-semibold text-neutral-950 dark:text-white">
              Clinic address
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {formatContactAddress(contactInfo)}
            </p>
          </div>
        </div>
      </Card>

      <Card className="min-w-0 shadow-soft-lg" padding="lg">
        <div className="flex items-start gap-3 text-primary-600">
          <Phone className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1 space-y-4">
            <div>
              <h3 className="font-heading text-base font-semibold text-neutral-950 dark:text-white">Phone</h3>
              <a
                className="mt-2 block text-base font-semibold text-primary-700 hover:underline dark:text-primary-400"
                href={primaryTel}
              >
                {contactInfo.phone}
              </a>
              <p className="mt-1 text-2xs text-neutral-500 dark:text-neutral-400">Primary line</p>
            </div>
            {contactInfo.secondaryPhone && secondaryTel ? (
              <div className="border-t border-neutral-100 pt-4 dark:border-neutral-800">
                <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  General
                </p>
                <a
                  className="mt-1 block text-sm font-semibold text-neutral-800 hover:text-primary-600 dark:text-neutral-200"
                  href={secondaryTel}
                >
                  {contactInfo.secondaryPhone}
                </a>
              </div>
            ) : null}
            <div className="border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <p className="text-xs font-medium uppercase tracking-wide text-error-600 dark:text-error-400">
                {emergencyContact.label}
              </p>
              <a
                className="mt-1 block text-sm font-semibold text-error-700 hover:underline dark:text-error-300"
                href={emergencyTel}
              >
                {emergencyContact.phone} · {emergencyContact.available}
              </a>
            </div>
          </div>
        </div>
      </Card>

      <Card className="min-w-0 shadow-soft-lg" padding="lg">
        <div className="flex items-start gap-3 text-primary-600">
          <Mail className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <h3 className="font-heading text-base font-semibold text-neutral-950 dark:text-white">Email</h3>
            <a
              className="mt-2 block break-all text-sm font-medium text-primary-700 hover:underline dark:text-primary-400"
              href={`mailto:${contactInfo.email}`}
            >
              {contactInfo.email}
            </a>
          </div>
        </div>
      </Card>

      <Card className="min-w-0 shadow-soft-lg" padding="lg">
        <div className="flex items-start gap-3 text-primary-600">
          <Clock className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-base font-semibold text-neutral-950 dark:text-white">
              Business hours
            </h3>
            <ul className="mt-3 space-y-2.5">
              {businessHours.map((h) => (
                <li
                  key={h.day}
                  className="flex flex-col gap-0.5 border-b border-neutral-100 pb-2 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4 dark:border-neutral-800"
                >
                  <span className="shrink-0 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    {h.day}
                  </span>
                  <span className="text-sm text-neutral-600 tabular-nums dark:text-neutral-400">
                    {h.isClosed ? 'Closed' : `${h.open} – ${h.close}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 shadow-soft dark:border-neutral-800">
        <iframe
          allowFullScreen
          className="aspect-[16/10] min-h-[12rem] w-full max-w-full border-0 sm:min-h-[14rem] md:aspect-[21/9]"
          height="450"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={localSeoEntity.mapsEmbedUrl}
          title="Google Maps — Bala G Pet Clinic, Dhaka"
          width="600"
        />
        <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
          <a
            className="text-sm font-medium text-primary-700 hover:underline dark:text-primary-400"
            href={localSeoEntity.googleMapsShareUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
