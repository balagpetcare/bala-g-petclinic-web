import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';

export default function CmsAdminHomePage() {
  return (
    <Container className="py-10">
      <Heading as="h1" className="mb-3" level="h2">
        Website content
      </Heading>
      <Text className="mb-8 max-w-2xl" color="muted">
        Manage published marketing content that powers the public site: articles, landing pages, hero banners, and media
        URLs. Changes apply through the clinic API; the public site refreshes on its cache schedule (typically a few
        minutes).
      </Text>
      <ul className="list-inside list-disc space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
        <li>
          <Link className="font-semibold text-primary-700 hover:underline dark:text-primary-400" href="/admin/cms/blogs">
            Blogs
          </Link>{' '}
          — articles, tags, categories, and article-level SEO fields.
        </li>
        <li>
          <Link className="font-semibold text-primary-700 hover:underline dark:text-primary-400" href="/admin/cms/pages">
            Pages
          </Link>{' '}
          — flexible landing pages with structured sections and optional HTML body.
        </li>
        <li>
          <Link className="font-semibold text-primary-700 hover:underline dark:text-primary-400" href="/admin/cms/banners">
            Banners
          </Link>{' '}
          — promotional tiles with optional scheduling and slot names (for example home hero).
        </li>
        <li>
          <Link className="font-semibold text-primary-700 hover:underline dark:text-primary-400" href="/admin/cms/media">
            Media library
          </Link>{' '}
          — register CDN-ready image URLs for reuse across content.
        </li>
      </ul>
    </Container>
  );
}
