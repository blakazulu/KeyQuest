'use client';

import { ReactNode } from 'react';

interface SettingsSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

/**
 * Card wrapper for a group of related settings.
 */
export function SettingsSection({ title, icon, children }: SettingsSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}
