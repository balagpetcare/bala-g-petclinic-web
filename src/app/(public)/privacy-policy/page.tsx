import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { generatePageMetadata } from '@/config/seo';
import { siteConfig, contactInfo } from '@/config/site';

export const metadata: Metadata = generatePageMetadata({
  title: 'Privacy Policy',
  description: `Privacy policy for ${siteConfig.name}. Learn how we collect, use, and protect your personal information.`,
  keywords: ['privacy policy', 'data protection', 'personal information'],
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />

      <Section padding="lg">
        <Container>
          <article className="prose prose-neutral mx-auto max-w-3xl dark:prose-invert">
            <p className="text-sm text-neutral-500">
              Last updated: May 2026
            </p>

            <h2>Introduction</h2>
            <p>
              {siteConfig.name} (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed
              to protecting the privacy of our visitors and customers. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you visit our
              website or use our services.
            </p>

            <h2>Information We Collect</h2>
            <p>We may collect information that you provide directly, including:</p>
            <ul>
              <li>Name, email address, and phone number (when booking appointments or contacting us)</li>
              <li>Pet information (name, type, medical history) for veterinary services</li>
              <li>Payment information for purchases and services</li>
              <li>Communication preferences</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul>
              <li>Provide and manage veterinary services and appointments</li>
              <li>Process orders from our pet shop</li>
              <li>Send appointment reminders and follow-up communications</li>
              <li>Improve our services and website experience</li>
              <li>Respond to inquiries and provide support</li>
            </ul>

            <h2>Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share
              information with trusted service providers who assist us in operating our website and
              conducting our business, subject to confidentiality agreements.
            </p>

            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against
              unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>.
            </p>
          </article>
        </Container>
      </Section>
    </>
  );
}
