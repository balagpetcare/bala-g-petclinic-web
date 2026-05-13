import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared';
import { CmsHtmlContent, SectionRenderer } from '@/components/cms';
import { Container } from '@/components/ui/Container';
import { generatePageMetadata } from '@/config/seo';
import { siteConfig } from '@/config';
import { JsonLdScript } from '@/lib/seo/json-ld';
import { absoluteSiteUrl, absolutizeMediaUrl } from '@/lib/seo/absolute-url';
import { buildBreadcrumbJsonLd } from '@/lib/seo/schemas';
import { fetchPublishedPageBySlug } from '@/services/cms-public';
import type { CmsPagePublic } from '@/types/cms-public';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const res = await fetchPublishedPageBySlug(params.slug);
  if (!res.success || !res.data) return {};
  const page = res.data as CmsPagePublic;
  const path = `/pages/${page.slug}`;
  const canonical = page.canonicalPath ? absoluteSiteUrl(page.canonicalPath) : absoluteSiteUrl(path);
  const image = absolutizeMediaUrl(page.ogImage) ?? siteConfig.ogImage;

  return generatePageMetadata({
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.excerpt ?? `${page.title} | ${siteConfig.name}`,
    keywords: ['Bala G Pet Clinic', page.title],
    image: image ?? undefined,
    noIndex: page.noIndex,
    canonical,
    path,
  });
}

export default async function CmsDynamicPage({ params }: Props) {
  const res = await fetchPublishedPageBySlug(params.slug);
  if (!res.success || !res.data) {
    notFound();
  }
  const page = res.data as CmsPagePublic;
  const url = absoluteSiteUrl(`/pages/${page.slug}`);
  const siteRoot = siteConfig.url.replace(/\/$/, '');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.excerpt ?? page.seoDescription ?? undefined,
    url,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${siteRoot}/#website`,
      name: siteConfig.name,
      url: siteRoot,
    },
  };
  const breadcrumbLd = buildBreadcrumbJsonLd([{ name: page.title, path: `/pages/${page.slug}` }]);

  return (
    <>
      <JsonLdScript data={[jsonLd, breadcrumbLd]} />
      <PageHeader description={page.excerpt ?? undefined} eyebrow="Clinic information" title={page.title} />
      <SectionRenderer sections={page.sections} />
      {page.content?.trim() ? (
        <Container className="max-w-3xl pb-16">
          <CmsHtmlContent html={page.content} />
        </Container>
      ) : null}
    </>
  );
}
