import { getAllPosts } from "@/lib/posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_TITLE = "Blog của tôi";
const SITE_DESCRIPTION = "Blog về công nghệ, lập trình và những điều thú vị.";

export async function GET() {
  const posts = getAllPosts().slice(0, 20);

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const date = new Date(post.date).toUTCString();
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${post.summary}]]></description>
      <pubDate>${date}</pubDate>
      ${post.tags.map((t) => `<category><![CDATA[${t}]]></category>`).join("\n      ")}
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${SITE_TITLE}]]></title>
    <link>${SITE_URL}</link>
    <description><![CDATA[${SITE_DESCRIPTION}]]></description>
    <language>vi</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
