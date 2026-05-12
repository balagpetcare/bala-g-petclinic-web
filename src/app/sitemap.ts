import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config';
import { getAllDoctorSlugs } from '@/data/doctors';
import { getAllServiceSlugs } from '@/data/services';
import { http } from '@/lib/api/http';
import type { BlogPageSummary, BlogPostPublic } from '@/types/cms-public';
import type { PublicBranchSummary } from '@/types/public-booking';

const STATIC_PATHS = [
  '/',
  '/about',
  '/contact',
  '/appointment',
  '/emergency',
  '/faqs',
  '/locations',
  '/clinic',
  '/testimonials',
  '/privacy-policy',
  '/terms-of-service',
  '/doctors',
  '/services',
  '/shop',
  '/blog',
];

function baseUrl(): string {
  return siteConfig.url.replace(/\/$/, '');
}

async function collectBranchLocationEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await http.get<PublicBranchSummary[]>('public/branches', { cache: 'no-store' });
    if (!res.success || !Array.isArray(res.data)) return [];
    return res.data.map((b) => ({
      url: `${baseUrl()}/locations/${encodeURIComponent(b.slug)}`,
      changeFrequency: 'weekly' as const,
      priority: 0.72,
    }));
  } catch {
    return [];
  }
}

async function collectPublishedBlogEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  let page = 1;
  while (page <= 30) {
    const res = await http.get<BlogPostPublic[]>('cms/public/blogs', {
      params: { page, limit: 100 },
      cache: 'no-store',
    });
    if (!res.success || !Array.isArray(res.data)) {
      break;
    }
    for (const b of res.data) {
      entries.push({
        url: `${baseUrl()}/blog/${encodeURIComponent(b.slug)}`,
        lastModified: b.updatedAt ? new Date(b.updatedAt) : undefined,
        changeFrequency: 'weekly',
        priority: 0.65,
      });
    }
    const p = res.meta?.pagination;
    if (!p?.hasNext) break;
    page += 1;
  }
  return entries;
}

async function collectPublishedPageEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  let page = 1;
  while (page <= 30) {
    const res = await http.get<BlogPageSummary[]>('cms/public/pages', {
      params: { page, limit: 100 },
      cache: 'no-store',
    });
    if (!res.success || !Array.isArray(res.data)) {
      break;
    }
    for (const row of res.data) {
      entries.push({
        url: `${baseUrl()}/pages/${encodeURIComponent(row.slug)}`,
        lastModified: row.updatedAt ? new Date(row.updatedAt) : undefined,
        changeFrequency: 'monthly',
        priority: 0.55,
      });
    }
    const p = res.meta?.pagination;
    if (!p?.hasNext) break;
    page += 1;
  }
  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = baseUrl();
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.8,
  }));

  const doctorEntries: MetadataRoute.Sitemap = getAllDoctorSlugs().map((slug) => ({
    url: `${base}/doctors/${encodeURIComponent(slug)}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const serviceEntries: MetadataRoute.Sitemap = getAllServiceSlugs().map((slug) => ({
    url: `${base}/services/${encodeURIComponent(slug)}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  let cmsBlogEntries: MetadataRoute.Sitemap = [];
  let cmsPageEntries: MetadataRoute.Sitemap = [];
  let branchEntries: MetadataRoute.Sitemap = [];
  try {
    const [blogs, pages, branches] = await Promise.all([
      collectPublishedBlogEntries(),
      collectPublishedPageEntries(),
      collectBranchLocationEntries(),
    ]);
    cmsBlogEntries = blogs;
    cmsPageEntries = pages;
    branchEntries = branches;
  } catch {
    // Build-time or API downtime: still ship static + catalog URLs.
  }

  return [
    ...staticEntries,
    ...doctorEntries,
    ...serviceEntries,
    ...branchEntries,
    ...cmsBlogEntries,
    ...cmsPageEntries,
  ];
}
