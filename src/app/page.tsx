import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Welcome to KeyQuest
          <span className="block text-blue-600">Your Typing Adventure</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          A fun, game-driven way to learn touch typing from the ground up.
          Master the keyboard through engaging lessons and games.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/practice"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Start Practicing
          </Link>
          <Link
            href="/levels"
            className="inline-flex items-center justify-center rounded-full border-2 border-zinc-300 px-8 py-3 text-lg font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
          >
            View Lessons
          </Link>
        </div>
      </div>

      <div className="mt-20 grid gap-8 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Learn Step by Step</h3>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Progressive lessons from home row to full fluency.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Track Your Speed</h3>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Watch your WPM improve with real-time stats.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
            <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Short Sessions</h3>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            5-10 minute lessons that fit your schedule.
          </p>
        </div>
      </div>
    </div>
  );
}
