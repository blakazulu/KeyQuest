'use client';

import { useEffect, useState } from 'react';

const VERSION_STORAGE_KEY = 'keyquest-app-version';
const MIN_UPDATE_DISPLAY_MS = 5000; // Minimum 5 seconds for update animation

/**
 * VersionCheck component - checks if the app version has changed and
 * automatically clears caches to ensure the user gets the latest version.
 * User progress (localStorage) is preserved.
 */
export function VersionCheck() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);

        // Fetch current version from server (with cache bypass)
        const response = await fetch(`/api/version?t=${Date.now()}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          console.error('[VersionCheck] Failed to fetch version');
          return;
        }

        const { version: serverVersion } = await response.json();

        // First time user - just store version
        if (!storedVersion) {
          localStorage.setItem(VERSION_STORAGE_KEY, serverVersion);
          return;
        }

        // Version matches - no action needed
        if (storedVersion === serverVersion) {
          return;
        }

        // Version changed - show update UI and clear caches
        console.log(`[VersionCheck] Version changed: ${storedVersion} -> ${serverVersion}`);
        setIsUpdating(true);

        // Store new version BEFORE clearing caches
        localStorage.setItem(VERSION_STORAGE_KEY, serverVersion);

        // Start progress animation
        const startTime = Date.now();
        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const newProgress = Math.min((elapsed / MIN_UPDATE_DISPLAY_MS) * 100, 100);
          setProgress(newProgress);

          if (newProgress >= 100) {
            clearInterval(progressInterval);
          }
        }, 50);

        // 1. Unregister all service workers
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map(reg => reg.unregister()));
        }

        // 2. Clear all caches (service worker caches)
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
        }

        // 3. Wait for minimum display time, then reload
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(MIN_UPDATE_DISPLAY_MS - elapsed, 0);

        setTimeout(() => {
          clearInterval(progressInterval);
          window.location.reload();
        }, remainingTime + 500); // Extra 500ms for smooth transition

      } catch (error) {
        console.error('[VersionCheck] Error checking version:', error);
        setIsUpdating(false);
      }
    };

    // Small delay to let the app render first
    const timeout = setTimeout(checkVersion, 500);
    return () => clearTimeout(timeout);
  }, []);

  // Clean, calm update screen
  if (isUpdating) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center px-8 max-w-md">
          {/* Simple icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Updating KeyQuest
          </h1>

          {/* Subtitle */}
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Getting the latest version...
          </p>

          {/* Progress bar */}
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Progress percentage */}
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
            {Math.round(progress)}%
          </p>

          {/* Reassurance */}
          <p className="text-gray-400 dark:text-gray-500 text-xs">
            Your progress is safely preserved
          </p>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Get the current app version from env
 */
export function getAppVersion(): string {
  return process.env.NEXT_PUBLIC_APP_VERSION || '0.0.0';
}

/**
 * Get the stored version from localStorage
 */
export function getStoredVersion(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(VERSION_STORAGE_KEY);
}

/**
 * Force a version sync (useful for manual trigger from settings)
 */
export async function forceVersionSync(): Promise<void> {
  // 1. Unregister all service workers
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(reg => reg.unregister()));
  }

  // 2. Clear all caches
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
  }

  // 3. Reload
  window.location.reload();
}
