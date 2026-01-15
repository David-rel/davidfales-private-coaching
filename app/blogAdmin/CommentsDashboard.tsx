"use client";

import { useEffect, useState } from "react";

interface AdminComment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string | null;
  content: string;
  approved: boolean;
  created_at: string;
  post_title: string | null;
  post_slug: string | null;
}

interface CommentsDashboardProps {
  postId?: string;
  title?: string;
  showPostColumn?: boolean;
}

export default function CommentsDashboard({
  postId,
  title = "Comments",
  showPostColumn = true,
}: CommentsDashboardProps) {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const url = postId
        ? `/api/blogAdmin/comments?postId=${encodeURIComponent(postId)}`
        : "/api/blogAdmin/comments";
      const res = await fetch(url);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch("/api/blogAdmin/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchComments();
      } else {
        alert("Failed to approve comment");
      }
    } catch (error) {
      console.error("Error approving comment:", error);
      alert("Failed to approve comment");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this comment?")) return;
    try {
      const res = await fetch("/api/blogAdmin/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchComments();
      } else {
        alert("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-600">Loading comments...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="text-sm text-gray-600">Total: {comments.length}</div>
      </div>

      {comments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-200 p-8 text-center">
          <p className="text-gray-600">No comments yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-emerald-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                  Author
                </th>
                {showPostColumn && (
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                    Post
                  </th>
                )}
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr
                  key={comment.id}
                  className="border-t border-gray-200 hover:bg-emerald-50"
                >
                  <td className="px-6 py-4 align-top">
                    <div className="text-gray-900 whitespace-pre-wrap">
                      {comment.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(comment.created_at).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="font-medium text-gray-900">
                      {comment.author_name || "Anonymous"}
                    </div>
                    {comment.author_email && (
                      <div className="text-sm text-gray-600">
                        {comment.author_email}
                      </div>
                    )}
                  </td>
                  {showPostColumn && (
                    <td className="px-6 py-4 align-top">
                      {comment.post_slug ? (
                        <a
                          href={`/blog/${comment.post_slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:text-emerald-800 text-sm font-medium"
                        >
                          {comment.post_title || "View post"}
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">
                          Post not found
                        </span>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4 align-top">
                    {comment.approved ? (
                      <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                        Approved
                      </span>
                    ) : (
                      <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 align-top text-right">
                    <div className="flex justify-end gap-2">
                      {!comment.approved && (
                        <button
                          onClick={() => handleApprove(comment.id)}
                          className="text-emerald-700 hover:text-emerald-800 text-sm font-medium"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(comment.id)}
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
