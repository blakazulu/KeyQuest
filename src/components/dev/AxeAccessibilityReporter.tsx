'use client';

import { useEffect } from 'react';

/**
 * AxeAccessibilityReporter
 *
 * Development-only component that runs axe-core accessibility audits
 * and reports violations to the browser console.
 *
 * Only active in development mode - completely stripped in production.
 *
 * Usage:
 * Add to your root layout or specific pages you want to audit.
 */
export function AxeAccessibilityReporter() {
  useEffect(() => {
    // Only run in development and in browser
    if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
      return;
    }

    // Dynamic import to prevent axe-core from being bundled in production
    const initAxe = async () => {
      try {
        const axe = await import('@axe-core/react');
        const React = await import('react');
        const ReactDOM = await import('react-dom');

        // Run axe with a delay to allow page to fully render
        setTimeout(() => {
          axe.default(React.default, ReactDOM.default, 1000, {
            // Configure axe rules
            rules: [
              // WCAG 2.2 Level AA rules
              { id: 'color-contrast', enabled: true },
              { id: 'focus-visible', enabled: true },
              { id: 'focus-order-semantics', enabled: true },
              { id: 'label', enabled: true },
              { id: 'landmark-one-main', enabled: true },
              { id: 'page-has-heading-one', enabled: true },
              { id: 'region', enabled: true },
              { id: 'skip-link', enabled: true },
              { id: 'target-size', enabled: true },
            ],
          });
        }, 1000);
      } catch (error) {
        // Silently fail if axe-core is not available
        console.warn('Axe accessibility reporter failed to initialize:', error);
      }
    };

    initAxe();
  }, []);

  // This component renders nothing
  return null;
}

export default AxeAccessibilityReporter;
