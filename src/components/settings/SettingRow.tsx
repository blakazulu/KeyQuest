'use client';

import { ReactNode } from 'react';

interface SettingRowProps {
  label: string;
  description?: string;
  children: ReactNode;
  /** Set to true to make the control a full-width block (for selectors) */
  block?: boolean;
}

/**
 * Single setting row with label, optional description, and control.
 */
export function SettingRow({ label, description, children, block = false }: SettingRowProps) {
  if (block) {
    return (
      <div className="py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        <div className="mb-3">
          <p className="font-medium text-gray-800 dark:text-gray-100">{label}</p>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex-1 ltr:pr-4 rtl:pl-4">
        <p className="font-medium text-gray-800 dark:text-gray-100">{label}</p>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );
}
