import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { sanitizeCmsHtml } from '@/lib/seo/sanitize-cms-html';

export function CmsHtmlContent({ html }: { html: string }) {
  const safe = sanitizeCmsHtml(html);
  return (
    <div
      className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-heading prose-a:text-primary-600"
      // eslint-disable-next-line react/no-danger -- sanitized CMS HTML
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}

export function CmsHtmlSection({ className, html }: { className?: string; html: string }) {
  return (
    <section className={className}>
      <Container>
        <CmsHtmlContent html={html} />
      </Container>
    </section>
  );
}

export function CmsHeroSection({
  title,
  subtitle,
  imageUrl,
  imageAlt,
}: {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
}) {
  return (
    <section className="border-b border-neutral-200 bg-primary-50/40 py-14 dark:border-neutral-800 dark:bg-primary-950/20">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Heading as="h1" className="mb-3" level="h2">
            {title}
          </Heading>
          {subtitle ? (
            <Text className="text-lg text-neutral-600 dark:text-neutral-300" color="muted">
              {subtitle}
            </Text>
          ) : null}
        </div>
        {imageUrl ? (
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft dark:border-neutral-800 dark:bg-neutral-900">
            {/* eslint-disable-next-line @next/next/no-img-element -- CMS URLs may be external */}
            <img alt={imageAlt ?? ''} className="h-64 w-full object-cover" height={400} src={imageUrl} width={800} />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
