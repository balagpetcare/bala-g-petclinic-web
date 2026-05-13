'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import { Container, Section, AccordionItem } from '@/components/ui';
import { PageHeader } from '@/components/shared';
import { faqs, getFaqCategories } from '@/data/faqs';
import { cn } from '@/lib/utils';

export function FaqsPageClient() {
  const categories = getFaqCategories();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory ? faqs.filter((f) => f.category === activeCategory) : faqs;

  return (
    <>
      <PageHeader
        description="Find answers to common questions about our clinic, services, appointments, and pet care."
        eyebrow="Help center"
        title="Frequently Asked Questions"
      />

      <Section padding="lg">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 flex flex-wrap gap-2">
              <button
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  !activeCategory
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                )}
                type="button"
                onClick={() => setActiveCategory(null)}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    activeCategory === cat
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                  )}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div>
              {filtered.map((faq) => (
                <AccordionItem key={faq.id} title={faq.question}>
                  {faq.answer}
                </AccordionItem>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="py-10 text-center text-neutral-500">No questions found for this category.</p>
            )}

            <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl bg-neutral-50 p-8 text-center dark:bg-neutral-900">
              <HelpCircle className="h-8 w-8 text-primary-600" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-neutral-950 dark:text-white">Still have questions?</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">We&apos;re happy to help. Reach out to us anytime.</p>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg bg-primary-600 px-5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                href="/contact"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
