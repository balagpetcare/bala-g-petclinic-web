import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { Container, Section, Card } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { generatePageMetadata } from '@/config/seo';
import { absoluteSiteUrl } from '@/lib/seo/absolute-url';
import { JsonLdScript } from '@/lib/seo/json-ld';
import { fetchPublicBranchBySlug } from '@/services/public-data';
import { BranchMapEmbed } from '@/components/maps/BranchMapEmbed';
import { PublicReviewSection } from '@/components/reviews';

interface BranchPageProps {
  params: { slug: string };
}

function buildAddress(b: Awaited<ReturnType<typeof fetchPublicBranchBySlug>>): string {
  if (!b) return '';
  const parts = [
    b.addressLine1,
    b.addressLine2,
    [b.city, b.region, b.postalCode].filter(Boolean).join(', '),
    b.country,
  ].filter(Boolean);
  return parts.join(', ');
}

export async function generateMetadata({ params }: BranchPageProps): Promise<Metadata> {
  const b = await fetchPublicBranchBySlug(params.slug);
  if (!b) return {};
  const title = b.clinicName || b.name;
  return generatePageMetadata({
    title: `${title} — Location`,
    description: `Hours, contact, and directions for ${title}.`,
    keywords: [title, 'pet clinic location', 'veterinary branch'],
    canonical: absoluteSiteUrl(`/locations/${params.slug}`),
  });
}

export default async function BranchLocationPage({ params }: BranchPageProps) {
  const b = await fetchPublicBranchBySlug(params.slug);
  if (!b) notFound();

  const title = b.clinicName || b.name;
  const address = buildAddress(b);
  const pageUrl = absoluteSiteUrl(`/locations/${params.slug}`);

  const localLd = {
    '@context': 'https://schema.org',
    '@type': 'VeterinaryCare',
    name: title,
    url: pageUrl,
    telephone: b.contactPhone ?? undefined,
    email: b.contactEmail ?? undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: [b.addressLine1, b.addressLine2].filter(Boolean).join(', ') || undefined,
      addressLocality: b.city ?? undefined,
      addressRegion: b.region ?? undefined,
      postalCode: b.postalCode ?? undefined,
      addressCountry: b.country ?? undefined,
    },
    openingHoursSpecification: b.weeklyHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.dayOfWeek,
      opens: h.startTime,
      closes: h.endTime,
    })),
  };

  return (
    <>
      <JsonLdScript data={localLd} />
      <PageHeader
        description="Branch details, hours, and how to reach our team at this location."
        eyebrow="Our clinic"
        title={title}
      />

      <Section padding="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <Card className="p-8">
              <div className="mb-4 flex items-center gap-2 text-primary-600">
                <MapPin className="h-5 w-5 shrink-0" aria-hidden />
                <h2 className="text-xl font-semibold text-neutral-950 dark:text-white">Address</h2>
              </div>
              <address className="not-italic text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {b.addressLine1 && <p className="font-medium text-neutral-950 dark:text-white">{b.addressLine1}</p>}
                {b.addressLine2 && <p>{b.addressLine2}</p>}
                <p>
                  {[b.city, b.region, b.postalCode].filter(Boolean).join(', ')}
                </p>
                {b.country && <p>{b.country}</p>}
              </address>
              <ul className="mt-6 space-y-3 text-sm">
                {b.contactPhone && (
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden />
                    <a className="text-primary-700 hover:underline" href={`tel:${b.contactPhone.replace(/\s/g, '')}`}>
                      {b.contactPhone}
                    </a>
                  </li>
                )}
                {b.contactEmail && (
                  <li className="flex gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden />
                    <a className="text-primary-700 hover:underline" href={`mailto:${b.contactEmail}`}>
                      {b.contactEmail}
                    </a>
                  </li>
                )}
              </ul>
              <div className="mt-8">
                <BranchMapEmbed address={address || title} title={`Map of ${title}`} />
              </div>
            </Card>

            <div className="space-y-8">
              <Card className="p-8">
                <div className="mb-4 flex items-center gap-2 text-primary-600">
                  <Clock className="h-5 w-5 shrink-0" aria-hidden />
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-white">Working hours</h2>
                </div>
                {b.weeklyHours.length === 0 ? (
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Hours will be published soon.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {b.weeklyHours.map((row) => (
                      <li
                        key={`${row.dayOfWeek}-${row.startTime}`}
                        className="flex justify-between gap-4 border-b border-neutral-100 py-2 last:border-0 dark:border-neutral-800"
                      >
                        <span className="font-medium text-neutral-950 dark:text-white">{row.dayOfWeek}</span>
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {row.startTime} – {row.endTime}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-4 text-xs text-neutral-500">Timezone: {b.timezone}</p>
              </Card>

              {b.doctors.length > 0 && (
                <Card className="p-8">
                  <h2 className="text-xl font-semibold text-neutral-950 dark:text-white">Doctors at this branch</h2>
                  <ul className="mt-4 space-y-3 text-sm">
                    {b.doctors.map((d) => (
                      <li key={d.id}>
                        {d.marketingSlug ? (
                          <Link className="font-medium text-primary-600 hover:underline" href={`/doctors/${d.marketingSlug}`}>
                            {d.firstName} {d.lastName}
                          </Link>
                        ) : (
                          <span className="text-neutral-800 dark:text-neutral-200">
                            {d.firstName} {d.lastName}
                          </span>
                        )}
                        <span className="text-neutral-500"> — {d.specialization}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 text-base font-medium text-white transition-colors hover:bg-primary-700"
                  href={`/appointment?branchId=${encodeURIComponent(b.id)}`}
                >
                  Book at this branch
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  className="inline-flex h-11 items-center justify-center rounded-lg border-2 border-primary-600 px-6 text-base font-medium text-primary-600 transition-colors hover:bg-primary-50 dark:border-primary-500 dark:text-primary-400 dark:hover:bg-primary-950"
                  href="/contact"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="muted" padding="lg">
        <Container>
          <PublicReviewSection targetId={b.id} targetType="BRANCH" />
        </Container>
      </Section>
    </>
  );
}
