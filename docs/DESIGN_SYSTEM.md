# KeyQuest Design System

## Design Philosophy

### The Core Challenge
KeyQuest must appeal to **ages 8 to 80** - fun enough for children, sophisticated enough for adults. The design walks a careful line: **playful without being childish, professional without being boring**.

### Aesthetic Direction: "Friendly Precision"
A warm, approachable interface with crisp edges and confident colors. Think of it as a **modern educational game** - not a cartoon, not a corporate app. The visual language says: "Learning is enjoyable, and you're making real progress."

**Design Pillars:**
1. **Clarity** - Every element has purpose; nothing decorative without function
2. **Encouragement** - Visuals celebrate progress, never punish mistakes
3. **Focus** - During typing practice, the UI fades away; the text is king
4. **Delight** - Micro-moments of joy (achievements, level-ups, streaks)

---

## Color System

### Primary Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-bg` | `#FAFAFA` | `#0C0C0F` | Page background |
| `--color-surface` | `#FFFFFF` | `#18181B` | Cards, modals |
| `--color-surface-raised` | `#F4F4F5` | `#27272A` | Elevated elements |
| `--color-text` | `#18181B` | `#FAFAFA` | Primary text |
| `--color-text-muted` | `#71717A` | `#A1A1AA` | Secondary text |
| `--color-border` | `#E4E4E7` | `#3F3F46` | Borders, dividers |

### Accent Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#6366F1` (Indigo) | CTAs, active states, links |
| `--color-primary-hover` | `#4F46E5` | Hover states |
| `--color-primary-soft` | `#EEF2FF` / `#1E1B4B` | Backgrounds for primary elements |

### Semantic Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-success` | `#10B981` | `#34D399` | Correct keystrokes, completion |
| `--color-success-soft` | `#D1FAE5` | `#064E3B` | Success backgrounds |
| `--color-error` | `#F43F5E` | `#FB7185` | Mistakes (gentle rose, not harsh red) |
| `--color-error-soft` | `#FFE4E6` | `#4C0519` | Error backgrounds |
| `--color-warning` | `#F59E0B` | `#FBBF24` | Cautions, streaks at risk |
| `--color-info` | `#3B82F6` | `#60A5FA` | Tips, hints |

### Gamification Colors (The "Fun Layer")

| Token | Value | Usage |
|-------|-------|-------|
| `--color-xp` | `#8B5CF6` (Purple) | Experience points, level progress |
| `--color-streak` | `#F97316` (Orange) | Streak fire, daily goals |
| `--color-achievement` | `#EAB308` (Gold) | Achievements, badges |
| `--color-rank-beginner` | `#94A3B8` | Beginner rank |
| `--color-rank-intermediate` | `#22D3EE` | Intermediate rank |
| `--color-rank-proficient` | `#A78BFA` | Proficient rank |
| `--color-rank-master` | `#FBBF24` | Master rank |

### Finger Color Coding (Visual Keyboard)

| Finger | Color | Keys |
|--------|-------|------|
| Left Pinky | `#F472B6` (Pink) | Q, A, Z, 1, Shift, Tab, Caps |
| Left Ring | `#C084FC` (Purple) | W, S, X, 2 |
| Left Middle | `#60A5FA` (Blue) | E, D, C, 3 |
| Left Index | `#34D399` (Green) | R, T, F, G, V, B, 4, 5 |
| Right Index | `#FBBF24` (Yellow) | Y, U, H, J, N, M, 6, 7 |
| Right Middle | `#FB923C` (Orange) | I, K, comma, 8 |
| Right Ring | `#F87171` (Red) | O, L, period, 9 |
| Right Pinky | `#A78BFA` (Violet) | P, semicolon, slash, 0, brackets |
| Thumbs | `#94A3B8` (Gray) | Space |

---

## Typography

### Font Stack (Already Established)

| Role | English | Hebrew | Usage |
|------|---------|--------|-------|
| Display | Baloo 2 | Varela Round | Logo, titles, achievements, game scores |
| Body | Nunito | Heebo | UI text, instructions, buttons |
| Mono | JetBrains Mono | JetBrains Mono | Typing practice text |

### Type Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `--text-display-xl` | 48px / 3rem | 1.1 | 700 | Hero headlines |
| `--text-display-lg` | 36px / 2.25rem | 1.2 | 700 | Page titles |
| `--text-display-md` | 28px / 1.75rem | 1.25 | 600 | Section headers, level titles |
| `--text-display-sm` | 22px / 1.375rem | 1.3 | 600 | Card titles, game scores |
| `--text-body-lg` | 18px / 1.125rem | 1.6 | 400 | Lead paragraphs |
| `--text-body-md` | 16px / 1rem | 1.5 | 400 | Body text, instructions |
| `--text-body-sm` | 14px / 0.875rem | 1.5 | 400 | Secondary text, labels |
| `--text-caption` | 12px / 0.75rem | 1.4 | 500 | Captions, badges |
| `--text-typing` | 24px / 1.5rem | 2 | 400 | Typing practice (monospace) |

