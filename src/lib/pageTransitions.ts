import { Variants, Transition } from 'framer-motion';

export type PageType = 'home' | 'levels' | 'dashboard' | 'practice' | 'lesson' | 'default';

/**
 * Detects the page type from the current pathname
 */
export function getPageType(pathname: string): PageType {
  // Remove locale prefix (e.g., /en/, /he/)
  const pathWithoutLocale = pathname.replace(/^\/(en|he)/, '') || '/';

  if (pathWithoutLocale === '/' || pathWithoutLocale === '') {
    return 'home';
  }
  if (pathWithoutLocale.startsWith('/levels')) {
    return 'levels';
  }
  if (pathWithoutLocale.startsWith('/dashboard')) {
    return 'dashboard';
  }
  if (pathWithoutLocale.match(/^\/practice\/[^/]+/)) {
    return 'lesson'; // Active lesson with lessonId
  }
  if (pathWithoutLocale.startsWith('/practice')) {
    return 'practice';
  }
  return 'default';
}

/**
 * Smooth spring transition for natural movement
 */
const smoothSpring: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 25,
};

/**
 * Quick snap transition for responsive feel
 */
const quickSnap: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

/**
 * Elegant ease for dramatic effects
 */
const elegantEase: Transition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth deceleration
};

/**
 * Page-specific animation variants
 */
export const pageVariants: Record<PageType, Variants> = {
  // Home: Grand entrance - rise from below with scale and glow
  home: {
    initial: {
      opacity: 0,
      y: 60,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        ...elegantEase,
        duration: 0.6,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.02,
      transition: {
        duration: 0.3,
      },
    },
  },

  // Levels/Quest Map: Zoom in like approaching a treasure map
  levels: {
    initial: {
      opacity: 0,
      scale: 0.85,
      rotateX: 10,
      transformPerspective: 1200,
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        ...smoothSpring,
        opacity: { duration: 0.4 },
      },
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: {
        duration: 0.25,
      },
    },
  },

  // Dashboard: Slide up with cards feel
  dashboard: {
    initial: {
      opacity: 0,
      y: 80,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        ...smoothSpring,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      transition: {
        duration: 0.2,
      },
    },
  },

  // Practice selection: Quick slide from side
  practice: {
    initial: {
      opacity: 0,
      x: 100,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: quickSnap,
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.2,
      },
    },
  },

  // Active lesson: Dramatic focus zoom (tunnel vision)
  lesson: {
    initial: {
      opacity: 0,
      scale: 1.15,
      filter: 'blur(10px)',
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        filter: { duration: 0.3 },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  },

  // Default: Simple fade
  default: {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  },
};

/**
 * RTL-aware variants (flips x-axis animations)
 */
export function getRTLVariants(variants: Variants, isRTL: boolean): Variants {
  if (!isRTL) return variants;

  const flipX = (value: number | undefined) => (value !== undefined ? -value : undefined);

  return {
    initial: {
      ...variants.initial,
      x: flipX((variants.initial as Record<string, unknown>)?.x as number | undefined),
    },
    animate: variants.animate,
    exit: {
      ...variants.exit,
      x: flipX((variants.exit as Record<string, unknown>)?.x as number | undefined),
    },
  };
}

/**
 * Stagger children animation for lists/grids
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/**
 * Child item animation for staggered lists
 */
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: smoothSpring,
  },
};

/**
 * Pop-in effect for interactive elements
 */
export const popIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.15,
    },
  },
};

/**
 * Slide up for modals and overlays
 */
export const slideUp: Variants = {
  initial: {
    opacity: 0,
    y: '100%',
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: smoothSpring,
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: {
      duration: 0.25,
    },
  },
};

/**
 * Backdrop fade for modals
 */
export const backdropFade: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      delay: 0.1,
    },
  },
};
