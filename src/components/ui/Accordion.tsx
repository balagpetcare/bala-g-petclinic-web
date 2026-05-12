'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800">
      <button
        className="flex w-full items-center justify-between gap-4 py-5 text-left font-medium text-neutral-900 transition-colors hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
        aria-expanded={isOpen}
        type="button"
        onClick={toggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>
      <div
        className={cn(
          'grid transition-all duration-200',
          isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
