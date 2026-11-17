import {
  BLOG_TAG_LABELS,
  formatPublishDate,
  type BlogPostSummary,
} from "../lib/blog";

interface Props {
  post: BlogPostSummary;
  headingLevel?: "h2" | "h3";
}

/**
 * Presentational card. Used statically on the homepage and inside the
 * BlogList island on /blog (so both share one markup).
 */
export default function BlogCard({ post, headingLevel = "h2" }: Props) {
  const Heading = headingLevel;
  const href = `/blog/${post.slug}`;

  return (
    <article className="c-blog-card">
      {post.heroImage && (
        <img
          className="c-blog-card__image"
          src={`${post.heroImage.url}?w=640&h=360&fit=fill&fm=webp`}
          alt={post.heroImage.alt}
          width={640}
          height={360}
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="c-blog-card__content">
        <time className="c-blog-card__date" dateTime={post.publishDate}>
          {formatPublishDate(post.publishDate)}
        </time>
        <Heading className="c-blog-card__title">
          <a className="c-blog-card__link" href={href}>
            {post.title}
          </a>
        </Heading>
        <p className="c-blog-card__description">{post.description}</p>
        {post.tags.length > 0 && (
          <ul className="c-blog-card__tags" aria-label="Tags">
            {post.tags.map((tag) => (
              <li className="c-blog-card__tag" key={tag}>
                {BLOG_TAG_LABELS[tag]}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
