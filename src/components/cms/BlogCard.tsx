import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { formatDate } from '@/lib/utils';
import type { BlogPostPublic } from '@/types/cms-public';

export function BlogCard({ post }: { post: BlogPostPublic }) {
  const href = `/blog/${encodeURIComponent(post.slug)}`;
  const cat = post.category?.name ?? 'Article';

  return (
    <article className="rounded-[1.5rem] border border-neutral-100 bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg dark:border-neutral-800 dark:bg-neutral-900">
      <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700 dark:bg-primary-950 dark:text-primary-300">
        {cat}
      </span>
      <Heading as="h3" className="mt-5 leading-snug" level="h4">
        <Link className="text-neutral-950 hover:text-primary-600 dark:text-white dark:hover:text-primary-400" href={href}>
          {post.title}
        </Link>
      </Heading>
      {post.excerpt ? (
        <Text className="mt-3 text-sm leading-6" color="muted">
          {post.excerpt}
        </Text>
      ) : null}
      <div className="mt-6 flex items-center justify-between gap-4 border-t border-neutral-100 pt-4 text-sm dark:border-neutral-800">
        {post.publishedAt ? (
          <time className="inline-flex items-center gap-2 text-neutral-500" dateTime={post.publishedAt}>
            <CalendarDays aria-hidden="true" className="h-4 w-4" />
            {formatDate(post.publishedAt)}
          </time>
        ) : (
          <span className="text-neutral-500">Draft date pending</span>
        )}
        <Link className="font-semibold text-primary-700 hover:text-primary-800 dark:text-primary-400" href={href}>
          Read
        </Link>
      </div>
    </article>
  );
}

export function BlogCardGrid({ posts }: { posts: BlogPostPublic[] }) {
  return (
    <Container className="py-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </Container>
  );
}
