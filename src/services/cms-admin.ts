import { http } from '@/lib/api/http';
import type { BackendApiResponse } from '@/types/api';

/** Admin CMS API (`/api/v1/cms/...`) — requires Bearer token via `configureApiAuth` / stored access token. */

export async function adminListPages(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<BackendApiResponse<unknown[]>> {
  return http.get('cms/pages', {
    params: { page: params?.page, limit: params?.limit, status: params?.status },
    cache: 'no-store',
  });
}

export async function adminGetPage(id: string): Promise<BackendApiResponse<unknown>> {
  return http.get(`cms/pages/${encodeURIComponent(id)}`, { cache: 'no-store' });
}

export async function adminCreatePage(body: Record<string, unknown>): Promise<BackendApiResponse<unknown>> {
  return http.post('cms/pages', body, { cache: 'no-store' });
}

export async function adminUpdatePage(id: string, body: Record<string, unknown>): Promise<BackendApiResponse<unknown>> {
  return http.patch(`cms/pages/${encodeURIComponent(id)}`, body, { cache: 'no-store' });
}

export async function adminDeletePage(id: string): Promise<BackendApiResponse<unknown>> {
  return http.delete(`cms/pages/${encodeURIComponent(id)}`, { cache: 'no-store' });
}

export async function adminListBlogs(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<BackendApiResponse<unknown[]>> {
  return http.get('cms/blogs', {
    params: { page: params?.page, limit: params?.limit, status: params?.status },
    cache: 'no-store',
  });
}

export async function adminGetBlog(id: string): Promise<BackendApiResponse<unknown>> {
  return http.get(`cms/blogs/${encodeURIComponent(id)}`, { cache: 'no-store' });
}

export async function adminCreateBlog(body: Record<string, unknown>): Promise<BackendApiResponse<unknown>> {
  return http.post('cms/blogs', body, { cache: 'no-store' });
}

export async function adminUpdateBlog(id: string, body: Record<string, unknown>): Promise<BackendApiResponse<unknown>> {
  return http.patch(`cms/blogs/${encodeURIComponent(id)}`, body, { cache: 'no-store' });
}

export async function adminDeleteBlog(id: string): Promise<BackendApiResponse<unknown>> {
  return http.delete(`cms/blogs/${encodeURIComponent(id)}`, { cache: 'no-store' });
}

export async function adminListBanners(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<BackendApiResponse<unknown[]>> {
  return http.get('cms/banners', {
    params: { page: params?.page, limit: params?.limit, status: params?.status },
    cache: 'no-store',
  });
}

export async function adminCreateBanner(body: Record<string, unknown>): Promise<BackendApiResponse<unknown>> {
  return http.post('cms/banners', body, { cache: 'no-store' });
}

export async function adminUpdateBanner(id: string, body: Record<string, unknown>): Promise<BackendApiResponse<unknown>> {
  return http.patch(`cms/banners/${encodeURIComponent(id)}`, body, { cache: 'no-store' });
}

export async function adminDeleteBanner(id: string): Promise<BackendApiResponse<unknown>> {
  return http.delete(`cms/banners/${encodeURIComponent(id)}`, { cache: 'no-store' });
}

export async function adminListCategories(): Promise<BackendApiResponse<unknown[]>> {
  return http.get('cms/categories', { cache: 'no-store' });
}

export async function adminListMedia(params?: { page?: number; limit?: number }): Promise<BackendApiResponse<unknown[]>> {
  return http.get('cms/media', {
    params: { page: params?.page, limit: params?.limit },
    cache: 'no-store',
  });
}

export async function adminCreateMedia(body: Record<string, unknown>): Promise<BackendApiResponse<unknown>> {
  return http.post('cms/media', body, { cache: 'no-store' });
}

export async function adminDeleteMedia(id: string): Promise<BackendApiResponse<unknown>> {
  return http.delete(`cms/media/${encodeURIComponent(id)}`, { cache: 'no-store' });
}
