# Blog

Posts are authored in Contentful (`blogPost` type) and rendered at build time. No Contentful call happens in the browser.

## Pages

| Route          | File                               | Notes                                                                        |
| -------------- | ---------------------------------- | ---------------------------------------------------------------------------- |
| `/` (section)  | `src/components/LatestPosts.astro` | Three newest posts. Renders nothing when there are no posts.                 |
| `/blog`        | `src/pages/blog/index.astro`       | All posts plus the `BlogList` React island. Shows "No posts yet" when empty. |
| `/blog/<slug>` | `src/pages/blog/[slug].astro`      | Pre-rendered with `getStaticPaths`. Title and description go to `Layout`.    |

## Data flow

```
Contentful blogPostCollection ──▶ src/lib/blog.ts (getBlogPosts, cached per build)
                                      │  Markdown body ──marked──▶ bodyHtml (build time)
                                      ├─▶ LatestPosts.astro ──▶ BlogCard.tsx (static HTML, no JS)
                                      ├─▶ blog/index.astro ──▶ BlogList.tsx (island, client:load)
                                      └─▶ blog/[slug].astro ──▶ set:html={bodyHtml}
```

- `src/lib/blog.ts` queries `blogPostCollection` (`order: publishDate_DESC`), paging 50 at a time. Entries missing a required field are skipped.
- Without `CONTENTFUL_SPACE_ID` / `CONTENTFUL_DELIVERY_TOKEN` it uses `src/data/blog-posts.json` (sample posts). With credentials set, a failing request fails the build. Zero posts is valid and does not fail the build.
- Markdown is converted with `marked` at build time; no parser ships to the browser. `set:html` is used only for that rendered body (content is trusted, edited only by the site owner).
- Fenced code blocks are syntax highlighted at build time by Shiki (`src/lib/markdown.ts`), so no highlighter JS ships to the browser. Label each fence with its language (for example ` ```tsx `). Supported: javascript, typescript, jsx, tsx, html, css, scss, json, yaml, bash, sql, markdown (plus js, ts, sh, yml, md aliases). Anything else, or no label, renders as plain text, which suits folder trees and diagrams.
- Code colours are CSS custom properties (`--shiki-token-*`) set on `.c-post__body` in `_components.blog.css`. Change those values to retheme code.
- Only card data (`toSummary`, no body) is serialised into the island, keeping page weight down.

## Filtering

`BlogList.tsx` receives every post and the tags in use. The server render contains all posts, so the list works without JavaScript. After hydration it reads `?tag=<tag>`, filters in the browser, and keeps the URL in sync with `history.replaceState`. Filters are real `button`s with `aria-pressed`, and a `role="status"` line announces the result count. Post pages link their tags to `/blog?tag=<tag>`.

Only tags used by at least one post get a filter button.

## Adding a tag

1. Add the value to the `tags` validation on the `blogPost` content type in Contentful.
2. Add it to `BLOG_TAGS` and `BLOG_TAG_LABELS` in `src/lib/blog.ts` (the order there is the display order).
3. Tag posts in Contentful and publish. Unknown tags are ignored with a build warning.

## Canonical URLs (reposted articles)

`blogPost.canonicalUrl` is optional. When set (for example on posts migrated from Medium), `/blog/[slug]` renders `<link rel="canonical" href="...">` pointing at the original, so search engines treat the original as the source. Leave it empty for posts written for this site.

## Styling

ITCSS + BEM in `src/styles/_components/_components.blog.css` (`c-blog-card`, `c-blog-list`, `c-post`, `c-latest-posts`), using theme tokens only. Markdown body elements are styled under `.c-post__body`.

## Not done

- No navigation link to `/blog` in the header yet.
- Hero images use the Contentful Images API (`?w=&h=&fm=webp`); `author` is ignored.
