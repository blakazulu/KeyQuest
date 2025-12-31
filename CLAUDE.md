# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical Rules

1. **Bilingual Content**: Website is in English and Hebrew - always add text in BOTH languages
2. **Accessibility First**: WCAG 2.2 Level AA compliance required - all components must have ARIA labels, roles, and full keyboard navigation
3. **SEO/AEO/GEO Compliance**: All pages must be optimized for search engines, answer engines, and generative engines
4. **Never Push to Git**: Always ask before pushing - only commit when explicitly approved
5. **Update Changelog**: Add notable changes to `CHANGELOG.md` under `[Unreleased]` section (follows [Keep a Changelog](https://keepachangelog.com) format)

## Project Overview

KeyQuest is a fun, game-driven touch typing learning application built with Next.js 16, TypeScript, Tailwind CSS v4, and Zustand for state management.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run start    # Run production server
npm run lint     # Run ESLint
```

No testing framework is set up yet (planned for Phase 13 with Vitest).

## Architecture

### Tech Stack
- **Next.js 16.1.1** with App Router (not Pages Router)
- **TypeScript 5** in strict mode
- **Tailwind CSS v4** with custom CSS variables
- **Zustand 5** for state management with localStorage persistence
- **Framer Motion** for animations

### Directory Structure
```
src/
├── app/
│   └── [locale]/  # Locale-based routing (en/he)
├── i18n/          # Internationalization config
├── components/    # React components grouped by feature
│   ├── layout/    # Header, LanguageSwitcher
│   ├── typing/    # Typing engine components (Phase 2)
│   ├── keyboard/  # Visual keyboard (Phase 3)
│   ├── games/     # Game modes (Phase 12)
│   └── ui/        # Shared UI components
├── stores/        # Zustand state stores
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── data/          # Static content (lessons, etc.)
└── types/         # TypeScript type definitions
messages/          # Translation files (en.json, he.json)
```

### State Management (Zustand)
Three stores with clear separation of concerns:
- **useTypingStore** - Current typing session (input, errors, position) - NOT persisted
- **useProgressStore** - User progress, stats, streaks - persisted to `keyquest-progress`
- **useSettingsStore** - User preferences (theme, sound, font) - persisted to `keyquest-settings`

### Styling Conventions
- Tailwind utility classes with `dark:` prefix for dark mode
- Zinc color palette as the primary neutral
- Custom CSS variables in `globals.css` for theming
- Custom classes: `.typing-text` (monospace), `.cursor-blink`

### Path Alias
Use `@/` for imports from `src/`:
```typescript
import { Header } from '@/components/layout/Header';
import { useProgressStore } from '@/stores/useProgressStore';
```

## Implementation Status

Currently at **Phase 1.5** of a 14-phase implementation plan. See `/docs/IMPLEMENTATION_PLAN.md` for the full roadmap.

**Completed**: Project foundation, navigation, placeholder pages, Zustand stores, dark mode, i18n (English/Hebrew with RTL)
**Next**: Phase 2 (Core Typing Engine), Phase 3 (Visual Keyboard)

## Key Requirements

- **Bilingual**: All user-facing text must be in English AND Hebrew (RTL support required)
- **Accessibility**: WCAG 2.2 Level AA - ARIA labels, keyboard navigation, focus management, live regions
- **SEO/AEO/GEO**: Semantic HTML, meta tags, structured data, optimized for AI answer engines
- **Performance**: Typing feedback must be <16ms per keystroke
