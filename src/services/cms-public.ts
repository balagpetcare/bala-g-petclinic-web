import { http } from '@/lib/api/http';
import type { BackendApiResponse } from '@/types/api';
import type { BannerPublic, BlogPageSummary, BlogPostPublic, CmsPagePublic } from '@/types/cms-public';

const CMS_REVALIDATE = 120;

export async function fetchPublishedBlogs(params: {
  page?: number;
  limit?: number;
  q?: string;
  categorySlug?: string;
  tag?: string;
}): Promise<BackendApiResponse<BlogPostPublic[]>> {
  return http.get<BlogPostPublic[]>('cms/public/blogs', {
    params: {
      page: params.page,
      limit: params.limit,
      q: params.q,
      categorySlug: params.categorySlug,
      tag: params.tag,
    },
    next: { revalidate: CMS_REVALIDATE, tags: ['cms-blogs'] },
  });
}

export async function fetchPublishedBlogBySlug(slug: string): Promise<BackendApiResponse<BlogPostPublic>> {
  return http.get<BlogPostPublic>(`cms/public/blogs/slug/${encodeURIComponent(slug)}`, {
    next: { revalidate: CMS_REVALIDATE, tags: ['cms-blog', `cms-blog-${slug}`] },
  });
}

export async function fetchRelatedBlogs(slug: string): Promise<BackendApiResponse<BlogPostPublic[]>> {
  return http.get<BlogPostPublic[]>(`cms/public/blogs/slug/${encodeURIComponent(slug)}/related`, {
    next: { revalidate: CMS_REVALIDATE, tags: ['cms-blog', `cms-blog-${slug}`] },
  });
}

export async function fetchPublishedPageBySlug(slug: string): Promise<BackendApiResponse<CmsPagePublic>> {
  return http.get<CmsPagePublic>(`cms/public/pages/slug/${encodeURIComponent(slug)}`, {
    next: { revalidate: CMS_REVALIDATE, tags: ['cms-page', `cms-page-${slug}`] },
  });
}

export async function fetchPublishedBanners(slot?: string): Promise<BackendApiResponse<BannerPublic[]>> {
  return http.get<BannerPublic[]>('cms/public/banners', {
    params: slot ? { slot } : undefined,
    next: { revalidate: CMS_REVALIDATE, tags: ['cms-banners'] },
  });
}

export async function fetchBlogCategories(): Promise<BackendApiResponse<{ id: string; name: string; slug: string; description: string | null }[]>> {
  return http.get('cms/public/categories', {
    next: { revalidate: CMS_REVALIDATE, tags: ['cms-categories'] },
  });
}

export async function fetchPublishedPages(params: {
  page?: number;
  limit?: number;
}): Promise<BackendApiResponse<BlogPageSummary[]>> {
  return http.get<BlogPageSummary[]>('cms/public/pages', {
    params: { page: params.page, limit: params.limit },
    next: { revalidate: CMS_REVALIDATE, tags: ['cms-pages'] },
  });
}
