'use client';

import Link from 'next/link';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { cn, formatCurrency } from '@/lib/utils';
import { siteConfig } from '@/config';
import { useEcommerce } from '@/providers';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch, isInWishlist } = useEcommerce();
  const wished = isInWishlist(product.id);

  return (
    <Card className="flex h-full flex-col" hover padding="md">
      <div className="relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900">
        <div className="aspect-square w-full" />
        <button
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className={cn(
            'absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors',
            wished
              ? 'border-primary-600 bg-primary-600 text-white'
              : 'border-neutral-200 bg-white text-neutral-600 hover:text-primary-600 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300'
          )}
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', productId: product.id })}
        >
          <Heart className={cn('h-4 w-4', wished && 'fill-current')} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Badge size="sm" variant="default">
          {product.categorySlug.replace('-', ' ')}
        </Badge>
        {!product.inStock && (
          <Badge size="sm" variant="warning">
            Out of stock
          </Badge>
        )}
      </div>

      <Link className="mt-3 block" href={`/shop/${product.slug}`}>
        <h3 className="text-base font-semibold text-neutral-900 transition-colors hover:text-primary-600 dark:text-white">
          {product.name}
        </h3>
      </Link>

      <p className="mt-2 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
        {product.description}
      </p>

      <div className="mt-3 flex items-center gap-1 text-amber-500">
        <Star className="h-4 w-4 fill-current" aria-hidden="true" />
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {product.rating.toFixed(1)} ({product.reviewCount})
        </span>
      </div>

      <div className="mt-auto pt-4">
        <div className="mb-4 flex items-end gap-2">
          <span className="text-lg font-bold text-neutral-900 dark:text-white">
            {formatCurrency(product.price, siteConfig.defaultCurrency)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-neutral-400 line-through">
              {formatCurrency(product.compareAtPrice, siteConfig.defaultCurrency)}
            </span>
          )}
        </div>
        <Button
          disabled={!product.inStock}
          fullWidth
          leftIcon={<ShoppingBag className="h-4 w-4" />}
          onClick={() => dispatch({ type: 'ADD_TO_CART', productId: product.id })}
        >
          {product.inStock ? 'Add to Cart' : 'Unavailable'}
        </Button>
      </div>
    </Card>
  );
}
