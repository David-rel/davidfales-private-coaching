import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Private Soccer Training Mesa Gilbert AZ | Ages 8-16 | 1-on-1 & Small Group",
  description:
    "Private soccer training in Mesa and Gilbert, AZ. Expert 1-on-1 and small group coaching for ages 8-16 at local parks. Flexible scheduling, measurable progress. Text to start.",
  alternates: {
    canonical: "/mesa-gilbert-private-soccer-training",
  },
  openGraph: {
    type: "website",
    url: "/mesa-gilbert-private-soccer-training",
    title: "Private Soccer Training in Mesa & Gilbert, Arizona",
    description:
      "Expert private soccer coaching for youth players (ages 8-16) in Mesa and Gilbert. 1-on-1 and small group sessions at local East Valley parks.",
    siteName: "David's Soccer Training",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "David's Soccer Training - Mesa Gilbert Private Soccer Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Soccer Training Mesa Gilbert AZ | Youth Soccer Coach",
    description:
      "1-on-1 and small group soccer training for ages 8-16 in Mesa and Gilbert, AZ. Flexible scheduling at local parks.",
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
};

export default function MesaGilbertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
