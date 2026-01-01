'use client';

import { memo } from 'react';

// Shared finger color mapping
const fingerColors = {
  'left-pinky': 'bg-[#FF6B9D]',    // Pink
  'left-ring': 'bg-[#9D4EDD]',     // Purple
  'left-middle': 'bg-[#00B4D8]',   // Cyan
  'left-index': 'bg-[#00D97E]',    // Green
  'right-index': 'bg-[#FFD60A]',   // Yellow
  'right-middle': 'bg-[#FF6B35]',  // Orange
  'right-ring': 'bg-[#FF4757]',    // Red
  'right-pinky': 'bg-[#9D4EDD]',   // Purple
};

type FingerPosition = keyof typeof fingerColors;

// Visual key component for explanation displays
const ExplanationKey = memo(function ExplanationKey({
  letter,
  finger,
  hasBump,
  isHighlighted,
}: {
  letter: string;
  finger: FingerPosition;
  hasBump?: boolean;
  isHighlighted?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`
          w-10 h-10 rounded-lg flex items-center justify-center
          font-mono font-bold text-white text-sm
          shadow-md ${fingerColors[finger]}
          ${hasBump ? 'ring-2 ring-white ring-offset-1 ring-offset-amber-50 dark:ring-offset-amber-900/20' : ''}
          ${isHighlighted ? 'ring-2 ring-yellow-400 animate-pulse' : ''}
        `}
      >
        {letter}
      </div>
      {hasBump && (
        <div className="w-4 h-0.5 bg-gray-400 dark:bg-gray-500 rounded-full" title="Bump indicator" />
      )}
    </div>
  );
});

