'use client';

import { memo } from 'react';
import Link from 'next/link';
import type { LevelStatus } from '@/components/ui/LevelCard';

interface Stage {
  id: number;
  name: string;
  description: string;
  lessons: number;
  completedLessons?: number;
  status: LevelStatus;
  href?: string;
}

interface QuestMapProps {
  stages: Stage[];
  locale: 'en' | 'he';
  className?: string;
}

// Zone configurations with visual themes
const zoneConfig: Record<number, {
  zone: string;
  icon: string;
  landmark: string;
  color: string;
  accentColor: string;
}> = {
  1: { zone: 'village', icon: '🏠', landmark: 'cottage', color: '#F4A460', accentColor: '#CD853F' },
  2: { zone: 'lagoon', icon: '🌊', landmark: 'dock', color: '#40E0D0', accentColor: '#20B2AA' },
  3: { zone: 'mountain', icon: '⛰️', landmark: 'cave', color: '#708090', accentColor: '#9370DB' },
  4: { zone: 'forest', icon: '🌲', landmark: 'treehouse', color: '#228B22', accentColor: '#32CD32' },
  5: { zone: 'snow', icon: '🏔️', landmark: 'cabin', color: '#B0E0E6', accentColor: '#87CEEB' },
  6: { zone: 'summit', icon: '🏆', landmark: 'castle', color: '#FFD700', accentColor: '#FFA500' },
};

// Lesson stone component
const LessonStone = memo(function LessonStone({
  completed,
  current,
  locked,
  index,
  stageColor,
}: {
  completed: boolean;
  current: boolean;
  locked: boolean;
  index: number;
  stageColor: string;
}) {
  return (
    <div
      className={`
        quest-stone
        ${completed ? 'quest-stone-completed' : ''}
        ${current ? 'quest-stone-current' : ''}
        ${locked ? 'quest-stone-locked' : ''}
      `}
      style={{ '--stone-color': stageColor } as React.CSSProperties}
      aria-label={completed ? 'Completed lesson' : current ? 'Current lesson' : 'Lesson'}
    >
      {completed && <span className="quest-stone-check">✓</span>}
      {current && <span className="quest-stone-star">⭐</span>}
      {!completed && !current && !locked && <span className="quest-stone-num">{index + 1}</span>}
      {locked && <span className="quest-stone-lock">🔒</span>}
    </div>
  );
});

// Stage signpost component
const StageSignpost = memo(function StageSignpost({
  stage,
  config,
  locale,
  position,
}: {
  stage: Stage;
  config: typeof zoneConfig[1];
  locale: 'en' | 'he';
  position: 'left' | 'right';
}) {
  const isInteractive = stage.status !== 'locked';
  const statusLabels: Record<LevelStatus, { en: string; he: string }> = {
    locked: { en: 'Locked', he: 'נעול' },
    available: { en: 'Begin!', he: 'התחל!' },
    current: { en: 'Continue', he: 'המשך' },
    completed: { en: 'Complete!', he: 'הושלם!' },
  };

  const content = (
    <div
      className={`
        quest-signpost
        quest-signpost-${position}
        quest-signpost-${stage.status}
      `}
      style={{
        '--sign-color': config.color,
        '--sign-accent': config.accentColor,
      } as React.CSSProperties}
    >
      {/* Wooden pole */}
      <div className="quest-signpost-pole" />

      {/* Sign board */}
      <div className="quest-signpost-board">
        {/* Stage number badge */}
        <div className="quest-signpost-number">
          {stage.status === 'locked' ? '🔒' : stage.id}
        </div>

        {/* Icon */}
        <div className="quest-signpost-icon">{config.icon}</div>

        {/* Name */}
        <h3 className="quest-signpost-name">{stage.name}</h3>

        {/* Progress or status */}
        {stage.status === 'current' && stage.completedLessons !== undefined && (
          <div className="quest-signpost-progress">
            <div className="quest-signpost-progress-bar">
              <div
                className="quest-signpost-progress-fill"
                style={{ width: `${(stage.completedLessons / stage.lessons) * 100}%` }}
              />
            </div>
            <span>{stage.completedLessons}/{stage.lessons}</span>
          </div>
        )}

        {stage.status === 'completed' && (
          <div className="quest-signpost-stars">⭐⭐⭐</div>
        )}

        {/* Action button */}
        {stage.status !== 'locked' && (
          <div className="quest-signpost-action">
            {statusLabels[stage.status][locale]}
          </div>
        )}
      </div>

      {/* Current stage indicator */}
      {stage.status === 'current' && (
        <div className="quest-signpost-here">
          <span>{locale === 'he' ? 'אתה כאן!' : 'YOU ARE HERE!'}</span>
        </div>
      )}
    </div>
  );

  if (isInteractive && stage.href) {
    return (
      <Link href={stage.href} className="quest-signpost-link">
        {content}
      </Link>
    );
  }

  return content;
});

