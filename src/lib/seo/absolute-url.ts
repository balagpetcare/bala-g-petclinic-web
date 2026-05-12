import { siteConfig } from '@/config';

/** Absolute URL for a path on this site (uses `siteConfig.url`). */
export function absoluteSiteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, '');
  if (!path || path === '/') {
    return base;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** Resolve CMS-stored relative paths to absolute URLs for metadata and images. */
export function absolutizeMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return absoluteSiteUrl(url);
}
