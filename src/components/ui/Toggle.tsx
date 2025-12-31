'use client';

import { forwardRef, useId } from 'react';

export type ToggleSize = 'sm' | 'md';

export interface ToggleProps {
  /** Whether the toggle is checked */
  checked: boolean;
  /** Callback when the toggle state changes */
  onChange: (checked: boolean) => void;
  /** Label for the toggle (required for accessibility) */
  label: string;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Toggle size */
  size?: ToggleSize;
  /** Hide the label visually (still accessible to screen readers) */
  hideLabel?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** ID for the toggle */
  id?: string;
}

/**
 * Toggle switch component with accessibility support.
 *
 * @example
 * ```tsx
 * const [enabled, setEnabled] = useState(false);
 *
 * <Toggle
 *   checked={enabled}
 *   onChange={setEnabled}
 *   label="Enable notifications"
 * />
 *
 * <Toggle
 *   checked={enabled}
 *   onChange={setEnabled}
 *   label="Dark mode"
 *   hideLabel
 * />
 * ```
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  function Toggle(
    {
      checked,
      onChange,
      label,
      disabled = false,
      size = 'md',
      hideLabel = false,
      className = '',
      id: providedId,
    },
    ref
  ) {
    const generatedId = useId();
    const id = providedId || generatedId;

    const sizeClasses: Record<ToggleSize, string> = {
      sm: 'toggle-sm',
      md: '',
    };

    const toggleClasses = [
      'toggle',
      checked ? 'toggle-checked' : '',
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const handleClick = () => {
      if (!disabled) {
        onChange(!checked);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <div className="flex items-center gap-3">
        <button
          ref={ref}
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={`${id}-label`}
          disabled={disabled}
          className={toggleClasses}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          <span className="toggle-thumb" />
        </button>
        <label
          id={`${id}-label`}
          htmlFor={id}
          className={`text-body-sm cursor-pointer select-none ${
            hideLabel ? 'sr-only' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {label}
        </label>
      </div>
    );
  }
);
