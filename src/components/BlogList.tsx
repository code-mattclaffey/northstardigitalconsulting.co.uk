import { useEffect, useState } from "react";
import {
  BLOG_TAG_LABELS,
  type BlogPostSummary,
  type BlogTag,
} from "@/lib/blog";
import { cn } from "@/lib/utils";
import BlogCard from "./BlogCard";
import FeaturedPost from "./FeaturedPost";

interface Props {
  posts: BlogPostSummary[];
  tags: BlogTag[];
}

/**
 * Tag filter island. The server render contains every post (so the list
 * works without JavaScript); after hydration the selection is read from
 * `?tag=` and filtering happens in the browser.
 */
export default function BlogList({ posts, tags }: Props) {
  const [activeTag, setActiveTag] = useState<BlogTag | null>(null);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("tag");
    const match = tags.find((tag) => tag === param);
    if (match) setActiveTag(match);
  }, [tags]);

  const select = (tag: BlogTag | null) => {
    setActiveTag(tag);
    const url = new URL(window.location.href);
    if (tag) url.searchParams.set("tag", tag);
    else url.searchParams.delete("tag");
    window.history.replaceState(null, "", url);
  };

  const visible = activeTag
    ? posts.filter((post) => post.tags.includes(activeTag))
    : posts;

  const status = activeTag
    ? `${visible.length} ${visible.length === 1 ? "post" : "posts"} tagged ${BLOG_TAG_LABELS[activeTag]}`
    : `${visible.length} ${visible.length === 1 ? "post" : "posts"}`;

  // The newest post in the current filter is featured; the grid shows the rest.
  const [featured, ...rest] = visible;

  return (
    <div>
      {featured && <FeaturedPost key={featured.slug} post={featured} />}
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 md:mt-16">
        <h2 className="m-0 text-[28px] font-semibold">All posts</h2>
        {tags.length > 0 && (
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter posts by tag"
          >
            {[null, ...tags].map((tag) => {
              const pressed = tag === activeTag;
              return (
                <button
                  type="button"
                  key={tag ?? "all"}
                  aria-pressed={pressed}
                  onClick={() => select(tag)}
                  className={cn(
                    "h-10 cursor-pointer rounded-full border px-4 font-sans text-sm font-medium transition-colors",
                    pressed
                      ? "border-brand-ink bg-brand-ink text-white"
                      : "border-brand-slate-200 bg-white text-brand-ink hover:border-brand-slate-300",
                  )}
                >
                  {tag ? BLOG_TAG_LABELS[tag] : "All"}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <p className="mt-4 mb-0 text-sm text-brand-slate-500" role="status">
        {status}
      </p>
      <ul className="swipe-row m-0 mt-6 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((post, i) => (
          <li key={post.slug}>
            <BlogCard post={post} index={i} />
          </li>
        ))}
      </ul>
      {visible.length === 0 && (
        <p className="m-0 mt-6 rounded-[20px] bg-white p-8 text-center text-muted-foreground">
          No posts with this tag yet.
        </p>
      )}
    </div>
  );
}
