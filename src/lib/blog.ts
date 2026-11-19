import blogSeed from "../data/blog-posts.json";
import { getClientLogo, type ClientLogo } from "./client-logos";
import { contentfulQuery, getContentfulConfig } from "./contentful";
import { renderMarkdown } from "./markdown";

/** Allowed values of the `tags` field on the Contentful `blogPost` type. */
export const BLOG_TAGS = [
  "ai-engineering",
  "architecture",
  "astro",
  "contentful",
  "jamstack",
  "typescript",
  "frontend",
  "devops",
  "leadership",
  "case-study",
  "react",
  "css",
] as const;

export type BlogTag = (typeof BLOG_TAGS)[number];

export const BLOG_TAG_LABELS: Record<BlogTag, string> = {
  "ai-engineering": "AI engineering",
  architecture: "Architecture",
  astro: "Astro",
  contentful: "Contentful",
  jamstack: "Jamstack",
  typescript: "TypeScript",
  frontend: "Frontend",
  devops: "DevOps",
  leadership: "Leadership",
  "case-study": "Case study",
  react: "React",
  css: "CSS",
};

export interface BlogHeroImage {
  url: string;
  alt: string;
}

/** Raw shape of the `blogPost` content type (body is Markdown). */
export interface BlogPostEntry {
  title: string;
  slug: string;
  description: string;
  body: string;
  /** ISO date, e.g. 2026-10-20 */
  publishDate: string;
  tags: string[];
  heroImage: BlogHeroImage | null;
  /** Original URL when the post was first published elsewhere (e.g. Medium). */
  canonicalUrl?: string | null;
}

/** Card data. Safe to serialise into a React island (no body). */
export interface BlogPostSummary {
  title: string;
  slug: string;
  description: string;
  publishDate: string;
  tags: BlogTag[];
  heroImage: BlogHeroImage | null;
  /** Client logo for the card art when there is no hero image. */
  clientLogo: ClientLogo | null;
  /** Estimated reading time in minutes. */
  readingMinutes: number;
}

/** A post ready to render on its own page. */
export interface BlogPost extends BlogPostSummary {
  bodyHtml: string;
  /** Absolute URL for `<link rel="canonical">` when the post is a repost. */
  canonicalUrl: string | null;
}

const PAGE_SIZE = 50;

const BLOG_POSTS_QUERY = /* GraphQL */ `
  query BlogPosts($limit: Int!, $skip: Int!) {
    blogPostCollection(order: publishDate_DESC, limit: $limit, skip: $skip) {
      total
      items {
        title
        slug
        description
        body
        publishDate
        tags
        heroImage {
          url
          description
          title
        }
        canonicalUrl
      }
    }
  }
`;

interface RawBlogPost {
  title: string | null;
  slug: string | null;
  description: string | null;
  body: string | null;
  publishDate: string | null;
  tags: (string | null)[] | null;
  heroImage: {
    url: string | null;
    description: string | null;
    title: string | null;
  } | null;
  canonicalUrl: string | null;
}

interface BlogPostsQueryResult {
  blogPostCollection: { total: number; items: (RawBlogPost | null)[] };
}

const isBlogTag = (value: string | null): value is BlogTag =>
  BLOG_TAGS.includes(value as BlogTag);

function toEntry(raw: RawBlogPost): BlogPostEntry | null {
  // Required fields: skip (rather than crash on) anything half-published.
  if (
    !raw.title ||
    !raw.slug ||
    !raw.description ||
    !raw.body ||
    !raw.publishDate
  ) {
    return null;
  }

  return {
    title: raw.title,
    slug: raw.slug,
    description: raw.description,
    body: raw.body,
    publishDate: raw.publishDate,
    tags: (raw.tags ?? []).filter((t): t is string => Boolean(t)),
    heroImage: raw.heroImage?.url
      ? {
          url: raw.heroImage.url,
          alt: raw.heroImage.description || raw.heroImage.title || "",
        }
      : null,
    canonicalUrl: raw.canonicalUrl || null,
  };
}

async function fetchEntries(): Promise<BlogPostEntry[]> {
  const config = getContentfulConfig();

  if (!config) {
    console.warn(
      "[contentful] CONTENTFUL_SPACE_ID / CONTENTFUL_DELIVERY_TOKEN not set. Using local fallback blog posts.",
    );
    return blogSeed as BlogPostEntry[];
  }

  const entries: BlogPostEntry[] = [];
  let skip = 0;
  let total = 0;

  do {
    const data = await contentfulQuery<BlogPostsQueryResult>(
      config,
      BLOG_POSTS_QUERY,
      { limit: PAGE_SIZE, skip },
    );
    const { items } = data.blogPostCollection;
    total = data.blogPostCollection.total;
    for (const item of items) {
      const entry = item && toEntry(item);
      if (entry) entries.push(entry);
    }
    skip += PAGE_SIZE;
    if (items.length === 0) break;
  } while (skip < total);

  console.info(`[contentful] ${entries.length} blog post(s) loaded.`);
  return entries;
}

async function toPost(entry: BlogPostEntry): Promise<BlogPost> {
  const tags = entry.tags.filter(isBlogTag);
  const unknown = entry.tags.filter((t) => !isBlogTag(t));
  if (unknown.length) {
    console.warn(
      `[blog] "${entry.slug}" has unknown tag(s) ${unknown.join(", ")}; ignoring them. Add them to BLOG_TAGS.`,
    );
  }

  // Runs at build time only. Content is authored by the site owner in
  // Contentful, so the HTML is trusted.
  const bodyHtml = await renderMarkdown(entry.body);

  return {
    title: entry.title,
    slug: entry.slug,
    description: entry.description,
    publishDate: entry.publishDate,
    tags,
    heroImage: entry.heroImage,
    clientLogo: getClientLogo(entry.slug),
    canonicalUrl: entry.canonicalUrl ?? null,
    bodyHtml,
    readingMinutes: readingMinutes(bodyHtml),
  };
}

let cached: Promise<BlogPost[]> | undefined;

/** All posts, newest first. Fetched once per build. May be empty. */
export function getBlogPosts(): Promise<BlogPost[]> {
  cached ??= fetchEntries()
    .then((entries) => Promise.all(entries.map(toPost)))
    .then((posts) =>
      posts.sort((a, b) => b.publishDate.localeCompare(a.publishDate)),
    );
  return cached;
}

/** Strips the body so only card data is sent to the browser. */
export function toSummary({
  bodyHtml: _body,
  canonicalUrl: _canonical,
  ...summary
}: BlogPost) {
  return summary satisfies BlogPostSummary;
}

/** Tags that at least one post uses, in the order of BLOG_TAGS. */
export function getUsedTags(posts: { tags: BlogTag[] }[]): BlogTag[] {
  return BLOG_TAGS.filter((tag) => posts.some((p) => p.tags.includes(tag)));
}

export function formatPublishDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(isoDate));
}

/** Rough reading time at 220 words a minute, from the rendered HTML. */
export function readingMinutes(html: string): number {
  const words = html
    .replace(/<pre[\s\S]*?<\/pre>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
