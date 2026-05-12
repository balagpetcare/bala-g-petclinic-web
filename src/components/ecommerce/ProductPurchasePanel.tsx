'use client';

import { useState } from 'react';
import { Heart, ShoppingBag, Minus, Plus } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { formatCurrency, cn } from '@/lib/utils';
import { siteConfig } from '@/config';
import { useEcommerce } from '@/providers';
import type { Product } from '@/types';

interface ProductPurchasePanelProps {
  product: Product;
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);
  const { dispatch, isInWishlist } = useEcommerce();
  const wished = isInWishlist(product.id);

  return (
    <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant={product.inStock ? 'success' : 'warning'}>
          {product.inStock ? 'In stock' : 'Out of stock'}
        </Badge>
        <Badge variant="default">{product.stockCount} left</Badge>
      </div>
      <div className="mb-4 flex items-end gap-2">
        <span className="text-2xl font-bold text-neutral-900 dark:text-white">
          {formatCurrency(product.price, siteConfig.defaultCurrency)}
        </span>
        {product.compareAtPrice && (
          <span className="text-sm text-neutral-400 line-through">
            {formatCurrency(product.compareAtPrice, siteConfig.defaultCurrency)}
          </span>
        )}
      </div>
      <div className="mb-4 inline-flex items-center rounded-lg border border-neutral-200 dark:border-neutral-700">
        <button
          className="inline-flex h-10 w-10 items-center justify-center text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          type="button"
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="inline-flex h-10 min-w-10 items-center justify-center text-sm font-semibold">
          {quantity}
        </span>
        <button
          className="inline-flex h-10 w-10 items-center justify-center text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          type="button"
          onClick={() => setQuantity((value) => value + 1)}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="space-y-3">
        <Button
          disabled={!product.inStock}
          fullWidth
          leftIcon={<ShoppingBag className="h-4 w-4" />}
          size="lg"
          onClick={() =>
            dispatch({
              type: 'ADD_TO_CART',
              productId: product.id,
              quantity,
            })
          }
        >
          Add to Cart
        </Button>
        <Button
          className={cn(wished && 'border-primary-600 text-primary-600 dark:border-primary-400')}
          fullWidth
          leftIcon={<Heart className={cn('h-4 w-4', wished && 'fill-current')} />}
          size="lg"
          variant="outline"
          onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', productId: product.id })}
        >
          {wished ? 'Wishlisted' : 'Add to Wishlist'}
        </Button>
      </div>
    </div>
  );
}
