import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { ContactForm } from '@/components/forms';
import {
  ContactDetailsPanel,
  ContactQuickActions,
  EmergencyCallCard,
  StickyMobileCallBar,
} from '@/components/contact';
import { generatePageMetadata } from '@/config/seo';
import { localSeoEntity } from '@/config/seo-entity';
import { emergencyContact } from '@/config/site';
import { JsonLdScript } from '@/lib/seo/json-ld';
import { buildBreadcrumbJsonLd } from '@/lib/seo/schemas';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with Bala G Pet Clinic on DIT Road, Dhaka 1219. Call, WhatsApp, email, or visit — 24-hour emergency veterinary line and map directions.',
  keywords: ['contact', 'pet clinic Dhaka', 'veterinary address', 'emergency vet phone', ...localSeoEntity.primaryKeywords],
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <JsonLdScript
        data={buildBreadcrumbJsonLd([{ name: 'Contact', path: '/contact' }])}
      />
      <PageHeader
        className="py-10 sm:py-14 md:py-20"
        description="We'd love to hear from you. Visit us at the clinic, give us a call, or send us a message."
        eyebrow="Get in touch"
        title="Contact Us"
      />

      <Section
        className="pb-[calc(5.75rem+env(safe-area-inset-bottom))] lg:pb-0"
        padding="lg"
      >
        <Container className="max-w-6xl">
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-12">
            <div className="order-1 flex min-w-0 flex-col gap-6 lg:order-2 lg:col-span-5 lg:gap-7">
              <EmergencyCallCard emergency={emergencyContact} />
              <ContactQuickActions />
              <ContactDetailsPanel />
            </div>

            <div className="order-2 min-w-0 lg:order-1 lg:col-span-7">
              <h2 className="font-heading text-lg font-semibold tracking-tight text-neutral-950 sm:text-xl dark:text-white">
                Send us a message
              </h2>
              <p className="mt-2 max-w-prose text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                Fill out the form below and we&apos;ll respond within 24 hours.
              </p>
              <div className="mt-6 sm:mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <StickyMobileCallBar />
    </>
  );
}
