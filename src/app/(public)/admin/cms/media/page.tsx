'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, Container, Heading, Input, Text, TextArea } from '@/components/ui';
import { adminCreateMedia, adminDeleteMedia, adminListMedia } from '@/services/cms-admin';

function pickString(v: unknown): string {
  return typeof v === 'string' ? v : v == null ? '' : String(v);
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v && typeof v === 'object');
}

export default function CmsMediaAdminPage() {
  const [rows, setRows] = useState<unknown[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [title, setTitle] = useState('');

  const load = useCallback(async () => {
    setBusy(true);
    const res = await adminListMedia({ page: 1, limit: 100 });
    setBusy(false);
    if (res.success && Array.isArray(res.data)) {
      setRows(res.data);
    } else {
      setMessage(res.error?.message ?? 'Could not load media.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await adminCreateMedia({
      url: url.trim(),
      altText: altText.trim() || undefined,
      title: title.trim() || undefined,
    });
    setBusy(false);
    if (!res.success) {
      setMessage(res.error?.message ?? 'Create failed.');
      return;
    }
    setMessage('Media asset registered.');
    setUrl('');
    setAltText('');
    setTitle('');
    await load();
  }

  async function onDelete(id: string) {
    if (!window.confirm('Remove this media record?')) return;
    setBusy(true);
    const res = await adminDeleteMedia(id);
    setBusy(false);
    if (!res.success) {
      setMessage(res.error?.message ?? 'Delete failed.');
      return;
    }
    await load();
  }

  return (
    <Container className="space-y-10 py-10">
      <div>
        <Heading as="h1" className="mb-2" level="h2">
          Media library
        </Heading>
        <Text color="muted">
          Store references to files hosted on your CDN or object storage. Upload mechanics depend on your infrastructure;
          this screen records the public URL for reuse in articles and pages.
        </Text>
      </div>

      {message ? (
        <p className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900">
          {message}
        </p>
      ) : null}

      <form className="max-w-xl space-y-4 rounded-xl border border-neutral-200 p-6 dark:border-neutral-800" onSubmit={onCreate}>
        <Heading level="h3">Register asset URL</Heading>
        <Input label="URL" onChange={(e) => setUrl(e.target.value)} required value={url} />
        <Input label="Title" onChange={(e) => setTitle(e.target.value)} value={title} />
        <TextArea label="Alt text" onChange={(e) => setAltText(e.target.value)} rows={2} value={altText} />
        <Button disabled={busy} type="submit" variant="primary">
          {busy ? 'Saving…' : 'Add to library'}
        </Button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs font-semibold uppercase text-neutral-500 dark:bg-neutral-900">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3"> </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((raw) => {
              if (!isRecord(raw)) return null;
              const id = pickString(raw['id']);
              return (
                <tr className="border-t border-neutral-100 dark:border-neutral-800" key={id}>
                  <td className="px-4 py-3">{pickString(raw['title']) || '—'}</td>
                  <td className="max-w-md truncate px-4 py-3 font-mono text-xs">{pickString(raw['url'])}</td>
                  <td className="px-4 py-3 text-right">
                    <Button disabled={busy} onClick={() => void onDelete(id)} size="sm" type="button" variant="destructive">
                      Remove
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
