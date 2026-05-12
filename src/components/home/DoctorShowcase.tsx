'use client';

import { BadgeCheck } from 'lucide-react';
import { Container, Heading, Text } from '@/components/ui';
import { MotionReveal, MotionStagger, staggerItem } from '@/components/motion';
import { motion } from 'framer-motion';
import type { DoctorShowcaseItem } from '@/data/homepage';
import { ImageFrame } from './ImageFrame';

interface DoctorShowcaseProps {
  doctors: DoctorShowcaseItem[];
}

export function DoctorShowcase({ doctors }: DoctorShowcaseProps) {
  return (
    <section className="bg-[#fbf8f2] py-16 dark:bg-neutral-900 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <MotionReveal direction="right">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">
              Doctor showcase
            </span>
            <Heading className="mt-3" level="h2">
              Care teams built for clinic and ecommerce follow-through
            </Heading>
            <Text className="mt-4" color="muted">
              Profiles stay intentionally structured so the admin/CMS can later
              replace mock content without changing the frontend component API.
            </Text>
          </MotionReveal>

          <MotionStagger className="grid gap-6 md:grid-cols-3">
            {doctors.map((doctor) => (
              <motion.article
                key={doctor.name}
                className="overflow-hidden rounded-[1.5rem] bg-white shadow-soft ring-1 ring-neutral-100 dark:bg-neutral-950 dark:ring-neutral-800"
                variants={staggerItem}
              >
                <ImageFrame
                  alt={doctor.image.alt}
                  className="aspect-[4/3] rounded-none shadow-none ring-0"
                  src={doctor.image.src}
                />
                <div className="p-5">
                  <div className="flex items-start gap-2">
                    <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-primary-600" />
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-neutral-950 dark:text-white">
                        {doctor.name}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-primary-700 dark:text-primary-400">
                        {doctor.role}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                    {doctor.summary}
                  </p>
                </div>
              </motion.article>
            ))}
          </MotionStagger>
        </div>
      </Container>
    </section>
  );
}
