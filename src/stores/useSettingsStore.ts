import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KeyboardLayoutType } from '@/data/keyboard-layout';

export type AgeGroup = 'child' | 'teen' | 'adult';
type Theme = 'light' | 'dark' | 'system';

interface CalmModeSettings {
  showKeyboard: boolean;
  focusWeakLetters: boolean;
  showSubtleStats: boolean;
}

export interface InitialAssessment {
  wpm: number;
  accuracy: number;
  recommendedStage: number;
  completedAt: string;
}

// Layout-specific assessments
export type LayoutAssessments = Partial<Record<KeyboardLayoutType, InitialAssessment>>;

// Avatar options (index-based selection)
export type AvatarId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface SettingsState {
  ageGroup: AgeGroup;
  theme: Theme;
  soundEnabled: boolean;
  soundVolume: number;
  showKeyboard: boolean;
  showFingerGuide: boolean;
  fontSize: 'small' | 'medium' | 'large';
  calmModeSettings: CalmModeSettings;

  // Keyboard layout for typing practice
  keyboardLayout: KeyboardLayoutType;

  // User profile
  userName: string;
  userAvatar: AvatarId;

  // Onboarding state
  hasCompletedOnboarding: boolean;
  /** @deprecated Use layoutAssessments instead */
  initialAssessment: InitialAssessment | null;
  // Per-layout assessments (Phase 16)
  layoutAssessments: LayoutAssessments;

  // Actions
  setAgeGroup: (group: AgeGroup) => void;
  setTheme: (theme: Theme) => void;
  toggleSound: () => void;
  setSoundVolume: (volume: number) => void;
  toggleKeyboard: () => void;
  toggleFingerGuide: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  updateCalmModeSettings: (settings: Partial<CalmModeSettings>) => void;

  // Keyboard layout action
  setKeyboardLayout: (layout: KeyboardLayoutType) => void;

  // Profile actions
  setUserName: (name: string) => void;
  setUserAvatar: (avatarId: AvatarId) => void;

  // Onboarding actions
  completeOnboarding: () => void;
  setInitialAssessment: (assessment: InitialAssessment) => void;
  resetOnboarding: () => void;

  // Layout-aware assessment helpers
  getAssessmentForLayout: (layout?: KeyboardLayoutType) => InitialAssessment | null;
  hasAssessmentForCurrentLayout: () => boolean;
  needsAssessmentForLayout: (layout: KeyboardLayoutType) => boolean;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ageGroup: 'adult',
      theme: 'system',
      soundEnabled: true,
      soundVolume: 0.5,
      showKeyboard: true,
      showFingerGuide: true,
      fontSize: 'medium',
      calmModeSettings: {
        showKeyboard: true,
        focusWeakLetters: true,
        showSubtleStats: true,
      },

      // Keyboard layout (default to QWERTY)
      keyboardLayout: 'qwerty',

      // User profile
      userName: '',
      userAvatar: 1,

      // Onboarding state
      hasCompletedOnboarding: false,
      initialAssessment: null,
      layoutAssessments: {},

      setAgeGroup: (ageGroup) => set({ ageGroup }),
      setTheme: (theme) => set({ theme }),
      toggleSound: () => set({ soundEnabled: !get().soundEnabled }),
      setSoundVolume: (soundVolume) => set({ soundVolume }),
      toggleKeyboard: () => set({ showKeyboard: !get().showKeyboard }),
      toggleFingerGuide: () => set({ showFingerGuide: !get().showFingerGuide }),
      setFontSize: (fontSize) => set({ fontSize }),
      updateCalmModeSettings: (settings) =>
        set({
          calmModeSettings: {
            ...get().calmModeSettings,
            ...settings,
          },
        }),

      // Keyboard layout action
      setKeyboardLayout: (keyboardLayout) => set({ keyboardLayout }),

      // Profile actions
      setUserName: (userName) => set({ userName }),
      setUserAvatar: (userAvatar) => set({ userAvatar }),

      // Onboarding actions
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setInitialAssessment: (assessment) => {
        const currentLayout = get().keyboardLayout;
        set({
          initialAssessment: assessment,
          hasCompletedOnboarding: true,
          layoutAssessments: {
            ...get().layoutAssessments,
            [currentLayout]: assessment,
          },
        });
      },
      resetOnboarding: () =>
        set({
          hasCompletedOnboarding: false,
          initialAssessment: null,
          layoutAssessments: {},
          ageGroup: 'adult',
        }),

      // Layout-aware assessment helpers
      getAssessmentForLayout: (layout?: KeyboardLayoutType) => {
        const targetLayout = layout ?? get().keyboardLayout;
        return get().layoutAssessments[targetLayout] ?? null;
      },
      hasAssessmentForCurrentLayout: () => {
        const currentLayout = get().keyboardLayout;
        return currentLayout in get().layoutAssessments;
      },
      needsAssessmentForLayout: (layout: KeyboardLayoutType) => {
        return !(layout in get().layoutAssessments);
      },
    }),
    {
      name: 'keyquest-settings',
      version: 5,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Partial<SettingsState>;

        if (version < 2) {
          // Existing users: mark onboarding as completed so they don't see it
          return {
            ...state,
            hasCompletedOnboarding: true,
            initialAssessment: null,
            userName: '',
            userAvatar: 1,
            keyboardLayout: 'qwerty',
            layoutAssessments: {},
          } as SettingsState;
        }

        if (version < 3) {
          // Add user profile fields
          return {
            ...state,
            userName: '',
            userAvatar: 1,
            keyboardLayout: 'qwerty',
            layoutAssessments: {},
          } as SettingsState;
        }

        if (version < 4) {
          // Add keyboard layout setting
          return {
            ...state,
            keyboardLayout: 'qwerty',
            layoutAssessments: {},
          } as SettingsState;
        }

        if (version < 5) {
          // Migrate existing initialAssessment to layoutAssessments (Phase 16)
          const layoutAssessments: LayoutAssessments = {};
          if (state.initialAssessment) {
            // Existing assessment was for QWERTY layout
            layoutAssessments.qwerty = state.initialAssessment;
          }
          return {
            ...state,
            layoutAssessments,
          } as SettingsState;
        }

        return state as SettingsState;
      },
    }
  )
);
