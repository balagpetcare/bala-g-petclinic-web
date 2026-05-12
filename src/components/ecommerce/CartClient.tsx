'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { siteConfig } from '@/config';
import { useEcommerce } from '@/providers';
import { products } from '@/data/ecommerce';

export function CartClient() {
  const { state, dispatch } = useEcommerce();

  const cartDetails = state.cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) return null;
      return { product, quantity: item.quantity, subtotal: item.quantity * product.price };
    })
    .filter(
      (
        item
      ): item is {
        product: (typeof products)[number];
        quantity: number;
        subtotal: number;
      } => Boolean(item)
    );

  const total = cartDetails.reduce((sum, item) => sum + (item?.subtotal ?? 0), 0);

  if (cartDetails.length === 0) {
    return (
      <Card className="text-center" padding="lg">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Your cart is empty</h2>
        <p className="mt-2 text-sm text-neutral-500">Browse products and add items to your cart.</p>
        <Link
          className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-primary-600 px-5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          href="/shop"
        >
          Continue Shopping
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {cartDetails.map((item) => (
          <Card key={item.product.id} padding="md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link
                  className="text-base font-semibold text-neutral-900 hover:text-primary-600 dark:text-white"
                  href={`/shop/${item.product.slug}`}
                >
                  {item.product.name}
                </Link>
                <p className="mt-1 text-sm text-neutral-500">
                  {formatCurrency(item.product.price, siteConfig.defaultCurrency)} each
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <button
                    className="inline-flex h-9 w-9 items-center justify-center"
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: 'SET_CART_QUANTITY',
                        productId: item.product.id,
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    }
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="inline-flex h-9 min-w-9 items-center justify-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    className="inline-flex h-9 w-9 items-center justify-center"
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: 'SET_CART_QUANTITY',
                        productId: item.product.id,
                        quantity: item.quantity + 1,
                      })
                    }
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <span className="min-w-24 text-right text-sm font-semibold text-neutral-900 dark:text-white">
                  {formatCurrency(item.subtotal, siteConfig.defaultCurrency)}
                </span>
                <button
                  aria-label="Remove item"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-error-600 hover:bg-error-50 dark:hover:bg-error-950/20"
                  type="button"
                  onClick={() => dispatch({ type: 'REMOVE_FROM_CART', productId: item.product.id })}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="h-fit" padding="lg">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Order Summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
            <span>Items</span>
            <span>{state.cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </div>
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-neutral-200 pt-3 text-base font-semibold text-neutral-900 dark:border-neutral-800 dark:text-white">
            <span>Total</span>
            <span>{formatCurrency(total, siteConfig.defaultCurrency)}</span>
          </div>
        </div>
        <Link
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary-600 px-6 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          href="/checkout"
        >
          Proceed to Checkout
        </Link>
        <Button
          className="mt-3"
          fullWidth
          type="button"
          variant="ghost"
          onClick={() => dispatch({ type: 'CLEAR_CART' })}
        >
          Clear Cart
        </Button>
      </Card>
    </div>
  );
}
