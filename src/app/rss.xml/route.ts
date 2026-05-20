import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jiangtaibai1.github.io";

function escapeXml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export function GET() {
    const posts = getAllPosts();
    const items = posts
        .map((post) => {
            const url = `${siteUrl}/blog/${post.slug}/`;

            return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
        })
        .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>JiangTaibai</title>
    <link>${siteUrl}</link>
    <description>全栈开发、独立网站/小程序性开发与技术分享内容订阅源。</description>
    <language>zh-CN</language>
    ${items}
  </channel>
</rss>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
        },
    });
}