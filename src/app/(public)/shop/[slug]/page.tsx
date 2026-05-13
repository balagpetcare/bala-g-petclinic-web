import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Container, Section } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { ProductGrid, ProductPurchasePanel, ProductReviews } from '@/components/ecommerce';
import { generatePageMetadata } from '@/config/seo';
import { ecommerceApi } from '@/services';
import { products } from '@/data/ecommerce';
import { JsonLdScript } from '@/lib/seo/json-ld';
import { buildBreadcrumbJsonLd, buildProductJsonLd } from '@/lib/seo/schemas';

interface ProductDetailPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return products.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const response = await ecommerceApi.getProductBySlug(params.slug);
  if (!response.success || !response.data) return {};

  return generatePageMetadata({
    title: response.data.name,
    description: response.data.description,
    keywords: [...response.data.tags, response.data.categorySlug, 'pet product'],
    path: `/shop/${params.slug}`,
  });
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const productRes = await ecommerceApi.getProductBySlug(params.slug);
  if (!productRes.success || !productRes.data) notFound();
  const product = productRes.data;

  const [reviewsRes, relatedRes] = await Promise.all([
    ecommerceApi.getProductReviews(product.id),
    ecommerceApi.getRelatedProducts(product.id),
  ]);

  const reviews = reviewsRes.success && reviewsRes.data ? reviewsRes.data : [];
  const related = relatedRes.success && relatedRes.data ? relatedRes.data : [];

  const productLd = buildProductJsonLd({
    name: product.name,
    description: product.description,
    path: `/shop/${product.slug}`,
    image: product.image.src,
    sku: product.id,
  });
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: 'Shop', path: '/shop' },
    { name: product.name, path: `/shop/${product.slug}` },
  ]);

  return (
    <>
      <JsonLdScript data={[productLd, breadcrumbLd]} />
      <PageHeader
        centered={false}
        description={product.description}
        eyebrow={product.categorySlug.replace('-', ' ')}
        title={product.name}
      />

      <Section padding="lg">
        <Container>
          <Link
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-primary-600"
            href="/shop"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to shop
          </Link>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="aspect-[4/3] rounded-2xl bg-neutral-100 dark:bg-neutral-900" />
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Description</h2>
                <p className="mt-3 leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {product.description}
                </p>
              </div>
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-white">
                  Reviews ({reviews.length})
                </h2>
                <ProductReviews reviews={reviews} />
              </div>
            </div>

            <aside className="lg:col-span-2">
              <ProductPurchasePanel product={product} />
            </aside>
          </div>
        </Container>
      </Section>

      <Section background="muted" padding="lg">
        <Container>
          <h2 className="mb-6 text-2xl font-semibold text-neutral-900 dark:text-white">
            Related Products
          </h2>
          <ProductGrid products={related} />
        </Container>
      </Section>
    </>
  );
}
