"use client";

import { useState, useEffect } from "react";

interface LikeButtonProps {
  postId: string;
  initialCount: number;
}

export default function LikeButton({ postId, initialCount }: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has already liked (stored in localStorage)
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    setLiked(likedPosts.includes(postId));
  }, [postId]);

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/blog/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId }),
      });

      if (res.ok) {
        const data = await res.json();
        setLikeCount(data.count);
        setLiked(data.liked);

        // Update localStorage
        const likedPosts = JSON.parse(
          localStorage.getItem("likedPosts") || "[]"
        );
        if (data.liked) {
          localStorage.setItem(
            "likedPosts",
            JSON.stringify([...likedPosts, postId])
          );
        } else {
          localStorage.setItem(
            "likedPosts",
            JSON.stringify(likedPosts.filter((id: string) => id !== postId))
          );
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleLike}
        disabled={isLoading}
        aria-label={liked ? "Unlike this post" : "Like this post"}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all border-2 ${
          liked
            ? "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700"
            : "bg-white border-emerald-600 text-emerald-700 hover:bg-emerald-50"
        } disabled:opacity-50`}
      >
        <span className="text-xl">{liked ? "❤️" : "🤍"}</span>
        <span>{liked ? "Liked" : "Like"}</span>
      </button>
      <span className="px-3 py-2 rounded-full bg-gray-100 text-gray-900 font-semibold">
        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
      </span>
    </div>
  );
}
