import { http, assertBackendSuccess } from '@/lib/api/http';

export type AnalyticsRangeQuery = {
  from?: string;
  to?: string;
  branchId?: string;
  doctorId?: string;
  limit?: number;
};

function toSearchParams(q: AnalyticsRangeQuery): string {
  const sp = new URLSearchParams();
  if (q.from) sp.set('from', q.from);
  if (q.to) sp.set('to', q.to);
  if (q.branchId) sp.set('branchId', q.branchId);
  if (q.doctorId) sp.set('doctorId', q.doctorId);
  if (q.limit !== undefined) sp.set('limit', String(q.limit));
  const s = sp.toString();
  return s ? `?${s}` : '';
}

export async function fetchAnalyticsOverview(q: AnalyticsRangeQuery) {
  const res = await http.get<unknown>(`analytics/overview${toSearchParams(q)}`);
  assertBackendSuccess(res);
  return res.data;
}

export async function fetchRevenueTimeseries(q: AnalyticsRangeQuery) {
  const res = await http.get<unknown>(`analytics/revenue/timeseries${toSearchParams(q)}`);
  assertBackendSuccess(res);
  return res.data;
}

export async function fetchAppointmentsTimeseries(q: AnalyticsRangeQuery) {
  const res = await http.get<unknown>(`analytics/appointments/timeseries${toSearchParams(q)}`);
  assertBackendSuccess(res);
  return res.data;
}

export async function fetchPaymentMethodMix(q: AnalyticsRangeQuery) {
  const res = await http.get<unknown>(`analytics/payments/method-mix${toSearchParams(q)}`);
  assertBackendSuccess(res);
  return res.data;
}

export async function fetchDoctorAppointmentLeaders(q: AnalyticsRangeQuery) {
  const res = await http.get<unknown>(`analytics/doctors/appointments${toSearchParams(q)}`);
  assertBackendSuccess(res);
  return res.data;
}
