'use client';

import { forwardRef } from 'react';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'xp'
  | 'streak';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Badge style variant */
  variant?: BadgeVariant;
  /** Badge size */
  size?: BadgeSize;
  /** Icon to show before text */
  icon?: React.ReactNode;
}

/**
 * Badge component for status indicators, tags, and gamification elements.
 *
 * @example
 * ```tsx
 * <Badge variant="success">Completed</Badge>
 * <Badge variant="xp" icon={<StarIcon />}>150 XP</Badge>
 * <Badge variant="streak">5 day streak</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  function Badge(
    {
      variant = 'default',
      size = 'md',
      icon,
      className = '',
      children,
      ...props
    },
    ref
  ) {
    const variantClasses: Record<BadgeVariant, string> = {
      default: 'badge-default',
      primary: 'badge-primary',
      success: 'badge-success',
      warning: 'badge-warning',
      error: 'badge-error',
      info: 'badge-info',
      xp: 'badge-xp',
      streak: 'badge-streak',
    };

    const sizeClasses: Record<BadgeSize, string> = {
      sm: 'badge-sm',
      md: '',
    };

    const classes = [
      'badge',
      variantClasses[variant],
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span ref={ref} className={classes} {...props}>
        {icon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </span>
    );
  }
);
