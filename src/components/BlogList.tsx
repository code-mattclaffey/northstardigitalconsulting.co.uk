import { useEffect, useState } from "react";
import {
  BLOG_TAG_LABELS,
  type BlogPostSummary,
  type BlogTag,
} from "../lib/blog";
import BlogCard from "./BlogCard";

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

  return (
    <div className="c-blog-list">
      {tags.length > 0 && (
        <div
          className="c-blog-list__filters"
          role="group"
          aria-label="Filter posts by tag"
        >
          {[null, ...tags].map((tag) => (
            <button
              type="button"
              key={tag ?? "all"}
              className={`c-blog-list__filter${tag === activeTag ? " c-blog-list__filter--active" : ""}`}
              aria-pressed={tag === activeTag}
              onClick={() => select(tag)}
            >
              {tag ? BLOG_TAG_LABELS[tag] : "All"}
            </button>
          ))}
        </div>
      )}
      <p className="c-blog-list__status e-body-text--small" role="status">
        {status}
      </p>
      <ul className="c-blog-list__items">
        {visible.map((post) => (
          <li className="c-blog-list__item" key={post.slug}>
            <BlogCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
