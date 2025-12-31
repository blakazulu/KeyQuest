# Typing Learning Website - Implementation Plan

## Technical Decisions

### Tech Stack

| Layer                | Choice                         | Rationale                                                             |
| -------------------- | ------------------------------ | --------------------------------------------------------------------- |
| **Framework**        | Next.js 14 (App Router)        | SSR for landing page SEO, excellent React foundation, easy deployment |
| **Language**         | TypeScript                     | Type safety crucial for complex game state, better DX                 |
| **Styling**          | Tailwind CSS                   | Rapid development, consistent design system, responsive built-in      |
| **State Management** | Zustand                        | Lightweight, performant, perfect for this scale (no Redux overhead)   |
| **Animations**       | Framer Motion                  | Smooth animations for games, great React integration                  |
| **i18n**             | next-intl                      | Best Next.js App Router i18n library, supports RTL, type-safe         |
| **Storage**          | LocalStorage (Phase 1)         | Guest mode first, cloud later                                         |
| **Testing**          | Vitest + React Testing Library | Fast, modern testing stack                                            |
| **Deployment**       | Vercel                         | Zero-config Next.js deployment                                        |

### Why These Choices?

1. **Performance is critical** - Every keystroke needs <16ms feedback. React 18 + Next.js handles this well.
2. **SEO matters** - Landing page needs to rank. Next.js SSR solves this.
3. **Developer velocity** - Tailwind + TypeScript + Zustand = fast iteration with safety.
4. **Animation quality** - Framer Motion makes games feel polished without complexity.

---

## Compliance Requirements

### WCAG 2.2 (Accessibility)

The website MUST comply with WCAG 2.2 Level AA guidelines:

| Requirement           | Implementation                                               |
| --------------------- | ------------------------------------------------------------ |
| Keyboard navigation   | All interactive elements focusable and operable              |
| Screen reader support | Semantic HTML, ARIA labels, live regions for typing feedback |
| Color contrast        | Minimum 4.5:1 for text, 3:1 for large text                   |
| Focus indicators      | Visible focus states on all interactive elements             |
| Text resizing         | Support up to 200% zoom without loss of functionality        |
| Motion preferences    | Respect `prefers-reduced-motion`                             |
| Error identification  | Clear error messages with suggestions                        |
| Skip links            | Skip to main content link                                    |
| Alt text              | All images have descriptive alt text                         |
| Form labels           | All inputs properly labeled                                  |

#### Keyboard Navigation Requirements

| Context         | Keys                | Action                              |
| --------------- | ------------------- | ----------------------------------- |
| Global          | `Tab` / `Shift+Tab` | Navigate between focusable elements |
| Global          | `Enter` / `Space`   | Activate buttons and links          |
| Global          | `Escape`            | Close modals, cancel actions        |
| Practice screen | `Enter`             | Start lesson / Next task            |
| Practice screen | `Escape`            | Pause / Exit practice               |
| Practice screen | `Tab`               | Skip to next interactive area       |
| Summary screen  | `Enter`             | Continue to next lesson             |
| Summary screen  | `R`                 | Restart current lesson              |
| Levels page     | `Arrow keys`        | Navigate between levels             |
| Modal dialogs   | `Tab` trapped       | Focus stays within modal            |

#### ARIA Labels & Live Regions

| Component          | ARIA Implementation                                        |
| ------------------ | ---------------------------------------------------------- |
| Typing area        | `role="textbox"`, `aria-label="Type the text shown above"` |
| Current character  | `aria-current="true"` on active character                  |
| Error feedback     | `aria-live="polite"` for mistake announcements             |
| WPM/Accuracy stats | `aria-live="polite"` for periodic updates                  |
| Progress indicator | `role="progressbar"`, `aria-valuenow`, `aria-valuemax`     |
| Lesson complete    | `aria-live="assertive"` for completion announcement        |
| Next task button   | `aria-label="Continue to next task"`                       |
| Restart button     | `aria-label="Restart current lesson"`                      |
| Level cards        | `aria-label="Stage X: [name], Y lessons, [status]"`        |
| Keyboard visual    | `aria-hidden="true"` (decorative, not for screen readers)  |
| Language switcher  | `aria-label="Select language"`, `aria-expanded`            |
| Achievement popup  | `role="alert"`, `aria-live="assertive"`                    |

