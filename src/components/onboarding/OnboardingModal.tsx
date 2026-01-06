'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSettingsStore, type AgeGroup, type AvatarId, type InitialAssessment } from '@/stores/useSettingsStore';
import { useProgressStore } from '@/stores/useProgressStore';
import { ProfileSelector } from './ProfileSelector';
import { KeyboardTest } from './KeyboardTest';
import { OnboardingResults } from './OnboardingResults';

export type OnboardingStep = 'profile' | 'test' | 'results';

interface OnboardingModalProps {
  locale: 'en' | 'he';
  onClose: () => void;
}

interface TestResults {
  wpm: number;
  accuracy: number;
}

// Translations
const translations = {
  en: {
    title: 'Welcome to KeyQuest!',
    skip: 'Skip',
    skipConfirm: {
      title: 'Skip onboarding?',
      message: "You'll start at the beginner level. You can always change this later in settings.",
      confirm: 'Yes, skip',
      cancel: 'Go back',
    },
    step: 'Step {current} of {total}',
  },
  he: {
    title: '!KeyQuest-ברוכים הבאים ל',
    skip: 'דלג',
    skipConfirm: {
      title: '?לדלג על ההדרכה',
      message: 'תתחילו ברמה למתחילים. תמיד תוכלו לשנות זאת בהגדרות.',
      confirm: 'כן, דלג',
      cancel: 'חזרה',
    },
    step: 'שלב {current} מתוך {total}',
  },
};

export function OnboardingModal({ locale, onClose }: OnboardingModalProps) {
  const router = useRouter();
  const isRTL = locale === 'he';
  const t = translations[locale];

  const [step, setStep] = useState<OnboardingStep>('profile');
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<AgeGroup | null>(null);
  const [testResults, setTestResults] = useState<TestResults | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  const { setAgeGroup, setUserName, setUserAvatar, setInitialAssessment, completeOnboarding, keyboardLayout } = useSettingsStore();
  const { recordAssessmentSession } = useProgressStore();

  // Focus trap
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => document.removeEventListener('keydown', handleTab);
  }, [step, showSkipConfirm]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSkipConfirm) {
          setShowSkipConfirm(false);
        } else {
          setShowSkipConfirm(true);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showSkipConfirm]);

  const handleProfileSelect = useCallback((profile: AgeGroup, name: string, avatarId: AvatarId) => {
    setSelectedProfile(profile);
    setAgeGroup(profile);
    setUserName(name);
    setUserAvatar(avatarId);
    setStep('test');
  }, [setAgeGroup, setUserName, setUserAvatar]);

  const handleTestComplete = useCallback((results: TestResults) => {
    setTestResults(results);
    setStep('results');
  }, []);

  const handleTestSkip = useCallback(() => {
    // Default results for skipped test
    setTestResults({ wpm: 0, accuracy: 0 });
    setStep('results');
  }, []);

  const calculateRecommendedStage = (wpm: number, accuracy: number): number => {
    if (wpm < 15 || accuracy < 70) return 1;
    if (wpm < 25 || accuracy < 85) return 3;
    if (wpm < 40 || accuracy < 95) return 4;
    return 5;
  };

  const handleStartJourney = useCallback(() => {
    if (testResults) {
      const recommendedStage = calculateRecommendedStage(testResults.wpm, testResults.accuracy);
      const assessment: InitialAssessment = {
        wpm: testResults.wpm,
        accuracy: testResults.accuracy,
        recommendedStage,
        completedAt: new Date().toISOString(),
      };
      setInitialAssessment(assessment);

      // Record assessment as a session to unlock WPM-based achievements
      recordAssessmentSession(testResults.wpm, testResults.accuracy);
    } else {
      completeOnboarding();
    }
    router.push(`/${locale}/levels`);
    onClose();
  }, [testResults, setInitialAssessment, recordAssessmentSession, completeOnboarding, router, locale, onClose]);

  const handleSkipConfirm = useCallback(() => {
    completeOnboarding();
    router.push(`/${locale}/levels`);
    onClose();
  }, [completeOnboarding, router, locale, onClose]);

  const stepNumber = step === 'profile' ? 1 : step === 'test' ? 2 : 3;
  const totalSteps = 3;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-[scaleIn_0.3s_ease-out]"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
          <h2
            id="onboarding-title"
            className="text-2xl font-display font-bold text-center text-gray-800 dark:text-white"
          >
            {t.title}
          </h2>

          {/* Skip button */}
          <button
            ref={firstFocusableRef}
            onClick={() => setShowSkipConfirm(true)}
            className="absolute top-4 ltr:right-4 rtl:left-4 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label={t.skip}
          >
            {t.skip}
          </button>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mt-3">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  s === stepNumber
                    ? 'w-8 bg-emerald-500'
                    : s < stepNumber
                    ? 'bg-emerald-300 dark:bg-emerald-600'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2" aria-live="polite">
            {t.step.replace('{current}', String(stepNumber)).replace('{total}', String(totalSteps))}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'profile' && (
            <ProfileSelector locale={locale} onSelect={handleProfileSelect} />
          )}
          {step === 'test' && (
            <KeyboardTest
              locale={locale}
              expectedLayout={keyboardLayout}
              onComplete={handleTestComplete}
              onSkip={handleTestSkip}
            />
          )}
          {step === 'results' && testResults && (
            <OnboardingResults
              locale={locale}
              wpm={testResults.wpm}
              accuracy={testResults.accuracy}
              recommendedStage={calculateRecommendedStage(testResults.wpm, testResults.accuracy)}
              onStart={handleStartJourney}
            />
          )}
        </div>
      </div>

      {/* Skip confirmation dialog */}
      {showSkipConfirm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="skip-confirm-title"
          aria-describedby="skip-confirm-message"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowSkipConfirm(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-sm w-full animate-[scaleIn_0.2s_ease-out]">
            <h3
              id="skip-confirm-title"
              className="text-lg font-semibold text-gray-800 dark:text-white mb-2"
            >
              {t.skipConfirm.title}
            </h3>
            <p
              id="skip-confirm-message"
              className="text-sm text-gray-600 dark:text-gray-300 mb-4"
            >
              {t.skipConfirm.message}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSkipConfirm(false)}
                className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
              >
                {t.skipConfirm.cancel}
              </button>
              <button
                onClick={handleSkipConfirm}
                className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl transition-colors"
              >
                {t.skipConfirm.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default OnboardingModal;
