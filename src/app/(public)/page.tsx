import type { Metadata } from 'next';
import { HomeSections } from '@/components/home';
import { generateLocalBusinessSchema } from '@/config/seo';
import { siteConfig } from '@/config';
import { JsonLdScript } from '@/lib/seo/json-ld';
import { fetchPublishedBlogs } from '@/services/cms-public';
import type { BlogPreviewItem } from '@/data/homepage';

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
};

export default async function HomePage() {
  let blogPreviewPosts: BlogPreviewItem[] | null = null;
  try {
    const blogsRes = await fetchPublishedBlogs({ page: 1, limit: 3 });
    if (blogsRes.success && Array.isArray(blogsRes.data) && blogsRes.data.length > 0) {
      blogPreviewPosts = blogsRes.data.map((p) => ({
        title: p.title,
        excerpt: p.excerpt ?? '',
        href: `/blog/${encodeURIComponent(p.slug)}`,
        category: p.category?.name ?? 'Article',
        publishedAt: p.publishedAt ?? p.createdAt,
      }));
    }
  } catch {
    blogPreviewPosts = null;
  }

  return (
    <>
      <JsonLdScript data={generateLocalBusinessSchema()} />
      <HomeSections blogPreviewPosts={blogPreviewPosts} />
    </>
  );
}