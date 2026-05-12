import type { Metadata } from 'next';
import { Container, Section } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { ProductGrid, ShopFilters } from '@/components/ecommerce';
import { generatePageMetadata } from '@/config/seo';
import { ecommerceApi } from '@/services';
import type { ProductFilters } from '@/types';

export const metadata: Metadata = generatePageMetadata({
  title: 'Shop',
  description:
    'Explore pet food, healthcare, and accessories selected by our veterinary team.',
  keywords: ['pet shop', 'pet products', 'pet food', 'pet accessories'],
});

interface ShopPageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseFilters(searchParams?: Record<string, string | string[] | undefined>): ProductFilters {
  const category = first(searchParams?.['category']);
  const search = first(searchParams?.['q']);
  const sort = first(searchParams?.['sort']) as ProductFilters['sort'] | undefined;
  const minRatingRaw = first(searchParams?.['minRating']);
  const stock = first(searchParams?.['stock']);

  return {
    category,
    search,
    sort,
    minRating: minRatingRaw ? Number(minRatingRaw) : undefined,
    inStockOnly: stock === 'in-stock',
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const filters = parseFilters(searchParams);
  const [productsRes, categoriesRes] = await Promise.all([
    ecommerceApi.getProducts(filters),
    ecommerceApi.getCategories(),
  ]);

  const products = productsRes.success && productsRes.data ? productsRes.data : [];
  const categories = categoriesRes.success && categoriesRes.data ? categoriesRes.data : [];

  return (
    <>
      <PageHeader
        description="Shop clinic-approved essentials for nutrition, wellness, and daily pet care."
        eyebrow="Pet ecommerce"
        title="Pet Shop"
      />

      <Section padding="lg">
        <Container>
          <ShopFilters categories={categories} />
          <div className="mb-6 mt-5 text-sm text-neutral-500">
            Showing {products.length} product{products.length === 1 ? '' : 's'}
          </div>
          <ProductGrid products={products} />
        </Container>
      </Section>
    </>
  );
}
