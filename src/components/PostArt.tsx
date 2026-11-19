import type { BlogPostSummary } from "@/lib/blog";
import { cn } from "@/lib/utils";

interface Props {
  post: Pick<BlogPostSummary, "clientLogo">;
  /** Gradient utility, e.g. `bg-art-1`. */
  art: string;
  /** Size classes for the art area. */
  className?: string;
}

/**
 * Placeholder artwork for a post with no hero image: a brand gradient, with
 * the client's logo on a frosted glass tile when the post is a case study.
 * Used by the cards on the homepage and /blog so they share one markup.
 */
export default function PostArt({ post, art, className }: Props) {
  const logo = post.clientLogo;

  if (!logo) {
    return <div className={cn(art, className)} aria-hidden="true" />;
  }

  return (
    <div className={cn(art, "flex items-center justify-center p-6", className)}>
      <div className="flex max-w-[75%] items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-7 py-5 shadow-[0_10px_30px_rgb(0_0_0/0.25)] backdrop-blur-md">
        <img
          src={logo.src}
          alt={logo.alt}
          loading="lazy"
          decoding="async"
          className="w-auto max-w-full brightness-0 invert"
          style={{ height: `${logo.height}px` }}
        />
      </div>
    </div>
  );
}
