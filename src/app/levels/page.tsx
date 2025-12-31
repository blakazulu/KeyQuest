import Link from 'next/link';

const stages = [
  {
    id: 1,
    title: 'Keyboard Familiarity',
    description: 'Learn the keyboard layout and finger placement',
    lessons: 5,
    status: 'available',
  },
  {
    id: 2,
    title: 'Home Row',
    description: 'Master A S D F and J K L ;',
    lessons: 8,
    status: 'locked',
  },
  {
    id: 3,
    title: 'Letter Expansion',
    description: 'Add new letters gradually',
    lessons: 12,
    status: 'locked',
  },
  {
    id: 4,
    title: 'Words',
    description: 'Type real words',
    lessons: 10,
    status: 'locked',
  },
  {
    id: 5,
    title: 'Sentences',
    description: 'Complete sentences and paragraphs',
    lessons: 10,
    status: 'locked',
  },
  {
    id: 6,
    title: 'Fluency & Speed',
    description: 'Timed challenges and real-world text',
    lessons: 15,
    status: 'locked',
  },
];

export default function LevelsPage() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        Learning Path
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Progress through 6 stages to master touch typing
      </p>

      <div className="mt-8 space-y-4">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`rounded-2xl p-6 transition-all ${
              stage.status === 'available'
                ? 'bg-white shadow-sm hover:shadow-md dark:bg-zinc-900'
                : 'bg-zinc-100 opacity-60 dark:bg-zinc-900/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${
                    stage.status === 'available'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                      : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800'
                  }`}
                >
                  {stage.id}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {stage.title}
                  </h3>
                  <p className="text-sm text-zinc-500">{stage.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-zinc-500">{stage.lessons} lessons</span>
                {stage.status === 'available' ? (
                  <Link
                    href="/practice"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Start
                  </Link>
                ) : (
                  <span className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-500 dark:bg-zinc-800">
                    Locked
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-12 text-center text-sm text-zinc-500">
        Full lesson content and progression coming in Phase 4
      </p>
    </div>
  );
}
