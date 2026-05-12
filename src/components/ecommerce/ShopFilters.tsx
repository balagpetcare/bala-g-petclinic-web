'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input, Select } from '@/components/ui';
import type { ProductCategory, SelectOption } from '@/types';

interface ShopFiltersProps {
  categories: ProductCategory[];
}

function toOptions(categories: ProductCategory[]): SelectOption[] {
  return categories.map((item) => ({ label: item.name, value: item.slug }));
}

export function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryOptions = useMemo(() => toOptions(categories), [categories]);

  const updateQuery = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid gap-4 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800 sm:grid-cols-2 lg:grid-cols-5">
      <Input
        defaultValue={searchParams.get('q') ?? ''}
        label="Search"
        placeholder="Search products..."
        onChange={(event) => updateQuery('q', event.target.value || undefined)}
      />
      <Select
        defaultValue={searchParams.get('category') ?? ''}
        label="Category"
        options={categoryOptions}
        placeholder="All categories"
        onChange={(event) => updateQuery('category', event.target.value || undefined)}
      />
      <Select
        defaultValue={searchParams.get('sort') ?? 'featured'}
        label="Sort by"
        options={[
          { label: 'Featured', value: 'featured' },
          { label: 'Price: Low to High', value: 'price-asc' },
          { label: 'Price: High to Low', value: 'price-desc' },
          { label: 'Top Rated', value: 'rating-desc' },
        ]}
        onChange={(event) => updateQuery('sort', event.target.value)}
      />
      <Select
        defaultValue={searchParams.get('stock') ?? ''}
        label="Stock"
        options={[{ label: 'In stock only', value: 'in-stock' }]}
        placeholder="Any"
        onChange={(event) => updateQuery('stock', event.target.value || undefined)}
      />
      <Select
        defaultValue={searchParams.get('minRating') ?? ''}
        label="Rating"
        options={[
          { label: '4.5 and above', value: '4.5' },
          { label: '4.0 and above', value: '4.0' },
          { label: '3.5 and above', value: '3.5' },
        ]}
        placeholder="Any rating"
        onChange={(event) => updateQuery('minRating', event.target.value || undefined)}
      />
    </div>
  );
}
