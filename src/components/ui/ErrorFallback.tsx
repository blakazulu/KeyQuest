'use client';

import Image from 'next/image';

interface ErrorFallbackProps {
  error?: Error & { digest?: string };
  reset?: () => void;
  title?: string;
  description?: string;
  showHomeLink?: boolean;
}

/**
 * ErrorFallback Component
 *
 * A reusable error display component for error boundaries.
 * Provides a friendly error message with recovery options.
 */
export function ErrorFallback({
  error,
  reset,
  title = 'Something went wrong',
  description = 'We\'re sorry, an unexpected error occurred. Please try again.',
  showHomeLink = true,
}: ErrorFallbackProps) {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center p-8"
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-md text-center">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/logo-64.png"
            alt="KeyQuest"
            width={64}
            height={64}
            className="opacity-60"
          />
        </div>

        {/* Error Icon */}
        <div className="mb-4 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-error-soft flex items-center justify-center">
            <svg
              className="w-8 h-8 text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-display text-2xl font-bold text-foreground mb-3">
          {title}
        </h1>

        {/* Description */}
        <p className="text-muted text-lg leading-relaxed mb-6">
          {description}
        </p>

        {/* Error details (only in development) */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 text-left bg-surface-raised rounded-lg p-4 text-sm">
            <summary className="cursor-pointer text-muted hover:text-foreground">
              Error details
            </summary>
            <pre className="mt-2 overflow-auto text-error text-xs">
              {error.message}
              {error.digest && (
                <>
                  {'\n\n'}Digest: {error.digest}
                </>
              )}
            </pre>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {reset && (
            <button
              onClick={reset}
              className="btn btn-primary"
            >
              Try Again
            </button>
          )}
          {showHomeLink && (
            // eslint-disable-next-line @next/next/no-html-link-for-pages -- Using <a> intentionally in error boundary since Next.js router may be broken
            <a
              href="/"
              className="btn btn-secondary"
            >
              Go to Home
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
