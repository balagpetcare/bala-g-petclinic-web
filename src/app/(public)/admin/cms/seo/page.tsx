import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import Link from 'next/link';

export default function CmsSeoGuidePage() {
  return (
    <Container className="max-w-3xl space-y-6 py-10">
      <Heading as="h1" level="h2">
        SEO on this site
      </Heading>
      <Text color="muted">
        Search metadata is generated per route using Next.js <code className="rounded bg-neutral-100 px-1 text-xs dark:bg-neutral-800">generateMetadata</code>{' '}
        plus shared helpers in <code className="rounded bg-neutral-100 px-1 text-xs dark:bg-neutral-800">src/config/seo.ts</code>. CMS-backed routes merge your editorial fields
        (title, description, canonical path, Open Graph image, and noindex) with sensible defaults from clinic configuration.
      </Text>
      <ul className="list-inside list-disc space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
        <li>
          <strong>Blog posts:</strong> tune SEO on the{' '}
          <Link className="text-primary-700 hover:underline dark:text-primary-400" href="/admin/cms/blogs">
            Blogs
          </Link>{' '}
          screen. Article pages emit <code className="text-xs">BlogPosting</code> JSON-LD.
        </li>
        <li>
          <strong>Landing pages:</strong> use{' '}
          <Link className="text-primary-700 hover:underline dark:text-primary-400" href="/admin/cms/pages">
            Pages
          </Link>{' '}
          for <code className="text-xs">WebPage</code> metadata and structured data.
        </li>
        <li>
          <strong>Clinic and local SEO:</strong> the homepage includes <code className="text-xs">VeterinaryCare</code> JSON-LD from shared clinic configuration.
        </li>
        <li>
          <strong>Discovery files:</strong> programmatic <code className="text-xs">robots.txt</code> and <code className="text-xs">sitemap.xml</code> live under{' '}
          <code className="text-xs">src/app</code> and combine static routes with published CMS URLs.
        </li>
      </ul>
    </Container>
  );
}
