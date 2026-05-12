import type { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Container, Section, Card } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { ContactForm } from '@/components/forms';
import { generatePageMetadata } from '@/config/seo';
import { contactInfo, businessHours, emergencyContact } from '@/config/site';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with Bala G Pet Clinic. Visit us, call us, or send us a message. We are here to help with your pet care needs.',
  keywords: ['contact', 'pet clinic', 'address', 'phone', 'location'],
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        description="We'd love to hear from you. Visit us at the clinic, give us a call, or send us a message."
        eyebrow="Get in touch"
        title="Contact Us"
      />

      <Section padding="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <h2 className="font-heading text-xl font-semibold text-neutral-950 dark:text-white">
                Send us a message
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Fill out the form below and we&apos;ll respond within 24 hours.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            <aside className="space-y-6 lg:col-span-2">
              <Card padding="lg">
                <div className="flex items-center gap-3 text-primary-600">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                  <h3 className="font-semibold text-neutral-950 dark:text-white">
                    Clinic address
                  </h3>
                </div>
                <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                  {contactInfo.address}<br />
                  {contactInfo.city}, {contactInfo.state} {contactInfo.pincode}
                </p>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3 text-primary-600">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  <h3 className="font-semibold text-neutral-950 dark:text-white">Phone</h3>
                </div>
                <a
                  className="mt-3 block text-sm font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300"
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                >
                  {contactInfo.phone}
                </a>
                <p className="mt-2 text-xs text-neutral-500">
                  Emergency: {emergencyContact.phone} ({emergencyContact.available})
                </p>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3 text-primary-600">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                  <h3 className="font-semibold text-neutral-950 dark:text-white">Email</h3>
                </div>
                <a
                  className="mt-3 block text-sm font-medium text-neutral-700 hover:text-primary-600 dark:text-neutral-300"
                  href={`mailto:${contactInfo.email}`}
                >
                  {contactInfo.email}
                </a>
              </Card>

              <Card padding="lg">
                <div className="flex items-center gap-3 text-primary-600">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                  <h3 className="font-semibold text-neutral-950 dark:text-white">
                    Business hours
                  </h3>
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {businessHours.map((h) => (
                    <li
                      key={h.day}
                      className="flex justify-between text-neutral-600 dark:text-neutral-400"
                    >
                      <span>{h.day}</span>
                      <span>
                        {h.isClosed ? 'Closed' : `${h.open} – ${h.close}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Map placeholder */}
              <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <div className="flex h-48 items-center justify-center bg-neutral-100 dark:bg-neutral-900">
                  <div className="text-center">
                    <MapPin className="mx-auto h-8 w-8 text-neutral-400" aria-hidden="true" />
                    <p className="mt-2 text-sm text-neutral-500">
                      Google Maps integration
                    </p>
                    <p className="text-xs text-neutral-400">Coming soon</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
