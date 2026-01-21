"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import { slugify } from "@/app/lib/utils/slugify";
import { BlogPost } from "@/app/types/blog";

interface PostFormProps {
  initialData?: BlogPost;
  isEdit?: boolean;
}

export default function PostForm({
  initialData,
  isEdit = false,
}: PostFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    featured_image_url: initialData?.featured_image_url || "",
    author_name: initialData?.author_name || "David Fales",
    meta_title: initialData?.meta_title || "",
    meta_description: initialData?.meta_description || "",
  });

  const [content, setContent] = useState(initialData?.content || null);
  const [contentHtml, setContentHtml] = useState(
    initialData?.content_html || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSeo, setShowSeo] = useState(false);

  const handleContentChange = (json: any, html: string) => {
    setContent(json);
    setContentHtml(html);
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      // Auto-generate slug only for new posts
      slug: !isEdit ? slugify(title) : prev.slug,
    }));
  };

  const handleSubmit = async (e: FormEvent, publish = false) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        content,
        content_html: contentHtml,
        published: publish,
      };

      const url = isEdit
        ? `/api/blog/posts/${initialData?.id}`
        : "/api/blog/posts";

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/blogAdmin");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save post");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/blog/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        setFormData((prev) => ({ ...prev, featured_image_url: url }));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    }
  };

  return (
    <form className="space-y-6">
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none text-lg"
          placeholder="Enter post title"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          URL Slug *
        </label>
        <div className="flex items-center gap-2">
          <span className="text-gray-900">/blog/</span>
          <input
            id="slug"
            type="text"
            value={formData.slug}
            onChange={(e) =>
              setFormData({ ...formData, slug: slugify(e.target.value) })
            }
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none"
            placeholder="post-url-slug"
            required
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label
          htmlFor="excerpt"
          className="block text-sm font-medium text-gray-900 mb-2"
        >
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) =>
            setFormData({ ...formData, excerpt: e.target.value })
          }
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none"
          rows={3}
          placeholder="Short description for previews"
        />
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Featured Image
        </label>
        {formData.featured_image_url && (
          <img
            src={formData.featured_image_url}
            alt="Featured"
            className="w-full max-w-md h-48 object-cover rounded-lg mb-3"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-900
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-emerald-50 file:text-emerald-700
            hover:file:bg-emerald-100"
        />
      </div>

      {/* Content Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Content *
        </label>
        <RichTextEditor
          initialContent={content}
          onChange={handleContentChange}
        />
      </div>

      {/* SEO Section */}
      <div>
        <button
          type="button"
          onClick={() => setShowSeo(!showSeo)}
          className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-2"
        >
          {showSeo ? "▼" : "▶"} SEO Settings (Optional)
        </button>

        {showSeo && (
          <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label
                htmlFor="meta_title"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Meta Title
              </label>
              <input
                id="meta_title"
                type="text"
                value={formData.meta_title}
                onChange={(e) =>
                  setFormData({ ...formData, meta_title: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none"
                placeholder="Leave blank to use post title"
              />
            </div>
            <div>
              <label
                htmlFor="meta_description"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Meta Description
              </label>
              <textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) =>
                  setFormData({ ...formData, meta_description: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none"
                rows={2}
                placeholder="Leave blank to use excerpt"
              />
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6 border-t border-gray-300">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, false)}
          disabled={isSubmitting || !formData.title || !formData.slug}
          className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Draft"}
        </button>

        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={isSubmitting || !formData.title || !formData.slug}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Publishing..."
            : isEdit && initialData?.published
            ? "Update"
            : "Publish"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
