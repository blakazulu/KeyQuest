import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  OrganizationJsonLd,
  WebsiteJsonLd,
  EducationalCourseJsonLd,
  FAQJsonLd,
  SpeakableJsonLd,
} from '@/components/seo/JsonLd';
import { Card, CardContent, Button, IconCircle } from '@/components/ui';

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

      <div className="flex flex-col items-center justify-center py-12">
        {/* Hero Section - Playful & Fun! */}
        <header className="text-center relative">
          {/* Floating decorative emojis */}
          <div className="absolute -top-4 -left-8 text-4xl animate-float opacity-70" aria-hidden="true">⌨️</div>
          <div className="absolute -top-2 -right-6 text-3xl animate-float opacity-70" style={{ animationDelay: '1s' }} aria-hidden="true">🎮</div>
          <div className="absolute top-20 -left-12 text-2xl animate-float opacity-60" style={{ animationDelay: '0.5s' }} aria-hidden="true">✨</div>
          <div className="absolute top-16 -right-10 text-2xl animate-float opacity-60" style={{ animationDelay: '1.5s' }} aria-hidden="true">🚀</div>

          <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight">
            <span className="text-foreground">{t('welcome')}</span>
            <span
              className="block mt-2 bg-gradient-to-r from-primary via-accent-purple to-accent-pink bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: 'text' }}
            >
              {t('tagline')}
            </span>
          </h1>

          <p
            id="hero-description"
            className="mt-8 max-w-2xl text-xl text-muted mx-auto"
          >
            {t('description')} 🎯
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/practice">
              <Button variant="game" size="lg" className="text-lg px-10">
                🎮 {t('startPracticing')}
              </Button>
            </Link>
            <Link href="/levels">
              <Button variant="secondary" size="lg" className="text-lg">
                📚 {t('viewLessons')}
              </Button>
            </Link>
          </div>
        </header>

        {/* Features Section - With playful icons */}
        <section className="mt-24 grid gap-8 sm:grid-cols-3 max-w-5xl" aria-label="Features">
          <Card className="text-center hover:scale-105 transition-transform">
            <CardContent className="p-8">
              <div className="text-5xl mb-4 animate-float">💡</div>
              <h3 className="font-display text-xl font-bold text-foreground">
                {t('features.learnStepByStep.title')}
              </h3>
              <p className="mt-3 text-muted">
                {t('features.learnStepByStep.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:scale-105 transition-transform">
            <CardContent className="p-8">
              <div className="text-5xl mb-4 animate-float" style={{ animationDelay: '0.3s' }}>⚡</div>
              <h3 className="font-display text-xl font-bold text-foreground">
                {t('features.trackSpeed.title')}
              </h3>
              <p className="mt-3 text-muted">
                {t('features.trackSpeed.description')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:scale-105 transition-transform">
            <CardContent className="p-8">
              <div className="text-5xl mb-4 animate-float" style={{ animationDelay: '0.6s' }}>⏱️</div>
              <h3 className="font-display text-xl font-bold text-foreground">
                {t('features.shortSessions.title')}
              </h3>
              <p className="mt-3 text-muted">
                {t('features.shortSessions.description')}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Why Learn Touch Typing Section */}
        <section id="why-learn" className="mt-24 max-w-3xl text-center">
          <h2 className="font-display text-4xl font-bold text-foreground">
            🤔 {t('whyLearn.title')}
          </h2>
          <p className="mt-6 text-xl text-muted leading-relaxed">
            {t('whyLearn.description')}
          </p>
        </section>

        {/* Key Concepts Section */}
        <section className="mt-20 w-full max-w-4xl" aria-labelledby="concepts-title">
          <h2
            id="concepts-title"
            className="font-display text-3xl font-bold text-foreground text-center mb-8"
          >
            📖 {t('concepts.title')}
          </h2>
          <dl className="grid gap-6 sm:grid-cols-2">
            <Card className="card-info">
              <CardContent className="p-5">
                <dt className="font-bold text-lg text-foreground flex items-center gap-2">
                  <span>🎯</span> {t('concepts.touchTyping.term')}
                </dt>
                <dd className="mt-2 text-muted">
                  {t('concepts.touchTyping.definition')}
                </dd>
              </CardContent>
            </Card>
            <Card className="card-success">
              <CardContent className="p-5">
                <dt className="font-bold text-lg text-foreground flex items-center gap-2">
                  <span>🏎️</span> {t('concepts.wpm.term')}
                </dt>
                <dd className="mt-2 text-muted">
                  {t('concepts.wpm.definition')}
                </dd>
              </CardContent>
            </Card>
            <Card className="card-warning">
              <CardContent className="p-5">
                <dt className="font-bold text-lg text-foreground flex items-center gap-2">
                  <span>🎯</span> {t('concepts.accuracy.term')}
                </dt>
                <dd className="mt-2 text-muted">
                  {t('concepts.accuracy.definition')}
                </dd>
              </CardContent>
            </Card>
            <Card className="card-purple">
              <CardContent className="p-5">
                <dt className="font-bold text-lg text-foreground flex items-center gap-2">
                  <span>🏠</span> {t('concepts.homeRow.term')}
                </dt>
                <dd className="mt-2 text-muted">
                  {t('concepts.homeRow.definition')}
                </dd>
              </CardContent>
            </Card>
          </dl>
        </section>

        {/* FAQ Section */}
        <section className="mt-24 w-full max-w-3xl" aria-labelledby="faq-title">
          <h2
            id="faq-title"
            className="font-display text-3xl font-bold text-foreground text-center mb-10"
          >
            ❓ {t('faq.title')}
          </h2>
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-foreground">
                    {item.question}
                  </h3>
                  <p className="faq-answer mt-3 text-muted leading-relaxed">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-24 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">
            Ready to start your typing adventure? 🚀
          </h2>
          <Link href="/practice">
            <Button variant="game" size="lg" className="text-xl px-12 py-4">
              🎮 Let&apos;s Go!
            </Button>
          </Link>
        </section>
      </div>
    </>
  );
}
