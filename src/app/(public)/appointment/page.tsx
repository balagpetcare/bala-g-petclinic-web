import type { Metadata } from 'next';
import { CalendarCheck, Clock, Phone } from 'lucide-react';
import { Container, Section, Card } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { BookingWizard } from '@/components/booking';
import { generatePageMetadata } from '@/config/seo';
import { businessHours, contactInfo } from '@/config/site';
import { toTelHref } from '@/lib/utils';

export const metadata: Metadata = generatePageMetadata({
  title: 'Book an Appointment',
  description:
    'Schedule a veterinary appointment at Bala G Pet Clinic. Choose your preferred date, time, and service for your pet.',
  keywords: ['book appointment', 'veterinary appointment', 'pet clinic booking'],
});

interface AppointmentPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

function firstString(v: string | string[] | undefined): string | undefined {
  if (typeof v === 'string') return v;
  if (Array.isArray(v) && v[0]) return v[0];
  return undefined;
}

export default function AppointmentPage({ searchParams = {} }: AppointmentPageProps) {
  const branchId = firstString(searchParams['branchId']);
  const doctorSlug = firstString(searchParams['doctor']);
  const serviceSlug = firstString(searchParams['serviceSlug']);

  return (
    <>
      <PageHeader
        description="Choose your preferred date, time, and service. Our team will confirm your booking and be ready to provide the best care for your pet."
        eyebrow="Schedule a visit"
        title="Book an Appointment"
      />

      <Section padding="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <BookingWizard
                initialBranchId={branchId}
                initialDoctorSlug={doctorSlug}
                initialServiceSlug={serviceSlug}
              />
            </div>

            <aside className="space-y-6">
              <Card padding="lg">
                <div className="flex items-center gap-3 text-primary-600">
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                  <h3 className="font-semibold text-neutral-950 dark:text-white">
                    Booking info
                  </h3>
                </div>
                <ul className="mt-4 space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                  <li>Appointments are confirmed within 2 hours</li>
                  <li>Walk-ins accepted based on availability</li>
                  <li>Please arrive 5 minutes before your slot</li>
                  <li>Bring previous medical records if available</li>
                </ul>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3 text-primary-600">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                  <h3 className="font-semibold text-neutral-950 dark:text-white">
                    Clinic hours
                  </h3>
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  {businessHours.slice(0, 2).map((h) => (
                    <li
                      key={h.day}
                      className="flex justify-between text-neutral-600 dark:text-neutral-400"
                    >
                      <span>Mon – Sat</span>
                      <span>{h.open} – {h.close}</span>
                    </li>
                  ))}
                  {businessHours.slice(-1).map((h) => (
                    <li
                      key={h.day}
                      className="flex justify-between text-neutral-600 dark:text-neutral-400"
                    >
                      <span>Sunday</span>
                      <span>{h.open} – {h.close}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3 text-primary-600">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  <h3 className="font-semibold text-neutral-950 dark:text-white">
                    Prefer to call?
                  </h3>
                </div>
                <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                  Call us directly to book or enquire:
                </p>
                <a
                  className="mt-2 block text-lg font-semibold text-primary-600 hover:underline"
                  href={toTelHref(contactInfo.phone)}
                >
                  {contactInfo.phone}
                </a>
              </Card>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
