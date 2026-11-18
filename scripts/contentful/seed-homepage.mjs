#!/usr/bin/env node
/**
 * Creates (or updates) the `homepage` content type in Contentful and seeds a
 * single published Homepage entry from `src/data/homepage.json`.
 *
 * Idempotent: safe to re-run. Existing entry fields are overwritten with the
 * values in the JSON file, so only run it when the repo copy is the source of
 * truth (e.g. setting up a new space or environment).
 *
 * Usage:
 *   CONTENTFUL_SPACE_ID=xxx \
 *   CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-xxx \
 *   [CONTENTFUL_ENVIRONMENT=master] \
 *   [CONTENTFUL_LOCALE=en-US] \
 *   npm run contentful:seed
 */
import { readFile } from "node:fs/promises";

const {
  CONTENTFUL_SPACE_ID: spaceId,
  CONTENTFUL_MANAGEMENT_TOKEN: token,
  CONTENTFUL_ENVIRONMENT: environment = "master",
  CONTENTFUL_LOCALE: locale = "en-US",
} = process.env;

if (!spaceId || !token) {
  console.error(
    "CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN must be set.",
  );
  process.exit(1);
}

const CONTENT_TYPE_ID = "homepage";
const BASE = `https://api.contentful.com/spaces/${spaceId}/environments/${environment}`;

const urlPattern = {
  regexp: { pattern: "^(https?://|mailto:|/)", flags: "" },
  message: "Must start with https://, mailto: or /",
};

const field = (id, name, type, required, validations = []) => ({
  id,
  name,
  type,
  required,
  localized: false,
  validations,
});

const homepageContentType = {
  name: "Homepage",
  description:
    "Single entry holding the northstardigitalconsulting.co.uk homepage copy and SEO metadata. Fetched at build time via the GraphQL Content API.",
  displayField: "internalName",
  fields: [
    field("internalName", "Internal name", "Symbol", true, [{ unique: true }]),
    field("seoTitle", "SEO title", "Symbol", true, [{ size: { max: 90 } }]),
    field("seoDescription", "SEO description", "Text", true, [
      { size: { max: 200 } },
    ]),
    field("ogImageAlt", "Social share image alt text", "Symbol", false),
    field("heroHeading", "Hero heading", "Symbol", true),
    field("heroSubheading", "Hero subheading", "Symbol", false),
    field("heroBody", "Hero body", "Text", true),
    field("primaryCtaLabel", "Primary CTA label", "Symbol", true),
    field("primaryCtaUrl", "Primary CTA URL", "Symbol", true, [urlPattern]),
    field("secondaryCtaLabel", "Secondary CTA label", "Symbol", false),
    field("secondaryCtaUrl", "Secondary CTA URL", "Symbol", false, [
      urlPattern,
    ]),
    field("availabilityText", "Availability text", "Symbol", false),
    {
      ...field("sections", "Sections", "Array", false),
      items: {
        type: "Link",
        linkType: "Entry",
        validations: [{ linkContentType: ["pageSection"] }],
      },
    },
    field("currentContractExpiry", "Current contract expiry", "Date", false),
    {
      ...field(
        "highlightAvailability",
        "Highlight availability in the last month",
        "Boolean",
        false,
      ),
      defaultValue: { [locale]: true },
    },
  ],
};

async function cma(path, { method = "GET", body, version, headers = {} } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/vnd.contentful.management.v1+json",
      ...(version !== undefined && { "X-Contentful-Version": String(version) }),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 404 && method === "GET") return null;
  if (!res.ok) {
    throw new Error(
      `${method} ${path} failed: ${res.status} ${await res.text()}`,
    );
  }
  return res.status === 204 ? null : res.json();
}

async function upsertContentType() {
  const existing = await cma(`/content_types/${CONTENT_TYPE_ID}`);
  const saved = await cma(`/content_types/${CONTENT_TYPE_ID}`, {
    method: "PUT",
    body: homepageContentType,
    version: existing?.sys.version,
  });
  await cma(`/content_types/${CONTENT_TYPE_ID}/published`, {
    method: "PUT",
    version: saved.sys.version,
  });
  console.log(
    `${existing ? "Updated" : "Created"} and published content type "${CONTENT_TYPE_ID}".`,
  );
}

async function upsertEntry() {
  const seed = JSON.parse(
    await readFile(new URL("../../src/data/homepage.json", import.meta.url)),
  );

  const fields = { internalName: { [locale]: "Homepage" } };
  // `sections` links to pageSection entries, which are edited in Contentful
  // and not seeded. The local list in homepage.json is only the build fallback.
  for (const [key, value] of Object.entries(seed)) {
    if (key === "sections") continue;
    if (value !== null && value !== "") fields[key] = { [locale]: value };
  }

  const { items } = await cma(
    `/entries?content_type=${CONTENT_TYPE_ID}&limit=1`,
  );
  const existing = items[0];
  // Keep the section order editors set up; a PUT replaces every field.
  if (existing?.fields.sections) fields.sections = existing.fields.sections;

  const saved = existing
    ? await cma(`/entries/${existing.sys.id}`, {
        method: "PUT",
        body: { fields },
        version: existing.sys.version,
      })
    : await cma(`/entries`, {
        method: "POST",
        body: { fields },
        headers: { "X-Contentful-Content-Type": CONTENT_TYPE_ID },
      });

  await cma(`/entries/${saved.sys.id}/published`, {
    method: "PUT",
    version: saved.sys.version,
  });
  console.log(
    `${existing ? "Updated" : "Created"} and published Homepage entry ${saved.sys.id}.`,
  );
}

await upsertContentType();
await upsertEntry();
