import type { Metadata } from 'next';
import { generatePageMetadata } from '@/config/seo';
import { localSeoEntity } from '@/config/seo-entity';
import { faqs } from '@/data/faqs';
import { JsonLdScript } from '@/lib/seo/json-ld';
import { buildFaqPageJsonLd } from '@/lib/seo/schemas';
import { FaqsPageClient } from './FaqsPageClient';

export const metadata: Metadata = generatePageMetadata({
  title: 'FAQs',
  description:
    'Answers about emergency vet care in Dhaka, appointments, vaccinations, grooming, payments, and visiting Bala G Pet Clinic on DIT Road.',
  keywords: ['pet clinic FAQ', 'veterinary questions Dhaka', 'emergency vet FAQ', ...localSeoEntity.primaryKeywords],
  path: '/faqs',
});

export default function FaqsPage() {
  return (
    <>
      <JsonLdScript data={buildFaqPageJsonLd(faqs)} />
      <FaqsPageClient />
    </>
  );
}
