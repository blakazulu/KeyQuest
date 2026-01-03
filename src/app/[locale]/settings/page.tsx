'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useProgressStore } from '@/stores/useProgressStore';
import { Toggle } from '@/components/ui/Toggle';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { SettingRow } from '@/components/settings/SettingRow';
import { FontSizeSelector } from '@/components/settings/FontSizeSelector';
import { VolumeSlider } from '@/components/settings/VolumeSlider';
import { LayoutSelector } from '@/components/settings/LayoutSelector';

// Translations
const translations = {
  en: {
    title: 'Settings',
    subtitle: 'Customize your KeyQuest experience',

    // Display & Appearance
    display: {
      title: 'Display',
      fontSize: 'Font Size',
      fontSizeDesc: 'Adjust text size for comfortable reading',
      fontSizeLabels: { small: 'Small', medium: 'Medium', large: 'Large' },
    },

    // Sound
    sound: {
      title: 'Sound',
      enabled: 'Sound Effects',
      enabledDesc: 'Play sounds for key presses and feedback',
      volume: 'Volume',
      volumeDesc: 'Adjust the volume level',
    },

    // Practice Preferences
    practice: {
      title: 'Practice Preferences',
      keyboard: 'Show Visual Keyboard',
      keyboardDesc: 'Display an on-screen keyboard during lessons',
      fingerGuide: 'Show Finger Guide',
      fingerGuideDesc: 'Highlight which finger to use for each key',
    },

    // Keyboard Layout
    layout: {
      title: 'Keyboard Layout',
      setting: 'Typing Layout',
      settingDesc: 'Choose the keyboard layout for typing practice',
      qwerty: 'QWERTY (English)',
      hebrew: 'Hebrew (עברית)',
    },

    // Calm Mode Defaults
    calmMode: {
      title: 'Calm Mode Defaults',
      subtitle: 'Default settings when entering Calm Mode',
      keyboard: 'Show Keyboard',
      keyboardDesc: 'Display keyboard in Calm Mode',
      weakLetters: 'Focus on Weak Letters',
      weakLettersDesc: 'Prioritize letters you struggle with',
      stats: 'Show Stats Overlay',
      statsDesc: 'Display typing statistics during practice',
    },

    // Data Management
    data: {
      title: 'Data Management',
      export: 'Export Progress',
      exportDesc: 'Download your progress as a JSON file',
      exportButton: 'Download Backup',
      profile: 'Profile & Reset',
      profileDesc: 'Manage your profile or reset all progress',
      profileLink: 'Go to Profile',
    },
  },
  he: {
    title: 'הגדרות',
    subtitle: 'התאם אישית את חוויית KeyQuest שלך',

    // Display & Appearance
    display: {
      title: 'תצוגה',
      fontSize: 'גודל גופן',
      fontSizeDesc: 'התאם את גודל הטקסט לקריאה נוחה',
      fontSizeLabels: { small: 'קטן', medium: 'בינוני', large: 'גדול' },
    },

    // Sound
    sound: {
      title: 'צליל',
      enabled: 'אפקטי קול',
      enabledDesc: 'נגן צלילים בעת לחיצה ומשוב',
      volume: 'עוצמה',
      volumeDesc: 'התאם את עוצמת הקול',
    },

    // Practice Preferences
    practice: {
      title: 'העדפות תרגול',
      keyboard: 'הצג מקלדת ויזואלית',
      keyboardDesc: 'הצג מקלדת על המסך במהלך שיעורים',
      fingerGuide: 'הצג מדריך אצבעות',
      fingerGuideDesc: 'הדגש באיזו אצבע להשתמש לכל מקש',
    },

    // Keyboard Layout
    layout: {
      title: 'פריסת מקלדת',
      setting: 'פריסה להקלדה',
      settingDesc: 'בחר את פריסת המקלדת לתרגול הקלדה',
      qwerty: 'QWERTY (אנגלית)',
      hebrew: 'עברית',
    },

    // Calm Mode Defaults
    calmMode: {
      title: 'ברירות מחדל למצב רגוע',
      subtitle: 'הגדרות ברירת מחדל בכניסה למצב רגוע',
      keyboard: 'הצג מקלדת',
      keyboardDesc: 'הצג מקלדת במצב רגוע',
      weakLetters: 'התמקד באותיות חלשות',
      weakLettersDesc: 'תעדוף אותיות שמאתגרות אותך',
      stats: 'הצג סטטיסטיקות',
      statsDesc: 'הצג נתוני הקלדה במהלך התרגול',
    },

    // Data Management
    data: {
      title: 'ניהול נתונים',
      export: 'ייצוא התקדמות',
      exportDesc: 'הורד את ההתקדמות שלך כקובץ JSON',
      exportButton: 'הורד גיבוי',
      profile: 'פרופיל ואיפוס',
      profileDesc: 'נהל את הפרופיל שלך או אפס את כל ההתקדמות',
      profileLink: 'עבור לפרופיל',
    },
  },
};

