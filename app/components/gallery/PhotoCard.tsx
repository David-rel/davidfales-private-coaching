import { PhotoListItem } from "@/app/types/gallery";

interface PhotoCardProps {
  photo: PhotoListItem;
  onClick: () => void;
}

export default function PhotoCard({ photo, onClick }: PhotoCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative bg-white rounded-2xl shadow-lg border-2 border-emerald-200 overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-200 cursor-pointer group"
    >
      {photo.featured && (
        <div className="absolute left-4 top-4 z-10 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">
          Featured
        </div>
      )}

      <img
        src={photo.image_url}
        alt={photo.alt_text}
        className="w-full h-auto object-cover"
        loading="lazy"
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <p className="text-white text-sm font-medium">{photo.title}</p>
        {photo.category && (
          <p className="text-emerald-200 text-xs mt-1">{photo.category}</p>
        )}
      </div>
    </div>
  );
}
