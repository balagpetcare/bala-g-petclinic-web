'use client';

import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { Container, Heading, Text } from '@/components/ui';
import { MotionReveal, MotionStagger, staggerItem } from '@/components/motion';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { BlogPreviewItem } from '@/data/homepage';

interface BlogPreviewProps {
  posts: BlogPreviewItem[];
}

export function BlogPreview({ posts }: BlogPreviewProps) {
  return (
    <section className="bg-white py-16 dark:bg-neutral-950 sm:py-20 lg:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <MotionReveal>
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">
              Blog preview
            </span>
            <Heading className="mt-3" level="h2">
              Helpful guidance for everyday pet care
            </Heading>
            <Text className="mt-4 max-w-2xl" color="muted">
              Structured article cards preserve SEO-friendly content surfaces
              for future CMS publishing.
            </Text>
          </MotionReveal>
          <Link
            className="inline-flex items-center gap-2 font-semibold text-primary-700 hover:text-primary-800 dark:text-primary-400"
            href="/blog"
          >
            Read all articles
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <MotionStagger className="mt-12 grid gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <motion.article
              key={post.href}
              className="rounded-[1.5rem] border border-neutral-100 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg dark:border-neutral-800 dark:bg-neutral-900"
              variants={staggerItem}
            >
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700 dark:bg-primary-950 dark:text-primary-300">
                {post.category}
              </span>
              <h3 className="mt-5 font-heading text-xl font-semibold leading-snug text-neutral-950 dark:text-white">
                <Link href={post.href}>{post.title}</Link>
              </h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                {post.excerpt}
              </p>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-neutral-100 pt-4 text-sm dark:border-neutral-800">
                <time
                  className="inline-flex items-center gap-2 text-neutral-500"
                  dateTime={post.publishedAt}
                >
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  {formatDate(post.publishedAt)}
                </time>
                <Link
                  className="font-semibold text-primary-700 hover:text-primary-800 dark:text-primary-400"
                  href={post.href}
                >
                  Read
                </Link>
              </div>
            </motion.article>
          ))}
        </MotionStagger>
      </Container>
    </section>
  );
}
