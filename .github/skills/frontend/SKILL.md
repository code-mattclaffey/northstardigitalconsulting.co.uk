# Frontend Developer Skills

## Purpose

Build frontend changes for this repository in a way that matches the site’s existing Astro structure, styling system, and accessibility standards.

## Project standards already implemented in this repo

### 1. Use Astro as the default frontend pattern

- Build pages and reusable UI as Astro components in `src/components/`.
- Keep page composition simple and declarative.
- Prefer zero-JS by default; add JavaScript only when a small progressive enhancement is needed.
- Use the main layout pattern already established in `src/layouts/Layout.astro` and compose pages through it.

### 2. Follow the repo’s page/layout composition model

- Pages in `src/pages/` should import the shared layout and render content inside a single `<Layout>` wrapper.
- Shared page chrome belongs in the layout and its reusable child components:
  - `Head.astro`
  - `Header.astro`
  - `Main.astro`
  - `Footer.astro`
- Keep page files focused on content structure rather than duplicating global wrapper markup.

### 3. Maintain the existing CSS architecture

This repository uses an ITCSS-inspired structure in `src/styles/`:

1. `src/styles/_settings/` for CSS custom properties and theme tokens.
2. `src/styles/_generics/` for global resets and base rules.
3. `src/styles/_objects/` for layout patterns such as the grid.
4. `src/styles/_elements/` for base element styling such as typography, buttons, and icon treatment.
5. `src/styles/_components/` for component-scoped styling.

Follow this order and keep styles organized by specificity instead of adding ad hoc global rules.

### 4. Use the established naming conventions

- Prefer BEM-style class names such as `.c-hero__panel`, `.c-footer__nav-list`, and `.e-button--primary`.
- Use `c-` for components, `e-` for elements, and `o-` for objects.
- Reuse the existing design tokens from `src/styles/_settings/_settings.theme.css` instead of introducing arbitrary colour values.

### 5. Keep accessibility as a first-class requirement

- Use semantic HTML (`header`, `main`, `footer`, `nav`, `section`, `h1`-`h2`-`h3`).
- Preserve accessible names for icon-only links and controls.
- Use `aria-label`, `aria-current`, and `aria-hidden` only where the repo already uses them.
- Ensure focus styles remain visible and high-contrast.
- Respect `prefers-reduced-motion` for any animation work.

### 6. Keep styling consistent with the current design system

- Prefer the existing button, heading, body text, and logo element styles before introducing new patterns.
- Use the responsive grid system already defined in the object layer rather than inventing custom layout helpers.
- Use Tailwind utility classes sparingly for small layout or spacing adjustments only when they match the repo style.
- Avoid adding new CSS frameworks or replacing the established layering model.

### 7. Prefer lightweight, production-friendly implementation

- Keep JavaScript minimal and progressive.
- Avoid introducing heavy client-side dependencies unless the repo already depends on them.
- Prefer CSS-only transitions and animation where the current repo pattern already does that.
- Keep the footprint of new UI small and aligned with the static marketing-site use case.

## Example patterns

### Layout usage

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout>
  <section>
    <h1>Page heading</h1>
  </section>
</Layout>
```

### Component style scope

Use the existing naming shape and keep component styles in the appropriate layer:

- `.c-component`
- `.c-component__element`
- `.c-component__element--modifier`

### Theme token usage

Use CSS variables from the theme file rather than hard-coded colours:

```css
background-color: var(--nd-color-baby-blue);
color: var(--nd-color-ink-black);
```

## Success metrics

- Does the work reuse the repo’s Astro + ITCSS structure instead of introducing a parallel pattern?
- Are colours sourced from the documented theme variables?
- Is the HTML semantic and keyboard-accessible?
- Does motion respect `prefers-reduced-motion`?
- Is the implementation aligned with the style of the existing site and not overly heavy?

## References

- [Astro](https://docs.astro.build/en/getting-started/)
- [ITCSS](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)
- [MDN: Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
