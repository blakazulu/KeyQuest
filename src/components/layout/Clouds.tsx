'use client';

/**
 * Animated background clouds component.
 * Renders gentle, drifting clouds that add atmosphere to the background.
 * Respects reduced motion preferences and adapts to dark mode.
 */
export function Clouds() {
  return (
    <div className="clouds-container" aria-hidden="true">
      <div className="cloud cloud-1" />
      <div className="cloud cloud-2" />
      <div className="cloud cloud-3" />
      <div className="cloud cloud-4" />
      <div className="cloud cloud-5" />
    </div>
  );
}
