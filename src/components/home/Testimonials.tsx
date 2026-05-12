'use client';

import { Quote, Star } from 'lucide-react';
import { Container, Heading, Text } from '@/components/ui';
import { MotionReveal, MotionStagger, staggerItem } from '@/components/motion';
import { motion } from 'framer-motion';
import type { TestimonialItem } from '@/data/homepage';

interface TestimonialsProps {
  testimonials: TestimonialItem[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="bg-[#f8f3eb] py-16 dark:bg-neutral-900 sm:py-20 lg:py-24">
      <Container>
        <MotionReveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">
            Testimonials
          </span>
          <Heading className="mt-3" level="h2">
            Pet-parent trust signals
          </Heading>
          <Text className="mt-4" color="muted">
            Short, scannable reviews support credibility without locking the
            frontend to a specific review provider.
          </Text>
        </MotionReveal>

        <MotionStagger className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <motion.figure
              key={`${testimonial.name}-${testimonial.pet}`}
              className="rounded-[1.5rem] bg-white p-6 shadow-soft ring-1 ring-neutral-100 dark:bg-neutral-950 dark:ring-neutral-800"
              variants={staggerItem}
            >
              <Quote className="h-8 w-8 text-primary-500" aria-hidden="true" />
              <div className="mt-4 flex gap-1 text-secondary-500">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-7 text-neutral-700 dark:text-neutral-300">
                &quot;{testimonial.quote}&quot;
              </blockquote>
              <figcaption className="mt-5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                <p className="font-semibold text-neutral-950 dark:text-white">
                  {testimonial.name}
                </p>
                <p className="text-sm text-neutral-500">{testimonial.pet}</p>
              </figcaption>
            </motion.figure>
          ))}
        </MotionStagger>
      </Container>
    </section>
  );
}
