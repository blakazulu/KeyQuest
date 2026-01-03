'use client';

import { useEffect, useState, useRef } from 'react';

interface ScreenReaderAnnounceProps {
  /** The message to announce */
  message: string;
  /** Politeness level for announcements */
  politeness?: 'polite' | 'assertive';
  /** Optional className for the container */
  className?: string;
}

/**
 * ScreenReaderAnnounce Component
 *
 * Announces messages to screen readers using an ARIA live region.
 * The message is visually hidden but announced by screen readers.
 *
 * Usage:
 * - Use 'polite' for non-critical updates (default)
 * - Use 'assertive' for important/urgent messages
 *
 * @example
 * ```tsx
 * const [announcement, setAnnouncement] = useState('');
 *
 * // When an error occurs
 * setAnnouncement('Error: Wrong key pressed');
 *
 * <ScreenReaderAnnounce message={announcement} />
 * ```
 */
export function ScreenReaderAnnounce({
  message,
  politeness = 'polite',
  className = '',
}: ScreenReaderAnnounceProps) {
  // Track displayed message separately for the clear timeout
  const displayedMessageRef = useRef('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [, forceUpdate] = useState(0);

  // Update the ref and trigger re-render when message changes
  if (message && message !== displayedMessageRef.current) {
    displayedMessageRef.current = message;
  }

  useEffect(() => {
    if (!message) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear after a short delay to allow for repeated announcements
    timeoutRef.current = setTimeout(() => {
      displayedMessageRef.current = '';
      forceUpdate((n) => n + 1);
    }, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className={`sr-only ${className}`}
    >
      {displayedMessageRef.current}
    </div>
  );
}

/**
 * Hook to manage screen reader announcements
 *
 * @example
 * ```tsx
 * const { announce, Announcer } = useScreenReaderAnnounce();
 *
 * // Announce something
 * announce('You typed 10 words correctly!');
 *
 * // In your JSX
 * return (
 *   <>
 *     <Announcer />
 *     ...your content...
 *   </>
 * );
 * ```
 */
export function useScreenReaderAnnounce(politeness: 'polite' | 'assertive' = 'polite') {
  const [message, setMessage] = useState('');
  const counterRef = useRef(0);

  const announce = (text: string) => {
    // Increment counter to force re-announcement of same message
    counterRef.current += 1;
    setMessage(`${text} (${counterRef.current})`);
  };

  const Announcer = () => (
    <ScreenReaderAnnounce message={message} politeness={politeness} />
  );

  return { announce, Announcer, message };
}
