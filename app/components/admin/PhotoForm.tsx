"use client";

import { useState, useRef, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Photo } from "@/app/types/gallery";
import { slugify } from "@/app/lib/utils/slugify";

interface PhotoFormProps {
  photo?: Photo;
  isEdit?: boolean;
}

export default function PhotoForm({ photo, isEdit = false }: PhotoFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState(photo?.title || "");
  const [description, setDescription] = useState(photo?.description || "");
  const [slug, setSlug] = useState(photo?.slug || "");
  const [imageUrl, setImageUrl] = useState(photo?.image_url || "");
  const [altText, setAltText] = useState(photo?.alt_text || "");

  // SEO fields
  const [metaTitle, setMetaTitle] = useState(photo?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(
    photo?.meta_description || ""
  );
  const [keywords, setKeywords] = useState(
    photo?.keywords?.join(", ") || ""
  );

  // Photo metadata
  const [photoDate, setPhotoDate] = useState(
    photo?.photo_date?.split("T")[0] || ""
  );
  const [photographer, setPhotographer] = useState(photo?.photographer || "");
  const [location, setLocation] = useState(photo?.location || "");
  const [category, setCategory] = useState(photo?.category || "");

  // Image properties (auto-filled)
  const [width, setWidth] = useState<number | null>(photo?.width || null);
  const [height, setHeight] = useState<number | null>(photo?.height || null);
  const [fileSize, setFileSize] = useState<number | null>(
    photo?.file_size || null
  );

  // Display options
  const [featured, setFeatured] = useState(photo?.featured || false);
  const [published, setPublished] = useState(photo?.published || false);
  const [displayOrder, setDisplayOrder] = useState(
    photo?.display_order || 0
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugChanged, setSlugChanged] = useState(false);

  // Auto-generate slug when title changes
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    // Auto-fill alt text if empty
    if (!altText) {
      setAltText(newTitle);
    }

    // Auto-generate slug if not manually changed
    if (!slugChanged) {
      setSlug(slugify(newTitle));
    }
  };

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlug(slugify(e.target.value));
    setSlugChanged(true);
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await res.json();
      setImageUrl(data.url);
      setFileSize(file.size);

      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent, publishNow = false) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      // Validation
      if (!title || !imageUrl || !altText || !slug) {
        throw new Error("Please fill in all required fields");
      }

      const data = {
        title,
        description: description || null,
        slug,
        image_url: imageUrl,
        alt_text: altText,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        keywords: keywords
          ? keywords.split(",").map((k) => k.trim()).filter(Boolean)
          : null,
        photo_date: photoDate || null,
        photographer: photographer || null,
        location: location || null,
        category: category || null,
        width,
        height,
        file_size: fileSize,
        featured,
        published: publishNow ? true : published,
        display_order: displayOrder,
      };

      if (isEdit && photo) {
        // Update existing photo
        const res = await fetch(`/api/gallery/photos/${photo.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Failed to update photo");
        }

        router.push("/galleryAdmin");
      } else {
        // Create new photo
        const res = await fetch("/api/gallery/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Failed to create photo");
        }

        router.push("/galleryAdmin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save photo");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="bg-white rounded-2xl shadow-lg border-2 border-emerald-200 p-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Image Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photo <span className="text-red-600">*</span>
        </label>
        {imageUrl ? (
          <div className="relative inline-block">
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-md rounded-lg border-2 border-gray-300"
            />
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Remove
            </button>
            {width && height && (
              <p className="text-sm text-gray-600 mt-2">
                {width} × {height}px
                {fileSize && ` • ${(fileSize / 1024).toFixed(1)}KB`}
              </p>
            )}
          </div>
        ) : (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="mb-6">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Title <span className="text-red-600">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter photo title"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none"
        />
      </div>

      {/* Slug */}
      <div className="mb-6">
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Slug <span className="text-red-600">*</span>
        </label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={handleSlugChange}
          placeholder="photo-slug"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none"
        />
        <p className="text-sm text-gray-500 mt-1">
          URL: /gallery/{slug || "photo-slug"}
        </p>
      </div>

      {/* Alt Text */}
      <div className="mb-6">
        <label
          htmlFor="altText"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Alt Text <span className="text-red-600">*</span>
        </label>
        <input
          id="altText"
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Describe the image for accessibility"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none resize-none"
        />
      </div>

      {/* SEO Section */}
      <div className="mb-6 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          SEO Settings (Optional)
        </h3>

        <div className="mb-4">
          <label
            htmlFor="metaTitle"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Meta Title
          </label>
          <input
            id="metaTitle"
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="SEO title (defaults to photo title)"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="metaDescription"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="SEO description"
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label
            htmlFor="keywords"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Keywords
          </label>
          <input
            id="keywords"
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="soccer, training, skills (comma-separated)"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Photo Metadata Section */}
      <div className="mb-6 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Photo Details (Optional)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="photoDate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Photo Date
            </label>
            <input
              id="photoDate"
              type="date"
              value={photoDate}
              onChange={(e) => setPhotoDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="photographer"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Photographer
            </label>
            <input
              id="photographer"
              type="text"
              value={photographer}
              onChange={(e) => setPhotographer(e.target.value)}
              placeholder="Photo credit"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where was this taken?"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:border-emerald-600 focus:outline-none"
            >
              <option value="">Select category</option>
              <option value="training">Training</option>
              <option value="game">Game</option>
              <option value="team">Team</option>
              <option value="individual">Individual</option>
              <option value="drills">Drills</option>
              <option value="events">Events</option>
            </select>
          </div>
        </div>
      </div>

      {/* Display Options */}
      <div className="mb-6 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Display Options
        </h3>

        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-5 h-5 text-emerald-600 border-2 border-gray-300 rounded focus:ring-emerald-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              Featured photo
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-5 h-5 text-emerald-600 border-2 border-gray-300 rounded focus:ring-emerald-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              Published (visible in gallery)
            </span>
          </label>

          <div>
            <label
              htmlFor="displayOrder"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Display Order
            </label>
            <input
              id="displayOrder"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              Lower numbers appear first
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, false)}
          disabled={isSaving || isUploading}
          className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors"
        >
          {isSaving ? "Saving..." : isEdit ? "Update" : "Save as Draft"}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={isSaving || isUploading}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors"
        >
          {isSaving
            ? "Publishing..."
            : isEdit
            ? "Update & Publish"
            : "Publish Now"}
        </button>
      </div>
    </form>
  );
}
