'use client';

import { useId } from 'react';

interface VolumeSliderProps {
  value: number; // 0-1
  onChange: (value: number) => void;
  label: string;
  disabled?: boolean;
}

/**
 * Accessible volume slider (0-100%).
 */
export function VolumeSlider({ value, onChange, label, disabled = false }: VolumeSliderProps) {
  const id = useId();
  const percentage = Math.round(value * 100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value) / 100);
  };

  return (
    <div className={`flex items-center gap-3 ${disabled ? 'opacity-50' : ''}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      {/* Volume icon */}
      <span className="text-gray-500 dark:text-gray-400 w-5 text-center">
        {percentage === 0 ? '🔇' : percentage < 50 ? '🔉' : '🔊'}
      </span>

      {/* Slider */}
      <input
        id={id}
        type="range"
        min="0"
        max="100"
        value={percentage}
        onChange={handleChange}
        disabled={disabled}
        className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary disabled:cursor-not-allowed"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      />

      {/* Percentage display */}
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 text-right tabular-nums">
        {percentage}%
      </span>
    </div>
  );
}
