import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Group Soccer Sessions | Upcoming Sessions and Signup",
  description:
    "Browse upcoming group soccer sessions, view session details, complete player signup, and checkout online.",
  alternates: {
    canonical: "/group-sessions",
  },
  openGraph: {
    type: "website",
    url: "/group-sessions",
    title: "Group Soccer Sessions | David's Soccer Training",
    description:
      "Train in a competitive team setting with high-level technical coaching. Browse upcoming sessions and sign up online.",
    siteName: "David's Soccer Training",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "David's Soccer Training Group Sessions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Group Soccer Sessions | Sign Up Online",
    description:
      "View upcoming group sessions, enter player details, and checkout online.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GroupSessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
