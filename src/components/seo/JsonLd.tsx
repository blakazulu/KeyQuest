type JsonLdProps = {
  data: object;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Organization schema
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KeyQuest',
    url: 'https://keyquest.com',
    logo: 'https://keyquest.com/images/full-logo.png',
    description: 'A fun, game-driven way to learn touch typing from the ground up.',
    sameAs: [],
  };

  return <JsonLd data={data} />;
}

// Website schema
export function WebsiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KeyQuest',
    url: 'https://keyquest.com',
    description: 'Learn touch typing the fun way with engaging lessons and games.',
    inLanguage: ['en', 'he'],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://keyquest.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return <JsonLd data={data} />;
}

// Educational course schema
export function EducationalCourseJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Touch Typing Fundamentals',
    description: 'Learn touch typing from the ground up with progressive lessons covering home row mastery, letter expansion, words, sentences, and fluency.',
    provider: {
      '@type': 'Organization',
      name: 'KeyQuest',
      url: 'https://keyquest.com',
    },
    educationalLevel: 'Beginner',
    isAccessibleForFree: true,
    teaches: [
      'Touch typing',
      'Keyboard navigation',
      'Typing speed improvement',
      'Typing accuracy',
    ],
    coursePrerequisites: 'No prior experience required',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT30M per day',
    },
  };

  return <JsonLd data={data} />;
}

// FAQ schema
type FAQItem = {
  question: string;
  answer: string;
};

export function FAQJsonLd({ faqs }: { faqs: FAQItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

// Speakable schema for voice assistants
export function SpeakableJsonLd({
  name,
  description,
  speakableSelectors,
}: {
  name: string;
  description: string;
  speakableSelectors: string[];
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: speakableSelectors,
    },
  };

  return <JsonLd data={data} />;
}

// BreadcrumbList schema
type BreadcrumbItem = {
  name: string;
  url: string;
};

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}
