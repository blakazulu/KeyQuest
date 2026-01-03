'use client';

import { useState, useRef, useEffect } from 'react';
import type { AgeGroup, AvatarId } from '@/stores/useSettingsStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import type { KeyboardLayoutType } from '@/data/keyboard-layout';

interface ProfileSelectorProps {
  locale: 'en' | 'he';
  onSelect: (profile: AgeGroup, name: string, avatarId: AvatarId) => void;
}

const translations = {
  en: {
    title: "Who's learning today?",
    child: {
      title: 'Child',
      age: 'Ages 6-12',
      description: 'Fun and colorful learning experience',
    },
    teen: {
      title: 'Teen',
      age: 'Ages 13-17',
      description: 'Cool challenges and achievements',
    },
    adult: {
      title: 'Adult',
      age: 'Ages 18+',
      description: 'Efficient skill building',
    },
    namePlaceholder: "What's your name?",
    nameOptional: '(optional)',
    chooseAvatar: 'Choose your avatar',
    chooseLayout: 'Keyboard Layout',
    layoutQwerty: 'QWERTY (English)',
    layoutHebrew: 'Hebrew (עברית)',
    continue: 'Continue',
  },
  he: {
    title: 'מי לומד היום?',
    child: {
      title: 'ילד',
      age: 'גילאי 6-12',
      description: 'חוויה צבעונית ומהנה',
    },
    teen: {
      title: 'נער',
      age: 'גילאי 13-17',
      description: 'אתגרים והישגים',
    },
    adult: {
      title: 'מבוגר',
      age: '18+',
      description: 'בניית מיומנות יעילה',
    },
    namePlaceholder: 'מה שמך?',
    nameOptional: '(אופציונלי)',
    chooseAvatar: 'בחר את האווטר שלך',
    chooseLayout: 'פריסת מקלדת',
    layoutQwerty: 'QWERTY (אנגלית)',
    layoutHebrew: 'עברית (Hebrew)',
    continue: 'המשך',
  },
};

// SVG illustrations for each profile
function ChildIllustration({ selected }: { selected: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="w-20 h-20" aria-hidden="true">
      <g className={`transition-opacity ${selected ? 'opacity-100' : 'opacity-60'}`}>
        <path d="M20 25l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" fill="#fbbf24" />
        <path d="M95 20l1.5 3 3 .75-2.25 2.25.75 3-3-1.5-3 1.5.75-3-2.25-2.25 3-.75z" fill="#fbbf24" />
      </g>
      <rect x="25" y="75" width="70" height="25" rx="4" fill={selected ? '#34d399' : '#94a3b8'} className="transition-colors" />
      <rect x="30" y="80" width="8" height="6" rx="1" fill="white" opacity="0.5" />
      <rect x="42" y="80" width="8" height="6" rx="1" fill="white" opacity="0.5" />
      <rect x="54" y="80" width="8" height="6" rx="1" fill="white" opacity="0.5" />
      <circle cx="60" cy="45" r="25" fill={selected ? '#fcd34d' : '#e2e8f0'} className="transition-colors" />
      <ellipse cx="60" cy="30" rx="20" ry="12" fill={selected ? '#92400e' : '#64748b'} className="transition-colors" />
      <circle cx="52" cy="42" r="4" fill="#1e293b" />
      <circle cx="68" cy="42" r="4" fill="#1e293b" />
      <circle cx="53" cy="41" r="1.5" fill="white" />
      <circle cx="69" cy="41" r="1.5" fill="white" />
      <path d="M50 52 Q60 62 70 52" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="45" cy="50" r="4" fill="#f472b6" opacity="0.4" />
      <circle cx="75" cy="50" r="4" fill="#f472b6" opacity="0.4" />
    </svg>
  );
}

