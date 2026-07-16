---
description: "Builds features for the Northstar Digital Consulting repo"
---

# /build

Build a new feature in the Northstar Digital Consulting repo.

## Required workflow

1. Read the existing repository structure and understand how the site is assembled.
2. Read the frontend skill in `.github/skills/frontend/SKILL.md` and use it as the implementation contract for frontend work.
3. Follow the repo’s established patterns:
   - Astro page and component composition
   - shared layout reuse from `src/layouts/` and `src/components/`
   - ITCSS-style CSS organization in `src/styles/`
   - semantic HTML, accessible interaction patterns, and reduced-motion support
   - minimal JavaScript and lightweight styling solutions
4. Keep the change small, composable, and consistent with the current design system.

## Before building

1. If any requirement is unclear, ask concise clarifying questions before implementing.
2. Present a brief implementation approach back to the user before making changes.

## Constraints

1. Prefer the smallest viable feature change.
2. Reuse existing components, layout wrappers, theme tokens, and CSS conventions before creating new abstractions.
3. Do not introduce new frameworks or heavier dependencies unless they are clearly necessary.
4. Respect the repository’s editorconfig and existing file structure.

## Performance objectives

1. Use as few tokens as possible while still being precise.
2. Keep the user-facing update short unless more detail is requested.

## Verification

1. Confirm all new or edited files follow the repo’s formatting and style standards.
2. Run the build and confirm it completes without errors.
3. Confirm the styling remains consistent with the established design pattern.

## Success criteria

1. The implementation aligns with the frontend skill and existing Astro/ITCSS conventions.
2. The build runs cleanly with no errors.
3. Accessibility and reduced-motion requirements are preserved.
4. The solution is lightweight and visually consistent with the current repo.
