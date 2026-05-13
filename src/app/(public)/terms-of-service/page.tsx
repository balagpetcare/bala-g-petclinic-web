import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { generatePageMetadata } from '@/config/seo';
import { siteConfig, contactInfo } from '@/config/site';

export const metadata: Metadata = generatePageMetadata({
  title: 'Terms of Service',
  description: `Terms of service for ${siteConfig.name}. Read our terms and conditions for using our website and veterinary services.`,
  keywords: ['terms of service', 'terms and conditions', 'usage policy'],
  path: '/terms-of-service',
});

export default function TermsOfServicePage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Service" />

      <Section padding="lg">
        <Container>
          <article className="prose prose-neutral mx-auto max-w-3xl dark:prose-invert">
            <p className="text-sm text-neutral-500">
              Last updated: May 2026
            </p>

            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using the {siteConfig.name} website and services, you accept and agree
              to be bound by these Terms of Service. If you do not agree to these terms, please do
              not use our services.
            </p>

            <h2>Services</h2>
            <p>
              {siteConfig.name} provides veterinary consultation, emergency care, grooming,
              vaccination programs, and a pet shop through our physical clinic and online booking
              system. Our services are subject to availability and professional veterinary judgment.
            </p>

            <h2>Appointments and Cancellations</h2>
            <ul>
              <li>Appointments are confirmed subject to availability</li>
              <li>Please arrive on time for your scheduled appointment</li>
              <li>Cancellations should be made at least 2 hours in advance</li>
              <li>Repeated no-shows may affect future booking priority</li>
            </ul>

            <h2>Medical Disclaimer</h2>
            <p>
              Information provided on this website is for general educational purposes only and
              should not be considered a substitute for professional veterinary advice. Always
              consult with our veterinarians for specific medical concerns about your pet.
            </p>

            <h2>Pet Shop Purchases</h2>
            <ul>
              <li>Product availability is subject to stock</li>
              <li>Prices may change without prior notice</li>
              <li>Return and exchange policies apply as displayed at the clinic</li>
              <li>Prescription products require valid veterinary authorization</li>
            </ul>

            <h2>Limitation of Liability</h2>
            <p>
              While we strive to provide the highest standard of veterinary care, {siteConfig.name}
              shall not be liable for outcomes that are beyond reasonable medical control. Our
              veterinarians follow established protocols and evidence-based practices.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              All content on this website, including text, images, logos, and design elements, is the
              property of {siteConfig.name} and may not be reproduced without written permission.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be posted on this
              page with an updated revision date. Continued use of our services constitutes
              acceptance of revised terms.
            </p>

            <h2>Contact</h2>
            <p>
              For questions about these Terms of Service, please contact us at{' '}
              <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>.
            </p>
          </article>
        </Container>
      </Section>
    </>
  );
}
