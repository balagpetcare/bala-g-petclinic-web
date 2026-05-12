'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import {
  fetchNotificationPreferences,
  fetchNotifications,
  markNotificationRead,
  patchNotificationPreferences,
  type InAppNotificationDto,
  type NotificationPreferenceDto,
  type NotificationPreferencePatch,
} from '@/services/notifications-client';

export function AccountNotificationPanel() {
  const [items, setItems] = useState<InAppNotificationDto[]>([]);
  const [prefs, setPrefs] = useState<NotificationPreferenceDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    setBusy(true);
    try {
      const [{ items: nextItems }, p] = await Promise.all([
        fetchNotifications({ page: 1, limit: 25 }),
        fetchNotificationPreferences(),
      ]);
      setItems(nextItems);
      setPrefs(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load notifications');
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onToggle<K extends keyof NotificationPreferencePatch>(key: K, value: NotificationPreferencePatch[K]) {
    if (!prefs) return;
    setBusy(true);
    setError(null);
    try {
      const patch: NotificationPreferencePatch = { [key]: value };
      const next = await patchNotificationPreferences(patch);
      setPrefs(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update preferences');
    } finally {
      setBusy(false);
    }
  }

  async function onMarkRead(id: string) {
    setBusy(true);
    setError(null);
    try {
      await markNotificationRead(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not mark read');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-10 space-y-8">
      <section aria-labelledby="notif-prefs-heading">
        <Heading as="h2" className="mb-3" id="notif-prefs-heading" level="h3">
          Notification preferences
        </Heading>
        <Text className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          Control how we reach you. Channel delivery beyond email is staged on the backend; toggles are honored as
          providers go live.
        </Text>
        {prefs ? (
          <fieldset className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <legend className="sr-only">Channels</legend>
            {(
              [
                ['emailEnabled', 'Email'],
                ['smsEnabled', 'SMS'],
                ['whatsappEnabled', 'WhatsApp'],
                ['pushEnabled', 'Push'],
              ] as const
            ).map(([key, label]) => (
              <label className="flex cursor-pointer items-center justify-between gap-4 text-sm" key={key}>
                <span className="text-neutral-800 dark:text-neutral-100">{label}</span>
                <input
                  checked={Boolean(prefs[key])}
                  className="h-4 w-4 accent-primary-600"
                  disabled={busy}
                  onChange={(ev) => void onToggle(key, ev.target.checked)}
                  type="checkbox"
                />
              </label>
            ))}
          </fieldset>
        ) : (
          <p className="text-sm text-neutral-500">Loading preferences…</p>
        )}
      </section>

      <section aria-labelledby="notif-center-heading">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <Heading as="h2" id="notif-center-heading" level="h3">
            Inbox
          </Heading>
          <Button disabled={busy} onClick={() => void load()} type="button" variant="outline">
            Refresh
          </Button>
        </div>
        {error ? (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}
        <ul className="space-y-3">
          {items.length === 0 ? (
            <li className="rounded-xl border border-dashed border-neutral-200 p-6 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
              No notifications yet.
            </li>
          ) : (
            items.map((n) => (
              <li
                className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950"
                key={n.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{n.title}</p>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{n.message}</p>
                    <p className="mt-2 text-xs text-neutral-500">
                      {new Date(n.createdAt).toLocaleString()}{' '}
                      <span className="font-mono text-neutral-400">· {n.type}</span>
                    </p>
                  </div>
                  {!n.isRead ? (
                    <Button disabled={busy} onClick={() => void onMarkRead(n.id)} type="button" variant="outline">
                      Mark read
                    </Button>
                  ) : (
                    <span className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                      Read
                    </span>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
