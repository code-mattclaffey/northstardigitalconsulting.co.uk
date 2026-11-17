# Contentful

Space `wclkrpbrf32m`, environment `master`. All content is fetched through the GraphQL Content API during `astro build`; nothing calls Contentful at request time.

## Content types used by the site

| Type | Purpose | Code |
|---|---|---|
| `homepage` | Hero copy, CTAs, availability, SEO meta (single entry) | `src/lib/homepage.ts` |
| `blogPost` | Blog posts. `body` is Markdown; `tags` is limited to a fixed list (see the content type) | see `docs/blog.md` |

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `CONTENTFUL_SPACE_ID` | Yes | |
| `CONTENTFUL_DELIVERY_TOKEN` | Yes | Content Delivery API token |
| `CONTENTFUL_ENVIRONMENT` | No | Defaults to `master` |

Set them in Netlify for Production and Deploy Previews. Missing values: the build uses local fallback JSON in `src/data/`. Present but failing: the build fails.

## Rebuilds

A Contentful webhook calls a Netlify build hook on publish/unpublish, so published content goes live after the next build (about a minute).
