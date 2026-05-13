import type { StructuredData } from '@/types/seo';

/** JSON-LD document, @graph wrapper, or an array of nodes (serialized as a JSON array). */
export type JsonLdScriptData =
  | StructuredData
  | StructuredData[]
  | Record<string, unknown>
  | Record<string, unknown>[];

export function JsonLdScript({ data }: { data: JsonLdScriptData }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      // eslint-disable-next-line react/no-danger -- JSON-LD requires inline script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.length === 1 ? payload[0] : payload) }}
      type="application/ld+json"
    />
  );
}
