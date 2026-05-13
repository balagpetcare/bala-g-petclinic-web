import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { WishlistClient } from '@/components/ecommerce';
import { generatePageMetadata } from '@/config/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Wishlist',
  description: 'Save products you like and revisit them anytime.',
  keywords: ['wishlist', 'saved products', 'pet shop wishlist'],
  path: '/wishlist',
  noIndex: true,
});

export default function WishlistPage() {
  return (
    <>
      <PageHeader
        description="Your saved products for faster access later."
        eyebrow="Shopping"
        title="Wishlist"
      />
      <Section padding="lg">
        <Container>
          <WishlistClient />
        </Container>
      </Section>
    </>
  );
}