// Main illustrated quest map
export const QuestMapIllustrated = memo(function QuestMapIllustrated({
  stages,
  locale,
  className = '',
}: QuestMapProps) {
  // Generate lesson stones for a stage
  const renderLessonStones = (stage: Stage, stageIndex: number) => {
    const config = zoneConfig[stage.id];
    const stones = [];
    const isLocked = stage.status === 'locked';

    for (let i = 0; i < stage.lessons; i++) {
      const completed = (stage.completedLessons || 0) > i;
      const current = stage.status === 'current' && i === (stage.completedLessons || 0);

      stones.push(
        <LessonStone
          key={`stone-${stage.id}-${i}`}
          completed={completed}
          current={current}
          locked={isLocked}
          index={i}
          stageColor={config.color}
        />
      );
    }

    return stones;
  };

  return (
    <div
      className={`quest-illustrated ${className}`}
      role="navigation"
      aria-label={locale === 'he' ? 'מפת המסע' : 'Quest Map'}
    >
      {/* Start banner */}
      <div className="quest-start-banner">
        <div className="quest-start-flag">🚩</div>
        <span>{locale === 'he' ? 'התחל כאן!' : 'START HERE!'}</span>
      </div>

      {/* Zone layers - bottom to top */}
      <div className="quest-zones">
        {/* Zone 1: Village */}
        <div className="quest-zone quest-zone-village">
          <div className="zone-bg" />
          <div className="zone-decoration zone-houses">
            <div className="house house-1" />
            <div className="house house-2" />
            <div className="house house-3" />
          </div>
          <div className="zone-decoration zone-fence" />
          <div className="zone-path">
            <div className="path-dots" />
            <div className="path-stones">
              {renderLessonStones(stages[0], 0)}
            </div>
          </div>
          <StageSignpost
            stage={stages[0]}
            config={zoneConfig[1]}
            locale={locale}
            position="left"
          />
        </div>

        {/* Zone 2: Lagoon */}
        <div className="quest-zone quest-zone-lagoon">
          <div className="zone-bg" />
          <div className="zone-decoration zone-water">
            <div className="wave wave-1" />
            <div className="wave wave-2" />
            <div className="wave wave-3" />
          </div>
          <div className="zone-decoration zone-beach">
            <div className="shell shell-1">🐚</div>
            <div className="shell shell-2">🦀</div>
            <div className="palm">🌴</div>
          </div>
          <div className="zone-path">
            <div className="path-dots" />
            <div className="path-stones">
              {renderLessonStones(stages[1], 1)}
            </div>
          </div>
          <StageSignpost
            stage={stages[1]}
            config={zoneConfig[2]}
            locale={locale}
            position="right"
          />
        </div>

        {/* Zone 3: Mountain */}
        <div className="quest-zone quest-zone-mountain">
          <div className="zone-bg" />
          <div className="zone-decoration zone-rocks">
            <div className="rock rock-1" />
            <div className="rock rock-2" />
            <div className="rock rock-3" />
            <div className="cave">🕳️</div>
          </div>
          <div className="zone-path">
            <div className="path-dots" />
            <div className="path-stones">
              {renderLessonStones(stages[2], 2)}
            </div>
          </div>
          <StageSignpost
            stage={stages[2]}
            config={zoneConfig[3]}
            locale={locale}
            position="left"
          />
        </div>

        {/* Zone 4: Forest */}
        <div className="quest-zone quest-zone-forest">
          <div className="zone-bg" />
          <div className="zone-decoration zone-trees">
            <div className="tree tree-1">🌲</div>
            <div className="tree tree-2">🌳</div>
            <div className="tree tree-3">🌲</div>
            <div className="tree tree-4">🌳</div>
            <div className="vine vine-1" />
            <div className="butterfly">🦋</div>
          </div>
          <div className="zone-path">
            <div className="path-dots" />
            <div className="path-stones">
              {renderLessonStones(stages[3], 3)}
            </div>
          </div>
          <StageSignpost
            stage={stages[3]}
            config={zoneConfig[4]}
            locale={locale}
            position="right"
          />
        </div>

        {/* Zone 5: Snow */}
        <div className="quest-zone quest-zone-snow">
          <div className="zone-bg" />
          <div className="zone-decoration zone-snow-elements">
            <div className="snowflake sf-1">❄️</div>
            <div className="snowflake sf-2">❄️</div>
            <div className="snowflake sf-3">❄️</div>
            <div className="pine pine-1">🎄</div>
            <div className="pine pine-2">🎄</div>
            <div className="snowman">⛄</div>
          </div>
          <div className="zone-path">
            <div className="path-dots" />
            <div className="path-stones">
              {renderLessonStones(stages[4], 4)}
            </div>
          </div>
          <StageSignpost
            stage={stages[4]}
            config={zoneConfig[5]}
            locale={locale}
            position="left"
          />
        </div>

        {/* Zone 6: Summit */}
        <div className="quest-zone quest-zone-summit">
          <div className="zone-bg" />
          <div className="zone-decoration zone-summit-elements">
            <div className="summit-glow" />
            <div className="trophy">🏆</div>
            <div className="sparkle sp-1">✨</div>
            <div className="sparkle sp-2">✨</div>
            <div className="sparkle sp-3">✨</div>
            <div className="crown">👑</div>
          </div>
          <div className="zone-path">
            <div className="path-dots path-dots-final" />
            <div className="path-stones">
              {renderLessonStones(stages[5], 5)}
            </div>
          </div>
          <StageSignpost
            stage={stages[5]}
            config={zoneConfig[6]}
            locale={locale}
            position="right"
          />
        </div>
      </div>

      {/* Finish banner */}
      <div className="quest-finish-banner">
        <span>{locale === 'he' ? 'אלוף ההקלדה!' : 'TYPING MASTER!'}</span>
        <div className="quest-finish-trophy">🏆</div>
      </div>

      {/* Legend */}
      <div className="quest-legend-illustrated" dir={locale === 'he' ? 'rtl' : 'ltr'}>
        <div className="legend-item">
          <div className="legend-stone legend-completed" />
          <span>{locale === 'he' ? 'הושלם' : 'Done'}</span>
        </div>
        <div className="legend-item">
          <div className="legend-stone legend-current" />
          <span>{locale === 'he' ? 'נוכחי' : 'Current'}</span>
        </div>
        <div className="legend-item">
          <div className="legend-stone legend-locked" />
          <span>{locale === 'he' ? 'נעול' : 'Locked'}</span>
        </div>
      </div>
    </div>
  );
});

export default QuestMapIllustrated;
