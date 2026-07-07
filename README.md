# Northstar Digital Consulting

A high-performance, accessible marketing website built with Astro and modern web standards.

## 🎯 Overview

This is the official website for Northstar Digital Consulting, showcasing technical leadership and software engineering expertise. The site emphasizes web performance, accessibility, and modern CSS architecture.

## 🏗️ Tech Stack

- **Framework**: [Astro](https://astro.build) v6.4.6 - Zero-JS by default, optimal for performance
- **Styling**: Custom CSS with ITCSS architecture + Tailwind v4.3.0 utilities
- **Typography**: Self-hosted Poppins via Fontsource (400, 600, 700)
- **Build Optimization**: PostCSS + PurgeCSS for production
- **Deployment**: Optimized static site generation

## 📁 Project Structure

```
/
├── public/                      # Static assets
│   ├── favicon-*.png           # Multi-resolution favicons
│   └── site.webmanifest        # PWA manifest
├── src/
│   ├── components/             # Reusable Astro components
│   │   ├── Footer.astro        # Fixed footer with scroll reveal
│   │   ├── Header.astro        # Site header
│   │   ├── Hero.astro          # Hero section with animated panels
│   │   ├── Icon.astro          # SVG icon system
│   │   ├── Logo.astro          # Animated SVG logo
│   │   ├── Main.astro          # Main content wrapper
│   │   └── ClientsCarousel.astro # Infinite scrolling marquee
│   ├── layouts/
│   │   └── Layout.astro        # Base layout with inlined critical CSS
│   ├── pages/
│   │   └── index.astro         # Homepage
│   └── styles/                 # ITCSS-organized CSS
│       ├── styles.css          # Main stylesheet
│       ├── _settings/          # CSS custom properties, theme variables
│       ├── _generics/          # Global resets and base styles
│       ├── _objects/           # Layout patterns (grid system)
│       ├── _elements/          # Element-level styles (typography, buttons, icons)
│       └── _components/        # Component-specific styles
├── astro.config.mjs            # Astro configuration
├── postcss.config.cjs          # PostCSS + PurgeCSS config
└── package.json
```

## 🚀 Commands

| Command | Action |
|---------|--------|
| \`npm install\` | Install dependencies |
| \`npm run dev\` | Start dev server at \`localhost:4321\` |
| \`npm run build\` | Build for production with CSS optimization |
| \`npm run preview\` | Preview production build locally |

## ⚡ Performance Optimizations

### Critical CSS Inlining
All CSS is inlined directly into the \`<head>\` for instant rendering:
- Eliminates render-blocking external stylesheet requests
- Sub-100ms First Contentful Paint on fast connections
- Progressive enhancement for slower networks

### CSS Optimization
- **PostCSS + PurgeCSS**: Removes unused CSS in production builds
- **Safelist patterns**: Preserves dynamic classes (grid spans, BEM modifiers)
- **Content scanning**: Analyzes all \`.astro\`, \`.jsx\`, \`.tsx\`, \`.html\` files
- Production builds run with \`NODE_ENV=production\`

### Asset Strategy
- **Self-hosted fonts**: Poppins loaded from \`@fontsource\` (no external requests)
- **SVG icons**: Inline SVG system, no icon font overhead
- **Minimal JavaScript**: Astro's zero-JS default, only 3 interactive features:
  - Footer scroll-reveal (native Intersection Observer)
  - Logo draw animation (CSS only)
  - Carousel auto-scroll (CSS \`@keyframes\`)

### Responsive Images
- Multi-resolution favicons (16px, 32px, 192px, 512px)
- Apple touch icon for iOS home screen
- Progressive Web App manifest

## ♿ Accessibility Features

### Semantic HTML
- Proper heading hierarchy (h1 → h2 → h3)
- Semantic elements: \`<header>\`, \`<main>\`, \`<footer>\`, \`<nav>\`, \`<section>\`
- ARIA labels on icon-only links and interactive elements
- \`aria-current="page"\` on active navigation items
- \`aria-hidden="true"\` on decorative elements (hero panels)

### Keyboard Navigation
- All interactive elements keyboard accessible
- **Focus states**: High-contrast gold outline (\`--nd-color-focus-gold: #F5B841\`)
  - 3px solid outline with 3px offset
  - Additional \`box-shadow\` for depth
  - Applies to buttons, links, and form controls
- Skip navigation patterns via proper heading structure

### Motion & Animation
- **\`prefers-reduced-motion\`**: All animations disabled for users who prefer reduced motion
  - Hero gradient animation stopped
  - Panel fade animations removed
  - Logo draw animation skipped
  - Carousel scroll paused
  - Content fade-ins instant
- Animations use \`will-change\` for performance
- Event listeners use \`passive: true\` where appropriate

### Visual Accessibility
- **Color contrast**: WCAG AA compliant minimum
- **Focus indicators**: Never removed, enhanced with custom styling
- **Text scaling**: Fluid typography with \`clamp()\` respects user font-size preferences
- **Touch targets**: Buttons minimum 44×44px (iOS guidelines)

### Screen Readers
- Descriptive link text (no "click here")
- Icon-only buttons include \`aria-label\`
- Decorative images have \`aria-hidden="true"\`
- Main landmark for content identification

## 🎨 CSS Architecture

### ITCSS Methodology
Styles organized by specificity (Inverted Triangle):

1. **Settings** (\`_settings/\`): CSS custom properties, theme colors
2. **Generics** (\`_generics/\`): Resets, normalize, global styles
3. **Objects** (\`_objects/\`): Layout patterns (12-column responsive grid)
4. **Elements** (\`_elements/\`): Base element styles (typography, buttons, icons)
5. **Components** (\`_components/\`): UI component styles

### BEM Naming Convention
- **Block**: \`.c-hero\`, \`.e-button\`
- **Element**: \`.c-hero__panel\`, \`.c-footer__nav-list\`
- **Modifier**: \`.c-hero__panel--1\`, \`.e-button--primary\`

### Responsive Design System

**Grid System**:
- Mobile-first: 2 columns (base)
- sm (480px): 4 columns
- md (768px): 6 columns
- lg (1024px): 12 columns
- xl (1400px): 12 columns (larger gaps)

**Typography Scaling**:
- Fluid typography using \`clamp()\` for smooth scaling
- Base range: 480px → 1280px viewports
- Large screens (1471px+): Enhanced scale for desktop displays
- MacBook Pro 14" optimized (1470px breakpoint)

**Breakpoints**:
\`\`\`css
480px  - Small tablets
768px  - Tablets
1024px - Desktop
1400px - Large desktop
1471px - Enhanced typography
1600px - Max content width
\`\`\`

### Theme System
CSS custom properties for consistent theming:
\`\`\`css
--nd-color-soft-blue: #B9CFF8
--nd-color-baby-blue: #29A0F5
--nd-color-mist-blue: #EBF2FD
--nd-color-ink-black: #0C101B
--nd-color-focus-gold: #F5B841
\`\`\`

## 🎭 Interactive Features

### Logo Animation
- SVG stroke animation using \`stroke-dasharray\` and \`stroke-dashoffset\`
- Draws in on page load with staggered timing
- Infinite pulse cycle (10s duration) with opacity changes
- Pure CSS implementation (no JavaScript)

### Hero Section
- **Gradient animation**: Multi-color diagonal gradient shifts over 22s
- **Animated panels**: 3 clipped shapes with individual opacity animations
  - Sporadic timing (11s, 13s, 17s) for organic feel
  - Custom cubic-bezier easing for natural motion
- **Content reveal**: Fade-up animation (0.3s delay, 0.8s duration)

### Client Carousel
- Infinite horizontal scroll (pure CSS)
- 90s duration for smooth, unhurried motion
- Duplicated items for seamless loop
- Pauses on hover for accessibility
- Respects \`prefers-reduced-motion\`

### Footer Scroll Reveal
- Fixed positioning with intersection observer
- Fades in when main content nears bottom
- \`focusin\` event scrolls to footer for keyboard users
- Opacity + transform animation for polish

## 🎯 Design Decisions

### Why Astro?
- **Zero JavaScript by default**: Optimal for content-focused sites
- **Partial hydration**: Only interactive components load JS
- **Built-in optimization**: Image optimization, critical CSS, minification
- **Developer experience**: Component-based with familiar syntax

### Why Custom CSS over Tailwind-only?
- **ITCSS + BEM**: Scalable, maintainable architecture for larger sites
- **Tailwind as utility**: Used sparingly for one-off utilities (\`flex\`, \`gap\`, \`mb-*\`)
- **Component styles**: Encapsulated in dedicated CSS files
- **Reduced HTML noise**: Complex components don't have 20+ utility classes

### Why Self-hosted Fonts?
- **Privacy**: No Google Fonts tracking
- **Performance**: No external DNS lookup or HTTPS handshake
- **Control**: Subset fonts to only needed characters (future optimization)
- **Reliability**: No third-party CDN downtime

### Why Inline CSS?
- **Critical rendering path**: CSS available instantly, no blocking request
- **HTTP/2 consideration**: While HTTP/2 reduces penalty of multiple requests, inlining is still faster for small CSS bundles
- **Cache trade-off**: Since CSS changes frequently during development, inline is acceptable for this site's scale
- **Future optimization**: Can move to external stylesheet with cache headers for production

## 📊 Performance Metrics (Target)

- **Lighthouse Score**: 95+ (all categories)
- **First Contentful Paint**: < 1.0s
- **Time to Interactive**: < 2.0s
- **Total Bundle Size**: < 100KB (gzipped)
- **CSS Size**: ~15KB (inlined, purged)

## 🔧 Development Notes

### Adding New Icons
1. Add SVG to \`Icon.astro\` icons object
2. Include viewBox and stroke/fill as needed
3. Size variants automatically applied (xs/sm/md/lg/xl)

### Creating New Components
1. Create component in \`src/components/\`
2. Add styles to appropriate ITCSS layer in \`src/styles/\`
3. Use BEM naming: \`.c-component__element--modifier\`
4. Import in layout or page as needed

### Responsive Testing
- Test at 480px, 768px, 1024px, 1400px, 1600px breakpoints
- Check MacBook Pro 14" (1470px) specifically
- Verify fluid typography scaling in DevTools

## 📝 License

Private repository - All rights reserved.

## 👤 Author

**Matt Claffey** - Lead Software Engineer  
[LinkedIn](https://www.linkedin.com/company/130174180) • [GitHub](https://github.com/code-mattclaffey)
