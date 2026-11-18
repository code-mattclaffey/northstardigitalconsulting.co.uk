# Contentful

Space `wclkrpbrf32m`, environment `master`. All content is fetched through the GraphQL Content API during `astro build`; nothing calls Contentful at request time.

## Content types used by the site

| Type          | Purpose                                                                                                                         | Code                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `homepage`    | Hero copy, CTAs, availability, SEO meta, section order, contract expiry (single entry)                                          | `src/lib/homepage.ts`     |
| `pageSection` | One homepage block: `component`, `background` (`dark`/`light`), optional `eyebrow`/`heading`/`lead` overrides                   | `src/pages/index.astro`   |
| `testimonial` | Homepage testimonials: `quote`, `name`, `role`, optional `company`, `order` (lowest first), `isSample` (shows a "Sample" label) | `src/lib/testimonials.ts` |
| `blogPost`    | Blog posts. `body` is Markdown; `tags` is limited to a fixed list (see the content type); optional `canonicalUrl` for reposts   | see `docs/blog.md`        |

## Homepage sections

The homepage renders the entries in `homepage.sections`, top to bottom. Each `pageSection` picks one component:

| `component`       | Renders                                                       |
| ----------------- | ------------------------------------------------------------- |
| `hero`            | Hero copy and CTAs from the homepage entry, plus client logos |
| `services`        | Services tabs                                                 |
| `availabilityCta` | "Looking for a senior contractor?" CTA band                   |
| `about`           | About Matt, photo and stats                                   |
| `caseStudies`     | Newest three `case-study` posts. Hidden when there are none   |
| `testimonials`    | Testimonials carousel. Hidden when there are none             |

`background` sets the section to the ink (`dark`) or stone (`light`) background; components use theme tokens so both work. If the hero is light, the header switches to dark text. Leave the heading fields blank to keep each component's default copy. With no sections linked, the site falls back to all six on dark.

To add a component type: add it to `SECTION_COMPONENTS` in `src/lib/homepage.ts`, to the `component` field's allowed values in Contentful, and to the switch in `src/pages/index.astro`.

## Availability highlight

`homepage.currentContractExpiry` is the last day of the current contract and `homepage.highlightAvailability` turns the highlight on or off. From 30 days before that date (`AVAILABILITY_WINDOW_DAYS` in `src/lib/availability.ts`), every CTA band shows an "Available from …" pill, "Booking my next contract now." copy and a glowing ring, and the hero badge gets a pulsing green dot. After the date the pill reads "Available now".

The state is worked out at build time and again in the browser by an inline script in `Layout.astro`, which sets `data-availability` on `<html>`. Style against it with the `available:` and `available-now:` Tailwind variants. Update the expiry date when a new contract is signed.

## Environment variables

| Variable                    | Required | Notes                      |
| --------------------------- | -------- | -------------------------- |
| `CONTENTFUL_SPACE_ID`       | Yes      |                            |
| `CONTENTFUL_DELIVERY_TOKEN` | Yes      | Content Delivery API token |
| `CONTENTFUL_ENVIRONMENT`    | No       | Defaults to `master`       |

Set them in Netlify for Production and Deploy Previews. Missing values: the build uses local fallback JSON in `src/data/`. Present but failing: the build fails.

## Rebuilds

A Contentful webhook calls a Netlify build hook on publish/unpublish, so published content goes live after the next build (about a minute).
