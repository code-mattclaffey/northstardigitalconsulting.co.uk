import { Marked } from "marked";
import {
  createCssVariablesTheme,
  createHighlighter,
  type BundledLanguage,
  type Highlighter,
} from "shiki";

/**
 * Markdown to HTML for Contentful long-form fields, with build-time syntax
 * highlighting from Shiki (the highlighter Astro ships with). No JS reaches
 * the browser.
 *
 * Token colours come from CSS custom properties (`--shiki-*`), so the code
 * theme is set in CSS alongside the rest of the site theme. See
 * `_components.blog.css`.
 */

const theme = createCssVariablesTheme({
  name: "nd-code",
  variablePrefix: "--shiki-",
  fontStyle: true,
});

/** Languages we load. Fenced blocks with any other label render as plain text. */
const LANGUAGES = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "html",
  "css",
  "scss",
  "json",
  "yaml",
  "bash",
  "sql",
  "markdown",
] as const satisfies readonly BundledLanguage[];

const ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  yml: "yaml",
  md: "markdown",
};

let highlighter: Promise<Highlighter> | undefined;

function getHighlighter(): Promise<Highlighter> {
  highlighter ??= createHighlighter({
    themes: [theme],
    langs: [...LANGUAGES],
  });
  return highlighter;
}

function resolveLang(hl: Highlighter, raw: string | undefined): string {
  const name = (raw ?? "").trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  const lang = ALIASES[name] ?? name;
  return hl.getLoadedLanguages().includes(lang) ? lang : "text";
}

/** Render trusted, owner-authored Markdown to HTML at build time. */
export async function renderMarkdown(markdown: string): Promise<string> {
  const hl = await getHighlighter();
  const marked = new Marked({
    renderer: {
      code({ text, lang }) {
        const language = resolveLang(hl, lang);
        return hl.codeToHtml(text, {
          lang: language,
          theme: "nd-code",
          transformers: [
            {
              pre(node) {
                node.properties["data-language"] = language;
              },
            },
          ],
        });
      },
    },
  });
  return marked.parse(markdown, { async: false });
}