function TeenIllustration({ selected }: { selected: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="w-20 h-20" aria-hidden="true">
      <g className={`transition-opacity ${selected ? 'opacity-100' : 'opacity-60'}`}>
        <path d="M15 30l5-10 2 8 5-5-3 10-2-6z" fill="#facc15" />
        <path d="M100 25l4-8 1.5 6 4-4-2.5 8-1.5-5z" fill="#facc15" />
      </g>
      <path d="M30 55 Q30 30 60 25 Q90 30 90 55" stroke={selected ? '#10b981' : '#94a3b8'} strokeWidth="6" fill="none" className="transition-colors" />
      <rect x="22" y="48" width="16" height="22" rx="4" fill={selected ? '#10b981' : '#94a3b8'} className="transition-colors" />
      <rect x="82" y="48" width="16" height="22" rx="4" fill={selected ? '#10b981' : '#94a3b8'} className="transition-colors" />
      <circle cx="60" cy="55" r="22" fill={selected ? '#fcd34d' : '#e2e8f0'} className="transition-colors" />
      <path d="M40 42 Q50 30 60 35 Q70 30 80 42 L75 45 Q65 38 60 42 Q55 38 45 45 Z" fill={selected ? '#1e293b' : '#475569'} className="transition-colors" />
      <rect x="48" y="50" width="8" height="4" rx="2" fill="#1e293b" />
      <rect x="64" y="50" width="8" height="4" rx="2" fill="#1e293b" />
      <path d="M52 65 Q60 70 68 65" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="40" y="85" width="40" height="25" rx="3" fill={selected ? '#059669' : '#64748b'} className="transition-colors" />
    </svg>
  );
}