### SEO (Search Engine Optimization)

| Requirement     | Implementation                         |
| --------------- | -------------------------------------- |
| Meta tags       | Title, description, keywords per page  |
| Semantic HTML   | Proper heading hierarchy (h1-h6)       |
| Structured data | JSON-LD schema for educational content |
| Sitemap         | Auto-generated XML sitemap             |
| Robots.txt      | Proper crawl directives                |
| Canonical URLs  | Prevent duplicate content              |
| Open Graph      | Social sharing meta tags               |
| Performance     | Core Web Vitals (LCP, FID, CLS)        |
| Mobile-first    | Responsive design, mobile-friendly     |

### AEO (Answer Engine Optimization)

| Requirement                   | Implementation                             |
| ----------------------------- | ------------------------------------------ |
| FAQ schema                    | Structured FAQ data for voice assistants   |
| Conversational content        | Natural language in headings and content   |
| Featured snippet optimization | Clear, concise answers to common questions |
| Speakable schema              | Mark content suitable for text-to-speech   |
| Question-based headings       | "How to...", "What is..." format           |

### GEO (Generative Engine Optimization)

| Requirement             | Implementation                            |
| ----------------------- | ----------------------------------------- |
| Clear content structure | Well-organized, scannable content         |
| Authoritative content   | Accurate, expert-level typing instruction |
| Citation-friendly       | Easy to reference and quote               |
| Entity clarity          | Clear definitions of terms and concepts   |
| Comprehensive coverage  | Thorough answers to user intent           |
| Freshness signals       | Regular content updates                   |

---

## Project Structure

