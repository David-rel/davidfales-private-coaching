import type { Metadata } from "next";
import { getPhotoBySlug, getPublishedPhotos } from "@/app/lib/db/queries";
import MainHeader from "@/app/components/layout/MainHeader";
import MainFooter from "@/app/components/layout/MainFooter";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PhotoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PhotoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const photo = await getPhotoBySlug(slug);

  if (!photo) {
    return {
      title: "Photo Not Found",
    };
  }

  return {
    title: photo.meta_title || photo.title,
    description: photo.meta_description || photo.description || photo.alt_text,
    openGraph: {
      title: photo.meta_title || photo.title,
      description:
        photo.meta_description || photo.description || photo.alt_text,
      images: [photo.image_url],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: photo.meta_title || photo.title,
      description:
        photo.meta_description || photo.description || photo.alt_text,
      images: [photo.image_url],
    },
  };
}

export default async function PhotoPage({ params }: PhotoPageProps) {
  const { slug } = await params;
  const photo = await getPhotoBySlug(slug);

  if (!photo) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <MainHeader />

      {/* Photo Detail */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Link
          href="/gallery"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium mb-6"
        >
          ← Back to Gallery
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-200 overflow-hidden">
          <img
            src={photo.image_url}
            alt={photo.alt_text}
            className="w-full h-auto"
          />

          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              {photo.featured && (
                <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              )}
              {photo.category && (
                <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {photo.category}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {photo.title}
            </h1>

            {photo.description && (
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {photo.description}
              </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 border-t border-gray-200 pt-6">
              {photo.photographer && (
                <div>
                  <span className="font-medium text-gray-900">
                    Photographer:
                  </span>{" "}
                  {photo.photographer}
                </div>
              )}
              {photo.location && (
                <div>
                  <span className="font-medium text-gray-900">Location:</span>{" "}
                  {photo.location}
                </div>
              )}
              {photo.photo_date && (
                <div>
                  <span className="font-medium text-gray-900">Date:</span>{" "}
                  {new Date(photo.photo_date).toLocaleDateString()}
                </div>
              )}
            </div>

            {photo.keywords && photo.keywords.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <span className="font-medium text-gray-900 text-sm">
                  Tags:{" "}
                </span>
                {photo.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-block bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs mr-2 mt-2"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <MainFooter />
    </div>
  );
}
