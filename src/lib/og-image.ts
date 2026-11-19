import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { BLOG_TAG_LABELS, type BlogPost } from "./blog";

/**
 * Build-time Open Graph cards (1200x630) for blog posts.
 *
 * Same design as `public/og-blog.jpg` (see scripts/og/render-og.mjs), drawn
 * with satori + resvg so it runs on Netlify without a browser.
 */

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export interface OgCard {
  /** Text in the pill above the heading, e.g. "Case study". */
  eyebrow: string;
  heading: string;
  /** Line under "Matt Claffey". */
  footer?: string;
}

// Builds run from the repo root; import.meta.url points into dist/ once bundled.
const read = (path: string) => readFileSync(join(process.cwd(), path));
const dataUri = (path: string, type: string) =>
  `data:${type};base64,${read(path).toString("base64")}`;

let assets:
  | {
      fonts: { name: string; data: Buffer; weight: 400 | 500 | 600 }[];
      logo: string;
      photo: string;
    }
  | undefined;

/** Fonts, logo and photo, loaded once per build. */
function loadAssets() {
  if (assets) return assets;

  // satori reads woff but not woff2.
  const font = (weight: 400 | 500 | 600) => ({
    name: "Poppins",
    weight,
    data: read(
      `node_modules/@fontsource/poppins/files/poppins-latin-${weight}-normal.woff`,
    ),
  });

  // Pull the logo SVG out of Logo.astro so the card always matches the site.
  const source = read("src/components/Logo.astro").toString("utf8");
  const svg = source
    .slice(source.indexOf("<svg"), source.indexOf("</svg>") + 6)
    .replace(/class:list=\{[^}]*\}/, "")
    .replace(/style=\{`[^`]*`\}/, "")
    .replace(/aria-hidden="true"|focusable="false"/g, "")
    .replaceAll("var(--logo-mark)", "#7fa4ee")
    .replaceAll("var(--logo-text)", "#ffffff");

  assets = {
    fonts: [font(400), font(500), font(600)],
    logo: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
    photo: dataUri("src/assets/matt-claffey.jpg", "image/jpeg"),
  };
  return assets;
}

type Style = Record<string, string | number>;
interface Node {
  type: string;
  props: { style?: Style; children?: Child | Child[]; [key: string]: unknown };
}
type Child = Node | string;

const h = (
  type: string,
  style: Style,
  children?: Child | Child[],
  attrs: Record<string, unknown> = {},
): Node => ({ type, props: { ...attrs, style, children } });

/** Long titles get a smaller heading so they stay within three lines. */
export function headingSize(heading: string): number {
  if (heading.length > 90) return 50;
  if (heading.length > 65) return 56;
  return 64;
}

const glow = (background: string) =>
  h("div", {
    position: "absolute",
    top: 0,
    left: 0,
    width: OG_WIDTH,
    height: OG_HEIGHT,
    backgroundImage: background,
  });

function card(
  { eyebrow, heading, footer }: Required<OgCard>,
  a: ReturnType<typeof loadAssets>,
) {
  return h(
    "div",
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      display: "flex",
      position: "relative",
      fontFamily: "Poppins",
      color: "#ffffff",
      backgroundColor: "#0c101b",
    },
    [
      glow(
        "radial-gradient(42% 48% at 6% 98%, rgba(30,26,105,0.95) 0%, rgba(12,16,27,0) 70%)",
      ),
      glow(
        "radial-gradient(70% 60% at 50% 110%, rgba(127,164,238,0.6) 0%, rgba(91,134,229,0.24) 38%, rgba(12,16,27,0) 70%)",
      ),
      glow(
        "radial-gradient(40% 50% at 92% 100%, rgba(124,108,240,0.55) 0%, rgba(12,16,27,0) 70%)",
      ),
      h(
        "div",
        {
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          flexDirection: "column",
          width: OG_WIDTH,
          height: OG_HEIGHT,
          boxSizing: "border-box",
          padding: "64px 72px 60px",
        },
        [
          h("img", { width: 330, height: 58 }, undefined, {
            src: a.logo,
            width: 330,
            height: 58,
          }),
          h(
            "div",
            {
              display: "flex",
              alignSelf: "flex-start",
              marginTop: 52,
              padding: "8px 18px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.16)",
              backgroundColor: "rgba(255,255,255,0.06)",
              fontSize: 20,
              fontWeight: 500,
              color: "#c8d6f5",
            },
            eyebrow,
          ),
          h(
            "div",
            {
              display: "block",
              marginTop: 22,
              maxWidth: 1000,
              fontSize: headingSize(heading),
              lineHeight: 1.1,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineClamp: 3,
            },
            heading,
          ),
          h(
            "div",
            {
              position: "absolute",
              left: 72,
              right: 72,
              bottom: 60,
              display: "flex",
              alignItems: "center",
            },
            [
              h(
                "img",
                {
                  width: 64,
                  height: 64,
                  borderRadius: 999,
                  border: "3px solid rgba(255,255,255,0.18)",
                  marginRight: 18,
                },
                undefined,
                { src: a.photo, width: 64, height: 64 },
              ),
              h(
                "div",
                { display: "flex", flexDirection: "column", fontSize: 22 },
                [
                  h("div", { fontWeight: 600 }, "Matt Claffey"),
                  h("div", { color: "#a9b4c8", fontSize: 19 }, footer),
                ],
              ),
              h(
                "div",
                {
                  marginLeft: "auto",
                  fontSize: 20,
                  fontWeight: 500,
                  color: "#c8d6f5",
                },
                "northstardigitalconsulting.co.uk",
              ),
            ],
          ),
        ],
      ),
    ],
  );
}

/** Renders a branded 1200x630 PNG. */
export async function renderOgImage(input: OgCard): Promise<Buffer> {
  const a = loadAssets();
  const svg = await satori(
    card(
      { footer: "Principal engineer, NorthStar Digital", ...input },
      a,
    ) as never,
    { width: OG_WIDTH, height: OG_HEIGHT, fonts: a.fonts },
  );
  return new Resvg(svg, { fitTo: { mode: "width", value: OG_WIDTH } })
    .render()
    .asPng();
}

/** Pill text: "Case study" for case studies, else the first tag, else "Blog". */
export function ogEyebrow(post: Pick<BlogPost, "tags">): string {
  if (post.tags.includes("case-study")) return BLOG_TAG_LABELS["case-study"];
  const [first] = post.tags;
  return first ? BLOG_TAG_LABELS[first] : "Blog";
}
