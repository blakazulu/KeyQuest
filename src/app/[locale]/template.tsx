'use client';

import { motion } from 'framer-motion';
import { usePathname, useParams } from 'next/navigation';
import { getPageType, PageType } from '@/lib/pageTransitions';

type Props = {
  children: React.ReactNode;
};

/**
 * Simple, reliable page transition variants
 * Each page type gets a unique entrance animation
 */
const transitions: Record<PageType, {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  transition: Record<string, unknown>;
}> = {
  // Home: Rise up with fade
  home: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },

  // Levels: Scale in (map appearing)
  levels: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },

  // Dashboard: Slide up
  dashboard: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },

  // Practice: Slide from side
  practice: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },

  // Active lesson: Quick focus zoom
  lesson: {
    initial: { opacity: 0, scale: 1.05 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },

  // Default: Simple fade
  default: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.25 },
  },
};

/**
 * Page transition template
 * Applies entrance animations based on route
 */
export default function Template({ children }: Props) {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === 'he';

  const pageType = getPageType(pathname);
  const { initial, animate, transition } = transitions[pageType];

  // Flip x-direction for RTL
  const adjustedInitial = { ...initial };
  if (isRTL && 'x' in adjustedInitial && typeof adjustedInitial.x === 'number') {
    adjustedInitial.x = -adjustedInitial.x;
  }

  return (
    <motion.div
      key={pathname}
      initial={adjustedInitial}
      animate={animate}
      transition={transition}
      style={{
        width: '100%',
        minHeight: '100%',
      }}
    >
      {children}
    </motion.div>
  );
}
