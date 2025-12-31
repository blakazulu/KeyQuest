# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Phase 3: Visual Keyboard** - Interactive keyboard display with finger guidance
  - QWERTY keyboard layout data structure with finger assignments (`src/data/keyboard-layout.ts`)
  - `Key` component with 5 states (default, highlighted, pressed, correct, wrong)
  - `Keyboard` component displaying full QWERTY layout
  - `CompactKeyboard` component for smaller displays (letters only)
  - `FingerGuide` component showing stylized hands with active finger highlighted
  - `FingerIndicator` component for compact finger name display
  - `useKeyboardHighlight` hook managing keyboard state during typing
  - Finger color coding system (9 distinct colors per finger)
  - Key press animations (flash effects for correct/wrong keys)
  - Home row indicators on F and J keys
  - Keyboard integrated into TypingArea with settings-based visibility
  - Keyboard translations in both English and Hebrew
  - 34 new unit tests for keyboard layout and highlighting hook
- **Phase 2: Core Typing Engine** - Fully functional typing practice system
  - `useKeyboardInput` hook for capturing keyboard events
  - `useTypingEngine` hook orchestrating typing sessions with stats
  - `TextDisplay` component with character-level styling (correct/incorrect/current/pending)
  - `TypingArea` component combining text display, stats, and keyboard input
  - `Stats` component showing live WPM, accuracy, time, and errors
  - Typing utilities (`lib/typing-utils.ts`) for WPM, accuracy, and progress calculations
  - Updated `useTypingStore` with pause/resume and backspace support
  - Practice page with working typing interface and completion summary
  - Full keyboard shortcut support (Enter to start/resume, Escape to pause)
  - ARIA live regions for screen reader announcements
  - Bilingual translations for all practice UI (English/Hebrew)
- **Testing Infrastructure** - Vitest setup with React Testing Library
  - Vitest configuration for Next.js/React environment
  - 71 unit tests covering typing utilities, store, and keyboard input hook
  - Test commands: `npm test`, `npm run test:run`, `npm run test:coverage`
- Comprehensive design system documentation (`docs/DESIGN_SYSTEM.md`)
- Extended CSS custom properties with full design tokens:
  - Complete color system (surfaces, semantic, gamification, finger colors)
  - Spacing scale (4px base unit, 12 sizes)
  - Typography scale (8 sizes from caption to display-xl)
  - Border radius tokens (6 sizes)
  - Shadow tokens (including glow effects for gamification)
  - Animation timing and easing functions
  - Container width tokens
- Dark mode support via class toggle (`.dark`) in addition to `prefers-color-scheme`
- Pre-built CSS component classes:
  - Button variants (`.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-game`)
  - Card styles (`.card`, `.card-raised`)
  - Progress bars with gradient fills
  - Visual keyboard key styles with finger color coding
  - Gamification elements (XP ring, streak badge, achievement badge, rank badges)
- Animation utility classes:
  - `.animate-shake` for gentle error feedback
  - `.animate-pop` for correct keystroke celebration
  - `.animate-pulse-glow` for active elements
  - `.animate-flame` for streak fire effect
  - `.animate-shine` for achievement unlock
  - `.animate-count` for score changes
- Reduced motion support (`prefers-reduced-motion`)
- Internationalization (i18n) with next-intl supporting English and Hebrew
- RTL (right-to-left) layout support for Hebrew language
- Language switcher component in header
- Locale-based routing (/en and /he URL prefixes)
- Complete UI translations for all pages
- Typography system with language-aware fonts:
  - English: Baloo 2 (display/fun) and Nunito (body/UI)
  - Hebrew: Varela Round (display/fun) and Heebo (body/UI)
- CSS custom properties for fonts (`--font-display`, `--font-body`) with language fallbacks
- Typography utility classes (`.font-display`, `.font-body`, `.text-display-lg`, etc.)
- Comprehensive metadata configuration with Open Graph and Twitter cards
- JSON-LD structured data (Organization, WebSite, Course, FAQ, Speakable, Breadcrumb schemas)
- robots.txt with proper crawl directives
- Dynamic sitemap.xml with locale-specific URLs and alternates
- PWA manifest.json with app icons and configuration
- Favicon set using existing logo images (32px, 64px, 192px, 512px)
- Canonical URLs for all locale pages
- FAQ section on landing page with 5 common questions
- Key typing concepts section with entity definitions (Touch Typing, WPM, Accuracy, Home Row)
- "Why Learn Touch Typing?" section with question-based heading for AEO
- Speakable content markup for voice assistants
- SEO components for reusable JSON-LD schemas (`src/components/seo/JsonLd.tsx`)

## [0.1.0] - 2025-01-01

### Added
- Project foundation with Next.js 16, TypeScript, Tailwind CSS v4, and Zustand
- KeyQuest branding and home page with hero section
- Navigation header with links to Home, Levels, Practice, and Dashboard
- Placeholder pages for Practice, Levels, and Dashboard
- Zustand stores for progress tracking, user settings, and typing session state
- Dark mode support with system preference detection
- Project documentation (CLAUDE.md, implementation plan)
- Component directory structure for future development
