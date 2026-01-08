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

  // Amazing update popup
  if (isUpdating) {
    return (
      <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 animate-float"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative text-center text-white px-8 max-w-md">
          {/* Animated logo/icon */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto relative">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-spin-slow" />
              {/* Middle pulsing ring */}
              <div className="absolute inset-2 rounded-full border-4 border-white/30 animate-pulse" />
              {/* Inner icon */}
              <div className="absolute inset-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-16 h-16 text-white animate-bounce-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-3 animate-fade-in">
            Updating KeyQuest
          </h1>

          {/* Subtitle */}
          <p className="text-white/80 text-lg mb-8 animate-fade-in-delay">
            Getting the latest features and improvements...
          </p>

          {/* Progress bar */}
          <div className="relative h-3 bg-white/20 rounded-full overflow-hidden mb-4">
            <div
              className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>

          {/* Progress percentage */}
          <p className="text-white/60 text-sm">
            {Math.round(progress)}% complete
          </p>

          {/* Fun facts during update */}
          <div className="mt-8 text-white/50 text-sm animate-fade-in-delay-2">
            <p>Your progress is safely preserved</p>
          </div>
        </div>

        {/* Custom styles for animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-float { animation: float 15s ease-in-out infinite; }
          .animate-spin-slow { animation: spin-slow 8s linear infinite; }
          .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
          .animate-shimmer { animation: shimmer 2s ease-in-out infinite; }
          .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
          .animate-fade-in-delay { animation: fade-in 0.5s ease-out 0.2s forwards; opacity: 0; }
          .animate-fade-in-delay-2 { animation: fade-in 0.5s ease-out 0.4s forwards; opacity: 0; }
        `}</style>
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
