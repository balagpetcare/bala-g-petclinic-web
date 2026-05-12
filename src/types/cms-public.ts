export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type CmsContentFormat = 'HTML' | 'MARKDOWN';

export interface BlogCategoryPublic {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface BlogPostPublic {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  author: string;
  tags: string[];
  status: ContentStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  categoryId: string | null;
  category: BlogCategoryPublic | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
  canonicalPath: string | null;
  noIndex: boolean;
  contentFormat: CmsContentFormat;
}

export interface CmsPagePublic {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: ContentStatus;
  sortOrder: number;
  publishedAt: string | null;
  sections: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
  canonicalPath: string | null;
  noIndex: boolean;
  contentFormat: CmsContentFormat;
}

export interface BannerPublic {
  id: string;
  title: string;
  image: string;
  link: string | null;
  description: string | null;
  status: ContentStatus;
  sortOrder: number;
  slot: string | null;
  startsAt: string | null;
  endsAt: string | null;
}

export interface BlogPageSummary {
  slug: string;
  updatedAt: string;
}