function AdultIllustration({ selected }: { selected: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className="w-20 h-20" aria-hidden="true">
      <rect x="15" y="85" width="90" height="8" rx="2" fill={selected ? '#10b981' : '#94a3b8'} className="transition-colors" />
      <rect x="35" y="50" width="50" height="35" rx="3" fill={selected ? '#1e293b' : '#475569'} className="transition-colors" />
      <rect x="38" y="53" width="44" height="26" rx="2" fill={selected ? '#10b981' : '#94a3b8'} className="transition-colors" />
      <rect x="42" y="57" width="20" height="2" rx="1" fill="white" opacity="0.7" />
      <rect x="42" y="62" width="30" height="2" rx="1" fill="white" opacity="0.5" />
      <rect x="42" y="67" width="15" height="2" rx="1" fill="white" opacity="0.7" />
      <circle cx="60" cy="28" r="15" fill={selected ? '#fcd34d' : '#e2e8f0'} className="transition-colors" />
      <path d="M48 20 Q55 12 60 15 Q65 12 72 20 Q70 18 60 18 Q50 18 48 20" fill={selected ? '#44403c' : '#64748b'} className="transition-colors" />
      <rect x="50" y="24" width="8" height="6" rx="1" fill="none" stroke="#1e293b" strokeWidth="1.5" />
      <rect x="62" y="24" width="8" height="6" rx="1" fill="none" stroke="#1e293b" strokeWidth="1.5" />
      <line x1="58" y1="27" x2="62" y2="27" stroke="#1e293b" strokeWidth="1.5" />
      <circle cx="54" cy="27" r="1.5" fill="#1e293b" />
      <circle cx="66" cy="27" r="1.5" fill="#1e293b" />
      <path d="M55 33 Q60 36 65 33" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Age-specific avatars
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

// Avatar display component
function AvatarOption({ avatar, selected, onClick }: {
  avatar: { id: AvatarId; color: string; icon: string };
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-12 h-12 rounded-full bg-gradient-to-br ${avatar.color}
        flex items-center justify-center text-xl
        transition-all duration-200
        ${selected
          ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 scale-110'
          : 'hover:scale-110'
        }
      `}
      aria-pressed={selected}
      aria-label={`Avatar ${avatar.id}`}
    >
      {avatar.icon}
    </button>
  );
}

const profiles: { key: AgeGroup; Illustration: typeof ChildIllustration }[] = [
  { key: 'child', Illustration: ChildIllustration },
  { key: 'teen', Illustration: TeenIllustration },
  { key: 'adult', Illustration: AdultIllustration },
];

export function ProfileSelector({ locale, onSelect }: ProfileSelectorProps) {
  const t = translations[locale];
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);
  const [userName, setUserName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>(1);
  const [selectedLayout, setSelectedLayout] = useState<KeyboardLayoutType>('qwerty');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const setKeyboardLayout = useSettingsStore((s) => s.setKeyboardLayout);

  // Keyboard navigation for age groups
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedAge) {
        const isRTL = locale === 'he';
        const nextKey = isRTL ? 'ArrowLeft' : 'ArrowRight';
        const prevKey = isRTL ? 'ArrowRight' : 'ArrowLeft';

        if (e.key === nextKey || e.key === 'ArrowDown') {
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % profiles.length);
        } else if (e.key === prevKey || e.key === 'ArrowUp') {
          e.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + profiles.length) % profiles.length);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [locale, selectedAge]);

  // Focus management
  useEffect(() => {
    if (!selectedAge) {
      cardRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, selectedAge]);

  const handleAgeSelect = (age: AgeGroup) => {
    setSelectedAge(age);
    // Reset avatar to first one for new age group
    setSelectedAvatar(1);
  };

  const handleContinue = () => {
    if (selectedAge) {
      // Set the keyboard layout before continuing to the typing test
      setKeyboardLayout(selectedLayout);
      onSelect(selectedAge, userName.trim(), selectedAvatar);
    }
  };

  const handleBack = () => {
    setSelectedAge(null);
  };

  // Show name and avatar selection after age is chosen
  if (selectedAge) {
    const avatars = ageAvatars[selectedAge];

    return (
      <div className="text-center">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="absolute top-4 ltr:left-4 rtl:right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={locale === 'he' ? 'חזור' : 'Back'}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={locale === 'he' ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
          </svg>
        </button>

        {/* Name input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={t.namePlaceholder}
              maxLength={20}
              className="w-full px-4 py-3 text-center text-lg rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
              autoFocus
            />
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-xs text-gray-400">
              {t.nameOptional}
            </span>
          </div>
        </div>

        {/* Avatar selection */}
        <div className="mb-6 mt-8">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            {t.chooseAvatar}
          </h4>
          <div className="flex flex-wrap justify-center gap-3">
            {avatars.map((avatar) => (
              <AvatarOption
                key={avatar.id}
                avatar={avatar}
                selected={selectedAvatar === avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
              />
            ))}
          </div>
        </div>

        {/* Keyboard layout selection */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            {t.chooseLayout}
          </h4>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setSelectedLayout('qwerty')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all
                ${selectedLayout === 'qwerty'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-300'
                }
              `}
              aria-pressed={selectedLayout === 'qwerty'}
            >
              <span className="text-lg">🔤</span>
              <span className="font-medium">{t.layoutQwerty}</span>
            </button>
            <button
              onClick={() => setSelectedLayout('hebrew')}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all
                ${selectedLayout === 'hebrew'
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-300'
                }
              `}
              aria-pressed={selectedLayout === 'hebrew'}
            >
              <span className="text-lg">🔤</span>
              <span className="font-medium">{t.layoutHebrew}</span>
            </button>
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          className="w-full py-3 rounded-xl font-semibold text-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          {t.continue} →
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        {t.title}
      </h3>

      <div className="grid grid-cols-3 gap-3 mb-6" role="radiogroup" aria-label={t.title}>
        {profiles.map((profile, index) => {
          const profileT = t[profile.key];
          const isSelected = selectedAge === profile.key;

          return (
            <button
              key={profile.key}
              ref={(el) => { cardRefs.current[index] = el; }}
              onClick={() => handleAgeSelect(profile.key)}
              onFocus={() => setFocusedIndex(index)}
              className={`
                relative p-3 rounded-2xl border-2 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                ${isSelected
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg shadow-emerald-500/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600 bg-white dark:bg-gray-700'
                }
              `}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${profileT.title} - ${profileT.age} - ${profileT.description}`}
            >
              <div className="flex flex-col items-center gap-1">
                <profile.Illustration selected={isSelected} />
                <div className="mt-1">
                  <p className={`font-bold text-base ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-200'}`}>
                    {profileT.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {profileT.age}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        {locale === 'he' ? 'לחץ על קבוצת גיל להמשך' : 'Click an age group to continue'}
      </p>
    </div>
  );
}

export default ProfileSelector;
