'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export interface ShortcutAction {
  key: string;
  description: string;
  action: () => void;
}

interface UseGlobalShortcutsOptions {
  onShowHelp?: () => void;
  enabled?: boolean;
}

/**
 * useGlobalShortcuts Hook
 *
 * Provides global keyboard shortcuts for navigation and actions.
 *
 * Shortcuts:
 * - ? : Show shortcuts help
 * - g + h : Go to Home
 * - g + l : Go to Levels
 * - g + d : Go to Dashboard
 * - g + g : Go to Games
 * - g + a : Go to Achievements
 * - g + s : Go to Settings
 * - Escape : Close modals (handled by individual modals)
 */
export function useGlobalShortcuts({
  onShowHelp,
  enabled = true,
}: UseGlobalShortcutsOptions = {}) {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const gKeyPressed = useRef(false);
  const gKeyTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // Check if we're in a typing context (should disable shortcuts)
  const isTypingContext = pathname.includes('/practice/') || pathname.includes('/games/');

  const navigate = useCallback(
    (path: string) => {
      router.push(`/${locale}${path}`);
    },
    [router, locale]
  );

  const handleShowHelp = useCallback(() => {
    if (onShowHelp) {
      onShowHelp();
    } else {
      setShowHelp(true);
    }
  }, [onShowHelp]);

  const handleCloseHelp = useCallback(() => {
    setShowHelp(false);
  }, []);

  useEffect(() => {
    if (!enabled || isTypingContext) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.getAttribute('role') === 'textbox'
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // ? key - Show shortcuts help
      if (e.key === '?' || (e.shiftKey && key === '/')) {
        e.preventDefault();
        handleShowHelp();
        return;
      }

      // Escape - Close help modal
      if (key === 'escape') {
        if (showHelp) {
          e.preventDefault();
          handleCloseHelp();
        }
        return;
      }

      // g key - Start navigation sequence
      if (key === 'g' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (!gKeyPressed.current) {
          gKeyPressed.current = true;
          // Reset after 1 second
          gKeyTimeout.current = setTimeout(() => {
            gKeyPressed.current = false;
          }, 1000);
        }
        return;
      }

      // Navigation shortcuts (g + key)
      if (gKeyPressed.current) {
        e.preventDefault();
        gKeyPressed.current = false;
        if (gKeyTimeout.current) {
          clearTimeout(gKeyTimeout.current);
        }

        switch (key) {
          case 'h':
            navigate('/');
            break;
          case 'l':
            navigate('/levels');
            break;
          case 'd':
            navigate('/dashboard');
            break;
          case 'g':
            navigate('/games');
            break;
          case 'a':
            navigate('/achievements');
            break;
          case 's':
            navigate('/settings');
            break;
          case 'p':
            navigate('/profile');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gKeyTimeout.current) {
        clearTimeout(gKeyTimeout.current);
      }
    };
  }, [enabled, isTypingContext, navigate, showHelp, handleShowHelp, handleCloseHelp]);

  return {
    showHelp,
    setShowHelp,
    handleCloseHelp,
  };
}

/**
 * Get list of all shortcuts for display in help modal
 */
export function getShortcutsList(): { category: string; shortcuts: { keys: string; description: string }[] }[] {
  return [
    {
      category: 'navigation',
      shortcuts: [
        { keys: 'g h', description: 'goToHome' },
        { keys: 'g l', description: 'goToLevels' },
        { keys: 'g d', description: 'goToDashboard' },
        { keys: 'g g', description: 'goToGames' },
        { keys: 'g a', description: 'goToAchievements' },
        { keys: 'g s', description: 'goToSettings' },
      ],
    },
    {
      category: 'general',
      shortcuts: [
        { keys: '?', description: 'showShortcuts' },
        { keys: 'Esc', description: 'closeModal' },
      ],
    },
  ];
}
