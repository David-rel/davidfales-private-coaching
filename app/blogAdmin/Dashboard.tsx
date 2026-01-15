"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BlogPost } from "@/app/types/blog";

export default function BlogAdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog/posts?published=false");
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/blog/posts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchPosts();
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  const handleUnpublish = async (id: string, title: string) => {
    if (!confirm(`Unpublish "${title}"? It will be hidden from the blog.`))
      return;

    try {
      const res = await fetch(`/api/blog/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: false }),
      });

      if (res.ok) {
        fetchPosts();
      } else {
        alert("Failed to unpublish post");
      }
    } catch (error) {
      console.error("Error unpublishing post:", error);
      alert("Failed to unpublish post");
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === "published") return post.published;
    if (filter === "drafts") return !post.published;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600">Loading posts...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
        <Link
          href="/blogAdmin/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
        >
          + New Post
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
          All ({posts.length})
        </button>
        <button
          onClick={() => setFilter("published")}
          className={`pb-3 px-4 font-medium transition-colors ${
            filter === "published"
              ? "border-b-2 border-emerald-600 text-emerald-600"
              : "text-gray-600 hover:text-emerald-600"
          }`}
        >
          Published ({posts.filter((p) => p.published).length})
        </button>
        <button
          onClick={() => setFilter("drafts")}
          className={`pb-3 px-4 font-medium transition-colors ${
            filter === "drafts"
              ? "border-b-2 border-emerald-600 text-emerald-600"
              : "text-gray-600 hover:text-emerald-600"
          }`}
        >
          Drafts ({posts.filter((p) => !p.published).length})
        </button>
      </div>

      {/* Posts table */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-200 p-12 text-center">
          <p className="text-gray-600 mb-4">No posts found</p>
          <Link
            href="/blogAdmin/new"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-emerald-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                  Published
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                  Views
                </th>
                <th className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  className="border-t border-gray-200 hover:bg-emerald-50"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {post.title}
                    </div>
                    <div className="text-sm text-gray-600">/{post.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    {post.published ? (
                      <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                        Published
                      </span>
                    ) : (
                      <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {post.view_count}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                        >
                          View
                        </Link>
                      )}
                      {post.published && (
                        <button
                          onClick={() => handleUnpublish(post.id, post.title)}
                          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                        >
                          Unpublish
                        </button>
                      )}
                      <Link
                        href={`/blogAdmin/edit/${post.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
