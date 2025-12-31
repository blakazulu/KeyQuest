'use client';

import { forwardRef, useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text for the input */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Hint text to display below the input */
  hint?: string;
  /** Hide the label visually (still accessible to screen readers) */
  hideLabel?: boolean;
}

/**
 * Text input component with label, error, and hint support.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 * />
 *
 * <Input
 *   label="Username"
 *   error="Username is already taken"
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      error,
      hint,
      hideLabel = false,
      className = '',
      id: providedId,
      ...props
    },
    ref
  ) {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    const hasError = Boolean(error);

    const inputClasses = [
      'input',
      hasError ? 'input-error' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const describedBy = [
      hasError ? errorId : null,
      hint ? hintId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className={hideLabel ? 'sr-only' : 'input-label'}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          {...props}
        />

        {hint && !hasError && (
          <p id={hintId} className="input-hint">
            {hint}
          </p>
        )}

        {hasError && (
          <p id={errorId} className="input-error-message" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
