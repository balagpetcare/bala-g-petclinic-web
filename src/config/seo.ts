import type { Metadata, Viewport } from 'next';
import type { PageSEO, LocalBusinessSchema } from '@/types';
import { siteConfig, contactInfo } from './site';

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
};

export function generatePageMetadata(seo: PageSEO): Metadata {
  const title = seo.title;
  const description = seo.description;
  const image = seo.image || siteConfig.ogImage;

  return {
    title,
    description,
    keywords: seo.keywords,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      title,
      description,
      images: [image],
    },
    robots: seo.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: seo.canonical
      ? { canonical: seo.canonical }
      : undefined,
  };
}

export function generateLocalBusinessSchema(): LocalBusinessSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'VeterinaryCare',
    name: siteConfig.name,
    image: [`${siteConfig.url}/images/clinic.jpg`],
    telephone: contactInfo.phone,
    email: contactInfo.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contactInfo.address,
      addressLocality: contactInfo.city,
      addressRegion: contactInfo.state,
      postalCode: contactInfo.pincode,
      addressCountry: contactInfo.country,
    },
    priceRange: '$$',
  };
}
