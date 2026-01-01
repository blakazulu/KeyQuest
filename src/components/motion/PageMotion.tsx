'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';
import { staggerContainer, staggerItem, popIn } from '@/lib/pageTransitions';

type PageContentProps = {
  children: ReactNode;
  className?: string;
  /** Enable staggered animation for direct children */
  stagger?: boolean;
};

/**
 * Wrapper for page content with optional staggered animations
 *
 * Use this inside pages to add staggered entrance animations to children:
 * ```tsx
 * <PageContent stagger>
 *   <Card>...</Card>
 *   <Card>...</Card>
 * </PageContent>
 * ```
 */
export function PageContent({ children, className = '', stagger = false }: PageContentProps) {
  if (!stagger) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
}

type MotionItemProps = {
  children: ReactNode;
  className?: string;
  /** Custom animation variants */
  variants?: Variants;
  /** Use pop animation instead of slide */
  pop?: boolean;
};

/**
 * Animated item for use inside PageContent with stagger
 *
 * ```tsx
 * <PageContent stagger>
 *   <MotionItem>First item</MotionItem>
 *   <MotionItem>Second item (delayed)</MotionItem>
 * </PageContent>
 * ```
 */
export function MotionItem({
  children,
  className = '',
  variants,
  pop = false,
}: MotionItemProps) {
  return (
    <motion.div
      className={className}
      variants={variants || (pop ? popIn : staggerItem)}
    >
      {children}
    </motion.div>
  );
}

type MotionCardProps = {
  children: ReactNode;
  className?: string;
  /** Delay in seconds before animation starts */
  delay?: number;
  /** Hover effect intensity: 'none' | 'subtle' | 'lift' */
  hover?: 'none' | 'subtle' | 'lift';
};

/**
 * Animated card with entrance and hover effects
 */
export function MotionCard({
  children,
  className = '',
  delay = 0,
  hover = 'subtle',
}: MotionCardProps) {
  const hoverVariants = {
    none: {},
    subtle: { scale: 1.02 },
    lift: { scale: 1.03, y: -4 },
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 260,
        damping: 25,
      }}
      whileHover={hoverVariants[hover]}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

type MotionFadeProps = {
  children: ReactNode;
  className?: string;
  /** Direction to fade from */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /** Delay in seconds */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
};

/**
 * Simple fade with optional directional movement
 */
export function MotionFade({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.4,
}: MotionFadeProps) {
  const directionMap = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: {},
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        delay,
        duration,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

type MotionScaleProps = {
  children: ReactNode;
  className?: string;
  /** Scale from this value to 1 */
  from?: number;
  /** Delay in seconds */
  delay?: number;
};

/**
 * Scale entrance animation (great for modals, popovers)
 */
export function MotionScale({
  children,
  className = '',
  from = 0.9,
  delay = 0,
}: MotionScaleProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: from }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: from }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
    >
      {children}
    </motion.div>
  );
}

type MotionListProps = {
  children: ReactNode[];
  className?: string;
  /** Delay between each item */
  staggerDelay?: number;
  /** Initial delay before first item */
  initialDelay?: number;
};

/**
 * Staggered list animation
 *
 * ```tsx
 * <MotionList staggerDelay={0.1}>
 *   {items.map(item => <div key={item.id}>{item.name}</div>)}
 * </MotionList>
 * ```
 */
export function MotionList({
  children,
  className = '',
  staggerDelay = 0.08,
  initialDelay = 0.1,
}: MotionListProps) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: initialDelay,
          },
        },
      }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            initial: { opacity: 0, y: 15 },
            animate: {
              opacity: 1,
              y: 0,
              transition: {
                type: 'spring',
                stiffness: 300,
                damping: 24,
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

type MotionHeroProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Hero section animation with dramatic entrance
 */
export function MotionHero({ children, className = '' }: MotionHeroProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