```
typing-learning/
├── messages/                   # Translation files
│   ├── en.json                 # English translations
│   └── he.json                 # Hebrew translations
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── [locale]/           # Locale-based routing (en/he)
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── layout.tsx      # Locale layout (RTL/LTR)
│   │   │   ├── practice/
│   │   │   │   └── page.tsx    # Main practice screen
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx    # User dashboard
│   │   │   └── levels/
│   │   │       └── page.tsx    # Level/world selection
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   │
│   ├── i18n/                   # i18n configuration
│   │   ├── request.ts          # Server-side i18n setup
│   │   └── routing.ts          # Locale routing config
│   │
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── Modal.tsx
│   │   ├── typing/             # Core typing components
│   │   │   ├── TypingArea.tsx  # Main typing input area
│   │   │   ├── TextDisplay.tsx # Shows text to type
│   │   │   ├── Cursor.tsx      # Blinking cursor
│   │   │   └── Stats.tsx       # Live WPM/accuracy
│   │   ├── keyboard/           # Visual keyboard
│   │   │   ├── Keyboard.tsx    # Full keyboard display
│   │   │   ├── Key.tsx         # Individual key
│   │   │   └── FingerGuide.tsx # Shows which finger to use
│   │   ├── games/              # Game mode components
│   │   │   ├── CalmMode.tsx
│   │   │   ├── RaceGame.tsx
│   │   │   └── TargetGame.tsx
│   │   └── layout/             # Layout components
│   │       ├── Header.tsx
│   │       ├── Navigation.tsx
│   │       └── Footer.tsx
│   │
│   ├── stores/                 # Zustand stores
│   │   ├── useTypingStore.ts   # Current typing session state
│   │   ├── useProgressStore.ts # User progress & stats
│   │   └── useSettingsStore.ts # User preferences
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useTypingEngine.ts  # Core typing logic
│   │   ├── useKeyboardInput.ts # Keyboard event handling
│   │   ├── useTimer.ts         # Timer for timed modes
│   │   └── useSound.ts         # Sound effects
│   │
│   ├── lib/                    # Utilities
│   │   ├── wpm.ts              # WPM calculation
│   │   ├── accuracy.ts         # Accuracy calculation
│   │   ├── storage.ts          # LocalStorage helpers
│   │   └── analytics.ts        # Track weak letters
│   │
│   ├── data/                   # Static content
│   │   ├── lessons/            # Lesson definitions
│   │   │   ├── stage1.ts       # Keyboard familiarity
│   │   │   ├── stage2.ts       # Home row
│   │   │   ├── stage3.ts       # Letter expansion
│   │   │   ├── stage4.ts       # Words
│   │   │   ├── stage5.ts       # Sentences
│   │   │   └── stage6.ts       # Fluency
│   │   ├── words.ts            # Word lists by difficulty
│   │   └── sentences.ts        # Sentence collections
│   │
│   └── types/                  # TypeScript types
│       ├── lesson.ts
│       ├── progress.ts
│       └── game.ts
│
├── public/
│   ├── sounds/                 # Sound effects
│   └── images/                 # Images & icons
│
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## Implementation Phases

> **IMPORTANT**: All phases must be built with WCAG 2.2, SEO, AEO, and GEO compliance in mind from the start.
> This means: semantic HTML, proper ARIA labels, keyboard navigation, color contrast, structured data, etc.
> Phase 13 is for final auditing and fixing gaps, not for retrofitting accessibility.

### Phase 1: Project Setup & Foundation

**Goal**: Working Next.js app with basic navigation
**Status**: [x] COMPLETED

| #   | Task                        | Status | Description                                                        |
| --- | --------------------------- | ------ | ------------------------------------------------------------------ |
| 1.1 | Initialize Next.js project  | [x]    | `npx create-next-app@latest` with TypeScript, Tailwind, App Router |
| 1.2 | Configure project structure | [x]    | Create folder structure as defined above                           |
| 1.3 | Setup Zustand               | [x]    | Install and create empty store files                               |
| 1.4 | Create base layout          | [x]    | Header, main area, basic navigation                                |
| 1.5 | Create placeholder pages    | [x]    | Landing, Practice, Dashboard, Levels (empty shells)                |
| 1.6 | Setup Framer Motion         | [x]    | Install and configure                                              |

**Deliverable**: Navigable app shell with all routes working

---

### Phase 1.5: Internationalization (i18n)

**Goal**: Support English (LTR) and Hebrew (RTL) languages
**Status**: [x] COMPLETED

| #     | Task                     | Status | Description                                            |
| ----- | ------------------------ | ------ | ------------------------------------------------------ |
| 1.5.1 | Install next-intl        | [x]    | Add i18n library for Next.js App Router                |
| 1.5.2 | Configure i18n routing   | [x]    | Setup `/en` and `/he` locale prefixes                  |
| 1.5.3 | Create translation files | [x]    | `messages/en.json` and `messages/he.json`              |
| 1.5.4 | Setup RTL support        | [x]    | Dynamic `dir="rtl"` for Hebrew, Tailwind RTL utilities |
| 1.5.5 | Create language switcher | [x]    | UI component to toggle between EN/HE                   |
| 1.5.6 | Translate existing UI    | [x]    | Landing, Dashboard, Levels pages                       |
| 1.5.7 | Update layout for RTL    | [x]    | Ensure header, navigation work in both directions      |

**Notes**:

- Typing practice content stays in English (for now)
- UI text (buttons, labels, instructions) in both languages
- Future: Add more keyboard layouts (Hebrew, etc.)

**Deliverable**: Fully bilingual website with proper RTL support

---

### Phase 1.6: Typography, Metadata & SEO/AEO/GEO Foundation

**Goal**: Establish font system, metadata, and full search engine optimization (SEO, AEO, GEO)
**Status**: [ ] Not Started

| #      | Task                               | Status | Description                                                 |
| ------ | ---------------------------------- | ------ | ----------------------------------------------------------- |
| 1.6.1  | Install Google Fonts               | [ ]    | Add Baloo 2 (fun layer) and Nunito (UI layer) via next/font |
| 1.6.2  | Configure font CSS variables       | [ ]    | Setup `--font-display` (Baloo 2) and `--font-body` (Nunito) |
| 1.6.3  | Create typography utility classes  | [ ]    | `.font-display`, `.font-body` with appropriate weights      |
| 1.6.4  | Apply fonts to existing components | [ ]    | Logo/titles use Baloo 2, body/buttons use Nunito            |
| 1.6.5  | Setup metadata configuration       | [ ]    | Title templates, Open Graph, Twitter cards per page         |
| 1.6.6  | Add structured data (JSON-LD)      | [ ]    | Organization, WebSite, and educational content schemas      |
| 1.6.7  | Create robots.txt                  | [ ]    | Allow crawling, point to sitemap                            |
| 1.6.8  | Generate sitemap.xml               | [ ]    | Dynamic sitemap with all locale routes                      |
| 1.6.9  | Add favicon set                    | [ ]    | Multiple sizes, apple-touch-icon, manifest.json             |
| 1.6.10 | Setup canonical URLs               | [ ]    | Prevent duplicate content across locales                    |
| 1.6.11 | Add FAQ schema (AEO)               | [ ]    | Structured FAQ data for voice assistants and AI             |
| 1.6.12 | Add speakable schema (AEO)         | [ ]    | Mark content suitable for text-to-speech                    |
| 1.6.13 | Question-based headings (AEO)      | [ ]    | Use "How to...", "What is..." format for key content        |
| 1.6.14 | Content structure for GEO          | [ ]    | Clear, scannable, citation-friendly content layout          |
| 1.6.15 | Entity definitions (GEO)           | [ ]    | Clear definitions of typing terms and concepts              |

**Font Roles (Clear Separation)**:

| Font        | Role              | Usage                                                                | Weights                                     |
| ----------- | ----------------- | -------------------------------------------------------------------- | ------------------------------------------- |
| **Baloo 2** | Fun + Game Layer  | Logo, level titles, game modes, achievements, scores, streaks        | SemiBold (600), Bold (700)                  |
| **Nunito**  | Core UI + Reading | Body text, instructions, buttons, menus, stats, settings, dashboards | Regular (400), Medium (500), SemiBold (600) |

**Typography Guidelines**:

- Keep Baloo 2 usage under 20-25% of visible text
- Both fonts are rounded, creating visual harmony
- Baloo 2 adds character without becoming childish
- Nunito keeps the app calm and usable for adults
- Works well across desktop, tablet, and mobile
- Scales nicely for Hebrew and other languages

**Example Hierarchy**:

- App Name / Level Title: Baloo 2 Bold
- Section Headings: Nunito SemiBold
- Body Text: Nunito Regular
- Buttons: Nunito SemiBold
- Achievement Text: Baloo 2 SemiBold

**SEO Files to Create**:

- `public/robots.txt` - Crawl directives
- `app/sitemap.ts` - Dynamic sitemap generation
- `app/manifest.ts` - PWA manifest
- `public/favicon.ico`, `public/icon.png`, `public/apple-icon.png`

**AEO/GEO Content Strategy**:

- FAQ section on landing page with schema markup
- Question-based headings ("How do I learn to type?", "What is touch typing?")
- Clear, concise answers optimized for featured snippets
- Speakable content for voice assistants
- Entity-rich content (define: WPM, accuracy, home row, touch typing)
- Authoritative, expert-level typing instruction

**Deliverable**: Professional typography system with full SEO/AEO/GEO foundation for discoverability

---

### Phase 2: Core Typing Engine

**Goal**: Character-by-character typing with real-time feedback
**Status**: [ ] Not Started

| #    | Task                           | Status | Description                                                               |
| ---- | ------------------------------ | ------ | ------------------------------------------------------------------------- |
| 2.1  | Create `useKeyboardInput` hook | [ ]    | Capture keystrokes, handle special keys (backspace, etc.)                 |
| 2.2  | Create `useTypingEngine` hook  | [ ]    | Core logic: compare input to target, track position, errors               |
| 2.3  | Build `TextDisplay` component  | [ ]    | Show target text with character-level styling (correct/incorrect/current) |
| 2.4  | Build `TypingArea` component   | [ ]    | Invisible input that captures keystrokes                                  |
| 2.5  | Build `Cursor` component       | [ ]    | Blinking cursor at current position (respect `prefers-reduced-motion`)    |
| 2.6  | Create `useTypingStore`        | [ ]    | Store current session state (input, errors, position)                     |
| 2.7  | Implement WPM calculation      | [ ]    | Real-time words-per-minute tracking                                       |
| 2.8  | Implement accuracy calculation | [ ]    | Percentage of correct keystrokes                                          |
| 2.9  | Build `Stats` component        | [ ]    | Display live WPM and accuracy                                             |
| 2.10 | Add ARIA live regions          | [ ]    | Announce errors, stats updates to screen readers                          |
| 2.11 | Add keyboard shortcuts         | [ ]    | `Enter` to start, `Escape` to pause                                       |
| 2.12 | Integration test               | [ ]    | Combine all into working typing experience                                |

**Accessibility requirements for this phase**:

- Typing area must have `role="textbox"` and proper `aria-label`
- Stats must use `aria-live="polite"` for updates
- Error feedback must be announced (not just visual)
- Cursor animation must respect `prefers-reduced-motion`

**Deliverable**: Can type a given text with real-time visual feedback and stats

---

### Phase 3: Visual Keyboard

**Goal**: On-screen keyboard showing finger placement and key highlights
**Status**: [ ] Not Started

| #   | Task                          | Status | Description                                                          |
| --- | ----------------------------- | ------ | -------------------------------------------------------------------- |
| 3.1 | Design keyboard layout data   | [ ]    | Define key positions, sizes, finger assignments                      |
| 3.2 | Build `Key` component         | [ ]    | Single key with states (default, highlight, pressed, correct, wrong) |
| 3.3 | Build `Keyboard` component    | [ ]    | Full QWERTY layout using Key components                              |
| 3.4 | Add finger color coding       | [ ]    | Color keys by which finger should press them                         |
| 3.5 | Build `FingerGuide` component | [ ]    | Visual hand showing which finger to use                              |
| 3.6 | Connect to typing engine      | [ ]    | Highlight next key, show pressed keys                                |
| 3.7 | Add key press animations      | [ ]    | Subtle press animation on keystroke                                  |

**Deliverable**: Interactive keyboard that shows what to press and responds to input

---

### Phase 4: Lesson Content & Structure

**Goal**: Define all lesson content and progression logic
**Status**: [ ] Not Started

| #   | Task                           | Status | Description                                                  |
| --- | ------------------------------ | ------ | ------------------------------------------------------------ |
| 4.1 | Define TypeScript types        | [ ]    | Lesson, Stage, Exercise, Progress types                      |
| 4.2 | Create Stage 1 content         | [ ]    | Keyboard familiarity exercises (no typing, just exploration) |
| 4.3 | Create Stage 2 content         | [ ]    | Home row exercises (ASDF JKL;)                               |
| 4.4 | Create Stage 3 content         | [ ]    | Letter expansion (2-3 letters per sub-stage)                 |
| 4.5 | Create Stage 4 content         | [ ]    | Short word lists (3-5 letter words)                          |
| 4.6 | Create Stage 5 content         | [ ]    | Sentence collections (easy, funny, neutral)                  |
| 4.7 | Create Stage 6 content         | [ ]    | Fluency challenges (longer texts, emails, etc.)              |
| 4.8 | Build lesson progression logic | [ ]    | Track completion, unlock next lessons                        |
| 4.9 | Build `useProgressStore`       | [ ]    | Store user progress through lessons                          |

**Deliverable**: Complete lesson content library with progression system

---

### Phase 5: Practice Flow

**Goal**: Complete practice experience from start to summary
**Status**: [ ] Not Started

| #    | Task                          | Status | Description                                  |
| ---- | ----------------------------- | ------ | -------------------------------------------- |
| 5.1  | Build Levels/Worlds page      | [ ]    | Visual level map showing stages and progress |
| 5.2  | Build lesson selection UI     | [ ]    | Choose specific lesson within a stage        |
| 5.3  | Build practice intro screen   | [ ]    | Show lesson goal, finger placement tips      |
| 5.4  | Build practice screen         | [ ]    | Main typing area + keyboard + stats          |
| 5.5  | Build practice summary screen | [ ]    | Show results: accuracy, WPM, time, errors    |
| 5.6  | Add "Next Lesson" flow        | [ ]    | Transition to next lesson or back to map     |
| 5.7  | Handle lesson completion      | [ ]    | Save progress, calculate scores              |
| 5.8  | Add restart functionality     | [ ]    | Retry current lesson                         |
| 5.9  | Add keyboard navigation       | [ ]    | Arrow keys for levels, Enter/R for actions   |
| 5.10 | Add focus management          | [ ]    | Auto-focus on key elements after transitions |

**Accessibility requirements for this phase**:

- Level cards: `aria-label` with full context (stage name, status, lesson count)
- Level navigation: Arrow keys to move between levels
- Summary screen: `aria-live="assertive"` to announce completion
- Next/Restart buttons: Clear `aria-label`, keyboard shortcuts (`Enter`/`R`)
- Focus management: Auto-focus "Next Lesson" button on completion
- Progress bar: `role="progressbar"` with `aria-valuenow`/`aria-valuemax`

**Deliverable**: End-to-end practice flow from level selection to completion

---

### Phase 6: Progress Persistence

**Goal**: Save and load user progress
**Status**: [ ] Not Started

| #   | Task                       | Status | Description                                         |
| --- | -------------------------- | ------ | --------------------------------------------------- |
| 6.1 | Create storage utilities   | [ ]    | LocalStorage read/write helpers with error handling |
| 6.2 | Implement progress saving  | [ ]    | Auto-save after each lesson                         |
| 6.3 | Implement progress loading | [ ]    | Load on app start                                   |
| 6.4 | Build weak letter tracking | [ ]    | Identify and store letters with low accuracy        |
| 6.5 | Store session history      | [ ]    | Keep record of past practice sessions               |
| 6.6 | Add data migration support | [ ]    | Handle storage schema changes                       |

**Deliverable**: Progress persists across browser sessions

---

### Phase 7: Dashboard

**Goal**: Personal dashboard showing stats and progress
**Status**: [ ] Not Started

| #   | Task                         | Status | Description                                       |
| --- | ---------------------------- | ------ | ------------------------------------------------- |
| 7.1 | Build dashboard layout       | [ ]    | Grid layout for stats cards                       |
| 7.2 | Create current level display | [ ]    | Show stage and lesson progress                    |
| 7.3 | Create accuracy display      | [ ]    | Average accuracy with trend                       |
| 7.4 | Create WPM display           | [ ]    | Average speed with trend                          |
| 7.5 | Create streak display        | [ ]    | Current and best practice streak                  |
| 7.6 | Build progress chart         | [ ]    | Visual progress over time (simple line/bar chart) |
| 7.7 | Build weak letters section   | [ ]    | Show letters that need practice                   |
| 7.8 | Add "Continue Practice" CTA  | [ ]    | Quick access to next lesson                       |

**Deliverable**: Dashboard showing comprehensive user statistics

---

### Phase 8: First Game Mode - Calm Mode

**Goal**: Relaxed practice mode with no pressure
**Status**: [ ] Not Started

| #   | Task                     | Status | Description                                |
| --- | ------------------------ | ------ | ------------------------------------------ |
| 8.1 | Design Calm Mode UI      | [ ]    | Clean, minimal, soothing design            |
| 8.2 | Build CalmMode component | [ ]    | No timer, no scoring pressure              |
| 8.3 | Add ambient background   | [ ]    | Subtle gradient or pattern                 |
| 8.4 | Implement endless mode   | [ ]    | Continuous text generation                 |
| 8.5 | Add pause/resume         | [ ]    | Allow breaks without losing progress       |
| 8.6 | Create gentle feedback   | [ ]    | Soft visual cues for errors (no harsh red) |

**Deliverable**: Stress-free typing practice mode

---

### Phase 9: Gamification System

**Goal**: Points, achievements, ranks, and streaks
**Status**: [ ] Not Started

| #    | Task                           | Status | Description                                              |
| ---- | ------------------------------ | ------ | -------------------------------------------------------- |
| 9.1  | Design point system            | [ ]    | Points for accuracy, speed bonuses, streak bonuses       |
| 9.2  | Implement point calculation    | [ ]    | Calculate and award points after lessons                 |
| 9.3  | Create rank system             | [ ]    | Beginner → Intermediate → Proficient → Master            |
| 9.4  | Build rank display component   | [ ]    | Show current rank with progress to next                  |
| 9.5  | Design achievements            | [ ]    | Define 10-15 achievements (100 keystrokes perfect, etc.) |
| 9.6  | Implement achievement tracking | [ ]    | Check conditions, unlock achievements                    |
| 9.7  | Build achievement popup        | [ ]    | Celebrate when achievement unlocked (accessible)         |
| 9.8  | Build achievements page        | [ ]    | Display all achievements (locked/unlocked)               |
| 9.9  | Implement streak system        | [ ]    | Track daily practice streaks                             |
| 9.10 | Build streak recovery          | [ ]    | Missing a day reduces but doesn't reset                  |

**Accessibility requirements for this phase**:

- Achievement popup: `role="alert"`, `aria-live="assertive"` to announce unlocks
- Rank progress: `role="progressbar"` with current/max values
- Achievement cards: `aria-label` with name, description, locked/unlocked status
- Animations: Respect `prefers-reduced-motion` for celebration effects
- Keyboard dismiss: `Escape` to close achievement popup

**Deliverable**: Full gamification system with meaningful progression

---

### Phase 10: Landing Page

**Goal**: Compelling landing page that converts visitors
**Status**: [ ] Not Started

| #    | Task                     | Status | Description                                |
| ---- | ------------------------ | ------ | ------------------------------------------ |
| 10.1 | Design hero section      | [ ]    | Clear headline, "Start Now" CTA            |
| 10.2 | Build feature highlights | [ ]    | Key benefits (3-4 cards)                   |
| 10.3 | Add social proof section | [ ]    | Testimonials or stats (can be placeholder) |
| 10.4 | Build profile selection  | [ ]    | Child / Teen / Adult selection             |
| 10.5 | Create onboarding flow   | [ ]    | First-time user experience                 |
| 10.6 | Add keyboard test        | [ ]    | Quick typing test to assess level          |
| 10.7 | Mobile responsive design | [ ]    | Ensure landing works on all devices        |

**Deliverable**: Professional landing page with smooth onboarding

---

### Phase 11: Adaptive Learning

**Goal**: Personalized practice based on performance
**Status**: [ ] Not Started

| #    | Task                             | Status | Description                               |
| ---- | -------------------------------- | ------ | ----------------------------------------- |
| 11.1 | Build analytics engine           | [ ]    | Track accuracy per letter over time       |
| 11.2 | Identify weak letters            | [ ]    | Algorithm to detect struggling letters    |
| 11.3 | Generate targeted practice       | [ ]    | Create exercises focusing on weak letters |
| 11.4 | Adjust difficulty                | [ ]    | Pace based on performance (slower/faster) |
| 11.5 | Build "Problem Letters" practice | [ ]    | Dedicated mode for weak letters           |
| 11.6 | Add learning insights            | [ ]    | Show user their improvement areas         |

**Deliverable**: System that adapts to user's weaknesses

---

### Phase 12: Additional Game Modes

**Goal**: More engaging ways to practice
**Status**: [ ] Not Started

| #    | Task                           | Status | Description                                          |
| ---- | ------------------------------ | ------ | ---------------------------------------------------- |
| 12.1 | Build Race Game                | [ ]    | Character moves forward with typing, slows on errors |
| 12.2 | Build Target Shooting          | [ ]    | Type letters to hit targets, combos for streaks      |
| 12.3 | Build Tower Builder            | [ ]    | Correct words add blocks, errors remove them         |
| 12.4 | Build Daily Challenge          | [ ]    | Unique daily exercise with bonus rewards             |
| 12.5 | Create game selection UI       | [ ]    | Choose between game modes                            |
| 12.6 | Add game-specific achievements | [ ]    | Achievements tied to each game mode                  |

**Deliverable**: Multiple engaging practice modes

---

### Phase 13: Polish, Accessibility & Compliance

**Goal**: Production-ready quality with full WCAG 2.2 / SEO / AEO / GEO compliance
**Status**: [ ] Not Started

| #     | Task                          | Status | Description                                          |
| ----- | ----------------------------- | ------ | ---------------------------------------------------- |
| 13.1  | Add sound effects             | [ ]    | Key press sounds, success/error sounds (toggleable)  |
| 13.2  | Improve animations            | [ ]    | Polish transitions, respect `prefers-reduced-motion` |
| 13.3  | Add keyboard shortcuts        | [ ]    | Navigation shortcuts for power users                 |
| 13.4  | Implement dark mode           | [ ]    | Toggle between light/dark themes                     |
| 13.5  | WCAG 2.2 audit                | [ ]    | Run axe-core, fix all Level AA violations            |
| 13.6  | Screen reader testing         | [ ]    | Test with NVDA/VoiceOver, add ARIA live regions      |
| 13.7  | Skip links & focus management | [ ]    | Skip to content, focus trapping in modals            |
| 13.8  | Color contrast audit          | [ ]    | Verify 4.5:1 ratio for all text                      |
| 13.9  | Mobile optimization           | [ ]    | Ensure all pages work on tablet                      |
| 13.10 | Performance audit             | [ ]    | Core Web Vitals, <16ms keystroke response            |
| 13.11 | SEO audit                     | [ ]    | Meta tags, structured data, sitemap, robots.txt      |
| 13.12 | AEO optimization              | [ ]    | FAQ schema, speakable content, question headings     |
| 13.13 | GEO optimization              | [ ]    | Clear structure, authoritative content               |
| 13.14 | Error boundaries              | [ ]    | Graceful error handling throughout                   |

**Tools to use**:

- `axe-core` / `@axe-core/react` - Accessibility testing
- Lighthouse - Performance, SEO, Accessibility audits
- Schema.org validator - Structured data testing
- WAVE - Additional accessibility checks

**Deliverable**: Polished, fully compliant application

---

### Phase 14: Settings & Preferences

**Goal**: User customization options
**Status**: [ ] Not Started

| #    | Task                  | Status | Description                           |
| ---- | --------------------- | ------ | ------------------------------------- |
| 14.1 | Build settings page   | [ ]    | Organized settings UI                 |
| 14.2 | Add profile settings  | [ ]    | Name, age group, avatar               |
| 14.3 | Add practice settings | [ ]    | Default session length, difficulty    |
| 14.4 | Add display settings  | [ ]    | Theme, font size, keyboard visibility |
| 14.5 | Add sound settings    | [ ]    | Toggle sounds, volume control         |
| 14.6 | Add data settings     | [ ]    | Export progress, reset progress       |
| 14.7 | Persist settings      | [ ]    | Save to localStorage                  |

**Deliverable**: Comprehensive settings system

---

## Milestone Summary

| Milestone        | Phases | Description                                                  |
| ---------------- | ------ | ------------------------------------------------------------ |
| **MVP**          | 1-8    | Functional typing tutor with progress tracking and Calm Mode |
| **Full Product** | 1-14   | Complete gamified learning platform                          |

---

## Future Phases (Post-MVP)

These are documented for future reference but not part of initial implementation:

- **Phase 15**: User accounts & cloud sync (Supabase/Firebase)
- **Phase 16**: Hebrew keyboard layout for typing practice
- **Phase 17**: Additional keyboard layouts (AZERTY, Dvorak, etc.)
- **Phase 18**: Additional UI languages (Arabic, Russian, etc.)
- **Phase 19**: Multiplayer challenges
- **Phase 20**: Parent/teacher dashboard
- **Phase 21**: Mobile app (React Native)

**Note on i18n**:

- UI language (EN/HE) is implemented in Phase 1.5
- Typing practice keyboard layouts are separate and will be added later
- Hebrew typing practice requires Hebrew keyboard layout (Phase 16)

---

## Key Files to Create First

1. `src/hooks/useTypingEngine.ts` - Core typing logic
2. `src/hooks/useKeyboardInput.ts` - Keyboard event handling
3. `src/components/typing/TextDisplay.tsx` - Visual text feedback
4. `src/stores/useTypingStore.ts` - Session state
5. `src/stores/useProgressStore.ts` - User progress
6. `src/data/lessons/stage2.ts` - Home row content (first real lessons)
