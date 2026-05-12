'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

interface MotionRevealProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  as?: ElementType;
  direction?: RevealDirection;
  delay?: number;
  once?: boolean;
}

const directionOffset: Record<RevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
  none: { x: 0, y: 0 },
};

export function MotionReveal({
  children,
  as = 'div',
  direction = 'up',
  delay = 0,
  once = true,
  ...props
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const Component = motion(as);
  const offset = directionOffset[direction];

  if (shouldReduceMotion) {
    return <Component {...props}>{children}</Component>;
  }

  return (
    <Component
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      viewport={{ once, amount: 0.25 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      {...props}
    >
      {children}
    </Component>
  );
}
