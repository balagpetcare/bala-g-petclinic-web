import type { FaqItem } from '@/types';
import type { LocalBusinessSchema } from '@/types/seo';
import { siteConfig, contactInfo, socialLinks } from '@/config/site';
import { localSeoEntity } from '@/config/seo-entity';
import { absoluteSiteUrl } from '@/lib/seo/absolute-url';
import { toBangladeshInternationalTel } from '@/lib/utils';

const SCHEMA_CONTEXT = 'https://schema.org';

function siteBase(): string {
  return siteConfig.url.replace(/\/$/, '');
}

function postalAddress(): Record<string, unknown> {
  return {
    '@type': 'PostalAddress',
    streetAddress: contactInfo.address,
    addressLocality: contactInfo.city,
    addressRegion: contactInfo.state.trim() || contactInfo.city,
    postalCode: contactInfo.pincode,
    addressCountry: contactInfo.country,
  };
}

function sameAsUrls(): string[] {
  const fromSocial = socialLinks.map((s) => s.url);
  return Array.from(
    new Set([localSeoEntity.googleMapsShareUrl, localSeoEntity.googleReviewUrl, ...fromSocial])
  );
}

/** Sitewide @graph: Organization, WebSite, VeterinaryCare (local + emergency + 24h signals). */
export function buildRootJsonLdGraph(): Record<string, unknown> {
  const base = siteBase();
  const orgId = `${base}/#organization`;
  const websiteId = `${base}/#website`;
  const vetId = `${base}/#veterinary`;

  const organization: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': orgId,
    name: siteConfig.name,
    url: base,
    logo: absoluteSiteUrl(siteConfig.ogImage),
    description: siteConfig.description,
    email: contactInfo.email,
    telephone: toBangladeshInternationalTel(contactInfo.phone),
    address: postalAddress(),
    sameAs: sameAsUrls(),
  };

  const website: Record<string, unknown> = {
    '@type': 'WebSite',
    '@id': websiteId,
    url: base,
    name: siteConfig.name,
    inLanguage: siteConfig.locale,
    publisher: { '@id': orgId },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${base}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const veterinary: Record<string, unknown> = {
    '@type': ['VeterinaryCare', 'LocalBusiness', 'MedicalClinic'],
    '@id': vetId,
    name: siteConfig.name,
    url: base,
    image: [absoluteSiteUrl('/images/clinic.jpg'), absoluteSiteUrl(siteConfig.ogImage)],
    telephone: toBangladeshInternationalTel(contactInfo.phone),
    email: contactInfo.email,
    priceRange: '$$',
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: localSeoEntity.latitude,
      longitude: localSeoEntity.longitude,
    },
    hasMap: localSeoEntity.googleMapsShareUrl,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: localSeoEntity.aggregateRating.ratingValue,
      reviewCount: localSeoEntity.aggregateRating.reviewCount,
      bestRating: localSeoEntity.aggregateRating.bestRating,
      worstRating: localSeoEntity.aggregateRating.worstRating,
    },
    /** 24-hour emergency-capable clinic (matches business positioning). */
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    medicalSpecialty: ['EmergencyMedicine', 'Veterinary'],
    availableService: [
      {
        '@type': 'MedicalProcedure',
        name: 'Emergency veterinary care',
        description: '24-hour emergency veterinary assessment and stabilization.',
      },
    ],
    parentOrganization: { '@id': orgId },
  };

  return {
    '@context': SCHEMA_CONTEXT,
    '@graph': [organization, website, veterinary],
  };
}

/** BreadcrumbList for a path chain (each segment after home). */
export function buildBreadcrumbJsonLd(
  segments: { name: string; path: string }[]
): Record<string, unknown> {
  const base = siteBase();
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: base,
    },
    ...segments.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 2,
      name: s.name,
      item: absoluteSiteUrl(s.path),
    })),
  ];

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

export function buildFaqPageJsonLd(items: FaqItem[]): Record<string, unknown> {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

export function buildEmergencyServiceJsonLd(): Record<string, unknown> {
  const base = siteBase();
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'EmergencyService',
    name: `${siteConfig.name} — Emergency line`,
    url: absoluteSiteUrl('/emergency'),
    provider: { '@id': `${base}/#veterinary` },
    areaServed: {
      '@type': 'City',
      name: contactInfo.city,
      containedInPlace: {
        '@type': 'Country',
        name: contactInfo.country,
      },
    },
  };
}

export function buildServiceJsonLd(input: {
  name: string;
  description: string;
  path: string;
}): Record<string, unknown> {
  const base = siteBase();
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: absoluteSiteUrl(input.path),
    provider: { '@id': `${base}/#organization` },
    areaServed: contactInfo.city,
    serviceType: localSeoEntity.primaryCategory,
  };
}

export function buildProductJsonLd(input: {
  name: string;
  description: string;
  path: string;
  image?: string | null;
  sku?: string;
}): Record<string, unknown> {
  const base = siteBase();
  const images = input.image ? [absolutizeOptional(input.image)] : undefined;
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Product',
    name: input.name,
    description: input.description,
    sku: input.sku,
    image: images,
    url: absoluteSiteUrl(input.path),
    brand: { '@type': 'Brand', name: siteConfig.name },
    offers: {
      '@type': 'Offer',
      url: absoluteSiteUrl(input.path),
      availability: 'https://schema.org/InStock',
      seller: { '@id': `${base}/#organization` },
    },
  };
}

function absolutizeOptional(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return absoluteSiteUrl(url);
}

/**
 * Legacy helper used by early pages; returns a single VeterinaryCare node (subset of root graph).
 * Prefer `buildRootJsonLdGraph()` in the root layout for production parity.
 */
export function generateLocalBusinessSchema(): LocalBusinessSchema {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'VeterinaryCare',
    name: siteConfig.name,
    image: [absoluteSiteUrl('/images/clinic.jpg')],
    telephone: toBangladeshInternationalTel(contactInfo.phone),
    email: contactInfo.email,
    address: postalAddress() as LocalBusinessSchema['address'],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: localSeoEntity.latitude,
      longitude: localSeoEntity.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
    ],
    priceRange: '$$',
  };
}
