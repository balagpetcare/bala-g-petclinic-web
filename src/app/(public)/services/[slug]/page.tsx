import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Container, Section, Badge } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { generatePageMetadata } from '@/config/seo';
import { getServiceBySlug, getAllServiceSlugs } from '@/data/services';
import { JsonLdScript } from '@/lib/seo/json-ld';
import { buildBreadcrumbJsonLd, buildServiceJsonLd } from '@/lib/seo/schemas';

interface ServiceDetailPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: ServiceDetailPageProps): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) return {};

  return generatePageMetadata({
    title: service.title,
    description: service.shortDescription,
    keywords: [service.title.toLowerCase(), 'veterinary', 'pet care', 'clinic service'],
    path: `/services/${params.slug}`,
  });
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const Icon = service.icon;

  return (
    <>
      <JsonLdScript
        data={[
          buildServiceJsonLd({
            name: service.title,
            description: service.shortDescription,
            path: `/services/${service.slug}`,
          }),
          buildBreadcrumbJsonLd([
            { name: 'Services', path: '/services' },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
        ]}
      />
      <PageHeader
        description={service.shortDescription}
        eyebrow="Service details"
        title={service.title}
      >
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {service.duration && (
            <Badge size="lg" variant="primary">
              <Clock className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              {service.duration}
            </Badge>
          )}
          {service.priceRange && (
            <Badge size="lg" variant="default">
              {service.priceRange}
            </Badge>
          )}
        </div>
      </PageHeader>

      <Section padding="lg">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Link
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-primary-600"
              href="/services"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All services
            </Link>

            <div className="flex items-start gap-5">
              <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400 sm:flex">
                <Icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <div>
                <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {service.fullDescription}
                </p>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="font-heading text-xl font-semibold text-neutral-950 dark:text-white">
                What&apos;s included
              </h2>
              <ul className="mt-6 space-y-4">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle
                      className="mt-0.5 h-5 w-5 shrink-0 text-primary-600"
                      aria-hidden="true"
                    />
                    <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 flex flex-col gap-4 rounded-2xl bg-primary-50 p-6 dark:bg-primary-950/40 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-neutral-950 dark:text-white">
                  Interested in this service?
                </h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  Book an appointment or call us to learn more.
                </p>
              </div>
              <Link
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 text-base font-medium text-white transition-colors hover:bg-primary-700"
                href={`/appointment?serviceSlug=${encodeURIComponent(service.slug)}`}
              >
                Book Appointment
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
