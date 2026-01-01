'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { QuestMapImage } from '@/components/levels/QuestMapImage';
import { LessonSelectionModal } from '@/components/levels/LessonSelectionModal';
import { FloatingMenu } from '@/components/layout/FloatingMenu';
import { useProgressStore } from '@/stores/useProgressStore';
import { stages as allStages, getStage } from '@/data/lessons';
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

  // Compute stage statuses from progress store
  const stages = useMemo(() => {
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
        status = completedCount > 0 ? 'current' : 'available';
      }

      // For display, treat 'available' as 'current' for first unlocked stage
      if (status === 'available' && completedCount === 0) {
        status = 'current';
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
  }, [allStages, locale, completedLessons, isStageCompleted, isStageUnlocked]);

  // Get the selected stage data for the modal
  const selectedStage = useMemo(() => {
    if (selectedStageId === null) return null;
    return getStage(selectedStageId) ?? null;
  }, [selectedStageId]);

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
