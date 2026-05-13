import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container, Section, Card } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { generatePageMetadata } from '@/config/seo';
import { clinicServices } from '@/data/services';

export const metadata: Metadata = generatePageMetadata({
  title: 'Our Services',
  description:
    'Comprehensive veterinary services including consultations, vaccinations, emergency care, grooming, dental care, and nutrition counseling for your pets.',
  keywords: ['veterinary services', 'pet care', 'vaccinations', 'grooming', 'emergency vet'],
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        description="From routine wellness checkups to emergency support, our clinic provides a connected range of veterinary services designed around your pet's health journey."
        eyebrow="Clinic services"
        title="Veterinary Services"
      />

      <Section padding="lg">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clinicServices.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} hover padding="lg">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-neutral-950 dark:text-white">
                    {service.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {service.shortDescription}
                  </p>
                  {service.duration && (
                    <p className="mt-3 text-xs font-medium text-neutral-500">
                      Duration: {service.duration}
                    </p>
                  )}
                  <Link
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800 dark:text-primary-400"
                    href={`/services/${service.slug}`}
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section background="primary" padding="md">
        <Container>
          <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
            <div>
              <h2 className="font-heading text-2xl font-bold text-neutral-950 dark:text-white">
                Ready to book a service?
              </h2>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                Schedule an appointment with our veterinary team today.
              </p>
            </div>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary-600 px-6 text-base font-medium text-white transition-colors hover:bg-primary-700"
              href="/appointment"
            >
              Book Appointment
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
