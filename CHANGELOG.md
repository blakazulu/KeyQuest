# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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
