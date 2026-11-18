/**
 * Minimal Contentful GraphQL Content API client.
 *
 * Only ever called from Astro frontmatter. The site is statically generated
 * (no SSR adapter), so these requests run once during
 * `astro build` and the results are baked into the HTML. Nothing here is
 * shipped to the browser or executed per request.
 */

interface ContentfulConfig {
  spaceId: string;
  accessToken: string;
  environment: string;
}

// `import.meta.env` covers `.env` files; `process.env` covers variables set in
// the build environment (e.g. Netlify site settings).
const nodeEnv = (
  globalThis as { process?: { env: Record<string, string | undefined> } }
).process?.env;

const readEnv = (key: string): string | undefined =>
  import.meta.env[key] ?? nodeEnv?.[key];

export function getContentfulConfig(): ContentfulConfig | null {
  const spaceId = readEnv("CONTENTFUL_SPACE_ID");
  const accessToken = readEnv("CONTENTFUL_DELIVERY_TOKEN");
  const environment = readEnv("CONTENTFUL_ENVIRONMENT") || "master";

  if (!spaceId || !accessToken) return null;

  return { spaceId, accessToken, environment };
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: {
    message: string;
    extensions?: { contentful?: { code?: string } };
  }[];
}

/**
 * A link to an unpublished or deleted entry. Contentful still returns the
 * rest of the data with that item as null, and the query modules skip nulls,
 * so this is not a reason to fail the build.
 */
const UNRESOLVABLE_LINK = "UNRESOLVABLE_LINK";

export async function contentfulQuery<T>(
  config: ContentfulConfig,
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const endpoint = `https://graphql.contentful.com/content/v1/spaces/${config.spaceId}/environments/${config.environment}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.accessToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(
      `[contentful] GraphQL request failed: ${response.status} ${response.statusText}`,
    );
  }

  const json = (await response.json()) as GraphQLResponse<T>;

  const errors = (json.errors ?? []).filter(
    (e) => e.extensions?.contentful?.code !== UNRESOLVABLE_LINK,
  );
  const skipped = (json.errors?.length ?? 0) - errors.length;
  if (skipped > 0) {
    console.warn(
      `[contentful] Skipped ${skipped} link(s) to unpublished entries.`,
    );
  }

  if (errors.length) {
    throw new Error(
      `[contentful] GraphQL errors: ${errors.map((e) => e.message).join("; ")}`,
    );
  }

  if (!json.data) {
    throw new Error("[contentful] GraphQL response contained no data");
  }

  return json.data;
}
