'use client';

import { Container } from '@/components/ui';
import { MotionStagger, staggerItem } from '@/components/motion';
import { motion } from 'framer-motion';
import type { HomeIcon } from '@/data/homepage';

interface Highlight {
  title: string;
  description: string;
  icon: HomeIcon;
}

interface ClinicHighlightsProps {
  highlights: Highlight[];
}

export function ClinicHighlights({ highlights }: ClinicHighlightsProps) {
  return (
    <section className="bg-white py-8 dark:bg-neutral-950">
      <Container>
        <MotionStagger className="grid gap-4 rounded-[1.75rem] border border-neutral-100 bg-white p-4 shadow-soft dark:border-neutral-800 dark:bg-neutral-900 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight) => {
            const Icon = highlight.icon;
            return (
              <motion.div
                key={highlight.title}
                className="flex gap-4 rounded-2xl p-4"
                variants={staggerItem}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-300">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-neutral-950 dark:text-white">
                    {highlight.title}
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-neutral-600 dark:text-neutral-400">
                    {highlight.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </MotionStagger>
      </Container>
    </section>
  );
}
