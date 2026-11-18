// Renders the Open Graph images in public/ from the site's brand assets.
// Run with: node scripts/og/render-og.mjs (needs Playwright with Chromium).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

// Playwright is not a project dependency: use a global install if there is one.
const { chromium } = createRequire(import.meta.url)("playwright");

const root = fileURLToPath(new URL("../../", import.meta.url));
const read = (path, enc) => readFileSync(root + path, enc);
const dataUri = (path, type) =>
  `data:${type};base64,${read(path).toString("base64")}`;

// Pull the logo SVG out of Logo.astro so the image always matches the site.
const logoSource = read("src/components/Logo.astro", "utf8");
const logo = logoSource
  .slice(logoSource.indexOf("<svg"), logoSource.indexOf("</svg>") + 6)
  .replace(/class:list=\{[^}]*\}/, "")
  .replace(/style=\{`[^`]*`\}/, 'style="width:330px;height:58px"')
  .replaceAll("var(--logo-mark)", "#7fa4ee")
  .replaceAll("var(--logo-text)", "#ffffff");

const font = (weight) =>
  `@font-face{font-family:Poppins;font-weight:${weight};src:url(${dataUri(
    `node_modules/@fontsource/poppins/files/poppins-latin-${weight}-normal.woff2`,
    "font/woff2",
  )}) format("woff2")}`;

const photo = dataUri("src/assets/matt-claffey.png", "image/png");

const page = ({ eyebrow, heading, footer }) => `<!doctype html>
<html><head><style>
${font(400)}${font(500)}${font(600)}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;font-family:Poppins,sans-serif;color:#fff;background:#0c101b;position:relative}
.glow{position:absolute;inset:0}
.g1{background:radial-gradient(70% 60% at 50% 110%,rgb(127 164 238/.6) 0%,rgb(91 134 229/.24) 38%,rgb(12 16 27/0) 70%)}
.g2{background:radial-gradient(40% 50% at 92% 100%,rgb(124 108 240/.55) 0%,rgb(12 16 27/0) 70%)}
.g3{background:radial-gradient(42% 48% at 6% 98%,rgb(30 26 105/.95) 0%,rgb(12 16 27/0) 70%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgb(255 255 255/.035) 1px,transparent 1px),linear-gradient(90deg,rgb(255 255 255/.035) 1px,transparent 1px);background-size:60px 60px;mask-image:linear-gradient(to bottom,#000,transparent 85%)}
.wrap{position:relative;height:100%;padding:64px 72px 60px;display:flex;flex-direction:column}
.pill{align-self:flex-start;margin-top:52px;padding:8px 18px;border-radius:999px;border:1px solid rgb(255 255 255/.16);background:rgb(255 255 255/.06);font-size:20px;font-weight:500;color:#c8d6f5}
h1{margin-top:22px;font-size:64px;line-height:1.08;font-weight:600;letter-spacing:-.03em;max-width:960px}
.foot{margin-top:auto;display:flex;align-items:center;gap:18px}
.foot img{width:64px;height:64px;border-radius:50%;box-shadow:0 0 0 3px rgb(255 255 255/.18)}
.who{display:flex;flex-direction:column;font-size:22px}
.who b{font-weight:600}.who span{color:#a9b4c8;font-size:19px}
.url{margin-left:auto;font-size:20px;font-weight:500;color:#c8d6f5}
</style></head><body>
<div class="glow g3"></div><div class="glow g1"></div><div class="glow g2"></div><div class="grid"></div>
<div class="wrap">
  ${logo}
  <span class="pill">${eyebrow}</span>
  <h1>${heading}</h1>
  <div class="foot">
    <img src="${photo}" alt="">
    <div class="who"><b>Matt Claffey</b><span>${footer}</span></div>
    <span class="url">northstardigitalconsulting.co.uk</span>
  </div>
</div></body></html>`;

const images = [
  {
    file: "public/og-image.jpg",
    eyebrow: "Lead Software Engineer · Full Stack TypeScript",
    heading: "Technical leadership, built on engineering excellence.",
    footer: "Founder, NorthStar Digital Consulting",
  },
  {
    file: "public/og-blog.jpg",
    eyebrow: "Blog",
    heading: "Frontend architecture, leadership and AI-enabled delivery.",
    footer: "Principal engineer, NorthStar Digital",
  },
];

const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const { file, ...copy } of images) {
  await tab.setContent(page(copy));
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: root + file, type: "jpeg", quality: 90 });
  console.log(`wrote ${file}`);
}
await browser.close();
