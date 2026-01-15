import type { NextRequest } from "next/server";
import { getPublishedPosts } from "@/app/lib/db/queries";

type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

type SitemapUrl = {
  loc: string;
  lastmod?: string;
  changefreq?: ChangeFreq;
  priority?: number;
};

const SITE_URL = "https://www.davidssoccertraining.com";

function toIsoDate(d: Date) {
  return d.toISOString().split("T")[0];
}

function buildXml(urls: SitemapUrl[]) {
  const items = urls
    .map((u) => {
      const parts = [
        `<loc>${u.loc}</loc>`,
        u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : "",
        u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : "",
        typeof u.priority === "number"
          ? `<priority>${u.priority}</priority>`
          : "",
      ]
        .filter(Boolean)
        .join("");

      return `<url>${parts}</url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

export async function GET(_req: NextRequest) {
  const today = toIsoDate(new Date());

  // Get all published blog posts
  const posts = await getPublishedPosts(1000, 0);

  const urls: SitemapUrl[] = [
    {
      loc: `${SITE_URL}/`,
      lastmod: today,
      changefreq: "weekly",
      priority: 1.0,
    },
    {
      loc: `${SITE_URL}/blog`,
      lastmod: today,
      changefreq: "daily",
      priority: 0.8,
    },
    // Add all blog posts
    ...posts.map((post) => ({
      loc: `${SITE_URL}/blog/${post.slug}`,
      lastmod: toIsoDate(new Date(post.published_at!)),
      changefreq: "monthly" as ChangeFreq,
      priority: 0.7,
    })),
  ];

  const xml = buildXml(urls);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
