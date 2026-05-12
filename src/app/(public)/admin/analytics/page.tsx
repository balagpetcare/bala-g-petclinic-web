'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Heading } from '@/components/ui/Heading';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { canAccessAnalyticsUi } from '@/lib/auth/constants';
import { useAuth } from '@/hooks/use-auth';
import {
  fetchAnalyticsOverview,
  fetchAppointmentsTimeseries,
  fetchDoctorAppointmentLeaders,
  fetchPaymentMethodMix,
  fetchRevenueTimeseries,
} from '@/services/analytics-client';
import { AnalyticsBarList, AnalyticsLineChart } from '@/components/analytics/AnalyticsCharts';

function defaultRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to.getTime() - 29 * 86400000);
  const isoDay = (d: Date) => d.toISOString().slice(0, 10);
  return { from: isoDay(from), to: isoDay(to) };
}

export default function AdminAnalyticsPage() {
  const { user } = useAuth();
  const [range, setRange] = useState(defaultRange);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<unknown>(null);
  const [revenue, setRevenue] = useState<{ points: { t: string; v: number }[] } | null>(null);
  const [appointments, setAppointments] = useState<{ points: { t: string; v: number }[] } | null>(null);
  const [methods, setMethods] = useState<{ rows: { method: string; amount: number; count: number }[] } | null>(null);
  const [doctors, setDoctors] = useState<{ rows: { doctorName: string; appointments: number }[] } | null>(null);

  const q = useMemo(() => ({ from: range.from, to: range.to }), [range.from, range.to]);

  const load = useCallback(async () => {
    if (!user || !canAccessAnalyticsUi(user.role)) return;
    setBusy(true);
    setError(null);
    try {
      const [ov, rev, ap, pm, doc] = await Promise.all([
        fetchAnalyticsOverview(q),
        fetchRevenueTimeseries(q),
        fetchAppointmentsTimeseries(q),
        fetchPaymentMethodMix(q),
        fetchDoctorAppointmentLeaders({ ...q, limit: 8 }),
      ]);
      setOverview(ov);
      setRevenue(rev as { points: { t: string; v: number }[] });
      setAppointments(ap as { points: { t: string; v: number }[] });
      setMethods(pm as { rows: { method: string; amount: number; count: number }[] });
      setDoctors(doc as { rows: { doctorName: string; appointments: number }[] });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load analytics');
    } finally {
      setBusy(false);
    }
  }, [q, user]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!user) return null;

  if (!canAccessAnalyticsUi(user.role)) {
    return (
      <section className="py-14">
        <Container className="max-w-xl">
          <Heading as="h1" className="mb-3" level="h3">
            Analytics
          </Heading>
          <Text className="text-neutral-600 dark:text-neutral-400">Your role does not include analytics access.</Text>
        </Container>
      </section>
    );
  }

  const kpis = (overview as { kpis?: { id: string; label: string; value: number | string }[] } | null)?.kpis ?? [];

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Heading as="h1" className="mb-1" level="h2">
              Analytics
            </Heading>
            <Text className="text-sm text-neutral-600 dark:text-neutral-400">
              Branch-scoped operational metrics from the Bala G API. Data reflects your RBAC permissions.
            </Text>
          </div>
          <Link className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400" href="/admin">
            Back to admin
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <label className="text-sm">
            <span className="mb-1 block text-neutral-500 dark:text-neutral-400">From</span>
            <input
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
              onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
              type="date"
              value={range.from}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-neutral-500 dark:text-neutral-400">To</span>
            <input
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
              onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
              type="date"
              value={range.to}
            />
          </label>
          <Button disabled={busy} onClick={() => void load()} type="button" variant="primary">
            Apply
          </Button>
        </div>

        {error ? (
          <p className="mb-6 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.slice(0, 9).map((k) => (
            <div
              className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-soft dark:border-neutral-800 dark:bg-neutral-950"
              key={k.id}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{k.label}</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-neutral-900 dark:text-white">{k.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <Heading className="mb-3" level="h3">
              Revenue (captured payments)
            </Heading>
            <AnalyticsLineChart points={revenue?.points ?? []} />
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <Heading className="mb-3" level="h3">
              Appointments scheduled
            </Heading>
            <AnalyticsLineChart points={appointments?.points ?? []} strokeClassName="stroke-emerald-600" />
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <Heading className="mb-3" level="h3">
              Payment methods
            </Heading>
            <AnalyticsBarList labelKey="method" rows={(methods?.rows ?? []) as Record<string, unknown>[]} valueKey="amount" />
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <Heading className="mb-3" level="h3">
              Doctor appointment volume
            </Heading>
            <AnalyticsBarList
              labelKey="doctorName"
              rows={(doctors?.rows ?? []) as Record<string, unknown>[]}
              valueKey="appointments"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
