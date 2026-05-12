'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Button, Container, Heading, Input, Select, Text, TextArea } from '@/components/ui';
import type { SelectOption } from '@/types';
import { adminCreateBlog, adminDeleteBlog, adminGetBlog, adminListBlogs, adminUpdateBlog } from '@/services/cms-admin';

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
];

function pickString(v: unknown): string {
  return typeof v === 'string' ? v : v == null ? '' : String(v);
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v && typeof v === 'object');
}

export default function CmsBlogsAdminPage() {
  const [rows, setRows] = useState<unknown[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Clinic team');
  const [content, setContent] = useState('<p></p>');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [tags, setTags] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [canonicalPath, setCanonicalPath] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [noIndex, setNoIndex] = useState(false);
  const [coverImage, setCoverImage] = useState('');

  const load = useCallback(async () => {
    setBusy(true);
    const res = await adminListBlogs({ page: 1, limit: 100 });
    setBusy(false);
    if (res.success && Array.isArray(res.data)) {
      setRows(res.data);
    } else {
      setMessage(res.error?.message ?? 'Could not load blogs.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function resetForm() {
    setEditingId(null);
    setTitle('');
    setAuthor('Clinic team');
    setContent('<p></p>');
    setExcerpt('');
    setStatus('DRAFT');
    setTags('');
    setSeoTitle('');
    setSeoDescription('');
    setCanonicalPath('');
    setOgImage('');
    setNoIndex(false);
    setCoverImage('');
  }

  async function loadOne(id: string) {
    setBusy(true);
    const res = await adminGetBlog(id);
    setBusy(false);
    if (!res.success || !isRecord(res.data)) {
      setMessage(res.error?.message ?? 'Could not load article.');
      return;
    }
    const b = res.data;
    setEditingId(id);
    setTitle(pickString(b['title']));
    setAuthor(pickString(b['author']) || 'Clinic team');
    setContent(pickString(b['content']) || '<p></p>');
    setExcerpt(pickString(b['excerpt']));
    setStatus(pickString(b['status']) || 'DRAFT');
    const tagArr = b['tags'];
    setTags(Array.isArray(tagArr) ? tagArr.map(String).join(', ') : '');
    setSeoTitle(pickString(b['seoTitle']));
    setSeoDescription(pickString(b['seoDescription']));
    setCanonicalPath(pickString(b['canonicalPath']));
    setOgImage(pickString(b['ogImage']));
    setNoIndex(Boolean(b['noIndex']));
    setCoverImage(pickString(b['coverImage']));
    setMessage(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const payload: Record<string, unknown> = {
      title: title.trim(),
      author: author.trim(),
      content,
      excerpt: excerpt.trim() || undefined,
      status,
      tags: tagList,
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
      canonicalPath: canonicalPath.trim() || undefined,
      ogImage: ogImage.trim() || undefined,
      coverImage: coverImage.trim() || undefined,
      noIndex,
      contentFormat: 'HTML',
    };
    const res = editingId
      ? await adminUpdateBlog(editingId, payload)
      : await adminCreateBlog(payload);
    setBusy(false);
    if (!res.success) {
      setMessage(res.error?.message ?? 'Save failed.');
      return;
    }
    setMessage(editingId ? 'Article updated.' : 'Article created.');
    resetForm();
    await load();
  }

  async function onDelete(id: string) {
    if (!window.confirm('Delete this article?')) return;
    setBusy(true);
    const res = await adminDeleteBlog(id);
    setBusy(false);
    if (!res.success) {
      setMessage(res.error?.message ?? 'Delete failed.');
      return;
    }
    if (editingId === id) resetForm();
    await load();
  }

  return (
    <Container className="space-y-10 py-10">
      <div>
        <Heading as="h1" className="mb-2" level="h2">
          Blog posts
        </Heading>
        <Text color="muted">Create drafts, publish when ready, and tune SEO fields used by the public blog templates.</Text>
      </div>

      {message ? (
        <p className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900">
          {message}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs font-semibold uppercase text-neutral-500 dark:bg-neutral-900">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Public</th>
              <th className="px-4 py-3"> </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((raw) => {
              if (!isRecord(raw)) return null;
              const id = pickString(raw['id']);
              const slug = pickString(raw['slug']);
              return (
                <tr className="border-t border-neutral-100 dark:border-neutral-800" key={id || slug}>
                  <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">{pickString(raw['title'])}</td>
                  <td className="px-4 py-3">{pickString(raw['status'])}</td>
                  <td className="px-4 py-3 font-mono text-xs">{slug}</td>
                  <td className="px-4 py-3">
                    {slug ? (
                      <Link className="text-primary-700 hover:underline dark:text-primary-400" href={`/blog/${slug}`}>
                        View
                      </Link>
                    ) : null}
                  </td>
                  <td className="space-x-2 px-4 py-3 text-right">
                    <Button disabled={busy} onClick={() => void loadOne(id)} size="sm" type="button" variant="outline">
                      Edit
                    </Button>
                    <Button disabled={busy} onClick={() => void onDelete(id)} size="sm" type="button" variant="destructive">
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <form className="max-w-2xl space-y-4" onSubmit={onSubmit}>
        <Heading level="h3">{editingId ? 'Edit article' : 'New article'}</Heading>
        <Input label="Title" onChange={(e) => setTitle(e.target.value)} required value={title} />
        <Input label="Author" onChange={(e) => setAuthor(e.target.value)} required value={author} />
        <TextArea label="Content (HTML)" onChange={(e) => setContent(e.target.value)} required rows={12} value={content} />
        <TextArea label="Excerpt" onChange={(e) => setExcerpt(e.target.value)} rows={3} value={excerpt} />
        <Input label="Tags (comma-separated)" onChange={(e) => setTags(e.target.value)} value={tags} />
        <Input label="Cover image URL" onChange={(e) => setCoverImage(e.target.value)} value={coverImage} />
        <Select label="Status" onChange={(e) => setStatus(e.target.value)} options={STATUS_OPTIONS} value={status} />
        <Heading className="pt-4" level="h4">
          SEO
        </Heading>
        <Input label="SEO title" onChange={(e) => setSeoTitle(e.target.value)} value={seoTitle} />
        <TextArea label="SEO description" onChange={(e) => setSeoDescription(e.target.value)} rows={3} value={seoDescription} />
        <Input
          hint="Path only, e.g. /blog/your-slug"
          label="Canonical path"
          onChange={(e) => setCanonicalPath(e.target.value)}
          value={canonicalPath}
        />
        <Input label="Open Graph image URL" onChange={(e) => setOgImage(e.target.value)} value={ogImage} />
        <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
          <input checked={noIndex} onChange={(e) => setNoIndex(e.target.checked)} type="checkbox" />
          Hide from search engines (noindex)
        </label>
        <div className="flex flex-wrap gap-3">
          <Button disabled={busy} type="submit" variant="primary">
            {busy ? 'Saving…' : editingId ? 'Save changes' : 'Create article'}
          </Button>
          {editingId ? (
            <Button disabled={busy} onClick={resetForm} type="button" variant="outline">
              Cancel edit
            </Button>
          ) : null}
        </div>
      </form>
    </Container>
  );
}
