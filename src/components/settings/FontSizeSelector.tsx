'use client';

type FontSize = 'small' | 'medium' | 'large';

interface FontSizeSelectorProps {
  value: FontSize;
  onChange: (size: FontSize) => void;
  labels: {
    small: string;
    medium: string;
    large: string;
  };
}

/**
 * 3-button font size selector (Small / Medium / Large).
 */
export function FontSizeSelector({ value, onChange, labels }: FontSizeSelectorProps) {
  const options: { id: FontSize; label: string; preview: string }[] = [
    { id: 'small', label: labels.small, preview: 'A' },
    { id: 'medium', label: labels.medium, preview: 'A' },
    { id: 'large', label: labels.large, preview: 'A' },
  ];

  const fontSizeClasses: Record<FontSize, string> = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Font size selection">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="radio"
          aria-checked={value === opt.id}
          onClick={() => onChange(opt.id)}
          className={`
            flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl border-2 transition-all
            ${value === opt.id
              ? 'border-primary bg-primary/10 text-primary dark:border-primary dark:bg-primary/20 dark:text-primary-light'
              : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
            }
          `}
        >
          <span className={`font-bold ${fontSizeClasses[opt.id]}`}>{opt.preview}</span>
          <span className="text-xs">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
