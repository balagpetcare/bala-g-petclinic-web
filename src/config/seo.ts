import type { Metadata, Viewport } from 'next';
import type { PageSEO } from '@/types';
import { siteConfig, contactInfo } from './site';
import { localSeoEntity } from './seo-entity';
import { absoluteSiteUrl } from '@/lib/seo/absolute-url';
export { generateLocalBusinessSchema, buildRootJsonLdGraph } from '@/lib/seo/schemas';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#171717' },
  ],
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    ...localSeoEntity.primaryKeywords,
    'pet clinic',
    'veterinary',
    'animal hospital',
    'pet shop',
    'pet care',
    'dog',
    'cat',
    'pet grooming',
    'pet vaccination',
    'emergency vet',
    contactInfo.city,
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: siteConfig.url,
  },
  verification: process.env['NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION']
    ? { google: process.env['NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION'] }
    : undefined,
};

export function generatePageMetadata(seo: PageSEO): Metadata {
  const title = seo.title;
  const description = seo.description;
  const image = seo.image || siteConfig.ogImage;
  const absImage = /^https?:\/\//i.test(image) ? image : absoluteSiteUrl(image);
  const canonical = seo.canonical ?? (seo.path ? absoluteSiteUrl(seo.path) : undefined);
  const ogType = seo.openGraphType ?? 'website';

  return {
    title,
    description,
    keywords: seo.keywords,
    openGraph: {
      type: ogType,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      title,
      description,
      images: [
        {
          url: absImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absImage],
    },
    robots: seo.noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    alternates: canonical ? { canonical } : undefined,
  };
}
