import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Section } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { ProductGrid } from '@/components/ecommerce';
import { generatePageMetadata } from '@/config/seo';
import { ecommerceApi } from '@/services';
import { productCategories } from '@/data/ecommerce';
import { JsonLdScript } from '@/lib/seo/json-ld';
import { buildBreadcrumbJsonLd } from '@/lib/seo/schemas';

interface CategoryPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return productCategories.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryRes = await ecommerceApi.getCategoryBySlug(params.slug);
  if (!categoryRes.success || !categoryRes.data) return {};
  return generatePageMetadata({
    title: `${categoryRes.data.name} Products`,
    description: categoryRes.data.description,
    keywords: [categoryRes.data.name, 'shop', 'pet products'],
    path: `/shop/category/${params.slug}`,
  });
}

export default async function ShopCategoryPage({ params }: CategoryPageProps) {
  const [categoryRes, productsRes] = await Promise.all([
    ecommerceApi.getCategoryBySlug(params.slug),
    ecommerceApi.getProducts({ category: params.slug }),
  ]);

  if (!categoryRes.success || !categoryRes.data) notFound();
  const products = productsRes.success && productsRes.data ? productsRes.data : [];

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: 'Shop', path: '/shop' },
    { name: categoryRes.data.name, path: `/shop/category/${params.slug}` },
  ]);

  return (
    <>
      <JsonLdScript data={breadcrumbLd} />
      <PageHeader
        description={categoryRes.data.description}
        eyebrow="Product category"
        title={categoryRes.data.name}
      />
      <Section padding="lg">
        <Container>
          <ProductGrid products={products} />
        </Container>
      </Section>
    </>
  );
}
