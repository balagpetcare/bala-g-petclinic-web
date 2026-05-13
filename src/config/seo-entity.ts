/**
 * Centralized facts for Local SEO, JSON-LD, and metadata (single source of truth).
 * Phone numbers remain in `site.ts`; use `toBangladeshInternationalTel` for schema/tel.
 */
export const localSeoEntity = {
  businessTypeLabel: 'Emergency Veterinary Clinic',
  primaryCategory: 'Emergency veterinarian service',
  googleMapsShareUrl: 'https://maps.app.goo.gl/VMhhLjYGgJyJJ8r58',
  googleReviewUrl: 'https://g.page/r/CSOESUSEbawsEBM/review',
  latitude: 23.7637192,
  longitude: 90.4209242,
  aggregateRating: {
    ratingValue: 4.1,
    reviewCount: 247,
    bestRating: 5,
    worstRating: 1,
  },
  /** High-intent phrases used in default site metadata and key landing pages. */
  primaryKeywords: [
    'Pet Clinic in Dhaka',
    'Veterinary Doctor Dhaka',
    'Emergency Vet Dhaka',
    'Animal Hospital Dhaka',
    'Pet Vaccination Bangladesh',
    'Cat Doctor Dhaka',
    'Dog Doctor Dhaka',
  ] as const,
  /** Lightweight embed (no API key). Pair with `googleMapsShareUrl` for “open in Maps”. */
  mapsEmbedUrl:
    'https://maps.google.com/maps?q=23.7637192,90.4209242&hl=en&z=15&output=embed',
} as const;

export type LocalSeoEntity = typeof localSeoEntity;
