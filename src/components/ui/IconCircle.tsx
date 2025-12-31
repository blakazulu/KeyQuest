'use client';

import { forwardRef } from 'react';

export type IconCircleVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

export type IconCircleSize = 'sm' | 'md' | 'lg';

export interface IconCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon circle style variant */
  variant?: IconCircleVariant;
  /** Icon circle size */
  size?: IconCircleSize;
}

/**
 * Colored icon container for feature highlights and stats.
 *
 * @example
 * ```tsx
 * <IconCircle variant="primary" size="lg">
 *   <KeyboardIcon className="w-6 h-6" />
 * </IconCircle>
 *
 * <IconCircle variant="success">
 *   <CheckIcon className="w-5 h-5" />
 * </IconCircle>
 * ```
 */
export const IconCircle = forwardRef<HTMLDivElement, IconCircleProps>(
  function IconCircle(
    {
      variant = 'default',
      size = 'md',
      className = '',
      children,
      ...props
    },
    ref
  ) {
    const variantClasses: Record<IconCircleVariant, string> = {
      default: 'icon-circle-default',
      primary: 'icon-circle-primary',
      success: 'icon-circle-success',
      warning: 'icon-circle-warning',
      error: 'icon-circle-error',
      info: 'icon-circle-info',
    };

    const sizeClasses: Record<IconCircleSize, string> = {
      sm: 'icon-circle-sm',
      md: 'icon-circle-md',
      lg: 'icon-circle-lg',
    };

    const classes = [
      'icon-circle',
      variantClasses[variant],
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} aria-hidden="true" {...props}>
        {children}
      </div>
    );
  }
);
