import type { StructuredData } from '@/types/seo';

export function JsonLdScript({ data }: { data: StructuredData | StructuredData[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      // eslint-disable-next-line react/no-danger -- JSON-LD requires inline script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.length === 1 ? payload[0] : payload) }}
      type="application/ld+json"
    />
  );
}
