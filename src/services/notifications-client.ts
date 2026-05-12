import { http, assertBackendSuccess } from '@/lib/api/http';
import type { PaginationMeta } from '@/types/api';

export type InAppNotificationDto = {
  id: string;
  userId: string;
  branchId: string | null;
  type: string;
  eventKey: string | null;
  priority: string;
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  metadata: unknown;
  createdAt: string;
};

export type NotificationPreferenceDto = {
  id: string;
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  pushEnabled: boolean;
  emergencyBypassQuietHours: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  timezone: string | null;
  mutedEventKeys: unknown;
  createdAt: string;
  updatedAt: string;
};

function buildListQuery(params?: { page?: number; limit?: number; unreadOnly?: boolean }): string {
  const sp = new URLSearchParams();
  if (params?.page !== undefined) sp.set('page', String(params.page));
  if (params?.limit !== undefined) sp.set('limit', String(params.limit));
  if (params?.unreadOnly) sp.set('unreadOnly', 'true');
  const q = sp.toString();
  return q ? `notifications?${q}` : 'notifications';
}

export async function fetchNotificationUnreadTotal(): Promise<number> {
  const res = await http.get<InAppNotificationDto[]>(buildListQuery({ page: 1, limit: 1, unreadOnly: true }));
  assertBackendSuccess(res);
  return res.meta?.pagination?.total ?? 0;
}

export async function fetchNotifications(params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}): Promise<{ items: InAppNotificationDto[]; pagination: PaginationMeta }> {
  const res = await http.get<InAppNotificationDto[]>(buildListQuery(params));
  assertBackendSuccess(res);
  const pagination = res.meta?.pagination;
  if (!pagination) {
    throw new Error('NOTIFICATIONS_LIST_MISSING_PAGINATION');
  }
  return { items: res.data, pagination };
}

export async function markNotificationRead(id: string): Promise<void> {
  const res = await http.patch<{ updated: boolean }>(`notifications/${id}/read`);
  assertBackendSuccess(res);
}

export async function fetchNotificationPreferences(): Promise<NotificationPreferenceDto> {
  const res = await http.get<NotificationPreferenceDto>('notifications/preferences');
  assertBackendSuccess(res);
  return res.data;
}

export type NotificationPreferencePatch = {
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  whatsappEnabled?: boolean;
  pushEnabled?: boolean;
  emergencyBypassQuietHours?: boolean;
  quietHoursStart?: string | null;
  quietHoursEnd?: string | null;
  timezone?: string | null;
  mutedEventKeys?: string[];
};

export async function patchNotificationPreferences(
  body: NotificationPreferencePatch
): Promise<NotificationPreferenceDto> {
  const res = await http.patch<NotificationPreferenceDto>('notifications/preferences', body);
  assertBackendSuccess(res);
  return res.data;
}
