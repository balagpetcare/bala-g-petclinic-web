import { products, productCategories, productReviews } from '@/data/ecommerce';
import { wait } from '@/lib/utils';
import type { ApiResponse, Product, ProductCategory, ProductFilters, ProductReview } from '@/types';

function filterProducts(items: Product[], filters: ProductFilters): Product[] {
  const searchValue = filters.search?.trim().toLowerCase();

  let result = items.filter((item) => {
    if (filters.category && item.categorySlug !== filters.category) return false;
    if (filters.minPrice !== undefined && item.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && item.price > filters.maxPrice) return false;
    if (filters.inStockOnly && !item.inStock) return false;
    if (filters.minRating !== undefined && item.rating < filters.minRating) return false;
    if (!searchValue) return true;

    return (
      item.name.toLowerCase().includes(searchValue) ||
      item.description.toLowerCase().includes(searchValue) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchValue))
    );
  });

  switch (filters.sort) {
    case 'price-asc':
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case 'rating-desc':
      result = [...result].sort((a, b) => b.rating - a.rating);
      break;
    default:
      result = [...result].sort((a, b) => b.reviewCount - a.reviewCount);
      break;
  }

  return result;
}

function success<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export const ecommerceApi = {
  async getProducts(filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
    await wait(120);
    return success(filterProducts(products, filters));
  },

  async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    await wait(80);
    const product = products.find((item) => item.slug === slug);
    if (!product) {
      return {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Product not found' },
      };
    }
    return success(product);
  },

  async getCategories(): Promise<ApiResponse<ProductCategory[]>> {
    await wait(60);
    return success(productCategories);
  },

  async getCategoryBySlug(slug: string): Promise<ApiResponse<ProductCategory>> {
    await wait(60);
    const category = productCategories.find((item) => item.slug === slug);
    if (!category) {
      return {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Category not found' },
      };
    }
    return success(category);
  },

  async getRelatedProducts(productId: string, limit: number = 4): Promise<ApiResponse<Product[]>> {
    await wait(90);
    const current = products.find((item) => item.id === productId);
    if (!current) return success([]);

    const related = products
      .filter((item) => item.id !== productId && item.categorySlug === current.categorySlug)
      .slice(0, limit);
    return success(related);
  },

  async getProductReviews(productId: string): Promise<ApiResponse<ProductReview[]>> {
    await wait(90);
    return success(productReviews.filter((item) => item.productId === productId));
  },
};
