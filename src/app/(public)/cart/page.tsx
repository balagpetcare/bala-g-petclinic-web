import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { CartClient } from '@/components/ecommerce';
import { generatePageMetadata } from '@/config/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Cart',
  description: 'Review your selected products and continue to checkout.',
  keywords: ['cart', 'shopping cart', 'checkout'],
});

export default function CartPage() {
  return (
    <>
      <PageHeader
        description="Review your selected items before placing an order."
        eyebrow="Shopping"
        title="Your Cart"
      />
      <Section padding="lg">
        <Container>
          <CartClient />
        </Container>
      </Section>
    </>
  );
}
