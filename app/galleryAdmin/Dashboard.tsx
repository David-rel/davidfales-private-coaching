"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Photo } from "@/app/types/gallery";

export default function GalleryAdminDashboard() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/gallery/photos?admin=true");
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/gallery/photos/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchPhotos();
      } else {
        alert("Failed to delete photo");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("Failed to delete photo");
    }
  };

  const handleUnpublish = async (id: string, title: string) => {
    if (!confirm(`Unpublish "${title}"? It will be hidden from the gallery.`))
      return;

    try {
      const res = await fetch(`/api/gallery/photos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: false }),
      });

      if (res.ok) {
        fetchPhotos();
      } else {
        alert("Failed to unpublish photo");
      }
    } catch (error) {
      console.error("Error unpublishing photo:", error);
      alert("Failed to unpublish photo");
    }
  };

  const filteredPhotos = photos.filter((photo) => {
    if (filter === "published") return photo.published;
    if (filter === "drafts") return !photo.published;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600">Loading photos...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gallery Photos</h1>
        <Link
          href="/galleryAdmin/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          + New Photo
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-300">
        <button
          onClick={() => setFilter("all")}
          className={`pb-3 px-4 font-medium transition-colors ${
            filter === "all"
              ? "border-b-2 border-emerald-600 text-emerald-600"
              : "text-gray-600 hover:text-emerald-600"
          }`}
        >
          All ({photos.length})
        </button>
        <button
          onClick={() => setFilter("published")}
          className={`pb-3 px-4 font-medium transition-colors ${
            filter === "published"
              ? "border-b-2 border-emerald-600 text-emerald-600"
              : "text-gray-600 hover:text-emerald-600"
          }`}
        >
          Published ({photos.filter((p) => p.published).length})
        </button>
        <button
          onClick={() => setFilter("drafts")}
          className={`pb-3 px-4 font-medium transition-colors ${
            filter === "drafts"
              ? "border-b-2 border-emerald-600 text-emerald-600"
              : "text-gray-600 hover:text-emerald-600"
          }`}
        >
          Drafts ({photos.filter((p) => !p.published).length})
        </button>
      </div>

      {/* Photos grid */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-200 p-12 text-center">
          <p className="text-gray-600 mb-4">No photos found</p>
          <Link
            href="/galleryAdmin/new"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Upload your first photo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="relative bg-white rounded-lg shadow-lg border-2 border-emerald-200 overflow-hidden group"
            >
              {photo.featured && (
                <div className="absolute left-2 top-2 z-10 rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white shadow">
                  Featured
                </div>
              )}

              <img
                src={photo.image_url}
                alt={photo.alt_text}
                className="w-full h-48 object-cover"
              />

              <div className="p-3">
                <h3 className="font-medium text-gray-900 truncate">
                  {photo.title}
                </h3>
                <div className="text-sm text-gray-600 mt-1">
                  {photo.published ? (
                    <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs">
                      Published
                    </span>
                  ) : (
                    <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                      Draft
                    </span>
                  )}
                  {photo.category && (
                    <span className="ml-2 text-xs text-gray-500">
                      {photo.category}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  {photo.published && (
                    <Link
                      href={`/gallery/${photo.slug}`}
                      target="_blank"
                      className="text-emerald-600 hover:text-emerald-700 text-xs font-medium"
                    >
                      View
                    </Link>
                  )}
                  <Link
                    href={`/galleryAdmin/edit/${photo.id}`}
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                  >
                    Edit
                  </Link>
                  {photo.published && (
                    <button
                      onClick={() => handleUnpublish(photo.id, photo.title)}
                      className="text-orange-600 hover:text-orange-700 text-xs font-medium"
                    >
                      Unpublish
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(photo.id, photo.title)}
                    className="text-red-600 hover:text-red-700 text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
