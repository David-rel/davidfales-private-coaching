"use client";

import { useState } from "react";
import PhotoCard from "./PhotoCard";
import Lightbox from "./Lightbox";
import { PhotoListItem } from "@/app/types/gallery";

interface PhotoGridProps {
  photos: PhotoListItem[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="masonry-grid">
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onClick={() => setLightboxIndex(index)}
          />
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}

      <style jsx>{`
        .masonry-grid {
          column-count: 2;
          column-gap: 1.5rem;
        }

        .masonry-grid > * {
          break-inside: avoid;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) {
          .masonry-grid {
            column-count: 3;
          }
        }

        @media (min-width: 1024px) {
          .masonry-grid {
            column-count: 4;
          }
        }
      `}</style>
    </>
  );
}
