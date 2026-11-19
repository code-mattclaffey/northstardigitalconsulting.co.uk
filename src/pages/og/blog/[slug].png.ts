import type { APIRoute, GetStaticPaths } from "astro";
import { getBlogPosts, type BlogPost } from "@/lib/blog";
import { ogEyebrow, renderOgImage } from "@/lib/og-image";

// One share card per post, written to dist/og/blog/<slug>.png at build time.
export const getStaticPaths = (async () => {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: BlogPost };
  const png = await renderOgImage({
    eyebrow: ogEyebrow(post),
    heading: post.title,
  });
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