// Icons for sections
const DisplayIcon = () => (
  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const SoundIcon = () => (
  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

const PracticeIcon = () => (
  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const LayoutIcon = () => (
  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CalmIcon = () => (
  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const DataIcon = () => (
  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

export default function SettingsPage() {
  const locale = useLocale() as 'en' | 'he';
  const isRTL = locale === 'he';
  const t = translations[locale];

  // Hydration state
  const [isHydrated, setIsHydrated] = useState(false);

  // Settings from store
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);
  const soundVolume = useSettingsStore((s) => s.soundVolume);
  const setSoundVolume = useSettingsStore((s) => s.setSoundVolume);
  const fontSize = useSettingsStore((s) => s.fontSize);
  const setFontSize = useSettingsStore((s) => s.setFontSize);
  const showKeyboard = useSettingsStore((s) => s.showKeyboard);
  const toggleKeyboard = useSettingsStore((s) => s.toggleKeyboard);
  const showFingerGuide = useSettingsStore((s) => s.showFingerGuide);
  const toggleFingerGuide = useSettingsStore((s) => s.toggleFingerGuide);
  const keyboardLayout = useSettingsStore((s) => s.keyboardLayout);
  const setKeyboardLayout = useSettingsStore((s) => s.setKeyboardLayout);
  const calmModeSettings = useSettingsStore((s) => s.calmModeSettings);
  const updateCalmModeSettings = useSettingsStore((s) => s.updateCalmModeSettings);

  // Progress store for export
  const progressState = useProgressStore();
  const settingsState = useSettingsStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Export progress as JSON
  const handleExport = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      progress: {
        completedLessons: progressState.completedLessons,
        lessonProgress: progressState.lessonProgress,
        totalXp: progressState.totalXp,
        averageAccuracy: progressState.averageAccuracy,
        averageWpm: progressState.averageWpm,
        practiceStreak: progressState.practiceStreak,
        longestStreak: progressState.longestStreak,
        sessionHistory: progressState.sessionHistory,
        weakLetters: progressState.weakLetters,
        achievements: progressState.achievements,
        letterHistory: progressState.letterHistory,
      },
      settings: {
        theme: settingsState.theme,
        soundEnabled: settingsState.soundEnabled,
        soundVolume: settingsState.soundVolume,
        fontSize: settingsState.fontSize,
        showKeyboard: settingsState.showKeyboard,
        showFingerGuide: settingsState.showFingerGuide,
        ageGroup: settingsState.ageGroup,
        calmModeSettings: settingsState.calmModeSettings,
        userName: settingsState.userName,
        userAvatar: settingsState.userAvatar,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `keyquest-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (!isHydrated) {
    return (
      <div className="relative z-10 py-8 max-w-3xl mx-auto px-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8" />
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
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

      {/* Display */}
      <SettingsSection title={t.display.title} icon={<DisplayIcon />}>
        <SettingRow label={t.display.fontSize} description={t.display.fontSizeDesc} block>
          <FontSizeSelector
            value={fontSize}
            onChange={setFontSize}
            labels={t.display.fontSizeLabels}
          />
        </SettingRow>
      </SettingsSection>

      {/* Sound */}
      <SettingsSection title={t.sound.title} icon={<SoundIcon />}>
        <SettingRow label={t.sound.enabled} description={t.sound.enabledDesc}>
          <Toggle
            checked={soundEnabled}
            onChange={toggleSound}
            label={t.sound.enabled}
            hideLabel
          />
        </SettingRow>

        <SettingRow label={t.sound.volume} description={t.sound.volumeDesc} block>
          <VolumeSlider
            value={soundVolume}
            onChange={setSoundVolume}
            label={t.sound.volume}
            disabled={!soundEnabled}
          />
        </SettingRow>
      </SettingsSection>

      {/* Practice Preferences */}
      <SettingsSection title={t.practice.title} icon={<PracticeIcon />}>
        <SettingRow label={t.practice.keyboard} description={t.practice.keyboardDesc}>
          <Toggle
            checked={showKeyboard}
            onChange={toggleKeyboard}
            label={t.practice.keyboard}
            hideLabel
          />
        </SettingRow>

        <SettingRow label={t.practice.fingerGuide} description={t.practice.fingerGuideDesc}>
          <Toggle
            checked={showFingerGuide}
            onChange={toggleFingerGuide}
            label={t.practice.fingerGuide}
            hideLabel
          />
        </SettingRow>
      </SettingsSection>

      {/* Keyboard Layout */}
      <SettingsSection title={t.layout.title} icon={<LayoutIcon />}>
        <SettingRow label={t.layout.setting} description={t.layout.settingDesc} block>
          <LayoutSelector
            value={keyboardLayout}
            onChange={setKeyboardLayout}
            labels={{ qwerty: t.layout.qwerty, hebrew: t.layout.hebrew }}
          />
        </SettingRow>
      </SettingsSection>

      {/* Calm Mode Defaults */}
      <SettingsSection title={t.calmMode.title} icon={<CalmIcon />}>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 -mt-2">
          {t.calmMode.subtitle}
        </p>

        <SettingRow label={t.calmMode.keyboard} description={t.calmMode.keyboardDesc}>
          <Toggle
            checked={calmModeSettings.showKeyboard}
            onChange={(v) => updateCalmModeSettings({ showKeyboard: v })}
            label={t.calmMode.keyboard}
            hideLabel
          />
        </SettingRow>

        <SettingRow label={t.calmMode.weakLetters} description={t.calmMode.weakLettersDesc}>
          <Toggle
            checked={calmModeSettings.focusWeakLetters}
            onChange={(v) => updateCalmModeSettings({ focusWeakLetters: v })}
            label={t.calmMode.weakLetters}
            hideLabel
          />
        </SettingRow>

        <SettingRow label={t.calmMode.stats} description={t.calmMode.statsDesc}>
          <Toggle
            checked={calmModeSettings.showSubtleStats}
            onChange={(v) => updateCalmModeSettings({ showSubtleStats: v })}
            label={t.calmMode.stats}
            hideLabel
          />
        </SettingRow>
      </SettingsSection>

      {/* Data Management */}
      <SettingsSection title={t.data.title} icon={<DataIcon />}>
        <SettingRow label={t.data.export} description={t.data.exportDesc}>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t.data.exportButton}
          </button>
        </SettingRow>

        <SettingRow label={t.data.profile} description={t.data.profileDesc}>
          <Link
            href={`/${locale}/profile`}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {t.data.profileLink}
          </Link>
        </SettingRow>
      </SettingsSection>
    </div>
  );
}
