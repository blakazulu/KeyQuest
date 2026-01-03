'use client';

import { ErrorFallback } from '@/components/ui/ErrorFallback';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root Error Boundary
 *
 * Catches errors that occur outside of locale layouts.
 */
export default function RootError({ error, reset }: ErrorProps) {
  return (
    <html lang="en">
      <body>
        <ErrorFallback
          error={error}
          reset={reset}
          title="Something went wrong"
          description="We're sorry, an unexpected error occurred. Please try again."
        />
      </body>
    </html>
  );
}
