import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Award, GraduationCap, Stethoscope, ArrowRight } from 'lucide-react';
import { Container, Section, Badge } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { generatePageMetadata } from '@/config/seo';
import { siteConfig } from '@/config';
import { getDoctorBySlug, getAllDoctorSlugs } from '@/data/doctors';
import { absoluteSiteUrl } from '@/lib/seo/absolute-url';
import { JsonLdScript } from '@/lib/seo/json-ld';
import type { StructuredData } from '@/types/seo';
import { fetchPublicDoctorBySlug } from '@/services/public-data';
import { PublicReviewSection } from '@/components/reviews';

export const dynamicParams = true;

interface DoctorDetailPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllDoctorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: DoctorDetailPageProps): Promise<Metadata> {
  const api = await fetchPublicDoctorBySlug(params.slug);
  if (api) {
    const name = `${api.firstName} ${api.lastName}`;
    return generatePageMetadata({
      title: `${name} — Veterinarian`,
      description: api.bio ?? `${name} — ${api.specialization}`,
      keywords: [name, api.specialization, 'veterinarian', 'pet doctor'],
      canonical: absoluteSiteUrl(`/doctors/${params.slug}`),
    });
  }
  const doctor = getDoctorBySlug(params.slug);
  if (!doctor) return {};
  return generatePageMetadata({
    title: `${doctor.name} - ${doctor.title}`,
    description: `${doctor.name} specializes in ${doctor.specialization}. ${doctor.experience}.`,
    keywords: [doctor.name, doctor.specialization, 'veterinarian', 'pet doctor'],
    canonical: absoluteSiteUrl(`/doctors/${doctor.slug}`),
  });
}

export default async function DoctorDetailPage({ params }: DoctorDetailPageProps) {
  const api = await fetchPublicDoctorBySlug(params.slug);
  const fallback = getDoctorBySlug(params.slug);

  if (!api && !fallback) {
    notFound();
  }

  const pageUrl = absoluteSiteUrl(`/doctors/${params.slug}`);

  if (api) {
    const name = `${api.firstName} ${api.lastName}`;
    const physicianLd: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Physician',
      name,
      description: api.bio ?? api.specialization,
      medicalSpecialty: api.specialization,
      url: pageUrl,
      jobTitle: api.qualification,
      worksFor: {
        '@type': 'VeterinaryCare',
        name: siteConfig.name,
        url: siteConfig.url,
      },
    };
    if (api.reviewCount >= 1 && api.reviewAverage > 0) {
      physicianLd['aggregateRating'] = {
        '@type': 'AggregateRating',
        ratingValue: api.reviewAverage,
        reviewCount: api.reviewCount,
        bestRating: 5,
        worstRating: 1,
      };
    }

    return (
      <>
        <JsonLdScript data={physicianLd} />
        <PageHeader
          description={`${api.specialization} · ${api.experienceYears}+ yrs experience`}
          eyebrow={api.qualification}
          title={name}
        >
          <div className="mt-4 flex flex-wrap gap-2">
            {api.isAvailable ? (
              <Badge size="lg" variant="primary">
                Accepting bookings
              </Badge>
            ) : (
              <Badge size="lg" variant="default">
                Limited availability
              </Badge>
            )}
            {api.emergencyAvailable && (
              <Badge size="lg" variant="error">
                Emergency coverage
              </Badge>
            )}
          </div>
        </PageHeader>

        <Section padding="lg">
          <Container>
            <div className="mx-auto max-w-3xl">
              <Link
                className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-primary-600"
                href="/doctors"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                All doctors
              </Link>

              <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                {api.bio ?? 'Our veterinary team is committed to compassionate, evidence-based care.'}
              </p>

              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-white">
                    <GraduationCap className="h-5 w-5 text-primary-600" aria-hidden="true" />
                    Qualifications
                  </div>
                  <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">{api.qualification}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-white">
                    <Stethoscope className="h-5 w-5 text-primary-600" aria-hidden="true" />
                    Focus
                  </div>
                  <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">{api.specialization}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500">
                    <Award className="h-4 w-4" aria-hidden="true" />
                    {api.experienceYears}+ years clinical experience
                  </div>
                </div>
              </div>

              {api.branches.length > 0 && (
                <div className="mt-10 rounded-2xl border border-neutral-200 p-4 text-sm dark:border-neutral-800">
                  <p className="font-semibold text-neutral-950 dark:text-white">Branches</p>
                  <ul className="mt-2 space-y-1 text-neutral-600 dark:text-neutral-400">
                    {api.branches.map((b) => (
                      <li key={b.id}>
                        <Link className="text-primary-600 hover:underline" href={`/locations/${b.slug}`}>
                          {b.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-12 flex flex-col gap-4 rounded-2xl bg-primary-50 p-6 dark:bg-primary-950/40 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-neutral-950 dark:text-white">Book a consultation</h3>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    Choose a slot that fits your schedule.
                  </p>
                </div>
                <Link
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 text-base font-medium text-white transition-colors hover:bg-primary-700"
                  href={`/appointment?doctor=${encodeURIComponent(params.slug)}`}
                >
                  Book with {api.firstName}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Container>
        </Section>

        <Section background="muted" padding="lg">
          <Container>
            <div className="mx-auto max-w-3xl">
              <PublicReviewSection targetId={api.id} targetType="DOCTOR" />
            </div>
          </Container>
        </Section>
      </>
    );
  }

  const doctor = fallback!;

  const physicianLd: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doctor.name,
    description: doctor.bio,
    medicalSpecialty: doctor.specialization,
    url: pageUrl,
    jobTitle: doctor.title,
    worksFor: {
      '@type': 'VeterinaryCare',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <>
      <JsonLdScript data={physicianLd} />
      <PageHeader
        description={`${doctor.specialization} • ${doctor.experience}`}
        eyebrow={doctor.title}
        title={doctor.name}
      >
        <div className="mt-4">
          {doctor.available ? (
            <Badge size="lg" variant="primary">
              Available for consultations
            </Badge>
          ) : (
            <Badge size="lg" variant="default">
              Currently unavailable
            </Badge>
          )}
        </div>
      </PageHeader>

      <Section padding="lg">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Link
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-primary-600"
              href="/doctors"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All doctors
            </Link>

            <div className="flex items-start gap-6">
              <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400 sm:flex">
                <span className="text-2xl font-bold">
                  {doctor.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              </div>
              <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">{doctor.bio}</p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-white">
                  <GraduationCap className="h-5 w-5 text-primary-600" aria-hidden="true" />
                  Qualifications
                </div>
                <ul className="mt-4 space-y-2">
                  {doctor.qualifications.map((q) => (
                    <li key={q} className="text-sm text-neutral-600 dark:text-neutral-400">
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-white">
                  <Stethoscope className="h-5 w-5 text-primary-600" aria-hidden="true" />
                  Specialization
                </div>
                <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">{doctor.specialization}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500">
                  <Award className="h-4 w-4" aria-hidden="true" />
                  {doctor.experience}
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-4 rounded-2xl bg-primary-50 p-6 dark:bg-primary-950/40 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-neutral-950 dark:text-white">Book a consultation</h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Schedule a visit with {doctor.name}.</p>
              </div>
              <Link
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 text-base font-medium text-white transition-colors hover:bg-primary-700"
                href="/appointment"
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
