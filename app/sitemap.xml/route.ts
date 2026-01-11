import type { NextRequest } from "next/server";

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

export function GET(_req: NextRequest) {
  const today = toIsoDate(new Date());

  const urls: SitemapUrl[] = [
    {
      loc: `${SITE_URL}/`,
      lastmod: today,
      changefreq: "weekly",
      priority: 1.0,
    },
    // Add more pages here if you create them later:
    // { loc: `${SITE_URL}/pricing`, lastmod: today, changefreq: "monthly", priority: 0.7 },
  ];

  const xml = buildXml(urls);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
