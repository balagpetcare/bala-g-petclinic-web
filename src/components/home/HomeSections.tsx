'use client';

import type { BlogPreviewItem } from '@/data/homepage';
import {
  blogPreviews,
  clinicHighlights,
  doctorShowcase,
  heroSlides,
  productHighlights,
  serviceCards,
  testimonials,
  trustFeatures,
} from '@/data/homepage';
import { ClinicHighlights } from './ClinicHighlights';
import { HomeHero } from './HomeHero';
import { ServiceCards } from './ServiceCards';
import { EmergencyCta } from './EmergencyCta';
import { DoctorShowcase } from './DoctorShowcase';
import { PetShopHighlights } from './PetShopHighlights';
import { Testimonials } from './Testimonials';
import { BlogPreview } from './BlogPreview';
import { Newsletter } from './Newsletter';
import { TrustFeatureStrip } from './TrustFeatureStrip';

interface HomeSectionsProps {
  /** When the CMS returns published posts, prefer them over static preview cards. */
  blogPreviewPosts?: BlogPreviewItem[] | null;
}

export function HomeSections({ blogPreviewPosts }: HomeSectionsProps) {
  const previewPosts =
    blogPreviewPosts && blogPreviewPosts.length > 0 ? blogPreviewPosts : blogPreviews;

  return (
    <>
      <HomeHero slides={heroSlides} />
      <ClinicHighlights highlights={clinicHighlights} />
      <ServiceCards services={serviceCards} />
      <EmergencyCta />
      <DoctorShowcase doctors={doctorShowcase} />
      <PetShopHighlights products={productHighlights} />
      <TrustFeatureStrip features={trustFeatures} />
      <Testimonials testimonials={testimonials} />
      <BlogPreview posts={previewPosts} />
      <Newsletter />
    </>
  );
}
