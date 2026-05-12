import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Award } from 'lucide-react';
import { Container, Section, Card, Badge } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { generatePageMetadata } from '@/config/seo';
import { doctors } from '@/data/doctors';
import { fetchPublicDoctors } from '@/services/public-data';

export const metadata: Metadata = generatePageMetadata({
  title: 'Our Doctors',
  description:
    'Meet our experienced veterinary team. Qualified veterinarians specializing in general medicine, surgery, dermatology, and emergency care.',
  keywords: ['veterinarian', 'pet doctor', 'vet specialist', 'animal doctor'],
});

export default async function DoctorsPage() {
  const apiRows = (await fetchPublicDoctors()).filter((d) => d.marketingSlug);
  const apiSlugSet = new Set(apiRows.map((d) => d.marketingSlug).filter(Boolean) as string[]);
  const staticDoctors = doctors.filter((d) => !apiSlugSet.has(d.slug));

  return (
    <>
      <PageHeader
        description="Our team of qualified veterinarians brings together expertise in medicine, surgery, dermatology, and emergency care to provide comprehensive treatment for your pets."
        eyebrow="Veterinary team"
        title="Meet Our Doctors"
      />

      <Section padding="lg">
        <Container>
          {apiRows.length > 0 && (
            <div className="mb-12">
              <h2 className="font-heading text-lg font-semibold text-neutral-950 dark:text-white">
                Clinic directory (live)
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Profiles connected to public booking and reviews.
              </p>
              <div className="mt-6 grid gap-8 md:grid-cols-2">
                {apiRows.map((doctor) => (
                  <Card key={doctor.id} hover padding="lg">
                    <div className="flex items-start gap-5">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                        <span className="text-lg font-bold">
                          {`${doctor.firstName[0] ?? ''}${doctor.lastName[0] ?? ''}`.toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-neutral-950 dark:text-white">
                          {doctor.firstName} {doctor.lastName}
                        </h2>
                        <p className="text-sm text-primary-600 dark:text-primary-400">{doctor.qualification}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Badge size="sm" variant="primary">
                        {doctor.specialization}
                      </Badge>
                    </div>
                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {doctor.bio ?? 'Experienced veterinarian dedicated to compassionate care.'}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
                      <Award className="h-3.5 w-3.5" aria-hidden="true" />
                      {doctor.experienceYears}+ years experience
                    </div>
                    <Link
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800 dark:text-primary-400"
                      href={`/doctors/${doctor.marketingSlug}`}
                    >
                      View full profile
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {apiRows.length === 0 && (
            <p className="mb-10 rounded-xl border border-dashed border-neutral-200 p-4 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
              Live doctor directory will appear when your clinic publishes doctors to the public API. Until then,
              browse our editorial profiles below.
            </p>
          )}

          <div className="grid gap-8 md:grid-cols-2">
            {staticDoctors.map((doctor) => (
              <Card key={doctor.id} hover padding="lg">
                <div className="flex items-start gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
                    <span className="text-lg font-bold">
                      {doctor.name
                        .split(' ')
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-neutral-950 dark:text-white">{doctor.name}</h2>
                    <p className="text-sm text-primary-600 dark:text-primary-400">{doctor.title}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Badge size="sm" variant="primary">
                    {doctor.specialization}
                  </Badge>
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {doctor.bio}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
                  <Award className="h-3.5 w-3.5" aria-hidden="true" />
                  {doctor.experience}
                </div>

                <Link
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800 dark:text-primary-400"
                  href={`/doctors/${doctor.slug}`}
                >
                  View full profile
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
