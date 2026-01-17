import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const SITE_URL = "https://www.davidssoccertraining.com";

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
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "David’s Soccer Training",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "David’s Soccer Training",
    description:
      "Private soccer training in Gilbert and Mesa for ages 8–16. 1-on-1 and small group sessions. Schedule by text.",
    images: ["/icon.png"],
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
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
