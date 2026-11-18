import testimonialsSeed from "../data/testimonials.json";
import { contentfulQuery, getContentfulConfig } from "./contentful";

/** Shape of the `testimonial` content type in Contentful. */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string | null;
  /** Placeholder quote: shown with a "Sample" label until real ones land. */
  isSample: boolean;
}

const TESTIMONIALS_QUERY = /* GraphQL */ `
  query Testimonials {
    testimonialCollection(order: order_ASC, limit: 20) {
      items {
        quote
        name
        role
        company
        isSample
      }
    }
  }
`;

interface RawTestimonial {
  quote: string | null;
  name: string | null;
  role: string | null;
  company: string | null;
  isSample: boolean | null;
}

interface TestimonialsQueryResult {
  testimonialCollection: { items: (RawTestimonial | null)[] };
}

export const fallbackTestimonials: Testimonial[] = testimonialsSeed;

async function fetchTestimonials(): Promise<Testimonial[]> {
  const config = getContentfulConfig();

  if (!config) {
    console.warn(
      "[contentful] CONTENTFUL_SPACE_ID / CONTENTFUL_DELIVERY_TOKEN not set. Using local fallback testimonials.",
    );
    return fallbackTestimonials;
  }

  const data = await contentfulQuery<TestimonialsQueryResult>(
    config,
    TESTIMONIALS_QUERY,
  );

  const testimonials = data.testimonialCollection.items.flatMap((item) =>
    item?.quote && item.name && item.role
      ? [
          {
            quote: item.quote,
            name: item.name,
            role: item.role,
            company: item.company || null,
            isSample: Boolean(item.isSample),
          },
        ]
      : [],
  );

  console.info(`[contentful] ${testimonials.length} testimonial(s) loaded.`);
  return testimonials;
}

let cached: Promise<Testimonial[]> | undefined;

/** Testimonials in display order, fetched once per build. May be empty. */
export function getTestimonials(): Promise<Testimonial[]> {
  cached ??= fetchTestimonials();
  return cached;
}

/** "Head of Engineering" -> "HE", "CTO" -> "CT". Lowercase words are skipped. */
export function initials(text: string): string {
  const words = text.split(/\s+/).filter((word) => /^[A-Z]/.test(word));
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}
