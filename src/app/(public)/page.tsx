import type { Metadata } from 'next';
import { HomeSections } from '@/components/home';
import { generatePageMetadata } from '@/config/seo';
import { localSeoEntity } from '@/config/seo-entity';
import { siteConfig } from '@/config';
import { fetchPublishedBlogs } from '@/services/cms-public';
import type { BlogPreviewItem } from '@/data/homepage';

export const metadata: Metadata = generatePageMetadata({
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: [...localSeoEntity.primaryKeywords, 'Bala G Pet Clinic', 'DIT Road pet clinic', '24 hour vet Dhaka'],
  path: '/',
});

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
      <HomeSections blogPreviewPosts={blogPreviewPosts} />
    </>
  );
}