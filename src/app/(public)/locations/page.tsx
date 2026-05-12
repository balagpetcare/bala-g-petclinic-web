import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { Container, Section, Card } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { generatePageMetadata } from '@/config/seo';
import { siteConfig, contactInfo, businessHours, emergencyContact } from '@/config/site';
import { fetchPublicBranches } from '@/services/public-data';

export const metadata: Metadata = generatePageMetadata({
  title: 'Locations',
  description: `Find ${siteConfig.name} — hours, contact details, branches, and how to reach us for appointments and emergencies.`,
  keywords: ['locations', 'clinic hours', 'veterinary', 'pet clinic', 'contact'],
});

export default async function LocationsPage() {
  const branches = await fetchPublicBranches();

  return (
    <>
      <PageHeader
        description="Visit us at our clinic. Hours below reflect our standard schedule; holiday changes are announced on the blog and social channels."
        title="Locations & hours"
      />
      <Section className="pt-0">
        <Container>
          {branches.length > 0 && (
            <div className="mb-12">
              <h2 className="font-heading text-xl font-semibold text-neutral-950 dark:text-white">Our branches</h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Select a location for maps, doctors, reviews, and branch-specific booking.
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {branches.map((b) => (
                  <li key={b.id}>
                    <Card className="flex h-full flex-col p-6" hover padding="none">
                      <h3 className="font-semibold text-neutral-950 dark:text-white">{b.clinicName || b.name}</h3>
                      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                        {[b.city, b.region].filter(Boolean).join(', ') || 'View details'}
                      </p>
                      <Link
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:underline"
                        href={`/locations/${b.slug}`}
                      >
                        Branch page
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </Card>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="p-8">
              <div className="mb-4 flex items-center gap-2 text-primary-600">
                <MapPin className="h-5 w-5 shrink-0" aria-hidden />
                <h2 className="text-xl font-semibold text-neutral-950 dark:text-white">Primary clinic (HQ)</h2>
              </div>
              <address className="not-italic text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">{siteConfig.name}</p>
                <p>{contactInfo.address}</p>
                <p>
                  {contactInfo.city}, {contactInfo.state} {contactInfo.pincode}
                </p>
                <p>{contactInfo.country}</p>
              </address>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden />
                  <a className="hover:underline" href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}>
                    {contactInfo.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden />
                  <a className="hover:underline" href={`mailto:${contactInfo.email}`}>
                    {contactInfo.email}
                  </a>
                </li>
              </ul>
            </Card>
            <Card className="p-8">
              <div className="mb-4 flex items-center gap-2 text-primary-600">
                <Clock className="h-5 w-5 shrink-0" aria-hidden />
                <h2 className="text-xl font-semibold text-neutral-950 dark:text-white">Regular hours</h2>
              </div>
              <ul className="space-y-2 text-sm">
                {businessHours.map((row) => (
                  <li
                    key={row.day}
                    className="flex justify-between gap-4 border-b border-border/60 py-2 last:border-0"
                  >
                    <span className="font-medium">{row.day}</span>
                    <span className="text-muted-foreground">
                      {row.open} – {row.close}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-lg bg-muted/50 p-4">
                <p className="text-sm font-semibold text-foreground">{emergencyContact.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{emergencyContact.available}</p>
                <a
                  className="mt-2 inline-flex text-sm font-medium text-primary-600 hover:underline"
                  href={`tel:${emergencyContact.phone.replace(/\s/g, '')}`}
                >
                  {emergencyContact.phone}
                </a>
              </div>
            </Card>
          </div>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Need directions or appointment help?{' '}
            <Link className="font-medium text-primary-600 hover:underline" href="/contact">
              Contact us
            </Link>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
