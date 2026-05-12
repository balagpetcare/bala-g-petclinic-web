import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { generatePageMetadata } from '@/config/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Frequently Asked Questions',
  description:
    'Find answers to common questions about our veterinary services, appointments, emergency care, grooming, and pet shop.',
  keywords: ['FAQ', 'questions', 'pet clinic', 'veterinary help'],
});

export default function FaqsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
