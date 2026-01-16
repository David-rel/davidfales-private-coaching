import type { Metadata } from "next";
import { getPublishedPhotos } from "@/app/lib/db/queries";
import MainHeader from "@/app/components/layout/MainHeader";
import MainFooter from "@/app/components/layout/MainFooter";
import PhotoGrid from "@/app/components/gallery/PhotoGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Soccer training photos and moments from David Fales",
};

// Force dynamic rendering to prevent static caching of photos
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const photos = await getPublishedPhotos(100, 0);

  return (
    <div className="min-h-screen bg-white">
      <MainHeader />

      {/* Gallery Header */}
      <div className="bg-gradient-to-b from-emerald-50 to-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Training Gallery
          </h1>
          <p className="text-xl text-gray-600">
            Moments from our soccer training sessions
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-6 py-12">
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No photos yet. Check back soon!
            </p>
          </div>
        ) : (
          <PhotoGrid photos={photos} />
        )}
      </div>

      <MainFooter />
    </div>
  );
}
