'use client';

import { useEffect, useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useSettingsStore, type AgeGroup, type AvatarId, type InitialAssessment } from '@/stores/useSettingsStore';
import { useProgressStore } from '@/stores/useProgressStore';
import KeyboardTest from '@/components/onboarding/KeyboardTest';

// Age-specific avatars (matching ProfileSelector)
const ageAvatars: Record<AgeGroup, { id: AvatarId; color: string; icon: string }[]> = {
  child: [
    { id: 1, color: 'from-pink-400 to-pink-500', icon: '🌸' },
    { id: 2, color: 'from-purple-400 to-purple-500', icon: '🦄' },
    { id: 3, color: 'from-cyan-400 to-cyan-500', icon: '🐬' },
    { id: 4, color: 'from-yellow-400 to-yellow-500', icon: '⭐' },
    { id: 5, color: 'from-green-400 to-green-500', icon: '🌳' },
    { id: 6, color: 'from-orange-400 to-orange-500', icon: '🦊' },
    { id: 7, color: 'from-blue-400 to-blue-500', icon: '🐳' },
    { id: 8, color: 'from-red-400 to-red-500', icon: '🍎' },
  ],
  teen: [
    { id: 1, color: 'from-indigo-500 to-purple-600', icon: '🎮' },
    { id: 2, color: 'from-cyan-500 to-blue-600', icon: '🎧' },
    { id: 3, color: 'from-emerald-500 to-teal-600', icon: '🎸' },
    { id: 4, color: 'from-orange-500 to-red-600', icon: '🔥' },
    { id: 5, color: 'from-pink-500 to-rose-600', icon: '💫' },
    { id: 6, color: 'from-violet-500 to-purple-600', icon: '🚀' },
    { id: 7, color: 'from-sky-500 to-indigo-600', icon: '⚡' },
    { id: 8, color: 'from-amber-500 to-orange-600', icon: '🏆' },
  ],
  adult: [
    { id: 1, color: 'from-slate-500 to-slate-600', icon: '💼' },
    { id: 2, color: 'from-blue-500 to-blue-600', icon: '🎯' },
    { id: 3, color: 'from-emerald-500 to-emerald-600', icon: '📈' },
    { id: 4, color: 'from-amber-500 to-amber-600', icon: '☕' },
    { id: 5, color: 'from-rose-500 to-rose-600', icon: '🌹' },
    { id: 6, color: 'from-cyan-500 to-cyan-600', icon: '💎' },
    { id: 7, color: 'from-purple-500 to-purple-600', icon: '🎨' },
    { id: 8, color: 'from-teal-500 to-teal-600', icon: '🌿' },
  ],
};