### Typography Rules
- Display fonts (Baloo 2/Varela Round): **Maximum 25%** of visible text
- Never mix display + body fonts in same sentence
- Typing text always uses monospace with generous letter-spacing (`0.05em`)
- RTL: Maintain same visual hierarchy, fonts swap automatically

---

## Spacing System

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight gaps, icon padding |
| `--space-2` | 8px | Inline spacing, small gaps |
| `--space-3` | 12px | Component internal padding |
| `--space-4` | 16px | Standard padding, gaps |
| `--space-5` | 20px | Card padding |
| `--space-6` | 24px | Section gaps |
| `--space-8` | 32px | Large section gaps |
| `--space-10` | 40px | Page sections |
| `--space-12` | 48px | Major layout gaps |
| `--space-16` | 64px | Hero sections |
| `--space-20` | 80px | Page margins (desktop) |

### Container Widths

| Token | Value | Usage |
|-------|-------|-------|
| `--container-sm` | 640px | Narrow content (typing area) |
| `--container-md` | 768px | Standard content |
| `--container-lg` | 1024px | Wide content |
| `--container-xl` | 1280px | Full-width layouts |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Small elements, badges |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards, modals |
| `--radius-xl` | 16px | Large cards, sections |
| `--radius-2xl` | 24px | Hero sections, feature cards |
| `--radius-full` | 9999px | Pills, avatars, circular elements |

**Design Note:** Rounded corners reinforce the friendly, approachable feel. Avoid sharp corners except for very small UI elements.

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)` | Cards, dropdowns |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | Modals, popovers |
| `--shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1)` | Hero elements |
| `--shadow-glow-primary` | `0 0 20px rgba(99,102,241,0.3)` | Active/focus glow |
| `--shadow-glow-success` | `0 0 20px rgba(16,185,129,0.3)` | Success states |

**Dark Mode:** Shadows become more subtle; use elevated surface colors instead.

---

## Component Specifications

### Buttons

#### Primary Button
```
Background: var(--color-primary)
Text: white
Padding: 12px 24px
Border-radius: var(--radius-md)
Font: Nunito SemiBold, 16px
Transition: all 150ms ease
Hover: background darkens, subtle lift (translateY -1px)
Active: scale(0.98)
Focus: 2px ring offset
```

#### Secondary Button
```
Background: transparent
Border: 2px solid var(--color-border)
Text: var(--color-text)
Hover: background var(--color-surface-raised)
```

#### Ghost Button
```
Background: transparent
Text: var(--color-text-muted)
Hover: text var(--color-text), background var(--color-surface-raised)
```

#### Game Button (CTAs in game contexts)
```
Background: gradient from var(--color-primary) to purple
Text: white
Font: Baloo 2 SemiBold
Border-radius: var(--radius-lg)
Shadow: var(--shadow-md), plus subtle glow
Hover: glow intensifies, scale(1.02)
```

### Cards

#### Standard Card
```
Background: var(--color-surface)
Border: 1px solid var(--color-border)
Border-radius: var(--radius-lg)
Padding: var(--space-5)
Shadow: var(--shadow-sm)
```

#### Level Card (Levels Screen)
```
Background: var(--color-surface)
Border-radius: var(--radius-xl)
Padding: var(--space-6)
States:
  - Locked: opacity 0.5, grayscale filter, lock icon overlay
  - Available: normal, subtle pulse animation on border
  - Current: primary border, glow effect
  - Completed: success checkmark badge, star rating
```

#### Stat Card (Dashboard)
```
Background: var(--color-surface)
Border-radius: var(--radius-lg)
Layout: icon left, value + label right
Icon: 40x40, colored background circle
Value: Display font, large
Label: Body font, muted
Trend indicator: small arrow + percentage
```

### Progress Indicators

#### Linear Progress Bar
```
Height: 8px (standard), 12px (prominent)
Background: var(--color-surface-raised)
Fill: gradient or solid color based on context
Border-radius: var(--radius-full)
Animation: smooth width transition, optional shimmer
```

#### Circular Progress (XP Ring)
```
Size: 120px (large), 80px (medium), 48px (small)
Stroke width: 8px
Background stroke: var(--color-surface-raised)
Progress stroke: var(--color-xp) gradient
Center: level number or icon
Animation: smooth stroke-dashoffset transition
```

#### Streak Counter
```
Display: flame icon + number
Color: var(--color-streak)
Animation: flame flicker on active streak
States:
  - Active: vibrant orange, animated flame
  - At risk: pulsing warning
  - Broken: gray, sad flame
