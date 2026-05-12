import { redirect } from 'next/navigation';

interface Props {
  params: { slug: string };
}

/** Tag landing reuses the blog index search surface. */
export default function BlogTagAliasPage({ params }: Props) {
  redirect(`/blog?tag=${encodeURIComponent(params.slug)}`);
}
