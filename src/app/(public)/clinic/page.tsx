import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, HeartPulse, Shield, Stethoscope } from 'lucide-react';
import { Container, Section, Card } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { generatePageMetadata } from '@/config/seo';
import { siteConfig, contactInfo, emergencyContact } from '@/config/site';
import { fetchPublicBranches } from '@/services/public-data';

export const metadata: Metadata = generatePageMetadata({
  title: 'Our Clinic',
  description: `${siteConfig.name} — multi-disciplinary veterinary care, modern facilities, and a compassionate team.`,
  keywords: ['pet clinic', 'veterinary hospital', 'animal care', 'Bala G Pet Clinic'],
});

export default async function ClinicPage() {
  const branches = await fetchPublicBranches();

  return (
    <>
      <PageHeader
        description="One platform for preventive care, diagnostics, surgery, and emergency support — built around your pet’s wellbeing."
        eyebrow="Bala G Pet Clinic"
        title="Clinic overview"
      />

      <Section padding="lg">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="p-6" hover padding="none">
              <Stethoscope className="h-8 w-8 text-primary-600" aria-hidden />
              <h2 className="mt-4 font-heading text-lg font-semibold text-neutral-950 dark:text-white">
                Clinical depth
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Evidence-based diagnostics and treatment pathways across medicine, surgery, and chronic care management.
              </p>
            </Card>
            <Card className="p-6" hover padding="none">
              <HeartPulse className="h-8 w-8 text-primary-600" aria-hidden />
              <h2 className="mt-4 font-heading text-lg font-semibold text-neutral-950 dark:text-white">
                Emergency readiness
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Structured triage with {emergencyContact.label.toLowerCase()} — {emergencyContact.phone}.
              </p>
            </Card>
            <Card className="p-6" hover padding="none">
              <Shield className="h-8 w-8 text-primary-600" aria-hidden />
              <h2 className="mt-4 font-heading text-lg font-semibold text-neutral-950 dark:text-white">
                Safety & trust
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Transparent communication, conservative prescribing, and privacy-conscious handling of your records.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section background="muted" padding="lg">
        <Container>
          <h2 className="font-heading text-2xl font-bold text-neutral-950 dark:text-white">Branches</h2>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
            Visit a location near you. Each branch page lists hours, maps, assigned doctors, and published reviews.
          </p>
          {branches.length === 0 ? (
            <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
              Branch listings will appear here when your clinic data is published to the public API.
            </p>
          ) : (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {branches.map((b) => (
                <li key={b.id}>
                  <Card className="flex flex-col gap-3 p-6" hover padding="none">
                    <div>
                      <h3 className="font-semibold text-neutral-950 dark:text-white">{b.clinicName || b.name}</h3>
                      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        {[b.city, b.region].filter(Boolean).join(', ')}
                      </p>
                    </div>
                    <Link
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:underline"
                      href={`/locations/${b.slug}`}
                    >
                      View branch
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      <Section padding="lg">
        <Container className="flex flex-col items-center text-center">
          <p className="max-w-xl text-sm text-neutral-600 dark:text-neutral-400">
            Questions about referrals, second opinions, or specialist visits? Reach our coordination desk at{' '}
            <a className="font-medium text-primary-600 hover:underline" href={`mailto:${contactInfo.email}`}>
              {contactInfo.email}
            </a>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
