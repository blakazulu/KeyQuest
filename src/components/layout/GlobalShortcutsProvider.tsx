'use client';

import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';
import { ShortcutsHelp } from '@/components/ui/ShortcutsHelp';

/**
 * GlobalShortcutsProvider
 *
 * Provides global keyboard shortcuts functionality throughout the app.
 * Renders the shortcuts help modal when triggered.
 */
export function GlobalShortcutsProvider() {
  const { showHelp, handleCloseHelp } = useGlobalShortcuts();

  return <ShortcutsHelp isOpen={showHelp} onClose={handleCloseHelp} />;
}
