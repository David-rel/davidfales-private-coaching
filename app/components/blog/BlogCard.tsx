import Link from "next/link";
import { BlogPostListItem } from "@/app/types/blog";

interface BlogCardProps {
  post: BlogPostListItem;
}

export default function BlogCard({ post }: BlogCardProps) {
  const isNew =
    post.published_at &&
    Date.now() - new Date(post.published_at).getTime() <
      14 * 24 * 60 * 60 * 1000;

  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="relative bg-white rounded-2xl shadow-lg border-2 border-emerald-200 overflow-hidden hover:shadow-xl hover:border-emerald-300 transition-all duration-200">
        {isNew && (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">
            New blog — be the first to read
          </div>
        )}
        {post.featured_image_url && (
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        )}

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-emerald-600 transition-colors">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span>{new Date(post.published_at!).toLocaleDateString()}</span>
              <span>·</span>
              <span>{post.author_name}</span>
            </div>

            <div className="flex items-center gap-3">
              <span>👁️ {post.view_count}</span>
              <span>❤️ {post.like_count}</span>
              <span>💬 {post.comment_count}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
