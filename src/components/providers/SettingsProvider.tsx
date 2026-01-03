'use client';

import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/stores/useSettingsStore';

/**
 * Applies user settings (font size) to the document.
 * Must be rendered inside the app to apply settings globally.
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const fontSize = useSettingsStore((s) => s.fontSize);
  const [mounted, setMounted] = useState(false);

  // Wait for client-side mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply font size and ensure no dark mode
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Remove dark mode class (dark mode not supported)
    root.classList.remove('dark');

    // Remove all font size classes
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');

    // Add the current font size class
    root.classList.add(`font-size-${fontSize}`);
  }, [fontSize, mounted]);

  return <>{children}</>;
}
