import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const SITE_URL = "https://www.davidsoccertraining.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "David’s Soccer Training | Private Soccer Training in Gilbert & Mesa",
    template: "%s | David’s Soccer Training",
  },
  description:
    "Private soccer training in Gilbert and Mesa for ages 8–16. 1-on-1 and small group sessions with clear goals, progress tracking, and flexible scheduling by text.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "David’s Soccer Training",
    description:
      "Private soccer training in Gilbert and Mesa for ages 8–16. 1-on-1 and small group sessions. Schedule by text.",
    siteName: "David’s Soccer Training",
    // Add an image once you have a clean square logo or action photo
    // images: [{ url: "/og.png", width: 1200, height: 630, alt: "David’s Soccer Training" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "David’s Soccer Training",
    description:
      "Private soccer training in Gilbert and Mesa for ages 8–16. 1-on-1 and small group sessions. Schedule by text.",
    // images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/newicon.png",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "David’s Soccer Training",
  url: SITE_URL,
  areaServed: ["Gilbert, AZ", "Mesa, AZ", "East Valley, AZ"],
  description:
    "Private soccer training in Gilbert and Mesa for ages 8–16. 1-on-1 and small group sessions scheduled by text.",
  telephone: "+17206122979",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
