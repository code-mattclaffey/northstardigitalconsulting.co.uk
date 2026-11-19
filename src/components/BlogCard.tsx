import { Badge } from "@/components/ui/badge";
import { cardClass } from "@/components/ui/card";
import {
  BLOG_TAG_LABELS,
  formatPublishDate,
  type BlogPostSummary,
} from "@/lib/blog";
import { cn } from "@/lib/utils";
import PostArt from "./PostArt";

interface Props {
  post: BlogPostSummary;
  headingLevel?: "h2" | "h3";
  /** Index in the list, used to vary the placeholder artwork. */
  index?: number;
}

const ART = ["bg-art-2", "bg-art-1", "bg-art-3"];

/**
 * Post card on the light blog page. Rendered inside the BlogList island and
 * in related posts on post pages, so both share one markup.
 */
export default function BlogCard({
  post,
  headingLevel = "h2",
  index = 0,
}: Props) {
  const Heading = headingLevel;
  const [firstTag] = post.tags;

  return (
    <article
      className={cn(
        cardClass,
        "light group relative h-full transition-shadow hover:shadow-[0_16px_40px_rgb(12_16_27/0.1)]",
      )}
    >
      {post.heroImage ? (
        <img
          className="h-[180px] w-full object-cover"
          src={`${post.heroImage.url}?w=640&h=360&fit=fill&fm=webp`}
          alt=""
          width={640}
          height={360}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <PostArt
          post={post}
          art={ART[index % ART.length]}
          className="h-[180px]"
        />
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {firstTag && <Badge>{BLOG_TAG_LABELS[firstTag]}</Badge>}
        <Heading className="m-0 text-[19px] leading-snug font-semibold">
          <a
            className="text-foreground no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-focus-within:underline"
            href={`/blog/${post.slug}`}
          >
            {post.title}
          </a>
        </Heading>
        <p className="m-0 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.description}
        </p>
        <time
          className="mt-auto pt-3 text-[13px] text-muted-foreground"
          dateTime={post.publishDate}
        >
          {formatPublishDate(post.publishDate)}
        </time>
      </div>
    </article>
  );
}
