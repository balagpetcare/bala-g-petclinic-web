import type { WithId, WithSlug, ImageAsset } from './common';

export interface ProductCategory extends WithId, WithSlug {
  name: string;
  description: string;
}

export interface Product extends WithId, WithSlug {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categorySlug: string;
  image: ImageAsset;
  tags: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
}

export interface ProductReview extends WithId {
  productId: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  minRating?: number;
  search?: string;
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'rating-desc';
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  notes: string;
}
