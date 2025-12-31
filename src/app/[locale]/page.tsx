import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  OrganizationJsonLd,
  WebsiteJsonLd,
  EducationalCourseJsonLd,
  FAQJsonLd,
  SpeakableJsonLd,
} from '@/components/seo/JsonLd';

export default function Home() {
  const t = useTranslations('home');

  // FAQ items for JSON-LD schema
  const faqItems = [
    {
      question: t('faq.items.whatIsTouchTyping.question'),
      answer: t('faq.items.whatIsTouchTyping.answer'),
    },
    {
      question: t('faq.items.howLongToLearn.question'),
      answer: t('faq.items.howLongToLearn.answer'),
    },
    {
      question: t('faq.items.whatIsWpm.question'),
      answer: t('faq.items.whatIsWpm.answer'),
    },
    {
      question: t('faq.items.whatIsHomeRow.question'),
      answer: t('faq.items.whatIsHomeRow.answer'),
    },
    {
      question: t('faq.items.isFree.question'),
      answer: t('faq.items.isFree.answer'),
    },
  ];

  return (
    <>
      {/* Structured Data for SEO/AEO/GEO */}
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <EducationalCourseJsonLd />
      <FAQJsonLd faqs={faqItems} />
      <SpeakableJsonLd
        name="KeyQuest - Touch Typing Learning"
        description="Learn touch typing the fun way"
        speakableSelectors={['#hero-description', '#why-learn', '.faq-answer']}
      />

      <div className="flex flex-col items-center justify-center py-16">
        {/* Hero Section */}
        <header className="text-center">
          <h1 className="font-display text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {t('welcome')}
            <span className="block text-blue-600">{t('tagline')}</span>
          </h1>

          <p
            id="hero-description"
            className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400"
          >
            {t('description')}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/practice"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
            >
              {t('startPracticing')}
            </Link>
            <Link
              href="/levels"
              className="inline-flex items-center justify-center rounded-full border-2 border-zinc-300 px-8 py-3 text-lg font-semibold text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
            >
              {t('viewLessons')}
            </Link>
          </div>
        </header>

        {/* Features Section */}
        <section className="mt-20 grid gap-8 sm:grid-cols-3" aria-label="Features">
          <article className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {t('features.learnStepByStep.title')}
            </h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {t('features.learnStepByStep.description')}
            </p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {t('features.trackSpeed.title')}
            </h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {t('features.trackSpeed.description')}
            </p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {t('features.shortSessions.title')}
            </h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {t('features.shortSessions.description')}
            </p>
          </article>
        </section>

        {/* Why Learn Touch Typing Section - Question-based heading for AEO */}
        <section id="why-learn" className="mt-20 max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {t('whyLearn.title')}
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            {t('whyLearn.description')}
          </p>
        </section>

        {/* Key Concepts Section - Entity definitions for GEO */}
        <section className="mt-16 w-full max-w-4xl" aria-labelledby="concepts-title">
          <h2
            id="concepts-title"
            className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100"
          >
            {t('concepts.title')}
          </h2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900">
              <dt className="font-semibold text-zinc-900 dark:text-zinc-100">
                {t('concepts.touchTyping.term')}
              </dt>
              <dd className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {t('concepts.touchTyping.definition')}
              </dd>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900">
              <dt className="font-semibold text-zinc-900 dark:text-zinc-100">
                {t('concepts.wpm.term')}
              </dt>
              <dd className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {t('concepts.wpm.definition')}
              </dd>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900">
              <dt className="font-semibold text-zinc-900 dark:text-zinc-100">
                {t('concepts.accuracy.term')}
              </dt>
              <dd className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {t('concepts.accuracy.definition')}
              </dd>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900">
              <dt className="font-semibold text-zinc-900 dark:text-zinc-100">
                {t('concepts.homeRow.term')}
              </dt>
              <dd className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {t('concepts.homeRow.definition')}
              </dd>
            </div>
          </dl>
        </section>

        {/* FAQ Section - Question-based content for AEO */}
        <section className="mt-20 w-full max-w-3xl" aria-labelledby="faq-title">
          <h2
            id="faq-title"
            className="font-display text-2xl font-bold text-zinc-900 dark:text-zinc-100"
          >
            {t('faq.title')}
          </h2>
          <div className="mt-8 space-y-6">
            {faqItems.map((item, index) => (
              <article
                key={index}
                className="rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900"
              >
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {item.question}
                </h3>
                <p className="faq-answer mt-3 text-zinc-600 dark:text-zinc-400">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
