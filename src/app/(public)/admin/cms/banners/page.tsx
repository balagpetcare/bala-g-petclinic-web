'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, Container, Heading, Input, Select, Text, TextArea } from '@/components/ui';
import type { SelectOption } from '@/types';
import { adminCreateBanner, adminDeleteBanner, adminListBanners, adminUpdateBanner } from '@/services/cms-admin';

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

export default function CmsBannersAdminPage() {
  const [rows, setRows] = useState<unknown[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [slot, setSlot] = useState('home-hero');
  const [sortOrder, setSortOrder] = useState('0');

  const load = useCallback(async () => {
    setBusy(true);
    const res = await adminListBanners({ page: 1, limit: 100 });
    setBusy(false);
    if (res.success && Array.isArray(res.data)) {
      setRows(res.data);
    } else {
      setMessage(res.error?.message ?? 'Could not load banners.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function resetForm() {
    setEditingId(null);
    setTitle('');
    setImage('');
    setLink('');
    setDescription('');
    setStatus('DRAFT');
    setSlot('home-hero');
    setSortOrder('0');
  }

  function startEdit(raw: unknown) {
    if (!isRecord(raw)) return;
    setEditingId(pickString(raw['id']));
    setTitle(pickString(raw['title']));
    setImage(pickString(raw['image']));
    setLink(pickString(raw['link']));
    setDescription(pickString(raw['description']));
    setStatus(pickString(raw['status']) || 'DRAFT');
    setSlot(pickString(raw['slot']) || 'home-hero');
    setSortOrder(pickString(raw['sortOrder']) || '0');
    setMessage(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Record<string, unknown> = {
      title: title.trim(),
      image: image.trim(),
      description: description.trim() || undefined,
      status,
      sortOrder: Number(sortOrder) || 0,
      slot: slot.trim() || undefined,
    };
    const trimmedLink = link.trim();
    if (trimmedLink) {
      payload['link'] = trimmedLink;
    }
    setBusy(true);
    const res = editingId ? await adminUpdateBanner(editingId, payload) : await adminCreateBanner(payload);
    setBusy(false);
    if (!res.success) {
      setMessage(res.error?.message ?? 'Save failed.');
      return;
    }
    setMessage(editingId ? 'Banner updated.' : 'Banner created.');
    resetForm();
    await load();
  }

  async function onDelete(id: string) {
    if (!window.confirm('Delete this banner?')) return;
    setBusy(true);
    const res = await adminDeleteBanner(id);
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
          Banners
        </Heading>
        <Text color="muted">Slot names let the public site choose where a banner may appear (for example home hero).</Text>
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
              <th className="px-4 py-3">Slot</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"> </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((raw) => {
              if (!isRecord(raw)) return null;
              const id = pickString(raw['id']);
              return (
                <tr className="border-t border-neutral-100 dark:border-neutral-800" key={id}>
                  <td className="px-4 py-3 font-medium">{pickString(raw['title'])}</td>
                  <td className="px-4 py-3 font-mono text-xs">{pickString(raw['slot'])}</td>
                  <td className="px-4 py-3">{pickString(raw['status'])}</td>
                  <td className="space-x-2 px-4 py-3 text-right">
                    <Button disabled={busy} onClick={() => startEdit(raw)} size="sm" type="button" variant="outline">
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

      <form className="max-w-xl space-y-4" onSubmit={onSubmit}>
        <Heading level="h3">{editingId ? 'Edit banner' : 'New banner'}</Heading>
        <Input label="Title" onChange={(e) => setTitle(e.target.value)} required value={title} />
        <Input label="Image URL" onChange={(e) => setImage(e.target.value)} required value={image} />
        <Input label="Link (https://…)" onChange={(e) => setLink(e.target.value)} value={link} />
        <TextArea label="Description" onChange={(e) => setDescription(e.target.value)} rows={2} value={description} />
        <Input label="Slot" onChange={(e) => setSlot(e.target.value)} value={slot} />
        <Input label="Sort order" onChange={(e) => setSortOrder(e.target.value)} value={sortOrder} />
        <Select label="Status" onChange={(e) => setStatus(e.target.value)} options={STATUS_OPTIONS} value={status} />
        <div className="flex flex-wrap gap-3">
          <Button disabled={busy} type="submit" variant="primary">
            {busy ? 'Saving…' : editingId ? 'Save banner' : 'Create banner'}
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
