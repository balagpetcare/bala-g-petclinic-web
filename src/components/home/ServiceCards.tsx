'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container, Heading, Text } from '@/components/ui';
import { MotionReveal, MotionStagger, staggerItem } from '@/components/motion';
import { motion } from 'framer-motion';
import type { ServiceCardData } from '@/data/homepage';

interface ServiceCardsProps {
  services: ServiceCardData[];
}

export function ServiceCards({ services }: ServiceCardsProps) {
  return (
    <section className="bg-white py-16 dark:bg-neutral-950 sm:py-20 lg:py-24">
      <Container>
        <MotionReveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">
            Clinic services
          </span>
          <Heading className="mt-3" level="h2">
            Reusable care pathways for every pet parent
          </Heading>
          <Text className="mt-4" color="muted">
            The template&apos;s promotional card rhythm is preserved and adapted for
            clinic-first service discovery.
          </Text>
        </MotionReveal>

        <MotionStagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                className="group rounded-[1.5rem] border border-neutral-100 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-soft-lg dark:border-neutral-800 dark:bg-neutral-900"
                variants={staggerItem}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white dark:bg-primary-950 dark:text-primary-300">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-neutral-950 dark:text-white">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  {service.description}
                </p>
                <Link
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800 dark:text-primary-400"
                  href={service.href}
                >
                  View service
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </motion.article>
            );
          })}
        </MotionStagger>
      </Container>
    </section>
  );
}
