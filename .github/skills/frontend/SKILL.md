# Frontend Developer Skills

## Purpose

Build frontend changes for this repository with Astro, Tailwind CSS v4 and shadcn/ui, matching the NorthStar design (issue #6) and its accessibility standards.

## Stack

- **Astro** pages and layout, pre-rendered at build time. Zero JavaScript by default.
- **Tailwind CSS v4** utilities for all styling. There is no ITCSS/BEM layer any more.
- **shadcn/ui** components in `src/components/ui/` (`button`, `badge`, `card`, `tabs`). `components.json` is set up, so `npx shadcn@latest add <component>` drops new ones in the right place.
- **React** only for interactive islands (`client:visible` / `client:load`): `ServicesTabs`, `BlogList`.
- Icons: `lucide-react`. Brand icons (LinkedIn, GitHub) are in `SocialIcon.astro`.

## Design tokens

All tokens live in `src/styles/global.css`, using shadcn token names so they match the Figma "Theme" variables:

- Semantic tokens: `background`, `foreground`, `card`, `primary`, `primary-hover`, `secondary`, `muted`, `muted-foreground`, `accent`, `accent-foreground`, `border`, `border-strong`, `ring` (gold focus ring). Use them as `bg-primary`, `text-muted-foreground`, `border-border` and so on.
- Light values are on `:root` / `.light`, dark values on `.dark`. The site is dark-first: `<html class="dark">`, and white panels add `class="light"` so everything inside them switches.
- Brand primitives: `brand-ink`, `brand-ink-900`…`600`, `brand-slate-*`, `brand-stone`, `brand-blue-50`…`800`, `brand-indigo`, `brand-violet`, `brand-gold`. Prefer semantic tokens; use primitives for fixed brand surfaces.
- Gradients are utilities: `bg-hero-glow`, `bg-hero-glow-soft`, `bg-cta-gradient`, `bg-art-1/2/3` (placeholder art for posts with no hero image).
- Never hard-code a hex value in a component. Add a token instead.

## Patterns

### Static links that look like buttons or badges

shadcn's `asChild` does not work across the Astro/React boundary, so in `.astro` files use the variant helpers on plain elements. This ships no JavaScript:

```astro
---
import { buttonVariants } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";
---

<a href="/blog" class={buttonVariants({ variant: "outline", size: "lg" })}>All posts</a>
<span class={badgeVariants()}>Case study</span>
```

Button variants: `default` (brand blue), `secondary` (ink, for use on gradients), `outline`, `ghost`, `link`. Sizes: `sm`, `default`, `lg`, `icon`.

### Layout

- Pages render inside `src/layouts/Layout.astro` (header, `<main id="main">`, footer with the CTA band).
- The header is positioned over the page, so every page starts with a dark hero that has `pt-[96px]`.
- Wrap content in `Container.astro` (1280px max, 20px/32px gutters). Section headings use `SectionHeading.astro` (eyebrow pill + H2 + optional lead).
- `lucide-react` icons in `.astro` files take `className`, not `class`.

### Share (Open Graph) images

Every page passes `ogImage` (a site path or absolute URL, 1200×630) and `ogImageAlt` to `Layout`, which writes the `og:` and `twitter:` tags in `Head.astro`.

- Fixed pages use the images in `public/` (`og-image.jpg`, `og-blog.jpg`), drawn by `node scripts/og/render-og.mjs` (Playwright, run locally and commit the output).
- Content pages generated from Contentful get their own card at build time: `renderOgImage({ eyebrow, heading })` in `src/lib/og-image.ts` draws the same design with satori + resvg (no browser, so it runs on Netlify). Expose it as a pre-rendered endpoint next to the page, like `src/pages/og/blog/[slug].png.ts`, and point the page's `ogImage` at that path.
- The two designs must stay in step: if you change the look in `render-og.mjs`, change `og-image.ts` too.
- satori supports a subset of CSS: flexbox only (every `div` with more than one child needs `display: flex`), no `mask-image`, and set `boxSizing: "border-box"` on padded boxes with a fixed size. Fonts must be `.woff`/`.ttf`, not `.woff2`.
- Check a generated card by opening `dist/og/...` after `npm run build`, including a post with a very long title.

### Long-form content

Markdown from Contentful is styled by element under `.post-body` in `global.css` (headings, lists, quotes, code). Code colours are the `--shiki-*` variables set there.

## Accessibility

- Semantic HTML (`header`, `main`, `footer`, `nav`, `section` with `aria-labelledby`, one `h1` per page).
- Accessible names for icon-only controls; decorative SVGs get `aria-hidden="true"`.
- Visible focus: the global `:focus-visible` style uses the gold `ring` token. Don't remove outlines.
- Respect `prefers-reduced-motion` for any animation (see the logo animation in `global.css`).
- Check contrast when placing text on gradients; white panels must carry `.light`.

## Gotchas

- Tailwind scans source comments: avoid words like `static`, `block`, `hidden` in comments or they become CSS classes.
- Use `cn()` from `@/lib/utils` to merge classes so Tailwind conflicts resolve correctly.
- Screenshot every changed page at 1440px and 390px before opening a PR, and check there is no horizontal scroll on mobile.

## Success metrics

- Uses shadcn/ui and theme tokens rather than a parallel pattern or raw hex values.
- Ships no new client JavaScript unless the feature is interactive.
- HTML is semantic and keyboard-accessible; motion respects reduced-motion.

## References

- [Astro](https://docs.astro.build/en/getting-started/)
- [shadcn/ui](https://ui.shadcn.com/docs) and [theming](https://ui.shadcn.com/docs/theming)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [MDN: Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