```

### Form Elements

#### Text Input
```
Height: 44px
Padding: 0 16px
Border: 2px solid var(--color-border)
Border-radius: var(--radius-md)
Background: var(--color-surface)
Focus: border-color var(--color-primary), glow
Error: border-color var(--color-error)
```

#### Toggle Switch
```
Width: 48px
Height: 28px
Border-radius: var(--radius-full)
Off: var(--color-surface-raised)
On: var(--color-primary)
Knob: white circle, shadow
Transition: 200ms ease
```

---

## Visual Keyboard Design

### Overall Layout
```
Container: max-width 800px, centered
Background: var(--color-surface)
Border-radius: var(--radius-xl)
Padding: var(--space-4)
Shadow: var(--shadow-lg)
```

### Individual Key
```
Size: 48px x 48px (standard), scaled for special keys
Background: var(--color-surface-raised)
Border: 1px solid var(--color-border)
Border-radius: var(--radius-md)
Font: Nunito Medium, 14px
Text: var(--color-text)

States:
  - Default: as above
  - Highlighted (next key): finger color background, white text, glow
  - Pressed: scale(0.95), darker background
  - Correct: flash green, return to default
  - Wrong: flash red (gentle), shake animation
  - Home row indicator: small dot below key
```

### Finger Guide
```
Position: below keyboard (optional, toggleable)
Display: simplified hand silhouette
Active finger: highlighted in finger color
Animation: subtle pulse on active finger
```

---

## Game UI Elements

### Score Display
```
Font: Baloo 2 Bold
Size: 48px (in-game), 64px (summary)
Color: var(--color-text) or contextual
Animation: count-up on changes, scale pop on milestones
```

### WPM Gauge
```
Type: semi-circular gauge or large number
Range: 0-150+ WPM
Color zones:
  - 0-20: learning (blue)
  - 20-40: improving (green)
  - 40-60: good (purple)
  - 60+: excellent (gold)
Animation: smooth needle/number transitions
```

### Accuracy Meter
```
Type: circular percentage or bar
Goal indicator: 95% line marked
Color: gradient from red (low) to green (high)
```

### Achievement Badge
```
Shape: circular or shield
Size: 64px (list), 96px (popup)
States:
  - Locked: grayscale, silhouette only
  - Unlocked: full color, subtle shine animation
  - New: golden glow, particle burst on unlock
```

### Combo Counter
```
Position: top-right of typing area
Display: "x5" with multiplier
Animation: grows and pulses on increment
Color: intensifies with combo length
Particles: optional celebratory particles at milestones
```

---

## Animation Principles

### Timing
- **Micro-interactions:** 100-200ms (button clicks, toggles)
- **State changes:** 200-300ms (card transitions, reveals)
- **Page transitions:** 300-400ms (route changes)
- **Celebrations:** 500-800ms (achievements, level-ups)

### Easing
- **Default:** `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out)
- **Enter:** `cubic-bezier(0, 0, 0.2, 1)` (decelerate)
- **Exit:** `cubic-bezier(0.4, 0, 1, 1)` (accelerate)
- **Bounce:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (playful)

### Key Animations

#### Keystroke Feedback
```
Correct:
  - Character turns green
  - Subtle scale(1.05) then back
  - Duration: 150ms

Wrong:
  - Character turns rose
  - Gentle horizontal shake (3px)
  - Duration: 200ms
  - Note: NOT harsh - encouraging, not punishing
```

#### Level Complete
```
Sequence:
1. Typing area fades (200ms)
2. Stars fly in from edges (400ms, staggered)
3. Score counts up (800ms)
4. "Next" button scales in (300ms)
```

#### Achievement Unlock
```
Sequence:
1. Badge scales from 0 to 1.2 to 1 (400ms, bounce)
2. Golden particles burst outward (600ms)
3. Shine sweep across badge (400ms)
4. Text fades in below (200ms)
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```
- Replace animations with opacity fades
- Keep state changes visible but instant
- Disable particle effects entirely

---

## Responsive Breakpoints

| Token | Value | Target |
|-------|-------|--------|
| `--bp-sm` | 640px | Large phones |
| `--bp-md` | 768px | Tablets |
| `--bp-lg` | 1024px | Small laptops |
| `--bp-xl` | 1280px | Desktops |
| `--bp-2xl` | 1536px | Large screens |

### Layout Adaptations

#### Mobile (< 640px)
- Single column layout
- Full-width cards
- Visual keyboard hidden by default (physical keyboard expected)
- Hamburger menu for navigation
- Touch-friendly tap targets (min 44px)

#### Tablet (640px - 1024px)
- Two-column layouts where appropriate
- Visual keyboard optional (toggle)
- Side navigation or top tabs

#### Desktop (> 1024px)
- Multi-column dashboard
- Visual keyboard always visible in practice
- Hover states enabled
- Keyboard shortcuts prominent

