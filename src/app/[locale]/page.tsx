import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  OrganizationJsonLd,
  WebsiteJsonLd,
  EducationalCourseJsonLd,
  FAQJsonLd,
  SpeakableJsonLd,
} from '@/components/seo/JsonLd';
import { Button } from '@/components/ui';

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

      <div className="flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-5xl text-center pb-16 px-4">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            {t('headline')}
          </h1>

          <p
            id="hero-description"
            className="mt-2 max-w-3xl mx-auto text-lg text-muted leading-snug"
          >
            {t('subtitle')}
          </p>

          {/* Hero Keyboard Illustration */}
          <div className="mx-4 sm:-mx-8 lg:-mx-16 relative">
            <Image
              src="/images/hero.webp"
              alt="Colorful 3D keyboard with cute characters - a knight, wizard, and adventurer on a floating keyboard in the clouds"
              width={1200}
              height={675}
              className="w-full h-auto rounded-t-3xl"
              priority
            />
            {/* CTA Button on image */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
              <Link href="/levels">
                <Button
                  variant="game"
                  size="lg"
                  className="text-lg px-12"
                  style={{
                    background: 'linear-gradient(90deg, #10a9fc, #7f9bdf, #c092ba, #f5849d, #ff913e)',
                    boxShadow: '0 8px 25px -5px rgba(16, 169, 252, 0.4), 0 8px 25px -5px rgba(192, 146, 186, 0.35), 0 8px 25px -5px rgba(255, 145, 62, 0.4)',
                  }}
                >
                  {t('startQuest')}
                </Button>
              </Link>
            </div>
            {/* Wavy bottom edge */}
            <div className="absolute bottom-0 left-0 right-0 h-36 overflow-hidden">
              <svg
                viewBox="0 0 1200 150"
                preserveAspectRatio="none"
                className="absolute bottom-0 w-full h-full"
                aria-hidden="true"
              >
                <path
                  d="M0,0 C150,60 300,30 500,50 C700,70 900,50 1200,40 L1200,150 L0,150 Z"
                  className="fill-[#f0f9fd]"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full max-w-5xl px-4 pb-20" aria-label="Features">
          <div className="grid gap-6 sm:grid-cols-3">
            {/* Track Progress */}
            <div
              className="feature-card"
              style={{
                borderLeft: '3px solid #10a9fc',
                borderBottom: '3px solid #10a9fc',
              }}
            >
              <div className="mb-4 flex justify-center">
                <Image
                  src="/images/progress.png"
                  alt="Track your progress"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {t('features.trackProgress.title')}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {t('features.trackProgress.description')}
              </p>
            </div>

            {/* Game Modes */}
            <div
              className="feature-card"
              style={{
                borderTop: '3px solid #f5849d',
              }}
            >
              <div className="mb-4 flex justify-center">
                <Image
                  src="/images/game-mods.png"
                  alt="Game modes"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {t('features.gameModes.title')}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {t('features.gameModes.description')}
              </p>
            </div>

            {/* Certificate */}
            <div
              className="feature-card"
              style={{
                borderRight: '3px solid #ff913e',
                borderBottom: '3px solid #ff913e',
              }}
            >
              <div className="mb-4 flex justify-center">
                <Image
                  src="/images/certificate.png"
                  alt="Earn certificates"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {t('features.certificate.title')}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {t('features.certificate.description')}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section - Collapsed for cleaner look */}
        <section className="w-full max-w-3xl px-4 pb-20" aria-labelledby="faq-title">
          <h2
            id="faq-title"
            className="font-display text-2xl font-bold text-foreground text-center mb-8"
          >
            {t('faq.title')}
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <details
                key={index}
                className="group bg-surface rounded-2xl border border-border shadow-sm"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <h3 className="font-medium text-foreground pr-4">
                    {item.question}
                  </h3>
                  <span className="text-muted transition-transform group-open:rotate-180">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="faq-answer text-muted leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
