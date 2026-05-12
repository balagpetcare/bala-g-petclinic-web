'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingBag, Star } from 'lucide-react';
import { Container, Heading, Text } from '@/components/ui';
import { MotionReveal, MotionStagger, staggerItem } from '@/components/motion';
import { motion } from 'framer-motion';
import type { ProductHighlight } from '@/data/homepage';
import { ImageFrame } from './ImageFrame';

interface PetShopHighlightsProps {
  products: ProductHighlight[];
}

export function PetShopHighlights({ products }: PetShopHighlightsProps) {
  return (
    <section className="bg-white py-16 dark:bg-neutral-950 sm:py-20 lg:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <MotionReveal>
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">
              Pet shop highlights
            </span>
            <Heading className="mt-3" level="h2">
              Product discovery with clinic-backed context
            </Heading>
            <Text className="mt-4 max-w-2xl" color="muted">
              The original ecommerce product rhythm is preserved as reusable
              shop cards ready for catalog and inventory APIs.
            </Text>
          </MotionReveal>
          <Link
            className="inline-flex items-center gap-2 font-semibold text-primary-700 hover:text-primary-800 dark:text-primary-400"
            href="/shop"
          >
            Visit shop
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <MotionStagger className="mt-12 grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <motion.article
              key={product.name}
              className="group overflow-hidden rounded-[1.75rem] border border-neutral-100 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg dark:border-neutral-800 dark:bg-neutral-900"
              variants={staggerItem}
            >
              <ImageFrame
                alt={product.image.alt}
                className="aspect-[5/4] rounded-none shadow-none ring-0"
                label={product.category}
                src={product.image.src}
              />
              <div className="p-6">
                <div className="flex items-center gap-1 text-secondary-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <h3 className="mt-3 font-heading text-xl font-semibold text-neutral-950 dark:text-white">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {product.priceLabel}
                </p>
                <Link
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-600 dark:bg-white dark:text-neutral-950 dark:hover:bg-primary-400"
                  href={product.href}
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  Browse category
                </Link>
              </div>
            </motion.article>
          ))}
        </MotionStagger>
      </Container>
    </section>
  );
}
