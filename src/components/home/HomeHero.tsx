'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Phone } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui';
import { emergencyContact } from '@/config';
import type { HomeHeroSlide } from '@/data/homepage';
import { cn } from '@/lib/utils';
import { ImageFrame } from './ImageFrame';

interface HomeHeroProps {
  slides: HomeHeroSlide[];
}

export function HomeHero({ slides }: HomeHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const activeSlide = slides[activeIndex] ?? slides[0];

  useEffect(() => {
    if (shouldReduceMotion || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [shouldReduceMotion, slides.length]);

  const goToSlide = (direction: 'previous' | 'next') => {
    setActiveIndex((current) => {
      if (direction === 'previous') {
        return current === 0 ? slides.length - 1 : current - 1;
      }
      return (current + 1) % slides.length;
    });
  };

  if (!activeSlide) return null;

  return (
    <section className="relative overflow-hidden bg-[#f8f3eb] py-12 dark:bg-neutral-950 sm:py-16 lg:py-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(234,179,8,0.16),transparent_30%)]" />
      <Container className="relative">
        <div className="grid min-h-[620px] items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
              exit={{ opacity: 0, y: -18 }}
              initial={{ opacity: 0, y: 18 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary-700 shadow-soft dark:bg-neutral-900 dark:text-primary-300">
                {activeSlide.eyebrow}
              </span>
              <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight tracking-tight text-neutral-950 dark:text-white sm:text-5xl lg:text-7xl">
                {activeSlide.title}{' '}
                <span className="text-primary-600 dark:text-primary-400">
                  {activeSlide.highlightedTitle}
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-neutral-700 dark:text-neutral-300 sm:text-lg">
                {activeSlide.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 text-base font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  href={activeSlide.primaryAction.href}
                >
                  {activeSlide.primaryAction.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  className="inline-flex h-11 items-center justify-center rounded-lg border-2 border-primary-600 px-6 text-base font-medium text-primary-700 transition-colors hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:text-primary-300 dark:hover:bg-primary-950"
                  href={activeSlide.secondaryAction.href}
                >
                  {activeSlide.secondaryAction.label}
                </Link>
              </div>
              <div className="mt-8 flex flex-col gap-3 border-t border-neutral-200 pt-6 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400 sm:flex-row sm:items-center">
                <a
                  className="inline-flex items-center gap-2 font-semibold text-primary-700 transition-colors hover:text-primary-800 dark:text-primary-400"
                  href={`tel:${emergencyContact.phone}`}
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {emergencyContact.label}: {emergencyContact.phone}
                </a>
                <span>{emergencyContact.available} emergency care support</span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`visual-${activeIndex}`}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <ImageFrame
                  priority
                  alt={activeSlide.image.alt}
                  className="aspect-[4/3] lg:aspect-[5/6]"
                  label="Clinic + Pet Shop"
                  src={activeSlide.image.src}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="relative -mt-4 flex items-center justify-between gap-4 pb-8 lg:-mt-20">
          <div className="flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                className={cn(
                  'h-2.5 rounded-full transition-all',
                  index === activeIndex
                    ? 'w-8 bg-primary-600'
                    : 'w-2.5 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700'
                )}
                aria-label={`Show slide ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <div className="hidden gap-3 sm:flex">
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-700 shadow-soft transition-colors hover:bg-primary-600 hover:text-white dark:bg-neutral-900 dark:text-neutral-200"
              aria-label="Previous hero slide"
              onClick={() => goToSlide('previous')}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-700 shadow-soft transition-colors hover:bg-primary-600 hover:text-white dark:bg-neutral-900 dark:text-neutral-200"
              aria-label="Next hero slide"
              onClick={() => goToSlide('next')}
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
