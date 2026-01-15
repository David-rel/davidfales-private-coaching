"use client";

import { useState, FormEvent } from "react";
import { Comment } from "@/app/types/blog";

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
}

export default function CommentSection({
  postId,
  initialComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [formData, setFormData] = useState({
    author_name: "",
    author_email: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);

    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          ...formData,
        }),
      });

      if (res.ok) {
        setFormData({ author_name: "", author_email: "", content: "" });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Comments</h2>

      {/* Comment Form */}
      <div className="bg-emerald-50 rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Leave a Comment
        </h3>

        {showSuccess && (
          <div className="bg-emerald-100 border-2 border-emerald-600 text-emerald-800 px-4 py-3 rounded-lg mb-4">
            Comment submitted! It will appear after moderation.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="author_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name (optional)
              </label>
              <input
                id="author_name"
                type="text"
                value={formData.author_name}
                onChange={(e) =>
                  setFormData({ ...formData, author_name: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none"
                placeholder="Anonymous"
              />
            </div>

            <div>
              <label
                htmlFor="author_email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email (optional)
              </label>
              <input
                id="author_email"
                type="email"
                value={formData.author_email}
                onChange={(e) =>
                  setFormData({ ...formData, author_email: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Comment *
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-emerald-600 focus:outline-none"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit Comment"}
          </button>
        </form>
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-lg border-2 border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                  {comment.author_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {comment.author_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
}
