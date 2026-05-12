import Link from 'next/link';
import { PageHeader } from '@/components/shared';
import { BlogCardGrid } from '@/components/cms';
import { Container } from '@/components/ui/Container';
import { Text } from '@/components/ui/Text';
import { fetchBlogCategories, fetchPublishedBlogs } from '@/services/cms-public';
interface BlogIndexProps {
  searchParams: Record<string, string | string[] | undefined>;
}

function first(param: string | string[] | undefined): string | undefined {
  if (Array.isArray(param)) return param[0];
  return param;
}

export default async function BlogIndexPage({ searchParams }: BlogIndexProps) {
  const page = Number(first(searchParams['page'])) || 1;
  const q = first(searchParams['q']);
  const categorySlug = first(searchParams['categorySlug']);
  const tag = first(searchParams['tag']);

  const [blogsRes, catRes] = await Promise.all([
    fetchPublishedBlogs({ page, limit: 9, q, categorySlug, tag }),
    fetchBlogCategories(),
  ]);

  const posts = blogsRes.success && Array.isArray(blogsRes.data) ? blogsRes.data : [];
  const pagination = blogsRes.meta?.pagination;
  const categories = catRes.success && Array.isArray(catRes.data) ? catRes.data : [];

  const base = '/blog';
  const buildQuery = (overrides: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    const merged = { page, q, categorySlug, tag, ...overrides };
    if (merged.page && merged.page > 1) p.set('page', String(merged.page));
    if (merged.q) p.set('q', String(merged.q));
    if (merged.categorySlug) p.set('categorySlug', String(merged.categorySlug));
    if (merged.tag) p.set('tag', String(merged.tag));
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  };

  return (
    <>
      <PageHeader
        description="Evidence-informed articles for calmer visits, better nutrition, and stronger pet–parent partnerships."
        eyebrow="Learning hub"
        title="Clinic blog"
      />

      <section className="border-b border-neutral-200 bg-neutral-50 py-8 dark:border-neutral-800 dark:bg-neutral-900/40">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <form action={base} className="flex w-full max-w-xl flex-col gap-2 sm:flex-row" method="get">
              <label className="sr-only" htmlFor="blog-search">
                Search articles
              </label>
              <input
                className="h-11 flex-1 rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                defaultValue={q ?? ''}
                id="blog-search"
                name="q"
                placeholder="Search by title or topic"
                type="search"
              />
              {categorySlug ? <input name="categorySlug" type="hidden" value={categorySlug} /> : null}
              {tag ? <input name="tag" type="hidden" value={tag} /> : null}
              <button
                className="h-11 rounded-lg bg-primary-600 px-4 text-sm font-semibold text-white hover:bg-primary-700"
                type="submit"
              >
                Search
              </button>
            </form>
            <Link className="text-sm font-semibold text-primary-700 hover:underline dark:text-primary-400" href={base}>
              Clear filters
            </Link>
          </div>
          {categories.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((c: { slug: string; name: string }) => (
                <Link
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    categorySlug === c.slug
                      ? 'border-primary-600 bg-primary-600 text-white'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-400 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200'
                  }`}
                  href={buildQuery({ categorySlug: c.slug, page: 1, tag: undefined })}
                  key={c.slug}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          ) : null}
        </Container>
      </section>

      {posts.length === 0 ? (
        <Container className="py-16">
          <Text color="muted">No articles match your filters yet. Try clearing search or pick another category.</Text>
        </Container>
      ) : (
        <BlogCardGrid posts={posts} />
      )}

      {pagination && pagination.totalPages > 1 ? (
        <Container className="flex justify-center gap-4 pb-16">
          {pagination.hasPrev ? (
            <Link
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
              href={buildQuery({ page: page - 1 })}
            >
              Previous
            </Link>
          ) : null}
          {pagination.hasNext ? (
            <Link
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
              href={buildQuery({ page: page + 1 })}
            >
              Next
            </Link>
          ) : null}
          <span className="self-center text-sm text-neutral-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
        </Container>
      ) : null}
    </>
  );
}
