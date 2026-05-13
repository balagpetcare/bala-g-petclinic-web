import type { Metadata } from 'next';

export interface PageSEO {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  canonical?: string;
  /** When `canonical` is omitted, it is derived as `metadataBase + path`. */
  path?: string;
  openGraphType?: 'website' | 'article';
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

export interface LocalBusinessSchema extends StructuredData {
  '@type': 'VeterinaryCare' | string;
  name: string;
  image: string[];
  telephone: string;
  email: string;
  address: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification?: Array<{
    '@type': 'OpeningHoursSpecification';
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  priceRange?: string;
}

export type GenerateMetadata = (params: Record<string, string>) => Promise<Metadata> | Metadata;
