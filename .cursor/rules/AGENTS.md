---
alwaysApply: true
---

# Coding Style & Rules

## 1. Implementation Quality

- Always produce **advanced, professional code** that is consistent with the existing codebase.
- NEVER write mock or placeholder implementations unless explicitly requested.
- Always deliver **full, real, production-ready implementations**.

## 2. Design Restrictions

- Do NOT use **scale**, **hover-scale**, or **any scaling animations** — these are prohibited.
- Never introduce UI/UX effects that distort size or layout shift during interaction.
- Styles must alwasy be light/dark themable using the `globals.cs` unless otherwise asked.

## 3. Animation Rules

- Framer Motion is NOT allowed via `framer-motion` imports.
- All motion-related imports must come from **`motion/react`**.
  - Example:
    ```ts
    import { motion } from "motion/react";
    ```
- Follow motion/react's best practices for performance and accessibility.
- **MUST:** Honor `prefers-reduced-motion` (provide reduced variant)
- **MUST:** Animate compositor-friendly props (`transform`, `opacity`); avoid layout/repaint props (`top/left/width/height`)
- **MUST:** Animations are interruptible and input-driven (avoid autoplay)
- **MUST:** Correct `transform-origin` (motion starts where it "physically" should)

## 4. Naming Conventions

- **Files:** lower-case or kebab-case (e.g., `file-name.txt`).
- **Folders:** lower-case (e.g., `my-folder`).
- **Variables / Functions:** camelCase (e.g., `myVariable`, `doSomething`).
- **Classes / Components:** PascalCase (e.g., `MyClass`, `MyComponent`).
- **Constants:** UPPER_CASE (e.g., `MAX_COUNT`) or camelCase for non-exports.
- **Private fields:** \_camelCase (e.g., `_privateVar`).

## 5. Consistency

