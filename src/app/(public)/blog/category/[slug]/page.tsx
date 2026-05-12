import { redirect } from 'next/navigation';

interface Props {
  params: { slug: string };
}

/** Category landing uses the main blog index with filters (SEO-friendly query, one implementation). */
export default function BlogCategoryAliasPage({ params }: Props) {
  redirect(`/blog?categorySlug=${encodeURIComponent(params.slug)}`);
}
