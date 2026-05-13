import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/shared';
import { BlogCardGrid, CmsHtmlContent } from '@/components/cms';
import { Container } from '@/components/ui/Container';
import { Text } from '@/components/ui/Text';
import { generatePageMetadata } from '@/config/seo';
import { siteConfig } from '@/config';
import { absolutizeMediaUrl, absoluteSiteUrl } from '@/lib/seo/absolute-url';
import { JsonLdScript } from '@/lib/seo/json-ld';
import { buildBreadcrumbJsonLd } from '@/lib/seo/schemas';
import { fetchPublishedBlogBySlug, fetchRelatedBlogs } from '@/services/cms-public';
import type { BlogPostPublic } from '@/types/cms-public';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const res = await fetchPublishedBlogBySlug(params.slug);
  if (!res.success || !res.data) {
    return {};
  }
  const post = res.data as BlogPostPublic;
  const path = `/blog/${post.slug}`;
  const canonical = post.canonicalPath ? absoluteSiteUrl(post.canonicalPath) : absoluteSiteUrl(path);
  const rawImage = post.ogImage ?? post.coverImage ?? siteConfig.ogImage;
  const absImage = absolutizeMediaUrl(rawImage) ?? siteConfig.ogImage;

  return generatePageMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? `Article by ${post.author}`,
    keywords: [...post.tags, 'Bala G Pet Clinic', 'veterinary blog'],
    image: absImage,
    noIndex: post.noIndex,
    canonical,
    path,
    openGraphType: 'article',
  });
}

export default async function BlogArticlePage({ params }: Props) {
  const res = await fetchPublishedBlogBySlug(params.slug);
  if (!res.success || !res.data) {
    notFound();
  }
  const post = res.data as BlogPostPublic;
  const relatedRes = await fetchRelatedBlogs(post.slug);
  const related = relatedRes.success && Array.isArray(relatedRes.data) ? relatedRes.data : [];

  const url = absoluteSiteUrl(`/blog/${post.slug}`);
  const siteRoot = siteConfig.url.replace(/\/$/, '');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImage ? [absolutizeMediaUrl(post.coverImage) ?? post.coverImage] : undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: post.author },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    publisher: { '@type': 'Organization', '@id': `${siteRoot}/#organization`, name: siteConfig.name },
  };

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: 'Blog', path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <JsonLdScript data={[jsonLd, breadcrumbLd]} />
      <PageHeader
        description={post.excerpt ?? `By ${post.author}`}
        eyebrow={post.category?.name ?? 'Article'}
        title={post.title}
      />

      <Container className="pb-6">
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-primary-600"
          href="/blog"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          All articles
        </Link>
      </Container>

      {post.coverImage ? (
        <Container className="pb-10">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800">
            <Image
              alt={post.title}
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              src={absolutizeMediaUrl(post.coverImage) ?? post.coverImage}
            />
          </div>
        </Container>
      ) : null}

      <Container className="max-w-3xl pb-16">
        <Text className="mb-8 text-sm text-neutral-500" color="muted">
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(undefined, { dateStyle: 'long' }) : null}
          {post.tags?.length ? ` · ${post.tags.join(', ')}` : ''}
        </Text>
        <CmsHtmlContent html={post.content} />
      </Container>

      {related.length > 0 ? (
        <div className="border-t border-neutral-200 bg-neutral-50 py-14 dark:border-neutral-800 dark:bg-neutral-900/30">
          <Container>
            <h2 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white">Related reading</h2>
            <div className="mt-8">
              <BlogCardGrid posts={related} />
            </div>
          </Container>
        </div>
      ) : null}
    </>
  );
}
