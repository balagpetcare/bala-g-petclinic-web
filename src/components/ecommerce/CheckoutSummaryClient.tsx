'use client';

import { Card } from '@/components/ui';
import { products } from '@/data/ecommerce';
import { formatCurrency } from '@/lib/utils';
import { siteConfig } from '@/config';
import { useEcommerce } from '@/providers';

export function CheckoutSummaryClient() {
  const { state } = useEcommerce();
  const lines = state.cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) return null;
      return { id: product.id, name: product.name, quantity: item.quantity, total: product.price * item.quantity };
    })
    .filter(Boolean);

  const grandTotal = lines.reduce((sum, line) => sum + (line?.total ?? 0), 0);

  return (
    <Card className="h-fit" padding="lg">
      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Order Preview</h2>
      <div className="mt-4 space-y-3">
        {lines.length === 0 && <p className="text-sm text-neutral-500">No items in cart.</p>}
        {lines.map((line) => (
          <div key={line?.id} className="flex items-start justify-between gap-3 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">
              {line?.name} x {line?.quantity}
            </span>
            <span className="font-medium text-neutral-900 dark:text-white">
              {formatCurrency(line?.total ?? 0, siteConfig.defaultCurrency)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-neutral-200 pt-4 text-base font-semibold text-neutral-900 dark:border-neutral-800 dark:text-white">
        Total: {formatCurrency(grandTotal, siteConfig.defaultCurrency)}
      </div>
    </Card>
  );
}
