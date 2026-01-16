"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PhotoListItem } from "@/app/types/gallery";

export default function FeaturedPhotos() {
  const [featuredPhotos, setFeaturedPhotos] = useState<PhotoListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gallery/featured")
      .then((res) => res.json())
      .then((data) => {
        setFeaturedPhotos(data.photos || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch featured photos:", error);
        setIsLoading(false);
      });
  }, []);

  // If loading or no featured photos, return null
  if (isLoading || featuredPhotos.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-12 border-t border-emerald-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Training Moments</h3>
        <Link
          href="/gallery"
          className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
        >
          View Gallery →
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {featuredPhotos.map((photo) => (
          <Link
            key={photo.id}
            href="/gallery"
            className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <img
              src={photo.image_url}
              alt={photo.alt_text}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-medium">{photo.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