// Base explanation card wrapper
const ExplanationCard = memo(function ExplanationCard({
  icon,
  title,
  children,
  colorClass = 'from-slate-50 to-indigo-50/50 dark:from-slate-800/40 dark:to-indigo-900/20 border-indigo-200 dark:border-indigo-700/50 shadow-indigo-100 dark:shadow-indigo-900/20',
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
  colorClass?: string;
}) {
  return (
    <div className={`p-4 bg-gradient-to-br ${colorClass} rounded-2xl border-2 shadow-lg`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-2xl">{icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-2">
            {title}
          </h3>
          {children}
        </div>
      </div>
    </div>
  );
});

// ===== STAGE 1: Home Row Explanation =====
export const HomeRowExplanation = memo(function HomeRowExplanation({
  locale,
}: {
  locale: 'en' | 'he';
}) {
  const content = locale === 'he' ? {
    title: 'שורת הבית',
    subtitle: 'כאן האצבעות שלך נחות',
    bumpTip: 'מקשי F ו-J יש להם בליטות קטנות - מצא אותן בלי להסתכל!',
    tip: 'תמיד תחזור לשורת הבית אחרי כל הקשה!',
    leftHand: 'יד שמאל',
    rightHand: 'יד ימין',
  } : {
    title: 'The Home Row',
    subtitle: 'This is where your fingers rest',
    bumpTip: 'F and J have small bumps - find them without looking!',
    tip: 'Always return here after pressing other keys!',
    leftHand: 'Left Hand',
    rightHand: 'Right Hand',
  };

  return (
    <ExplanationCard icon="🏠" title={content.title}>
      <div className="space-y-3">
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          {content.subtitle}
        </p>
        <p className="text-slate-600 dark:text-slate-300 text-sm flex items-center gap-1.5">
          <span>👆</span>
          <span>{content.bumpTip}</span>
        </p>

        {/* Visual keys */}
        <div dir="ltr" className="flex justify-center gap-6 py-2">
          {/* Left hand */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-[#00D97E] mb-1.5">{content.leftHand}</span>
            <div className="flex gap-1.5">
              <ExplanationKey letter="A" finger="left-pinky" />
              <ExplanationKey letter="S" finger="left-ring" />
              <ExplanationKey letter="D" finger="left-middle" />
              <ExplanationKey letter="F" finger="left-index" hasBump />
            </div>
          </div>
          {/* Right hand */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium text-[#FFD60A] mb-1.5">{content.rightHand}</span>
            <div className="flex gap-1.5">
              <ExplanationKey letter="J" finger="right-index" hasBump />
              <ExplanationKey letter="K" finger="right-middle" />
              <ExplanationKey letter="L" finger="right-ring" />
              <ExplanationKey letter=";" finger="right-pinky" />
            </div>
          </div>
        </div>

        <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center gap-1.5">
          <span>💡</span>
          <span>{content.tip}</span>
        </p>
      </div>
    </ExplanationCard>
  );
});

// ===== STAGE 2: Reach Keys Explanation =====
export const ReachExplanation = memo(function ReachExplanation({
  locale,
  newKeys,
}: {
  locale: 'en' | 'he';
  newKeys: string[];
}) {
  const keysUpper = newKeys.map(k => k.toUpperCase()).join(', ');

  const content = locale === 'he' ? {
    title: 'הגעה למקשים חדשים',
    subtitle: `למד להגיע ל: ${keysUpper}`,
    anchorTip: 'שמור את האצבעות על שורת הבית ונמתח למקש החדש.',
    returnTip: 'תמיד תחזור לשורת הבית אחרי כל הקשה!',
  } : {
    title: 'Reaching for New Keys',
    subtitle: `Learn to reach: ${keysUpper}`,
    anchorTip: 'Keep your fingers anchored on the home row and stretch to the new key.',
    returnTip: 'Always return to the home row after each keystroke!',
  };

  // Determine which fingers reach to which keys
  const reachInfo = getReachInfo(newKeys, locale);

  return (
    <ExplanationCard
      icon="🎯"
      title={content.title}
      colorClass="from-blue-50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700/50 shadow-blue-100 dark:shadow-blue-900/20"
    >
      <div className="space-y-2">
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          {content.subtitle}
        </p>
        {reachInfo && (
          <p className="text-blue-600 dark:text-blue-400 text-sm">
            {reachInfo}
          </p>
        )}
        <p className="text-slate-600 dark:text-slate-300 text-sm flex items-center gap-1.5">
          <span>👆</span>
          <span>{content.anchorTip}</span>
        </p>
        <p className="text-cyan-600 dark:text-cyan-400 text-sm font-medium flex items-center gap-1.5">
          <span>💡</span>
          <span>{content.returnTip}</span>
        </p>
      </div>
    </ExplanationCard>
  );
});

function getReachInfo(newKeys: string[], locale: 'en' | 'he'): string | null {
  const keys = newKeys.map(k => k.toLowerCase());

  const reachMap: Record<string, { en: string; he: string }> = {
    'g': { en: 'G: Left index reaches right from F', he: 'G: אצבע שמאל מגיעה ימינה מ-F' },
    'h': { en: 'H: Right index reaches left from J', he: 'H: אצבע ימין מגיעה שמאלה מ-J' },
    'e': { en: 'E: Left middle reaches up from D', he: 'E: אמה שמאל מגיעה למעלה מ-D' },
    'i': { en: 'I: Right middle reaches up from K', he: 'I: אמה ימין מגיעה למעלה מ-K' },
    'r': { en: 'R: Left index reaches up from F', he: 'R: אצבע שמאל מגיעה למעלה מ-F' },
    'u': { en: 'U: Right index reaches up from J', he: 'U: אצבע ימין מגיעה למעלה מ-J' },
    't': { en: 'T: Left index reaches up-right from F', he: 'T: אצבע שמאל מגיעה למעלה-ימינה מ-F' },
    'y': { en: 'Y: Right index reaches up-left from J', he: 'Y: אצבע ימין מגיעה למעלה-שמאלה מ-J' },
  };

  const tips = keys
    .filter(k => reachMap[k])
    .map(k => reachMap[k][locale]);

  return tips.length > 0 ? tips.join(' | ') : null;
}

// ===== STAGE 3: Alphabet Completion Explanation =====
export const AlphabetExplanation = memo(function AlphabetExplanation({
  locale,
  newKeys,
}: {
  locale: 'en' | 'he';
  newKeys: string[];
}) {
  const keysUpper = newKeys.map(k => k.toUpperCase()).join(', ');

  const content = locale === 'he' ? {
    title: 'השלמת האלפבית',
    subtitle: `אותיות חדשות: ${keysUpper}`,
    tip: 'כל מקש משויך לאצבע ספציפית. הקפד על טכניקה נכונה!',
    encouragement: 'אתה כמעט שולט בכל האותיות!',
  } : {
    title: 'Completing the Alphabet',
    subtitle: `New letters: ${keysUpper}`,
    tip: 'Each key is assigned to a specific finger. Focus on proper technique!',
    encouragement: "You're almost mastering all the letters!",
  };

  return (
    <ExplanationCard
      icon="🔤"
      title={content.title}
      colorClass="from-emerald-50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200 dark:border-emerald-700/50 shadow-emerald-100 dark:shadow-emerald-900/20"
    >
      <div className="space-y-2">
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          {content.subtitle}
        </p>
        <p className="text-slate-600 dark:text-slate-300 text-sm flex items-center gap-1.5">
          <span>👆</span>
          <span>{content.tip}</span>
        </p>
        <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1.5">
          <span>🌟</span>
          <span>{content.encouragement}</span>
        </p>
      </div>
    </ExplanationCard>
  );
});

// ===== STAGE 4: Word Practice Explanation (no new keys) =====
export const WordPracticeExplanation = memo(function WordPracticeExplanation({
  locale,
}: {
  locale: 'en' | 'he';
}) {
  const content = locale === 'he' ? {
    title: 'אימון מילים',
    subtitle: 'הגיע הזמן לבנות מהירות עם מילים אמיתיות!',
    tip1: 'התמקד בזרימה חלקה בין מילים.',
    tip2: 'קרא קדימה כדי לצפות את המילה הבאה.',
    tip3: 'מהירות באה מדיוק - אל תמהר!',
  } : {
    title: 'Word Practice',
    subtitle: "Time to build speed with real words!",
    tip1: 'Focus on smooth flow between words.',
    tip2: 'Read ahead to anticipate the next word.',
    tip3: 'Speed comes from accuracy - don\'t rush!',
  };

  return (
    <ExplanationCard
      icon="📝"
      title={content.title}
      colorClass="from-amber-50 to-yellow-50/50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-700/50 shadow-amber-100 dark:shadow-amber-900/20"
    >
      <div className="space-y-2">
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          {content.subtitle}
        </p>
        <ul className="space-y-1.5 text-sm">
          <li className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span>✓</span>
            <span>{content.tip1}</span>
          </li>
          <li className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span>✓</span>
            <span>{content.tip2}</span>
          </li>
          <li className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
            <span>💡</span>
            <span>{content.tip3}</span>
          </li>
        </ul>
      </div>
    </ExplanationCard>
  );
});

// ===== STAGE 5: Punctuation Explanation =====
export const PunctuationExplanation = memo(function PunctuationExplanation({
  locale,
  newKeys,
}: {
  locale: 'en' | 'he';
  newKeys: string[];
}) {
  const hasQuestion = newKeys.includes('?');
  const hasExclamation = newKeys.includes('!');

  const content = locale === 'he' ? {
    title: hasQuestion && hasExclamation ? 'סימני פיסוק' : hasQuestion ? 'סימני שאלה' : hasExclamation ? 'סימני קריאה' : 'משפטים ופסקאות',
    subtitle: hasQuestion ? '? נמצא ב-Shift + /' : hasExclamation ? '! נמצא ב-Shift + 1' : 'שפר את הזרימה שלך עם משפטים שלמים.',
    tip: 'לחץ Shift עם הזרת ההפוכה להקלדת סימני פיסוק.',
    sentenceTip: 'קרא את כל המשפט לפני שאתה מתחיל להקליד.',
  } : {
    title: hasQuestion && hasExclamation ? 'Punctuation Marks' : hasQuestion ? 'Question Marks' : hasExclamation ? 'Exclamation Marks' : 'Sentences & Paragraphs',
    subtitle: hasQuestion ? '? is Shift + /' : hasExclamation ? '! is Shift + 1' : 'Improve your flow with complete sentences.',
    tip: 'Press Shift with your opposite pinky to type punctuation.',
    sentenceTip: 'Read the entire sentence before you start typing.',
  };

  return (
    <ExplanationCard
      icon={hasQuestion ? '❓' : hasExclamation ? '❗' : '📖'}
      title={content.title}
      colorClass="from-pink-50 to-rose-50/50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-700/50 shadow-pink-100 dark:shadow-pink-900/20"
    >
      <div className="space-y-2">
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          {content.subtitle}
        </p>
        {(hasQuestion || hasExclamation) && (
          <p className="text-slate-600 dark:text-slate-300 text-sm flex items-center gap-1.5">
            <span>👆</span>
            <span>{content.tip}</span>
          </p>
        )}
        <p className="text-pink-600 dark:text-pink-400 text-sm font-medium flex items-center gap-1.5">
          <span>💡</span>
          <span>{content.sentenceTip}</span>
        </p>
      </div>
    </ExplanationCard>
  );
});

// ===== STAGE 6: Numbers Explanation =====
export const NumbersExplanation = memo(function NumbersExplanation({
  locale,
}: {
  locale: 'en' | 'he';
}) {
  const content = locale === 'he' ? {
    title: 'שורת המספרים',
    subtitle: 'כל אצבע מגיעה למעלה למספר ספציפי.',
    fingerGuide: '1-4: יד שמאל | 5-6: אצבעות מורות | 7-0: יד ימין',
    tip: 'הגע למעלה מבלי להסתכל - השתמש בבליטות F/J כעוגנים!',
  } : {
    title: 'Number Row',
    subtitle: 'Each finger reaches up to a specific number.',
    fingerGuide: '1-4: Left hand | 5-6: Index fingers | 7-0: Right hand',
    tip: 'Reach up without looking - use F/J bumps as anchors!',
  };

  return (
    <ExplanationCard
      icon="🔢"
      title={content.title}
      colorClass="from-violet-50 to-purple-50/50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200 dark:border-violet-700/50 shadow-violet-100 dark:shadow-violet-900/20"
    >
      <div className="space-y-2">
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          {content.subtitle}
        </p>
        <p className="text-violet-600 dark:text-violet-400 text-sm font-mono">
          {content.fingerGuide}
        </p>
        <p className="text-violet-600 dark:text-violet-400 text-sm font-medium flex items-center gap-1.5">
          <span>💡</span>
          <span>{content.tip}</span>
        </p>
      </div>
    </ExplanationCard>
  );
});

// ===== STAGE 6: Mastery/Speed Explanation =====
export const MasteryExplanation = memo(function MasteryExplanation({
  locale,
}: {
  locale: 'en' | 'he';
}) {
  const content = locale === 'he' ? {
    title: 'בניית שליטה',
    subtitle: 'התמקד בקצב יציב ובדיוק גבוה.',
    tip1: 'מהירות באה מתרגול - לא מלחץ.',
    tip2: 'שמור על נשימה יציבה ואצבעות רגועות.',
    tip3: 'קרא קדימה 2-3 מילים בזמן שאתה מקליד.',
    goal: 'המטרה: 40+ מילים לדקה עם 90%+ דיוק!',
  } : {
    title: 'Building Mastery',
    subtitle: 'Focus on steady rhythm and high accuracy.',
    tip1: 'Speed comes from practice - not pressure.',
    tip2: 'Keep breathing steady and fingers relaxed.',
    tip3: 'Read ahead 2-3 words while typing.',
    goal: 'Goal: 40+ WPM with 90%+ accuracy!',
  };

  return (
    <ExplanationCard
      icon="🏆"
      title={content.title}
      colorClass="from-amber-50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700/50 shadow-amber-100 dark:shadow-amber-900/20"
    >
      <div className="space-y-2">
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          {content.subtitle}
        </p>
        <ul className="space-y-1 text-sm">
          <li className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span>✓</span>
            <span>{content.tip1}</span>
          </li>
          <li className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span>✓</span>
            <span>{content.tip2}</span>
          </li>
          <li className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span>✓</span>
            <span>{content.tip3}</span>
          </li>
        </ul>
        <p className="text-orange-600 dark:text-orange-400 text-sm font-medium flex items-center gap-1.5">
          <span>🎯</span>
          <span>{content.goal}</span>
        </p>
      </div>
    </ExplanationCard>
  );
});

// ===== Main Explanation Selector =====
export interface LessonExplanationProps {
  stageId: number;
  newKeys: string[];
  practiceKeys: string[];
  locale: 'en' | 'he';
}

export const LessonExplanation = memo(function LessonExplanation({
  stageId,
  newKeys,
  practiceKeys,
  locale,
}: LessonExplanationProps) {
  // Stage 1: Home Row
  if (stageId === 1) {
    return <HomeRowExplanation locale={locale} />;
  }

  // Stage 2: Reach keys
  if (stageId === 2) {
    if (newKeys.length > 0) {
      return <ReachExplanation locale={locale} newKeys={newKeys} />;
    }
    // Challenge lesson - general practice tips
    return <WordPracticeExplanation locale={locale} />;
  }

  // Stage 3: Alphabet completion
  if (stageId === 3) {
    if (newKeys.length > 0) {
      return <AlphabetExplanation locale={locale} newKeys={newKeys} />;
    }
    return <WordPracticeExplanation locale={locale} />;
  }

  // Stage 4: Word practice (no new keys)
  if (stageId === 4) {
    return <WordPracticeExplanation locale={locale} />;
  }

  // Stage 5: Punctuation and sentences
  if (stageId === 5) {
    return <PunctuationExplanation locale={locale} newKeys={newKeys} />;
  }

  // Stage 6: Mastery
  if (stageId === 6) {
    // Numbers lesson
    if (newKeys.some(k => /[0-9]/.test(k))) {
      return <NumbersExplanation locale={locale} />;
    }
    // General mastery
    return <MasteryExplanation locale={locale} />;
  }

  // Fallback - should not happen
  return <WordPracticeExplanation locale={locale} />;
});

export default LessonExplanation;