- Match naming conventions, patterns, and architecture of the current codebase.
- Follow DRY (Don't Repeat Yourself) and clean code principles.
- Write self-contained, optimized, and maintainable code.

## 6. General Expectations

- Favor readability and maintainability over cleverness.
- Use idiomatic patterns for the given tech stack.
- Always validate logic and ensure it runs without errors.

# UI/UX Requirements

## Interactions

### Keyboard

- **MUST:** Full keyboard support per [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/)
- **MUST:** Visible focus rings (`:focus-visible`; group with `:focus-within`)
- **MUST:** Manage focus (trap, move, and return) per APG patterns

### Targets & Input

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
/>
```

- **NEVER:** Disable browser zoom
- **MUST:** `touch-action: manipulation` to prevent double-tap zoom; set `-webkit-tap-highlight-color` to match design

### Inputs & Forms (Behavior)

- **MUST:** Hydration-safe inputs (no lost focus/value)
- **NEVER:** Block paste in `<input>/<textarea>`
- **MUST:** Loading buttons show spinner and keep original label
- **MUST:** Enter submits focused text input In `<textarea>`, ⌘/Ctrl+Enter submits; Enter adds newline
- **MUST:** Keep submit enabled until request starts; then disable, show spinner, use idempotency key
- **MUST:** Don't block typing; accept free text and validate after
- **MUST:** Allow submitting incomplete forms to surface validation
- **MUST:** Errors inline next to fields; on submit, focus first error
- **MUST:** `autocomplete` + meaningful `name`; correct `type` and `inputmode`
- **SHOULD:** Disable spellcheck for emails/codes/usernames
- **SHOULD:** Placeholders end with ellipsis and show example pattern (eg, `+1 (123) 456-7890`, `sk-012345…`)
- **MUST:** Warn on unsaved changes before navigation
- **MUST:** Compatible with password managers & 2FA; allow pasting one-time codes
- **MUST:** Trim values to handle text expansion trailing spaces
- **MUST:** No dead zones on checkboxes/radios; label+control share one generous hit target

### State & Navigation

- **MUST:** URL reflects state (deep-link filters/tabs/pagination/expanded panels) Prefer libs like [nuqs](https://nuqs.47ng.com/)
- **MUST:** Back/Forward restores scroll
- **MUST:** Links are links—use `<a>/<Link>` for navigation (support Cmd/Ctrl/middle-click)

### Feedback

- **SHOULD:** Optimistic UI; reconcile on response; on failure show error and rollback or offer Undo
- **MUST:** Confirm destructive actions or provide Undo window
- **MUST:** Use polite `aria-live` for toasts/inline validation
- **SHOULD:** Ellipsis (`…`) for options that open follow-ups (eg, "Rename…")

### Touch/Drag/Scroll

- **MUST:** Design forgiving interactions (generous targets, clear affordances; avoid finickiness)
- **MUST:** Delay first tooltip in a group; subsequent peers no delay
- **MUST:** Intentional `overscroll-behavior: contain` in modals/drawers
- **MUST:** During drag, disable text selection and set `inert` on dragged element/containers
- **MUST:** No "dead-looking" interactive zones—if it looks clickable, it is

### Autofocus

- **SHOULD:** Autofocus on desktop when there's a single primary input; rarely on mobile (to avoid layout shift)

## Layout

- **SHOULD:** Optical alignment; adjust by ±1px when perception beats geometry
- **MUST:** Deliberate alignment to grid/baseline/edges/optical centers—no accidental placement
- **SHOULD:** Balance icon/text lockups (stroke/weight/size/spacing/color)
- **MUST:** Verify mobile, laptop, ultra-wide (simulate ultra-wide at 50% zoom)
- **MUST:** Respect safe areas (use env(safe-area-inset-\*))
- **MUST:** Avoid unwanted scrollbars; fix overflows

## Content & Accessibility

- **SHOULD:** Inline help first; tooltips last resort
- **MUST:** Skeletons mirror final content to avoid layout shift
- **MUST:** `<title>` matches current context
- **MUST:** No dead ends; always offer next step/recovery
- **MUST:** Design empty/sparse/dense/error states
- **SHOULD:** Curly quotes (" "); avoid widows/orphans
- **MUST:** Tabular numbers for comparisons (`font-variant-numeric: tabular-nums` or a mono like Geist Mono)
- **MUST:** Redundant status cues (not color-only); icons have text labels
- **MUST:** Don't ship the schema—visuals may omit labels but accessible names still exist
- **MUST:** Use the ellipsis character `…` (not `...`)
- **MUST:** `scroll-margin-top` on headings for anchored links; include a "Skip to content" link; hierarchical `<h1–h6>`
- **MUST:** Resilient to user-generated content (short/avg/very long)
- **MUST:** Locale-aware dates/times/numbers/currency
- **MUST:** Accurate names (`aria-label`), decorative elements `aria-hidden`, verify in the Accessibility Tree
- **MUST:** Icon-only buttons have descriptive `aria-label`
- **MUST:** Prefer native semantics (`button`, `a`, `label`, `table`) before ARIA
- **SHOULD:** Right-clicking the nav logo surfaces brand assets
- **MUST:** Use non-breaking spaces to glue terms: `10&nbsp;MB`, `⌘&nbsp;+&nbsp;K`, `Vercel&nbsp;SDK`

## Performance

- **SHOULD:** Test iOS Low Power Mode and macOS Safari
- **MUST:** Measure reliably (disable extensions that skew runtime)
- **MUST:** Track and minimize re-renders (React DevTools/React Scan)
- **MUST:** Profile with CPU/network throttling
- **MUST:** Batch layout reads/writes; avoid unnecessary reflows/repaints
- **MUST:** Mutations (`POST/PATCH/DELETE`) target <500 ms
- **SHOULD:** Prefer uncontrolled inputs; make controlled loops cheap (keystroke cost)
- **MUST:** Virtualize large lists (eg, `virtua`)
- **MUST:** Preload only above-the-fold images; lazy-load the rest
- **MUST:** Prevent CLS from images (explicit dimensions or reserved space)

## Design

- **SHOULD:** Layered shadows (ambient + direct)
- **SHOULD:** Crisp edges via semi-transparent borders + shadows
- **SHOULD:** Nested radii: child ≤ parent; concentric
- **SHOULD:** Hue consistency: tint borders/shadows/text toward bg hue
- **MUST:** Accessible charts (color-blind-friendly palettes)
- **MUST:** Meet contrast—prefer [APCA](https://apcacontrast.com/) over WCAG 2
- **MUST:** Increase contrast on `:hover/:active/:focus`
- **SHOULD:** Match browser UI to bg
- **SHOULD:** Avoid gradient banding (use masks when needed)

# How to ensure Always Works™ implementation

Please ensure your implementation Always Works™ for: $ARGUMENTS.

Follow this systematic approach:

## Core Philosophy

- "Should work" ≠ "does work" - Pattern matching isn't enough
- I'm not paid to write code, I'm paid to solve problems
- Untested code is just a guess, not a solution

# The 30-Second Reality Check - Must answer YES to ALL:

- Did I run/build the code?
- Did I trigger the exact feature I changed?
- Did I see the expected result with my own observation (including GUI)?
- Did I check for error messages?
- Would I bet $1,000,000,000 this works?

# Phrases to Avoid:

- "This should work now"
- "I've fixed the issue" (especially 2nd+ time)
- "Try it now" (without trying it myself)
- "The logic is correct so..."

# Specific Test Requirements:

- UI Changes: Actually click the button/link/form
- API Changes: Make the actual API call
- Data Changes: Query the database
- Logic Changes: Run the specific scenario
- Config Changes: Restart and verify it loads

# The Embarrassment Test:

"If the user records trying this and it fails, will I feel embarrassed to see his face?"

# Time Reality:

- Time saved skipping tests: 30 seconds
- Time wasted when it doesn't work: 30 minutes
- User trust lost: Immeasurable

A user describing a bug for the third time isn't thinking "this AI is trying hard" - they're thinking "why am I wasting time with this incompetent tool?"
