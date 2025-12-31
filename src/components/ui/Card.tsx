'use client';

import { forwardRef } from 'react';

export type CardVariant = 'default' | 'raised' | 'interactive';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card style variant */
  variant?: CardVariant;
  /** Semantic HTML element to render */
  as?: 'div' | 'article' | 'section';
  /** Make the card clickable (adds hover effects) */
  interactive?: boolean;
}

/**
 * Card container component with multiple variants.
 *
 * @example
 * ```tsx
 * <Card variant="raised">
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </Card>
 *
 * <Card as="article" interactive onClick={handleClick}>
 *   Clickable card
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card(
    {
      variant = 'default',
      as: Component = 'div',
      interactive = false,
      className = '',
      children,
      ...props
    },
    ref
  ) {
    const variantClasses: Record<CardVariant, string> = {
      default: 'card',
      raised: 'card-raised',
      interactive: 'card cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5',
    };

    const classes = [
      variantClasses[variant],
      interactive && variant !== 'interactive'
        ? 'cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5'
        : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    );
  }
);

/**
 * Card header section
 */
export function CardHeader({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

/**
 * Card content/body section
 */
export function CardContent({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

/**
 * Card footer section
 */
export function CardFooter({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-4 pt-4 border-t border-border ${className}`} {...props}>
      {children}
    </div>
  );
}
