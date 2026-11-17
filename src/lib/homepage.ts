import homepageSeed from "../data/homepage.json";
import { contentfulQuery, getContentfulConfig } from "./contentful";

/** Shape of the `homepage` content type in Contentful. */
export interface HomepageContent {
  seoTitle: string;
  seoDescription: string;
  ogImageAlt: string | null;
  heroHeading: string;
  heroSubheading: string | null;
  heroBody: string;
  primaryCtaLabel: string;
  primaryCtaUrl: string;
  secondaryCtaLabel: string | null;
  secondaryCtaUrl: string | null;
  availabilityText: string | null;
}

const HOMEPAGE_QUERY = /* GraphQL */ `
  query Homepage {
    homepageCollection(limit: 1) {
      items {
        seoTitle
        seoDescription
        ogImageAlt
        heroHeading
        heroSubheading
        heroBody
        primaryCtaLabel
        primaryCtaUrl
        secondaryCtaLabel
        secondaryCtaUrl
        availabilityText
      }
    }
  }
`;

interface HomepageQueryResult {
  homepageCollection: { items: (HomepageContent | null)[] };
}

/**
 * Local copy of the homepage content, kept in `src/data/homepage.json`. Used
 * when Contentful credentials are not configured (e.g. a fresh local checkout)
 * so the site still builds, and as the source for
 * `scripts/contentful/seed-homepage.mjs`.
 */
export const fallbackHomepage: HomepageContent = homepageSeed;

let cached: Promise<HomepageContent> | undefined;

async function fetchHomepage(): Promise<HomepageContent> {
  const config = getContentfulConfig();

  if (!config) {
    console.warn(
      "[contentful] CONTENTFUL_SPACE_ID / CONTENTFUL_DELIVERY_TOKEN not set. Using local fallback homepage content.",
    );
    return fallbackHomepage;
  }

  const data = await contentfulQuery<HomepageQueryResult>(
    config,
    HOMEPAGE_QUERY,
  );
  const entry = data.homepageCollection.items[0];

  // Credentials are configured, so a missing entry is a real problem: fail the
  // build rather than silently deploying stale copy.
  if (!entry) {
    throw new Error(
      "[contentful] No published `homepage` entry found. Publish one in Contentful or run `npm run contentful:seed`.",
    );
  }

  console.info("[contentful] Homepage content loaded from Contentful.");
  return entry;
}

/** Fetches the homepage once per build, however many components ask for it. */
export function getHomepage(): Promise<HomepageContent> {
  cached ??= fetchHomepage();
  return cached;
}
