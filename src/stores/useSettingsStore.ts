import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AgeGroup = 'child' | 'teen' | 'adult';
type Theme = 'light' | 'dark' | 'system';

interface CalmModeSettings {
  showKeyboard: boolean;
  focusWeakLetters: boolean;
  showSubtleStats: boolean;
}

interface SettingsState {
  ageGroup: AgeGroup;
  theme: Theme;
  soundEnabled: boolean;
  soundVolume: number;
  showKeyboard: boolean;
  showFingerGuide: boolean;
  fontSize: 'small' | 'medium' | 'large';
  calmModeSettings: CalmModeSettings;

  // Actions
  setAgeGroup: (group: AgeGroup) => void;
  setTheme: (theme: Theme) => void;
  toggleSound: () => void;
  setSoundVolume: (volume: number) => void;
  toggleKeyboard: () => void;
  toggleFingerGuide: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  updateCalmModeSettings: (settings: Partial<CalmModeSettings>) => void;
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
    }),
    {
      name: 'keyquest-settings',
    }
  )
);
