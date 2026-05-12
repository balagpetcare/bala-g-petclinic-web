'use client';

import Link from 'next/link';
import { ProductGrid } from './ProductGrid';
import { products } from '@/data/ecommerce';
import { useEcommerce } from '@/providers';
import { Card } from '@/components/ui';

export function WishlistClient() {
  const { state } = useEcommerce();
  const wishedProducts = products.filter((item) => state.wishlist.includes(item.id));

  if (wishedProducts.length === 0) {
    return (
      <Card className="text-center" padding="lg">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Wishlist is empty</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Save products to your wishlist to find them quickly later.
        </p>
        <Link
          className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-primary-600 px-5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          href="/shop"
        >
          Explore Products
        </Link>
      </Card>
    );
  }

  return <ProductGrid products={wishedProducts} />;
}
