import type { Metadata } from 'next';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Container, Section, Card } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { generatePageMetadata } from '@/config/seo';
import { testimonials } from '@/data/homepage';

export const metadata: Metadata = generatePageMetadata({
  title: 'Testimonials',
  description: 'Stories from pet parents who trust Bala G Pet Clinic for routine, urgent, and long-term care.',
  keywords: ['testimonials', 'pet clinic reviews', 'veterinary care stories'],
});

export default function TestimonialsPage() {
  return (
    <>
      <PageHeader
        description="Every visit matters. Here is what families say about our team, communication, and outcomes."
        eyebrow="Pet parent voices"
        title="Testimonials"
      />
      <Section padding="lg">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((t, idx) => (
              <Card key={`${t.name}-${idx}`} className="flex h-full flex-col p-8" padding="none">
                <div aria-label={`${t.rating} out of 5 stars`} className="flex gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      aria-hidden
                      className={`h-4 w-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`}
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                  “{t.quote}”
                </blockquote>
                <footer className="mt-6 text-sm font-medium text-neutral-950 dark:text-white">
                  {t.name}
                  <span className="font-normal text-neutral-500"> — {t.pet}</span>
                </footer>
              </Card>
            ))}
          </div>
          <p className="mt-12 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Want to leave structured feedback for a doctor or branch? Visit a{' '}
            <Link className="font-medium text-primary-600 hover:underline" href="/doctors">
              doctor profile
            </Link>{' '}
            or{' '}
            <Link className="font-medium text-primary-600 hover:underline" href="/locations">
              branch page
            </Link>
            .
          </p>
        </Container>
      </Section>
    </>
  );
}
