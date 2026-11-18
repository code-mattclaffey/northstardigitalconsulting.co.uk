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
  /** Ordered page sections. Empty or missing uses DEFAULT_SECTIONS. */
  sections: PageSection[];
  /** ISO date the current contract ends. */
  currentContractExpiry: string | null;
  /** Make the contact CTAs stand out in the last month before expiry. */
  highlightAvailability: boolean | null;
}

export const SECTION_COMPONENTS = [
  "hero",
  "services",
  "availabilityCta",
  "about",
  "caseStudies",
  "testimonials",
] as const;
export type SectionComponent = (typeof SECTION_COMPONENTS)[number];
export type SectionBackground = "dark" | "light";

/** One `pageSection` entry: which component to show and on what background. */
export interface PageSection {
  component: SectionComponent;
  background: SectionBackground;
  eyebrow: string | null;
  heading: string | null;
  lead: string | null;
}

/** Used when the homepage entry has no sections, so the page never renders empty. */
export const DEFAULT_SECTIONS: PageSection[] = SECTION_COMPONENTS.map(
  (component) => ({
    component,
    background: "dark",
    eyebrow: null,
    heading: null,
    lead: null,
  }),
);

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
        currentContractExpiry
        highlightAvailability
        sectionsCollection(limit: 20) {
          items {
            component
            background
            eyebrow
            heading
            lead
          }
        }
      }
    }
  }
`;

type HomepageEntry = Omit<HomepageContent, "sections"> & {
  sectionsCollection: { items: (Partial<PageSection> | null)[] } | null;
};

interface HomepageQueryResult {
  homepageCollection: { items: (HomepageEntry | null)[] };
}

/** Drops unpublished or unknown sections and fills in defaults. */
function toSections(
  items: (Partial<PageSection> | null)[] | undefined,
): PageSection[] {
  const sections = (items ?? []).flatMap((item) =>
    item?.component && SECTION_COMPONENTS.includes(item.component)
      ? [
          {
            component: item.component,
            background: item.background === "light" ? "light" : "dark",
            eyebrow: item.eyebrow ?? null,
            heading: item.heading ?? null,
            lead: item.lead ?? null,
          } satisfies PageSection,
        ]
      : [],
  );
  return sections.length > 0 ? sections : DEFAULT_SECTIONS;
}

/**
 * Local copy of the homepage content, kept in `src/data/homepage.json`. Used
 * when Contentful credentials are not configured (e.g. a fresh local checkout)
 * so the site still builds, and as the source for
 * `scripts/contentful/seed-homepage.mjs`.
 */
export const fallbackHomepage: HomepageContent = {
  ...homepageSeed,
  sections: toSections(homepageSeed.sections as Partial<PageSection>[]),
};

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
  const { sectionsCollection, ...rest } = entry;
  return { ...rest, sections: toSections(sectionsCollection?.items) };
}

/** Fetches the homepage once per build, however many components ask for it. */
export function getHomepage(): Promise<HomepageContent> {
  cached ??= fetchHomepage();
  return cached;
}
