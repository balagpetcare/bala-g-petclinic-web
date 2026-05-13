import type { Metadata } from 'next';
import { Phone, AlertTriangle, Clock, Heart } from 'lucide-react';
import { Container, Section, Card } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { EmergencyForm } from '@/components/forms';
import { generatePageMetadata } from '@/config/seo';
import { emergencyContact } from '@/config/site';
import { JsonLdScript } from '@/lib/seo/json-ld';
import { buildBreadcrumbJsonLd, buildEmergencyServiceJsonLd } from '@/lib/seo/schemas';
import { toTelHref } from '@/lib/utils';

export const metadata: Metadata = generatePageMetadata({
  title: 'Emergency Veterinary Care',
  description:
    'Pet emergency? Contact Bala G Pet Clinic immediately for urgent veterinary assistance. Available 24/7 for critical pet health situations.',
  keywords: ['pet emergency', 'emergency vet Dhaka', 'urgent pet care', '24/7 veterinary', 'animal hospital Dhaka'],
  path: '/emergency',
});

export default function EmergencyPage() {
  return (
    <>
      <JsonLdScript
        data={[
          buildEmergencyServiceJsonLd(),
          buildBreadcrumbJsonLd([{ name: 'Emergency', path: '/emergency' }]),
        ]}
      />
      <PageHeader
        className="bg-gradient-to-b from-error-50/60 to-white dark:from-error-950/20 dark:to-neutral-950"
        description="If your pet needs urgent help, call us immediately. For non-critical situations, submit the form below and our team will contact you within minutes."
        eyebrow="24/7 Emergency support"
        title="Emergency Veterinary Care"
      />

      <Section padding="sm">
        <Container>
          <div className="mx-auto max-w-2xl">
            <a
              className="flex items-center justify-center gap-3 rounded-2xl border-2 border-error-200 bg-error-50 p-6 text-center transition-colors hover:bg-error-100 dark:border-error-800 dark:bg-error-950/30 dark:hover:bg-error-950/50"
              href={toTelHref(emergencyContact.phone)}
            >
              <Phone className="h-7 w-7 text-error-600" aria-hidden="true" />
              <span>
                <span className="block text-sm font-medium text-error-600">
                  {emergencyContact.label} — {emergencyContact.available}
                </span>
                <span className="block text-2xl font-bold text-error-700 dark:text-error-400">
                  {emergencyContact.phone}
                </span>
              </span>
            </a>
          </div>
        </Container>
      </Section>

      <Section padding="md">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            <Card padding="md">
              <AlertTriangle className="h-6 w-6 text-warning-500" aria-hidden="true" />
              <h3 className="mt-3 font-semibold text-neutral-950 dark:text-white">
                Recognize urgency
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Difficulty breathing, seizures, inability to stand, uncontrolled bleeding, or
                suspected poisoning require immediate care.
              </p>
            </Card>
            <Card padding="md">
              <Clock className="h-6 w-6 text-primary-600" aria-hidden="true" />
              <h3 className="mt-3 font-semibold text-neutral-950 dark:text-white">
                Fast response
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Our emergency team responds within minutes. Phone calls are prioritized for critical
                situations during and outside clinic hours.
              </p>
            </Card>
            <Card padding="md">
              <Heart className="h-6 w-6 text-error-500" aria-hidden="true" />
              <h3 className="mt-3 font-semibold text-neutral-950 dark:text-white">
                Calm guidance
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                We guide you step-by-step while you bring your pet in. Stay calm and follow our
                instructions for the safest outcome.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section background="muted" padding="lg">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="font-heading text-2xl font-bold text-neutral-950 dark:text-white">
              Submit an Emergency Request
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              For non-critical but urgent situations. Our team will contact you within minutes.
            </p>
            <div className="mt-8">
              <EmergencyForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
