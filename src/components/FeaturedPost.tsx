import { Badge } from "@/components/ui/badge";
import {
  BLOG_TAG_LABELS,
  formatPublishDate,
  type BlogPostSummary,
} from "@/lib/blog";

interface Props {
  post: BlogPostSummary;
}

/** Large card for the first post in the current /blog filter. */
export default function FeaturedPost({ post }: Props) {
  const [firstTag] = post.tags;

  return (
    <article className="light group relative grid grid-cols-1 overflow-hidden rounded-[28px] border border-border bg-white text-foreground transition-shadow hover:shadow-[0_16px_40px_rgb(12_16_27/0.1)] md:grid-cols-2">
      {post.heroImage ? (
        <img
          src={`${post.heroImage.url}?w=1200&h=760&fit=fill&fm=webp`}
          alt=""
          width={1200}
          height={760}
          className="h-full min-h-[220px] w-full object-cover md:min-h-[320px]"
        />
      ) : (
        <div
          className="bg-art-1 min-h-[220px] md:min-h-[320px]"
          aria-hidden="true"
        />
      )}
      <div className="flex flex-col justify-center gap-3.5 p-6 md:p-10">
        <span className="flex flex-wrap gap-2">
          <Badge>Featured</Badge>
          {firstTag && (
            <Badge variant="secondary">{BLOG_TAG_LABELS[firstTag]}</Badge>
          )}
        </span>
        <h2 className="m-0 text-2xl leading-tight font-semibold tracking-[-0.01em] md:text-[32px]">
          <a
            href={`/blog/${post.slug}`}
            className="text-foreground no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-focus-within:underline"
          >
            {post.title}
          </a>
        </h2>
        <p className="m-0 text-base leading-relaxed text-muted-foreground">
          {post.description}
        </p>
        <span className="text-[13px] text-muted-foreground">
          <time dateTime={post.publishDate}>
            {formatPublishDate(post.publishDate)}
          </time>
          {` · ${post.readingMinutes} min read`}
        </span>
      </div>
    </article>
  );
}
