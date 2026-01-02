import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

  // User profile
  userName: string;
  userAvatar: AvatarId;

  // Onboarding state
  hasCompletedOnboarding: boolean;
  initialAssessment: InitialAssessment | null;

  // Actions
  setAgeGroup: (group: AgeGroup) => void;
  setTheme: (theme: Theme) => void;
  toggleSound: () => void;
  setSoundVolume: (volume: number) => void;
  toggleKeyboard: () => void;
  toggleFingerGuide: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  updateCalmModeSettings: (settings: Partial<CalmModeSettings>) => void;

  // Profile actions
  setUserName: (name: string) => void;
  setUserAvatar: (avatarId: AvatarId) => void;

  // Onboarding actions
  completeOnboarding: () => void;
  setInitialAssessment: (assessment: InitialAssessment) => void;
  resetOnboarding: () => void;
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

      // User profile
      userName: '',
      userAvatar: 1,

      // Onboarding state
      hasCompletedOnboarding: false,
      initialAssessment: null,

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

      // Profile actions
      setUserName: (userName) => set({ userName }),
      setUserAvatar: (userAvatar) => set({ userAvatar }),

      // Onboarding actions
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setInitialAssessment: (assessment) =>
        set({
          initialAssessment: assessment,
          hasCompletedOnboarding: true,
        }),
      resetOnboarding: () =>
        set({
          hasCompletedOnboarding: false,
          initialAssessment: null,
          ageGroup: 'adult',
        }),
    }),
    {
      name: 'keyquest-settings',
      version: 3,
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
          } as SettingsState;
        }

        if (version < 3) {
          // Add user profile fields
          return {
            ...state,
            userName: '',
            userAvatar: 1,
          } as SettingsState;
        }

        return state as SettingsState;
      },
    }
  )
);
