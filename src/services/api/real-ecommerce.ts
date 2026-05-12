import { api } from '@/services/api/client';
import type { ApiResponse, Product, ProductCategory, ProductFilters, ProductReview } from '@/types';

const PLACEHOLDER_IMAGE = {
  src: '/images/placeholder-product.svg',
  alt: 'Product image',
};

type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  children?: ApiCategory[];
};

type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAt: number | null;
  images: string[];
  tags: string[];
  isFeatured?: boolean;
  category: { id: string; name: string; slug: string };
};

function mapProduct(p: ApiProduct): Product {
  const first = p.images?.[0];
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? '',
    price: p.price,
    compareAtPrice: p.compareAt ?? undefined,
    categorySlug: p.category.slug,
    image: first ? { src: first, alt: p.name } : PLACEHOLDER_IMAGE,
    tags: p.tags ?? [],
    rating: 0,
    reviewCount: 0,
    inStock: true,
    stockCount: 0,
  };
}

function flattenCategories(nodes: ApiCategory[]): ApiCategory[] {
  const out: ApiCategory[] = [];
  for (const n of nodes) {
    out.push(n);
    if (n.children?.length) out.push(...flattenCategories(n.children));
  }
  return out;
}

export const ecommerceApi = {
  async getProducts(filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    const params: Record<string, string | number | boolean | undefined> = {
      page: 1,
      limit: 100,
      isActive: true,
    };
    if (filters.category) params['categorySlug'] = filters.category;
    if (filters.search) params['search'] = filters.search;
    if (filters.minPrice !== undefined) params['minPrice'] = filters.minPrice;
    if (filters.maxPrice !== undefined) params['maxPrice'] = filters.maxPrice;

    const res = await api.get<ApiProduct[]>('/shop/products', { params });
    if (!res.success) {
      return { success: false, error: res.error, meta: res.meta };
    }
    const items = Array.isArray(res.data) ? res.data : [];
    let mapped = items.map(mapProduct);
    if (filters.inStockOnly) mapped = mapped.filter((p) => p.inStock);
    if (filters.minRating !== undefined) mapped = mapped.filter((p) => p.rating >= filters.minRating!);

    switch (filters.sort) {
      case 'price-asc':
        mapped = [...mapped].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        mapped = [...mapped].sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        mapped = [...mapped].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return { success: true, data: mapped, meta: res.meta };
  },

  async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    const res = await api.get<ApiProduct>(`/shop/products/slug/${encodeURIComponent(slug)}`);
    if (!res.success || !res.data) {
      return { success: false, error: res.error, meta: res.meta };
    }
    return { success: true, data: mapProduct(res.data) };
  },

  async getCategories(): Promise<ApiResponse<ProductCategory[]>> {
    const res = await api.get<ApiCategory[]>('/shop/categories');
    if (!res.success) {
      return res as ApiResponse<ProductCategory[]>;
    }
    const raw = Array.isArray(res.data) ? res.data : [];
    const flat = flattenCategories(raw);
    const mapped: ProductCategory[] = flat.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description ?? '',
    }));
    return { success: true, data: mapped, meta: res.meta };
  },

  async getCategoryBySlug(slug: string): Promise<ApiResponse<ProductCategory>> {
    const cats = await this.getCategories();
    if (!cats.success || !cats.data) {
      return { success: false, error: cats.error, meta: cats.meta };
    }
    const c = cats.data.find((x) => x.slug === slug);
    if (!c) {
      return { success: false, error: { code: 'NOT_FOUND', message: 'Category not found' } };
    }
    return { success: true, data: c };
  },

  async getRelatedProducts(productId: string, limit: number = 4): Promise<ApiResponse<Product[]>> {
    const self = await api.get<ApiProduct>(`/shop/products/${encodeURIComponent(productId)}`);
    if (!self.success || !self.data) return { success: true, data: [] };
    const p = self.data;
    const res = await this.getProducts({ category: p.category.slug });
    if (!res.success || !res.data) return res;
    const related = res.data.filter((x) => x.id !== productId).slice(0, limit);
    return { success: true, data: related };
  },

  async getProductReviews(_productId: string): Promise<ApiResponse<ProductReview[]>> {
    return { success: true, data: [] };
  },
};
