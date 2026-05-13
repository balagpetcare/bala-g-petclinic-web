import type { Metadata } from 'next';
import { generatePageMetadata } from '@/config/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Pet care articles & clinic updates',
  description:
    'Practical veterinary guidance, clinic news, and pet wellness articles from Bala G Pet Clinic — written for caring pet parents.',
  keywords: ['pet blog', 'veterinary articles', 'pet wellness', 'dog care', 'cat care'],
  path: '/blog',
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
