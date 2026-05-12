import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config';

export default function robots(): MetadataRoute.Robots {
  const host = siteConfig.url.replace(/\/$/, '');
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/account',
        '/admin',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/cart',
        '/checkout',
        '/wishlist',
        '/system/',
      ],
    },
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
