'use client';

/**
 * Global Error Boundary
 *
 * This is the last resort error boundary that catches errors in the root layout itself.
 * It must define its own <html> and <body> tags since the root layout might have errored.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <title>Error - KeyQuest</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          backgroundColor: '#f0f9fd',
          color: '#1E293B',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          margin: 0,
        }}
      >
        <div
          style={{
            maxWidth: '28rem',
            textAlign: 'center',
          }}
          role="alert"
          aria-live="assertive"
        >
          {/* Error Icon */}
          <div
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              backgroundColor: '#FFF0F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF4757"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '0.75rem',
            }}
          >
            Something went wrong
          </h1>

          {/* Description */}
          <p
            style={{
              color: '#64748B',
              fontSize: '1.125rem',
              lineHeight: 1.6,
              marginBottom: '1.5rem',
            }}
          >
            We&apos;re sorry, an unexpected error occurred. Please try again.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={reset}
              style={{
                backgroundColor: '#FF7B4A',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Using <a> intentionally in error boundary since Next.js router may be broken */}
            <a
              href="/"
              style={{
                backgroundColor: 'white',
                color: '#1E293B',
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: '1px solid #E2E8F0',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
              }}
            >
              Go to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
