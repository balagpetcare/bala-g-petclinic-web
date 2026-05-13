import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { CheckoutForm, CheckoutSummaryClient } from '@/components/ecommerce';
import { generatePageMetadata } from '@/config/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Checkout',
  description: 'Complete your order details. Payment integration will be enabled with backend.',
  keywords: ['checkout', 'order', 'shipping details'],
  path: '/checkout',
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        description="Enter shipping details to place your order in demo checkout mode."
        eyebrow="Shopping"
        title="Checkout"
      />
      <Section padding="lg">
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CheckoutForm />
            </div>
            <CheckoutSummaryClient />
          </div>
        </Container>
      </Section>
    </>
  );
}
