'use client';

import { useState } from 'react';

export default function PracticePage() {
  const [text] = useState('The quick brown fox jumps over the lazy dog.');

  return (
    <div className="flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        Practice Mode
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Start typing to begin your practice session
      </p>

      <div className="mt-12 w-full max-w-3xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
          <p className="typing-text text-2xl leading-relaxed text-zinc-400">
            {text}
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">0</p>
            <p className="text-sm text-zinc-500">WPM</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">100%</p>
            <p className="text-sm text-zinc-500">Accuracy</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">0:00</p>
            <p className="text-sm text-zinc-500">Time</p>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Typing functionality coming in Phase 2
        </p>
      </div>
    </div>
  );
}
