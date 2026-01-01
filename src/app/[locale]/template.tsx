'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useParams } from 'next/navigation';
import {
  getPageType,
  pageVariants,
  getRTLVariants,
} from '@/lib/pageTransitions';

type Props = {
  children: React.ReactNode;
};

/**
 * Page transition template
 *
 * This component wraps every page and applies custom animations
 * based on the page type. Each route has its own unique entrance
 * and exit animation for a polished, game-like feel.
 *
 * Animation styles:
 * - Home: Grand rise from below with subtle scale
 * - Levels: Zoom in like approaching a treasure map
 * - Dashboard: Slide up with card-like feel
 * - Practice: Quick slide from side (RTL-aware)
 * - Lesson: Dramatic focus zoom (tunnel vision effect)
 */
export default function Template({ children }: Props) {
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === 'he';

  // Determine page type and get appropriate animation
  const pageType = getPageType(pathname);
  const baseVariants = pageVariants[pageType];

  // Apply RTL adjustments for directional animations
  const variants = getRTLVariants(baseVariants, isRTL);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        className="page-transition-wrapper"
        style={{
          // Prevent layout shift during animations
          willChange: 'transform, opacity',
          transformOrigin: 'center top',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
