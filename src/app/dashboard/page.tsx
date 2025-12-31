'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        Your Dashboard
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Track your typing progress and statistics
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500">Current Level</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">Stage 1</p>
          <p className="text-sm text-zinc-500">Keyboard Familiarity</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500">Average Accuracy</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">--</p>
          <p className="text-sm text-zinc-500">No data yet</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500">Typing Speed</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">-- WPM</p>
          <p className="text-sm text-zinc-500">No data yet</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500">Practice Streak</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">0 days</p>
          <p className="text-sm text-zinc-500">Start practicing!</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Quick Actions
        </h2>
        <div className="mt-4 flex gap-4">
          <Link
            href="/practice"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Continue Practice
          </Link>
          <Link
            href="/levels"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            View All Levels
          </Link>
        </div>
      </div>

      <p className="mt-12 text-center text-sm text-zinc-500">
        Full dashboard with charts and statistics coming in Phase 7
      </p>
    </div>
  );
}