---

## Dark Mode Specifications

### Principles
- Not just inverted colors - thoughtfully designed
- Reduce eye strain, especially for practice sessions
- Maintain contrast ratios (WCAG AA)
- Gamification colors remain vibrant

### Key Differences
| Element | Light | Dark |
|---------|-------|------|
| Background | Pure white tints | Deep zinc/slate |
| Shadows | Black with opacity | Almost none; use borders |
| Borders | Light gray | Slightly lighter than surface |
| Success green | `#10B981` | `#34D399` (brighter) |
| Error rose | `#F43F5E` | `#FB7185` (softer) |
| Primary | `#6366F1` | `#818CF8` (lighter) |

### Implementation
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0C0C0F;
    --color-surface: #18181B;
    /* ... etc */
  }
}

/* Or with class toggle */
.dark {
  --color-bg: #0C0C0F;
  /* ... */
}
```

---

## Accessibility Requirements

### Color Contrast
- Normal text: minimum 4.5:1
- Large text (18px+): minimum 3:1
- UI components: minimum 3:1
- **Test all color combinations** in both light and dark modes

### Focus States
- Visible focus ring on all interactive elements
- 2px solid primary color, 2px offset
- Never remove focus outlines

### Touch Targets
- Minimum 44x44px for all interactive elements
- Adequate spacing between targets

### Screen Reader Support
- Semantic HTML throughout
- ARIA labels on icons, non-text buttons
- Live regions for dynamic content (scores, errors)
- Skip links for main content

### Keyboard Navigation
- Logical tab order
- Focus trapping in modals
- Escape to close overlays
- Visible keyboard shortcuts

---

## Page-Specific Guidelines

### Landing Page
- Hero: Large display text, clear CTA, subtle animated keyboard illustration
- Features: 3-4 cards with icons, concise copy
- Social proof: Testimonials or stats
- FAQ: Accordion with schema markup
- Footer: Links, language switcher

### Dashboard
- Layout: Bento grid of stat cards
- Hero stat: Current level/stage prominently displayed
- Quick action: "Continue Practice" button always visible
- Progress visualization: XP ring, progress bars
- Weak letters: Visual indicator of areas to improve

### Levels/Worlds Screen
- Layout: Horizontal scrollable stages or vertical list
- Visual metaphor: Journey/path connecting levels
- Current position: Clearly marked
- Locked vs unlocked: Distinct visual states
- Stage groupings: Clear visual separation

### Practice Screen
- Focus mode: Minimal UI, maximum typing area
- Text display: Large, clear, generous spacing
- Stats: Non-intrusive, corner positioned
- Keyboard: Below text, optional toggle
- Progress: Subtle bar at top

### Summary Screen
- Celebration: Appropriate to achievement level
- Stats: Clear display of WPM, accuracy, time
- Stars/Rating: Visual accomplishment indicator
- Actions: Next lesson, retry, back to levels
- Achievements: Show any unlocked

---

## Iconography

### Style
- Line icons (2px stroke)
- Rounded caps and joins
- Consistent 24x24 grid
- Filled variants for active/selected states

### Key Icons Needed
- Navigation: Home, Dashboard, Levels, Settings, User
- Actions: Play, Pause, Restart, Next, Back, Close
- Stats: Speed (gauge), Accuracy (target), Streak (flame), XP (star)
- Keyboard: Keyboard, Finger, Hand
- Gamification: Trophy, Badge, Lock, Unlock, Star
- Misc: Sound on/off, Theme toggle, Language, Info, Help

### Recommended Library
- Lucide Icons (MIT license, consistent style)
- Or custom set for brand distinction

---

## Implementation Priority

### Phase 1 (Foundation)
1. CSS custom properties for colors, spacing, typography
2. Dark mode toggle mechanism
3. Base component styles (buttons, cards, inputs)
4. Typography utility classes

### Phase 2 (Core Components)
1. Visual keyboard component
2. Progress indicators
3. Stat cards
4. Navigation components

### Phase 3 (Game UI)
1. Typing area styling
2. Score displays
3. Achievement badges
4. Animation system

### Phase 4 (Polish)
1. Page transitions
2. Celebration animations
3. Micro-interactions
4. Accessibility audit

---

## Design Tokens Export

All values should be exported as CSS custom properties and optionally as a Tailwind theme extension. This ensures consistency and easy updates.

```css
/* Example implementation in globals.css */
:root {
  /* Colors */
  --color-primary: #6366F1;
  --color-primary-hover: #4F46E5;
  /* ... */

  /* Typography */
  --text-display-xl: 3rem;
  /* ... */

  /* Spacing */
  --space-4: 1rem;
  /* ... */

  /* Radii */
  --radius-lg: 0.75rem;
  /* ... */
}
```

---

*This design system is a living document. Update as the product evolves.*