// Avatar component with age-specific icon
function AvatarIcon({ id, ageGroup, size = 'lg' }: { id: AvatarId; ageGroup: AgeGroup; size?: 'sm' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-20 h-20 text-3xl' : 'w-12 h-12 text-xl';
  const avatars = ageAvatars[ageGroup];
  const avatar = avatars.find(a => a.id === id) || avatars[0];

  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br ${avatar.color} flex items-center justify-center shadow-lg`}>
      <span className="drop-shadow-sm">{avatar.icon}</span>
    </div>
  );
}

// Translations
const translations = {
  en: {
    title: 'Your Profile',
    subtitle: 'Manage your settings and view your progress',
    editName: 'Edit name',
    saveName: 'Save',
    namePlaceholder: 'Enter your name',
    chooseAvatar: 'Choose your avatar',
    ageGroup: 'Learning Mode',
    ageGroups: {
      child: { title: 'Child', age: 'Ages 6-12', desc: 'Fun and colorful' },
      teen: { title: 'Teen', age: 'Ages 13-17', desc: 'Cool challenges' },
      adult: { title: 'Adult', age: 'Ages 18+', desc: 'Efficient learning' },
    },
    assessment: {
      title: 'Initial Assessment',
      noAssessment: 'No assessment completed',
      takeTest: 'Take the typing test to see your baseline',
      wpm: 'Words per minute',
      accuracy: 'Accuracy',
      recommendedStage: 'Recommended starting stage',
      completedAt: 'Completed on',
      retake: 'Retake Assessment',
    },
    stats: {
      title: 'Quick Stats',
      totalXp: 'Total XP',
      lessonsCompleted: 'Lessons Completed',
      currentStreak: 'Current Streak',
      days: 'days',
    },
    reset: {
      title: 'Start Fresh',
      description: 'Want to start your journey over? This will erase all your progress.',
      button: 'Reset All Progress',
      confirmTitle: 'Warning: Full Reset',
      confirmMessage: 'This action will permanently delete all your progress:',
      items: {
        achievements: 'All achievements',
        xp: 'All XP points',
        lessons: 'All completed lessons',
        streak: 'Practice streak',
        stats: 'All statistics',
        profile: 'User profile (name and avatar)',
      },
      typeToConfirm: 'Type "{text}" to confirm:',
      cancel: 'Cancel',
      confirmButton: 'Delete Everything',
      cannotUndo: 'This action cannot be undone!',
    },
    guest: 'Guest',
  },
  he: {
    title: 'הפרופיל שלך',
    subtitle: 'נהל את ההגדרות שלך וצפה בהתקדמות',
    editName: 'ערוך שם',
    saveName: 'שמור',
    namePlaceholder: 'הכנס את שמך',
    chooseAvatar: 'בחר את האווטר שלך',
    ageGroup: 'מצב למידה',
    ageGroups: {
      child: { title: 'ילד', age: 'גילאי 6-12', desc: 'צבעוני ומהנה' },
      teen: { title: 'נער', age: 'גילאי 13-17', desc: 'אתגרים מגניבים' },
      adult: { title: 'מבוגר', age: '18+', desc: 'למידה יעילה' },
    },
    assessment: {
      title: 'הערכה ראשונית',
      noAssessment: 'לא בוצעה הערכה',
      takeTest: 'בצע מבחן הקלדה כדי לראות את הרמה שלך',
      wpm: 'מילים לדקה',
      accuracy: 'דיוק',
      recommendedStage: 'שלב התחלתי מומלץ',
      completedAt: 'הושלם בתאריך',
      retake: 'בצע הערכה מחדש',
    },
    stats: {
      title: 'סטטיסטיקות מהירות',
      totalXp: 'XP כולל',
      lessonsCompleted: 'שיעורים שהושלמו',
      currentStreak: 'רצף נוכחי',
      days: 'ימים',
    },
    reset: {
      title: 'התחל מחדש',
      description: 'רוצה להתחיל את המסע מחדש? זה ימחק את כל ההתקדמות שלך.',
      button: 'איפוס כל ההתקדמות',
      confirmTitle: 'אזהרה: איפוס מלא',
      confirmMessage: 'פעולה זו תמחק לצמיתות את כל ההתקדמות שלך:',
      items: {
        achievements: 'כל ההישגים',
        xp: 'כל נקודות ה-XP',
        lessons: 'כל השיעורים שהושלמו',
        streak: 'רצף התרגול',
        stats: 'כל הסטטיסטיקות',
        profile: 'פרופיל המשתמש (שם ואווטר)',
      },
      typeToConfirm: 'הקלד "{text}" כדי לאשר:',
      cancel: 'ביטול',
      confirmButton: 'מחק הכל',
      cannotUndo: 'לא ניתן לבטל פעולה זו!',
    },
    guest: 'אורח',
  },
};

// Stage names for display
const stageNames = {
  en: {
    1: 'Keyboard Explorer',
    2: 'Home Row Hero',
    3: 'Letter Master',
    4: 'Word Wizard',
    5: 'Sentence Star',
    6: 'Typing Champion',
  },
  he: {
    1: 'חוקר המקלדת',
    2: 'גיבור השורה הביתית',
    3: 'מאסטר האותיות',
    4: 'קוסם המילים',
    5: 'כוכב המשפטים',
    6: 'אלוף ההקלדה',
  },
};

export default function ProfilePage() {
  const locale = useLocale() as 'en' | 'he';
  const isRTL = locale === 'he';
  const t = translations[locale];

  // Hydration state
  const [isHydrated, setIsHydrated] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  // Settings store
  const userName = useSettingsStore((s) => s.userName);
  const userAvatar = useSettingsStore((s) => s.userAvatar);
  const ageGroup = useSettingsStore((s) => s.ageGroup);
  const initialAssessment = useSettingsStore((s) => s.initialAssessment);
  const setUserName = useSettingsStore((s) => s.setUserName);
  const setUserAvatar = useSettingsStore((s) => s.setUserAvatar);
  const setAgeGroup = useSettingsStore((s) => s.setAgeGroup);
  const setInitialAssessment = useSettingsStore((s) => s.setInitialAssessment);
  const resetOnboarding = useSettingsStore((s) => s.resetOnboarding);

  // Progress store
  const totalXp = useProgressStore((s) => s.totalXp);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const practiceStreak = useProgressStore((s) => s.practiceStreak);
  const resetProgress = useProgressStore((s) => s.reset);

  // Reset confirmation text
  const requiredResetText = locale === 'he' ? 'מחק' : 'DELETE';
  const isResetConfirmEnabled = resetConfirmText === requiredResetText;

  useEffect(() => {
    setIsHydrated(true);
    setNameInput(userName);
  }, [userName]);

  const handleSaveName = () => {
    setUserName(nameInput.trim());
    setIsEditingName(false);
  };

  const handleRetakeAssessment = () => {
    setShowAssessmentModal(true);
  };

  const calculateRecommendedStage = (wpm: number, accuracy: number): number => {
    if (wpm < 15 || accuracy < 70) return 1;
    if (wpm < 25 || accuracy < 85) return 3;
    if (wpm < 40 || accuracy < 95) return 4;
    return 5;
  };

  const handleTestComplete = useCallback((results: { wpm: number; accuracy: number }) => {
    const recommendedStage = calculateRecommendedStage(results.wpm, results.accuracy);
    const assessment: InitialAssessment = {
      wpm: results.wpm,
      accuracy: results.accuracy,
      recommendedStage,
      completedAt: new Date().toISOString(),
    };
    setInitialAssessment(assessment);
    setShowAssessmentModal(false);
  }, [setInitialAssessment]);

  const handleTestSkip = useCallback(() => {
    // Just close the modal without changing anything
    setShowAssessmentModal(false);
  }, []);

  const handleReset = () => {
    resetProgress();
    resetOnboarding();
    setUserName('');
    setUserAvatar(1);
    setShowResetModal(false);
    window.location.reload();
  };

  // Handle escape key for modals
  useEffect(() => {
    if (!showResetModal && !showAssessmentModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showResetModal) setShowResetModal(false);
        if (showAssessmentModal) setShowAssessmentModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResetModal, showAssessmentModal]);

  // Reset confirm text when modal opens
  useEffect(() => {
    if (showResetModal) setResetConfirmText('');
  }, [showResetModal]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'he' ? 'he-IL' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading state
  if (!isHydrated) {
    return (
      <div className="relative z-10 py-8 max-w-3xl mx-auto px-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 py-8 max-w-3xl mx-auto px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-800 dark:text-gray-100">
          {t.title}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {t.subtitle}
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        {/* Avatar and Name */}
        <div className="flex items-center gap-6 mb-6">
          <AvatarIcon id={userAvatar} ageGroup={ageGroup} size="lg" />
          <div className="flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  maxLength={30}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                />
                <button
                  onClick={handleSaveName}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                >
                  {t.saveName}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {userName || t.guest}
                </h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-sm text-gray-500 hover:text-emerald-500 transition-colors"
                >
                  {t.editName}
                </button>
              </div>
            )}
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {t.ageGroups[ageGroup].title} - {t.ageGroups[ageGroup].age}
            </p>
          </div>
        </div>

        {/* Avatar Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            {t.chooseAvatar}
          </h3>
          <div className="flex flex-wrap gap-3">
            {ageAvatars[ageGroup].map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setUserAvatar(avatar.id)}
                className={`
                  p-1 rounded-full transition-all
                  ${userAvatar === avatar.id
                    ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800'
                    : 'hover:scale-110'
                  }
                `}
              >
                <AvatarIcon id={avatar.id} ageGroup={ageGroup} size="sm" />
              </button>
            ))}
          </div>
        </div>

        {/* Age Group Selection */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            {t.ageGroup}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {(['child', 'teen', 'adult'] as AgeGroup[]).map((group) => (
              <button
                key={group}
                onClick={() => setAgeGroup(group)}
                className={`
                  p-3 rounded-xl border-2 transition-all text-center
                  ${ageGroup === group
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300'
                  }
                `}
              >
                <p className={`font-bold ${ageGroup === group ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-200'}`}>
                  {t.ageGroups[group].title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {t.ageGroups[group].desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assessment Results */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
          {t.assessment.title}
        </h3>

        {initialAssessment ? (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* WPM */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-500">
                  {initialAssessment.wpm}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t.assessment.wpm}
                </div>
              </div>

              {/* Accuracy */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-emerald-500">
                  {initialAssessment.accuracy}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t.assessment.accuracy}
                </div>
              </div>
            </div>

            {/* Recommended Stage */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.assessment.recommendedStage}
              </p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                Stage {initialAssessment.recommendedStage}: {stageNames[locale][initialAssessment.recommendedStage as keyof typeof stageNames['en']]}
              </p>
            </div>

            {/* Completion Date */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t.assessment.completedAt}: {formatDate(initialAssessment.completedAt)}
            </p>

            {/* Retake Button */}
            <button
              onClick={handleRetakeAssessment}
              className="w-full py-2.5 border border-gray-300 dark:border-gray-600 hover:border-emerald-500 text-gray-700 dark:text-gray-300 hover:text-emerald-600 font-medium rounded-xl transition-colors"
            >
              {t.assessment.retake}
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {t.assessment.noAssessment}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t.assessment.takeTest}
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
          {t.stats.title}
        </h3>

        <div className="grid grid-cols-3 gap-4">
          {/* Total XP */}
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {totalXp.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {t.stats.totalXp}
            </div>
          </div>

          {/* Lessons Completed */}
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-500">
              {completedLessons.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {t.stats.lessonsCompleted}
            </div>
          </div>

          {/* Current Streak */}
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">
              {practiceStreak}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {t.stats.currentStreak} ({t.stats.days})
            </div>
          </div>
        </div>
      </div>

      {/* Reset Section */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t.reset.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {t.reset.description}
          </p>
          <button
            onClick={() => setShowResetModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t.reset.button}
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowResetModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
        >
          <div
            className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-red-500 px-6 py-4">
              <h2 id="reset-modal-title" className="text-xl font-bold text-white flex items-center gap-2">
                <span>⚠️</span>
                {t.reset.confirmTitle}
              </h2>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {t.reset.confirmMessage}
              </p>

              <ul className="space-y-2 mb-6">
                {Object.entries(t.reset.items).map(([key, value]) => (
                  <li key={key} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <span className="text-red-500">✕</span>
                    {value}
                  </li>
                ))}
              </ul>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-3">
                  {t.reset.typeToConfirm.replace('{text}', requiredResetText)}
                </p>
                <input
                  type="text"
                  value={resetConfirmText}
                  onChange={(e) => setResetConfirmText(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-red-300 dark:border-red-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                  placeholder={requiredResetText}
                  autoFocus
                />
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                {t.reset.cannotUndo}
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex gap-3 justify-end">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-5 py-2.5 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {t.reset.cancel}
              </button>
              <button
                onClick={handleReset}
                disabled={!isResetConfirmEnabled}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all ${isResetConfirmEnabled ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
              >
                {t.reset.confirmButton}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Modal */}
      {showAssessmentModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="assessment-modal-title"
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-4">
              <h2 id="assessment-modal-title" className="text-xl font-bold text-white">
                {t.assessment.retake}
              </h2>
              <button
                onClick={() => setShowAssessmentModal(false)}
                className="absolute top-4 ltr:right-4 rtl:left-4 text-white/80 hover:text-white transition-colors"
                aria-label={locale === 'he' ? 'סגור' : 'Close'}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content - KeyboardTest */}
            <div className="p-6">
              <KeyboardTest
                locale={locale}
                onComplete={handleTestComplete}
                onSkip={handleTestSkip}
              />
            </div>
          </div>
        </div>
      )}

      {/* CSS animations */}
      <style jsx>{`
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
