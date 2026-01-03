'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { QuestMapImage } from '@/components/levels/QuestMapImage';
import { LessonSelectionModal } from '@/components/levels/LessonSelectionModal';
import { FloatingMenu } from '@/components/layout/FloatingMenu';
import { useProgressStore } from '@/stores/useProgressStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { getStagesForLayout, getStageForLayout } from '@/data/lessons';
import type { LevelStatus } from '@/components/ui/LevelCard';

export default function LevelsPage() {
  const locale = useLocale() as 'en' | 'he';

  // Modal state
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);

  // Progress store
  const isStageUnlocked = useProgressStore((s) => s.isStageUnlocked);
  const isStageCompleted = useProgressStore((s) => s.isStageCompleted);
  const isLessonUnlocked = useProgressStore((s) => s.isLessonUnlocked);
  const getLessonProgress = useProgressStore((s) => s.getLessonProgress);
  const completedLessons = useProgressStore((s) => s.completedLessons);

  // Settings store for assessment and keyboard layout
  const keyboardLayout = useSettingsStore((s) => s.keyboardLayout);
  const getAssessmentForLayout = useSettingsStore((s) => s.getAssessmentForLayout);

  // Get assessment for current layout (not the global one)
  const layoutAssessment = useMemo(() => getAssessmentForLayout(keyboardLayout), [getAssessmentForLayout, keyboardLayout]);

  // Get stages for the current keyboard layout
  const allStages = useMemo(() => getStagesForLayout(keyboardLayout), [keyboardLayout]);

  // Compute stage statuses from progress store
  const stages = useMemo(() => {
    // Find if user has any lessons in progress
    const stageWithProgress = allStages.find((stage) => {
      const hasProgress = stage.lessons.some((l) => completedLessons.includes(l.id));
      const isCompleted = isStageCompleted(stage.id);
      return hasProgress && !isCompleted;
    });

    // Determine which stage should be marked as current
    let currentStageId: number | null = null;

    if (stageWithProgress) {
      // If user has started a stage, that's the current one
      currentStageId = stageWithProgress.id;
    } else if (layoutAssessment?.recommendedStage && completedLessons.length === 0) {
      // If user has assessment for this layout but no lessons completed, recommended stage is current
      currentStageId = layoutAssessment.recommendedStage;
    } else {
      // Otherwise, first unlocked non-completed stage is current
      const firstUnlocked = allStages.find(
        (s) => isStageUnlocked(s.id) && !isStageCompleted(s.id)
      );
      currentStageId = firstUnlocked?.id ?? null;
    }

    return allStages.map((stage) => {
      // Count completed lessons in this stage
      const completedCount = stage.lessons.filter(
        (l) => completedLessons.includes(l.id)
      ).length;

      // Determine status
      let status: LevelStatus = 'locked';
      if (isStageCompleted(stage.id)) {
        status = 'completed';
      } else if (isStageUnlocked(stage.id)) {
        status = stage.id === currentStageId ? 'current' : 'available';
      }

      return {
        id: stage.id,
        name: stage.name[locale],
        description: stage.description[locale],
        lessons: stage.lessons.length,
        completedLessons: completedCount,
        status,
      };
    });
  }, [allStages, locale, completedLessons, isStageCompleted, isStageUnlocked, layoutAssessment, keyboardLayout]);

  // Get the selected stage data for the modal
  const selectedStage = useMemo(() => {
    if (selectedStageId === null) return null;
    return getStageForLayout(selectedStageId, keyboardLayout) ?? null;
  }, [selectedStageId, keyboardLayout]);

  // Handle stage click to open modal
  const handleStageClick = useCallback((stageId: number) => {
    setSelectedStageId(stageId);
  }, []);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setSelectedStageId(null);
  }, []);

  // Enable fullscreen mode for this page
  useEffect(() => {
    document.body.classList.add('fullscreen-mode');
    return () => {
      document.body.classList.remove('fullscreen-mode');
    };
  }, []);

  return (
    <>
      {/* Floating menu for navigation */}
      <FloatingMenu />

      {/* Full-screen Quest Map with Background Image */}
      <QuestMapImage
        stages={stages}
        locale={locale}
        onStageClick={handleStageClick}
      />

      {/* Lesson Selection Modal */}
      {selectedStage && (
        <LessonSelectionModal
          stage={selectedStage}
          locale={locale}
          isOpen={selectedStageId !== null}
          onClose={handleCloseModal}
          isLessonUnlocked={isLessonUnlocked}
          getLessonProgress={getLessonProgress}
        />
      )}
    </>
  );
}
